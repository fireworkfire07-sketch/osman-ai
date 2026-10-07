# OSMAN AI

Osman'ın kişisel dijital ikizi: proje yöneticisi, fikir ortağı, araştırma asistanı ve teknoloji/sanat danışmanı. Next.js üzerinde çalışır, ücretsiz GROQ API'sinden gerçek AI cevapları üretir.

## Mevcut durum

Sohbet, Osman Profili, Kişisel Hafıza, Proje/Görev/Karar sistemi, Gelecek Problemleri Araştırması, AI Security Protocol, AI Payment Protocol, Dashboard (Özet), Sistem Durumu ve Veri Yönetimi katmanları çalışıyor. Ayrıntılı durum tablosu ve neyin planlanıp neyin henüz kurulmadığı için: **[docs/00-MASTER-SPEC.md](docs/00-MASTER-SPEC.md)**.

## Akış (bir sohbet mesajı gönderildiğinde)

```
Tarayıcı (ChatPanel.js)
   → contextData (profil/aktif proje/kararlar/görevler/hafıza — page.js'den)
        + mesaj geçmişi + sabit ARACLAR listesi (agentTools.js)
   → POST /api/chat  (route.js — ince proxy, GROQ_API_KEY sunucuda kalır)
        buildDynamicContext() bağlamı SYSTEM_PROMPT'a ekler
        repo/kod ile ilgili bir soru mu? → GitHub API'den gerçek kanıt çekilir (bkz. aşağıda)
   → Groq (GROQ_API_KEY, model: GROQ_MODEL || openai/gpt-oss-120b)
        araç listesi varsa: stream:false, tool_calls ile döner
        yoksa: stream:true, düz metin token akışı döner
   ← ChatPanel araç çağrısı görürse (hafiza_ekle/karar_ekle/gorev_ekle/
     proje_guncelle/hafiza_ara) kendi tarafında çalıştırır (agentTools.js),
     sonucu tekrar Groq'a yollar (en fazla 4 tur) — route.js hiçbir aracı
     KENDİSİ çalıştırmaz, sadece Groq'a iletir.
```

Sunucu (Vercel) hiçbir kullanıcı verisini diskte tutmaz — tüm hafıza (profil, projeler, kararlar, görevler, kişisel hafıza) tarayıcının `localStorage`'ında durur (`app/lib/data/*`, `collection.js`/`singleRecord.js` fabrikaları). Her istekte bu veri istemciden sunucuya gönderilir, sunucu yalnızca Groq'a aktarır.

**Repo kendi kendini okuma aracı:** Kullanıcı "kodunu incele", "hangi dosyada" gibi bir şey sorarsa (`toolRouter.js` → `isRepositoryRequest`), sunucu `GITHUB_TOKEN` ile gerçek GitHub API'sinden ilgili dosyaları çeker (`githubRepository.js`, yalnızca `fireworkfire07-sketch/osman-ai` allowlist'i, `.env`/secret/credential adlı dosyalar hariç tutulur) ve modelin cevabındaki her dosya/satır iddiasını bu gerçek kanıtla karşılaştırır (`validateClaims.js`) — kanıtlanamayan iddia kullanıcıya hiç gösterilmez.

## Workflow'lar

**Bu repoda GitHub Actions workflow'u yok.** Deployment, Vercel'in GitHub entegrasyonu üzerinden otomatik olur: `main` dalına her push, Vercel'de yeni bir production deploy tetikler (bkz. "Deployment" bölümü). CI/CD anlamında ayrı bir tetikleyici veya cron yok; test/build kontrolü geliştirme sırasında elle (`npm run build`, `npm test`) yapılır.

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

## Environment Variable (secret)

Değerler burada **asla** yazılmaz — sadece isim ve amaç. Vercel → Project → Settings → Environment Variables (production) veya `.env.local` (yerel).

| Değişken | Zorunlu | Ne işe yarar |
|---|---|---|
| `GROQ_API_KEY` | Evet | [console.groq.com](https://console.groq.com) üzerinden ücretsiz, kredi kartsız alınır — sohbet cevaplarını ve araç çağırma döngüsünü üretir |
| `GROQ_MODEL` | Hayır | Varsayılan `openai/gpt-oss-120b` (kod: `app/api/chat/route.js`) |
| `GITHUB_TOKEN` | Hayır | Yalnızca kullanıcı "kodunu incele" gibi repo ile ilgili bir şey sorduğunda kullanılır (`app/lib/tools/githubRepository.js`); yoksa bu tür sorulara "Repository'ye erişemedim" cevabı verilir, sohbetin geri kalanı etkilenmez |

## Deployment

Production: `osman-ai.vercel.app` — Vercel projesi `osman-ai`, GitHub `main` dalına her push otomatik deploy tetikler. API anahtarı yalnızca Vercel Environment Variables'da tutulur, hiçbir zaman frontend koduna yazılmaz.

> **Not:** Bu otomatik deploy, GitHub Actions'taki "re-run" ile aynı mantık taşır — Vercel her zaman `main`'de o an duran kodu deploy eder, bir önceki push'un kodunu değil. Bir PR merge edilene kadar branch'teki değişiklik production'a yansımaz.

## Dokümantasyon

Bu projenin tüm vizyonu, mimarisi, veri modeli, kuralları ve yol haritası `docs/` klasöründedir. Başlangıç noktası: **[docs/00-MASTER-SPEC.md](docs/00-MASTER-SPEC.md)**.

Geliştirme yapacaksan önce **[CLAUDE.md](CLAUDE.md)** ve **[CONTRIBUTING.md](CONTRIBUTING.md)** dosyalarını oku.

## Güvenlik

API anahtarları sunucu tarafında kalır, `.env` dosyaları GitHub'a yüklenmez. Ayrıntı: **[docs/18-SECURITY-AND-PRIVACY.md](docs/18-SECURITY-AND-PRIVACY.md)**.

## Durum notu

Bu, tek kullanıcılı (Osman), kişisel kullanım için geliştirilen bir projedir. Aylık zorunlu maliyet hedefi 0 TL'dir (GROQ ücretsiz kota + Vercel ücretsiz plan + localStorage).

## Bilinen notlar / sorunlar

- **Groq ücretsiz plan TPM (dakikalık token) sınırı gerçek bir kısıt**: sistem promptu + araç tanımları + bağlam tek istekte 8.000 TPM'e yaklaşabiliyor. Bu yüzden `app/lib/core/brain.js`/`personality.js` bilinçli olarak kısa tutuluyor ve `app/lib/context.js` bağlamı `MAX_CONTEXT_CHARS` ile kırpıyor — proje/karar/görev sayısı arttıkça bu sınıra tekrar yaklaşılabilir.
- **`docs/06-ARCHITECTURE.md`'nin "İstek akışı" bölümü güncel değil**: yalnızca eski `stream:true` akışını anlatıyor, `araclar`/`tool_calls` (A2) yolunu içermiyor. Bu README'deki "Akış" bölümü güncel koda göre yazıldı; `docs/06-ARCHITECTURE.md`'yi güncellemek ayrı, küçük bir görev (davranış değiştirmiyor ama bu PR'ın kapsamı dışında tutuldu — bkz. Öneriler).
- **`claude/osman-ai-yapim-a0-2i3bx8` branch'inde henüz merge edilmemiş bir "Osman İkiz" özelliği var** (`brain/memory.json`, `scripts/agent.mjs`, `.github/workflows/osman-ikiz.yml` — GitHub Actions'ta otonom, günlük çalışan, kendi hafızasına yazan ayrı bir ajan). `main`'de değil, bu yüzden bu README'ye dahil edilmedi; merge edilirse "Workflow'lar" bölümü güncellenmeli.
- Test edilmemiş özellik yok gibi görünüyor ama gerçek production'a POST atarak doğrulama yapılamıyor (bkz. `docs/19-TESTING-STANDARDS.md`) — bu incelemede de `npm run build` (temiz) ve `npm test` (54/54) ile sınırlı kaldı.

