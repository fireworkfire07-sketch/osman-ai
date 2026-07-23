"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiOk, setAiOk] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    fetch("/api/chat")
      .then((res) => res.json())
      .then((data) => setAiOk(Boolean(data.groqKeyPresent)))
      .catch(() => setAiOk(false));
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

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
        body: JSON.stringify({ messages: nextMessages }),
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

  return (
    <div id="osman-app">
      <header className="osman-header">
        <h1>OSMAN AI</h1>
        <p>Kişisel dijital çalışma asistanın</p>
      </header>

      <div className="osman-status">
        <span>
          <span className="dot ok" /> Sistem çalışıyor
        </span>
        <span>
          <span className={`dot ${aiOk === null ? "" : aiOk ? "ok" : "fail"}`} />
          {aiOk === null ? "AI bağlantısı kontrol ediliyor" : aiOk ? "AI bağlantısı çalışıyor" : "AI anahtarı eksik"}
        </span>
      </div>

      <div className="osman-messages" ref={listRef}>
        {messages.length === 0 && (
          <div className="msg assistant">Merhaba, ben OSMAN AI. Sana nasıl yardımcı olabilirim?</div>
        )}
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
