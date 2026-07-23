"use client";

import { useEffect, useMemo, useState } from "react";

import Nav from "./components/Nav";
import StatusBar from "./components/StatusBar";
import ChatPanel from "./components/ChatPanel";
import SingleRecordPanel from "./components/SingleRecordPanel";
import RecordListPanel from "./components/RecordListPanel";
import SystemHealthPanel from "./components/SystemHealthPanel";
import DataManagementPanel from "./components/DataManagementPanel";
import DashboardCards from "./components/DashboardCards";
import TodayPanel from "./components/TodayPanel";

import { profileRecord, PROFILE_FIELDS } from "./lib/data/profile";
import { projectsCollection, PROJECT_FIELDS, PROJECT_ANALYZER_FIELDS } from "./lib/data/projects";
import { decisionsCollection, decisionFields } from "./lib/data/decisions";
import { tasksCollection, taskFields } from "./lib/data/tasks";
import { personalMemoryCollection, PERSONAL_MEMORY_FIELDS } from "./lib/data/personalMemory";
import { futureProblemsCollection, FUTURE_PROBLEM_FIELDS } from "./lib/data/futureProblems";
import { securityProtocolRecord, SECURITY_PROTOCOL_FIELDS } from "./lib/data/securityProtocol";
import { paymentProtocolRecord, PAYMENT_PROTOCOL_FIELDS } from "./lib/data/paymentProtocol";
import { improvementsCollection, IMPROVEMENT_FIELDS } from "./lib/data/improvements";
import { loadActiveProjectId, saveActiveProjectId } from "./lib/data/activeProject";
import { isStorageAvailable, getLastStorageError, clearLastStorageError } from "./lib/data/storage";
import { applyMigrations } from "./lib/data/schema";

const PROJECT_ALL_FIELDS = [...PROJECT_FIELDS, ...PROJECT_ANALYZER_FIELDS];

export default function Home() {
  const [ready, setReady] = useState(false);
  const [memoryOk, setMemoryOk] = useState(true);
  const [aiOk, setAiOk] = useState(null);
  const [lastError, setLastError] = useState("");
  const [panel, setPanel] = useState("ozet");

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [personalMemory, setPersonalMemory] = useState([]);
  const [futureProblems, setFutureProblems] = useState([]);
  const [securityProtocol, setSecurityProtocol] = useState(null);
  const [paymentProtocol, setPaymentProtocol] = useState(null);
  const [improvements, setImprovements] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);

  // Herhangi bir localStorage okuma/yazma işleminden sonra çağrılır; storage.js
  // sessizce yutmak yerine son hatayı burada saklar, biz onu görünür kılarız
  // (Sistem Durumu panelindeki "Son hata" alanı).
  function reportStorageErrorIfAny() {
    const err = getLastStorageError();
    if (err) {
      setLastError(err);
      clearLastStorageError();
    }
  }

  function runStorageAction(action) {
    const result = action();
    reportStorageErrorIfAny();
    return result;
  }

  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => setAiOk(Boolean(data.groqKeyPresent)))
      .catch(() => setAiOk(false));
  }, []);

  useEffect(() => {
    const storageOk = isStorageAvailable();
    setMemoryOk(storageOk);
    if (!storageOk) {
      setReady(true);
      return;
    }

    const migrationResult = applyMigrations();
    if (!migrationResult.ok) {
      setLastError(migrationResult.error);
    }

    const loadedProjects = projectsCollection.load();
    let activeId = loadActiveProjectId();
    if (!activeId || !loadedProjects.some((p) => p.id === activeId)) {
      activeId = loadedProjects[0]?.id || null;
      if (activeId) saveActiveProjectId(activeId);
    }

    setProfile(profileRecord.load());
    setProjects(loadedProjects);
    setDecisions(decisionsCollection.load());
    setTasks(tasksCollection.load());
    setPersonalMemory(personalMemoryCollection.load());
    setFutureProblems(futureProblemsCollection.load());
    setSecurityProtocol(securityProtocolRecord.load());
    setPaymentProtocol(paymentProtocolRecord.load());
    setImprovements(improvementsCollection.load());
    setActiveProjectId(activeId);
    reportStorageErrorIfAny();
    setReady(true);
  }, []);

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;
  const projectOptions = projects.map((p) => ({ value: p.id, label: p.ad }));

  const projectDecisions = decisions.filter((d) => d.projeId === activeProjectId);
  const projectTasks = tasks.filter((t) => t.projeId === activeProjectId);

  const protocolsSummary = useMemo(() => {
    if (!securityProtocol && !paymentProtocol) return "";
    const parts = [];
    if (securityProtocol) parts.push(`AI Security Protocol (güvenlik seviyesi: ${securityProtocol.guvenlikSeviyesi})`);
    if (paymentProtocol) parts.push(`AI Payment Protocol (güven modeli: ${paymentProtocol.guvenModeli})`);
    return "Stratejik araştırma projeleri: " + parts.join(", ");
  }, [securityProtocol, paymentProtocol]);

  const futureProblemsSummary = useMemo(() => {
    if (!futureProblems.length) return "";
    return `Gelecek araştırma kayıtları: ${futureProblems.length} adet.`;
  }, [futureProblems]);

  const contextData = {
    profile,
    personalMemory,
    activeProject,
    projectDecisions,
    projectTasks,
    protocolsSummary,
    futureProblemsSummary,
  };

  const openResearch = futureProblems.filter((f) => f.durum !== "Vazgeçildi");

  function selectActiveProject(id) {
    setActiveProjectId(id);
    saveActiveProjectId(id);
    reportStorageErrorIfAny();
  }

  return (
    <div id="osman-app">
      <header className="osman-header">
        <h1>OSMAN AI</h1>
        <p>Osman'ın kişisel dijital zekâsı</p>
      </header>

      <StatusBar aiOk={aiOk} memoryOk={memoryOk} />

      {!memoryOk && (
        <div className="osman-warning">
          Bu tarayıcıda localStorage kullanılamıyor. Profil, proje ve karar hafızası bu cihazda çalışmayacak;
          sohbet yine de çalışır ama hiçbir şey hatırlanmaz.
        </div>
      )}

      <Nav active={panel} onSelect={setPanel} />

      {projects.length > 0 && (
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

      {panel === "ozet" && (
        <>
          <DashboardCards
            activeProject={activeProject}
            totalProjects={projects.length}
            totalTasks={tasks.length}
            totalDecisions={decisions.length}
            totalMemory={personalMemory.length}
            totalResearch={futureProblems.length}
            securityStatus={securityProtocol?.guvenlikSeviyesi}
            paymentStatus={paymentProtocol?.guvenModeli}
          />
          <TodayPanel
            lastTask={tasks[tasks.length - 1]}
            lastDecision={decisions[decisions.length - 1]}
            lastProject={projects[projects.length - 1]}
            activeProject={activeProject}
            openResearch={openResearch}
          />
        </>
      )}

      {panel === "chat" && <ChatPanel contextData={contextData} onError={setLastError} />}

      {panel === "profil" && profile && (
        <SingleRecordPanel
          title="Osman Profili"
          fields={PROFILE_FIELDS}
          record={profile}
          onSave={(next) => {
            setProfile(next);
            runStorageAction(() => profileRecord.save(next));
          }}
          onReset={() => {
            const next = runStorageAction(() => profileRecord.reset());
            setProfile(next);
            return next;
          }}
          resetConfirmText="Profili varsayılana sıfırlamak istediğine emin misin?"
        />
      )}

      {panel === "projeler" && (
        <RecordListPanel
          title="Projeler"
          fields={PROJECT_ALL_FIELDS}
          records={projects}
          onAdd={(values) => setProjects(runStorageAction(() => projectsCollection.add(projects, values)))}
          onUpdate={(id, values) => setProjects(runStorageAction(() => projectsCollection.update(projects, id, values)))}
          onDelete={(id) => {
            const next = runStorageAction(() => projectsCollection.remove(projects, id));
            setProjects(next);
            if (activeProjectId === id) {
              const nextActive = next[0]?.id || null;
              selectActiveProject(nextActive);
            }
          }}
          renderCardExtra={(record) => (
            <button onClick={() => selectActiveProject(record.id)}>
              {record.id === activeProjectId ? "Aktif" : "Aktif Yap"}
            </button>
          )}
        />
      )}

      {panel === "gorevler" && (
        <RecordListPanel
          title="Görevler"
          fields={taskFields(projectOptions)}
          records={tasks}
          onAdd={(values) => setTasks(runStorageAction(() => tasksCollection.add(tasks, values)))}
          onUpdate={(id, values) => setTasks(runStorageAction(() => tasksCollection.update(tasks, id, values)))}
          onDelete={(id) => setTasks(runStorageAction(() => tasksCollection.remove(tasks, id)))}
        />
      )}

      {panel === "kararlar" && (
        <RecordListPanel
          title="Kararlar"
          fields={decisionFields(projectOptions)}
          records={decisions}
          onAdd={(values) => setDecisions(runStorageAction(() => decisionsCollection.add(decisions, values)))}
          onUpdate={(id, values) => setDecisions(runStorageAction(() => decisionsCollection.update(decisions, id, values)))}
          onDelete={(id) => setDecisions(runStorageAction(() => decisionsCollection.remove(decisions, id)))}
        />
      )}

      {panel === "hafiza" && (
        <RecordListPanel
          title="Kişisel Hafıza"
          fields={PERSONAL_MEMORY_FIELDS}
          records={personalMemory}
          onAdd={(values) => setPersonalMemory(runStorageAction(() => personalMemoryCollection.add(personalMemory, values)))}
          onUpdate={(id, values) =>
            setPersonalMemory(runStorageAction(() => personalMemoryCollection.update(personalMemory, id, values)))
          }
          onDelete={(id) => setPersonalMemory(runStorageAction(() => personalMemoryCollection.remove(personalMemory, id)))}
        />
      )}

      {panel === "gelecek" && (
        <RecordListPanel
          title="Gelecek Problemleri Araştırması"
          fields={FUTURE_PROBLEM_FIELDS}
          records={futureProblems}
          onAdd={(values) => setFutureProblems(runStorageAction(() => futureProblemsCollection.add(futureProblems, values)))}
          onUpdate={(id, values) =>
            setFutureProblems(runStorageAction(() => futureProblemsCollection.update(futureProblems, id, values)))
          }
          onDelete={(id) =>
            setFutureProblems(runStorageAction(() => futureProblemsCollection.remove(futureProblems, id)))
          }
        />
      )}

      {panel === "security" && securityProtocol && (
        <SingleRecordPanel
          title="AI Security Protocol"
          fields={SECURITY_PROTOCOL_FIELDS}
          record={securityProtocol}
          onSave={(next) => {
            setSecurityProtocol(next);
            runStorageAction(() => securityProtocolRecord.save(next));
          }}
        />
      )}

      {panel === "payment" && paymentProtocol && (
        <SingleRecordPanel
          title="AI Payment Protocol"
          fields={PAYMENT_PROTOCOL_FIELDS}
          record={paymentProtocol}
          onSave={(next) => {
            setPaymentProtocol(next);
            runStorageAction(() => paymentProtocolRecord.save(next));
          }}
        />
      )}

      {panel === "sistem" && (
        <>
          <SystemHealthPanel aiOk={aiOk} memoryOk={memoryOk} activeProject={activeProject} lastError={lastError} />
          <RecordListPanel
            title="Sürekli Gelişim Notları"
            fields={IMPROVEMENT_FIELDS}
            records={improvements}
            onAdd={(values) => setImprovements(runStorageAction(() => improvementsCollection.add(improvements, values)))}
            onUpdate={(id, values) =>
              setImprovements(runStorageAction(() => improvementsCollection.update(improvements, id, values)))
            }
            onDelete={(id) => setImprovements(runStorageAction(() => improvementsCollection.remove(improvements, id)))}
          />
        </>
      )}

      {panel === "veri" && (
        <DataManagementPanel
          onAfterImport={() => window.location.reload()}
          onAfterWipe={() => window.location.reload()}
        />
      )}

      {!ready && <div className="osman-loading">Yükleniyor…</div>}
    </div>
  );
}
