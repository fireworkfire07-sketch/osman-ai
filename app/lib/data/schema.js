import { STORAGE_KEYS } from "./keys";
import { readJSON, writeJSON } from "./storage";

// localStorage şemasının tek sürüm kaynağı. Bugüne kadar veri hiç
// sürümlenmedi; bu ilk sürüm (1) yalnızca sürüm takibini başlatır, herhangi
// bir alan dönüşümü yapmaz. Gelecekte bir alan adı/şekli değiştiğinde bu
// listeye { to: <yeni sürüm>, migrate(all) { ...; return all; } } eklenir —
// başka hiçbir dosyada şema sürümü tutulmaz.
export const CURRENT_SCHEMA_VERSION = 1;
export const SCHEMA_VERSION_KEY = "osman-ai:schema-version";
export const PRE_MIGRATION_BACKUP_KEY = "osman-ai:pre-migration-backup";

export const MIGRATIONS = [
  // Örnek (henüz kayıtlı değil):
  // { to: 2, migrate(all) { ...all, futureProblems: (all.futureProblems || []).map(...) } }
];

// Saf fonksiyon: localStorage'a dokunmaz, yalnızca veriyi dönüştürür.
// Bir migrate() adımı hata fırlatırsa çağıran taraf (applyMigrations)
// yedekten geri yükler — burada veri kaybı riski yoktur.
export function runMigrationPipeline(initialData, fromVersion, toVersion, migrations = MIGRATIONS) {
  let data = initialData;
  const steps = migrations
    .filter((step) => step.to > fromVersion && step.to <= toVersion)
    .sort((a, b) => a.to - b.to);
  for (const step of steps) {
    data = step.migrate(data);
  }
  return data;
}

function readAllRaw() {
  const all = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    all[name] = readJSON(key, undefined);
  });
  return all;
}

function writeAllRaw(all) {
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    if (all[name] !== undefined) writeJSON(key, all[name]);
  });
}

// Sayfa her açıldığında bir kez çağrılır. Sürüm zaten güncelse hiçbir şeye
// dokunmaz. Güncel değilse: önce tüm veriyi yedekler, sonra dönüştürür;
// dönüştürme başarısız olursa yedekten aynen geri yükler — mevcut kullanıcı
// verisi hiçbir durumda silinmez veya yarım bırakılmaz.
export function applyMigrations() {
  if (typeof window === "undefined") return { ok: true, ran: false };

  const storedVersion = Number(readJSON(SCHEMA_VERSION_KEY, 0)) || 0;
  if (storedVersion >= CURRENT_SCHEMA_VERSION) {
    return { ok: true, ran: false };
  }

  const before = readAllRaw();
  writeJSON(PRE_MIGRATION_BACKUP_KEY, {
    fromVersion: storedVersion,
    data: before,
    backedUpAt: new Date().toISOString(),
  });

  try {
    const migrated = runMigrationPipeline(before, storedVersion, CURRENT_SCHEMA_VERSION);
    writeAllRaw(migrated);
    writeJSON(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION);
    return { ok: true, ran: true, fromVersion: storedVersion, toVersion: CURRENT_SCHEMA_VERSION };
  } catch (err) {
    writeAllRaw(before);
    return {
      ok: false,
      ran: true,
      fromVersion: storedVersion,
      error: `Veri güncellemesi (şema göçü) başarısız oldu, önceki verin geri yüklendi: ${String(err?.message || err)}`,
    };
  }
}
