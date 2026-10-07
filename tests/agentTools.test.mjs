import test from "node:test";
import assert from "node:assert/strict";
import { ARACLAR, araciCalistir } from "../app/lib/tools/agentTools.js";

test("ARACLAR: araclar tanimli, hepsi function tipinde", () => {
  assert.equal(ARACLAR.length, 6);
  for (const arac of ARACLAR) {
    assert.equal(arac.type, "function");
    assert.ok(arac.function.name);
    assert.ok(arac.function.parameters);
  }
});

test("araciCalistir: bilinmeyen arac adi hata dondurur", async () => {
  const sonuc = await await araciCalistir("olmayan_arac", {});
  assert.ok(sonuc.hata);
});

test("hafiza_ekle: baslik veya durum eksikse hata dondurur", async () => {
  assert.ok(await araciCalistir("hafiza_ekle", { baslik: "x" }).hata);
  assert.ok(await araciCalistir("hafiza_ekle", { durum: "x" }).hata);
});

test("hafiza_ekle: gecerli girdi ile basarili kayit dondurur", async () => {
  const sonuc = araciCalistir("hafiza_ekle", {
    baslik: "On odeme kurali",
    durum: "Otel cekimlerinde on odeme almadan yer ayirmiyor",
    kural: "On odeme yoksa takvime yer ayirma",
  });
  assert.equal(sonuc.ok, true);
  assert.ok(sonuc.id);
  assert.equal(sonuc.refresh, "personalMemory");
});

test("karar_ekle: baslik veya karar eksikse hata dondurur", async () => {
  assert.ok(await araciCalistir("karar_ekle", { baslik: "x" }).hata);
});

test("karar_ekle: gecerli girdi ile basarili kayit dondurur", async () => {
  const sonuc = await araciCalistir("karar_ekle", { baslik: "Test karari", karar: "Boyle yapilacak" });
  assert.equal(sonuc.ok, true);
  assert.ok(sonuc.id);
  assert.equal(sonuc.refresh, "decisions");
});

test("gorev_ekle: baslik, tek_islem veya test eksikse hata dondurur", async () => {
  assert.ok(await araciCalistir("gorev_ekle", { baslik: "x", tek_islem: "y" }).hata);
});

test("gorev_ekle: gecerli girdi ile basarili kayit dondurur", async () => {
  const sonuc = araciCalistir("gorev_ekle", {
    baslik: "Test gorevi",
    tek_islem: "Bir seyi yap",
    test: "Calistigini kontrol et",
  });
  assert.equal(sonuc.ok, true);
  assert.ok(sonuc.id);
  assert.equal(sonuc.refresh, "tasks");
});

test("proje_guncelle: bilinmeyen proje hata dondurur", async () => {
  const sonuc = await araciCalistir("proje_guncelle", { proje: "olmayan-proje", alan: "durum", deger: "x" });
  assert.ok(sonuc.hata);
});

test("proje_guncelle: bilinmeyen alan hata dondurur", async () => {
  const sonuc = await araciCalistir("proje_guncelle", { proje: "OSMAN AI", alan: "gecersiz_alan", deger: "x" });
  assert.ok(sonuc.hata);
});

test("proje_guncelle: seed projesini adiyla bulup gunceller", async () => {
  const sonuc = await araciCalistir("proje_guncelle", { proje: "OSMAN AI", alan: "sonraki_adim", deger: "A2 testi" });
  assert.equal(sonuc.ok, true);
  assert.equal(sonuc.id, "osman-ai");
  assert.equal(sonuc.refresh, "projects");
});

test("hafiza_ara: bos sorgu hata dondurur", async () => {
  assert.ok(await araciCalistir("hafiza_ara", {}).hata);
});

test("hafiza_ara: eslesme olmadan bos sonuc listesi dondurur", async () => {
  const sonuc = await araciCalistir("hafiza_ara", { sorgu: "hic-eslesmeyecek-bir-metin-xyz" });
  assert.equal(sonuc.ok, true);
  assert.deepEqual(sonuc.sonuclar, []);
});

test("hafiza_ara: seed projesiyle eslesme bulur", async () => {
  const sonuc = await araciCalistir("hafiza_ara", { sorgu: "osman ai" });
  assert.equal(sonuc.ok, true);
  assert.ok(sonuc.sonuclar.some((s) => s.tur === "proje"));
});
