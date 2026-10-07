import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";

const REQUIRED_FILES = [
  "package.json",
  "app/api/chat/route.js",
  "app/lib/core/index.js",
  "app/lib/research.js",
  "app/components/SystemHealthPanel.js",
];

const REPAIR_HANDLERS = new Map();

function run(command, args = [], cwd = process.cwd()) {
  return new Promise((resolve) => {
    execFile(command, args, { cwd, timeout: 120000, maxBuffer: 2 * 1024 * 1024 }, (error, stdout, stderr) => {
      resolve({
        ok: !error,
        code: error?.code ?? 0,
        stdout: String(stdout || ""),
        stderr: String(stderr || ""),
      });
    });
  });
}

function checkFiles(root) {
  return REQUIRED_FILES.map((relativePath) => {
    const fullPath = path.join(root, relativePath);
    const exists = fs.existsSync(fullPath);
    return {
      check: "file",
      target: relativePath,
      ok: exists,
      detail: exists ? "mevcut" : "eksik",
    };
  });
}

function checkPackage(root) {
  const packagePath = path.join(root, "package.json");
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const requiredScripts = ["build", "test"];
    const missingScripts = requiredScripts.filter((name) => !pkg.scripts?.[name]);
    return {
      check: "package",
      target: "package.json",
      ok: missingScripts.length === 0,
      detail: missingScripts.length ? `Eksik script: ${missingScripts.join(", ")}` : "build ve test scriptleri mevcut",
    };
  } catch (error) {
    return {
      check: "package",
      target: "package.json",
      ok: false,
      detail: `package.json okunamadı: ${error.message}`,
    };
  }
}

function summarise(checks) {
  const failed = checks.filter((item) => !item.ok);
  return {
    status: failed.length ? "attention" : "healthy",
    passed: checks.length - failed.length,
    failed: failed.length,
    issues: failed,
  };
}

export function registerRepairHandler(issueKey, handler) {
  if (!issueKey || typeof handler !== "function") {
    throw new TypeError("Geçerli bir issueKey ve repair handler gerekir.");
  }
  REPAIR_HANDLERS.set(issueKey, handler);
}

export async function auditSystem(options = {}) {
  const root = options.root || process.cwd();
  const checks = [
    ...checkFiles(root),
    checkPackage(root),
  ];

  const runCommands = options.runCommands !== false;
  if (runCommands) {
    const test = await run(process.platform === "win32" ? "npm.cmd" : "npm", ["test"], root);
    checks.push({
      check: "tests",
      target: "npm test",
      ok: test.ok,
      detail: test.ok ? "testler geçti" : (test.stderr || test.stdout).slice(-3000),
    });

    const build = await run(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], root);
    checks.push({
      check: "build",
      target: "npm run build",
      ok: build.ok,
      detail: build.ok ? "build geçti" : (build.stderr || build.stdout).slice(-3000),
    });
  }

  const summary = summarise(checks);

  return {
    name: "Osman Denetlemeci / Bakım Onarım Motoru",
    version: "0.1.0",
    checkedAt: new Date().toISOString(),
    root,
    checks,
    ...summary,
    repair: {
      available: failedRepairKeys(checks).length > 0,
      handlers: failedRepairKeys(checks),
      policy: "Sadece kayıtlı güvenli onarım handlerları otomatik çalıştırılır; bilinmeyen kod hataları otomatik değiştirilmez.",
    },
  };
}

function failedRepairKeys(checks) {
  return checks
    .filter((item) => !item.ok)
    .map((item) => `${item.check}:${item.target}`)
    .filter((key) => REPAIR_HANDLERS.has(key));
}

export async function repairSystem(report, options = {}) {
  if (!report || !Array.isArray(report.checks)) {
    throw new TypeError("Geçerli bir denetim raporu gerekir.");
  }

  const repaired = [];
  const skipped = [];

  for (const check of report.checks.filter((item) => !item.ok)) {
    const key = `${check.check}:${check.target}`;
    const handler = REPAIR_HANDLERS.get(key);

    if (!handler) {
      skipped.push({ key, reason: "Güvenli onarım handlerı kayıtlı değil." });
      continue;
    }

    try {
      const result = await handler({ check, root: options.root || process.cwd() });
      repaired.push({ key, result });
    } catch (error) {
      skipped.push({ key, reason: `Onarım başarısız: ${error.message}` });
    }
  }

  return {
    repaired,
    skipped,
    changed: repaired.length > 0,
  };
}
