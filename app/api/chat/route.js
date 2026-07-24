import { SYSTEM_PROMPT } from "../../lib/core";
import { buildDynamicContext } from "../../lib/context";
import { checkRateLimit, getClientIp } from "./rateLimit";
import { isRepositoryRequest, buildRepositoryEvidence } from "../../lib/tools/toolRouter";
import { extractClaimedPaths, validateClaimedPaths, validateLineRanges } from "../../lib/grounding/validateClaims";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const REPOSITORY_ACCESS_FAILED_MESSAGE =
  "Repository'ye erişemedim. Bu nedenle herhangi bir dosya, fonksiyon veya satır iddiasında bulunamam.";
const REPOSITORY_UNVERIFIED_CLAIM_MESSAGE = "Bu teknik iddiayı repository kanıtıyla doğrulayamadım.";
const ALLOWED_REPO_LABEL = "fireworkfire07-sketch/osman-ai";

export async function GET() {
  return Response.json({
    groqKeyPresent: Boolean(process.env.GROQ_API_KEY),
    githubTokenPresent: Boolean(process.env.GITHUB_TOKEN),
  });
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
  // Oran sınırlaması, GROQ anahtarının varlığından bile önce kontrol edilir:
  // amaç yalnızca gerçek GROQ isteklerini değil, bu endpoint'e yapılan her
  // türlü kötüye kullanımı erken reddetmektir.
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return Response.json(
      {
        error: `Çok fazla mesaj gönderildi. Ücretsiz AI kotasını korumak için lütfen ${rateLimit.retryAfterSeconds} saniye sonra tekrar dene.`,
      },
      { status: 429 }
    );
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "AI anahtarı sunucuda tanımlı değil. Vercel Environment Variables içine GROQ_API_KEY eklenmeli." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const history = Array.isArray(body?.messages) ? body.messages : [];
  const araclar = Array.isArray(body?.araclar) && body.araclar.length > 0 ? body.araclar : null;
  const dynamicContext = buildDynamicContext(body?.context || {});
  const lastUserMessage = [...history].reverse().find((m) => m.role === "user")?.content || "";

  // Repository ile ilgili bir istek mi? Öyleyse gerçek GitHub API kanıtı
  // (repo allowlist: yalnızca fireworkfire07-sketch/osman-ai) toplanır ve
  // modele KESİN kurallarla birlikte verilir; kanıt yoksa model hiçbir
  // dosya/satır iddiasında bulunamayacağını açıkça bilir (bkz. aşağıdaki
  // server-side doğrulama — halüsinasyon kilidi).
  const repoRequested = isRepositoryRequest(lastUserMessage);
  let repoEvidence = null;
  let repoAccessFailed = false;

  if (repoRequested) {
    if (!process.env.GITHUB_TOKEN) {
      repoAccessFailed = true;
    } else {
      try {
        repoEvidence = await buildRepositoryEvidence(lastUserMessage);
      } catch (err) {
        console.error("GITHUB_REPO_ACCESS_FAILED", err?.message);
        repoAccessFailed = true;
      }
    }
  }

  let repositoryBlock = "";
  if (repoRequested) {
    repositoryBlock = repoAccessFailed
      ? `\n\n---\nREPOSITORY ARACI ÇALIŞTIRILAMADI: Repository'ye erişemedim. Bu nedenle hiçbir dosya adı, satır numarası, fonksiyon veya teknik borç/güvenlik açığı uydurma; yalnızca "Repository'ye erişemedim" de.`
      : `\n\n---\nREPOSITORY KANITI (gerçek GitHub API sonucu, ${ALLOWED_REPO_LABEL}, commit ${repoEvidence.commitShortSha || "bilinmiyor"}):\n${repoEvidence.evidenceText || "(ilgili dosya bulunamadı)"}\n\nKESİN KURALLAR:\n- Yalnızca yukarıdaki [SOURCE n] bloklarında verilen dosya yolunu ve satırları kullan.\n- Yukarıda verilmeyen hiçbir dosya adını, satır numarasını veya fonksiyonu söyleme.\n- Dosyanın yaşını veya geçmişini commit verisi olmadan tahmin etme.\n- "Kodda gördüm", "dosyaları inceledim" veya "kanıtladım" ifadelerini yalnızca yukarıdaki gerçek kanıt varsa kullan.\n- Her teknik iddiadan sonra "Kanıt: <dosya yolu>:<satırlar>" ekle.\n- Yetersiz kanıt varsa "Doğrulanamadı" de.`;
  }

  const systemContent =
    (dynamicContext
      ? `${SYSTEM_PROMPT}\n\n---\nOsman hakkında bilinenler (yalnızca ilgiliyse kullan):\n${dynamicContext}`
      : SYSTEM_PROMPT) + repositoryBlock;

  const chatMessages = [{ role: "system", content: systemContent }, ...history.map(toGroqMessage).filter(Boolean)];

  // Araç çağırma turu (A2, yapım emri Bölüm 2a): route.js ince proxy olarak
  // kalır — Groq'a "tools" iletir, ham cevabı (tool_calls dahil) aynen
  // döndürür. Hiçbir aracı burada ÇALIŞTIRMAZ; döngü tarayıcıda kurulu.
  // Repository kanıt doğrulaması (halüsinasyon kilidi) burada da uygulanır,
  // çünkü ChatPanel artık her mesajda "araclar" gönderiyor ve akan
  // (streaming) yol aşağıda repository istekleri için artık kullanılmıyor.
  if (araclar) {
    let toolGroqRes;
    try {
      toolGroqRes = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: 0.6,
          stream: false,
          messages: chatMessages,
          tools: araclar,
          tool_choice: "auto",
        }),
      });
    } catch (err) {
      console.error("GROQ_REQUEST_FAILED", err);
      return Response.json(
        { error: "AI servisine bağlanılamadı. İnternet bağlantını ve GROQ anahtarını kontrol et." },
        { status: 502 }
      );
    }

    if (!toolGroqRes.ok) {
      const detail = await toolGroqRes.text();
      console.error("GROQ_API_ERROR", toolGroqRes.status, detail);
      return Response.json(
        { error: "AI servisinden cevap alınamadı. Lütfen birazdan tekrar dene." },
        { status: 502 }
      );
    }

    const data = await toolGroqRes.json();
    const mesaj = data?.choices?.[0]?.message;

    if (repoRequested && mesaj && typeof mesaj.content === "string" && mesaj.content) {
      if (repoAccessFailed) {
        const claims = extractClaimedPaths(mesaj.content);
        if (claims.length > 0) mesaj.content = REPOSITORY_ACCESS_FAILED_MESSAGE;
      } else if (repoEvidence) {
        const claims = extractClaimedPaths(mesaj.content);
        const { invalid: invalidPaths } = validateClaimedPaths(claims, repoEvidence.tree);
        const invalidLines = validateLineRanges(claims, repoEvidence.sources);

        if (invalidPaths.length > 0 || invalidLines.length > 0) {
          mesaj.content = REPOSITORY_UNVERIFIED_CLAIM_MESSAGE;
        } else if (repoEvidence.sources.length > 0) {
          const sourceLines = repoEvidence.sources.map((s) => `- ${s.path}:${s.lines}`).join("\n");
          mesaj.content += `\n\nKullanılan kaynaklar:\n${sourceLines}${
            repoEvidence.commitShortSha ? `\nCommit: ${repoEvidence.commitShortSha}` : ""
          }`;
        }
      }
    }

    return Response.json(data);
  }

  let groqRes;
  try {
    groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.6,
        stream: true,
        messages: chatMessages,
      }),
    });
  } catch (err) {
    console.error("GROQ_REQUEST_FAILED", err);
    return Response.json(
      { error: "AI servisine bağlanılamadı. İnternet bağlantını ve GROQ anahtarını kontrol et." },
      { status: 502 }
    );
  }

  if (!groqRes.ok) {
    const detail = await groqRes.text();
    console.error("GROQ_API_ERROR", groqRes.status, detail);
    return Response.json(
      { error: "AI servisinden cevap alınamadı. Lütfen birazdan tekrar dene." },
      { status: 502 }
    );
  }

  const stream = streamGroqTokens(groqRes);

  if (!repoRequested) {
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  }

  // Repository ile ilgili istekler için cevap ÖNCE tamamen toplanır, gerçek
  // repository ağacı/kanıtıyla doğrulanır, yalnızca doğrulama geçerse (veya
  // hiç teknik iddia içermiyorsa) kullanıcıya gönderilir. Bu, akış sırasında
  // doğrulanamayan bir dosya/satır iddiasının kullanıcıya ulaşmasını engeller.
  let finalText = await readStreamToString(stream);

  if (repoAccessFailed) {
    const claims = extractClaimedPaths(finalText);
    if (claims.length > 0) {
      finalText = REPOSITORY_ACCESS_FAILED_MESSAGE;
    }
  } else if (repoEvidence) {
    const claims = extractClaimedPaths(finalText);
    const { invalid: invalidPaths } = validateClaimedPaths(claims, repoEvidence.tree);
    const invalidLines = validateLineRanges(claims, repoEvidence.sources);

    if (invalidPaths.length > 0 || invalidLines.length > 0) {
      finalText = REPOSITORY_UNVERIFIED_CLAIM_MESSAGE;
    } else if (repoEvidence.sources.length > 0) {
      const sourceLines = repoEvidence.sources.map((s) => `- ${s.path}:${s.lines}`).join("\n");
      finalText += `\n\nKullanılan kaynaklar:\n${sourceLines}${
        repoEvidence.commitShortSha ? `\nCommit: ${repoEvidence.commitShortSha}` : ""
      }`;
    }
  }

  return new Response(finalText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
