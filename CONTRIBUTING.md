# CONTRIBUTING — OSMAN AI

Bu proje şu an tek geliştirici (Osman) ve tek geliştirme ajanı (Claude Code) tarafından yürütülüyor. Bu doküman, gelecekte başka biri (insan veya AI) katkı sağlarsa uyulması gereken kuralları tanımlar.

## Başlamadan önce

1. `docs/00-MASTER-SPEC.md`'yi oku.
2. `docs/06-ARCHITECTURE.md`'yi oku.
3. Değiştireceğin katmanla ilgili spesifik dokümanı oku (bkz. `docs/00-MASTER-SPEC.md` → Diğer dokümanların dizini).

## Kod stili

- JavaScript (TypeScript değil) — repo bilinçli olarak sade tutuluyor.
- `"use client"` yalnızca gerçekten istemci tarafı state/etkileşim gereken bileşenlerde.
- Yorumlar yalnızca "neden" açıklaması gerektiğinde yazılır; "ne yaptığı" zaten isimlendirmeden anlaşılmalı.
- Türkçe alan adları ve kullanıcıya gösterilen metinler için Türkçe kullanılır (kod anahtar kelimeleri İngilizce kalır).

## Yeni bir veri türü eklerken

- Liste tipi bir veri mi (birden fazla kayıt)? → `app/lib/data/collection.js`'yi kullan.
- Tekil bir kayıt mı (Profil gibi, tek nesne)? → `app/lib/data/singleRecord.js`'yi kullan.
- Yeni bir CRUD deseni **yazma**.
- Yeni localStorage anahtarını `app/lib/data/keys.js` → `STORAGE_KEYS`'e ekle, başka yerde tekrarlama.
- Paylaşılan seçenek listesi (öncelik gibi) gerekiyorsa `app/lib/data/options.js`'e ekle.

## Yeni bir ekran/panel eklerken

- Liste görünümü mü? → `RecordListPanel` bileşenini `fields` şemasıyla kullan.
- Tekil kayıt görünümü mü? → `SingleRecordPanel` bileşenini kullan.
- Yeni bir CRUD arayüz bileşeni **yazma**.

## Core Brain'e dokunmak

`app/lib/core/personality.js` ve `brain.js`, OSMAN AI'ın değişmez karakteridir. Bu dosyalar yalnızca açık bir kullanıcı onayıyla ve nedeni açıklanarak değiştirilir — asla sessizce, "iyileştirme" bahanesiyle değiştirilmez.

## Test etmeden "çalışıyor" deme

`docs/19-TESTING-STANDARDS.md`'deki akışı izle. Bir özelliği gerçekten çalıştırıp gözlemlemeden PASS olarak raporlama.

## Commit ve push

`docs/20-DEVELOPMENT-WORKFLOW.md`'deki 15 adımlık akışı izle. Commit mesajları "ne" değil "neden" odaklı olmalı.

## Doküman güncelleme

Kod değişikliği ilgili bir dokümanı güncel olmaktan çıkarıyorsa (örn. yeni bir alan eklendi ama `docs/07-DATA-MODEL.md` eski kaldı), aynı değişiklikte doküman da güncellenir. `docs/25-CHANGELOG.md`'ye yeni girdi eklenir.

## Yıkıcı işlemler

`docs/20-DEVELOPMENT-WORKFLOW.md` → Yıkıcı işlemler listesindeki her şey (repo/proje/domain silme, ücretli plana geçiş, force push, vb.) Osman'ın açık onayını gerektirir.
