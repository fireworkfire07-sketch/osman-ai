let lastStorageError = null;

export function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function isStorageAvailable() {
  if (typeof window === "undefined") return false;
  try {
    const testKey = "osman-ai:__test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// writeJSON/readJSON hatayı artık sessizce yutmuyor: son hata burada saklanır,
// getLastStorageError() ile okunup üst katmanda (Sistem Durumu) gösterilebilir.
export function getLastStorageError() {
  return lastStorageError;
}

export function clearLastStorageError() {
  lastStorageError = null;
}

export function readJSON(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    lastStorageError = `Kayıtlı veri okunamadı (${key}). Varsayılan değerler kullanıldı.`;
    return fallback;
  }
}

export function writeJSON(key, value) {
  if (typeof window === "undefined") return true;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    lastStorageError = "Hafızaya yazılamadı (depolama alanı dolu olabilir). Son değişiklik kaydedilmemiş olabilir.";
    return false;
  }
}

export function removeKey(key) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}
