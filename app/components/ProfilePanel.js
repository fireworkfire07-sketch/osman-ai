"use client";

import { useState } from "react";
import { PROFILE_FIELDS } from "../lib/data/profile";

export default function ProfilePanel({ profile, onSave, onReset }) {
  const [draft, setDraft] = useState(profile);

  function change(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="osman-panel">
      <h2>Osman Profili</h2>
      {PROFILE_FIELDS.map((field) => (
        <label key={field.key} className="osman-field">
          {field.label}
          <textarea
            rows={field.key === "isim" ? 1 : 2}
            value={draft[field.key] || ""}
            onChange={(e) => change(field.key, e.target.value)}
          />
        </label>
      ))}
      <div className="osman-panel-actions">
        <button onClick={() => onSave(draft)}>Kaydet</button>
        <button
          className="secondary"
          onClick={() => {
            if (window.confirm("Profili varsayılana sıfırlamak istediğine emin misin?")) {
              const reset = onReset();
              setDraft(reset);
            }
          }}
        >
          Varsayılana sıfırla
        </button>
      </div>
    </div>
  );
}
