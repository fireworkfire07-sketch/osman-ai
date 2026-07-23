# OSMAN AI — V1

Osman'ın kişisel dijital çalışma asistanı. Bu sürüm en küçük çalışan sürümdür: tek sohbet ekranı, ücretsiz AI bağlantısı.

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
- Sistem durumu göstergesi (sistem çalışıyor / AI bağlantısı çalışıyor)
- Türkçe, anlaşılır hata mesajları
- Mobil ve tablet uyumlu koyu tema arayüz

## Henüz yok (sonraki sürüm)

- Sohbet geçmişinin sayfa yenilenince hatırlanması
- Hafızayı temizle / dışa aktar butonları
- Osman profili ve proje hafızası
