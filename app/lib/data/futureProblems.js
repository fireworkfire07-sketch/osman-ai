import { createCollection } from "./collection";
import { STORAGE_KEYS } from "./keys";

function seed() {
  return [
    {
      id: "future-problems-research",
      problemAdi: "Gelecek Problemleri Araştırması (genel takip)",
      neZamanOrtayaCikabilir: "Sürekli / uzun vadeli",
      kimleriEtkiler:
        "Yapay zekâ, dijital kimlik, siber güvenlik, finans, AI ajanları, robotik, sağlık, enerji, eğitim ve sanat teknolojileri alanlarında çalışan herkes",
      mevcutCozumler: "Henüz araştırılmadı",
      eksikKalanNokta: "Henüz belirlenmedi",
      potansiyelCozum: "",
      isModeli: "",
      teknikRisk: "",
      hukukiRisk: "",
      kureselBuyumePotansiyeli: "Belirlenecek",
      durum: "Takip ediliyor",
    },
  ];
}

export const futureProblemsCollection = createCollection(STORAGE_KEYS.futureProblems, { seed });

export const FUTURE_PROBLEM_STATUS_OPTIONS = [
  { value: "Takip ediliyor", label: "Takip ediliyor" },
  { value: "Araştırılıyor", label: "Araştırılıyor" },
  { value: "Vazgeçildi", label: "Vazgeçildi" },
];

export const FUTURE_PROBLEM_FIELDS = [
  { key: "problemAdi", label: "Problem adı", type: "text" },
  { key: "neZamanOrtayaCikabilir", label: "Ne zaman ortaya çıkabilir", type: "text" },
  { key: "kimleriEtkiler", label: "Kimleri etkiler", type: "textarea" },
  { key: "mevcutCozumler", label: "Mevcut çözümler", type: "textarea" },
  { key: "eksikKalanNokta", label: "Eksik kalan nokta", type: "textarea" },
  { key: "potansiyelCozum", label: "Potansiyel çözüm", type: "textarea" },
  { key: "isModeli", label: "İş modeli", type: "textarea" },
  { key: "teknikRisk", label: "Teknik risk", type: "textarea" },
  { key: "hukukiRisk", label: "Hukuki risk", type: "textarea" },
  { key: "kureselBuyumePotansiyeli", label: "Küresel büyüme potansiyeli", type: "text" },
  { key: "durum", label: "Durum", type: "select", options: FUTURE_PROBLEM_STATUS_OPTIONS },
];
