import { readJSON, writeJSON } from "./storage";

// Tek nesnelik (liste değil) hafıza kaydı için paylaşılan yükle/kaydet/sıfırla
// mantığı. Profile, AI Security Protocol ve AI Payment Protocol aynı şekle
// sahiptir (id yok, tek kayıt) — her biri kendi CRUD'unu yazmak yerine bunu
// kullanır.
export function createSingleRecord(storageKey, createDefault) {
  function load() {
    const existing = readJSON(storageKey, null);
    if (existing) return existing;
    const created = createDefault();
    writeJSON(storageKey, created);
    return created;
  }

  function save(record) {
    writeJSON(storageKey, record);
  }

  function reset() {
    const created = createDefault();
    writeJSON(storageKey, created);
    return created;
  }

  return { load, save, reset };
}
