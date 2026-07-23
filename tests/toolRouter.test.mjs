import test from "node:test";
import assert from "node:assert/strict";
import { isRepositoryRequest } from "../app/lib/tools/toolRouter.js";

test("isRepositoryRequest: görev tanımındaki 7 örnek ifadeyi tanır", () => {
  const examples = [
    "Kendi kodunu incele",
    "Repository'ni analiz et",
    "Hangi dosyaların var?",
    "Chat API nasıl çalışıyor?",
    "Kodundaki eksikleri bul",
    "Bu özellik hangi dosyada?",
    "Kendi yeteneklerini teknik olarak denetle",
  ];
  examples.forEach((text) => {
    assert.equal(isRepositoryRequest(text), true, `tanınmalıydı: "${text}"`);
  });
});

test("isRepositoryRequest: sıradan bir sohbet mesajını tetiklemez", () => {
  assert.equal(isRepositoryRequest("Bugün nasılsın?"), false);
  assert.equal(isRepositoryRequest("Yeni bir görev ekle: rapor hazırla"), false);
  assert.equal(isRepositoryRequest("Bugünkü önceliklerimi çıkar"), false);
});

test("isRepositoryRequest: .py uzantısı geçen bir soru da tetikler (uydurma dosya adı testi)", () => {
  assert.equal(isRepositoryRequest("dosya1.py dosyasını analiz et."), true);
});
