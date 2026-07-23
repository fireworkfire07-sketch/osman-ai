# 12 — AI Payment Protocol

## Durum: ARAŞTIRMA VE ÜRÜN TASARIMI AŞAMASINDA

**Bu, çalışan bir ödeme altyapısı değildir.** OSMAN AI bugün hiçbir ödeme işlemi yapmaz, hiçbir finansal yetkilendirme gerçekleştirmez. Bu doküman ve uygulamadaki karşılığı (`app/lib/data/paymentProtocol.js`), Osman'ın sürekli geliştirdiği ikinci stratejik araştırma projesinin kaydıdır.

## Amaç

İnsanlar, şirketler, yazılımlar ve AI ajanları arasında güvenli, sınırlı ve doğrulanabilir ödeme yetkilendirmesi sağlamak.

## Ana alanlar

- AI ajan kimliği
- Ödeme yetkisi
- Harcama sınırı
- İşlem amacı
- Kullanıcı onayı
- Yetki makbuzu
- Ödeme makbuzu
- İptal ve itiraz
- Mikro ödemeler
- Ajanlar arası ödeme
- Dolandırıcılık önleme
- Hukuki sorumluluk
- Vergi
- Uyum
- Risk puanı
- İnsan denetimi
- Güvenli ödeme protokolü

## Kod karşılığı (bugünkü veri kaydı)

`app/lib/data/paymentProtocol.js` → `createDefaultPaymentProtocol()`, 7 alanlı tekil bir kayıt tutar: senaryo, güven modeli, kimlik doğrulama, ödeme akışı, riskler, kullanıcı onayı, araştırma notları. "AI Payment Protocol" sekmesinden `SingleRecordPanel` ile görüntülenir/düzenlenir. Kayıt silinemez.

Varsayılan içerik (bugün kod içinde yazılı, gerçek bir işlem altyapısı değil, bir **taslak model**):
- Ödeme akışı: kullanıcı onayı → harcama sınırı kontrolü → işlem → makbuz → itiraz/iptal penceresi
- Güven modeli: kademeli güven — harcama sınırları ve geçmiş davranışa göre yetki artışı

## Hukuki ve finansal risk notu

Ödeme ve yetkilendirme konuları hukuki sorumluluk, vergi ve uyum (compliance) gerektirir. Bu proje **hiçbir zaman** gerçek para hareketi gerçekleştiren bir kod yolu içermeyecek şekilde, yalnızca araştırma/tasarım seviyesinde ilerler — Core Brain'in "kullanıcı onayı olmadan dış işlem, ödeme veya mesaj göndermeme" ilkesi bunu güvence altına alır (bkz. `04-CORE-BRAIN.md`, `18-SECURITY-AND-PRIVACY.md`).

## OSMAN AI bu projeyi nasıl ele alır?

Aynı `protocolsSummary` mekanizmasıyla (bkz. `11-AI-SECURITY-PROTOCOL.md`) sohbet bağlamına özet olarak eklenir. Var olmayan bir ödeme altyapısını var gibi göstermez.

## Sonraki adım

Araştırma önceliğini ve ilk kaynakları belirlemek (bugünkü kayıtta yazılı).
