import { createCollection } from "./collection";
import { STORAGE_KEYS } from "./keys";
import { today } from "./storage";

const PROTECTED_IDS = ["ai-security-protocol", "ai-payment-protocol"];

function seed() {
  const day = today();
  return [
    {
      id: "ai-security-protocol",
      ad: "AI Security Protocol",
      amac: "İnsanları ve sistemleri zararlı, sahte, kontrolsüz veya casusluk yapan AI ajanlarından korumak",
      arastirmaAlanlari:
        "Ajan kimliği, kod bütünlüğü, imzalı araç çağrıları, yetki sınırları, davranış denetimi, dış bağlantı kontrolü, log analizi, güven puanı, karantina, kullanıcı onayı, sorumluluk ve hesap verebilirlik, gizlilik, güvenli ajan iletişimi",
      durum: "Sürekli geliştirilen stratejik girişim — araştırma aşamasında",
      sonrakiAdim: "Araştırma önceliğini ve ilk kaynakları belirlemek",
      createdAt: day,
      updatedAt: day,
    },
    {
      id: "ai-payment-protocol",
      ad: "AI Payment Protocol",
      amac: "İnsanlar, şirketler ve AI ajanları arasında güvenli ödeme ve yetkilendirme altyapısı oluşturmak",
      arastirmaAlanlari:
        "AI ajan kimliği, ödeme yetkisi, harcama sınırları, kullanıcı onayı, işlem makbuzu, iptal ve itiraz, mikro ödeme, ajanlar arası ödeme, dolandırıcılık önleme, hukuki sorumluluk, vergi ve uyum, güven protokolü",
      durum: "Sürekli geliştirilen stratejik girişim — araştırma aşamasında",
      sonrakiAdim: "Araştırma önceliğini ve ilk kaynakları belirlemek",
      createdAt: day,
      updatedAt: day,
    },
  ];
}

export const protocolsCollection = createCollection(STORAGE_KEYS.protocols, {
  seed,
  protectedIds: PROTECTED_IDS,
});

export const PROTOCOL_FIELDS = [
  { key: "ad", label: "Ad", type: "text" },
  { key: "amac", label: "Amaç", type: "textarea" },
  { key: "arastirmaAlanlari", label: "Araştırma alanları", type: "textarea" },
  { key: "durum", label: "Durum", type: "text" },
  { key: "sonrakiAdim", label: "Sonraki adım", type: "textarea" },
];
