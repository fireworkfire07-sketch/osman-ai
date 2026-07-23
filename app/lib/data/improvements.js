import { createCollection } from "./collection";
import { STORAGE_KEYS } from "./keys";

function seed() {
  return [];
}

// Sürekli Gelişim Katmanı: yalnızca not/öneri kaydıdır. OSMAN AI kendi
// kendine kod değiştirmez; bu liste manuel olarak doldurulur ve Osman'ın
// onayı olmadan hiçbir öğe otomatik uygulanmaz.
export const improvementsCollection = createCollection(STORAGE_KEYS.improvements, { seed });

export const IMPROVEMENT_TYPE_OPTIONS = [
  { value: "Eksik", label: "Eksik" },
  { value: "Öneri", label: "Öneri" },
  { value: "Teknik Borç", label: "Teknik Borç" },
  { value: "Güvenlik Riski", label: "Güvenlik Riski" },
];

export const IMPROVEMENT_STATUS_OPTIONS = [
  { value: "Bekliyor", label: "Bekliyor" },
  { value: "Onaylandı", label: "Onaylandı" },
  { value: "Reddedildi", label: "Reddedildi" },
  { value: "Uygulandı", label: "Uygulandı" },
];

export const IMPROVEMENT_FIELDS = [
  { key: "baslik", label: "Başlık", type: "text" },
  { key: "aciklama", label: "Açıklama", type: "textarea" },
  { key: "tur", label: "Tür", type: "select", options: IMPROVEMENT_TYPE_OPTIONS },
  { key: "durum", label: "Durum", type: "select", options: IMPROVEMENT_STATUS_OPTIONS },
];
