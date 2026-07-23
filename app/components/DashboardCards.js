"use client";

function Card({ label, value }) {
  return (
    <div className="osman-dash-card">
      <div className="osman-dash-value">{value}</div>
      <div className="osman-dash-label">{label}</div>
    </div>
  );
}

export default function DashboardCards({
  activeProject,
  totalProjects,
  totalTasks,
  totalDecisions,
  totalMemory,
  totalResearch,
  securityStatus,
  paymentStatus,
}) {
  return (
    <div className="osman-dash-grid">
      <Card label="Aktif Proje" value={activeProject ? activeProject.ad : "—"} />
      <Card label="Toplam Proje" value={totalProjects} />
      <Card label="Görev Sayısı" value={totalTasks} />
      <Card label="Karar Sayısı" value={totalDecisions} />
      <Card label="Hafıza" value={totalMemory} />
      <Card label="Araştırmalar" value={totalResearch} />
      <Card label="AI Security" value={securityStatus || "—"} />
      <Card label="AI Payment" value={paymentStatus || "—"} />
    </div>
  );
}
