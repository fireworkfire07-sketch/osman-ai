import test from "node:test";
import assert from "node:assert/strict";
import { _resetRateLimitState } from "../app/api/chat/rateLimit.js";
import { POST } from "../app/api/chat/route.js";

const ENV_KEYS = ["GROQ_API_KEY", "GITHUB_TOKEN", "OSMAN_PROFILE"];
const ORIGINAL_ENV = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

function restoreEnv() {
  for (const key of ENV_KEYS) {
    if (ORIGINAL_ENV[key] === undefined) delete process.env[key];
    else process.env[key] = ORIGINAL_ENV[key];
  }
}

function toolCallRequest() {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "merhaba" }],
      araclar: [
        {
          type: "function",
          function: { name: "dummy_tool", description: "test", parameters: { type: "object", properties: {} } },
        },
      ],
    }),
  });
}

async function runPostAndCaptureGroqBody() {
  const originalFetch = global.fetch;
  let capturedBody = null;
  global.fetch = async (url, options) => {
    capturedBody = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      text: async () => "",
      json: async () => ({ choices: [{ message: { content: "test cevap" } }] }),
    };
  };
  try {
    await POST(toolCallRequest());
  } finally {
    global.fetch = originalFetch;
  }
  return capturedBody;
}

test("route.js: OSMAN_PROFILE set edildiğinde sistem mesajına dahil edilir", async () => {
  _resetRateLimitState();
  process.env.GROQ_API_KEY = "test-key";
  delete process.env.GITHUB_TOKEN;
  process.env.OSMAN_PROFILE = "TEST-PROFIL-METNI-benzersiz-1234";

  try {
    const body = await runPostAndCaptureGroqBody();
    const systemMessage = body.messages.find((m) => m.role === "system");
    assert.ok(systemMessage, "sistem mesajı bulunamadı");
    assert.ok(
      systemMessage.content.includes("OSMAN TEMEL PROFİLİ"),
      "sistem mesajında OSMAN TEMEL PROFİLİ başlığı yok"
    );
    assert.ok(
      systemMessage.content.includes("TEST-PROFIL-METNI-benzersiz-1234"),
      "sistem mesajında profil metni geçmiyor"
    );
  } finally {
    restoreEnv();
  }
});

test("route.js: OSMAN_PROFILE boşsa sistem mesajına hiçbir şey eklenmez", async () => {
  _resetRateLimitState();
  process.env.GROQ_API_KEY = "test-key";
  delete process.env.GITHUB_TOKEN;
  delete process.env.OSMAN_PROFILE;

  try {
    const body = await runPostAndCaptureGroqBody();
    const systemMessage = body.messages.find((m) => m.role === "system");
    assert.ok(systemMessage);
    assert.ok(!systemMessage.content.includes("OSMAN TEMEL PROFİLİ"));
  } finally {
    restoreEnv();
  }
});
