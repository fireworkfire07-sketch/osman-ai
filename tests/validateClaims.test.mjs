import test from "node:test";
import assert from "node:assert/strict";
import {
  extractClaimedPaths,
  validateClaimedPaths,
  validateLineRanges,
} from "../app/lib/grounding/validateClaims.js";

test("extractClaimedPaths: dosya yolu ve satır aralığını doğru ayrıştırır", () => {
  const text = "İddia: /api/chat rotası burada. Kanıt: app/api/chat/route.js:86-113";
  const claims = extractClaimedPaths(text);
  const match = claims.find((c) => c.path === "app/api/chat/route.js");
  assert.ok(match);
  assert.equal(match.from, 86);
  assert.equal(match.to, 113);
});

test("extractClaimedPaths: satır belirtilmemiş bare bir yolu da yakalar", () => {
  const claims = extractClaimedPaths("Bu mantık app/lib/context.js içinde tanımlı.");
  assert.ok(claims.some((c) => c.path === "app/lib/context.js" && c.from === null));
});

test("validateClaimedPaths: gerçek ağaçta olmayan (uydurma) dosya adı geçersiz sayılır", () => {
  const tree = [{ path: "app/api/chat/route.js" }, { path: "app/lib/context.js" }];
  const claims = [
    { path: "app/lib/hayali-dosya.js", from: null, to: null },
    { path: "app/lib/context.js", from: null, to: null },
  ];
  const { valid, invalid } = validateClaimedPaths(claims, tree);
  assert.ok(invalid.some((c) => c.path === "app/lib/hayali-dosya.js"));
  assert.ok(valid.some((c) => c.path === "app/lib/context.js"));
});

test("validateLineRanges: dosyanın gerçek satır sayısını aşan aralık geçersiz sayılır", () => {
  const claims = [{ path: "app/api/chat/route.js", from: 1, to: 500 }];
  const sources = [{ path: "app/api/chat/route.js", lineCount: 227 }];
  const invalid = validateLineRanges(claims, sources);
  assert.equal(invalid.length, 1);
});

test("validateLineRanges: sınır içindeki aralık geçerli sayılır", () => {
  const claims = [{ path: "app/api/chat/route.js", from: 10, to: 20 }];
  const sources = [{ path: "app/api/chat/route.js", lineCount: 227 }];
  const invalid = validateLineRanges(claims, sources);
  assert.equal(invalid.length, 0);
});

test("validateLineRanges: kanıt dışı bir dosya için sınır doğrulanamaz (bilinen sınır, hata sayılmaz)", () => {
  const claims = [{ path: "app/lib/data/tasks.js", from: 1, to: 9999 }];
  const sources = [{ path: "app/api/chat/route.js", lineCount: 227 }];
  const invalid = validateLineRanges(claims, sources);
  assert.equal(invalid.length, 0);
});
