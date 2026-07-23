# 19 — Test Standartları

## Zorunlu test akışı

Her önemli değişiklik için sırasıyla:

1. Kod inceleme (diff'i gözden geçir)
2. `npm install`
3. `npm run build`
4. Mevcut otomatik testler (bugün için: yok — bkz. Sınırlamalar)
5. Playwright ile kullanıcı akışı testi (manuel, geçici script; repoya commit edilmez)
6. Veri kalıcılığı testi (sayfa yenile, veri duruyor mu?)
7. İçe/dışa aktarma testi
8. API güvenliği testi (API anahtarı HTML/response'ta görünüyor mu?)
9. Mobil görünüm kontrolü (yatay taşma var mı?)
10. Commit
11. Push
12. Vercel deploy doğrulama (deployment READY mi, doğru commit SHA mi?)
13. Runtime hata kontrolü (`get_runtime_errors`, son 24 saat)
14. Production acceptance testi (mümkün olduğunca gerçek kullanıcı adımları)
15. Sonuç raporu

**FAIL durumunda iş tamamlanmış sayılmaz.** Bir adım başarısız olursa, bir sonraki adıma geçilmeden önce hata düzeltilir.

## Mevcut sınırlamalar (dürüstçe kayıtlı)

- **Claude, production'a POST atamıyor.** Bu ortamın ağ proxy'si `*.vercel.app` gibi keyfi domainlere doğrudan bağlantıya izin vermiyor; yalnızca Vercel'in kendi salt-okunur GET aracı (`web_fetch_vercel_url`) kullanılabiliyor. Bu yüzden production'da gerçek bir sohbet isteğinin (GROQ'tan gelen gerçek cevabın) uçtan uca gözlemlenmesi bugüne kadar mümkün olmadı.
- **Manuel sohbet testi gerekebilir.** Gerçek AI cevabının profil/proje bilgisini kullandığını doğrulamanın en güvenilir yolu, Osman'ın tarayıcıdan gerçek bir mesaj göndermesidir.
- **Bağımsız, repoya commit edilmiş bir lint/test çerçevesi yoktur.** Next.js 16, CLI'dan `next lint` komutunu kaldırdı. ESLint, Jest veya Playwright bu repoya devDependency olarak eklenmedi. Her sprintte kullanılan Playwright testleri, `/tmp` altında geçici olarak kurulup (`npm install --no-save playwright`) test sonunda silinen, tekrar üretilebilir ama commit edilmemiş scriptlerdir.
- **Cihazlar arası senkronizasyon yoktur**, dolayısıyla "iki cihazda aynı veri" gibi bir test senaryosu tanımsızdır (beklenen davranış: senkronize olmaması).

## Yerelde ne test edilebilir?

- `npm run build` — derleme hatası var mı?
- `npm run start` + Playwright (geçici) — UI akışları, localStorage kalıcılığı, CRUD, sohbetin GROQ anahtarı olmadan doğru Türkçe hata verdiği.
- GROQ anahtarı yerelde tanımlıysa gerçek sohbet cevabı da test edilebilir (bugüne kadar bu ortamda GROQ anahtarı hiç sağlanmadı).

## Production'da ne doğrulanabilir (Vercel MCP araçlarıyla)?

- `list_deployments` / `get_deployment` — son deployment'ın doğru commit'e ait ve `READY` olduğu.
- `get_runtime_errors` — son 24 saatte sunucu tarafı hata olup olmadığı.
- `web_fetch_vercel_url` (GET) — `/api/chat` GET endpoint'inin `groqKeyPresent: true/false` dönmesi (env var kontrolü).

## Production Acceptance Test formatı

Her büyük geliştirmeden sonra, mümkün olan testler PASS/FAIL olarak raporlanır; elde tutulamayan testler (yukarıdaki sınırlamalar nedeniyle) "TEST EDİLEMEDİ" olarak işaretlenir — **asla PASS olarak varsayılmaz.** Bir FAIL varsa yeni özellik eklenmez, önce mevcut hata düzeltilir.
