import React from "react";
import type { RoadmapRegistryEntry } from "../types";
import { btnStyle } from "./styles";

interface Props {
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  registry: RoadmapRegistryEntry[];
  activeId: string;
  onSwitch: (id: string) => void;
  onCreate: (name: string) => void;
  onDelete: (id: string) => void;
}

export const TopBar: React.FC<Props> = ({
  showSettings, setShowSettings,
  registry, activeId, onSwitch, onCreate, onDelete,
}) => {
  const handleCreate = () => {
    const name = prompt("Название нового роадмапа:");
    if (name?.trim()) onCreate(name.trim());
  };

  const handleDelete = () => {
    if (registry.length <= 1) return;
    const current = registry.find(r => r.id === activeId);
    if (confirm(`Удалить роадмап «${current?.name}»?`)) {
      onDelete(activeId);
    }
  };

  return (
    <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E5E5E0", background: "#fff", flexShrink: 0, gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span style={{ fontSize: 14, fontWeight: 300, letterSpacing: 2.5, color: "#AAA" }}>evo</span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#CCC" }}>AI</span>
        </div>
        <div style={{ width: 1, height: 18, background: "#E0E0E0" }} />
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: "#333" }}>ROAD MAP BUILDER</span>
        <div style={{ width: 1, height: 18, background: "#E0E0E0" }} />

        {/* Roadmap switcher */}
        <select
          value={activeId}
          onChange={e => onSwitch(e.target.value)}
          style={{
            fontSize: 12, fontWeight: 500, border: "1px solid #DDD", borderRadius: 6,
            padding: "4px 10px", background: "#FAFAF8", color: "#333", cursor: "pointer",
            outline: "none", minWidth: 160,
          }}
        >
          {registry.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <button style={{ ...btnStyle, padding: "3px 10px", fontSize: 14, lineHeight: 1 }} onClick={handleCreate} title="Создать роадмап">+</button>
        <button
          style={{ ...btnStyle, padding: "3px 10px", fontSize: 11, lineHeight: 1, color: registry.length <= 1 ? "#DDD" : "#E85D3A" }}
          onClick={handleDelete}
          disabled={registry.length <= 1}
          title="Удалить текущий роадмап"
        >&#10005;</button>
      </div>
      <button style={btnStyle} onClick={() => setShowSettings(!showSettings)}>
        &#9881; Настройки
      </button>
    </div>
  );
};
