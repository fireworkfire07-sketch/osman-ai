# 03 — Osman'ın Profili

Bu doküman Osman'ı, OSMAN AI'ın onu nasıl tanıdığını ve bunun kodda nerede karşılık bulduğunu anlatır. Bu bilgiler hem sabit kimlik (bkz. `04-CORE-BRAIN.md` → Personality) hem de düzenlenebilir veri (`app/lib/data/profile.js`) olarak iki yerde, iki farklı amaçla bulunur — bu bilinçli bir ayrımdır, veri tekrarı değil (bkz. `06-ARCHITECTURE.md` → Core vs. Data ayrımı).

## Osman kimdir?

- Profesyonel fotoğrafçıdır.
- Turizm ve otel fotoğrafçılığı deneyimine sahiptir.
- Müşteri iletişimi ve satış konusunda deneyimlidir.
- Jonglördür.
- Ateş gösterileri yapan bir performans sanatçısıdır.
- Sanatçıdır; estetik, kompozisyon, hikâye anlatımı ve sahne sanatlarına değer verir.
- Sanata değer veren bir yatırımcıdır.
- Girişimcidir.
- Yapay zekâ teknolojileri ve otomasyonlarla ilgilenir.
- Gelecekte ortaya çıkabilecek büyük problemleri araştırmak ister.
- AI güvenliği üzerine stratejik bir proje geliştirir (bkz. `11-AI-SECURITY-PROTOCOL.md`).
- AI ödeme protokolü üzerine stratejik bir proje geliştirir (bkz. `12-AI-PAYMENT-PROTOCOL.md`).
- Nefes egzersizi, meditasyon ve Tai Chi ile ilgilenir. **Bu kişisel ilgi alanları ayrı bir uygulama modülü değildir** — OSMAN AI bunları yalnızca konu gerçekten ilgiliyse gündeme getirir, kendilerine ait ekran/zamanlayıcı yoktur.
- Çoğunlukla telefon ve tablet kullanır.
- Basit ve doğrudan teknik anlatımı tercih eder.
- Tek bir net yol ister; aynı anda birden fazla seçenek sunulmasından hoşlanmaz.
- Kod değişikliklerinde eksiksiz dosya içeriği ister, parça satır değişikliği değil.
- Çalışan küçük sürümden başlayarak geliştirmek ister.
- Gerçek dışı vaatleri ve doğrulanmamış iddiaları istemez.
- Kısa vadeli gelir ile uzun vadeli küresel girişim hedeflerini birlikte yönetmek ister.

## Bu profil nerede kullanılır, nerede kullanılmaz?

- **Kullanılır:** `app/api/chat/route.js`, her sohbet isteğinde `app/lib/context.js` üzerinden GROQ'a gönderilen sistem promptuna eklenir.
- **Her cevapta tekrar edilmez.** Sistem promptu OSMAN AI'a "yalnızca ilgili kısmı kullan, profilin tamamını her seferinde tekrarlama" talimatını verir (bkz. `app/lib/context.js` yorumu ve `04-CORE-BRAIN.md`).

## Kod karşılığı

`app/lib/data/profile.js` → `createDefaultProfile()` fonksiyonu, yukarıdaki maddelerin özetlenmiş, düzenlenebilir veri karşılığıdır (13 alan: isim, meslekler, yetenekler, ilgiAlanlari, sanatsalAlanlar, teknikSeviye, kullanilanCihazlar, calismaTercihleri, isHedefleri, uzunVadeliHedefler, iletisimTercihleri, aktifSektorler, kisiselDegerler). Bu alanlar Profil ekranından düzenlenebilir ve varsayılana sıfırlanabilir; **ancak sıfırlama yalnızca veriyi sıfırlar, Core Brain'deki sabit kimliği etkilemez** (bkz. `04-CORE-BRAIN.md`).
