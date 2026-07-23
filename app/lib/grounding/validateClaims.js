// Modelin cevabında geçen dosya yolu/satır iddialarını gerçek repository
// ağacı ve okunan kanıt dosyalarıyla karşılaştırır. Kanıtlanamayan hiçbir
// teknik iddia kullanıcıya iletilmez (bkz. app/api/chat/route.js).
const PATH_LINE_PATTERN = /\b([\w.-]+(?:\/[\w.-]+)+\.(?:js|jsx|ts|tsx|css|md|json))(?::(\d+)(?:-(\d+))?)?/g;

export function extractClaimedPaths(text) {
  const claims = [];
  const re = new RegExp(PATH_LINE_PATTERN);
  let match;
  while ((match = re.exec(String(text || ""))) !== null) {
    claims.push({
      path: match[1],
      from: match[2] ? Number(match[2]) : null,
      to: match[3] ? Number(match[3]) : match[2] ? Number(match[2]) : null,
    });
  }
  return claims;
}

export function validateClaimedPaths(claims, tree) {
  const treePaths = new Set((tree || []).map((n) => n.path));
  const valid = claims.filter((c) => treePaths.has(c.path));
  const invalid = claims.filter((c) => !treePaths.has(c.path));
  return { valid, invalid };
}

export function validateLineRanges(claims, sources) {
  const lineCountByPath = new Map((sources || []).map((s) => [s.path, s.lineCount]));
  const invalid = [];
  for (const claim of claims) {
    if (claim.from == null) continue;
    const lineCount = lineCountByPath.get(claim.path);
    if (lineCount == null) continue; // Kanıt dışı bir dosya için satır sınırı doğrulanamaz.
    if (claim.from > lineCount || (claim.to != null && claim.to > lineCount)) {
      invalid.push(claim);
    }
  }
  return invalid;
}
