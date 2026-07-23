import { createCollection } from "./collection";
import { STORAGE_KEYS } from "./keys";

function seed() {
  return [];
}

export const tasksCollection = createCollection(STORAGE_KEYS.tasks, { seed });

export const TASK_STATUS_OPTIONS = [
  { value: "Bekliyor", label: "Bekliyor" },
  { value: "Yapılıyor", label: "Yapılıyor" },
  { value: "Tamamlandı", label: "Tamamlandı" },
  { value: "Hata oluştu", label: "Hata oluştu" },
];

export const TASK_PRIORITY_OPTIONS = [
  { value: "Yüksek", label: "Yüksek" },
  { value: "Orta", label: "Orta" },
  { value: "Düşük", label: "Düşük" },
];

export function taskFields(projectOptions) {
  const options = [{ value: "", label: "(Genel / proje yok)" }, ...projectOptions];
  return [
    { key: "ad", label: "Görev adı", type: "text" },
    { key: "projeId", label: "Bağlı proje", type: "select", options },
    { key: "aciklama", label: "Açıklama", type: "textarea" },
    { key: "durum", label: "Durum", type: "select", options: TASK_STATUS_OPTIONS },
    { key: "oncelik", label: "Öncelik", type: "select", options: TASK_PRIORITY_OPTIONS },
    { key: "testYontemi", label: "Test yöntemi", type: "textarea" },
    { key: "tamamlanmaTarihi", label: "Tamamlanma tarihi", type: "text" },
  ];
}
