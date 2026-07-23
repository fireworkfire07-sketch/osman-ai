"use client";

import { useEffect, useRef, useState } from "react";
import {
  createDefaultDecisions,
  createDefaultProfile,
  createDefaultProjects,
  loadActiveProjectId,
  loadDecisions,
  loadProfile,
  loadProjects,
  newId,
  saveActiveProjectId,
  saveDecisions,
  saveProfile,
  saveProjects,
  WELCOME_MESSAGE,
} from "./lib/osman";

const PROFILE_FIELDS = [
  { key: "isim", label: "İsim" },
  { key: "meslekler", label: "Meslekler" },
  { key: "yetenekler", label: "Yetenekler" },
  { key: "ilgiAlanlari", label: "İlgi alanları" },
  { key: "girisimcilik", label: "Girişimcilik / vizyon" },
  { key: "calismaSekli", label: "Çalışma şekli" },
  { key: "cevapTercihleri", label: "Cevap tercihleri" },
];

const EMPTY_PROJECT_FORM = {
  ad: "",
  amac: "",
  durum: "",
  teknoloji: "",
  repo: "",
  sonYapilanIslem: "",
  sonrakiAdim: "",
  oncelik: "Orta",
};

const EMPTY_DECISION_FORM = { proje: "", karar: "" };

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiOk, setAiOk] = useState(null);
  const listRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);

  const [panel, setPanel] = useState(null); // null | "profil" | "projeler" | "kararlar"
  const [profileDraft, setProfileDraft] = useState(null);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT_FORM);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [decisionForm, setDecisionForm] = useState(EMPTY_DECISION_FORM);

  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => setAiOk(Boolean(data.groqKeyPresent)))
      .catch(() => setAiOk(false));
  }, []);

  useEffect(() => {
    let p = loadProfile();
    if (!p) {
      p = createDefaultProfile();
      saveProfile(p);
    }

    let pr = loadProjects();
    if (!pr || pr.length === 0) {
      pr = createDefaultProjects();
      saveProjects(pr);
    }

    let d = loadDecisions();
    if (!d) {
      d = createDefaultDecisions();
      saveDecisions(d);
    }

    let activeId = loadActiveProjectId();
    if (!activeId || !pr.some((item) => item.id === activeId)) {
      activeId = pr[0]?.id || null;
      if (activeId) saveActiveProjectId(activeId);
    }

    setProfile(p);
    setProfileDraft(p);
    setProjects(pr);
    setDecisions(d);
    setActiveProjectId(activeId);
    setReady(true);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          context: { profile, activeProject, decisions },
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "error", content: data.error || "Bilinmeyen bir hata oluştu." },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: "Sunucuya ulaşılamadı. İnternet bağlantını kontrol et." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function togglePanel(name) {
    setPanel((current) => (current === name ? null : name));
  }

  function handleProfileFieldChange(key, value) {
    setProfileDraft((prev) => ({ ...prev, [key]: value }));
  }

  function saveProfileDraft() {
    setProfile(profileDraft);
    saveProfile(profileDraft);
  }

  function resetProfile() {
    const defaults = createDefaultProfile();
    setProfile(defaults);
    setProfileDraft(defaults);
    saveProfile(defaults);
  }

  function startEditProject(project) {
    setEditingProjectId(project.id);
    setProjectForm({
      ad: project.ad,
      amac: project.amac,
      durum: project.durum,
      teknoloji: project.teknoloji,
      repo: project.repo,
      sonYapilanIslem: project.sonYapilanIslem,
      sonrakiAdim: project.sonrakiAdim,
      oncelik: project.oncelik,
    });
  }

  function cancelProjectForm() {
    setEditingProjectId(null);
    setProjectForm(EMPTY_PROJECT_FORM);
  }

  function submitProjectForm(e) {
    e.preventDefault();
    if (!projectForm.ad.trim()) return;
    const today = new Date().toISOString().slice(0, 10);

    let nextProjects;
    if (editingProjectId) {
      nextProjects = projects.map((p) =>
        p.id === editingProjectId ? { ...p, ...projectForm, guncellenmeTarihi: today } : p
      );
    } else {
      const newProject = { id: newId(), ...projectForm, guncellenmeTarihi: today };
      nextProjects = [...projects, newProject];
    }

    setProjects(nextProjects);
    saveProjects(nextProjects);
    cancelProjectForm();

    if (!activeProjectId && nextProjects.length === 1) {
      setActiveProjectId(nextProjects[0].id);
      saveActiveProjectId(nextProjects[0].id);
    }
  }

  function deleteProject(id) {
    const nextProjects = projects.filter((p) => p.id !== id);
    setProjects(nextProjects);
    saveProjects(nextProjects);
    if (activeProjectId === id) {
      const nextActive = nextProjects[0]?.id || null;
      setActiveProjectId(nextActive);
      saveActiveProjectId(nextActive);
    }
  }

  function selectActiveProject(id) {
    setActiveProjectId(id);
    saveActiveProjectId(id);
  }

  function submitDecisionForm(e) {
    e.preventDefault();
    if (!decisionForm.karar.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    const entry = {
      id: newId(),
      tarih: today,
      proje: decisionForm.proje || activeProject?.ad || "Genel",
      karar: decisionForm.karar.trim(),
    };
    const nextDecisions = [...decisions, entry];
    setDecisions(nextDecisions);
    saveDecisions(nextDecisions);
    setDecisionForm(EMPTY_DECISION_FORM);
  }

  function deleteDecision(id) {
    const nextDecisions = decisions.filter((d) => d.id !== id);
    setDecisions(nextDecisions);
    saveDecisions(nextDecisions);
  }

  return (
    <div id="osman-app">
      <header className="osman-header">
        <h1>OSMAN AI</h1>
        <p>Osman'ın kişisel dijital zekâsı</p>
      </header>

      <div className="osman-status">
        <span>
          <span className="dot ok" /> Sistem çalışıyor
        </span>
        <span>
          <span className={`dot ${aiOk === null ? "" : aiOk ? "ok" : "fail"}`} />
          {aiOk === null ? "AI bağlantısı kontrol ediliyor" : aiOk ? "AI bağlantısı çalışıyor" : "AI anahtarı eksik"}
        </span>
        <span>
          <span className={`dot ${ready ? "ok" : ""}`} /> Hafıza çalışıyor
        </span>
      </div>

      <nav className="osman-nav">
        <button className={panel === "profil" ? "active" : ""} onClick={() => togglePanel("profil")}>
          Osman Profili
        </button>
        <button className={panel === "projeler" ? "active" : ""} onClick={() => togglePanel("projeler")}>
          Projeler
        </button>
        <button className={panel === "kararlar" ? "active" : ""} onClick={() => togglePanel("kararlar")}>
          Kararlar
        </button>
      </nav>

      {activeProject && (
        <div className="osman-active-project">
          Aktif proje:
          <select value={activeProjectId || ""} onChange={(e) => selectActiveProject(e.target.value)}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.ad}
              </option>
            ))}
          </select>
        </div>
      )}

      {panel === "profil" && profileDraft && (
        <div className="osman-panel">
          <h2>Osman Profili</h2>
          {PROFILE_FIELDS.map((field) => (
            <label key={field.key} className="osman-field">
              {field.label}
              <textarea
                value={profileDraft[field.key] || ""}
                onChange={(e) => handleProfileFieldChange(field.key, e.target.value)}
                rows={field.key === "isim" ? 1 : 2}
              />
            </label>
          ))}
          <div className="osman-panel-actions">
            <button onClick={saveProfileDraft}>Kaydet</button>
            <button className="secondary" onClick={resetProfile}>
              Varsayılana sıfırla
            </button>
          </div>
        </div>
      )}

      {panel === "projeler" && (
        <div className="osman-panel">
          <h2>Projeler</h2>
          <div className="osman-list">
            {projects.map((p) => (
              <div key={p.id} className="osman-card">
                <div className="osman-card-title">
                  {p.ad} {p.id === activeProjectId && <span className="badge">aktif</span>}
                </div>
                <div className="osman-card-row">
                  <strong>Amaç:</strong> {p.amac}
                </div>
                <div className="osman-card-row">
                  <strong>Durum:</strong> {p.durum}
                </div>
                <div className="osman-card-row">
                  <strong>Teknoloji:</strong> {p.teknoloji}
                </div>
                <div className="osman-card-row">
                  <strong>Repo:</strong> {p.repo || "—"}
                </div>
                <div className="osman-card-row">
                  <strong>Son yapılan işlem:</strong> {p.sonYapilanIslem}
                </div>
                <div className="osman-card-row">
                  <strong>Sonraki adım:</strong> {p.sonrakiAdim}
                </div>
                <div className="osman-card-row">
                  <strong>Öncelik:</strong> {p.oncelik} · <strong>Güncelleme:</strong> {p.guncellenmeTarihi}
                </div>
                <div className="osman-panel-actions">
                  <button onClick={() => selectActiveProject(p.id)}>Aktif Yap</button>
                  <button className="secondary" onClick={() => startEditProject(p)}>
                    Düzenle
                  </button>
                  <button className="danger" onClick={() => deleteProject(p.id)}>
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3>{editingProjectId ? "Projeyi Düzenle" : "Yeni Proje Ekle"}</h3>
          <form className="osman-project-form" onSubmit={submitProjectForm}>
            <label className="osman-field">
              Proje adı
              <input
                value={projectForm.ad}
                onChange={(e) => setProjectForm((f) => ({ ...f, ad: e.target.value }))}
              />
            </label>
            <label className="osman-field">
              Amaç
              <input
                value={projectForm.amac}
                onChange={(e) => setProjectForm((f) => ({ ...f, amac: e.target.value }))}
              />
            </label>
            <label className="osman-field">
              Mevcut durum
              <input
                value={projectForm.durum}
                onChange={(e) => setProjectForm((f) => ({ ...f, durum: e.target.value }))}
              />
            </label>
            <label className="osman-field">
              Kullanılan teknoloji
              <input
                value={projectForm.teknoloji}
                onChange={(e) => setProjectForm((f) => ({ ...f, teknoloji: e.target.value }))}
              />
            </label>
            <label className="osman-field">
              Repo / platform
              <input
                value={projectForm.repo}
                onChange={(e) => setProjectForm((f) => ({ ...f, repo: e.target.value }))}
              />
            </label>
            <label className="osman-field">
              Son yapılan işlem
              <input
                value={projectForm.sonYapilanIslem}
                onChange={(e) => setProjectForm((f) => ({ ...f, sonYapilanIslem: e.target.value }))}
              />
            </label>
            <label className="osman-field">
              Sonraki adım
              <input
                value={projectForm.sonrakiAdim}
                onChange={(e) => setProjectForm((f) => ({ ...f, sonrakiAdim: e.target.value }))}
              />
            </label>
            <label className="osman-field">
              Öncelik
              <select
                value={projectForm.oncelik}
                onChange={(e) => setProjectForm((f) => ({ ...f, oncelik: e.target.value }))}
              >
                <option>Yüksek</option>
                <option>Orta</option>
                <option>Düşük</option>
              </select>
            </label>
            <div className="osman-panel-actions">
              <button type="submit">{editingProjectId ? "Güncelle" : "Ekle"}</button>
              {editingProjectId && (
                <button type="button" className="secondary" onClick={cancelProjectForm}>
                  Vazgeç
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {panel === "kararlar" && (
        <div className="osman-panel">
          <h2>Kararlar</h2>
          <div className="osman-list">
            {decisions
              .slice()
              .reverse()
              .map((d) => (
                <div key={d.id} className="osman-card">
                  <div className="osman-card-row">
                    <strong>{d.tarih}</strong> · {d.proje}
                  </div>
                  <div className="osman-card-row">{d.karar}</div>
                  <div className="osman-panel-actions">
                    <button className="danger" onClick={() => deleteDecision(d.id)}>
                      Sil
                    </button>
                  </div>
                </div>
              ))}
          </div>

          <h3>Yeni Karar Ekle</h3>
          <form className="osman-project-form" onSubmit={submitDecisionForm}>
            <label className="osman-field">
              İlgili proje
              <select
                value={decisionForm.proje || activeProject?.ad || ""}
                onChange={(e) => setDecisionForm((f) => ({ ...f, proje: e.target.value }))}
              >
                <option value="">Genel</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.ad}>
                    {p.ad}
                  </option>
                ))}
              </select>
            </label>
            <label className="osman-field">
              Karar
              <textarea
                rows={2}
                value={decisionForm.karar}
                onChange={(e) => setDecisionForm((f) => ({ ...f, karar: e.target.value }))}
              />
            </label>
            <div className="osman-panel-actions">
              <button type="submit">Kaydet</button>
            </div>
          </form>
        </div>
      )}

      <div className="osman-messages" ref={listRef}>
        {messages.length === 0 && <div className="msg assistant">{WELCOME_MESSAGE}</div>}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="msg assistant">Yazıyor…</div>}
      </div>

      <form className="osman-form" onSubmit={sendMessage}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              sendMessage(e);
            }
          }}
          placeholder="Mesajını yaz..."
          rows={1}
        />
        <button type="submit" disabled={loading}>
          Gönder
        </button>
      </form>
    </div>
  );
}
