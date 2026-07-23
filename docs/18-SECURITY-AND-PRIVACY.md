# 18 — Güvenlik ve Gizlilik

## API anahtarları

`GROQ_API_KEY`, yalnızca sunucu tarafında (`app/api/chat/route.js` içinde `process.env.GROQ_API_KEY`) okunur. **Durum: ÇALIŞIYOR, doğrulandı** — HTML çıktısında API anahtarı deseni aranıp bulunamadığı test edilmiştir (bkz. `19-TESTING-STANDARDS.md`).

## Environment Variables

Yerelde `.env.local` (gitignore'da), production'da Vercel → Environment Variables. `.env.example` yalnızca değişken adını (`GROQ_API_KEY=`) içerir, değer içermez.

## Frontend güvenliği

İstemci koduna hiçbir sır (API anahtarı, token) gömülmez. `app/lib/data/*` modülleri yalnızca localStorage ile konuşur, dışarıya (GROQ hariç) hiçbir istek atmaz.

## localStorage riskleri

- Aynı cihazı/tarayıcıyı paylaşan başka biri Osman'ın profil/proje/karar verisine erişebilir (fiziksel cihaz erişimi = veri erişimi). Bugün ek bir şifreleme veya kilit yoktur.
- Tarayıcı verisi temizlenirse veri kaybolur (bkz. `08-MEMORY-SYSTEM.md`).

## Kullanıcı verileri

Tek kullanıcı (Osman) vardır. Veriler yalnızca kendi cihazında tutulur, OSMAN AI'ın kendi sunucusunda (böyle bir sunucu yok) veya üçüncü bir tarafta saklanmaz.

## Dış hizmetler

Tek dış hizmet: GROQ API. Her sohbet isteğinde yalnızca o anki mesajlar + bağlam metni (profil özeti, aktif proje, kararlar, görevler, protokol/araştırma özeti) GROQ'a gönderilir. GROQ'un kullanıcı verilerini eğitim amacıyla kullanıp kullanmadığı bu doküman yazılırken bağımsız olarak doğrulanmamıştır — bu bilinen bir açık nokta olarak `23-RISKS.md`'de kayıtlıdır.

## Yedekler

`app/lib/dataManagement.js` → `exportAllData()`. Yedek dosyası (`.json`) kullanıcının kendi cihazına iner; OSMAN AI bu dosyayı hiçbir yere otomatik yüklemez.

## İçe/dışa aktarma

**Durum: ÇALIŞIYOR, doğrulamalı.** İçe aktarma öncesi `validateImportData()` (`app/lib/dataManagement.js`) her alanın beklenen tipte (dizi/nesne/string) olup olmadığını kontrol eder; yalnızca geçerli alanlar mevcut verinin **üzerine yazılır** (bu kısım hâlâ geri alınamaz, `window.confirm()` ister), geçersiz/eksik şekilli alanlar dokunulmadan atlanır ve kullanıcıya Türkçe bir rapor gösterilir. Sayfa yenilemesi otomatik değildir — kullanıcı raporu okuduktan sonra "Tamam, Sayfayı Yenile" ile devam eder.

## Genel hata sınırı (error boundary)

**Durum: ÇALIŞIYOR.** `app/error.js`, beklenmeyen herhangi bir render hatasını (ör. doğrulama adımını atlayan, elle bozulmuş bir localStorage değeri) yakalar ve beyaz ekran yerine "Tekrar dene" veya "Tüm Veriyi Temizle ve Yeniden Başlat" seçeneği sunan bir kurtarma ekranı gösterir. Temizleme onay ister ve geri alınamaz.

## XSS riski

Kullanıcı girdisi (sohbet mesajları, form alanları) React tarafından varsayılan olarak kaçışlanır (`{content}` JSX ifadesi, `dangerouslySetInnerHTML` hiçbir yerde kullanılmaz). Bugün bilinen bir XSS açığı yoktur.

## Prompt injection

Sohbet mesajları ve bağlam metni doğrudan GROQ'a gönderilir. Kullanıcı (Osman) kendi verisine prompt injection girmiş olsa bile bunun tek etkisi kendi sohbetidir — çok kullanıcılı bir sistem olmadığı için başka bir kullanıcıyı etkileme riski yoktur. **Durum: düşük risk, aktif olarak azaltılmamış** (özel bir prompt injection filtresi yok).

## Yetkilendirme

Uygulamada oturum açma/kullanıcı hesabı sistemi yoktur (ERTELENDİ). Uygulamaya erişebilen herkes tüm verileri görebilir/değiştirebilir — bu tek kullanıcılı, kişisel kullanım senaryosu için kabul edilmiş bir risktir.

## Oran sınırlama (rate limiting)

**Durum: ÇALIŞIYOR.** `app/api/chat/rateLimit.js`, `/api/chat` POST uç noktasını IP başına 5 dakikada 20 istekle sınırlar (normal bir sohbet kullanımı için bolca yeterli, art arda otomatik kötüye kullanımı engelleyecek kadar sıkı). Limit aşılırsa `429` durum koduyla Türkçe, bekleme süresini belirten bir hata döner. Bu kontrol, GROQ anahtarının varlığından bile önce yapılır — amaç yalnızca gerçek AI isteklerini değil, uç noktaya yapılan her türlü kötüye kullanımı erken reddetmektir.

**Sınır (dürüstçe belirtilmeli):** Bu, Vercel'in serverless yapısında bellek-içi (in-memory) bir sayaçtır — yalnızca aynı sıcak (warm) fonksiyon örneği içinde kalıcıdır, soğuk başlangıçta veya farklı bir bölgede/örnekte sıfırlanır. Ücretli bir servis veya yeni bir veritabanı gerektirmeyen en basit yöntemdir, ama global/dağıtık bir garanti **değildir** — birden fazla kaynaktan gelen dağıtık bir saldırıyı tam olarak engelleyemez. Test kapsamı: `tests/rateLimit.test.mjs`.

## Kullanıcı onayı

Silme (`RecordListPanel` → Sil), profil sıfırlama, veri temizleme ve içe aktarma işlemleri `window.confirm()` ile onay ister. Bu, Core Brain'in "onay olmadan yıkıcı işlem yapılmaz" ilkesinin UI'daki karşılığıdır.

## Finansal işlemler

Uygulama hiçbir ödeme işlemi gerçekleştirmez, hiçbir ödeme bilgisi toplamaz. AI Payment Protocol yalnızca bir araştırma kaydıdır (bkz. `12-AI-PAYMENT-PROTOCOL.md`).

## Silme işlemleri

Tüm silme işlemleri (tekil kayıt sil, tüm veriyi temizle) onay ister. Protected (`ai-security-protocol`, `ai-payment-protocol` gibi kavramsal olarak sabit kayıtlar — bugün bunlar tekil kayıt oldukları için zaten silme arayüzleri yok) kayıtlar silinemez.

## Domain değişiklikleri

Vercel domain ekleme/kaldırma bu dokümantasyon çalışmasının kapsamı dışındadır ve her zaman kullanıcı onayı gerektirir (bkz. `20-DEVELOPMENT-WORKFLOW.md` → Yıkıcı işlemler).

## Ücretli planlar

Bugün hem GROQ hem Vercel ücretsiz plandadır. Ücretli plana geçiş önerisi her zaman açıkça belirtilir ve onay gerektirir.

## Bağımlılık güvenliği

`package.json` yalnızca 3 doğrudan bağımlılık içerir: `next`, `react`, `react-dom`. `npm audit`, bu dokümantasyon çalışması sırasında `next`'in görsel optimizasyon (sharp/libvips) bağımlılığında yüksek önem dereceli bir bulgu göstermiştir; bu uygulama `next/image` kullanmadığı için pratikte tetiklenmeyen bir yüzeydir (bkz. `23-RISKS.md`).

## Loglarda gizli veri

`app/api/chat/route.js` içindeki `console.error` çağrıları (`GROQ_API_ERROR`, `GROQ_REQUEST_FAILED`) yalnızca hata durumunu ve HTTP durumunu loglar; API anahtarını asla loglamaz.
