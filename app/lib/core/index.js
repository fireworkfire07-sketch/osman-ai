import { PERSONALITY } from "./personality";
import { BRAIN } from "./brain";

export const SYSTEM_PROMPT = `${PERSONALITY}\n\n${BRAIN}`;

export const APP_VERSION = "OSMAN AI — V2–V5 katmanları";
export const BUILD_INFO = "Next.js 16 · GROQ (llama-3.3-70b-versatile) · Vercel-ready";

export const WELCOME_MESSAGE = "Merhaba Osman. Bugün ne üzerinde çalışıyoruz?";

export const QUICK_START_PROMPTS = [
  "Projelerimi değerlendir",
  "Bugünkü önceliklerimi çıkar",
  "Yeni bir karar üzerinde düşün",
];
