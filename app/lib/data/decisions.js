import { createCollection } from "./collection";
import { STORAGE_KEYS } from "./keys";
import { today } from "./storage";

function seed() {
  const day = today();
  return [
    {
      id: "d1",
      baslik: "Ücretsiz AI sağlayıcı",
      aciklama: "Ücretli AI API kullanılmayacak, ücretsiz GROQ tercih edildi.",
      projeId: "osman-ai",
      tarih: day,
      durum: "Aktif",
    },
    {
      id: "d2",
      baslik: "Küçük adım prensibi",
      aciklama: "Önce en küçük çalışan sürüm kurulacak, karmaşık mimariye geçilmeyecek.",
      projeId: "osman-ai",
      tarih: day,
      durum: "Aktif",
    },
    {
      id: "d3",
      baslik: "Eksiksiz dosya kuralı",
      aciklama: "Kod değişikliklerinde eksiksiz dosya içeriği verilecek, parça satır değil.",
      projeId: "osman-ai",
      tarih: day,
      durum: "Aktif",
    },
  ];
}

export const decisionsCollection = createCollection(STORAGE_KEYS.decisions, { seed });

export const DECISION_STATUS_OPTIONS = [
  { value: "Aktif", label: "Aktif" },
  { value: "İptal Edildi", label: "İptal Edildi" },
];

export function decisionFields(projectOptions) {
  const options = [{ value: "", label: "(Genel / proje yok)" }, ...projectOptions];
  return [
    { key: "baslik", label: "Başlık", type: "text" },
    { key: "aciklama", label: "Açıklama", type: "textarea" },
    { key: "projeId", label: "Bağlı proje", type: "select", options },
    { key: "durum", label: "Durum", type: "select", options: DECISION_STATUS_OPTIONS },
  ];
}
