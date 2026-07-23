import { SYSTEM_PROMPT } from "../../lib/core";
import { buildDynamicContext } from "../../lib/context";
import { checkRateLimit, getClientIp } from "./rateLimit";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export async function GET() {
  return Response.json({ groqKeyPresent: Boolean(process.env.GROQ_API_KEY) });
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
  const dynamicContext = buildDynamicContext(body?.context || {});

  const systemContent = dynamicContext
    ? `${SYSTEM_PROMPT}\n\n---\nOsman hakkında bilinenler (yalnızca ilgiliyse kullan):\n${dynamicContext}`
    : SYSTEM_PROMPT;

  const chatMessages = [
    { role: "system", content: systemContent },
    ...history
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: String(m.content || "") })),
  ];

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
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
