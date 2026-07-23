# 06 — Mimari

## Gerçek dosya ağacı (bu doküman yazılırken repo'daki hâli)

```
app/
  layout.js                   Kök HTML iskeleti, meta/viewport
  page.js                     Ana ekran — tüm katmanları yükler, panelleri yönlendirir
  error.js                    Genel hata sınırı — beklenmeyen render hatalarında güvenli kurtarma ekranı
  globals.css                 Tüm stiller (koyu tema, panel/kart/form/nav/dashboard)
  api/chat/
    route.js                 Tek sunucu endpoint'i — oran sınırlama + GROQ'a streaming istek
    rateLimit.js              IP başına in-memory oran sınırlama (ücretsiz GROQ kotasını korur)
  lib/
    core/
      personality.js          Sabit kimlik + ses tonu
      brain.js                 Sabit karar/cevap/proje/güvenlik/sanat/girişimcilik kuralları
      index.js                 SYSTEM_PROMPT, APP_VERSION, BUILD_INFO, WELCOME_MESSAGE
    data/
      storage.js               localStorage oku/yaz/sil + newId() + today() + isStorageAvailable() + son hata takibi
      schema.js                 Tek kaynaklı şema sürümü + göç (migration) + yedekten geri yükleme
      keys.js                  STORAGE_KEYS — tüm localStorage anahtarlarının tek kaynağı
      options.js               Paylaşılan PRIORITY_OPTIONS
      collection.js            Liste-tipi veri için genel CRUD fabrikası
      singleRecord.js          Tekil kayıt için genel yükle/kaydet/sıfırla fabrikası
      profile.js               Osman Profili (singleRecord)
      securityProtocol.js      AI Security Protocol (singleRecord)
      paymentProtocol.js       AI Payment Protocol (singleRecord)
      projects.js              Projeler + Project Analyzer alanları (collection)
      decisions.js             Kararlar (collection)
      tasks.js                 Görevler (collection)
      personalMemory.js        Kişisel Hafıza (collection)
      futureProblems.js        Gelecek Problemleri Araştırması (collection)
      improvements.js          Sürekli Gelişim Notları (collection)
      chatHistory.js           Sohbet geçmişi oku/yaz/temizle
      activeProject.js         Aktif proje id'si oku/yaz
    context.js                 Değişken veriyi, sınırlandırılmış (son N kayıt + karakter tavanı) bağlam metnine çevirir
    dataManagement.js          Dışa aktar / doğrulamalı içe aktar / temizle
  components/
    Nav.js                     12 sekmelik gezinme
    StatusBar.js                Üst durum noktaları (AI/hafıza)
    ChatPanel.js                 Sohbet arayüzü, streaming okuma, dışa aktar
    SingleRecordPanel.js         Tekil kayıt formu (Profil/Security/Payment ortak bileşeni)
    RecordListPanel.js           Liste CRUD formu (Projeler/Görevler/Kararlar/Hafıza/... ortak bileşeni)
    DashboardCards.js             Özet ekranı kartları
    TodayPanel.js                 Bugün paneli
    SystemHealthPanel.js          Sistem Durumu ayrıntı paneli
    DataManagementPanel.js        Yedekle/doğrulamalı içe aktar/temizle arayüzü + rapor
tests/                         npm test — rate limit, bağlam sınırlama, içe aktarma doğrulama, şema göçü
docs/                          Bu doküman seti
CLAUDE.md, CONTRIBUTING.md, README.md, .env.example, package.json, next.config.js
```

**Hayalî dosya yoktur** — yukarıdaki liste bu doküman yazılırken `find` komutuyla doğrulanmış gerçek ağaçtır.

## Katmanlar

Talep edilen 14 katmanın bu koddaki gerçek karşılıkları:

1. **UI Layer** → `app/page.js` (orkestratör) + `app/components/*`
2. **Chat Layer** → `app/components/ChatPanel.js` + `app/api/chat/route.js`
3. **Core Brain** → `app/lib/core/*`
4. **Context Builder** → `app/lib/context.js`
5. **Profile Layer** → `app/lib/data/profile.js` + `app/components/SingleRecordPanel.js`
6. **Personal Memory** → `app/lib/data/personalMemory.js`
7. **Project Memory** → `app/lib/data/projects.js`
8. **Decision Memory** → `app/lib/data/decisions.js`
9. **Task System** → `app/lib/data/tasks.js`
10. **Research Layer** → `app/lib/data/futureProblems.js`
11. **Strategic Protocols** → `app/lib/data/securityProtocol.js` + `paymentProtocol.js`
12. **Data Management** → `app/lib/dataManagement.js` + `app/components/DataManagementPanel.js`
13. **System Health** → `app/components/SystemHealthPanel.js` + `app/lib/data/improvements.js`
14. **Deployment Layer** → Vercel (GitHub entegrasyonu, otomatik production deploy `main` dalından)

## Core vs. Data ayrımı (temel mimari karar)

- **Core (`app/lib/core/`)**: sabit, yalnızca kod değişikliğiyle değişir, hiçbir UI'dan düzenlenemez.
- **Data (`app/lib/data/`)**: değişebilir, localStorage'da tutulur, ilgili panelden düzenlenebilir.

Bu ayrım V3-V5 sprintinde bilinçli olarak kuruldu (bkz. `22-DECISIONS.md`).

## İki paylaşılan fabrika, sıfır kopya CRUD

- **`collection.js`**: `{ load, save, add, update, remove, reset, protectedIds }` döndürür. Projects, Decisions, Tasks, PersonalMemory, FutureProblems, Improvements bunu kullanır.
- **`singleRecord.js`**: `{ load, save, reset }` döndürür. Profile, SecurityProtocol, PaymentProtocol bunu kullanır.

Yeni bir liste veya tekil veri türü gerektiğinde **yeni bir CRUD yazılmaz**, bu iki fabrikadan biri kullanılır (bkz. `05-PRINCIPLES.md` madde 12).

## İki paylaşılan UI bileşeni

- **`RecordListPanel.js`**: `fields` şemasına göre herhangi bir listeyi görüntüler/ekler/düzenler/siler. Projeler, Görevler, Kararlar, Hafıza, Gelecek Problemleri, Sürekli Gelişim Notları bunu kullanır.
- **`SingleRecordPanel.js`**: tek bir nesneyi görüntüler/kaydeder/(isteğe bağlı) sıfırlar. Profil, AI Security Protocol, AI Payment Protocol bunu kullanır.

## İstek akışı (bir sohbet mesajı gönderildiğinde)

1. `page.js` state'inde tutulan profile/activeProject/projectDecisions/projectTasks/protocolsSummary/futureProblemsSummary `ChatPanel`'e `contextData` olarak geçilir.
2. `ChatPanel`, `/api/chat`'e `POST { messages, context: contextData }` gönderir.
3. `route.js`, `buildDynamicContext(context)` ile bir metin üretir, `SYSTEM_PROMPT`'un altına ekler.
4. GROQ'a `stream: true` ile istek atılır.
5. `streamGroqTokens()` SSE satırlarını ayrıştırıp düz metin token'ları istemciye akıtır.
6. `ChatPanel`, gelen token'ları son asistan mesajına ekleyerek ekranı günceller.

Bu akış her istekte **sunucunun hiçbir şeyi diskte tutmadığı** anlamına gelir — tüm hafıza istemciden gelir (bkz. `08-MEMORY-SYSTEM.md`).
