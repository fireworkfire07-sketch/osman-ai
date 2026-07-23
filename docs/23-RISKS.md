# 23 — Riskler

| Risk | Açıklama | Durum |
|---|---|---|
| Ücretsiz API limitleri | GROQ ücretsiz kotası (günlük 14.400 istek, dakikada 30 istek) aşılırsa sohbet geçici olarak çalışmaz. | **Kısmen azaltıldı** — `/api/chat` artık IP başına 5 dakikada 20 istekle sınırlı (bkz. `app/api/chat/rateLimit.js`, `18-SECURITY-AND-PRIVACY.md`). Bu IP-bazlı, sunucu-içi (in-memory) bir önlemdir; Vercel'in çoklu/soğuk başlangıç örnekleri arasında paylaşılmaz, bu yüzden global günlük kotayı %100 garanti etmez — yalnızca tek bir kaynaktan gelen hızlı kötüye kullanımı engeller. |
| GROQ sağlayıcı bağımlılığı | Tek AI sağlayıcısı var; GROQ ücretsiz koşullarını değiştirirse veya hizmeti durdurursa alternatif yoktur (bkz. `21-ROADMAP.md` Aşama 7 — Multi-AI, henüz kurulmadı). | Aktif, azaltılmamış |
| Genel erişime açık sohbet uç noktası | `/api/chat` kimlik doğrulaması gerektirmiyor; URL'yi bulan herkes sohbet gönderebilir. | **Kısmen azaltıldı** — oran sınırlama eklendi (yukarıya bkz.); tam kimlik doğrulama hâlâ yok (bilinçli, V1'den beri — bkz. `00-MASTER-SPEC.md` Temel kullanıcı). |
| localStorage veri kaybı | Tarayıcı verisi temizlenirse veya cihaz değişirse veri kaybolur. | Bilinen, yedekleme mevcut ama otomatik değil |
| Bozuk/uyumsuz içe aktarma dosyası | Yanlış şekilli bir yedek dosyası içe aktarılırsa uygulama çökebilir. | **Azaltıldı** — içe aktarma artık her alanın tipini doğruluyor, uyuşmayanları atlayıp Türkçe rapor gösteriyor (bkz. `app/lib/dataManagement.js` → `validateImportData`); ayrıca genel bir hata sınırı (`app/error.js`) beklenmedik herhangi bir render hatasını güvenli bir kurtarma ekranına çeviriyor. |
| localStorage şema değişikliği veri kaybı/erişilemezliği | Bir alan adı/şekli değiştiğinde eski kayıtlar sessizce görünmez kalabilir. | **Azaltıldı** — tek kaynaklı şema sürümleme ve göç (migration) altyapısı eklendi (bkz. `app/lib/data/schema.js`, `07-DATA-MODEL.md` → Şema Sürümleme); göç başarısız olursa veri otomatik yedekten geri yüklenir. |
| Sessiz localStorage yazma/okuma hataları | Kota dolması gibi durumlarda veri kaydedilmeden "kaydedildi" izlenimi verilmesi. | **Azaltıldı** — `storage.js` artık son hatayı saklıyor, `app/page.js` bunu her mutasyondan sonra kontrol edip Sistem Durumu panelinde ("Son hata") gösteriyor. |
| Cihazlar arası senkronizasyon eksikliği | Aynı veriye birden fazla cihazdan erişilemez. | Bilinçli kabul edilmiş sınır |
| Prompt injection | Sohbet girdisi doğrudan GROQ'a gider; özel bir filtre yok. Tek kullanıcılı sistem olduğu için etkisi sınırlı. | Düşük risk, azaltılmamış |
| Yanlış hafıza | Osman'ın kaydettiği bir bilginin güncelliğini yitirmesi veya yanlış girilmesi; düzeltme yalnızca manuel. | Bilinen, kullanıcı sorumluluğunda |
| Aşırı karmaşık mimari | Çok sayıda katman (12 sekme) eklenmesi "önce küçük sistem" ilkesiyle gerilim yaratabilir. | İzleniyor, `05-PRINCIPLES.md` madde 12 ile sınırlandırılıyor |
| Özellik şişmesi | Her sprintte yeni alan/panel eklenmesi bakım yükünü artırır. | İzleniyor |
| Test eksikliği | Repoya commit edilmiş otomatik test yoktu; her sprint manuel Playwright testine dayanıyordu. | **Kısmen azaltıldı** — `tests/` altında Node'un yerleşik test çalıştırıcısıyla (`npm test`, yeni bağımlılık yok) kritik/yüksek düzeltmeleri kapsayan 18 otomatik test eklendi (rate limit, bağlam sınırlama, içe aktarma doğrulama, şema göçü). UI akışları hâlâ manuel Playwright'a dayanıyor; lint hâlâ yok. |
| Vercel bağımlılığı | Barındırma tek sağlayıcıya (Vercel) bağlı. | Kabul edilmiş (ücretsiz plan avantajı bunu dengeliyor) |
| AI'ın doğrulanmamış iddiaları | GROQ'tan gelen bir cevap yanlış/abartılı bilgi içerebilir; Core Brain bunu azaltmaya çalışır ama garanti etmez. | Aktif, davranışsal kuralla azaltılıyor |
| Finansal ve hukuki riskler | AI Payment Protocol'ün ileride gerçek bir ödeme akışına dönüşmesi hukuki/vergi sorumluluğu doğurur. | Bugün için geçerli değil (yalnızca araştırma aşaması) |
| AI Security/Payment patent ve rakip riski | Bu alanlarda çalışan başka projeler/patentler olabilir; henüz araştırılmadı. | Aktif, açık (bkz. `11-AI-SECURITY-PROTOCOL.md`, `12-AI-PAYMENT-PROTOCOL.md`) |
| Bağımlılık güvenliği (npm audit) | `next`'in dolaylı `sharp`/libvips bağımlılığında yüksek önem dereceli bulgu; uygulama `next/image` kullanmadığı için pratikte tetiklenmiyor. | Bilinen, düşük pratik etki |
| GROQ veri kullanım politikası | Kullanıcı verilerinin GROQ tarafından eğitim amacıyla kullanılıp kullanılmadığı bağımsız olarak doğrulanmadı. | Açık, doğrulanmamış |

## Risk gözden geçirme kuralı

Yeni bir büyük sprint öncesinde bu liste gözden geçirilir; yeni bir risk fark edilirse buraya eklenir, azaltılan bir risk varsa durumu güncellenir (satır silinmez, "azaltıldı" olarak işaretlenir).
