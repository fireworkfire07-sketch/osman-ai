import { createSingleRecord } from "./singleRecord";
import { STORAGE_KEYS } from "./keys";
import { today } from "./storage";

// Normal bir not listesi değildir — Osman'ın sürekli geliştirdiği tek,
// sabit stratejik proje. Bu yüzden diğer listelerin aksine tekil kayıt
// (profil ile aynı desen) olarak tutulur, silinemez.
export function createDefaultSecurityProtocol() {
  return {
    problem: "İnsanları ve sistemleri zararlı, sahte, kontrolsüz veya casusluk yapan AI ajanlarından korumak",
    risk:
      "Ajan kimliğinin taklit edilmesi, yetkisiz araç çağrıları, kontrolsüz dış bağlantılar, kullanıcı onayı olmadan işlem yapılması",
    guvenlikSeviyesi: "Araştırma aşamasında",
    cozum: "Ajan kimliği, imzalı araç çağrıları, yetki sınırları, davranış denetimi, güven puanı ve karantina mekanizmaları",
    kaynak: "",
    sonGuncelleme: today(),
    arastirmaNotlari:
      "Araştırma alanları: ajan kimliği, kod bütünlüğü, imzalı araç çağrıları, yetki sınırları, davranış denetimi, dış bağlantı kontrolü, log analizi, güven puanı, karantina, kullanıcı onayı, sorumluluk ve hesap verebilirlik, gizlilik, güvenli ajan iletişimi.",
  };
}

export const securityProtocolRecord = createSingleRecord(STORAGE_KEYS.securityProtocol, createDefaultSecurityProtocol);

export const SECURITY_PROTOCOL_FIELDS = [
  { key: "problem", label: "Problem", type: "textarea" },
  { key: "risk", label: "Risk", type: "textarea" },
  { key: "guvenlikSeviyesi", label: "Güvenlik seviyesi", type: "text" },
  { key: "cozum", label: "Çözüm", type: "textarea" },
  { key: "kaynak", label: "Kaynak", type: "textarea" },
  { key: "sonGuncelleme", label: "Son güncelleme", type: "text" },
  { key: "arastirmaNotlari", label: "Araştırma notları", type: "textarea" },
];
