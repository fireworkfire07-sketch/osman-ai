# 00 — OSMAN AI Master Spec v1.0

## Bu dokümanın amacı

Bu doküman, OSMAN AI projesinin anayasasıdır. Repo içindeki `docs/` klasöründeki bütün diğer dokümanlar bu dosyanın altında, onu detaylandıran alt belgelerdir. Bundan sonra OSMAN AI üzerinde çalışacak herhangi bir kişi veya yapay zekâ ajanı (Claude Code dâhil), herhangi bir geliştirmeye başlamadan önce bu dosyayı ve `CLAUDE.md`'yi okumalıdır.

Bu doküman **fikir belgesi değildir**. Yalnızca gerçekten kurulmuş, çalışan veya doküman içinde açıkça "planlandı" olarak işaretlenmiş şeyleri anlatır. Durum etiketleri (ÇALIŞIYOR, KISMEN ÇALIŞIYOR, PLANLANDI, ARAŞTIRMA AŞAMASINDA, UZUN VADELİ HEDEF, ERTELENDİ) bu dokümanın her yerinde tutarlı biçimde kullanılır.

## OSMAN AI'ın kısa tanımı

OSMAN AI, Osman'ın kişisel dijital ikizi olarak tasarlanmış bir web uygulamasıdır. Next.js üzerinde çalışır, ücretsiz GROQ API'sinden gerçek AI cevapları üretir ve Osman'ın profilini, projelerini, kararlarını, görevlerini ve stratejik araştırma alanlarını tarayıcı `localStorage`'ında saklar. **Durum: ÇALIŞIYOR** (production'da, `osman-ai.vercel.app`).

## OSMAN AI'ın uzun vadeli hedefi

OSMAN AI'ın nihai amacı, sıradan bir sohbet botu olmaktan çıkıp Osman'ın deneyimlerini, yeteneklerini ve fikirlerini çalışan dijital sistemlere ve gelir üreten projelere dönüştüren bir çalışma ortağı olmaktır. Bu hedef `docs/21-ROADMAP.md`'de 10 aşamalı bir yol haritasına bölünmüştür — bugünkü ürün bu yolun yalnızca ilk birkaç aşamasındadır (**Durum: UZUN VADELİ HEDEF**, alt aşamalar için ayrı etiketler geçerlidir).

**Üst ilke:** Kullanıcının uzun vadeli hedeflerini kısa vadeli kolaylıklara feda etme.

## Osman'ın kimliği

Ayrıntılı profil `docs/03-OSMAN-PROFILE.md`'dedir. Özet: Osman profesyonel bir fotoğrafçı (turizm/otel fotoğrafçılığı), jonglör, ateş gösterisi performans sanatçısı, sanata değer veren bir girişimci/yatırımcı ve yapay zekâ teknolojileriyle ilgilenen biridir. Çoğunlukla telefon ve tablet kullanır, sade ve tek yollu teknik anlatım ister.

## Ürün felsefesi

- Önce en küçük çalışan sürüm, sonra geliştirme.
- Ücretsiz çalışma önceliklidir; ücretli bir servis gerekiyorsa bu açıkça söylenir.
- Test edilmemiş bir özellik "çalışıyor" sayılmaz.
- Kod tekrarından kaçınılır; yeni özellik mevcut mimariye (paylaşılan CRUD fabrikaları, paylaşılan bileşenler) oturtulur.

## Temel kullanıcı

Tek kullanıcı: Osman. Çok kullanıcılı bir sistem değildir, üyelik/oturum açma sistemi yoktur (**Durum: ERTELENDİ** — V1'den beri bilinçli olarak eklenmedi).

## Ana problemler (OSMAN AI'ın çözmeye çalıştığı)

1. Osman'ın projelerinin, kararlarının ve fikirlerinin dağınık kalması, unutulması.
2. Aynı teknik hataların ve kararların tekrar tekrar sorulması/tekrarlanması.
3. Fikirlerin somut, test edilebilir bir sonraki adıma dönüşmemesi.
4. Sanat/performans geçmişi ile teknoloji girişimciliğinin ayrı ayrı değerlendirilip birleştirilememesi.

## Ana değer önerisi

Tek bir yerde: Osman'ı tanıyan, projelerini karıştırmayan, her seferinde en küçük uygulanabilir adımı öneren, ücretsiz çalışan bir kişisel AI.

## Mevcut ürün durumu (özet — ayrıntı için 02-PRODUCT.md ve 06-ARCHITECTURE.md)

| Katman | Durum |
|---|---|
| Sohbet (Chat Layer), streaming AI cevabı | ÇALIŞIYOR |
| Core Brain / Personality (sabit sistem promptu) | ÇALIŞIYOR |
| Osman Profili | ÇALIŞIYOR |
| Kişisel Hafıza | ÇALIŞIYOR |
| Proje Hafızası + Project Analyzer alanları | ÇALIŞIYOR |
| Görev Sistemi | ÇALIŞIYOR |
| Karar Hafızası | ÇALIŞIYOR |
| Gelecek Problemleri Araştırması | ÇALIŞIYOR (veri modeli ve arayüz var; otonom araştırma motoru yok) |
| AI Security Protocol / AI Payment Protocol | ARAŞTIRMA AŞAMASINDA (veri kaydı olarak ÇALIŞIYOR; gerçek güvenlik/ödeme altyapısı yok) |
| Dashboard (Özet) + Bugün paneli | ÇALIŞIYOR |
| Sistem Durumu paneli | ÇALIŞIYOR |
| Veri Yönetimi (yedekle/içe aktar/temizle) | ÇALIŞIYOR |
| Sürekli Gelişim Motoru | KISMEN ÇALIŞIYOR (manuel not listesi var; otonom/kendi kendine öneri üreten motor yok) |
| Cihazlar arası senkronizasyon | ERTELENDİ |
| Otomatik lint/test paketi (repoya commit edilmiş) | ERTELENDİ |
| Mobil uygulama | ERTELENDİ |
| Çoklu AI sağlayıcı desteği | UZUN VADELİ HEDEF |

## Ana mimari (özet — ayrıntı için 06-ARCHITECTURE.md)

```
app/lib/core/    Değişmez çekirdek (Personality + Brain → SYSTEM_PROMPT)
app/lib/data/    Değişebilir veri: collection.js (liste CRUD) ve
                 singleRecord.js (tekil kayıt CRUD) üzerine kurulu modüller
app/lib/context.js   Değişken veriyi API'ye gönderilecek bağlam metnine çevirir
app/api/chat/route.js  Core + bağlamı birleştirir, GROQ'a stream:true ile gönderir
app/components/  Paylaşılan arayüz bileşenleri (RecordListPanel, SingleRecordPanel, ...)
app/page.js      Tüm katmanları yükleyip birbirine bağlayan ana ekran
```

## Temel modüller

Profile, Personal Memory, Projects (+ Project Analyzer), Tasks, Decisions, Future Problems, AI Security Protocol, AI Payment Protocol, Continuous Improvement, Chat History, Active Project, System Health, Data Management. Her biri `docs/07-DATA-MODEL.md`'de ayrıntılı belgelenmiştir.

## Güvenlik ilkeleri (özet — ayrıntı için 18-SECURITY-AND-PRIVACY.md)

API anahtarı yalnızca Vercel sunucu tarafında tutulur, frontend koduna hiç yazılmaz. Silme/temizleme işlemleri kullanıcı onayı ister. Hafıza yalnızca cihazın `localStorage`'ındadır.

## Ücretsiz çalışma hedefi

Aylık zorunlu maliyet 0 TL'dir: GROQ ücretsiz kota (kredi kartsız), Vercel ücretsiz plan, localStorage (ücretsiz, sunucu veritabanı yok). Ücretli bir servis eklenmeden önce bu açıkça belirtilir ve onay istenir.

## Geliştirme standartları (özet — ayrıntı için 20-DEVELOPMENT-WORKFLOW.md)

Build → test → commit → push → Vercel doğrulama → runtime kontrolü her değişiklikte otomatik yapılır. Yıkıcı işlemler (repo/proje/domain silme, ücretli plana geçiş) her zaman kullanıcı onayı gerektirir.

## Yol haritası (özet — ayrıntı için 21-ROADMAP.md)

10 aşama: Foundation → Digital Twin → Project Brain → Research Engine → Business Engine → Automation Engine → Multi-AI → Vision Engine → Life OS → Autonomous Company. Bugün Aşama 1-3 sınırında.

## Başarı ölçütleri

- Osman'a mesaj gönderilebiliyor ve gerçek AI cevabı geliyor mu?
- Profil/proje/karar/görev bilgisi sayfa yenilenince duruyor mu?
- API anahtarı hiçbir zaman frontend'de görünmüyor mu?
- Aylık maliyet 0 TL mi?
- Yeni özellik mevcut mimariyi bozmadan mı eklendi?

## Değişiklik yönetimi

Her önemli karar `docs/22-DECISIONS.md`'ye, her sürüm `docs/25-CHANGELOG.md`'ye eklenir. Mimaride gerçek bir değişiklik gerekiyorsa önce nedeni açıklanır (bkz. `CLAUDE.md`).

## Temel ilkeler (kısa liste)

- OSMAN AI sıradan chatbot değildir.
- Mevcut çalışan çekirdek korunur.
- Önce küçük çalışan sistem kurulur.
- Test edilmemiş özellik çalışıyor kabul edilmez.
- Ücretsiz olmayan servis ücretsizmiş gibi sunulmaz.
- Kullanıcı onayı olmadan yıkıcı işlem yapılmaz.
- Projeler ve repolar birbirine karıştırılmaz.
- Osman çoğunlukla telefon ve tablet kullanır.
- Teknik anlatım sade ve tek yollu olmalıdır.
- Kod değişikliklerinde eksiksiz dosya yaklaşımı tercih edilir.
- Aynı veri iki ayrı yerde gereksiz biçimde tutulmaz.
- Yeni özellik mevcut mimariye uyumlu olmalıdır.

## Diğer dokümanların dizini

| # | Dosya | Konu |
|---|---|---|
| 01 | VISION.md | Uzun vadeli vizyon |
| 02 | PRODUCT.md | Ürün tanımı, mevcut/planlanan özellikler |
| 03 | OSMAN-PROFILE.md | Osman'ın kimliği |
| 04 | CORE-BRAIN.md | Değişmez davranış çekirdeği |
| 05 | PRINCIPLES.md | Çalışma ilkeleri |
| 06 | ARCHITECTURE.md | Katmanlar, dosya yapısı |
| 07 | DATA-MODEL.md | Her veri türünün alanları |
| 08 | MEMORY-SYSTEM.md | Hafıza türleri ve sınırları |
| 09 | PROJECT-SYSTEM.md | Proje/görev/karar sistemi |
| 10 | RESEARCH-ENGINE.md | Gelecek Problemleri Araştırması |
| 11 | AI-SECURITY-PROTOCOL.md | Stratejik proje 1 |
| 12 | AI-PAYMENT-PROTOCOL.md | Stratejik proje 2 |
| 13 | ART-AND-AESTHETICS.md | Sanat değerlendirme kriterleri |
| 14 | BUSINESS-AND-INVESTMENT.md | Girişimcilik değerlendirme modeli |
| 15 | CONTINUOUS-IMPROVEMENT.md | Sürekli Gelişim Notları |
| 16 | SYSTEM-HEALTH.md | Sistem durumu paneli |
| 17 | AUTOMATION-ROADMAP.md | Otomasyon vizyonu (henüz kurulmadı) |
| 18 | SECURITY-AND-PRIVACY.md | Güvenlik ve gizlilik |
| 19 | TESTING-STANDARDS.md | Test akışı ve sınırları |
| 20 | DEVELOPMENT-WORKFLOW.md | Geliştirme süreci |
| 21 | ROADMAP.md | 10 aşamalı yol haritası |
| 22 | DECISIONS.md | Kayıtlı ana kararlar |
| 23 | RISKS.md | Bilinen riskler |
| 24 | GLOSSARY.md | Terimler sözlüğü |
| 25 | CHANGELOG.md | Sürüm geçmişi |

Kök dizinde ayrıca: `CLAUDE.md` (Claude Code için çalışma talimatı) ve `CONTRIBUTING.md` (katkı/geliştirme kuralları).
