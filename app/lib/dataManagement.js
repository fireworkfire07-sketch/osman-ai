import { STORAGE_KEYS } from "./data/keys";

const FIELD_LABELS = {
  profile: "Profil",
  chatHistory: "Sohbet geçmişi",
  personalMemory: "Kişisel Hafıza",
  projects: "Projeler",
  decisions: "Kararlar",
  tasks: "Görevler",
  futureProblems: "Gelecek Problemleri",
  securityProtocol: "AI Security Protocol",
  paymentProtocol: "AI Payment Protocol",
  improvements: "Sürekli Gelişim Notları",
  activeProjectId: "Aktif proje",
};

const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

// Sohbet geçmişi ayrı bir akışla (Yeni Sohbet / Konuşmayı Dışa Aktar,
// bkz. ChatPanel.js) zaten yönetiliyor; Veri Yönetimi'ndeki dışa/içe
// aktarma yalnızca profil/proje/görev/karar/hafıza/araştırma verisini
// kapsar, sohbet geçmişini hiç içermez.
const BACKUP_FIELD_NAMES = Object.keys(STORAGE_KEYS).filter((name) => name !== "chatHistory");

// Her STORAGE_KEYS alanının beklenen şekli. İçe aktarılan dosya bunlarla
// eşleşmezse o alan atlanır (mevcut veri dokunulmadan kalır) — hiçbir zaman
// yanlış şekilli veri localStorage'a yazılmaz, bu da app/page.js'teki
// .map()/.filter() çağrılarının çökmesini engeller.
const FIELD_VALIDATORS = {
  profile: isPlainObject,
  chatHistory: Array.isArray,
  personalMemory: Array.isArray,
  projects: Array.isArray,
  decisions: Array.isArray,
  tasks: Array.isArray,
  futureProblems: Array.isArray,
  securityProtocol: isPlainObject,
  paymentProtocol: isPlainObject,
  improvements: Array.isArray,
  activeProjectId: (v) => v === null || typeof v === "string",
};

export function exportAllData() {
  const data = { exportedAt: new Date().toISOString() };
  BACKUP_FIELD_NAMES.forEach((name) => {
    const key = STORAGE_KEYS[name];
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

// Yalnızca doğrulama yapar, hiçbir şey yazmaz — DataManagementPanel bunu
// kullanıcıya onaydan önce "şunlar içe aktarılacak, şunlar atlanacak"
// göstermek için çağırabilir.
export function validateImportData(data) {
  if (!isPlainObject(data)) {
    return {
      valid: {},
      imported: [],
      skipped: [],
      errors: ["Dosya geçerli bir OSMAN AI yedek dosyası değil (JSON nesnesi bekleniyordu)."],
    };
  }

  const valid = {};
  const imported = [];
  const skipped = [];
  const errors = [];

  BACKUP_FIELD_NAMES.forEach((name) => {
    if (!(name in data) || data[name] === undefined || data[name] === null) return;
    const validator = FIELD_VALIDATORS[name];
    if (validator(data[name])) {
      valid[name] = data[name];
      imported.push(name);
    } else {
      skipped.push(name);
      errors.push(`"${FIELD_LABELS[name]}" alanı beklenen türde değil, atlandı — mevcut verin korunuyor.`);
    }
  });

  if (imported.length === 0 && skipped.length === 0) {
    errors.push("Dosyada tanınan hiçbir OSMAN AI alanı bulunamadı.");
  }

  return { valid, imported, skipped, errors };
}

// Yalnızca doğrulanmış alanları yazar. Geçersiz/eksik şekilli alanlar
// atlanır ve o anahtarın mevcut değeri hiç değiştirilmez.
export function importAllData(data) {
  const result = validateImportData(data);
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    if (result.valid[name] !== undefined) {
      window.localStorage.setItem(key, JSON.stringify(result.valid[name]));
    }
  });
  return result;
}

export function fieldLabel(name) {
  return FIELD_LABELS[name] || name;
}

export function wipeAllData() {
  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
}
