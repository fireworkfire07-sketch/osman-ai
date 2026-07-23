# 09 — Proje / Görev / Karar Sistemi

Bu üç sistem birbirine `projeId` alanıyla bağlanır ve `app/page.js` içinde birlikte yönetilir. **Durum: ÇALIŞIYOR.**

## Proje sistemi

Her proje (`app/lib/data/projects.js`) tek başına yeterli bir kayıttır: amaç, mevcut durum, teknoloji, repo, çalışan/çalışmayan özellikler, hatalar, sonraki adım, öncelik. Buna ek olarak **Project Analyzer** alanları (güçlü yönler, zayıf yönler, riskler, teknik borç, sonraki öneri) aynı kayda eklenmiştir — ayrı bir "analiz sistemi" değildir, mevcut proje kaydının genişletilmiş hâlidir (bkz. `06-ARCHITECTURE.md`).

**Aktif proje** kavramı: aynı anda yalnızca bir proje "aktif" olabilir (`app/lib/data/activeProject.js`). Aktif projenin kararları ve görevleri otomatik olarak filtrelenir ve sohbet bağlamına eklenir.

**Proje karıştırmama kuralı:** OSMAN AI, hangi proje hakkında konuşulduğunu bilmeden proje bilgisi üretmez (bkz. `04-CORE-BRAIN.md`). Bu kod düzeyinde, sohbet isteğine yalnızca **aktif projenin** bilgisinin eklenmesiyle desteklenir — diğer projelerin bilgisi karışmaz.

## Görev sistemi

`app/lib/data/tasks.js`. Her görev bir projeye bağlanabilir (`projeId`), dört durumdan birinde olur (Bekliyor/Yapılıyor/Tamamlandı/Hata oluştu), bir öncelik ve test yöntemi taşır. Bugün için görev listesi sınırsızdır; Core Brain'in "her projede tek ve net bir sonraki adım" ilkesi UI'da zorunlu kılınmaz (birden fazla görev eklenebilir) — bu ilke şu an yalnızca OSMAN AI'ın **cevap verirken** uyduğu bir davranış kuralıdır, veri modelinde bir kısıtlama değildir. **Bu bir tutarsızlık değil, bilinçli bir tasarım seçimidir**: veri modeli esnek, davranış kısıtlayıcıdır.

## Karar sistemi

`app/lib/data/decisions.js`. Her karar bir projeye bağlanabilir, tarihli ve durumludur (Aktif/İptal Edildi). Kararlar `docs/22-DECISIONS.md`'deki proje-genelindeki kararlardan farklıdır — buradaki kararlar Osman'ın uygulama içinde kaydettiği, proje bazlı kararlardır.

**Karara aykırı öneri uyarısı (ÇALIŞIYOR, davranışsal):** Core Brain, kayıtlı bir karara aykırı bir öneri sunulursa bunun açıkça belirtilmesini şart koşar. Bu, kararların sohbet bağlamına (`projectDecisions`) eklenmesiyle mümkün olur — OSMAN AI aktif projenin kararlarını her istekte görür.

## Sonraki adım (tekil, net)

Her projenin `sonrakiAdim` alanı, o proje için "şu an yapılması gereken tek şey"i tutar. Bu alan Dashboard'daki **Bugün** panelinde ("Devam edilmesi gereken iş") doğrudan gösterilir (bkz. `16-SYSTEM-HEALTH.md` ve `02-PRODUCT.md` → Özet ekranı).
