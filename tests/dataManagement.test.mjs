import test from "node:test";
import assert from "node:assert/strict";
import { validateImportData } from "../app/lib/dataManagement.js";

test("validateImportData: geçerli şekildeki alanları kabul eder", () => {
  const data = {
    profile: { isim: "Osman" },
    projects: [{ id: "p1" }],
    activeProjectId: "p1",
  };
  const result = validateImportData(data);
  assert.ok(result.imported.includes("profile"));
  assert.ok(result.imported.includes("projects"));
  assert.ok(result.imported.includes("activeProjectId"));
  assert.equal(result.skipped.length, 0);
});

test("validateImportData: yanlış tipteki alanları atlar ve Türkçe hata üretir (uygulamayı çökertecek asıl senaryo)", () => {
  const data = { projects: "bu bir dizi değil", decisions: { yanlis: "sekil" } };
  const result = validateImportData(data);
  assert.ok(result.skipped.includes("projects"));
  assert.ok(result.skipped.includes("decisions"));
  assert.equal(result.imported.length, 0);
  assert.ok(result.errors.some((e) => e.includes("Projeler")));
  assert.ok(result.errors.some((e) => e.includes("Kararlar")));
});

test("validateImportData: dizi/obje olmayan kök veriyi tamamen reddeder", () => {
  const result = validateImportData("bozuk string");
  assert.equal(Object.keys(result.valid).length, 0);
  assert.ok(result.errors[0].includes("geçerli bir OSMAN AI yedek dosyası değil"));
});

test("validateImportData: kısmi (bazı alanlar eksik) dosyayı kabul eder, eksik alanlara dokunmaz", () => {
  const result = validateImportData({ personalMemory: [{ baslik: "not" }] });
  assert.deepEqual(result.imported, ["personalMemory"]);
  assert.equal(result.skipped.length, 0);
});
