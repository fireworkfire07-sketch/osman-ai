# 10 — Gelecek Problemleri Araştırma Katmanı (Research Engine)

## Ne var, ne yok

**Durum: ÇALIŞIYOR (veri modeli ve arayüz) / henüz kurulmadı (otonom araştırma motoru).**

Bu katman bugün, Osman'ın manuel olarak dolduracağı bir kayıt listesidir (`app/lib/data/futureProblems.js`). "Motor" kelimesi bir yanlış anlamaya yol açmamalı: **hiçbir otomatik tarama, web araştırması veya kendiliğinden veri üretimi yoktur.** OSMAN AI kendi başına internete çıkıp araştırma yapmaz.

## Veri modeli (özet — ayrıntı için 07-DATA-MODEL.md)

Her kayıt: başlık, problem, tahmini oluşma tarihi, etkilenen sektörler, mevcut çözümler, eksikler, Osman'ın çözüm fikri, ölçeklenebilirlik, risk, öncelik, durum (Takip ediliyor / Araştırılıyor / Vazgeçildi).

## Kapsanması öngörülen alanlar

Yapay zekâ, dijital kimlik, siber güvenlik, finans, AI ajanları, robotik, sağlık teknolojileri, enerji, eğitim, sanat ve yaratıcı teknolojiler, insan-AI etkileşimi. Bu liste `createDefaultFutureProblems` seed kaydının `kimleriEtkiler` alanında geçer; bu alanlar zorunlu kategoriler değil, örnek yönelim alanlarıdır.

## Varsayılan kayıt

`id: "future-problems-research"` — "Gelecek Problemleri Araştırması (genel takip)" başlıklı, genel bir takip kaydıdır. İçeriği dürüsttür: "mevcut çözümler: henüz araştırılmadı", "eksik kalan nokta: henüz belirlenmedi". **Bu kayıt bir araştırma sonucu değildir**, yalnızca kategori panelinin boş kalmaması için açılmış bir başlangıç noktasıdır.

## OSMAN AI bu katmanı sohbette nasıl kullanır?

`app/lib/context.js` → `futureProblemsSummary`, sohbet bağlamına yalnızca kayıt sayısını ekler ("Gelecek araştırma kayıtları: N adet"). Tek tek kayıtların ayrıntısı, yalnızca kullanıcı o konuyu sorduğunda ilgiliyse Core Brain'in "yalnızca ilgili kısmı kullan" ilkesiyle değerlendirilir — bugünkü mimaride her kaydın tam metni her sohbet isteğine otomatik eklenmez (token/prompt boyutunu kontrol altında tutmak için bilinçli bir sınırlama).

## Planlanan gelişim (PLANLANDI / UZUN VADELİ HEDEF)

- Sohbet sırasında yeni bir "gelecek problemi" fikrinin doğrudan bu listeye eklenebilmesi (bugün yalnızca panelden manuel ekleme var). **PLANLANDI.**
- Otomatik dış kaynak taraması veya haber/trend takibi. **UZUN VADELİ HEDEF**, `21-ROADMAP.md` Aşama 4 (Research Engine) kapsamında — bugün kurulmadı ve kısa vadede kurulması planlanmıyor (bkz. `15-CONTINUOUS-IMPROVEMENT.md`'deki otonomi sınırı aynı burada da geçerlidir).
