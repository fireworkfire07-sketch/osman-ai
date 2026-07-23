# 07 — Veri Modeli

Tüm veri tarayıcı `localStorage`'ında tutulur (bkz. `08-MEMORY-SYSTEM.md`). Anahtarların tek kaynağı `app/lib/data/keys.js` → `STORAGE_KEYS`'tir.

| Anahtar sabiti | localStorage anahtarı | Tip |
|---|---|---|
| `profile` | `osman-ai:profile` | Tekil nesne |
| `chatHistory` | `osman-ai:chat-history` | Dizi (mesaj) |
| `personalMemory` | `osman-ai:personal-memory` | Dizi (kayıt) |
| `projects` | `osman-ai:projects` | Dizi (kayıt) |
| `decisions` | `osman-ai:decisions` | Dizi (kayıt) |
| `tasks` | `osman-ai:tasks` | Dizi (kayıt) |
| `futureProblems` | `osman-ai:future-problems` | Dizi (kayıt) |
| `securityProtocol` | `osman-ai:security-protocol` | Tekil nesne |
| `paymentProtocol` | `osman-ai:payment-protocol` | Tekil nesne |
| `improvements` | `osman-ai:improvements` | Dizi (kayıt) |
| `activeProjectId` | `osman-ai:active-project-id` | Tekil string |

## Kimlik ve tarih üretimi (ortak)

`app/lib/data/storage.js`:
- `newId()` — `crypto.randomUUID()` varsa onu, yoksa `timestamp-random` biçimini kullanır.
- `today()` — `YYYY-MM-DD` (ISO tarihin ilk 10 karakteri).
- Liste kayıtları `collection.js` → `add()` içinde otomatik `id`, `createdAt`, `updatedAt` alır; `update()` her değişiklikte `updatedAt`'i günceller.

## Profile (tekil, `singleRecord.js`)

| Alan | Tip |
|---|---|
| isim | text |
| meslekler | textarea |
| yetenekler | textarea |
| ilgiAlanlari | textarea |
| sanatsalAlanlar | textarea |
| teknikSeviye | textarea |
| kullanilanCihazlar | textarea |
| calismaTercihleri | textarea |
| isHedefleri | textarea |
| uzunVadeliHedefler | textarea |
| iletisimTercihleri | textarea |
| aktifSektorler | textarea |
| kisiselDegerler | textarea |

Zorunlu alan yok (hepsi serbest metin). Varsayılan değerler `createDefaultProfile()` içinde Osman'ın gerçek profiliyle doldurulur. Silme davranışı: yok (tekil kayıt silinemez, yalnızca "Varsayılana sıfırla" vardır).

## Projects (liste, `collection.js`)

| Alan | Tip | Not |
|---|---|---|
| ad | text | Kart başlığı |
| amac | textarea | |
| aciklama | textarea | |
| durum | text | |
| oncelik | select | Yüksek/Orta/Düşük (`options.js`) |
| teknoloji | text | |
| repo | text | |
| vercelProjesi | text | |
| sonYapilanIslem | textarea | |
| calisanOzellikler | textarea | |
| calismayanOzellikler | textarea | |
| hatalar | textarea | |
| sonrakiAdim | textarea | |
| gucluYonler | textarea | Project Analyzer |
| zayifYonler | textarea | Project Analyzer |
| riskler | textarea | Project Analyzer |
| teknikBorc | textarea | Project Analyzer |
| sonrakiOneri | textarea | Project Analyzer |

Varsayılan kayıt: `id: "osman-ai"` — OSMAN AI'ın kendi proje kaydı, gerçek self-assessment ile dolu (uydurma veri değil). İlişki: Decisions ve Tasks, `projeId` alanıyla bir Project'e bağlanır. Silme: proje silinirse ve aktif proje oysa, aktif proje ilk kalan projeye kayar.

## Decisions (liste, `collection.js`)

| Alan | Tip |
|---|---|
| baslik | text |
| aciklama | textarea |
| projeId | select (Project.id) |
| tarih | otomatik (today()) |
| durum | select — Aktif / İptal Edildi |

## Tasks (liste, `collection.js`)

| Alan | Tip |
|---|---|
| ad | text |
| projeId | select (Project.id) |
| aciklama | textarea |
| durum | select — Bekliyor / Yapılıyor / Tamamlandı / Hata oluştu |
| oncelik | select — Yüksek/Orta/Düşük |
| testYontemi | textarea |
| tamamlanmaTarihi | text (serbest) |

## Personal Memory (liste, `collection.js`)

| Alan | Tip |
|---|---|
| baslik | text |
| icerik | textarea |
| kategori | select — Tercih / Bilgi / Hatırlatma / Diğer |

## Future Problems (liste, `collection.js`)

| Alan | Tip |
|---|---|
| baslik | text |
| problem | textarea |
| neZamanOrtayaCikabilir | text |
| kimleriEtkiler | textarea |
| mevcutCozumler | textarea |
| eksikKalanNokta | textarea |
| potansiyelCozum | textarea |
| kureselBuyumePotansiyeli | text |
| risk | textarea |
| oncelik | select — Yüksek/Orta/Düşük |
| durum | select — Takip ediliyor / Araştırılıyor / Vazgeçildi |

Varsayılan kayıt: `id: "future-problems-research"` — genel takip amaçlı, dürüst biçimde "henüz araştırılmadı" notlarıyla dolu.

## AI Security Protocol (tekil, `singleRecord.js`)

| Alan | Tip |
|---|---|
| problem | textarea |
| risk | textarea |
| guvenlikSeviyesi | text |
| cozum | textarea |
| kaynak | textarea |
| sonGuncelleme | text (today() ile başlar) |
| arastirmaNotlari | textarea |

Silinemez (protected — ancak tekil kayıt olduğu için zaten silme arayüzü yok).

## AI Payment Protocol (tekil, `singleRecord.js`)

| Alan | Tip |
|---|---|
| senaryo | textarea |
| guvenModeli | textarea |
| kimlikDogrulama | textarea |
| odemeAkisi | textarea |
| riskler | textarea |
| kullaniciOnayi | textarea |
| arastirmaNotlari | textarea |

## Continuous Improvement / improvements (liste, `collection.js`)

| Alan | Tip |
|---|---|
| eksik | text |
| sebep | textarea |
| onerilenGelistirme | textarea |
| oncelik | select — Yüksek/Orta/Düşük |
| durum | select — Bekliyor / Onaylandı / Reddedildi / Uygulandı |

Varsayılan: boş liste (uydurma "tespit edilmiş eksik" yok).

## Active Project

Tek bir string (`Project.id`). `app/lib/data/activeProject.js` → `loadActiveProjectId()` / `saveActiveProjectId()`. `page.js` içinde ilk projeye otomatik düşer, eğer kayıtlı id artık mevcut değilse.

## Chat History

`app/lib/data/chatHistory.js`. Dizi elemanı: `{ role: "user"|"assistant"|"error", content: string }`. `ChatPanel.js` her mesaj değişiminde `saveChatHistory()` çağırır.

## Sistem durumu (kalıcı değil)

`app/components/SystemHealthPanel.js`'e geçirilen `aiOk`, `memoryOk`, `activeProject`, `lastError` değerleri **React state'idir, localStorage'da tutulmaz** — sayfa yenilenince yeniden hesaplanır.

## İçe/dışa aktarma davranışı

`app/lib/dataManagement.js`:
- `exportAllData()` — `STORAGE_KEYS`'teki her anahtarı okur, `JSON.parse` başarısız olursa (bozuk veri) o alanı `null` yazar ama tüm dışa aktarmayı iptal etmez.
- `importAllData(data)` — gelen nesnedeki her alanı ilgili localStorage anahtarına `JSON.stringify` ile yazar; eksik alanlar dokunulmadan kalır.
- `wipeAllData()` — `STORAGE_KEYS`'teki tüm anahtarları `removeItem` ile siler; sayfa yeniden yüklenince koleksiyonlar varsayılan verilerle yeniden tohumlanır (`seed()`).

## Veri silme davranışı (genel kural)

Liste kayıtları (`collection.js` → `remove`) `protectedIds` listesindeyse silinmez. Tüm silme/temizleme işlemleri UI tarafında `window.confirm()` ile onay ister (bkz. `18-SECURITY-AND-PRIVACY.md`).
