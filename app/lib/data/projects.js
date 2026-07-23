import { createCollection } from "./collection";
import { STORAGE_KEYS } from "./keys";
import { today } from "./storage";

function seed() {
  const day = today();
  return [
    {
      id: "osman-ai",
      ad: "OSMAN AI",
      amac: "Osman'ın kişisel dijital zekâsı ve çalışma ortağı",
      aciklama: "Next.js + GROQ tabanlı, ücretsiz çalışan kişisel AI çekirdeği",
      durum: "V2–V5 katmanları uygulanıyor",
      oncelik: "Yüksek",
      teknoloji: "Next.js, GROQ API, Vercel",
      repo: "fireworkfire07-sketch/osman-ai",
      vercelProjesi: "",
      sonYapilanIslem:
        "Profil, kişisel hafıza, proje/karar/görev sistemleri, gelecek araştırma ve stratejik protokol katmanları eklendi",
      calisanOzellikler: "Sohbet, GROQ bağlantısı, profil, projeler, kararlar, görevler",
      calismayanOzellikler: "Cihazlar arası senkron yok",
      hatalar: "",
      sonrakiAdim: "Vercel'e deploy edip GROQ_API_KEY environment variable'ını eklemek",
      createdAt: day,
      updatedAt: day,
    },
  ];
}

export const projectsCollection = createCollection(STORAGE_KEYS.projects, { seed });

export const PROJECT_FIELDS = [
  { key: "ad", label: "Proje adı", type: "text" },
  { key: "amac", label: "Amaç", type: "textarea" },
  { key: "aciklama", label: "Açıklama", type: "textarea" },
  { key: "durum", label: "Mevcut durum", type: "text" },
  {
    key: "oncelik",
    label: "Öncelik",
    type: "select",
    options: [
      { value: "Yüksek", label: "Yüksek" },
      { value: "Orta", label: "Orta" },
      { value: "Düşük", label: "Düşük" },
    ],
  },
  { key: "teknoloji", label: "Kullanılan teknoloji", type: "text" },
  { key: "repo", label: "GitHub reposu", type: "text" },
  { key: "vercelProjesi", label: "Vercel projesi", type: "text" },
  { key: "sonYapilanIslem", label: "Son yapılan işlem", type: "textarea" },
  { key: "calisanOzellikler", label: "Çalışan özellikler", type: "textarea" },
  { key: "calismayanOzellikler", label: "Çalışmayan özellikler", type: "textarea" },
  { key: "hatalar", label: "Karşılaşılan hatalar", type: "textarea" },
  { key: "sonrakiAdim", label: "Sonraki adım", type: "textarea" },
];
