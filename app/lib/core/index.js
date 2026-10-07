import { PERSONALITY } from "./personality";
import { BRAIN } from "./brain";
import { DECISION_ENGINE } from "./decisionEngine";
import { OSMAN_TWIN } from "./twin";

export const SYSTEM_PROMPT = `${PERSONALITY}\n\n${OSMAN_TWIN}\n\n${BRAIN}\n\n${DECISION_ENGINE}`;

export const APP_VERSION = "OSMAN AI — Digital Twin V1";
export const BUILD_INFO = "Next.js 16 · GROQ · Vercel";

export const WELCOME_MESSAGE = "Merhaba Osman. Bugün ne üzerinde çalışıyoruz?";

export const QUICK_START_PROMPTS = [
  "Projelerimi değerlendir",
  "Bugünkü önceliklerimi çıkar",
  "Yeni bir karar üzerinde düşün",
];