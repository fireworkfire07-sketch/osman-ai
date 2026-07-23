import { createCollection } from "./collection";
import { STORAGE_KEYS } from "./keys";
import { today } from "./storage";
import { PRIORITY_OPTIONS } from "./options";

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
      gucluYonler:
        "Ücretsiz çalışıyor (GROQ + Vercel), tek repo içinde katmanlı ve tekrarsız mimari (paylaşılan CRUD fabrikası, tek sistem promptu), API anahtarı hiç frontend'e çıkmıyor",
      zayifYonler:
        "Hafıza yalnızca tek cihazda (localStorage) tutuluyor, cihazlar arası senkron yok; otomatik test paketi repoya commit edilmedi",
      riskler:
        "GROQ ücretsiz kotası aşılırsa sohbet geçici olarak çalışmaz; gerçek kullanıcı verisiyle henüz uzun süreli test edilmedi",
      teknikBorc: "Playwright gibi bir test çerçevesi repoya eklenmedi, testler her sprintte elle çalıştırılıyor",
      sonrakiOneri:
        "Cihazlar arası senkron gerekiyorsa ücretsiz bir veritabanı (Supabase) değerlendirilmeli; otomatik test paketi eklenmesi düşünülmeli",
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
  { key: "oncelik", label: "Öncelik", type: "select", options: PRIORITY_OPTIONS },
  { key: "teknoloji", label: "Kullanılan teknoloji", type: "text" },
  { key: "repo", label: "GitHub reposu", type: "text" },
  { key: "vercelProjesi", label: "Vercel projesi", type: "text" },
  { key: "sonYapilanIslem", label: "Son yapılan işlem", type: "textarea" },
  { key: "calisanOzellikler", label: "Çalışan özellikler", type: "textarea" },
  { key: "calismayanOzellikler", label: "Çalışmayan özellikler", type: "textarea" },
  { key: "hatalar", label: "Karşılaşılan hatalar", type: "textarea" },
  { key: "sonrakiAdim", label: "Sonraki adım", type: "textarea" },
];

// Project Analyzer (V4): her proje için ayrı bir analiz sistemi kurmak yerine
// aynı proje kaydına eklenen dört alan — mevcut CRUD'u genişletir, kopyalamaz.
export const PROJECT_ANALYZER_FIELDS = [
  { key: "gucluYonler", label: "Güçlü yönler", type: "textarea" },
  { key: "zayifYonler", label: "Zayıf yönler", type: "textarea" },
  { key: "riskler", label: "Riskler", type: "textarea" },
  { key: "teknikBorc", label: "Teknik borç", type: "textarea" },
  { key: "sonrakiOneri", label: "Sonraki öneri", type: "textarea" },
];
