import { SYSTEM_PROMPT } from "../../lib/core";
import { buildDynamicContext } from "../../lib/context";
import { performWebResearch } from "../../lib/research";
import { checkRateLimit } from "./rateLimit";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.8-27b";

function buildOsmanProfileBlock() {
  const profile = (process.env.OSMAN_PROFILE || "").trim();
  return profile ? `\n\n---\nOSMAN TEMEL PROFİLİ:\n${profile}` : "";
}

function toGroqMessage(message) {
  if (!message || typeof message !== "object") return null;
  if (message.role !== "user" && message.role !== "assistant") return null;
  return {
    role: message.role,
    content: String(message.content || ""),
  };
}

export async function GET() {
  return Response.json({
    groqKeyPresent: Boolean(process.env.GROQ_API_KEY),
    model: GROQ_MODEL,
  });
}

export async function POST(request) {
  const limit = await checkRateLimit(request);
  if (!limit.allowed) {
    return Response.json(
      { error: `Çok fazla mesaj gönderildi. Lütfen ${limit.retryAfterSeconds} saniye sonra tekrar dene.` },
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
    return Response.json({ error: "Geçersiz JSON isteği." }, { status: 400 });
  }

  const history = Array.isArray(body?.messages) ? body.messages : [];
  const context = buildDynamicContext(body?.context || {});
  const lastUserMessage =
    [...history].reverse().find((message) => message?.role === "user")?.content || "";

  let researchBlock = "";
  const needsResearch =
    /araştır|güncel|youtube|niş|talep|rekabet|başarılı video|fırsat|para kazan|pazar|rakip/i.test(
      String(lastUserMessage)
    );

  if (needsResearch) {
    const research = await performWebResearch(String(lastUserMessage).slice(0, 300));

    if (research.ok && research.results?.length) {
      researchBlock =
        "\n\n--- GÜNCEL ARAŞTIRMA KANITI ---\n" +
        `Kaynak: ${research.source}\nSorgu: ${research.query}\n` +
        research.results
          .map((item, index) => `${index + 1}. ${item.title} — ${item.snippet} — ${item.url}`)
          .join("\n") +
        "\n--- KANIT SONU ---";
    } else {
      researchBlock =
        "\n\n--- ARAŞTIRMA DURUMU ---\n" +
        "Güncel araştırma başarısız veya sonuçsuz. Kanıtsız pazar/niş iddiası üretme." +
        "\n--- DURUM SONU ---";
    }
  }

  const compactSystemPrompt = String(SYSTEM_PROMPT).slice(0, 4500);
  const compactContext = String(context || "").slice(0, 800);
  const compactResearch = String(researchBlock || "").slice(0, 2200);

  const messages = [
    {
      role: "system",
      content:
        compactSystemPrompt +
        buildOsmanProfileBlock().slice(0, 600) +
        (compactContext ? `\n\n---\nOsman hakkında bilinenler:\n${compactContext}` : "") +
        compactResearch,
    },
    ...history.slice(-2).map(toGroqMessage).filter(Boolean),
  ];

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.6,
        max_completion_tokens: 512,
        reasoning_effort: GROQ_MODEL === "qwen/qwen3.8-27b" ? "none" : "low",
        stream: false,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("GROQ_API_ERROR", response.status, detail);
      return Response.json(
        {
          error: `Groq HTTP ${response.status}: ${detail.slice(0, 2000)}`,
          groqStatus: response.status,
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("CHAT_ROUTE_FAILED", error);
    return Response.json(
      { error: `Sunucu sohbet hatası: ${error?.message || "bilinmeyen hata"}` },
      { status: 502 }
    );
  }
}
