# 20 — Geliştirme Akışı

Bu doküman `CLAUDE.md` ile birlikte okunmalıdır; `CLAUDE.md` bu akışın Claude Code'a verilen kısa, doğrudan talimat hâlidir.

## Her değişiklikte izlenen 15 adım

1. Doğru repo doğrulanır (`fireworkfire07-sketch/osman-ai`, başka repo değil).
2. Mevcut mimari incelenir (`docs/06-ARCHITECTURE.md`, ilgili kod dosyaları).
3. Geri dönüş noktası oluşturulur (mevcut commit zaten `main`'de ve push edilmiş durumdaysa, bu noktanın kendisi geri dönüş noktasıdır; gerekiyorsa ek bir git tag atılır).
4. Gereksiz dosya açılmaz (bkz. `05-PRINCIPLES.md` madde 12).
5. Mevcut ortak bileşenler kullanılır (`collection.js`, `singleRecord.js`, `RecordListPanel.js`, `SingleRecordPanel.js`).
6. Kod uygulanır.
7. `npm run build` yapılır.
8. Testler çalıştırılır (bkz. `19-TESTING-STANDARDS.md`).
9. Hata düzeltilir.
10. Commit oluşturulur (açıklayıcı mesajla, "neden" odaklı).
11. Push yapılır (`git push -u origin main`).
12. Vercel deploy kontrol edilir (`list_deployments` / `get_deployment`).
13. Runtime hataları incelenir (`get_runtime_errors`).
14. Sonuç raporlanır (değişen dosyalar, build/test sonucu, commit SHA, bilinen eksikler).
15. `docs/25-CHANGELOG.md` güncellenir.

## Yıkıcı işlemler — her zaman kullanıcı onayı gerektirir

- Repo silme
- Proje silme (Vercel projesi)
- Domain silme
- Environment Variable silme
- Ücretli plana geçme
- Veritabanı silme
- Büyük mimari değişiklik (örn. Core/Data ayrımının kaldırılması, yeni bir depolama sistemine geçiş)
- Geçmişi force push ile değiştirme

## Mimari değişikliği gerekiyorsa

`05-PRINCIPLES.md` madde 12 gereği yeni özellik mevcut mimariye oturtulur. Eğer gerçekten mevcut mimari yetersiz kalıyorsa (örn. yeni bir veri türünün ne `collection.js` ne `singleRecord.js` şablonuna uyduğu bir durum), önce **neden** gerektiği açıklanır, sonra uygulanır — sessizce değiştirilmez.

## Claude Code'un rolü

Claude Code bu projede geliştirme ve deploy doğrulama ajanıdır (bkz. `22-DECISIONS.md`). GitHub ve Vercel MCP araçlarını varsayılan olarak kullanır; kullanıcıya "Vercel'e gir" veya "GitHub'a bak" demek yerine bu araçlarla kendi doğrulamasını yapar. Yıkıcı olmayan okuma/doğrulama işlemlerini onay beklemeden yapar; yıkıcı işlemler için her zaman durur ve sorar.

## Referans komut

Bu Master Spec'ten sonra, yeni bir geliştirme talebi şu şekilde başlatılır:

> "Önce docs/00-MASTER-SPEC.md ve CLAUDE.md dosyalarını oku. İstenen geliştirmeyi MASTER SPEC v1.0 kurallarına göre uygula."
