import test from "node:test";
import assert from "node:assert/strict";
import { validateImportData, exportAllData, importAllData } from "../app/lib/dataManagement.js";
import { STORAGE_KEYS } from "../app/lib/data/keys.js";

class FakeStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(k) {
    return this.store.has(k) ? this.store.get(k) : null;
  }
  setItem(k, v) {
    this.store.set(k, String(v));
  }
  removeItem(k) {
    this.store.delete(k);
  }
}

globalThis.window = { localStorage: new FakeStorage() };

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

test("validateImportData: chatHistory alanı dosyada olsa bile içe aktarılmaz (sohbet geçmişi ayrı yönetilir)", () => {
  const result = validateImportData({
    chatHistory: [{ role: "user", content: "merhaba" }],
    projects: [{ id: "p1" }],
  });
  assert.ok(!result.imported.includes("chatHistory"));
  assert.ok(!result.skipped.includes("chatHistory"));
  assert.ok(!("chatHistory" in result.valid));
  assert.ok(result.imported.includes("projects"));
});

test("exportAllData: dışa aktarılan veri chatHistory'i hiç içermez", () => {
  window.localStorage = new FakeStorage();
  window.localStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify([{ role: "user", content: "gizli sohbet" }]));
  window.localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify([{ id: "p1" }]));

  const data = exportAllData();
  assert.ok(!("chatHistory" in data));
  assert.deepEqual(data.projects, [{ id: "p1" }]);
});

test("importAllData: yedek dosyasında chatHistory olsa bile mevcut sohbet geçmişi değişmez", () => {
  window.localStorage = new FakeStorage();
  window.localStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify([{ role: "user", content: "önceden var olan sohbet" }]));

  importAllData({
    chatHistory: [{ role: "user", content: "yedekten gelen sahte sohbet" }],
    projects: [{ id: "yeni-proje" }],
  });

  const remainingChat = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.chatHistory));
  assert.deepEqual(remainingChat, [{ role: "user", content: "önceden var olan sohbet" }]);
  assert.deepEqual(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.projects)), [{ id: "yeni-proje" }]);
});
