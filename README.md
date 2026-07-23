# OSMAN AI — V2–V5

Osman'ın dijital ikizi: kişisel yapay zekâsı, proje yöneticisi, fikir ortağı, araştırma asistanı ve iş geliştirme ortağı. Çalışan V1 sohbet çekirdeğinin üzerine katman katman eklendi; hiçbiri çalışan sohbeti/GROQ bağlantısını bozmadı.

## Kullanılan teknolojiler

- Next.js (web arayüzü, streaming API route)
- Vercel (ücretsiz barındırma)
- GROQ API (ücretsiz, kredi kartı istemeyen AI servisi, model: `llama-3.3-70b-versatile`)

## 1. GROQ API anahtarı alma (ücretsiz)

1. https://console.groq.com adresine git ve ücretsiz hesap aç.
2. Sol menüden **API Keys** bölümüne gir.
3. **Create API Key** butonuna bas, anahtarı kopyala.
4. Kredi kartı istenmez. Günlük 14.400 istek, dakikada 30 istek ücretsiz kotadır.

## 2. Yerelde çalıştırma

```bash
npm install
cp .env.example .env.local
```

`.env.local` dosyasını aç, şu satırı doldur:

```
GROQ_API_KEY=BURAYA_ANAHTARI_YAPISTIR
```

Sonra:

```bash
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

## 3. Vercel'e deploy etme

1. https://vercel.com adresinde ücretsiz hesabınla giriş yap.
2. **Add New → Project** ile bu GitHub reposunu (`fireworkfire07-sketch/osman-ai`) seç.
3. **Environment Variables** bölümüne git, şunu ekle:
   - Key: `GROQ_API_KEY`
   - Value: GROQ'dan aldığın anahtar
4. **Deploy** butonuna bas.

API anahtarı yalnızca Vercel'in sunucu tarafında tutulur, tarayıcı koduna hiçbir zaman yazılmaz.

## Mimari

```
app/lib/core/       Değişmez çekirdek — Personality + Brain (kimlik, karar prensipleri,
                     cevap kuralları, proje/para/sanat/girişimcilik/güvenlik yaklaşımı).
                     Yalnızca kod değişikliğiyle değişir, hiçbir ekrandan düzenlenemez.
app/lib/data/        Değişebilir veri. collection.js: liste tipi kayıtlar (projeler,
                     kararlar, görevler, kişisel hafıza, gelecek problemleri, sürekli
                     gelişim notları) için paylaşılan tek CRUD; singleRecord.js: tekil
                     kayıtlar (profil, AI Security/Payment Protocol) için paylaşılan
                     yükle/kaydet/sıfırla. options.js: paylaşılan öncelik seçenekleri.
                     Hepsi tarayıcı localStorage'ında.
app/lib/context.js   Değişken veriyi (profil + aktif proje + kararları + görevleri +
                     protokol/gelecek özetini) sunucuya gönderilecek bağlam metnine çevirir.
app/api/chat/route.js  Core + bağlamı birleştirir, GROQ'a stream:true ile gönderir,
                     token'ları anlık olarak tarayıcıya akıtır.
app/components/      RecordListPanel (liste CRUD) ve SingleRecordPanel (tekil kayıt)
                     her veri türü için yeniden kullanılır; DashboardCards + TodayPanel
                     Özet ekranını oluşturur.
app/page.js          Tüm katmanları yükleyip birbirine bağlayan ana ekran.
```

## Şu an çalışan özellikler

- **Özet** (ana sayfa) — Dashboard kartları (Aktif Proje, Toplam Proje, Görev/Karar/Hafıza/Araştırma sayıları, AI Security, AI Payment) ve **Bugün** bölümü (son görev/karar/proje, aktif projenin sonraki adımı, açık araştırmalar)
- Türkçe sohbet, GROQ'tan **canlı akan (streaming)** gerçek AI cevabı
- Sohbet geçmişi cihazda kalıcı — sayfa yenilenince kaybolmaz; **Yeni Sohbet** ve **Konuşmayı Dışa Aktar** (.txt) butonları
- Sistem durumu göstergesi + ayrıntılı **Sistem Durumu** paneli (AI bağlantısı, hafıza durumu, aktif proje, son hata, sürüm/build bilgisi)
- **Osman Profili** — meslekler, yetenekler, ilgi alanları, sanatsal alanlar, çalışma tercihleri, hedefler; görüntülenebilir, düzenlenebilir, varsayılana sıfırlanabilir
- **Proje hafızası** — amaç, durum, teknoloji, repo, çalışan/çalışmayan özellikler, hatalar, sonraki adım, öncelik, **Project Analyzer** (güçlü/zayıf yönler, riskler, teknik borç, sonraki öneri); tek bir **aktif proje** seçimi
- **Görev sistemi** — projeye bağlı, durumu (Bekliyor/Yapılıyor/Tamamlandı/Hata oluştu) ve test yöntemi olan görevler
- **Karar hafızası** — projeye bağlı, tarihli, durumlu kararlar
- **Kişisel Hafıza** — kategori/başlık/içerik ile manuel not kaydı
- **Gelecek Problemleri Araştırması** — başlık, problem, tahmini oluşma tarihi, etkilenen sektörler, mevcut çözümler, eksikler, Osman'ın çözüm fikri, ölçeklenebilirlik, risk, öncelik
- **AI Security Protocol** — problem, risk, güvenlik seviyesi, çözüm, kaynak, son güncelleme, araştırma notları (tekil, silinemez stratejik proje)
- **AI Payment Protocol** — senaryo, güven modeli, kimlik doğrulama, ödeme akışı, riskler, kullanıcı onayı, araştırma notları (tekil, silinemez stratejik proje)
- **Sürekli Gelişim Notları** — eksik/sebep/önerilen geliştirme/öncelik/durum kaydı (yalnızca not; otomatik uygulanmaz)
- **Veri Yönetimi** — tüm veriyi tek dosyada yedekle (indir), başka bir yedekten içe aktar, tüm veriyi temizle (hepsi onay ister)
- Sohbet her mesajda Osman'ın profilini, aktif projesini, o projenin kararlarını/görevlerini ve stratejik projelerin özetini otomatik olarak AI'a bağlam olarak verir
- İlk açılışta (sohbet geçmişi boşken) Osman'ı tanıyan sabit bir karşılama mesajı gösterilir, sonraki mesajlarda tekrarlanmaz

## Hafıza nerede tutuluyor?

**Tarayıcının `localStorage`'ında — cihaz üzerinde, sunucuda değil.** Vercel'in sunucu fonksiyonları her istekte sıfırdan çalıştığı için (disk üzerinde kalıcı hafızası yoktur) tüm veri tarayıcıda saklanır ve sohbet isteğiyle birlikte sunucuya gönderilir.

**Önemli sınır:** Bu veri yalnızca kullandığın cihaz/tarayıcıda kalır — telefon ile tablet arasında otomatik senkronize olmaz. Cihazlar arası taşımak istersen **Veri Yönetimi** panelinden yedek indirip diğer cihazda içe aktarabilirsin. Otomatik senkronizasyon istenirse bir sonraki aşamada ücretsiz bir veritabanı (ör. Supabase) eklenir.

## Bilinçli olarak eklenmeyenler

"Gelişim Motoru" ve "Gelecek Araştırma Motoru" gibi kendi kendine öneri üretip otomatik çalışan sistemler kurulmadı. Bunlar sürekli çalışan (zamanlanmış) arka plan görevleri gerektirir ve OSMAN AI'ın kendi kuralı da onay olmadan kritik değişiklik yapılmamasını şart koşar. Bunun yerine bu katman, Osman'ın manuel olarak dolduracağı bir "Sürekli Gelişim Notları" listesi olarak eklendi.

## Bilinen eksik: otomatik lint/test yok

Next.js 16, CLI'dan `next lint` komutunu kaldırdı ve bu projede ESLint/Jest/Playwright gibi bir test çerçevesi devDependency olarak eklenmedi. Her sprintte build + manuel Playwright kontrolü yapılıyor ama bu commit edilen, tekrar çalıştırılabilir bir test paketi değil. Kalıcı bir test çerçevesi eklemek istersen bu ayrı bir mimari karar olarak ele alınmalı.
