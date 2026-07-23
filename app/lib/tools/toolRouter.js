import { listRepositoryTree, readRepositoryFile, searchRelevantFiles, getCommitMetadata } from "./githubRepository";

const REPO_TRIGGER_PATTERNS = [
  /kendi\s+kod/i,
  /kendi\s+reposit/i,
  /repository/i,
  /\brepo['’]?(nu|si|sini|yi)?\b/i,
  /hangi\s+dosya/i,
  /dosyalar[ıi]n[ıi]\s+söyle/i,
  /chat\s*api/i,
  /kodundaki\s+eksik/i,
  /kodunda[kiı]?\s+eksik/i,
  /yetenek(lerini)?.*denetle/i,
  /kodunu\s+incele/i,
  /hangi\s+dosyada/i,
  /\.py\b/i,
  /teknik\s+borç/i,
  /güvenlik\s+açığ/i,
];

export function isRepositoryRequest(text) {
  const t = String(text || "");
  return REPO_TRIGGER_PATTERNS.some((re) => re.test(t));
}

const MAX_EVIDENCE_FILES = 3;

export async function buildRepositoryEvidence(userText) {
  const tree = await listRepositoryTree();
  const paths = searchRelevantFiles(userText, tree, MAX_EVIDENCE_FILES);
  const sources = [];
  const blocks = [];

  for (const path of paths) {
    let file;
    try {
      file = await readRepositoryFile(path);
    } catch {
      continue; // Tek bir dosya okunamazsa tüm kanıt üretimi başarısız olmasın.
    }
    if (!file) continue;

    const sourceNumber = sources.length + 1;
    blocks.push(`[SOURCE ${sourceNumber}]\npath: ${path}\nlines: 1-${file.lineCount}\ncontent:\n${file.content}`);
    sources.push({ path, lines: `1-${file.lineCount}`, lineCount: file.lineCount });
  }

  const commit = await getCommitMetadata().catch(() => null);

  return {
    evidenceText: blocks.join("\n\n"),
    sources,
    tree,
    commitShortSha: commit?.shortSha || null,
  };
}
