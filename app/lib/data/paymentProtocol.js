import { createSingleRecord } from "./singleRecord";
import { STORAGE_KEYS } from "./keys";
import { today } from "./storage";

// Normal bir not listesi değildir — Osman'ın sürekli geliştirdiği tek,
// sabit stratejik proje. Bu yüzden diğer listelerin aksine tekil kayıt
// (profil ile aynı desen) olarak tutulur, silinemez.
export function createDefaultPaymentProtocol() {
  return {
    senaryo: "İnsanlar, şirketler ve AI ajanları arasında güvenli ödeme ve yetkilendirme",
    guvenModeli: "Kademeli güven — harcama sınırları ve geçmiş davranışa göre yetki artışı",
    kimlikDogrulama: "AI ajanının kimliği ve hangi kullanıcı adına işlem yaptığı doğrulanmalı",
    odemeAkisi: "Kullanıcı onayı → harcama sınırı kontrolü → işlem → makbuz → itiraz/iptal penceresi",
    riskler: "Dolandırıcılık, yetkisiz harcama, hukuki sorumluluk belirsizliği, vergi ve uyum sorunları",
    kullaniciOnayi: "Belirli bir tutarın üzerindeki her işlem için açık onay gerekir",
    arastirmaNotlari:
      "Araştırma alanları: AI ajan kimliği, ödeme yetkisi, harcama sınırları, kullanıcı onayı, işlem makbuzu, iptal ve itiraz, mikro ödeme, ajanlar arası ödeme, dolandırıcılık önleme, hukuki sorumluluk, vergi ve uyum, güven protokolü.",
  };
}

export const paymentProtocolRecord = createSingleRecord(STORAGE_KEYS.paymentProtocol, createDefaultPaymentProtocol);

export const PAYMENT_PROTOCOL_FIELDS = [
  { key: "senaryo", label: "Senaryo", type: "textarea" },
  { key: "guvenModeli", label: "Güven modeli", type: "textarea" },
  { key: "kimlikDogrulama", label: "Kimlik doğrulama", type: "textarea" },
  { key: "odemeAkisi", label: "Ödeme akışı", type: "textarea" },
  { key: "riskler", label: "Riskler", type: "textarea" },
  { key: "kullaniciOnayi", label: "Kullanıcı onayı", type: "textarea" },
  { key: "arastirmaNotlari", label: "Araştırma notları", type: "textarea" },
];
