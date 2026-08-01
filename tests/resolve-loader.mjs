// Next.js (webpack/turbopack) uzantısız göreli importları (örn. "./keys")
// ve dizin importlarını (örn. "../../lib/core" -> core/index.js) çözebiliyor,
// ama Node'un yerel ESM çözümleyicisi ikisini de çözemiyor. Uygulama kaynak
// dosyalarını yalnızca test çalıştırıcısını memnun etmek için değiştirmemek
// adına, testler bu küçük çözümleyici kancasıyla çalıştırılır: uzantısız bir
// göreli import başarısız olursa önce ".js" ekleyip, o da yoksa "/index.js"
// ekleyip tekrar dener.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
    const hasExtension = /\.(m?js|json)$/.test(specifier);
    if (isRelative && !hasExtension) {
      const fileCandidate = new URL(`${specifier}.js`, context.parentURL);
      if (existsSync(fileURLToPath(fileCandidate))) {
        return nextResolve(`${specifier}.js`, context);
      }
      const indexCandidate = new URL(`${specifier}/index.js`, context.parentURL);
      if (existsSync(fileURLToPath(indexCandidate))) {
        return nextResolve(`${specifier}/index.js`, context);
      }
    }
    throw err;
  }
}
