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

**Commit:** `a3cec2e` — "docs: add OSMAN AI Master Spec v1.0"

`docs/` klasörü altında 26 doküman, kök dizinde `CLAUDE.md` ve `CONTRIBUTING.md` eklendi; `README.md` sadeleştirilip ana dokümana bağlantı verildi. Bu bir kod değişikliği değildi — uygulama dosyalarına dokunulmadı.

## Kritik/Yüksek düzeltme sprinti — teknik denetim bulgularının giderilmesi

**Commit:** (bu değişiklik ile oluşturuldu — bkz. commit geçmişi)

Master Spec sonrası yapılan teknik denetimde bulunan Kritik ve Yüksek öncelikli 5 soruna karşılık:

- **İçe aktarma artık çökmüyor:** `validateImportData()` her alanın tipini doğruluyor, uyuşmayanlar Türkçe raporla atlanıyor, mevcut veri bozulmuyor.
- **Genel hata sınırı:** `app/error.js`, herhangi bir beklenmeyen render hatasını (bozuk import dışındaki senaryolar dahil) yakalayıp güvenli bir kurtarma ekranı gösteriyor — doğrulandı: elle bozulmuş bir localStorage değeriyle gerçekten tetiklenip "Tüm Veriyi Temizle" ile gerçekten kurtarıyor.
- **Oran sınırlama:** `/api/chat`, IP başına 5 dakikada 20 istekle sınırlı (ücretsiz, veritabanısız, Vercel-uyumlu en basit yöntem); gerçek sunucuda 22 art arda istekle doğrulandı (20 geçti, 21. ve sonrası 429 Türkçe mesajla reddedildi).
- **Bağlam sınırlama:** Sohbete gönderilen kararlar/görevler son 5 kayıtla, toplam bağlam 4.000 karakterle sınırlandı; Core Brain ve profil değişmedi.
- **Şema sürümleme ve göç:** `app/lib/data/schema.js`, tek kaynaklı sürüm + yedekten-geri-yükleyen göç altyapısı ekliyor; bozuk bir göç adımıyla gerçek geri yükleme testle doğrulandı.
- **Sessiz hata yutma bitti:** `storage.js` artık son hatayı saklıyor, Sistem Durumu panelinde gösteriliyor; simüle edilmiş kota hatasıyla doğrulandı.

`tests/` altında Node'un yerleşik test çalıştırıcısıyla (`npm test`, yeni bağımlılık yok) 18 otomatik test eklendi. Hiçbir mevcut özellik kaldırılmadı, hiçbir ücretli servis/veritabanı eklenmedi.

## Değişiklik kaydetme kuralı

Her yeni sürüm/sprint tamamlandığında bu dosyaya yeni bir bölüm eklenir: sürüm adı, gerçek commit SHA'sı, kısa ve doğru bir özet.
