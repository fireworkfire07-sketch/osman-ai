// scripts/agent.mjs
// Osman'ın dijital ikizi — v0 otonom döngü.
// Sen yokken GitHub Actions'ta çalışır, Groq (ücretsiz) ile düşünür,
// kendi hafızasına (brain/memory.json) araç çağırarak yazar, sonra commit'lenir.
// SIFIR bağımlılık: Node 20+ yerleşik fetch. Ücretli hiçbir servis, kredi kartı yok.

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MEM_PATH = path.join(ROOT, "brain", "memory.json");

// --- Ayarlar (hepsi env'den, boşsa güvenli varsayılan) ---
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const VARSAYILAN_HEDEF =
  "Osman'ın YouTube nişi için bugün denenebilecek TEK bir güçlü hook fikri üret; " +
  "kısa gerekçesiyle birlikte hafızana 'sonraki_adim' olarak yaz.";
const HEDEF = (process.env.HEDEF || "").trim() || VARSAYILAN_HEDEF;
const dryRun = ["1", "true", "yes"].includes((process.env.DRY_RUN || "0").toLowerCase());
const maxIter = parseInt(process.env.MAX_ITER || "5", 10) || 5;

// --- Hafıza: repodaki JSON = ücretsiz, kalıcı, versiyonlu veritabanı ---
function hafizaOku() {
  try {
    return JSON.parse(fs.readFileSync(MEM_PATH, "utf8"));
  } catch {
    return {
      profil:
        "Osman — Antalyalı girişimci; faceless YouTube otomasyonu, otel/turizm fotoğrafçılığı, AI otomasyonu.",
      kayitlar: [],
    };
  }
}
function hafizaKaydet(mem) {
  fs.mkdirSync(path.dirname(MEM_PATH), { recursive: true });
  fs.writeFileSync(MEM_PATH, JSON.stringify(mem, null, 2) + "\n", "utf8");
}

// --- İkizin elindeki araç: kendi hafızasına yazmak (A2'nin çekirdeği) ---
const araclar = [
  {
    type: "function",
    function: {
      name: "hafizaya_yaz",
      description:
        "Ürettiğin değerli sonucu Osman'ın kalıcı hafızasına yaz. Fikir, karar, araştırma sonucu " +
        "veya sonraki adım ürettiğinde MUTLAKA bu aracı çağır.",
      parameters: {
        type: "object",
        properties: {
          tur: {
            type: "string",
            enum: ["fikir", "karar", "arastirma", "not", "sonraki_adim"],
            description: "Kaydın türü",
          },
          baslik: { type: "string", description: "Kısa başlık" },
          icerik: { type: "string", description: "Kaydın tam içeriği / gerekçesi" },
        },
        required: ["tur", "baslik", "icerik"],
      },
    },
  },
];

function aracCalistir(mem, isim, argStr) {
  if (isim !== "hafizaya_yaz") return { ok: false, hata: "bilinmeyen araç" };
  let a;
  try {
    a = JSON.parse(argStr || "{}");
  } catch {
    return { ok: false, hata: "argüman JSON değil" };
  }
  const kayit = {
    tarih: new Date().toISOString(),
    tur: a.tur || "not",
    baslik: a.baslik || "(başlıksız)",
    icerik: a.icerik || "",
  };
  mem.kayitlar.push(kayit);
  return { ok: true, yazilan: kayit.baslik, toplam_kayit: mem.kayitlar.length };
}

// --- Groq çağrısı (OpenAI uyumlu). DRY_RUN'da API'ye gitmeden mock döner. ---
async function modelCagir(messages) {
  if (dryRun) return mockCevap();
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      tools: araclar,
      tool_choice: "auto",
      temperature: 0.7,
    }),
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Groq ${r.status}: ${t.slice(0, 400)}`);
  }
  const data = await r.json();
  return data.choices[0].message;
}

// DRY_RUN: önce bir araç çağrısı, sonra bitiş — yazma yolunu ve döngü sonlanmasını kanıtlar.
let mockAdim = 0;
function mockCevap() {
  mockAdim++;
  if (mockAdim === 1) {
    return {
      role: "assistant",
      content: null,
      tool_calls: [
        {
          id: "mock_1",
          type: "function",
          function: {
            name: "hafizaya_yaz",
            arguments: JSON.stringify({
              tur: "sonraki_adim",
              baslik: "[DRY_RUN] Test hook fikri",
              icerik:
                "Kuru çalışma kaydı — sen yokken döngü çalışıyor ve ikiz kendi hafızasına yazabiliyor.",
            }),
          },
        },
      ],
    };
  }
  return { role: "assistant", content: "[DRY_RUN] Hafızaya yazdım, döngü tamam." };
}

// --- Ana döngü ---
async function main() {
  if (!dryRun && !GROQ_API_KEY) {
    console.error("HATA: GROQ_API_KEY yok. Ücretsiz test için: DRY_RUN=1 node scripts/agent.mjs");
    process.exit(1);
  }

  const mem = hafizaOku();
  const sonKayitlar = mem.kayitlar.slice(-15);

  const sistem =
    `Sen Osman'ın dijital ikizisin. Onun adına düşünür ve üretirsin. ` +
    `Elinde 'hafizaya_yaz' aracı var; ürettiğin değerli sonucu (özellikle sonraki adım / fikir / karar) ` +
    `MUTLAKA bu araçla hafızana yaz, sonra 1-2 cümlelik özet ver. Türkçe, net, demagoji yok.\n\n` +
    `OSMAN PROFİLİ: ${mem.profil}\n\n` +
    `SON HAFIZA KAYITLARI:\n` +
    (sonKayitlar.length
      ? sonKayitlar.map((k) => `- [${k.tur}] ${k.baslik}: ${k.icerik}`).join("\n")
      : "(henüz kayıt yok)");

  const messages = [
    { role: "system", content: sistem },
    { role: "user", content: `Bugünün hedefi: ${HEDEF}` },
  ];

  let sonMetin = "";
  for (let i = 0; i < maxIter; i++) {
    const msg = await modelCagir(messages);
    messages.push(msg);

    if (msg.tool_calls && msg.tool_calls.length) {
      for (const tc of msg.tool_calls) {
        const sonuc = aracCalistir(mem, tc.function.name, tc.function.arguments);
        console.log(`  -> arac: ${tc.function.name} -> ${JSON.stringify(sonuc)}`);
        messages.push({
          role: "tool",
          tool_call_id: tc.id,
          name: tc.function.name,
          content: JSON.stringify(sonuc),
        });
      }
      continue; // araç sonucuyla tekrar modele dön
    }

    sonMetin = msg.content || "";
    break; // araç çağrısı yoksa iş bitti
  }

  hafizaKaydet(mem);

  console.log("\n=== IKIZ OZETI ===");
  console.log(sonMetin || "(model metin dondurmedi)");
  console.log(`\nToplam hafiza kaydi: ${mem.kayitlar.length}`);
}

main().catch((e) => {
  console.error("Ikiz hatasi:", e.message);
  process.exit(1);
});
