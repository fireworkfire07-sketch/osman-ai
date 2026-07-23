# 23 — Riskler

| Risk | Açıklama | Durum |
|---|---|---|
| Ücretsiz API limitleri | GROQ ücretsiz kotası (günlük 14.400 istek, dakikada 30 istek) aşılırsa sohbet geçici olarak çalışmaz. | Bilinen, izlenmiyor (kota takibi kodda yok) |
| GROQ sağlayıcı bağımlılığı | Tek AI sağlayıcısı var; GROQ ücretsiz koşullarını değiştirirse veya hizmeti durdurursa alternatif yoktur (bkz. `21-ROADMAP.md` Aşama 7 — Multi-AI, henüz kurulmadı). | Aktif, azaltılmamış |
| localStorage veri kaybı | Tarayıcı verisi temizlenirse veya cihaz değişirse veri kaybolur. | Bilinen, yedekleme mevcut ama otomatik değil |
| Cihazlar arası senkronizasyon eksikliği | Aynı veriye birden fazla cihazdan erişilemez. | Bilinçli kabul edilmiş sınır |
| Prompt injection | Sohbet girdisi doğrudan GROQ'a gider; özel bir filtre yok. Tek kullanıcılı sistem olduğu için etkisi sınırlı. | Düşük risk, azaltılmamış |
| Yanlış hafıza | Osman'ın kaydettiği bir bilginin güncelliğini yitirmesi veya yanlış girilmesi; düzeltme yalnızca manuel. | Bilinen, kullanıcı sorumluluğunda |
| Aşırı karmaşık mimari | Çok sayıda katman (12 sekme) eklenmesi "önce küçük sistem" ilkesiyle gerilim yaratabilir. | İzleniyor, `05-PRINCIPLES.md` madde 12 ile sınırlandırılıyor |
| Özellik şişmesi | Her sprintte yeni alan/panel eklenmesi bakım yükünü artırır. | İzleniyor |
| Test eksikliği | Repoya commit edilmiş otomatik test/lint yok; her sprint manuel Playwright testine dayanıyor. | Aktif, bilinen (bkz. `19-TESTING-STANDARDS.md`) |
| Vercel bağımlılığı | Barındırma tek sağlayıcıya (Vercel) bağlı. | Kabul edilmiş (ücretsiz plan avantajı bunu dengeliyor) |
| AI'ın doğrulanmamış iddiaları | GROQ'tan gelen bir cevap yanlış/abartılı bilgi içerebilir; Core Brain bunu azaltmaya çalışır ama garanti etmez. | Aktif, davranışsal kuralla azaltılıyor |
| Finansal ve hukuki riskler | AI Payment Protocol'ün ileride gerçek bir ödeme akışına dönüşmesi hukuki/vergi sorumluluğu doğurur. | Bugün için geçerli değil (yalnızca araştırma aşaması) |
| AI Security/Payment patent ve rakip riski | Bu alanlarda çalışan başka projeler/patentler olabilir; henüz araştırılmadı. | Aktif, açık (bkz. `11-AI-SECURITY-PROTOCOL.md`, `12-AI-PAYMENT-PROTOCOL.md`) |
| Bağımlılık güvenliği (npm audit) | `next`'in dolaylı `sharp`/libvips bağımlılığında yüksek önem dereceli bulgu; uygulama `next/image` kullanmadığı için pratikte tetiklenmiyor. | Bilinen, düşük pratik etki |
| GROQ veri kullanım politikası | Kullanıcı verilerinin GROQ tarafından eğitim amacıyla kullanılıp kullanılmadığı bağımsız olarak doğrulanmadı. | Açık, doğrulanmamış |

## Risk gözden geçirme kuralı

Yeni bir büyük sprint öncesinde bu liste gözden geçirilir; yeni bir risk fark edilirse buraya eklenir, azaltılan bir risk varsa durumu güncellenir (satır silinmez, "azaltıldı" olarak işaretlenir).
