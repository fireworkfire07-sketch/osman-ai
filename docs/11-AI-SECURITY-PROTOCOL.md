# 11 — AI Security Protocol

## Durum: ARAŞTIRMA VE ÜRÜN TASARIMI AŞAMASINDA

**Bu, çalışan bir güvenlik altyapısı değildir.** OSMAN AI bugün hiçbir AI ajanını denetlemez, hiçbir kimlik doğrulamaz, hiçbir davranış izlemez. Bu doküman ve uygulamadaki karşılığı (`app/lib/data/securityProtocol.js`), Osman'ın sürekli geliştirdiği bir **stratejik araştırma projesinin** kaydıdır — bir ürün değil, bir ürün fikrinin ve araştırma gündeminin dokümantasyonudur.

## Amaç

İnsanları ve sistemleri zararlı, sahte, kontrolsüz, casusluk yapan veya yetkisini aşan AI ajanlarından koruyacak bir güven katmanı geliştirmek.

## Ana araştırma alanları

- AI ajan kimliği
- Kod bütünlüğü
- İmzalı araç çağrıları (signed tool calls)
- Yetki sınırları
- Davranış izleme
- Gizli dış bağlantı tespiti
- Tool-call denetimi
- Log geçmişi
- Güven puanı
- Karantina
- Kullanıcı onayı
- Hesap verebilirlik
- Gizlilik
- Güvenli ajan iletişimi
- Kriptografik işlem makbuzları
- Daralan izin zarfı (decreasing permission envelope)
- Gizliliği koruyan itibar sistemi
- Belirsizlik farkındalığı (uncertainty awareness)

## Kod karşılığı (bugünkü veri kaydı)

`app/lib/data/securityProtocol.js` → `createDefaultSecurityProtocol()`, 7 alanlı tekil bir kayıt tutar: problem, risk, güvenlik seviyesi, çözüm, kaynak, son güncelleme, araştırma notları. Bu, `app/components/SingleRecordPanel.js` ile "AI Security Protocol" sekmesinden görüntülenir/düzenlenir. Kayıt silinemez (kalıcı stratejik proje).

## Rakip ve fikri mülkiyet notu

Bu alanda (AI ajan güvenliği, davranış denetimi, güven puanlama) hâlihazırda çalışan başka şirketler/araştırma grupları olabilir. Bu doküum bunu varsaymaz ama göz ardı da etmez: **gerçek bir ürün geliştirme adımına geçilmeden önce mevcut çözümlerin ve olası patent çakışmalarının araştırılması gerekir.** Bu araştırma bugüne kadar yapılmamıştır (`sonrakiAdim` alanı: "Araştırma önceliğini ve ilk kaynakları belirlemek").

## OSMAN AI bu projeyi nasıl ele alır?

Core Brain (`app/lib/core/brain.js` → GÜVENLİK YAKLAŞIMI), bu projeyi "Osman'ın sürekli geliştirdiği stratejik girişim" olarak tanır ve sohbet bağlamına özet olarak eklenir (bkz. `10-RESEARCH-ENGINE.md`'deki özetleme mantığının aynısı, `app/lib/context.js` → `protocolsSummary`). OSMAN AI bu konuda konuşurken **var olmayan bir altyapıyı var gibi göstermez**; araştırma durumunu olduğu gibi yansıtır.

## Sonraki adım

Araştırma önceliğini ve ilk kaynakları belirlemek (bugünkü kayıtta yazılı). Bu, bir sonraki geliştirme değil, bir sonraki **araştırma** adımıdır.
