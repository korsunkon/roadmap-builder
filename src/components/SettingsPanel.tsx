import React, { useRef, useState } from "react";
import type { RoadmapData } from "../types";
import { rangeText } from "../utils/dates";
import { exportPng, exportPdf } from "../utils/exportImage";
import { btnStyle, btnDangerStyle } from "./styles";

interface Props {
  show: boolean;
  data: RoadmapData;
  setData: React.Dispatch<React.SetStateAction<RoadmapData>>;
  resetAll: () => void;
}

export const SettingsPanel: React.FC<Props> = ({ show, data, setData, resetAll }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState("");

  if (!show) return null;

  async function handleExportPng() {
    setExporting("png");
    try { await exportPng(data); } catch (e) { console.error(e); alert("Ошибка экспорта PNG"); }
    setExporting("");
  }

  async function handleExportPdf() {
    setExporting("pdf");
    try { await exportPdf(data); } catch (e) { console.error(e); alert("Ошибка экспорта PDF"); }
    setExporting("");
  }

  function handleExport() {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (data.title || "roadmap") + ".json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as RoadmapData;
        if (parsed && parsed.blocks && Array.isArray(parsed.blocks)) {
          setData(parsed);
        } else {
          alert("Неверный формат файла");
        }
      } catch {
        alert("Ошибка чтения файла");
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-imported
    e.target.value = "";
  }

  return (
    <div style={{ padding: "12px 20px", background: "#fff", borderBottom: "1px solid #EEEDE8", display: "flex", alignItems: "center", gap: 20, flexShrink: 0, flexWrap: "wrap" }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
        <span style={{ color: "#888" }}>Дата старта:</span>
        <input
          type="date"
          value={data.startDate}
          onChange={e => setData(d => ({ ...d, startDate: e.target.value }))}
          style={{ fontSize: 12, border: "1px solid #DDD", borderRadius: 4, padding: "3px 8px" }}
        />
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
        <span style={{ color: "#888" }}>Периодов (&times;2 нед.):</span>
        <input
          type="number"
          min={2}
          max={26}
          value={data.periodsCount}
          onChange={e => setData(d => ({ ...d, periodsCount: Math.max(2, Math.min(26, parseInt(e.target.value) || 7)) }))}
          style={{ fontSize: 12, border: "1px solid #DDD", borderRadius: 4, padding: "3px 8px", width: 60 }}
        />
      </label>
      <div style={{ fontSize: 11, color: "#AAA" }}>{rangeText(data.startDate, data.periodsCount)}</div>

      <div style={{ width: 1, height: 20, background: "#E5E5E0" }} />

      <button style={btnStyle} onClick={handleExport}>&#8681; Сохранить JSON</button>
      <button style={btnStyle} onClick={handleImport}>&#8679; Загрузить JSON</button>
      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} style={{ display: "none" }} />

      <div style={{ width: 1, height: 20, background: "#E5E5E0" }} />

      <button style={btnStyle} onClick={handleExportPng} disabled={exporting === "png"}>
        {exporting === "png" ? "..." : "&#128247; Экспорт PNG"}
      </button>
      <button style={btnStyle} onClick={handleExportPdf} disabled={exporting === "pdf"}>
        {exporting === "pdf" ? "..." : "&#128196; Экспорт PDF"}
      </button>

      <div style={{ width: 1, height: 20, background: "#E5E5E0" }} />

      <button style={btnDangerStyle} onClick={resetAll}>&#8634; Сбросить роадмап</button>
    </div>
  );
};
