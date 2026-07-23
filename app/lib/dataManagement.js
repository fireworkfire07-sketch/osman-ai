import { STORAGE_KEYS } from "./data/keys";

export function exportAllData() {
  const data = { exportedAt: new Date().toISOString() };
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      data[name] = null;
      return;
    }
    try {
      data[name] = JSON.parse(raw);
    } catch {
      data[name] = null;
    }
  });
  return data;
}

export function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function importAllData(data) {
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    if (data[name] !== undefined && data[name] !== null) {
      window.localStorage.setItem(key, JSON.stringify(data[name]));
    }
  });
}

export function wipeAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
}
