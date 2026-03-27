import React from "react";
import type { Selection, Bar, Milestone } from "../types";
import { PALETTE } from "../constants";
import { barDates } from "../utils/dates";
import { btnStyle, btnActiveStyle, btnDangerStyle } from "./styles";

interface Props {
  milestoneMode: boolean;
  setMilestoneMode: (v: boolean) => void;
  addBlock: () => void;
  sel: Selection | null;
  selectedBar: Bar | null;
  selectedMs: Milestone | null;
  startDate: string;
  updateBarColor: (blockId: string, barId: string, color: string) => void;
  deleteBar: (blockId: string, barId: string) => void;
  deleteMilestone: (blockId: string, msId: string) => void;
  updateMsLabel: (blockId: string, msId: string, label: string) => void;
}

export const Toolbar: React.FC<Props> = ({
  milestoneMode, setMilestoneMode, addBlock, sel,
  selectedBar, selectedMs, startDate,
  updateBarColor, deleteBar, deleteMilestone, updateMsLabel,
}) => {
  const items: React.ReactNode[] = [
    <button key="add" style={btnStyle} onClick={addBlock}>&#xFF0B; Блок</button>,
    <button key="ms" style={milestoneMode ? btnActiveStyle : btnStyle} onClick={() => setMilestoneMode(!milestoneMode)}>
      &#9670; {milestoneMode ? "Откл. вехи" : "Режим вех"}
    </button>,
  ];

  if (selectedBar && sel?.barId) {
    const colorDots = PALETTE.map(p => (
      <div
        key={p.color}
        onClick={() => updateBarColor(sel.blockId, sel.barId!, p.color)}
        title={p.name}
        style={{
          width: 20, height: 20, borderRadius: 4, background: p.color, cursor: "pointer",
          border: selectedBar.color === p.color ? "2px solid #222" : "2px solid transparent",
        }}
      />
    ));

    items.push(
      <div key="barctl" style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 12, borderLeft: "1px solid #E5E5E0", paddingLeft: 12 }}>
        <span style={{ fontSize: 11, color: "#999", marginRight: 4 }}>Цвет:</span>
        {colorDots}
        <span style={{ fontSize: 11, color: "#777", marginLeft: 8, whiteSpace: "nowrap" }}>
          {barDates(startDate, selectedBar.start, selectedBar.end)}
        </span>
        <button style={{ ...btnDangerStyle, marginLeft: 8, padding: "4px 10px" }} onClick={() => deleteBar(sel.blockId, sel.barId!)}>
          &#10005; Удалить
        </button>
      </div>
    );
  }

  if (selectedMs && sel?.msId) {
    items.push(
      <div key="msctl" style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 12, borderLeft: "1px solid #E5E5E0", paddingLeft: 12 }}>
        <span style={{ fontSize: 11, color: "#999" }}>Веха:</span>
        <input
          value={selectedMs.label}
          onChange={e => updateMsLabel(sel.blockId, sel.msId!, e.target.value)}
          style={{ fontSize: 12, border: "1px solid #DDD", borderRadius: 4, padding: "3px 8px", outline: "none", width: 140 }}
        />
        <button style={{ ...btnDangerStyle, padding: "4px 10px" }} onClick={() => deleteMilestone(sel.blockId, sel.msId!)}>
          &#10005;
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 20px", display: "flex", alignItems: "center", gap: 10, background: "#fff", borderBottom: "1px solid #EEEDE8", flexShrink: 0, flexWrap: "wrap" }}>
      {items}
    </div>
  );
};
