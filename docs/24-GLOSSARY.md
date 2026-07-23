# 24 — Terimler Sözlüğü

**Active Project (Aktif Proje)** — Aynı anda seçili olan tek proje; sohbet bağlamına otomatik eklenir. Kod: `app/lib/data/activeProject.js`.

**Core Brain** — OSMAN AI'ın değişmeyen davranış çekirdeği. Kod: `app/lib/core/`.

**Collection (`collection.js`)** — Liste tipi veriler (Projects, Decisions, Tasks, vb.) için paylaşılan CRUD fabrikası.

**Context Builder** — Değişken veriyi (profil, aktif proje, kararlar, görevler, protokol/araştırma özeti) sohbet isteğine eklenecek bağlam metnine çeviren mekanizma. Kod: `app/lib/context.js`.

**Dashboard (Özet)** — Uygulamanın varsayılan açılış ekranı; kart sayaçları + Bugün paneli.

**Digital Twin (Dijital İkiz)** — OSMAN AI'ın Osman'ın profilini/tercihlerini/kararlarını temel alarak cevap üretme yaklaşımı.

**Future Problems (Gelecek Problemleri)** — Henüz projeye dönüşmemiş fikir/problem takip listesi. Kod: `app/lib/data/futureProblems.js`.

**GROQ** — OSMAN AI'ın kullandığı ücretsiz, kredi kartsız AI API sağlayıcısı. Model: `llama-3.3-70b-versatile`.

**Master Spec** — Bu doküman seti; OSMAN AI'ın anayasası.

**personality.js / brain.js** — Core Brain'in iki alt dosyası: kimlik/ses tonu (personality) ve karar/davranış kuralları (brain).

**Project Analyzer** — Proje kaydına eklenen 5 alan (güçlü/zayıf yönler, riskler, teknik borç, sonraki öneri); ayrı bir sistem değildir.

**Protected (korumalı) kayıt** — Silinemeyen kayıt (örn. varsayılan proje kaydı, tekil protokol kayıtları).

**SingleRecordPanel** — Tekil kayıtları (Profil, AI Security/Payment Protocol) düzenlemek için paylaşılan arayüz bileşeni.

**RecordListPanel** — Liste tipi verileri düzenlemek için paylaşılan arayüz bileşeni.

**Stratejik Protokol** — AI Security Protocol veya AI Payment Protocol; Osman'ın sürekli geliştirdiği, silinemez, araştırma aşamasındaki iki proje.

**STORAGE_KEYS** — Tüm localStorage anahtarlarının tek kaynağı. Kod: `app/lib/data/keys.js`.

**Streaming (akan) cevap** — GROQ'tan gelen token'ların tek seferde değil, üretildikçe tarayıcıya akıtılması. Kod: `app/api/chat/route.js` → `streamGroqTokens()`.

**Uygulama onayı** — Kullanıcının "uygula" veya eşdeğer bir ifadeyle verdiği, kod değişikliği yapılması için gereken açık izin.

**Yıkıcı işlem** — Geri alınması zor/imkânsız işlem (repo/proje/domain silme, force push, ücretli plana geçiş, veritabanı silme).
