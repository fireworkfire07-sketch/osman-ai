"use client";

import { useEffect, useRef, useState } from "react";
import { clearChatHistory, loadChatHistory, saveChatHistory } from "../lib/data/chatHistory";
import { getLastStorageError, clearLastStorageError } from "../lib/data/storage";
import { downloadText } from "../lib/dataManagement";
import { WELCOME_MESSAGE, QUICK_START_PROMPTS } from "../lib/core";
import { ARACLAR, araciCalistir } from "../lib/tools/agentTools";

const MAX_ARAC_TURU = 4;
const MAX_MODEL_MESAJ = 8;

function araclariSec(text) {
  const s = String(text || "").toLocaleLowerCase("tr-TR");
  const adlar = new Set();
  if (/araştır|güncel|youtube|niş|talep|rekabet|başarılı video|fırsat|para kazan|pazar|rakip/.test(s)) adlar.add("web_arastir");
  if (/hafıza|hatırla|hatırlat|unutma|kaydet/.test(s)) adlar.add(s.includes("ara") || s.includes("bul") ? "hafiza_ara" : "hafiza_ekle");
  if (/karar/.test(s)) adlar.add("karar_ekle");
  if (/görev|yapılacak|todo/.test(s)) adlar.add("gorev_ekle");
  if (/proje/.test(s) && /güncelle|durum|çalışıyor|çalışmıyor|hata|sonraki/.test(s)) adlar.add("proje_guncelle");
  return ARACLAR.filter((arac) => adlar.has(arac.function.name));
}

async function groqTuru(mesajlar, contextData) {
  const cevap = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: mesajlar, context: contextData }),
  });
  if (!cevap.ok) {
    const hata = await cevap.json().catch(() => ({}));
    throw new Error([hata.error, hata.detail, hata.groqStatus ? `Groq HTTP ${hata.groqStatus}` : ""].filter(Boolean).join("\n"));
  }
  return await cevap.json();
}

// Bölüm 2a'daki döngü: tarayıcı Groq'a "araclar" ile birlikte gönderir, sunucu
// hiçbir aracı çalıştırmadan ham cevabı döndürür; tool_calls varsa tarayıcı
// kendi collection fonksiyonlarıyla (agentTools.js) çalıştırır ve role:"tool"
// mesajı olarak ekleyip tekrar gönderir. En fazla MAX_ARAC_TURU tur.
async function sohbetCalistir(baslangicMesajlari, contextData, onDataChanged) {
  const mesajlar = baslangicMesajlari.slice(-MAX_MODEL_MESAJ).map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const veri = await groqTuru(mesajlar, contextData);
  const mesaj = veri?.choices?.[0]?.message;
  if (!mesaj) throw new Error("AI'dan geçerli cevap alınamadı.");
  return { metin: mesaj.content || "", kayitlar: [] };
}

export default function ChatPanel({ contextData, onError, onDataChanged }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    setMessages(loadChatHistory());
    setLoadedFromStorage(true);
  }, []);

  useEffect(() => {
    if (!loadedFromStorage) return;
    saveChatHistory(messages);
    const storageErr = getLastStorageError();
    if (storageErr) {
      onError?.(storageErr);
      clearLastStorageError();
    }
  }, [messages, loadedFromStorage]);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages, loading]);

  async function sendMessage(e, overrideText) {
    e?.preventDefault?.();
    const text = (overrideText ?? input).trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const { metin, kayitlar } = await sohbetCalistir(nextMessages, contextData, onDataChanged);

      if (!metin.trim()) {
        const errText = "AI boş cevap döndürdü. Lütfen tekrar dene.";
        setMessages((prev) => [...prev, { role: "error", content: errText }]);
        onError?.(errText);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: metin, kayitlar }]);
      }
    } catch (err) {
      const errText = err?.message || "Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.";
      setMessages((prev) => [...prev, { role: "error", content: errText }]);
      onError?.(errText);
    } finally {
      setLoading(false);
    }
  }

  function sendQuickStart(text) {
    sendMessage(null, text);
  }

  function newChat() {
    if (
      messages.length > 0 &&
      !window.confirm("Yeni sohbet başlatılsın mı? Mevcut sohbet geçmişi bu cihazdan silinecek.")
    ) {
      return;
    }
    setMessages([]);
    clearChatHistory();
  }

  function exportConversation() {
    const lines = messages.map((m) => {
      const who = m.role === "user" ? "Osman" : m.role === "assistant" ? "OSMAN AI" : "Hata";
      return `${who}: ${m.content}`;
    });
    downloadText(`osman-ai-sohbet-${new Date().toISOString().slice(0, 10)}.txt`, lines.join("\n\n"));
  }

  const isEmpty = loadedFromStorage && messages.length === 0;

  return (
    <div className="osman-chat">
      <div className="osman-chat-toolbar">
        <button className="secondary" onClick={newChat}>
          Yeni Sohbet
        </button>
        <button className="secondary" onClick={exportConversation} disabled={messages.length === 0}>
          Konuşmayı Dışa Aktar
        </button>
      </div>

      {isEmpty ? (
        <div className="osman-chat-empty">
          <h2>{WELCOME_MESSAGE}</h2>
          <div className="osman-quick-starts">
            {QUICK_START_PROMPTS.map((q) => (
              <button key={q} className="osman-quick-start" onClick={() => sendQuickStart(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="osman-messages" ref={listRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="msg assistant">
              <span className="osman-typing">
                <span />
                <span />
                <span />
              </span>
            </div>
          )}
        </div>
      )}

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
