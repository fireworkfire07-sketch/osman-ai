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
