# 25 — Changelog

Bu changelog, gerçek git geçmişine dayanır (`git log`). Her girişte gerçek commit SHA'sı bulunur.

## V1 — Minimal çalışan sohbet arayüzü

**Commit:** `2c21543` — "Add OSMAN AI V1: minimal working chat web interface"

Next.js sohbet arayüzü, GROQ API bağlantısı (server-side, anahtar frontend'e hiç gitmiyor), koyu tema, mobil/tablet uyumlu tasarım, Türkçe hata mesajları, sistem durumu göstergesi.

## V2 — Osman Profili, Proje ve Karar Hafızası

**Commit:** `68142c0` — "Add OSMAN AI V2: Osman profile, project memory, decision memory"

Osman profili, varsayılan projeler (OSMAN AI, AI Security Protocol, AI Payment Protocol), localStorage tabanlı hafıza, sohbet bağlamına profil/proje/karar enjeksiyonu, Profil/Projeler/Kararlar panelleri, aktif proje seçici, ilk açılış karşılama mesajı.

## V3-V5 (1. tur) — Tam katman mimarisi

**Commit:** `b4b32aa` — "Add OSMAN AI V3-V5: full layer architecture on the working V1/V2 core"

Core (Personality+Brain) ile Data ayrımı kuruldu. Kişisel Hafıza, Görev Sistemi, Gelecek Problemleri, Protokoller (o zaman liste olarak), Sürekli Gelişim Notları, Sistem Durumu paneli, Veri Yönetimi (yedekle/içe aktar/temizle), streaming sohbet cevabı eklendi.

## V3-V5 (2. tur) — Araştırma/Protokol/Analyzer katmanları + Dashboard

**Commit:** `114db71` — "Add OSMAN AI V3-V5 sprint: research/protocol/analyzer layers + dashboard"

Future Research alan seti genişletildi, Project Analyzer alanları eklendi, AI Security/Payment Protocol tekil kayıtlara (kendi şemalarıyla) dönüştürüldü, `singleRecord.js` fabrikası eklendi (profile.js bu fabrikaya taşındı), `options.js` ile öncelik seçenekleri tekilleştirildi, Dashboard + Bugün paneli eklendi ve varsayılan açılış ekranı oldu, Brain'e sanat/girişimcilik kriterleri işlendi.

## Master Spec v1.0 — Dokümantasyon sistemi

**Commit:** (bu değişiklik ile oluşturuldu — bkz. commit geçmişi)

`docs/` klasörü altında 26 doküman, kök dizinde `CLAUDE.md` ve `CONTRIBUTING.md` eklendi; `README.md` sadeleştirilip ana dokümana bağlantı verildi. **Bu bir kod değişikliği değildir** — uygulama dosyalarına dokunulmadı.

## Değişiklik kaydetme kuralı

Her yeni sürüm/sprint tamamlandığında bu dosyaya yeni bir bölüm eklenir: sürüm adı, gerçek commit SHA'sı, kısa ve doğru bir özet.
