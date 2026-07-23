import { createSingleRecord } from "./singleRecord";
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

export const profileRecord = createSingleRecord(STORAGE_KEYS.profile, createDefaultProfile);

export const PROFILE_FIELDS = [
  { key: "isim", label: "İsim", type: "text" },
  { key: "meslekler", label: "Meslekler", type: "textarea" },
  { key: "yetenekler", label: "Yetenekler", type: "textarea" },
  { key: "ilgiAlanlari", label: "İlgi alanları", type: "textarea" },
  { key: "sanatsalAlanlar", label: "Sanatsal alanlar", type: "textarea" },
  { key: "teknikSeviye", label: "Teknik seviye", type: "textarea" },
  { key: "kullanilanCihazlar", label: "Kullanılan cihazlar", type: "textarea" },
  { key: "calismaTercihleri", label: "Çalışma tercihleri", type: "textarea" },
  { key: "isHedefleri", label: "İş hedefleri", type: "textarea" },
  { key: "uzunVadeliHedefler", label: "Uzun vadeli hedefler", type: "textarea" },
  { key: "iletisimTercihleri", label: "İletişim tercihleri", type: "textarea" },
  { key: "aktifSektorler", label: "Aktif sektörler", type: "textarea" },
  { key: "kisiselDegerler", label: "Kişisel değerler", type: "textarea" },
];
