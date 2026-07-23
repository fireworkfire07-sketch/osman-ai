# OSMAN AI

Osman'ın kişisel dijital ikizi: proje yöneticisi, fikir ortağı, araştırma asistanı ve teknoloji/sanat danışmanı. Next.js üzerinde çalışır, ücretsiz GROQ API'sinden gerçek AI cevapları üretir.

## Mevcut durum

Sohbet, Osman Profili, Kişisel Hafıza, Proje/Görev/Karar sistemi, Gelecek Problemleri Araştırması, AI Security Protocol, AI Payment Protocol, Dashboard (Özet), Sistem Durumu ve Veri Yönetimi katmanları çalışıyor. Ayrıntılı durum tablosu ve neyin planlanıp neyin henüz kurulmadığı için: **[docs/00-MASTER-SPEC.md](docs/00-MASTER-SPEC.md)**.

## Çalıştırma

```bash
npm install
cp .env.example .env.local
```

`.env.local` içine GROQ anahtarını yaz:

```
GROQ_API_KEY=BURAYA_ANAHTARI_YAPISTIR
```

Sonra:

```bash
npm run dev
```

`http://localhost:3000` adresini aç.

## Environment Variable

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `GROQ_API_KEY` | Evet | [console.groq.com](https://console.groq.com) üzerinden ücretsiz, kredi kartsız alınır |
| `GROQ_MODEL` | Hayır | Varsayılan `llama-3.3-70b-versatile` |

## Deployment

Production: `osman-ai.vercel.app` — Vercel projesi `osman-ai`, GitHub `main` dalına her push otomatik deploy tetikler. API anahtarı yalnızca Vercel Environment Variables'da tutulur, hiçbir zaman frontend koduna yazılmaz.

## Dokümantasyon

Bu projenin tüm vizyonu, mimarisi, veri modeli, kuralları ve yol haritası `docs/` klasöründedir. Başlangıç noktası: **[docs/00-MASTER-SPEC.md](docs/00-MASTER-SPEC.md)**.

Geliştirme yapacaksan önce **[CLAUDE.md](CLAUDE.md)** ve **[CONTRIBUTING.md](CONTRIBUTING.md)** dosyalarını oku.

## Güvenlik

API anahtarları sunucu tarafında kalır, `.env` dosyaları GitHub'a yüklenmez. Ayrıntı: **[docs/18-SECURITY-AND-PRIVACY.md](docs/18-SECURITY-AND-PRIVACY.md)**.

## Durum notu

Bu, tek kullanıcılı (Osman), kişisel kullanım için geliştirilen bir projedir. Aylık zorunlu maliyet hedefi 0 TL'dir (GROQ ücretsiz kota + Vercel ücretsiz plan + localStorage).
