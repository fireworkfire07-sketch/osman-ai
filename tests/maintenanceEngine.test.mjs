import test from "node:test";
import assert from "node:assert/strict";
import { auditSystem, registerRepairHandler, repairSystem } from "../app/lib/maintenance/maintenanceEngine.js";

test("maintenance engine detects required files and package scripts", async () => {
  const report = await auditSystem({ runCommands: false, root: process.cwd() });

  assert.equal(report.name, "Osman Denetlemeci / Bakım Onarım Motoru");
  assert.ok(report.checks.some((item) => item.check === "file" && item.target === "package.json"));
  assert.ok(report.checks.some((item) => item.check === "package"));
});

test("maintenance engine only repairs registered safe handlers", async () => {
  registerRepairHandler("test:broken", async () => ({ ok: true, action: "fixed" }));

  const result = await repairSystem({
    checks: [
      { check: "test", target: "broken", ok: false },
      { check: "unknown", target: "broken", ok: false },
    ],
  });

  assert.equal(result.repaired.length, 1);
  assert.equal(result.repaired[0].key, "test:broken");
  assert.equal(result.skipped.length, 1);
  assert.equal(result.skipped[0].key, "unknown:broken");
});
