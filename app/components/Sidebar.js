"use client";

import { useState } from "react";

const PRIMARY_ITEMS = [
  { key: "chat", label: "Sohbet" },
  { key: "ozet", label: "Özet" },
  { key: "projeler", label: "Projeler" },
  { key: "gorevler", label: "Görevler" },
  { key: "kararlar", label: "Kararlar" },
  { key: "hafiza", label: "Hafıza" },
  { key: "gelecek", label: "Araştırmalar" },
  { key: "profil", label: "Profil" },
];

// Mevcut fonksiyonlar korunuyor (AI Security/Payment Protocol, Sistem Durumu,
// Veri Yönetimi) ancak birincil gezinmeyi kalabalıklaştırmamak için ikincil
// bir grupta gösteriliyor.
const SECONDARY_ITEMS = [
  { key: "security", label: "AI Security Protocol" },
  { key: "payment", label: "AI Payment Protocol" },
  { key: "sistem", label: "Sistem Durumu" },
  { key: "veri", label: "Veri Yönetimi" },
];

export default function Sidebar({
  active,
  onSelect,
  onNewChat,
  projects,
  activeProjectId,
  onSelectProject,
  aiOk,
  memoryOk,
}) {
  const [open, setOpen] = useState(false);

  function select(key) {
    onSelect(key);
    setOpen(false);
  }

  function newChat() {
    onNewChat();
    setOpen(false);
  }

  return (
    <>
      <div className="osman-topbar">
        <button className="osman-menu-btn" onClick={() => setOpen(true)} aria-label="Menüyü aç">
          <span />
          <span />
          <span />
        </button>
        <span className="osman-topbar-title">OSMAN AI</span>
      </div>

      {open && <div className="osman-sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`osman-sidebar ${open ? "open" : ""}`}>
        <div className="osman-sidebar-header">
          <span className="osman-brand">OSMAN AI</span>
          <button className="osman-sidebar-close" onClick={() => setOpen(false)} aria-label="Menüyü kapat">
            ×
          </button>
        </div>

        <button className="osman-new-chat" onClick={newChat}>
          + Yeni Sohbet
        </button>

        <nav className="osman-sidebar-nav">
          {PRIMARY_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`osman-nav-item ${active === item.key ? "active" : ""}`}
              onClick={() => select(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="osman-sidebar-divider" />

        <nav className="osman-sidebar-nav secondary">
          {SECONDARY_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`osman-nav-item ${active === item.key ? "active" : ""}`}
              onClick={() => select(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="osman-sidebar-footer">
          {projects.length > 0 && (
            <label className="osman-sidebar-project">
              Aktif proje
              <select value={activeProjectId || ""} onChange={(e) => onSelectProject(e.target.value)}>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.ad}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="osman-sidebar-status">
            <span className={`dot ${aiOk === null ? "" : aiOk ? "ok" : "fail"}`} title="AI bağlantısı" />
            <span className={`dot ${memoryOk ? "ok" : "fail"}`} title="Hafıza" />
            <span className="osman-sidebar-status-text">
              {aiOk === null ? "AI kontrol ediliyor" : aiOk ? "AI çalışıyor" : "AI anahtarı eksik"}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
