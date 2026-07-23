// Next.js (webpack/turbopack) uzantısız göreli importları (örn. "./keys")
// çözebiliyor, ama Node'un yerel ESM çözümleyicisi çözemiyor. Uygulama
// kaynak dosyalarını yalnızca test çalıştırıcısını memnun etmek için
// değiştirmemek adına, testler bu küçük çözümleyici kancasıyla çalıştırılır:
// uzantısız bir göreli import başarısız olursa ".js" ekleyip tekrar dener.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
    const hasExtension = /\.(m?js|json)$/.test(specifier);
    if (isRelative && !hasExtension) {
      const candidateUrl = new URL(`${specifier}.js`, context.parentURL);
      if (existsSync(fileURLToPath(candidateUrl))) {
        return nextResolve(`${specifier}.js`, context);
      }
    }
    throw err;
  }
}
