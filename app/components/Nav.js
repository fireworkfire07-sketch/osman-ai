"use client";

const ITEMS = [
  { key: "ozet", label: "Özet" },
  { key: "chat", label: "Sohbet" },
  { key: "profil", label: "Profil" },
  { key: "projeler", label: "Projeler" },
  { key: "gorevler", label: "Görevler" },
  { key: "kararlar", label: "Kararlar" },
  { key: "hafiza", label: "Hafıza" },
  { key: "gelecek", label: "Gelecek Problemleri" },
  { key: "security", label: "AI Security Protocol" },
  { key: "payment", label: "AI Payment Protocol" },
  { key: "sistem", label: "Sistem Durumu" },
  { key: "veri", label: "Veri Yönetimi" },
];

export default function Nav({ active, onSelect }) {
  return (
    <nav className="osman-nav">
      {ITEMS.map((item) => (
        <button
          key={item.key}
          className={active === item.key ? "active" : ""}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
