"use client";

import { useEffect, useState } from "react";

// Tek nesnelik kayıtları (Profil, AI Security Protocol, AI Payment Protocol)
// düzenlemek için paylaşılan form. RecordListPanel'in tekil-kayıt karşılığıdır:
// ekleme/silme yoktur, yalnızca kaydet ve (isteğe bağlı) varsayılana sıfırla.
export default function SingleRecordPanel({
  title,
  fields,
  record,
  onSave,
  onReset,
  resetLabel = "Varsayılana sıfırla",
  resetConfirmText = "Varsayılana sıfırlamak istediğine emin misin?",
}) {
  const [draft, setDraft] = useState(record);

  useEffect(() => {
    setDraft(record);
  }, [record]);

  function change(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  if (!draft) return null;

  return (
    <div className="osman-panel">
      <h2>{title}</h2>
      {fields.map((field) => (
        <label key={field.key} className="osman-field">
          {field.label}
          {field.type === "select" ? (
            <select value={draft[field.key] || ""} onChange={(e) => change(field.key, e.target.value)}>
              {(field.options || []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === "text" ? (
            <input value={draft[field.key] || ""} onChange={(e) => change(field.key, e.target.value)} />
          ) : (
            <textarea rows={2} value={draft[field.key] || ""} onChange={(e) => change(field.key, e.target.value)} />
          )}
        </label>
      ))}
      <div className="osman-panel-actions">
        <button onClick={() => onSave(draft)}>Kaydet</button>
        {onReset && (
          <button
            className="secondary"
            onClick={() => {
              if (window.confirm(resetConfirmText)) {
                setDraft(onReset());
              }
            }}
          >
            {resetLabel}
          </button>
        )}
      </div>
    </div>
  );
}
