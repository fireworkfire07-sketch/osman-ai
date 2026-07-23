import test from "node:test";
import assert from "node:assert/strict";
import { isPathAllowed, sanitizeRepositoryContent, searchRelevantFiles } from "../app/lib/tools/githubRepository.js";

test("isPathAllowed: node_modules/.next/.git dışlanır", () => {
  assert.equal(isPathAllowed("node_modules/react/index.js"), false);
  assert.equal(isPathAllowed(".next/server/app.js"), false);
  assert.equal(isPathAllowed(".git/config"), false);
});

test("isPathAllowed: .env dosyaları ve secret/credential adları dışlanır", () => {
  assert.equal(isPathAllowed(".env"), false);
  assert.equal(isPathAllowed(".env.local"), false);
  assert.equal(isPathAllowed(".env.example"), false);
  assert.equal(isPathAllowed("app/lib/secretConfig.js"), false);
  assert.equal(isPathAllowed("app/lib/credentialStore.js"), false);
});

test("isPathAllowed: kilit dosyaları ve ikili/görsel uzantılar dışlanır", () => {
  assert.equal(isPathAllowed("package-lock.json"), false);
  assert.equal(isPathAllowed("public/logo.png"), false);
  assert.equal(isPathAllowed("public/font.woff2"), false);
});

test("isPathAllowed: normal kaynak dosyaları izinlidir", () => {
  assert.equal(isPathAllowed("app/api/chat/route.js"), true);
  assert.equal(isPathAllowed("app/lib/context.js"), true);
  assert.equal(isPathAllowed("README.md"), true);
});

test("sanitizeRepositoryContent: GitHub token deseni redakte edilir", () => {
  const content = 'const t = "ghp_abcdefghijklmnopqrstuvwxyz012345";';
  const safe = sanitizeRepositoryContent(content);
  assert.ok(!safe.includes("ghp_abcdefghijklmnopqrstuvwxyz012345"));
  assert.ok(safe.includes("[REDACTED]"));
});

test("sanitizeRepositoryContent: env değişkeni atamaları redakte edilir", () => {
  const content = "GROQ_API_KEY=super-secret-value-123";
  const safe = sanitizeRepositoryContent(content);
  assert.ok(!safe.includes("super-secret-value-123"));
});

test("searchRelevantFiles: 'chat api' sorgusu route.js'i bulur", () => {
  const tree = [
    { path: "app/api/chat/route.js", type: "blob" },
    { path: "app/lib/context.js", type: "blob" },
    { path: "README.md", type: "blob" },
  ];
  const results = searchRelevantFiles("Chat API nasıl çalışıyor?", tree, 3);
  assert.ok(results.includes("app/api/chat/route.js"));
});

test("searchRelevantFiles: eşleşme yoksa genel özet dosyalarına düşer", () => {
  const tree = [
    { path: "app/api/chat/route.js", type: "blob" },
    { path: "app/lib/context.js", type: "blob" },
    { path: "app/lib/core/index.js", type: "blob" },
  ];
  const results = searchRelevantFiles("kendi kodunu incele", tree, 3);
  assert.ok(results.length > 0);
  results.forEach((r) => assert.ok(tree.some((n) => n.path === r)));
});
