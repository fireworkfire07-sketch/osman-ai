# 16 — Sistem Durumu (System Health)

**Durum: ÇALIŞIYOR.**

## Kod karşılığı

`app/components/StatusBar.js` (üst bar, her ekranda görünür) + `app/components/SystemHealthPanel.js` ("Sistem Durumu" sekmesi, ayrıntılı görünüm).

## Kontrol edilen değerler

| Gösterge | Nasıl hesaplanır | Kalıcı mı? |
|---|---|---|
| Sistem çalışıyor | Sabit (uygulama render olduysa çalışıyordur) | — |
| AI API bağlantısı | Sayfa açılışında `/api/chat` GET → `groqKeyPresent` | Hayır, her yüklemede tazelenir |
| Hafıza (localStorage) durumu | `isStorageAvailable()` — deneme yazması yapıp siler | Hayır, her yüklemede tazelenir |
| Aktif proje | `page.js` state'i | localStorage'da (id) |
| Son hata | `ChatPanel`'den `onError` ile gelen son mesaj | Hayır, yalnızca oturum içi React state |
| Uygulama sürümü | `app/lib/core/index.js` → `APP_VERSION` sabiti | Sabit metin |
| Build bilgisi | `app/lib/core/index.js` → `BUILD_INFO` sabiti | Sabit metin |

## localStorage kullanılamıyorsa ne olur?

`page.js`, `isStorageAvailable()` false dönerse ekranın üstünde bir uyarı gösterir: "Bu tarayıcıda localStorage kullanılamıyor. Profil, proje ve karar hafızası bu cihazda çalışmayacak; sohbet yine de çalışır ama hiçbir şey hatırlanmaz." **Sistem çalışmıyorken çalışıyor gibi gösterilmez** — bu, Core Brain'in DEĞİŞMEZ İLKELER kuralının UI'daki karşılığıdır.

## Dashboard (Özet) ile ilişkisi

`app/components/DashboardCards.js`, sistem durumunu değil, veri sayaçlarını gösterir (Aktif Proje, Toplam Proje, Görev/Karar/Hafıza/Araştırma sayısı, AI Security/Payment durumu). `TodayPanel.js` ise en son eklenen görev/karar/proje ile aktif projenin sonraki adımını gösterir. İkisi birlikte "Özet" sekmesini oluşturur (varsayılan açılış ekranı).

## Sınır

Runtime hata takibi (`lastError`) **yalnızca istemci tarafı sohbet hatalarını** kapsar; sunucu tarafı (Vercel) runtime hataları bu panelde görünmez, onlar Vercel'in kendi runtime log/hata araçlarıyla izlenir (bkz. `19-TESTING-STANDARDS.md`, `20-DEVELOPMENT-WORKFLOW.md`).
