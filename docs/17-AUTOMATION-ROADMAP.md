# 17 — Otomasyon Yol Haritası

**Durum: UZUN VADELİ HEDEF — bugün hiçbir otomasyon kurulmadı.**

Bu doküman, henüz var olmayan bir yeteneği anlatır. Amaç, gelecekte otomasyon eklenmek istendiğinde hangi ilkelere uyulacağını şimdiden kayıt altına almaktır (bkz. `21-ROADMAP.md` Aşama 6 — Automation Engine).

## Neden bugün otomasyon yok?

- Ücretsiz çalışma hedefiyle çelişmeden zamanlanmış (cron) bir arka plan görevi çalıştırmak, bu mimaride (Vercel serverless + localStorage) doğrudan mümkün değil — veri istemcide olduğu için sunucu tarafı bir zamanlayıcının hafızaya erişimi yok.
- Otonom bir sistemin kullanıcı onayı olmadan işlem yapması, Core Brain'in DEĞİŞMEZ İLKELER kuralına aykırı olur.
- "Önce küçük çalışan sistem" ilkesi gereği, sohbet + hafıza + proje/karar/görev sistemi tam oturmadan otomasyon katmanına geçilmedi.

## Kurulursa uyulması gereken ilkeler

1. Her otomasyon açıkça tanımlanmış bir amaca, tetikleyiciye ve beklenen çıktıya sahip olmalı.
2. Kullanıcı onayı olmadan hiçbir otomasyon dış işlem (mesaj gönderme, ödeme, veri paylaşımı) yapmamalı.
3. Hata durumunda ne yapılacağı önceden tanımlanmalı.
4. Test yöntemi net olmalı.
5. Ücretsiz araçlarla sınırlı kalınmalı; ücretli bir otomasyon aracı önerilirse bu açıkça belirtilmeli.

## Örnek otomasyon fikirleri (henüz kurulmadı, yalnızca fikir)

- Yeni bir proje fikrini sohbetten doğrudan Future Problems listesine ekleme.
- Günlük/haftalık bir "Bugün" özetini otomatik oluşturma (bugün bu manuel olarak, sayfa her açıldığında hesaplanıyor — zamanlanmış bir bildirim değil).
- Fotoğraf müşterisi için mesaj taslağı hazırlama.

Bu liste bir taahhüt değildir; `21-ROADMAP.md`'deki aşamalara bağlı olarak, her biri ayrı onay gerektiren adımlardır.
