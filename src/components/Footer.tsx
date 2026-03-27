import React from "react";
import { PALETTE } from "../constants";

interface Props {
  saveStatus: string;
}

export const Footer: React.FC<Props> = ({ saveStatus }) => {
  const legendItems = PALETTE.slice(0, 4).map(p => (
    <div key={p.color} style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ width: 12, height: 8, borderRadius: 2, background: p.color }} />
      <span>{p.name}</span>
    </div>
  ));

  const statusBg = saveStatus.includes("\u2713") ? "#E8F5E9" : saveStatus.includes("Ошибка") ? "#FFEBEE" : "#FFF8E1";
  const statusColor = saveStatus.includes("\u2713") ? "#4CAF50" : saveStatus.includes("Ошибка") ? "#E85D3A" : "#FF8F00";

  return (
    <div style={{ padding: "8px 20px", borderTop: "1px solid #E5E5E0", background: "#fff", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "#BBB", flexWrap: "wrap", gap: 8 }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        Двойной клик — редактирование &middot; Drag — перемещение &middot; Край — ресайз &middot; Delete — удаление
        {saveStatus && (
          <span style={{ marginLeft: 12, padding: "2px 8px", borderRadius: 4, background: statusBg, color: statusColor, fontSize: 10, fontWeight: 500 }}>
            {saveStatus}
          </span>
        )}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ color: "#AAA", fontWeight: 500 }}>1 столбец = 2 нед.</span>
        {legendItems}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width={10} height={10}><polygon points="5,1 9,5 5,9 1,5" fill="#E85D3A" /></svg>
          <span>Веха</span>
        </div>
      </div>
    </div>
  );
};
