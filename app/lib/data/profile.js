import { readJSON, writeJSON } from "./storage";
import { STORAGE_KEYS } from "./keys";

export function createDefaultProfile() {
  return {
    isim: "Osman",
    meslekler: "Profesyonel fotoğrafçı (turizm ve otel fotoğrafçılığı), jonglör, ateş gösterisi performans sanatçısı",
    yetenekler: "Fotoğraf, estetik, kompozisyon, hikâye anlatımı, sahne performansı, müşteri iletişimi ve satış",
    ilgiAlanlari:
      "Yapay zekâ teknolojileri ve otomasyonlar, geleceğin büyük problemlerinin araştırılması, AI Security Protocol, AI Payment Protocol",
    sanatsalAlanlar: "Fotoğrafçılık, jonglörlük, ateş gösterisi, estetik ve hikâye anlatımı",
    teknikSeviye: "Kod isterse eksiksiz dosya içeriği ile ilerler; tek adımlı, sade anlatım tercih eder",
    kullanilanCihazlar: "Çoğunlukla telefon ve tablet",
    calismaTercihleri: "Sade dil, tek ve net yol; aynı anda çok fazla seçenek istemez",
    isHedefleri: "Fikirlerini çalışan projelere ve gelir üreten sistemlere dönüştürmek",
    uzunVadeliHedefler: "Küresel ölçekte büyüyebilecek girişimler kurmak",
    iletisimTercihleri: "Kısa, doğrudan, Türkçe, uygulanabilir sonraki adım içeren cevaplar",
    aktifSektorler: "Fotoğrafçılık/turizm, sahne performansı, yapay zekâ/otomasyon",
    kisiselDegerler:
      "Gerçekten çalışan ve test edilmiş sistemler; dürüst vaatler; nefes egzersizi, meditasyon ve Tai Chi ile dengeli bir yaşam",
  };
}

export function loadProfile() {
  const existing = readJSON(STORAGE_KEYS.profile, null);
  if (existing) return existing;
  const created = createDefaultProfile();
  writeJSON(STORAGE_KEYS.profile, created);
  return created;
}

export function saveProfile(profile) {
  writeJSON(STORAGE_KEYS.profile, profile);
}

export function resetProfile() {
  const created = createDefaultProfile();
  writeJSON(STORAGE_KEYS.profile, created);
  return created;
}

export const PROFILE_FIELDS = [
  { key: "isim", label: "İsim" },
  { key: "meslekler", label: "Meslekler" },
  { key: "yetenekler", label: "Yetenekler" },
  { key: "ilgiAlanlari", label: "İlgi alanları" },
  { key: "sanatsalAlanlar", label: "Sanatsal alanlar" },
  { key: "teknikSeviye", label: "Teknik seviye" },
  { key: "kullanilanCihazlar", label: "Kullanılan cihazlar" },
  { key: "calismaTercihleri", label: "Çalışma tercihleri" },
  { key: "isHedefleri", label: "İş hedefleri" },
  { key: "uzunVadeliHedefler", label: "Uzun vadeli hedefler" },
  { key: "iletisimTercihleri", label: "İletişim tercihleri" },
  { key: "aktifSektorler", label: "Aktif sektörler" },
  { key: "kisiselDegerler", label: "Kişisel değerler" },
];
