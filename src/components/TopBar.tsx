import React from "react";
import { btnStyle } from "./styles";

interface Props {
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
}

export const TopBar: React.FC<Props> = ({ showSettings, setShowSettings }) => (
  <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E5E5E0", background: "#fff", flexShrink: 0, gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <span style={{ fontSize: 14, fontWeight: 300, letterSpacing: 2.5, color: "#AAA" }}>evo</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#CCC" }}>AI</span>
      </div>
      <div style={{ width: 1, height: 18, background: "#E0E0E0" }} />
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, color: "#333" }}>ROAD MAP BUILDER</span>
    </div>
    <button style={btnStyle} onClick={() => setShowSettings(!showSettings)}>
      &#9881; Настройки
    </button>
  </div>
);
