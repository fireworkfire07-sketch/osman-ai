"use client";

import { useState } from "react";

function emptyFormFor(fields) {
  const draft = {};
  fields.forEach((f) => {
    draft[f.key] = f.type === "select" ? f.options?.[0]?.value ?? "" : "";
  });
  return draft;
}

export default function RecordListPanel({
  title,
  fields,
  records,
  onAdd,
  onUpdate,
  onDelete,
  protectedIds = [],
  renderCardExtra,
}) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => emptyFormFor(fields));

  function startEdit(record) {
    setEditingId(record.id);
    const draft = {};
    fields.forEach((f) => {
      draft[f.key] = record[f.key] ?? "";
    });
    setForm(draft);
  }

  function cancel() {
    setEditingId(null);
    setForm(emptyFormFor(fields));
  }

  function submit(e) {
    e.preventDefault();
    const firstKey = fields[0].key;
    if (!String(form[firstKey] || "").trim()) return;
    if (editingId) {
      onUpdate(editingId, form);
    } else {
      onAdd(form);
    }
    cancel();
  }

  function remove(id) {
    if (protectedIds.includes(id)) return;
    if (typeof window !== "undefined" && !window.confirm("Bu kaydı silmek istediğine emin misin?")) return;
    onDelete(id);
    if (editingId === id) cancel();
  }

  return (
    <div className="osman-panel">
      <h2>{title}</h2>
      <div className="osman-list">
        {records.length === 0 && <div className="osman-empty">Henüz kayıt yok.</div>}
        {records.map((record) => (
          <div key={record.id} className="osman-card">
            <div className="osman-card-title">
              {String(record[fields[0].key] || "(adsız)")}
              {protectedIds.includes(record.id) && <span className="badge">sabit</span>}
            </div>
            {fields.slice(1).map((f) =>
              record[f.key] ? (
                <div className="osman-card-row" key={f.key}>
                  <strong>{f.label}:</strong> {String(record[f.key])}
                </div>
              ) : null
            )}
            <div className="osman-panel-actions">
              {renderCardExtra && renderCardExtra(record)}
              <button className="secondary" onClick={() => startEdit(record)}>
                Düzenle
              </button>
              {!protectedIds.includes(record.id) && (
                <button className="danger" onClick={() => remove(record.id)}>
                  Sil
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <h3>{editingId ? "Kaydı Düzenle" : "Yeni Kayıt Ekle"}</h3>
      <form className="osman-project-form" onSubmit={submit}>
        {fields.map((f) => (
          <label key={f.key} className="osman-field">
            {f.label}
            {f.type === "textarea" ? (
              <textarea
                rows={2}
                value={form[f.key] || ""}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              />
            ) : f.type === "select" ? (
              <select
                value={form[f.key] || ""}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              >
                {(f.options || []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={form[f.key] || ""}
                onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
              />
            )}
          </label>
        ))}
        <div className="osman-panel-actions">
          <button type="submit">{editingId ? "Güncelle" : "Ekle"}</button>
          {editingId && (
            <button type="button" className="secondary" onClick={cancel}>
              Vazgeç
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
