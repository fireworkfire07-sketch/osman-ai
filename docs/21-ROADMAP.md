# 21 — Yol Haritası (10 Aşama)

Bu yol haritası uzun vadelidir; her aşama bir öncekinin gerçekten ÇALIŞIYOR duruma gelmesini ve Osman'ın onayını gerektirir. Henüz geliştirilmemiş hiçbir özellik burada tamamlanmış gibi sunulmaz.

## Aşama 1 — Foundation

**Amaç:** Ücretsiz, çalışan bir sohbet çekirdeği kurmak.
**Özellikler:** Next.js arayüzü, GROQ bağlantısı, server-side API güvenliği, Vercel deploy.
**Bağımlılıklar:** Yok.
**Riskler:** Ücretsiz kota koşullarının değişmesi (bkz. `23-RISKS.md`).
**Başarı ölçütleri:** Gerçek AI cevabı alınabiliyor, API anahtarı frontend'de görünmüyor.
**Mevcut durum:** **TAMAMLANDI.**
**Tamamlanma koşulu:** V1 commit'i (`2c21543`) — karşılandı.

## Aşama 2 — Digital Twin

**Amaç:** OSMAN AI'ın Osman'ı gerçekten "tanıması" — profil, kişisel hafıza, aktif proje bağlamı.
**Özellikler:** Osman Profili, Kişisel Hafıza, Core Brain/Personality ayrımı, sohbet bağlamına profil enjeksiyonu.
**Bağımlılıklar:** Aşama 1.
**Riskler:** Profil verisinin gerçeği yansıtmaması (bkz. `03-OSMAN-PROFILE.md`).
**Başarı ölçütleri:** Sohbet, aktif projeye/profile göre gerçekten değişiyor mu (kod seviyesinde doğrulandı, bkz. `19-TESTING-STANDARDS.md`).
**Mevcut durum:** **TAMAMLANDI.**
**Tamamlanma koşulu:** V2 commit'i (`68142c0`) — karşılandı.

## Aşama 3 — Project Brain

**Amaç:** Proje/görev/karar sistemini, stratejik protokolleri ve genel bir özet ekranını (Dashboard) kurmak.
**Özellikler:** Project Analyzer, Task System, Decision Memory, Future Problems, AI Security/Payment Protocol, Dashboard + Bugün paneli, Veri Yönetimi.
**Bağımlılıklar:** Aşama 2.
**Riskler:** Özellik şişmesi (bkz. `23-RISKS.md`), mimari tutarlılığın bozulması.
**Başarı ölçütleri:** Her yeni veri türü paylaşılan `collection.js`/`singleRecord.js` üzerine kuruldu mu (evet, doğrulandı).
**Mevcut durum:** **TAMAMLANDI** (V3-V5 sprint, commit'ler `b4b32aa`, `114db71`).
**Tamamlanma koşulu:** Karşılandı. Bu doküman seti (Master Spec v1.0) bu aşamanın **yönetişim/dokümantasyon** kısmını tamamlar.

## Aşama 4 — Research Engine

**Amaç:** Future Problems katmanını gerçek bir araştırma yeteneğine dönüştürmek (bugün yalnızca manuel kayıt).
**Özellikler (henüz yok):** Sohbetten doğrudan araştırma kaydı ekleme, olası dış kaynak özetleme.
**Bağımlılıklar:** Aşama 3, ücretsiz kalabilecek bir veri/kaynak stratejisi.
**Riskler:** Ücretsiz sınırın aşılması, otonomi ile onay ilkesinin çatışması.
**Başarı ölçütleri:** Tanımlanmadı (aşama başlamadı).
**Mevcut durum:** **PLANLANDI.**
**Tamamlanma koşulu:** Osman'ın onayıyla ayrı bir geliştirme sprinti.

## Aşama 5 — Business Engine

**Amaç:** `14-BUSINESS-AND-INVESTMENT.md`'deki değerlendirme modelini yapılandırılmış, kayıt tutan bir sisteme dönüştürmek (bugün yalnızca Core Brain'de davranış kuralı olarak var).
**Özellikler (henüz yok):** İş fikri kayıtları, değerlendirme puanlama, karşılaştırma.
**Bağımlılıklar:** Aşama 3.
**Riskler:** Gerçek dışı vaat riski (bkz. `14-BUSINESS-AND-INVESTMENT.md`).
**Mevcut durum:** **PLANLANDI.**

## Aşama 6 — Automation Engine

**Amaç:** `17-AUTOMATION-ROADMAP.md`'de tanımlanan ilkelerle gerçek otomasyonlar kurmak.
**Bağımlılıklar:** Ücretsiz kalabilecek bir zamanlama/tetikleme stratejisi (bugün yok).
**Riskler:** Onaysız otonom işlem riski.
**Mevcut durum:** **UZUN VADELİ HEDEF.**

## Aşama 7 — Multi-AI

**Amaç:** Tek bir sağlayıcıya (GROQ) bağımlılığı azaltmak, birden fazla AI modelini/ajanını destekleyebilmek.
**Riskler:** Karmaşıklık artışı, "önce küçük sistem" ilkesiyle gerilim.
**Mevcut durum:** **UZUN VADELİ HEDEF.**

## Aşama 8 — Vision Engine

**Amaç:** Osman'ın fotoğrafçılık işiyle doğrudan bağlantılı, görsel/çoklu-mod (multimodal) analiz yeteneği.
**Mevcut durum:** **UZUN VADELİ HEDEF.**

## Aşama 9 — Life OS

**Amaç:** OSMAN AI'ın Osman'ın tüm dijital/proje hayatını kapsayan bir işletim sistemi katmanına dönüşmesi.
**Mevcut durum:** **UZUN VADELİ HEDEF.**

## Aşama 10 — Autonomous Company

**Amaç:** `01-VISION.md`'de tarif edilen nihai vizyon — Osman'ın gözetiminde araştırma yapan, proje yöneten, stratejik protokolleri ilerleten bir dijital ortak.
**Mevcut durum:** **UZUN VADELİ HEDEF.** Bu aşama, Core Brain'in bugünkü "onay olmadan kritik değişiklik yapılmaz" ilkesiyle doğası gereği gergindir; bu gerginliğin nasıl çözüleceği bugün tanımlanmamıştır.
