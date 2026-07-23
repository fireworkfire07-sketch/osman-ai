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

## Sohbeti ana ekran yapma

**Commit:** `518c580` — "Make chat the default visible panel on the homepage"

`ChatPanel.js` zaten her gereksinimi karşılıyordu; tek eksik varsayılan açılış ekranının Özet olmasıydı. `page.js`'de `panel` state'inin varsayılanı `"chat"` yapıldı. Başka hiçbir dosya değişmedi.

## Premium tasarım sistemi sprinti — sidebar, tek tasarım dili, dijital ikiz bağlamı

**Commit:** (bu değişiklik ile oluşturuldu — bkz. commit geçmişi)

Teknik olarak çalışan ama amatör görünen arayüz, mevcut `/api/chat`, veri katmanı ve testler bozulmadan yeniden tasarlandı:

- **Sidebar gezinmesi:** `Nav.js` + `StatusBar.js` kaldırıldı, yerine `Sidebar.js` geldi — masaüstünde sabit sol sidebar, mobil/tablette (<1024px) açılır/kapanır menü. Yatay sekme scroll'u tamamen kaldırıldı.
- **Sohbet ana odak:** İlk açılışta uzun profil metni yerine kısa bir karşılama ("Merhaba Osman. Bugün ne üzerinde çalışıyoruz?") ve 3 hızlı başlangıç önerisi gösteriliyor.
- **Tek tasarım sistemi:** `globals.css` CSS değişkenleriyle (renk/boşluk/radius) baştan yazıldı; tek vurgu rengi, tutarlı tipografi, tüm panellerde aynı kart/form/buton ölçüleri.
- **Genel liste bileşeni genişletildi:** `RecordListPanel.js` artık arama, durum/öncelik filtresi, tıklayınca açılan detay görünümü ve gizlenebilir ekleme formu sunuyor — Projeler/Görevler/Kararlar/Hafıza/Araştırmalar aynı bileşeni kullanmaya devam ediyor.
- **Özet ekranı yeniden tasarlandı:** "Bugünkü Durum" başlığı altında 4 sade kart (Aktif Proje/Açık Görev/Bekleyen Karar/Hafıza Kaydı, anlamsız "0" yerine açıklayıcı boş durum metni) + Bugün/Yaklaşan Görevler/Son Kararlar liste bölümleri.
- **Dijital ikiz bağlamı genişletildi:** `context.js` artık kayıtlı **tüm projelerin** isim ve durumunu (ilk 10, bağlam sınırı korunarak) sohbete gönderiyor; Brain'e "kayıtlı isim/durumları kullan, bilmediğini 'Bu bilgi kayıtlı değil' diyerek belirt" kuralı eklendi — `/api/chat` ve GROQ entegrasyonu hiç değişmedi.
- **Nested scroll düzeltildi:** Panellerdeki sabit `max-height:45vh` kaldırıldı; ana içerik alanı tek bir kontrollü scroll kullanıyor, sohbet ekranı kendi mesaj listesini ayrı kaydırıyor (sabit alt giriş kutusu).

`tests/context.test.mjs`'e yeni bağlam alanı (`allProjects`) için 2 test eklendi (toplam 20 test, `npm test` ile hâlâ çalışıyor). Hiçbir localStorage anahtarı, veri şekli veya API sözleşmesi değişmedi; migration gerekmedi.

## Değişiklik kaydetme kuralı

Her yeni sürüm/sprint tamamlandığında bu dosyaya yeni bir bölüm eklenir: sürüm adı, gerçek commit SHA'sı, kısa ve doğru bir özet.
