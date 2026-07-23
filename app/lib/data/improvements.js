import { createCollection } from "./collection";
import { STORAGE_KEYS } from "./keys";
import { PRIORITY_OPTIONS } from "./options";

function seed() {
  return [];
}

// Sürekli Gelişim Katmanı: yalnızca not/öneri kaydıdır. OSMAN AI kendi
// kendine kod değiştirmez; bu liste manuel olarak doldurulur ve Osman'ın
// onayı olmadan hiçbir öğe otomatik uygulanmaz.
export const improvementsCollection = createCollection(STORAGE_KEYS.improvements, { seed });

export const IMPROVEMENT_STATUS_OPTIONS = [
  { value: "Bekliyor", label: "Bekliyor" },
  { value: "Onaylandı", label: "Onaylandı" },
  { value: "Reddedildi", label: "Reddedildi" },
  { value: "Uygulandı", label: "Uygulandı" },
];

export const IMPROVEMENT_FIELDS = [
  { key: "eksik", label: "Eksik", type: "text" },
  { key: "sebep", label: "Sebep", type: "textarea" },
  { key: "onerilenGelistirme", label: "Önerilen geliştirme", type: "textarea" },
  { key: "oncelik", label: "Öncelik", type: "select", options: PRIORITY_OPTIONS },
  { key: "durum", label: "Durum", type: "select", options: IMPROVEMENT_STATUS_OPTIONS },
];
