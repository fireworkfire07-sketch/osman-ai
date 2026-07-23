const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

const SYSTEM_PROMPT =
  "Sen OSMAN AI'sın. Osman'ın kişisel dijital çalışma asistanısın. " +
  "Türkçe, açık, doğrudan ve uygulanabilir cevaplar verirsin. Gereksiz uzun açıklamalar yapmazsın. " +
  "Bilmediğin bir şeyi biliyormuş gibi davranmazsın.";

export async function GET() {
  return Response.json({ groqKeyPresent: Boolean(process.env.GROQ_API_KEY) });
}

export async function POST(request) {
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
  const chatMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: String(m.content || "") })),
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
        messages: chatMessages,
      }),
    });

    if (!groqRes.ok) {
      const detail = await groqRes.text();
      console.error("GROQ_API_ERROR", groqRes.status, detail);
      return Response.json(
        { error: "AI servisinden cevap alınamadı. Lütfen birazdan tekrar dene." },
        { status: 502 }
      );
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return Response.json({ error: "AI boş cevap döndürdü. Lütfen tekrar dene." }, { status: 502 });
    }

    return Response.json({ reply });
  } catch (err) {
    console.error("GROQ_REQUEST_FAILED", err);
    return Response.json(
      { error: "AI servisine bağlanılamadı. İnternet bağlantını ve GROQ anahtarını kontrol et." },
      { status: 502 }
    );
  }
}
