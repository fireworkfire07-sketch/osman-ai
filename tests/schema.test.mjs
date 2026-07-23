import test from "node:test";
import assert from "node:assert/strict";

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

const {
  runMigrationPipeline,
  applyMigrations,
  MIGRATIONS,
  CURRENT_SCHEMA_VERSION,
  SCHEMA_VERSION_KEY,
  PRE_MIGRATION_BACKUP_KEY,
} = await import("../app/lib/data/schema.js");
const { STORAGE_KEYS } = await import("../app/lib/data/keys.js");

test("runMigrationPipeline: sürüm aralığındaki adımları sırayla uygular", () => {
  const migrations = [
    { to: 2, migrate: (d) => ({ ...d, a: (d.a || 0) + 1 }) },
    { to: 3, migrate: (d) => ({ ...d, a: (d.a || 0) + 10 }) },
  ];
  const result = runMigrationPipeline({ a: 0 }, 1, 3, migrations);
  assert.equal(result.a, 11);
});

test("runMigrationPipeline: fromVersion'a eşit veya düşük adımları atlar", () => {
  const migrations = [{ to: 1, migrate: (d) => ({ ...d, touched: true }) }];
  const result = runMigrationPipeline({ a: 1 }, 1, 2, migrations);
  assert.equal(result.touched, undefined);
});

test("runMigrationPipeline: bir adım hata fırlatırsa hatayı yukarı iletir", () => {
  const migrations = [{ to: 2, migrate: () => { throw new Error("boom"); } }];
  assert.throws(() => runMigrationPipeline({}, 1, 2, migrations), /boom/);
});

test("applyMigrations: sürüm zaten güncelse hiçbir şeye dokunmaz", () => {
  window.localStorage = new FakeStorage();
  window.localStorage.setItem(SCHEMA_VERSION_KEY, JSON.stringify(CURRENT_SCHEMA_VERSION));
  window.localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify([{ id: "x" }]));

  const result = applyMigrations();

  assert.equal(result.ran, false);
  assert.equal(result.ok, true);
  assert.deepEqual(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.projects)), [{ id: "x" }]);
});

test("applyMigrations: sürüm eksikse (0 kabul edilir) çalışır, yedek alır, sürümü günceller, veriyi bozmaz", () => {
  window.localStorage = new FakeStorage();
  window.localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify([{ id: "p1", ad: "Test Projesi" }]));

  const result = applyMigrations();

  assert.equal(result.ok, true);
  assert.equal(result.ran, true);
  assert.equal(JSON.parse(window.localStorage.getItem(SCHEMA_VERSION_KEY)), CURRENT_SCHEMA_VERSION);
  assert.deepEqual(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.projects)), [{ id: "p1", ad: "Test Projesi" }]);
  assert.ok(window.localStorage.getItem(PRE_MIGRATION_BACKUP_KEY), "yedek anahtarı yazılmış olmalı");
});

test("applyMigrations: bir migrate() adımı hata fırlatırsa mevcut veriyi olduğu gibi geri yükler", () => {
  window.localStorage = new FakeStorage();
  window.localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify([{ id: "keep-me" }]));

  // Gerçek MIGRATIONS listesine test süresince kasıtlı bozuk bir adım eklenir,
  // sonunda geri alınır — üretim listesi boş kalır, sahte bir göç kalıcı olmaz.
  MIGRATIONS.push({ to: CURRENT_SCHEMA_VERSION, migrate: () => { throw new Error("kasıtlı test hatası"); } });
  try {
    const result = applyMigrations();
    assert.equal(result.ok, false);
    assert.match(result.error, /kasıtlı test hatası/);
    assert.deepEqual(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.projects)), [{ id: "keep-me" }]);
    assert.equal(JSON.parse(window.localStorage.getItem(SCHEMA_VERSION_KEY) || "0"), 0);
  } finally {
    MIGRATIONS.pop();
  }
});
