"use client";

export default function StatusBar({ aiOk, memoryOk }) {
  return (
    <div className="osman-status">
      <span>
        <span className="dot ok" /> Sistem çalışıyor
      </span>
      <span>
        <span className={`dot ${aiOk === null ? "" : aiOk ? "ok" : "fail"}`} />
        {aiOk === null ? "AI bağlantısı kontrol ediliyor" : aiOk ? "AI bağlantısı çalışıyor" : "AI anahtarı eksik"}
      </span>
      <span>
        <span className={`dot ${memoryOk ? "ok" : "fail"}`} />
        {memoryOk ? "Hafıza çalışıyor" : "Hafıza çalışmıyor"}
      </span>
    </div>
  );
}
