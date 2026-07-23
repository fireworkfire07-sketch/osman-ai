"use client";

import { useMemo, useState } from "react";

function emptyFormFor(fields) {
  const draft = {};
  fields.forEach((f) => {
    draft[f.key] = f.type === "select" ? f.options?.[0]?.value ?? "" : "";
  });
  return draft;
}

function truncate(value, max) {
  const text = String(value || "");
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
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
  renderMeta,
}) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => emptyFormFor(fields));
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const titleField = fields[0];
  const summaryField = fields.find((f) => f.key === "aciklama") || fields[1];
  const filterField =
    fields.find((f) => f.key === "durum" && f.type === "select") ||
    fields.find((f) => f.type === "select" && f.key !== "projeId");

  const visibleRecords = useMemo(() => {
    return records.filter((record) => {
      if (search.trim()) {
        const haystack = String(record[titleField.key] || "").toLowerCase();
        if (!haystack.includes(search.trim().toLowerCase())) return false;
      }
      if (filterField && statusFilter && record[filterField.key] !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [records, search, statusFilter, titleField, filterField]);

  function startAdd() {
    setEditingId(null);
    setForm(emptyFormFor(fields));
    setShowForm(true);
  }

  function startEdit(record) {
    setEditingId(record.id);
    const draft = {};
    fields.forEach((f) => {
      draft[f.key] = record[f.key] ?? "";
    });
    setForm(draft);
    setShowForm(true);
  }

  function cancel() {
    setEditingId(null);
    setForm(emptyFormFor(fields));
    setShowForm(false);
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
    if (expandedId === id) setExpandedId(null);
  }

  function toggleExpand(id) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <div className="osman-panel">
      <div className="osman-panel-header">
        <h2>{title}</h2>
        <button className="osman-primary-action" onClick={showForm && !editingId ? cancel : startAdd}>
          {showForm && !editingId ? "Vazgeç" : "+ Yeni Kayıt"}
        </button>
      </div>

      {records.length > 0 && (
        <div className="osman-toolbar">
          <input
            className="osman-search"
            placeholder={`${title} içinde ara...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filterField && (
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Tümü</option>
              {filterField.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="osman-list">
        {records.length === 0 && <div className="osman-empty">Henüz kayıt yok.</div>}
        {records.length > 0 && visibleRecords.length === 0 && (
          <div className="osman-empty">Aramanla eşleşen kayıt yok.</div>
        )}
        {visibleRecords.map((record) => {
          const isExpanded = expandedId === record.id;
          return (
            <div key={record.id} className={`osman-card${isExpanded ? " expanded" : ""}`}>
              <div className="osman-card-main" onClick={() => toggleExpand(record.id)}>
                <div className="osman-card-title">
                  {String(record[titleField.key] || "(adsız)")}
                  {protectedIds.includes(record.id) && <span className="badge">sabit</span>}
                </div>
                <div className="osman-card-meta">
                  {filterField && record[filterField.key] && (
                    <span className="osman-tag">{String(record[filterField.key])}</span>
                  )}
                  {record.durum && filterField?.key !== "durum" && (
                    <span className="osman-row-sub">{String(record.durum)}</span>
                  )}
                  {renderMeta && <span className="osman-tag subtle">{renderMeta(record)}</span>}
                  {record.updatedAt && <span className="osman-row-sub">Güncelleme: {record.updatedAt}</span>}
                </div>
                {!isExpanded && summaryField && record[summaryField.key] && (
                  <p className="osman-card-summary">{truncate(record[summaryField.key], 120)}</p>
                )}
              </div>

              {isExpanded && (
                <div className="osman-card-details">
                  {fields.slice(1).map((f) =>
                    record[f.key] ? (
                      <div className="osman-card-row" key={f.key}>
                        <strong>{f.label}:</strong> {String(record[f.key])}
                      </div>
                    ) : null
                  )}
                </div>
              )}

              <div className="osman-panel-actions">
                <button className="secondary" onClick={() => toggleExpand(record.id)}>
                  {isExpanded ? "Detayları Kapat" : "Detaylar"}
                </button>
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
          );
        })}
      </div>

      {showForm && (
        <div className="osman-form-block">
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
              <button type="button" className="secondary" onClick={cancel}>
                Vazgeç
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
