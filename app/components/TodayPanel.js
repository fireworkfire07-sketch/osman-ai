"use client";

export default function TodayPanel({ lastTask, lastDecision, lastProject, activeProject, openResearch }) {
  return (
    <div className="osman-panel">
      <h2>Bugün</h2>
      <div className="osman-card">
        <div className="osman-card-row">
          <strong>Son görev:</strong> {lastTask ? `${lastTask.ad} (${lastTask.durum})` : "yok"}
        </div>
        <div className="osman-card-row">
          <strong>Son karar:</strong> {lastDecision ? `${lastDecision.baslik}` : "yok"}
        </div>
        <div className="osman-card-row">
          <strong>Son proje:</strong> {lastProject ? lastProject.ad : "yok"}
        </div>
        <div className="osman-card-row">
          <strong>Devam edilmesi gereken iş:</strong>{" "}
          {activeProject ? `${activeProject.ad}: ${activeProject.sonrakiAdim || "sonraki adım tanımlı değil"}` : "aktif proje yok"}
        </div>
        <div className="osman-card-row">
          <strong>Açık araştırmalar:</strong>{" "}
          {openResearch && openResearch.length
            ? openResearch.map((r) => r.baslik).join(", ")
            : "yok"}
        </div>
      </div>
    </div>
  );
}
