import { newId, readJSON, today, writeJSON } from "./storage";

// Genel liste-tabanlı hafıza deposu. Projects/Decisions/Tasks/PersonalMemory/
// FutureProblems/Protocols/Improvements aynı CRUD şeklini paylaştığı için
// aynı kayıt mantığı burada bir kez yazılır.
export function createCollection(storageKey, { seed, protectedIds = [] } = {}) {
  function defaults() {
    return typeof seed === "function" ? seed() : seed || [];
  }

  function load() {
    const existing = readJSON(storageKey, null);
    if (existing) return existing;
    const seeded = defaults();
    writeJSON(storageKey, seeded);
    return seeded;
  }

  function save(items) {
    writeJSON(storageKey, items);
    return items;
  }

  function add(items, record) {
    const day = today();
    const withMeta = { createdAt: day, updatedAt: day, ...record, id: record.id || newId() };
    return save([...items, withMeta]);
  }

  function update(items, id, patch) {
    const day = today();
    return save(items.map((item) => (item.id === id ? { ...item, ...patch, updatedAt: day } : item)));
  }

  function remove(items, id) {
    if (protectedIds.includes(id)) return items;
    return save(items.filter((item) => item.id !== id));
  }

  function reset() {
    return save(defaults());
  }

  return { load, save, add, update, remove, reset, protectedIds };
}
