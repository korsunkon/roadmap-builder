import { useState, useEffect, useRef, useCallback } from "react";
import type { RoadmapData } from "../types";
import { makeDefault } from "../constants";
import { loadData, saveData, clearData } from "../utils/storage";
import { uid } from "../utils/uid";
import { snapTo } from "../utils/geometry";

export function useRoadmapData() {
  const [data, setData] = useState<RoadmapData>(makeDefault);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = loadData();
    if (saved) {
      setData(saved);
      setSaveStatus("Загружено");
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const ok = saveData(data);
      setSaveStatus(ok ? "Сохранено \u2713" : "Ошибка сохранения");
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, loaded]);

  const addBlock = useCallback(() => {
    setData(d => ({
      ...d,
      blocks: [...d.blocks, { id: uid(), label: "Новый блок", bars: [], milestones: [] }],
    }));
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setData(d => ({ ...d, blocks: d.blocks.filter(b => b.id !== id) }));
  }, []);

  const updateBlockLabel = useCallback((id: string, label: string) => {
    setData(d => ({
      ...d,
      blocks: d.blocks.map(b => (b.id === id ? { ...b, label } : b)),
    }));
  }, []);

  const moveBlock = useCallback((id: string, dir: number) => {
    setData(d => {
      const i = d.blocks.findIndex(b => b.id === id);
      if (i < 0) return d;
      const ni = i + dir;
      if (ni < 0 || ni >= d.blocks.length) return d;
      const arr = [...d.blocks];
      [arr[i], arr[ni]] = [arr[ni], arr[i]];
      return { ...d, blocks: arr };
    });
  }, []);

  const addBar = useCallback((blockId: string) => {
    const barId = uid();
    setData(d => ({
      ...d,
      blocks: d.blocks.map(b =>
        b.id === blockId
          ? { ...b, bars: [...b.bars, { id: barId, start: 0, end: 1, color: "#C9B88C" }] }
          : b
      ),
    }));
    return { blockId, barId };
  }, []);

  const deleteBar = useCallback((blockId: string, barId: string) => {
    setData(d => ({
      ...d,
      blocks: d.blocks.map(b =>
        b.id === blockId ? { ...b, bars: b.bars.filter(r => r.id !== barId) } : b
      ),
    }));
  }, []);

  const updateBarColor = useCallback((blockId: string, barId: string, color: string) => {
    setData(d => ({
      ...d,
      blocks: d.blocks.map(b =>
        b.id === blockId
          ? { ...b, bars: b.bars.map(r => (r.id === barId ? { ...r, color } : r)) }
          : b
      ),
    }));
  }, []);

  const addMilestone = useCallback((blockId: string, pos: number) => {
    const msId = uid();
    setData(d => ({
      ...d,
      blocks: d.blocks.map(b =>
        b.id === blockId
          ? { ...b, milestones: [...b.milestones, { id: msId, pos: snapTo(pos), label: "Веха" }] }
          : b
      ),
    }));
    return { blockId, msId };
  }, []);

  const deleteMilestone = useCallback((blockId: string, msId: string) => {
    setData(d => ({
      ...d,
      blocks: d.blocks.map(b =>
        b.id === blockId ? { ...b, milestones: b.milestones.filter(m => m.id !== msId) } : b
      ),
    }));
  }, []);

  const updateMsLabel = useCallback((blockId: string, msId: string, label: string) => {
    setData(d => ({
      ...d,
      blocks: d.blocks.map(b =>
        b.id === blockId
          ? { ...b, milestones: b.milestones.map(m => (m.id === msId ? { ...m, label } : m)) }
          : b
      ),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setData(makeDefault());
    clearData();
    setSaveStatus("Сброшено");
  }, []);

  return {
    data,
    setData,
    loaded,
    saveStatus,
    addBlock,
    deleteBlock,
    updateBlockLabel,
    moveBlock,
    addBar,
    deleteBar,
    updateBarColor,
    addMilestone,
    deleteMilestone,
    updateMsLabel,
    resetAll,
  };
}
