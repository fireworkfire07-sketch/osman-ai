# 22 — Kararlar

Bu doküman, proje genelinde alınmış ve geçerliliğini koruyan ana kararları kaydeder. Proje-bazlı kararlar için uygulama içi Karar Hafızası (`app/lib/data/decisions.js`, bkz. `09-PROJECT-SYSTEM.md`) kullanılır — bu ikisi farklı amaçlara hizmet eder.

| # | Karar | Tarih/Sprint | Gerekçe |
|---|---|---|---|
| 1 | Tek ana repo kullanılacak (`fireworkfire07-sketch/osman-ai`). | V1 | `shp-engine` reposuyla karışıklığı önlemek. |
| 2 | İlk ürün web uygulamasıdır. | V1 | En hızlı ücretsiz dağıtım yolu. |
| 3 | Mobil uygulama ertelendi. | V1 | Web, Osman'ın telefon/tablet kullanımını zaten karşılıyor. |
| 4 | GROQ API kullanılacak, OpenAI değil. | V1 | Ücretsiz, kredi kartsız, süresiz kota; OpenAI-uyumlu format. |
| 5 | Vercel ücretsiz planı kullanılacak. | V1 | 0 TL aylık maliyet hedefi. |
| 6 | İlk veri sistemi localStorage'dır. | V1 | Sunucu veritabanı gerektirmez, ücretsiz. |
| 7 | Ücretli veritabanı eklenmeyecek. | V1-V5 | Ücretsiz çalışma hedefi. |
| 8 | Çalışan sistem bozulmadan geliştirilecek. | Her sprint | Temel ilke (bkz. `05-PRINCIPLES.md`). |
| 9 | Proje bilgileri birbirine karıştırılmayacak. | V2 | Aktif proje bağlamı mekanizması. |
| 10 | Claude Code geliştirme ve deploy doğrulama ajanıdır. | V2-V3 | GitHub/Vercel MCP araçlarıyla otomatik doğrulama. |
| 11 | Yıkıcı işlemler kullanıcı onayı gerektirir. | V2-V3 | Geri alınamaz hasarı önlemek. |
| 12 | Sistem promptu (Core Brain) ve Profil birbirinden ayrıdır. | V3-V5 | Karakter sabit, veri değişebilir (bkz. `04-CORE-BRAIN.md`). |
| 13 | OSMAN AI stratejik projeleri (AI Security/Payment Protocol) kalıcı olarak korur. | V3-V5 | Silinemez tekil kayıt olarak modellendi. |
| 14 | Protokoller liste değil, tekil kayıt (`singleRecord.js`) olarak modellenir. | V3-V5 sprint 2 | Her protokolün kendine özgü şeması var; ortak liste şemasına zorlanmadı. |
| 15 | Öncelik seçenekleri (`Yüksek/Orta/Düşük`) tek bir paylaşılan sabitte (`options.js`) tutulur. | V3-V5 sprint 2 | Kod tekrarını önlemek. |
| 16 | Otonom "Gelişim Motoru" / "Gelecek Araştırma Motoru" bilinçli olarak kurulmadı. | V2-V5 | Onay ilkesiyle çelişir, zamanlanmış görev altyapısı yok. |
| 17 | ESLint/Jest/Playwright repoya devDependency olarak eklenmedi. | V3-V5 sprint 2 | Next 16 `next lint`'i kaldırdı; yeni test çerçevesi eklemek ayrı bir mimari karar olarak bekletiliyor. |
| 18 | `docs/` altında kalıcı bir Master Spec dokümantasyon sistemi kuruldu. | Master Spec v1.0 | Uzun vadeli vizyon, mimari ve kuralların tek referansta toplanması. |
| 19 | İçe aktarma artık her alanın tipini doğrular; şekli uymayan alanlar sessizce yazılmak yerine atlanıp Türkçe raporlanır. | Kritik/Yüksek düzeltme sprinti | Bozuk bir yedek dosyasının uygulamayı çökertmesini önlemek. |
| 20 | Genel bir hata sınırı (`app/error.js`) eklendi; ücretli bir hata izleme servisi eklenmedi. | Kritik/Yüksek düzeltme sprinti | Beklenmeyen her render hatasında beyaz ekran yerine güvenli, kendi kendine kurtarılabilir bir ekran sunmak; ücretsizlik hedefini korumak. |
| 21 | `/api/chat`'e IP-bazlı, bellek-içi (in-memory) oran sınırlama eklendi; ücretli bir hız sınırlama servisi/veritabanı eklenmedi. | Kritik/Yüksek düzeltme sprinti | Ücretsiz GROQ kotasını en basit, ücretsiz yöntemle korumak; mükemmel olmadığı açıkça belirtildi. |
| 22 | Sohbet bağlamındaki kararlar/görevler son 5 kayıtla, toplam bağlam 4.000 karakterle sınırlandı. | Kritik/Yüksek düzeltme sprinti | Proje büyüdükçe GROQ'un ücretsiz token limitine yaklaşmayı önlemek. |
| 23 | localStorage için tek kaynaklı şema sürümleme ve yedekten-geri-yükleyen göç (migration) altyapısı eklendi. | Kritik/Yüksek düzeltme sprinti | Gelecekteki alan adı/şekli değişikliklerinin mevcut kullanıcı verisini sessizce bozmasını önlemek. |
| 24 | `storage.js` artık sessizce yutmak yerine son okuma/yazma hatasını saklar; `page.js` bunu Sistem Durumu panelinde gösterir. | Kritik/Yüksek düzeltme sprinti | Kullanıcının "kaydedildi sandığı ama kaydedilmemiş" veriyle karşılaşmasını önlemek. |
| 25 | `tests/` altında Node'un yerleşik test çalıştırıcısıyla (`npm test`) 18 otomatik test eklendi; yeni bir test bağımlılığı (Jest/Vitest) eklenmedi. | Kritik/Yüksek düzeltme sprinti | Bu sprintin düzeltmelerini tekrar çalıştırılabilir şekilde doğrulamak, ücretsizlik/az-bağımlılık ilkesini korumak. |

## Kayıt kuralı

Yeni bir ana karar alındığında bu tabloya bir satır eklenir; proje-bazlı, günlük kararlar için uygulama içi Karar Hafızası kullanılmaya devam eder.
