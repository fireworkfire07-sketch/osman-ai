"use client";

import { useRef } from "react";
import { downloadJSON, exportAllData, importAllData, wipeAllData } from "../lib/dataManagement";

export default function DataManagementPanel({ onAfterImport, onAfterWipe }) {
  const fileInputRef = useRef(null);

  function handleBackup() {
    const data = exportAllData();
    downloadJSON(`osman-ai-yedek-${new Date().toISOString().slice(0, 10)}.json`, data);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!window.confirm("İçe aktarma, cihazdaki mevcut OSMAN AI verilerinin üzerine yazacak. Devam edilsin mi?")) {
          return;
        }
        importAllData(data);
        onAfterImport();
      } catch {
        window.alert("Dosya okunamadı. Geçerli bir OSMAN AI yedek dosyası (.json) seçtiğinden emin ol.");
      }
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
        <button onClick={handleBackup}>Tüm Veriyi Yedekle (indir)</button>
        <button className="secondary" onClick={handleImportClick}>
          İçe Aktar (yükle)
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
    </div>
  );
}
