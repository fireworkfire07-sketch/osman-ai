# 15 — Sürekli Gelişim Katmanı

## Durum: KISMEN ÇALIŞIYOR

**Çalışan kısım:** Manuel bir not listesi (`app/lib/data/improvements.js`), "Sistem Durumu" sekmesinde görüntülenir. Her kayıt: eksik, sebep, önerilen geliştirme, öncelik, durum (Bekliyor/Onaylandı/Reddedildi/Uygulandı).

**Çalışmayan/kurulmayan kısım:** Bu bir "motor" değildir. Kendi kendine kod taramaz, kendi kendine öneri üretmez, kendi kendine kod değiştirmez.

## Bilinçli tasarım kararı

Bu, bir eksiklik değil, açık bir tasarım kararıdır. OSMAN AI'ın kendi kendine gizlice kod değiştirmemesi gerektiği hem kullanıcı talimatlarında hem de Core Brain'in DEĞİŞMEZ İLKELER bölümünde ("Kritik değişiklikleri Osman'ın onayı olmadan uygulamazsın") açıkça yer alır.

## Gelişim motoru NE YAPMALI (hedef davranış, insan onaylı)

Eğer/ne zaman genişletilirse, bu katman yalnızca:

- Eksikleri tespit eder.
- Teknik borçları listeler.
- Güvenlik risklerini belirtir.
- Yeni fikir üretir.
- Araştırma önerir.
- Öncelik tavsiye eder.
- Geliştirme planı hazırlar.

Hiçbir zaman: otomatik commit atmaz, otomatik deploy tetiklemez, otomatik veri silmez.

## Kritik değişiklik onay kuralı

Bu listeye bir öğe "Onaylandı" olarak işaretlense bile, bu **yalnızca bir not durumu değişikliğidir** — bugünkü sistemde bu, ilgili geliştirmenin otomatik olarak uygulanacağı anlamına gelmez. Gerçek uygulama her zaman ayrı bir "uygula" talimatı ve `20-DEVELOPMENT-WORKFLOW.md`'deki tam akışı gerektirir.

## Bugünkü veri

Varsayılan liste boştur — uydurma bir "tespit edilmiş eksik" kaydı yoktur. Gerçek bilinen eksikler bu doküman setinde ilgili yerlerde (örn. `19-TESTING-STANDARDS.md` → sınırlamalar, `23-RISKS.md`) zaten metin olarak kayıtlıdır; bu listeye taşınıp taşınmayacağı ayrı bir karardır.
