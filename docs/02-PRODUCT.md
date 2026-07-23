# 02 — Ürün

Bu doküman, OSMAN AI'ın bugün gerçekten ne olduğunu anlatır. Hayalî veya planlanan hiçbir özellik burada "mevcut" gibi sunulmaz — mevcut olmayan her şey açıkça etiketlenmiştir.

## Ürün nedir?

Next.js ile yazılmış, Vercel'de barındırılan, tek sayfalık (client-side sekme geçişli) bir web uygulaması. Sunucu tarafında GROQ API'sine bağlanan tek bir API route'u (`/api/chat`) vardır. Kalan tüm veri tarayıcının `localStorage`'ında tutulur.

## Mevcut ekranlar (Sidebar gezinmesi)

`app/components/Sidebar.js` içindeki gerçek gezinme listesi. Masaüstünde sabit sol sidebar, mobil/tablette (<1024px) açılır/kapanır bir menü olarak çalışır. Birincil grup:

1. **Sohbet** (`chat`) — varsayılan açılış ekranı. Kısa karşılama + 3 hızlı başlangıç önerisi, Türkçe streaming AI cevabı. **ÇALIŞIYOR**
2. **Özet** (`ozet`) — "Bugünkü Durum" kartları (Aktif Proje/Açık Görev/Bekleyen Karar/Hafıza Kaydı) + Bugün/Yaklaşan Görevler/Son Kararlar listeleri. **ÇALIŞIYOR**
3. **Projeler** (`projeler`) — proje listesi + Project Analyzer alanları, arama/filtre, tıklayınca detay açılır. **ÇALIŞIYOR**
4. **Görevler** (`gorevler`) — görev listesi. **ÇALIŞIYOR**
5. **Kararlar** (`kararlar`) — karar listesi. **ÇALIŞIYOR**
6. **Hafıza** (`hafiza`) — Kişisel Hafıza listesi. **ÇALIŞIYOR**
7. **Araştırmalar** (`gelecek`) — Future Research kayıtları. **ÇALIŞIYOR**
8. **Profil** (`profil`) — Osman Profili, tek kayıt. **ÇALIŞIYOR**

İkincil grup (mevcut fonksiyonlar korunuyor, birincil listeyi kalabalıklaştırmamak için sidebar'da ayrı ve daha küçük bir bölümde):

9. **AI Security Protocol** (`security`) — tekil stratejik kayıt. **ÇALIŞIYOR** (veri/arayüz), **ARAŞTIRMA AŞAMASINDA** (içerik/vizyon)
10. **AI Payment Protocol** (`payment`) — tekil stratejik kayıt. **ÇALIŞIYOR** (veri/arayüz), **ARAŞTIRMA AŞAMASINDA** (içerik/vizyon)
11. **Sistem Durumu** (`sistem`) — SystemHealthPanel + Sürekli Gelişim Notları. **ÇALIŞIYOR**
12. **Veri Yönetimi** (`veri`) — yedekle/içe aktar/temizle. **ÇALIŞIYOR**

Aktif proje seçici ve AI/hafıza durum noktaları artık sidebar'ın alt kısmında (footer) yer alır; ayrı bir üst bar olarak gösterilmez.

## Kullanılan teknolojiler

- **Next.js 16** (App Router, Turbopack) — `package.json`
- **React 18**
- **GROQ API** (`llama-3.3-70b-versatile`, OpenAI-uyumlu `chat/completions`, `stream: true`) — ücretsiz, kredi kartsız
- **Vercel** — ücretsiz plan, GitHub entegrasyonu ile otomatik deploy
- **localStorage** — tek veri deposu, sunucu veritabanı yok
- **Claude Code** — geliştirme ve deploy doğrulama ajanı (bkz. `20-DEVELOPMENT-WORKFLOW.md`)

## Mevcut özellik listesi (durum etiketli)

| Özellik | Durum | Not |
|---|---|---|
| Türkçe sohbet, streaming cevap | ÇALIŞIYOR | `/api/chat` SSE parse edip token akıtıyor |
| Sohbet geçmişi kalıcılığı | ÇALIŞIYOR | `localStorage:osman-ai:chat-history` |
| Yeni Sohbet / Konuşmayı Dışa Aktar | ÇALIŞIYOR | `.txt` indirme |
| Sistem durumu göstergesi (sidebar alt kısmı) | ÇALIŞIYOR | AI bağlantısı + hafıza durumu |
| İlk açılışta hızlı başlangıç önerileri | ÇALIŞIYOR | 3 sabit öneri, tıklanınca gerçek mesaj olarak gönderilir |
| Osman Profili (CRUD) | ÇALIŞIYOR | Tekil kayıt, sıfırlanabilir |
| Proje hafızası (CRUD) | ÇALIŞIYOR | Liste, aktif proje seçimi |
| Project Analyzer alanları | ÇALIŞIYOR | Proje kaydına eklenmiş 5 alan, ayrı sistem değil |
| Görev sistemi (CRUD) | ÇALIŞIYOR | 4 durum: Bekliyor/Yapılıyor/Tamamlandı/Hata oluştu |
| Karar hafızası (CRUD) | ÇALIŞIYOR | Projeye bağlanabilir |
| Kişisel Hafıza (CRUD) | ÇALIŞIYOR | Kategori/başlık/içerik |
| Gelecek Problemleri Araştırması (CRUD) | ÇALIŞIYOR | Veri modeli var; **otomatik araştırma yapan bir motor yok** |
| AI Security Protocol (tekil kayıt) | ÇALIŞIYOR (veri) | İçerik ARAŞTIRMA AŞAMASINDA |
| AI Payment Protocol (tekil kayıt) | ÇALIŞIYOR (veri) | İçerik ARAŞTIRMA AŞAMASINDA |
| Dashboard kartları | ÇALIŞIYOR | Sayaçlar, mevcut state'ten türetilir |
| Bugün paneli | ÇALIŞIYOR | Son görev/karar/proje, açık araştırmalar |
| Sistem Durumu paneli | ÇALIŞIYOR | AI/hafıza/aktif proje/son hata/sürüm |
| Sürekli Gelişim Notları (CRUD) | KISMEN ÇALIŞIYOR | Manuel not; otonom öneri üretimi yok |
| Veri Yönetimi (yedekle/içe aktar/temizle) | ÇALIŞIYOR | Tüm `STORAGE_KEYS` kapsar |
| API anahtarı güvenliği | ÇALIŞIYOR | Yalnızca `process.env.GROQ_API_KEY`, sunucu tarafı |
| Cihazlar arası senkron | ERTELENDİ | localStorage cihaza bağlı |
| Otomatik test paketi (repoya commit edilmiş) | ERTELENDİ | Next 16'da `next lint` kaldırıldı, ESLint/Playwright devDependency eklenmedi |
| Mobil uygulama | ERTELENDİ | Yalnızca mobil uyumlu web arayüzü var |
| Kullanıcı hesabı/üyelik | ERTELENDİ | Tek kullanıcılı sistem |
| Otonom Gelişim/Araştırma Motoru | UZUN VADELİ HEDEF | Bilinçli olarak kurulmadı (bkz. `15-CONTINUOUS-IMPROVEMENT.md`) |

## Ortam değişkenleri

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `GROQ_API_KEY` | Evet | GROQ API anahtarı, yalnızca Vercel/`.env.local`'de, hiç frontend'e gitmez |
| `GROQ_MODEL` | Hayır | Varsayılan `llama-3.3-70b-versatile` |

## Dağıtım

Production: `osman-ai.vercel.app` (Vercel projesi `osman-ai`, GitHub reposu `fireworkfire07-sketch/osman-ai`, `main` dalına her push otomatik deploy tetikler).
