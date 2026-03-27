import { useState, useEffect, useRef, useCallback } from "react";
import type { RoadmapData, RoadmapRegistryEntry } from "../types";
import { makeDefault, DEFAULT_ROADMAPS } from "../constants";
import {
  migrateIfNeeded, loadRoadmap, saveRoadmap, saveRegistry, saveActiveId,
  deleteRoadmapData,
} from "../utils/storage";
import { uid } from "../utils/uid";
import { snapTo } from "../utils/geometry";

export function useRoadmapData() {
  const [registry, setRegistry] = useState<RoadmapRegistryEntry[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [data, setData] = useState<RoadmapData>(makeDefault);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Init: migrate and load
  useEffect(() => {
    const { registry: reg, activeId: aid } = migrateIfNeeded();
    setRegistry(reg);
    setActiveId(aid);
    const saved = loadRoadmap(aid);
    if (saved) setData(saved);
    setSaveStatus("Загружено");
    setLoaded(true);
  }, []);

  // Auto-save current roadmap
  useEffect(() => {
    if (!loaded || !activeId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const ok = saveRoadmap(activeId, data);
      setSaveStatus(ok ? "Сохранено \u2713" : "Ошибка сохранения");
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, loaded, activeId]);

  // Switch roadmap
  const switchRoadmap = useCallback((id: string) => {
    if (id === activeId) return;
    // Save current before switching
    if (activeId) saveRoadmap(activeId, data);
    const newData = loadRoadmap(id);
    const fallback = DEFAULT_ROADMAPS.find(d => d.id === id);
    setData(newData || (fallback ? fallback.factory() : makeDefault()));
    setActiveId(id);
    saveActiveId(id);
    setSaveStatus("Загружено");
  }, [activeId, data]);

  // Create new roadmap
  const createRoadmap = useCallback((name: string) => {
    const id = "rm-" + uid();
    const newData = makeDefault();
    newData.title = name;
    newData.blocks = [];
    saveRoadmap(id, newData);
    const newRegistry = [...registry, { id, name }];
    setRegistry(newRegistry);
    saveRegistry(newRegistry);
    // Switch to it
    if (activeId) saveRoadmap(activeId, data);
    setData(newData);
    setActiveId(id);
    saveActiveId(id);
    setSaveStatus("Создан");
  }, [registry, activeId, data]);

  // Delete roadmap
  const deleteRoadmap = useCallback((id: string) => {
    if (registry.length <= 1) return;
    const newRegistry = registry.filter(r => r.id !== id);
    setRegistry(newRegistry);
    saveRegistry(newRegistry);
    deleteRoadmapData(id);
    if (id === activeId) {
      const newId = newRegistry[0].id;
      const newData = loadRoadmap(newId) || makeDefault();
      setData(newData);
      setActiveId(newId);
      saveActiveId(newId);
    }
  }, [registry, activeId]);

  // Rename roadmap in registry
  const renameRoadmap = useCallback((id: string, name: string) => {
    const newRegistry = registry.map(r => r.id === id ? { ...r, name } : r);
    setRegistry(newRegistry);
    saveRegistry(newRegistry);
  }, [registry]);

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
    const fallback = DEFAULT_ROADMAPS.find(d => d.id === activeId);
    const fresh = fallback ? fallback.factory() : makeDefault();
    setData(fresh);
    saveRoadmap(activeId, fresh);
    setSaveStatus("Сброшено");
  }, [activeId]);

  return {
    data, setData,
    loaded, saveStatus,
    registry, activeId,
    switchRoadmap, createRoadmap, deleteRoadmap, renameRoadmap,
    addBlock, deleteBlock, updateBlockLabel, moveBlock,
    addBar, deleteBar, updateBarColor,
    addMilestone, deleteMilestone, updateMsLabel,
    resetAll,
  };
}
