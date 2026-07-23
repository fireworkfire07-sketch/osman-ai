import { readJSON, removeKey, writeJSON } from "./storage";
import { STORAGE_KEYS } from "./keys";

export function loadChatHistory() {
  return readJSON(STORAGE_KEYS.chatHistory, []);
}

export function saveChatHistory(messages) {
  writeJSON(STORAGE_KEYS.chatHistory, messages);
}

export function clearChatHistory() {
  removeKey(STORAGE_KEYS.chatHistory);
}
