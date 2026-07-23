# CLAUDE.md — OSMAN AI Çalışma Talimatı

Bu dosya, Claude Code'un (veya bu repo üzerinde çalışan başka bir AI ajanının) her oturuma başlarken okuması gereken kısa, doğrudan talimattır. Ayrıntı için `docs/00-MASTER-SPEC.md`'ye bakılmalıdır — bu dosya onun özetidir, yerine geçmez.

## Önce oku

Herhangi bir geliştirme talebine başlamadan önce:
1. `docs/00-MASTER-SPEC.md`
2. `docs/06-ARCHITECTURE.md`
3. İlgili konudaki spesifik doküman (ör. proje sistemi için `docs/09-PROJECT-SYSTEM.md`)

## Repo

Yalnızca `fireworkfire07-sketch/osman-ai` reposunda çalış. Başka bir repoya (örn. `shp-engine`) hiçbir dosya ekleme, hiçbir dosya değiştirme.

## Değişmez kurallar

- OSMAN AI sıradan bir chatbot değildir (bkz. `docs/01-VISION.md`).
- Mevcut çalışan çekirdek korunur — hiçbir sprint bir önceki sprintin çalışan özelliğini bozmaz.
- Önce en küçük çalışan sistem, sonra geliştirme.
- Test edilmemiş özellik "çalışıyor" sayılmaz.
- Ücretsiz olmayan bir servis ücretsizmiş gibi sunulmaz.
- Kullanıcı onayı olmadan yıkıcı işlem yapılmaz (bkz. `docs/20-DEVELOPMENT-WORKFLOW.md` → Yıkıcı işlemler).
- Projeler ve repolar birbirine karıştırılmaz.
- Osman çoğunlukla telefon ve tablet kullanır; teknik anlatım sade ve tek yollu olmalıdır.
- Kod değişikliklerinde eksiksiz dosya içeriği verilir, parça satır değil.
- Aynı veri iki ayrı yerde gereksiz biçimde tutulmaz.
- Yeni özellik mevcut mimariye (`collection.js`, `singleRecord.js`, `RecordListPanel`, `SingleRecordPanel`) oturtulur; yeni bir CRUD sistemi yazılmaz.

**Üst ilke:** Kullanıcının uzun vadeli hedeflerini kısa vadeli kolaylıklara feda etme.

## Her değişiklikte otomatik olarak yapılanlar

Kullanıcıya tek tek sorulmadan:

1. Build (`npm run build`)
2. Test (mevcut sınırlar dahilinde — bkz. `docs/19-TESTING-STANDARDS.md`)
3. Commit
4. Push
5. Vercel deployment durumunu doğrulama (GitHub/Vercel MCP araçlarıyla)
6. Runtime hatalarını kontrol etme
7. Sonucu kullanıcıya özetleme

Kullanıcıya "Vercel'e gir" veya "GitHub'a bak" denmez — bu araçlar doğrudan kullanılır.

## Yıkıcı işlemler — her zaman onay iste

Repo/proje/domain silme, Environment Variable silme, ücretli plana geçiş, veritabanı silme, büyük mimari değişiklik, force push.

## Mimari değişikliği gerekiyorsa

Önce nedenini açıkla, sonra uygula. Sessizce değiştirme.

## Doğrulanmamış iddia yasağı

Bir özelliğin çalıştığını, bir testin geçtiğini veya bir deployment'ın başarılı olduğunu gerçekten doğrulamadan söyleme. `docs/19-TESTING-STANDARDS.md`'deki bilinen sınırlamaları (örn. production'a POST atılamaması) her raporda açıkça belirt.

## Referans komut

Bundan sonraki geliştirme talepleri şu şekilde başlar:

> "Önce docs/00-MASTER-SPEC.md ve CLAUDE.md dosyalarını oku. İstenen geliştirmeyi MASTER SPEC v1.0 kurallarına göre uygula."

Bu talimatı aldığında önce ilgili dokümanları oku, mevcut kodu incele, sonra uygula.
