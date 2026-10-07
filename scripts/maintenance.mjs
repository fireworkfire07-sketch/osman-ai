import { auditSystem, repairSystem } from "../app/lib/maintenance/maintenanceEngine.js";

const report = await auditSystem();

console.log(JSON.stringify(report, null, 2));

if (report.status !== "healthy") {
  const repair = await repairSystem(report);
  console.log(JSON.stringify({ repair }, null, 2));

  const remaining = report.failed - repair.repaired.length;
  if (remaining > 0) process.exitCode = 1;
}
