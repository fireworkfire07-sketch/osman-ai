"use client";

function projectName(projects, id) {
  return projects.find((p) => p.id === id)?.ad || null;
}

export default function TodayPanel({ activeProject, tasks, decisions, projects }) {
  const openTasks = tasks
    .filter((t) => t.durum !== "Tamamlandı")
    .slice(-5)
    .reverse();
  const recentDecisions = [...decisions].slice(-5).reverse();

  return (
    <>
      <section className="osman-list-section">
        <h3 className="osman-section-subtitle">Bugün</h3>
        <div className="osman-simple-card">
          {activeProject ? (
            <>
              <strong>{activeProject.ad}</strong>
              <p>{activeProject.sonrakiAdim || "Sonraki adım tanımlı değil."}</p>
            </>
          ) : (
            <p className="osman-empty">Aktif proje seçilmedi.</p>
          )}
        </div>
      </section>

      <section className="osman-list-section">
        <h3 className="osman-section-subtitle">Yaklaşan Görevler</h3>
        {openTasks.length === 0 ? (
          <p className="osman-empty">Açık görev yok.</p>
        ) : (
          <ul className="osman-simple-list">
            {openTasks.map((t) => (
              <li key={t.id}>
                <span className="osman-row-title">{t.ad}</span>
                <span className="osman-row-meta">
                  {t.oncelik && <span className="osman-tag">{t.oncelik}</span>}
                  {t.projeId && projectName(projects, t.projeId) && (
                    <span className="osman-row-sub">{projectName(projects, t.projeId)}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="osman-list-section">
        <h3 className="osman-section-subtitle">Son Kararlar</h3>
        {recentDecisions.length === 0 ? (
          <p className="osman-empty">Henüz karar yok.</p>
        ) : (
          <ul className="osman-simple-list">
            {recentDecisions.map((d) => (
              <li key={d.id}>
                <span className="osman-row-title">{d.baslik}</span>
                <span className="osman-row-meta">
                  <span className={`osman-tag${d.durum === "Aktif" ? " accent" : ""}`}>{d.durum}</span>
                  {d.tarih && <span className="osman-row-sub">{d.tarih}</span>}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
