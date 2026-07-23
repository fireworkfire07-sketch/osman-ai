"use client";

import { APP_VERSION, BUILD_INFO } from "../lib/core";

export default function SystemHealthPanel({ aiOk, memoryOk, activeProject, lastError }) {
  return (
    <div className="osman-panel">
      <h2>Sistem Durumu</h2>
      <div className="osman-card">
        <div className="osman-card-row">
          <strong>AI API bağlantısı:</strong> {aiOk === null ? "kontrol ediliyor" : aiOk ? "çalışıyor" : "GROQ_API_KEY eksik"}
        </div>
        <div className="osman-card-row">
          <strong>Hafıza (localStorage) durumu:</strong> {memoryOk ? "çalışıyor" : "çalışmıyor"}
        </div>
        <div className="osman-card-row">
          <strong>Aktif proje:</strong> {activeProject ? activeProject.ad : "seçili değil"}
        </div>
        <div className="osman-card-row">
          <strong>Son hata:</strong> {lastError || "yok"}
        </div>
        <div className="osman-card-row">
          <strong>Uygulama sürümü:</strong> {APP_VERSION}
        </div>
        <div className="osman-card-row">
          <strong>Build bilgisi:</strong> {BUILD_INFO}
        </div>
      </div>
      <p className="osman-note">
        Hafıza tarayıcının localStorage'ında tutulur — yalnızca bu cihazda/tarayıcıda kalır, başka bir cihazdan
        girdiğinde otomatik gelmez.
      </p>
    </div>
  );
}
