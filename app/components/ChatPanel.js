"use client";

import { useEffect, useRef, useState } from "react";
import { clearChatHistory, loadChatHistory, saveChatHistory } from "../lib/data/chatHistory";
import { getLastStorageError, clearLastStorageError } from "../lib/data/storage";
import { downloadText } from "../lib/dataManagement";
import { WELCOME_MESSAGE, QUICK_START_PROMPTS } from "../lib/core";

export default function ChatPanel({ contextData, onError }) {
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
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, context: contextData }),
      });

      if (!res.ok || !res.body) {
        let errText = "Bilinmeyen bir hata oluştu.";
        try {
          const data = await res.json();
          errText = data.error || errText;
        } catch {
          // yanıt JSON değilse varsayılan mesaj kalır
        }
        setMessages((prev) => [...prev, { role: "error", content: errText }]);
        onError?.(errText);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        const snapshot = assistantText;
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: snapshot };
          return copy;
        });
      }

      if (!assistantText.trim()) {
        const errText = "AI boş cevap döndürdü. Lütfen tekrar dene.";
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "error", content: errText };
          return copy;
        });
        onError?.(errText);
      }
    } catch (err) {
      const errText = "Sunucuya ulaşılamadı. İnternet bağlantını kontrol et.";
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
          {messages.map((m, i) => {
            const isStreamingPlaceholder =
              loading && i === messages.length - 1 && m.role === "assistant" && m.content === "";
            return (
              <div key={i} className={`msg ${m.role}`}>
                {isStreamingPlaceholder ? (
                  <span className="osman-typing">
                    <span />
                    <span />
                    <span />
                  </span>
                ) : (
                  m.content
                )}
              </div>
            );
          })}
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
