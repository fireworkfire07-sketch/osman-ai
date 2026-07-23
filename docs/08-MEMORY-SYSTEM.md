# 08 — Hafıza Sistemi

## Genel prensip

OSMAN AI'da tek bir hafıza deposu vardır: **tarayıcının `localStorage`'ı.** Sunucu tarafında (Vercel serverless fonksiyonları) hiçbir kalıcı disk yoktur — her istek sıfırdan çalışır. Bu yüzden hafızanın sahibi her zaman istemci (tarayıcı) tarafıdır; sunucu yalnızca istemcinin gönderdiği veriyi okuyup bir bağlam metnine çevirir (bkz. `06-ARCHITECTURE.md`).

## Hafıza türleri

| Tür | Kod karşılığı | Kalıcı mı? |
|---|---|---|
| Kişisel hafıza (manuel not) | `personalMemory.js` | Evet, cihazda |
| Sohbet geçmişi | `chatHistory.js` | Evet, cihazda |
| Profil hafızası | `profile.js` | Evet, cihazda |
| Proje hafızası | `projects.js` | Evet, cihazda |
| Karar hafızası | `decisions.js` | Evet, cihazda |
| Aktif proje bağlamı | `activeProject.js` | Evet, cihazda (yalnızca id) |

## Aktif proje bağlamı nasıl çalışır?

`page.js`, `activeProjectId`'ye göre `projects` listesinden tek bir `activeProject` nesnesi türetir; `decisions`/`tasks` listelerini `projeId === activeProjectId` ile filtreler. Bu üçü (`activeProject`, `projectDecisions`, `projectTasks`) her sohbet isteğinde `contextData` içinde sunucuya gönderilir (bkz. `06-ARCHITECTURE.md` → İstek akışı). Aktif proje değiştiğinde sohbete gönderilen bağlam da anında değişir — bu, önceki sprint testlerinde ağ isteği gövdesi incelenerek doğrulanmıştır.

## localStorage'ın sınırları

1. **Cihaz bazlıdır.** Telefonda kaydedilen bir proje, tablette otomatik görünmez. Bu, V2'den beri README'de açıkça belirtilen, bilinçli kabul edilmiş bir sınırdır (bkz. `23-RISKS.md`).
2. **Tarayıcı verisi temizlenirse kaybolur.** Yedekleme (`19. Veri Yönetimi`) bu riski azaltır ama otomatik değildir.
3. **Boyut sınırı vardır** (tarayıcıya göre genelde 5-10 MB) — bugünkü veri hacmiyle (birkaç proje/karar/görev) bu bir risk oluşturmaz, ama sınırsız büyüyen bir kişisel not/sohbet geçmişi ileride bu sınıra yaklaşabilir. Bugün için **bilinen ama aktif olmayan bir risk.**

## Cihazlar arası senkronizasyon — şu anda YOK (ERTELENDİ)

Bugün hiçbir sunucu tarafı veritabanı yoktur. Bu, "ücretsiz çalışma" hedefiyle doğrudan ilişkilidir: bir veritabanı eklemek (ücretsiz katmanı olsa bile) yeni bir hesap, yeni bir servis bağımlılığı ve yeni bir güvenlik yüzeyi demektir.

## Gelecekte güvenli senkronizasyon seçenekleri (UZUN VADELİ HEDEF, henüz araştırılmadı/kurulmadı)

Bu doküman hiçbir seçeneği "seçildi" olarak sunmaz. Olası bir yön (ücretsiz kredi kartsız katmanı olan bir veritabanı, ör. Supabase) yalnızca `app/lib/data/projects.js` içindeki OSMAN AI proje kaydının "sonrakiOneri" alanında bir not olarak geçer — bu bir karar değil, bir gözlemdir.

## Veri yedekleme

`app/lib/dataManagement.js` → `exportAllData()` + `downloadJSON()`. Kullanıcı "Veri Yönetimi" panelinden tüm `STORAGE_KEYS` içeriğini tek bir `.json` dosyası olarak indirebilir.

## İçe/dışa aktarma

- **Dışa aktarma (tüm veri):** yukarıdaki yedekleme mekanizmasıyla aynıdır.
- **Dışa aktarma (yalnızca sohbet):** `ChatPanel.js` → `exportConversation()`, yalnızca mesaj geçmişini `.txt` olarak indirir.
- **İçe aktarma:** `DataManagementPanel.js`, seçilen `.json` dosyasını okuyup `importAllData()` ile mevcut verinin üzerine yazar. **Bu işlem geri alınamaz** — UI önce `window.confirm()` ile onay ister.

## Gizlilik

Hiçbir veri OSMAN AI dışında bir üçüncü tarafa gönderilmez, GROQ'a giden istek dışında. GROQ'a giden istek yalnızca o anki sohbet mesajları + bağlam metnidir (bkz. `18-SECURITY-AND-PRIVACY.md` → Dış hizmetler). Veri hiçbir zaman Osman'ın bilgisi/onayı olmadan dışa gönderilmez.

## Hafıza çakışmaları

Bugünkü mimaride çakışma senaryosu yoktur çünkü tek bir aktif sekme/cihaz aynı anda yazma yapar (localStorage, çoklu sekme senkronizasyonu içermez). Çoklu sekme veya çoklu cihaz eşzamanlı yazma durumu **ARAŞTIRMA AŞAMASINDA bile değildir** — henüz gündeme gelmemiştir.

## Yanlış hafızayı düzeltme

Her liste kaydı (`RecordListPanel`) "Düzenle" ile değiştirilebilir; her tekil kayıt (`SingleRecordPanel`) "Kaydet" ile güncellenebilir. Profil ayrıca "Varsayılana sıfırla" ile baştan başlatılabilir. Yanlış bir bilgi fark edildiğinde önerilen yol: ilgili paneli aç, düzelt, kaydet — OSMAN AI kendi kendine hafızasını "düzeltmez", bu her zaman Osman'ın elindedir.

## Hafıza kaydetmeden önce kullanıcı onayı yaklaşımı

Bugün OSMAN AI, sohbet sırasında öğrendiği bir bilgiyi **otomatik olarak** Kişisel Hafıza'ya kaydetmez — bu manuel bir kullanıcı eylemidir (panelden "Ekle"). Sohbetten otomatik hafıza çıkarımı (örn. "bunu hatırlamamı ister misin?" önerisi) **PLANLANDI** ama henüz kurulmadı; kurulduğunda da Core Brain'in "onay olmadan kritik değişiklik yapılmaz" ilkesi gereği, bilgi sessizce kaydedilmeyecek, kullanıcıya sorulacaktır.
