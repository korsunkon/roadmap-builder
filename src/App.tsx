import { useState } from "react";
import type { Selection } from "./types";
import { useRoadmapData } from "./hooks/useRoadmapData";
import { useKeyboard } from "./hooks/useKeyboard";

import { TopBar } from "./components/TopBar";
import { TitleRow } from "./components/TitleRow";
import { Toolbar } from "./components/Toolbar";
import { SettingsPanel } from "./components/SettingsPanel";
import { GanttChart } from "./components/GanttChart/GanttChart";
import { Footer } from "./components/Footer";

export default function App() {
  const rd = useRoadmapData();
  const [sel, setSel] = useState<Selection | null>(null);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingSub, setEditingSub] = useState(false);
  const [milestoneMode, setMilestoneMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useKeyboard(
    sel, setSel, editingLabel, editingTitle, editingSub,
    rd.deleteBar, rd.deleteMilestone, setMilestoneMode, setShowSettings
  );

  let selectedBar = null;
  let selectedMs = null;
  if (sel?.barId) {
    const blk = rd.data.blocks.find(b => b.id === sel.blockId);
    if (blk) selectedBar = blk.bars.find(r => r.id === sel.barId) ?? null;
  }
  if (sel?.msId) {
    const blk = rd.data.blocks.find(b => b.id === sel.blockId);
    if (blk) selectedMs = blk.milestones.find(m => m.id === sel.msId) ?? null;
  }

  if (!rd.loaded) {
    return (
      <div style={{ width: "100%", height: "100vh", background: "#FAFAF8", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "Inter,sans-serif", color: "#AAA" }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh", background: "#FAFAF8", fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", display: "flex", flexDirection: "column", overflow: "hidden", color: "#333", fontSize: 13 }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <TopBar showSettings={showSettings} setShowSettings={setShowSettings} />
      <TitleRow data={rd.data} setData={rd.setData} editingTitle={editingTitle} setEditingTitle={setEditingTitle} editingSub={editingSub} setEditingSub={setEditingSub} />
      <Toolbar
        milestoneMode={milestoneMode} setMilestoneMode={setMilestoneMode}
        addBlock={rd.addBlock} sel={sel}
        selectedBar={selectedBar} selectedMs={selectedMs}
        startDate={rd.data.startDate}
        updateBarColor={rd.updateBarColor}
        deleteBar={(blockId, barId) => { rd.deleteBar(blockId, barId); setSel(null); }}
        deleteMilestone={(blockId, msId) => { rd.deleteMilestone(blockId, msId); setSel(null); }}
        updateMsLabel={rd.updateMsLabel}
      />
      <SettingsPanel show={showSettings} data={rd.data} setData={rd.setData} resetAll={() => { rd.resetAll(); setSel(null); }} />
      <GanttChart
        data={rd.data} setData={rd.setData}
        sel={sel} setSel={setSel}
        editingLabel={editingLabel} setEditingLabel={setEditingLabel}
        milestoneMode={milestoneMode}
        moveBlock={rd.moveBlock}
        addBar={rd.addBar}
        deleteBlock={rd.deleteBlock}
        updateBlockLabel={rd.updateBlockLabel}
        addMilestone={rd.addMilestone}
      />
      <Footer saveStatus={rd.saveStatus} />
    </div>
  );
}
