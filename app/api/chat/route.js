import { SYSTEM_PROMPT } from "../../lib/core";
import { performWebResearch } from "../../lib/research";
import { buildDynamicContext } from "../../lib/context";
import { checkRateLimit, getClientIp } from "./rateLimit";
import { isRepositoryRequest, buildRepositoryEvidence } from "../../lib/tools/toolRouter";
import { extractClaimedPaths, validateClaimedPaths, validateLineRanges } from "../../lib/grounding/validateClaims";
import { performWebResearch } from "../../lib/research";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const REPOSITORY_ACCESS_FAILED_MESSAGE =
  "Repository'ye erişemedim. Bu nedenle herhangi bir dosya, fonksiyon veya satır iddiasında bulunamam.";
const REPOSITORY_UNVERIFIED_CLAIM_MESSAGE = "Bu teknik iddiayı repository kanıtıyla doğrulayamadım.";
const ALLOWED_REPO_LABEL = "fireworkfire07-sketch/osman-ai";

const TOOL_SYSTEM_PROMPT = `Sen OSMAN AI'sin. Türkçe, kısa ve doğrudan cevap ver. Yapmadığın işi yapılmış gibi gösterme; kanıt yoksa varsayım olarak belirt.

GÜNCEL ARAŞTIRMA ZORUNLULUĞU:
- Kullanıcı güncel pazar, YouTube nişi, talep, rekabet, başarılı video, para fırsatı veya benzeri güncel veri istiyorsa önce web_arastir aracını kullan.
- web_arastir sonucunda researchStatus="success" ve results dolu değilse araştırma BAŞARISIZ/SONUÇSUZ kabul edilir.
- researchStatus="research_failed", researchStatus="no_results", ok=false veya results boşsa hiçbir niş, pazar, anahtar kelime, CPM/RPM değeri, başarı metriği, rakam, örnek veya test eşiği UYDURMA.
- Böyle bir durumda öneri üretme ve "mantıklı olur", "yüksek CPM", "düşük rekabet" gibi araştırma gerektiren çıkarımlar yapma.
- Böyle bir durumda tam olarak şu karar formatını kullan: "KANIT: Güncel araştırma başarısız veya sonuçsuz.\nÇIKARIM: Güvenilir güncel pazar verisi yok.\nKARAR: ARAŞTIRMA BAŞARISIZ\nNİŞ SEÇİMİ: HENÜZ YAPILMADI".
- Araç sonucu açıkça vermediyse kaç deneme yapıldığını, hangi kaynağın cevap vermediğini veya herhangi bir sayısal metriği iddia etme.
- Kullanıcının istemediği eski tarihli sorgular veya veriler ekleme; özellikle 2024 gibi geçmiş yılları kendiliğinden kullanma.
- Araştırma başarılıysa sonuçları KANIT / ÇIKARIM / HİPOTEZ diye ayır ve yalnızca sonuçların desteklediği iddiaları kullan.

GENEL:
Kullanıcı soru sormadan ilerlemeni istiyorsa izin isteme. En küçük ölçülebilir testi öner.`;

export async function GET() {
  return Response.json({
    groqKeyPresent: Boolean(process.env.GROQ_API_KEY),
    githubTokenPresent: Boolean(process.env.GITHUB_TOKEN),
    osmanProfilePresent: Boolean(process.env.OSMAN_PROFILE),
  });
}

// OSMAN_PROFILE, localStorage'dan gelen (cihaza bağlı) dinamik bağlamdan
// FARKLI: Vercel Environment Variables'da tutulan, her istekte HER ZAMAN
// dahil edilen, cihazdan bağımsız kalıcı bir temel kimlik metnidir. Boşsa
// hiçbir şey eklenmez, mevcut davranış aynı kalır. Değeri asla loglanmaz.
function buildOsmanProfileBlock() {
  const profile = (process.env.OSMAN_PROFILE || "").trim();
  if (!profile) return "";
  return `\n\n---\nOSMAN TEMEL PROFİLİ (kalıcı, cihazdan bağımsız):\n${profile}`;
}

function streamGroqTokens(groqRes) {
  const reader = groqRes.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  return new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(payload);
              const token = json?.choices?.[0]?.delta?.content;
              if (token) controller.enqueue(encoder.encode(token));
            } catch {
              // Bozuk/yarım satır — yok say, akış devam etsin.
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}

async function readStreamToString(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
  }
  return text;
}

// Tarayıcıdan gelen mesajları Groq'un beklediği şekle çevirir. Normal
// user/assistant mesajlarının yanı sıra araç çağırma döngüsünün ürettiği
// assistant(tool_calls) ve tool mesajlarını da olduğu gibi geçirir —
// bunlar olmadan Groq çok turlu araç çağırmayı takip edemez.
function toGroqMessage(m) {
  if (!m || typeof m !== "object") return null;
  if (m.role === "tool") {
    return { role: "tool", tool_call_id: m.tool_call_id, content: String(m.content ?? "") };
  }
  if (m.role === "assistant" && Array.isArray(m.tool_calls) && m.tool_calls.length > 0) {
    return { role: "assistant", content: m.content ?? null, tool_calls: m.tool_calls };
  }
  if (m.role === "user" || m.role === "assistant") {
    return { role: m.role, content: String(m.content || "") };
  }
  return null;
}

export async function POST(request) {
  const rateLimit = await checkRateLimit(request);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: `Çok fazla mesaj gönderildi. Lütfen ${rateLimit.retryAfterSeconds} saniye sonra tekrar dene.` },
      { status: 429 }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "GROQ_API_KEY sunucuda tanımlı değil." }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const history = Array.isArray(body?.messages) ? body.messages : [];
  const dynamicContext = buildDynamicContext(body?.context || {});
  const systemContent =
    SYSTEM_PROMPT +
    buildOsmanProfileBlock() +
    (dynamicContext ? `\n\n---\nOsman hakkında bilinenler:\n${dynamicContext}` : "");

  const lastUserMessage = [...history].reverse().find((m) => m?.role === "user")?.content || "";
  const needsResearch = /araştır|güncel|youtube|niş|talep|rekabet|başarılı video|fırsat|para kazan|pazar|rakip/i.test(lastUserMessage);
  let researchBlock = "";

  if (needsResearch) {
    const research = await performWebResearch(String(lastUserMessage).slice(0, 300));
    if (research?.ok && research?.results?.length) {
      researchBlock = `\n\n--- GÜNCEL ARAŞTIRMA KANITI ---\nKaynak: ${research.source}\nSorgu: ${research.query}\n${research.results.map((x, i) => `${i + 1}. ${x.title} — ${x.snippet} — ${x.url}`).join("\n")}\n--- KANIT SONU ---`;
    } else {
      researchBlock = "\n\n--- ARAŞTIRMA DURUMU ---\nGüncel araştırma başarısız/sonuçsuz. Kanıtsız pazar veya niş iddiası üretme.\n--- DURUM SONU ---";
    }
  }

  const messages = [
    { role: "system", content: systemContent + researchBlock },
    ...history.slice(-8).map(toGroqMessage).filter(Boolean),
  ];

  try {
    const groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.6,
        stream: false,
        messages,
        max_completion_tokens: 512,
        reasoning_effort: "low",
      }),
    });

    if (!groqRes.ok) {
      const detail = await groqRes.text();
      console.error("GROQ_API_ERROR", groqRes.status, detail);
      return Response.json(
        { error: `Groq HTTP ${groqRes.status}: ${detail.slice(0, 2000)}`, groqStatus: groqRes.status },
        { status: 502 }
      );
    }

    return Response.json(await groqRes.json());
  } catch (err) {
    console.error("CHAT_ROUTE_FAILED", err);
    return Response.json(
      { error: `Sunucu sohbet hatası: ${err?.message || "bilinmeyen hata"}` },
      { status: 502 }
    );
  }
}
