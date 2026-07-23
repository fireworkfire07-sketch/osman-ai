// Server-side-only GitHub okuma aracı. Yalnızca aşağıdaki tek repository'e
// izin verilir (allowlist) — kullanıcı metninden hiçbir zaman farklı bir
// repo adı türetilmez. GITHUB_TOKEN yalnızca process.env üzerinden okunur,
// hiçbir API cevabında veya logda görünmez.
const ALLOWED_REPO = "fireworkfire07-sketch/osman-ai";
const DEFAULT_BRANCH = "main";
const GITHUB_API = "https://api.github.com";

// node_modules/.next/.git, kilit dosyaları, ikili/görsel dosyalar ve
// .env/secret/credential adlı hiçbir dosya bağlama katılmaz veya modele
// gönderilmez — bu filtre hem ağaç listelemede hem dosya okumada uygulanır.
const EXCLUDED_PATH_PATTERNS = [
  /^node_modules\//,
  /^\.next\//,
  /^\.git\//,
  /(^|\/)\.env(\..*)?$/i,
  /secret/i,
  /credential/i,
  /package-lock\.json$/,
  /pnpm-lock\.yaml$/,
  /yarn\.lock$/,
  /\.(png|jpe?g|gif|ico|webp|svg|woff2?|ttf|eot|pdf|zip|gz|mp4|mov|bin)$/i,
];

const SECRET_VALUE_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9]{20,}/g,
  /github_pat_[A-Za-z0-9_]{20,}/g,
  /sk-[A-Za-z0-9]{20,}/g,
  /GROQ_API_KEY\s*=\s*\S+/gi,
  /GITHUB_TOKEN\s*=\s*\S+/gi,
];

const MAX_FILE_CHARS = 6000;

export function isPathAllowed(path) {
  return !EXCLUDED_PATH_PATTERNS.some((re) => re.test(path));
}

export function sanitizeRepositoryContent(content) {
  let safe = content;
  for (const re of SECRET_VALUE_PATTERNS) {
    safe = safe.replace(re, "[REDACTED]");
  }
  return safe;
}

async function githubFetch(path) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN_MISSING");
  }
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) {
    throw new Error(`GITHUB_API_ERROR_${res.status}`);
  }
  return res;
}

export async function listRepositoryTree() {
  const res = await githubFetch(`/repos/${ALLOWED_REPO}/git/trees/${DEFAULT_BRANCH}?recursive=1`);
  const data = await res.json();
  const tree = Array.isArray(data.tree) ? data.tree : [];
  return tree.filter((node) => node.type === "blob" && isPathAllowed(node.path));
}

export async function readRepositoryFile(path) {
  if (!isPathAllowed(path)) return null;
  const res = await githubFetch(`/repos/${ALLOWED_REPO}/contents/${path}?ref=${DEFAULT_BRANCH}`);
  const data = await res.json();
  if (!data.content || data.encoding !== "base64") return null;

  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  const sanitized = sanitizeRepositoryContent(decoded);
  const truncated = sanitized.length > MAX_FILE_CHARS ? sanitized.slice(0, MAX_FILE_CHARS) : sanitized;
  const lineCount = truncated.split("\n").length;

  return { path, content: truncated, lineCount, sha: data.sha, truncated: sanitized.length > MAX_FILE_CHARS };
}

export async function getCommitMetadata() {
  const res = await githubFetch(`/repos/${ALLOWED_REPO}/commits/${DEFAULT_BRANCH}`);
  const data = await res.json();
  return {
    sha: data.sha,
    shortSha: String(data.sha || "").slice(0, 7),
    message: data.commit?.message || "",
    date: data.commit?.author?.date || "",
  };
}

const KEYWORD_FILE_HINTS = [
  { keywords: ["chat api", "groq", "stream", "sohbet api", "chat endpoint", "api'si"], paths: ["app/api/chat/route.js", "app/api/chat/rateLimit.js"] },
  { keywords: ["bağlam", "context"], paths: ["app/lib/context.js"] },
  { keywords: ["dashboard", "özet", "kart"], paths: ["app/components/DashboardCards.js", "app/components/TodayPanel.js"] },
  { keywords: ["sidebar", "menü", "navigasyon", "nav"], paths: ["app/components/Sidebar.js"] },
  { keywords: ["profil"], paths: ["app/lib/data/profile.js"] },
  { keywords: ["proje"], paths: ["app/lib/data/projects.js"] },
  { keywords: ["görev", "task"], paths: ["app/lib/data/tasks.js"] },
  { keywords: ["karar", "decision"], paths: ["app/lib/data/decisions.js"] },
  { keywords: ["hafıza", "memory"], paths: ["app/lib/data/personalMemory.js"] },
  { keywords: ["şema", "migration", "göç"], paths: ["app/lib/data/schema.js"] },
  { keywords: ["hata", "error", "çökme"], paths: ["app/error.js"] },
  { keywords: ["kimlik", "brain", "karakter", "kişilik", "yetenek"], paths: ["app/lib/core/brain.js", "app/lib/core/personality.js"] },
];

const DEFAULT_OVERVIEW_PATHS = ["app/api/chat/route.js", "app/lib/context.js", "app/lib/core/index.js"];

export function searchRelevantFiles(query, tree, max = 3) {
  const q = String(query || "").toLowerCase();
  const candidatePaths = tree.map((n) => n.path);
  const candidateSet = new Set(candidatePaths);
  const scored = new Map();

  function bump(path, score) {
    if (!candidateSet.has(path)) return;
    scored.set(path, (scored.get(path) || 0) + score);
  }

  for (const hint of KEYWORD_FILE_HINTS) {
    if (hint.keywords.some((k) => q.includes(k))) {
      hint.paths.forEach((p) => bump(p, 5));
    }
  }

  const words = q.split(/[^a-zçğıöşü0-9]+/i).filter((w) => w.length > 3);
  for (const path of candidatePaths) {
    const lowerPath = path.toLowerCase();
    for (const w of words) {
      if (lowerPath.includes(w)) bump(path, 1);
    }
  }

  if (scored.size === 0) {
    return DEFAULT_OVERVIEW_PATHS.filter((p) => candidateSet.has(p)).slice(0, max);
  }

  return [...scored.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([path]) => path);
}
