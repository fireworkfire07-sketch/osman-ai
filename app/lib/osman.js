export const STORAGE_KEYS = {
  profile: "osman-ai:profile",
  projects: "osman-ai:projects",
  decisions: "osman-ai:decisions",
  activeProjectId: "osman-ai:activeProjectId",
};

export const OSMAN_SYSTEM_PROMPT = `Sen OSMAN AI'sın. Osman'ın kişisel dijital zekâsı, proje asistanı ve çalışma ortağısın.

Osman profesyonel fotoğrafçıdır (turizm ve otel fotoğrafçılığı deneyimiyle), jonglördür ve ateş gösterileri yapan bir performans sanatçısıdır. Fotoğraf, estetik, kompozisyon, hikâye anlatımı ve sahne sanatlarını bilir. Sanata değer veren bir girişimci ve yatırımcıdır; fikirlerini çalışan ürünlere ve küresel ölçekte büyüyebilecek şirketlere dönüştürmek ister. Yapay zekâ teknolojileri, otomasyonlar ve geleceğin büyük problemlerini araştırmakla ilgilenir; AI Security Protocol (yapay zekâ güvenliği) ve AI Payment Protocol (AI ajanları arası ödeme sistemleri) onun sürekli takip ettiği stratejik araştırma projeleridir.

Senin görevin yalnızca sohbet etmek değildir. Osman'ın fikirlerini düzenler, projelerini birbirinden ayırır, önemli kararlarını hatırlar ve ona en küçük uygulanabilir sonraki adımı gösterirsin.

Osman çoğunlukla telefon ve tablet kullanır. Teknik işlemleri sade, kısa ve tek adımlı anlatırsın. Kod istendiğinde eksiksiz, kopyala-yapıştır hazır dosya içeriği verirsin, parça satır değil.

Bu mesajla birlikte sana Osman'ın profili, aktif projesi ve bilinen kararları verilirse bunları cevabında dikkate alırsın; ama her cevapta profilin tamamını tekrar etmezsin, yalnızca soruyla ilgili kısmı kullanırsın.

Mevcut sistem durumunu görmeden tahmin yürütmezsin. Bilmediğin bir şeyi biliyormuş gibi davranmazsın. Ücretli bir servisi önermeden önce bunu açıkça söylersin ve mümkün olduğunda ücretsiz çözümü önerirsin. Gerçek dışı vaatlerde bulunmazsın.

Bir öneri sunarken şu sırayla düşünürsün:
1. Osman'ın gerçek hedefi nedir?
2. Hangi projeden bahsediliyor?
3. Mevcut durum ve kayıtlı kararlar nedir?
4. En küçük uygulanabilir sonraki adım nedir?
5. Bu adım ücretsiz, güvenli ve geri alınabilir mi?
6. Sonuç nasıl test edilir?`;

export const WELCOME_MESSAGE =
  "Merhaba Osman. Seni; fotoğrafçı, sanatçı, jonglör, ateş performansçısı, girişimci ve geleceğin teknolojileri üzerine çalışan biri olarak tanıyorum. Aktif projelerini ve kararlarını birlikte yönetebilirim.";

export function createDefaultProfile() {
  return {
    isim: "Osman",
    meslekler: "Profesyonel fotoğrafçı (turizm ve otel fotoğrafçılığı), jonglör, ateş gösterisi performans sanatçısı",
    yetenekler: "Fotoğraf, estetik, kompozisyon, hikâye anlatımı, sahne performansı, müşteri iletişimi ve satış",
    ilgiAlanlari:
      "Yapay zekâ teknolojileri ve otomasyonlar, geleceğin büyük problemlerinin araştırılması, AI Security Protocol, AI Payment Protocol",
    girisimcilik:
      "Sanata değer veren bir girişimci ve yatırımcı; fikirlerini çalışan ürünlere ve küresel ölçekli şirketlere dönüştürmek istiyor",
    calismaSekli:
      "Çoğunlukla telefon ve tablet kullanır; teknik anlatımların basit, tek adımlı ve uygulanabilir olmasını ister; kod değişikliklerinde eksiksiz dosya içeriği ister",
    cevapTercihleri: "Kısa, doğrudan, Türkçe, uygulanabilir sonraki adım içeren cevaplar",
  };
}

export function createDefaultProjects() {
  const today = new Date().toISOString().slice(0, 10);
  return [
    {
      id: "osman-ai",
      ad: "OSMAN AI",
      amac: "Osman'ın kişisel dijital zekâsı ve çalışma ortağı",
      durum: "V2 geliştiriliyor: profil ve hafıza sistemi eklendi",
      teknoloji: "Next.js, GROQ API, Vercel",
      repo: "fireworkfire07-sketch/osman-ai",
      sonYapilanIslem: "Osman profili, proje hafızası ve karar hafızası eklendi",
      sonrakiAdim: "Vercel'e deploy edip GROQ_API_KEY environment variable'ını eklemek",
      oncelik: "Yüksek",
      guncellenmeTarihi: today,
    },
    {
      id: "ai-security-protocol",
      ad: "AI Security Protocol",
      amac:
        "Yapay zekâ sistemlerinin güvenliğini artıracak yeni yöntemleri araştırmak (kimlik doğrulama, güvenilir AI, ajan güvenliği, veri koruma)",
      durum: "Araştırma aşamasında",
      teknoloji: "Belirlenmedi",
      repo: "",
      sonYapilanIslem: "Proje kaydı açıldı",
      sonrakiAdim: "Araştırma konusunu ve ilk kaynakları belirlemek",
      oncelik: "Orta",
      guncellenmeTarihi: today,
    },
    {
      id: "ai-payment-protocol",
      ad: "AI Payment Protocol",
      amac:
        "İnsanlar, AI ajanları ve dijital servisler arasındaki geleceğin ödeme modellerini araştırmak (mikro ödemeler, güvenli AI işlemleri, yeni ticaret altyapıları)",
      durum: "Araştırma aşamasında",
      teknoloji: "Belirlenmedi",
      repo: "",
      sonYapilanIslem: "Proje kaydı açıldı",
      sonrakiAdim: "Araştırma konusunu ve ilk kaynakları belirlemek",
      oncelik: "Orta",
      guncellenmeTarihi: today,
    },
  ];
}

export function createDefaultDecisions() {
  const today = new Date().toISOString().slice(0, 10);
  return [
    { id: "d1", tarih: today, proje: "OSMAN AI", karar: "Ücretli AI API kullanılmayacak, ücretsiz GROQ tercih edildi." },
    { id: "d2", tarih: today, proje: "OSMAN AI", karar: "Önce en küçük çalışan sürüm kurulacak, karmaşık mimariye geçilmeyecek." },
    { id: "d3", tarih: today, proje: "OSMAN AI", karar: "Kod değişikliklerinde eksiksiz dosya içeriği verilecek, parça satır değil." },
  ];
}

function readJSON(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadProfile() {
  return readJSON(STORAGE_KEYS.profile, null);
}

export function saveProfile(profile) {
  writeJSON(STORAGE_KEYS.profile, profile);
}

export function loadProjects() {
  return readJSON(STORAGE_KEYS.projects, null);
}

export function saveProjects(projects) {
  writeJSON(STORAGE_KEYS.projects, projects);
}

export function loadDecisions() {
  return readJSON(STORAGE_KEYS.decisions, null);
}

export function saveDecisions(decisions) {
  writeJSON(STORAGE_KEYS.decisions, decisions);
}

export function loadActiveProjectId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEYS.activeProjectId);
}

export function saveActiveProjectId(id) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.activeProjectId, id);
}

export function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildMemoryContext({ profile, activeProject, decisions }) {
  const parts = [];

  if (profile) {
    parts.push(
      `Osman profili — Meslekler: ${profile.meslekler}. Yetenekler: ${profile.yetenekler}. İlgi alanları: ${profile.ilgiAlanlari}. Girişimcilik: ${profile.girisimcilik}. Çalışma şekli: ${profile.calismaSekli}. Cevap tercihleri: ${profile.cevapTercihleri}.`
    );
  }

  if (activeProject) {
    parts.push(
      `Aktif proje: ${activeProject.ad}. Amaç: ${activeProject.amac}. Durum: ${activeProject.durum}. Son yapılan işlem: ${activeProject.sonYapilanIslem}. Sonraki adım: ${activeProject.sonrakiAdim}.`
    );
  }

  if (decisions && decisions.length) {
    const recent = decisions.slice(-5);
    parts.push("Bilinen kararlar: " + recent.map((d) => `[${d.tarih}] (${d.proje}) ${d.karar}`).join(" "));
  }

  return parts.join("\n");
}
