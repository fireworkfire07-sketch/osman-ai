"use client";

function Card({ label, value, empty, emptyLabel }) {
  return (
    <div className="osman-dash-card">
      <div className="osman-dash-label">{label}</div>
      <div className={`osman-dash-value${empty ? " empty" : ""}`}>{empty ? emptyLabel : value}</div>
    </div>
  );
}

export default function DashboardCards({ activeProject, openTaskCount, pendingDecisionCount, memoryCount }) {
  return (
    <section className="osman-dashboard-section">
      <h2 className="osman-section-title">Bugünkü Durum</h2>
      <div className="osman-dash-grid">
        <Card
          label="Aktif Proje"
          value={activeProject?.ad}
          empty={!activeProject}
          emptyLabel="Proje seçilmedi"
        />
        <Card label="Açık Görev" value={openTaskCount} empty={openTaskCount === 0} emptyLabel="Açık görev yok" />
        <Card
          label="Bekleyen Karar"
          value={pendingDecisionCount}
          empty={pendingDecisionCount === 0}
          emptyLabel="Bekleyen karar yok"
        />
        <Card label="Hafıza Kaydı" value={memoryCount} empty={memoryCount === 0} emptyLabel="Hafıza kaydı yok" />
      </div>
    </section>
  );
}
