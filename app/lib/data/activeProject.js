import { readJSON, writeJSON } from "./storage";
import { STORAGE_KEYS } from "./keys";

export function loadActiveProjectId() {
  return readJSON(STORAGE_KEYS.activeProjectId, null);
}

export function saveActiveProjectId(id) {
  writeJSON(STORAGE_KEYS.activeProjectId, id);
}
