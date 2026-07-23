import test from "node:test";
import assert from "node:assert/strict";
import { buildDynamicContext } from "../app/lib/context.js";

test("buildDynamicContext: kararlar ve görevler son N kayıtla sınırlanır", () => {
  const manyDecisions = Array.from({ length: 50 }, (_, i) => ({
    tarih: "2026-01-01",
    baslik: `Karar ${i}`,
    aciklama: "...",
    durum: "Aktif",
  }));
  const manyTasks = Array.from({ length: 50 }, (_, i) => ({ ad: `Görev ${i}`, durum: "Bekliyor" }));

  const ctx = buildDynamicContext({ projectDecisions: manyDecisions, projectTasks: manyTasks });

  assert.ok(ctx.includes("Karar 49"), "en güncel karar dahil olmalı");
  assert.ok(!ctx.includes("Karar 0:"), "eski kararlar dahil edilmemeli");
  assert.ok(ctx.includes("toplam 50"), "toplam sayı belirtilmeli");
});

test("buildDynamicContext: toplam bağlam bir güvenlik karakter sınırını aşmaz", () => {
  const hugeMemory = Array.from({ length: 3 }, (_, i) => ({ baslik: `Not ${i}`, icerik: "x".repeat(3000) }));
  const ctx = buildDynamicContext({ personalMemory: hugeMemory });
  assert.ok(ctx.length <= 4100, `bağlam ${ctx.length} karakter, sınırı aşıyor`);
});

test("buildDynamicContext: profil ve aktif proje bilgisi her zaman dahil edilir", () => {
  const ctx = buildDynamicContext({
    profile: {
      meslekler: "test-meslek-imzasi",
      yetenekler: "y",
      ilgiAlanlari: "i",
      sanatsalAlanlar: "s",
      calismaTercihleri: "c",
      isHedefleri: "h",
      uzunVadeliHedefler: "u",
    },
    activeProject: { ad: "Test Proje İmzası", amac: "a", durum: "d", sonYapilanIslem: "s", sonrakiAdim: "n" },
  });
  assert.ok(ctx.includes("test-meslek-imzasi"));
  assert.ok(ctx.includes("Test Proje İmzası"));
});

test("buildDynamicContext: az sayıda kayıt varken 'toplam' notu eklenmez", () => {
  const ctx = buildDynamicContext({
    projectDecisions: [{ tarih: "2026-01-01", baslik: "Tek Karar", aciklama: "x", durum: "Aktif" }],
  });
  assert.ok(!ctx.includes("toplam"));
});

test("buildDynamicContext: tüm projeler isim ve durumuyla bağlama dahil edilir", () => {
  const ctx = buildDynamicContext({
    allProjects: [
      { ad: "OSMAN AI", durum: "Aktif" },
      { ad: "AI Security Protocol", durum: "Araştırılıyor" },
    ],
  });
  assert.ok(ctx.includes("OSMAN AI (Aktif)"));
  assert.ok(ctx.includes("AI Security Protocol (Araştırılıyor)"));
});

test("buildDynamicContext: proje listesi ilk N ile sınırlanır ve toplam belirtilir", () => {
  const manyProjects = Array.from({ length: 15 }, (_, i) => ({ ad: `Proje ${i}`, durum: "Aktif" }));
  const ctx = buildDynamicContext({ allProjects: manyProjects });
  assert.ok(ctx.includes("Proje 9 (Aktif)"), "ilk 10 proje dahil olmalı");
  assert.ok(!ctx.includes("Proje 10 ("), "10. projeden sonrası dahil edilmemeli");
  assert.ok(ctx.includes("toplam 15"));
});
