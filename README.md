# OSMAN AI — V2

Osman'ın kişisel dijital zekâsı. V1'in çalışan sohbet ekranının üzerine Osman profili, proje hafızası ve karar hafızası eklendi.

## Kullanılan teknolojiler

- Next.js (web arayüzü)
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

## Şu an çalışan özellikler

- Kullanıcı mesajı gönderme, GROQ üzerinden gerçek AI cevabı alma
- Sistem durumu göstergesi (sistem çalışıyor / AI bağlantısı çalışıyor / hafıza çalışıyor)
- Türkçe, anlaşılır hata mesajları
- Mobil ve tablet uyumlu koyu tema arayüz
- **Osman Profili**: meslekler, yetenekler, ilgi alanları, girişimcilik/vizyon, çalışma şekli, cevap tercihleri — görüntülenebilir, düzenlenebilir, varsayılana sıfırlanabilir
- **Proje hafızası**: her projede amaç, durum, teknoloji, repo, son yapılan işlem, sonraki adım, öncelik — eklenebilir, düzenlenebilir, silinebilir; aynı anda tek bir **aktif proje** seçilir
- **Karar hafızası**: tarihli, ilgili projeye bağlı kararlar — eklenebilir, silinebilir
- Sohbet cevabı üretilirken Osman'ın profili, aktif projesi ve son kararları otomatik olarak AI'a bağlam olarak verilir
- İlk açılışta (sohbet geçmişi boşken) Osman'ı tanıyan sabit bir karşılama mesajı gösterilir
- Önceden yüklenmiş iki stratejik araştırma projesi: **AI Security Protocol** ve **AI Payment Protocol**

## Hafıza nerede tutuluyor?

**Tarayıcının `localStorage`'ında — cihaz üzerinde, sunucuda değil.** Vercel'in sunucu fonksiyonları her istekte sıfırdan çalıştığı için (disk üzerinde kalıcı hafızası yoktur) profil/proje/karar verisi tarayıcıda saklanır ve her sohbet isteğiyle birlikte sunucuya gönderilir.

**Önemli sınır:** Bu veri yalnızca kullandığın cihaz/tarayıcıda kalır — telefon ile tablet arasında otomatik senkronize olmaz. Tarayıcı verilerini temizlersen (veya farklı bir cihaz/tarayıcı kullanırsan) profil/proje/karar hafızası da o cihazda sıfırdan başlar. Cihazlar arası senkronizasyon istenirse bir sonraki aşamada ücretsiz bir veritabanı (ör. Supabase) eklenir.

## Henüz yok (sonraki sürüm)

- Cihazlar arası hafıza senkronizasyonu
- Sohbet geçmişinin ayrıca dışa aktarılması
- Gelişim Motoru / Gelecek Araştırma Motoru gibi otonom V3 modülleri (bunlar bilinçli olarak eklenmedi — bkz. aşağıdaki not)

## V3 hakkında not

V3 tanımındaki "Gelişim Motoru" ve "Gelecek Araştırma Motoru" gibi kendi kendine öneri üreten otonom sistemler bu sürümde **kurulmadı**. Bunlar sürekli çalışan (zamanlanmış) arka plan görevleri gerektirir ve V3'ün kendi kuralı da onay olmadan hiçbir kritik değişiklik yapılmamasını şart koşar. Bunun yerine V3'ün stratejik içeriği — Osman'ın araştırmacı/yatırımcı vizyonu ve AI Security/Payment Protocol projeleri — profile ve proje hafızasına veri olarak işlendi. Otonom motorları kurmak istersen bu ayrı, açıkça onaylanmış bir sonraki adım olmalı.
