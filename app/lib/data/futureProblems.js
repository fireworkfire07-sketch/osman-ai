import { createCollection } from "./collection";
import { STORAGE_KEYS } from "./keys";
import { PRIORITY_OPTIONS } from "./options";

function seed() {
  return [
    {
      id: "future-problems-research",
      baslik: "Gelecek Problemleri Araştırması (genel takip)",
      problem: "Bugün çözülemeyen veya henüz fark edilmemiş problemleri erken tespit etmek",
      neZamanOrtayaCikabilir: "Sürekli / uzun vadeli",
      kimleriEtkiler:
        "Yapay zekâ, dijital kimlik, siber güvenlik, finans, AI ajanları, robotik, sağlık, enerji, eğitim ve sanat teknolojileri alanlarında çalışan herkes",
      mevcutCozumler: "Henüz araştırılmadı",
      eksikKalanNokta: "Henüz belirlenmedi",
      potansiyelCozum: "",
      kureselBuyumePotansiyeli: "Belirlenecek",
      risk: "",
      oncelik: "Orta",
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
  { key: "baslik", label: "Başlık", type: "text" },
  { key: "problem", label: "Problem", type: "textarea" },
  { key: "neZamanOrtayaCikabilir", label: "Tahmini oluşma tarihi", type: "text" },
  { key: "kimleriEtkiler", label: "Etkilenen sektörler", type: "textarea" },
  { key: "mevcutCozumler", label: "Mevcut çözümler", type: "textarea" },
  { key: "eksikKalanNokta", label: "Eksikler", type: "textarea" },
  { key: "potansiyelCozum", label: "Osman'ın çözüm fikri", type: "textarea" },
  { key: "kureselBuyumePotansiyeli", label: "Ölçeklenebilirlik", type: "text" },
  { key: "risk", label: "Risk", type: "textarea" },
  { key: "oncelik", label: "Öncelik", type: "select", options: PRIORITY_OPTIONS },
  { key: "durum", label: "Durum", type: "select", options: FUTURE_PROBLEM_STATUS_OPTIONS },
];
