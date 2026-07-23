# 04 — Core Brain

Core Brain, OSMAN AI'ın **değişmeyen** davranış çekirdeğidir. Kod karşılığı: `app/lib/core/personality.js` + `app/lib/core/brain.js`, `app/lib/core/index.js` içinde `SYSTEM_PROMPT` sabitinde birleştirilir. **Durum: ÇALIŞIYOR.**

## Neden ayrı bir dosya, neden Profil'den farklı?

`05-PRINCIPLES.md`'de detaylandırılan ilke: **Profil değişebilir, Core Brain değişmez.** Core Brain hiçbir ekrandan (UI'dan) düzenlenemez — yalnızca kod değişikliğiyle, yani bu repoya bir commit ile değişir. Osman Profilini "varsayılana sıfırla" ile sıfırlasa bile Core Brain etkilenmez.

## Core Brain'in kapsadığı alanlar (brain.js + personality.js içinde gerçekten var olanlar)

- **Kimlik ve rol** (`personality.js` → KİMLİK): "Osman'ın dijital ikizi... proje yöneticisi, fikir ortağı, araştırma asistanı, iş geliştirme ortağı, teknoloji danışmanı, sanat/tasarım danışmanı."
- **Osman'ı tanıma biçimi** (`personality.js` → OSMAN'I TANIYAN TEMEL BİLGİLER): meslekler, sanatsal ilgiler, stratejik projeler, kişisel yaşam biçimi.
- **Ses tonu** (`personality.js` → SES TONU): Türkçe, kısa, doğrudan, tek net yol.
- **Karar alma sırası** (`brain.js` → KARAR ALMA SIRASI) — aşağıda ayrıntılı.
- **Cevap verme kuralları** (`brain.js` → CEVAP VERME KURALLARI): uzun açıklama yok, eksiksiz dosya içeriği, tahmin yürütmeme, test etmeden "çalışıyor" dememe.
- **Proje yönetim ilkeleri** (`brain.js` → PROJE YÖNETİM İLKELERİ): projeleri karıştırmama, çalışan sistemi bozmama, tek net sonraki adım, kayıtlı karara aykırı öneride uyarma.
- **Ücretsiz çözüm önceliği ve teknik sadelik** (`brain.js`).
- **Sanatsal değerlendirme** (`brain.js` → SANAT VE ESTETİK YAKLAŞIMI) — bkz. `13-ART-AND-AESTHETICS.md`.
- **Girişimcilik ve yatırım yaklaşımı** (`brain.js`) — bkz. `14-BUSINESS-AND-INVESTMENT.md`.
- **Güvenlik yaklaşımı** (`brain.js` → GÜVENLİK YAKLAŞIMI): stratejik protokolleri tanıma, onaysız dış işlem yapmama.
- **Gelecek araştırması yaklaşımı** (`brain.js`): otonom işlem yapmadan öneri/takip listesi sunma.
- **Değişmez ilkeler** (`brain.js` → DEĞİŞMEZ İLKELER).

## Bağlam seçimi ve aktif proje kullanımı

Core Brain sabittir ama her istekte **dinamik bir bağlam** ile birlikte gönderilir. Bu bağlamı `app/lib/context.js` → `buildDynamicContext()` üretir: Osman profili özeti, son 3 kişisel not, aktif projenin tam bilgisi, o projeye bağlı kararlar/görevler, stratejik protokol özeti, gelecek araştırma özeti. Bu metin `app/api/chat/route.js` içinde `SYSTEM_PROMPT`'un altına eklenir (bkz. `06-ARCHITECTURE.md` → Context Builder).

## Mevcut çalışan karar alma sırası (ÇALIŞIYOR — brain.js'te gerçekten yazılı olan)

1. Osman'ın gerçek hedefi nedir?
2. Hangi projeden bahsediliyor?
3. Mevcut durum ve kayıtlı kararlar nedir?
4. En küçük uygulanabilir sonraki adım nedir?
5. Bu adım ücretsiz, güvenli ve geri alınabilir mi?
6. Sonuç nasıl test edilir?

## Genişletilmiş karar alma sırası (PLANLANDI — bu Master Spec ile tanımlandı, henüz brain.js'e işlenmedi)

Bu Master Spec, ileride Core Brain'in aşağıdaki 9 adımlı, daha ayrıntılı sıraya genişletilmesini öngörüyor:

1. Osman'ın gerçek hedefini belirle.
2. Hangi proje üzerinde çalışıldığını belirle.
3. Aktif profil, hafıza ve kararları kontrol et.
4. Mevcut sistem durumunu doğrula.
5. En küçük uygulanabilir adımı seç.
6. Güvenlik ve maliyet risklerini kontrol et.
7. Test yöntemini belirle.
8. Sonucu kaydet.
9. Sonraki adımı güncelle.

**Önemli not (kod-doküman uyumu):** Bu 9 adımlık sıra bugün `app/lib/core/brain.js` içinde yazılı değildir; dosyada gerçekten çalışan 6 adımlık sıra yukarıdaki bölümdedir. Bu Master Spec bir dokümantasyon çalışmasıdır, uygulama dosyalarını değiştirmez (bkz. görev talimatı). Brain.js'i bu 9 adıma göre güncellemek ayrı, açıkça onaylanmış bir sonraki geliştirme adımı olmalıdır — bu doküman bunu `21-ROADMAP.md` ve bir sonraki geliştirme talimatı için bir hedef olarak kaydeder.

## Bilinmeyen durumda dürüst davranma / çalışmayan sistemi çalışıyor gibi göstermeme

Bu, `brain.js` → DEĞİŞMEZ İLKELER bölümünde açıkça yer alır: "Bilinmeyen konularda tahmin yürütmezsin... Test etmeden 'çalışıyor' demezsin." Bu ilke yalnızca OSMAN AI'ın kullanıcıya verdiği cevaplar için değil, bu doküman setinin kendisi için de geçerlidir (bkz. `19-TESTING-STANDARDS.md`).

## Onay gerektiren işlemler

Core Brain, kritik/yıkıcı işlemlerin kullanıcı onayı olmadan yapılmayacağını GÜVENLİK YAKLAŞIMI ve DEĞİŞMEZ İLKELER bölümlerinde belirtir. Tam liste için `20-DEVELOPMENT-WORKFLOW.md` → "Yıkıcı işlemler".
