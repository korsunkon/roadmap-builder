import React from "react";
import type { RoadmapData } from "../types";

interface Props {
  data: RoadmapData;
  setData: React.Dispatch<React.SetStateAction<RoadmapData>>;
  editingTitle: boolean;
  setEditingTitle: (v: boolean) => void;
  editingSub: boolean;
  setEditingSub: (v: boolean) => void;
}

export const TitleRow: React.FC<Props> = ({ data, setData, editingTitle, setEditingTitle, editingSub, setEditingSub }) => {
  const titleEl = editingTitle ? (
    <input
      autoFocus
      value={data.title}
      onChange={e => setData(d => ({ ...d, title: e.target.value }))}
      onBlur={() => setEditingTitle(false)}
      onKeyDown={e => { if (e.key === "Enter") setEditingTitle(false); }}
      style={{ fontSize: 16, fontWeight: 600, border: "none", borderBottom: "2px solid #C9B88C", outline: "none", background: "transparent", width: "50%", padding: "2px 0" }}
    />
  ) : (
    <span onDoubleClick={() => setEditingTitle(true)} style={{ fontSize: 16, fontWeight: 600, cursor: "text" }} title="Двойной клик">
      {data.title}
    </span>
  );

  const subEl = editingSub ? (
    <input
      autoFocus
      value={data.subtitle}
      onChange={e => setData(d => ({ ...d, subtitle: e.target.value }))}
      onBlur={() => setEditingSub(false)}
      onKeyDown={e => { if (e.key === "Enter") setEditingSub(false); }}
      style={{ fontSize: 12, border: "none", borderBottom: "2px solid #C9B88C", outline: "none", background: "transparent", width: "40%", color: "#888", padding: "2px 0" }}
    />
  ) : (
    <span onDoubleClick={() => setEditingSub(true)} style={{ fontSize: 12, color: "#888", cursor: "text" }} title="Двойной клик">
      {data.subtitle}
    </span>
  );

  return (
    <div style={{ padding: "10px 20px 0", background: "#FAFAF8", flexShrink: 0, display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
      {titleEl}
      <span style={{ color: "#DDD" }}>|</span>
      {subEl}
    </div>
  );
};
