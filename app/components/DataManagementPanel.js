"use client";

import { useRef, useState } from "react";
import { downloadJSON, exportAllData, fieldLabel, importAllData, wipeAllData } from "../lib/dataManagement";

export default function DataManagementPanel({ onAfterImport, onAfterWipe }) {
  const fileInputRef = useRef(null);
  const [importReport, setImportReport] = useState(null);

  function handleBackup() {
    const data = exportAllData();
    downloadJSON(`osman-ai-yedek-${new Date().toISOString().slice(0, 10)}.json`, data);
  }

  function handleImportClick() {
    setImportReport(null);
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let data;
      try {
        data = JSON.parse(String(reader.result));
      } catch {
        setImportReport({ errors: ["Dosya okunamadı: geçerli bir JSON dosyası değil."], imported: [], skipped: [] });
        return;
      }

      if (!window.confirm("İçe aktarma, geçerli görünen alanların üzerine yazacak. Diğer verilerin dokunulmadan kalacak. Devam edilsin mi?")) {
        return;
      }

      const result = importAllData(data);
      setImportReport(result);
      // Sayfa burada otomatik yenilenmez: kullanıcı önce hangi alanların içe
      // aktarıldığını/atlandığını okuyabilsin diye yenileme "Tamam, Sayfayı
      // Yenile" butonuna bırakılır (bkz. aşağıdaki rapor kutusu).
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleWipe() {
    if (!window.confirm("Tüm OSMAN AI verisi (profil, projeler, kararlar, görevler, hafıza) bu cihazdan silinecek. Emin misin?")) {
      return;
    }
    wipeAllData();
    onAfterWipe();
  }

  return (
    <div className="osman-panel">
      <h2>Veri Yönetimi</h2>
      <p className="osman-note">
        Tüm OSMAN AI verisi bu cihazın tarayıcısında (localStorage) tutulur. Aşağıdaki işlemler yalnızca bu
        cihazı etkiler.
      </p>
      <div className="osman-panel-actions">
        <button onClick={handleBackup}>Tüm Veriyi Dışa Aktar</button>
        <button className="secondary" onClick={handleImportClick}>
          Veriyi İçe Aktar
        </button>
        <button className="danger" onClick={handleWipe}>
          Tüm Veriyi Temizle
        </button>
      </div>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {importReport && (
        <div className="osman-card" style={{ marginTop: 12 }}>
          {importReport.imported.length > 0 && (
            <div className="osman-card-row">
              <strong>İçe aktarıldı:</strong> {importReport.imported.map(fieldLabel).join(", ")}
            </div>
          )}
          {importReport.skipped.length > 0 && (
            <div className="osman-card-row">
              <strong>Atlandı (mevcut veri korundu):</strong> {importReport.skipped.map(fieldLabel).join(", ")}
            </div>
          )}
          {importReport.errors.map((err, i) => (
            <div className="osman-card-row" key={i}>
              {err}
            </div>
          ))}
          {importReport.imported.length > 0 && (
            <div className="osman-panel-actions">
              <button onClick={onAfterImport}>Tamam, Sayfayı Yenile</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
