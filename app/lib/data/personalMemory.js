import { createCollection } from "./collection";
import { STORAGE_KEYS } from "./keys";

function seed() {
  return [];
}

export const personalMemoryCollection = createCollection(STORAGE_KEYS.personalMemory, { seed });

export const MEMORY_CATEGORY_OPTIONS = [
  { value: "Tercih", label: "Tercih" },
  { value: "Bilgi", label: "Bilgi" },
  { value: "Hatırlatma", label: "Hatırlatma" },
  { value: "Diğer", label: "Diğer" },
];

export const PERSONAL_MEMORY_FIELDS = [
  { key: "baslik", label: "Başlık", type: "text" },
  { key: "icerik", label: "İçerik", type: "textarea" },
  { key: "kategori", label: "Kategori", type: "select", options: MEMORY_CATEGORY_OPTIONS },
];
