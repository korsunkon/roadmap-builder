import type { RoadmapData, RoadmapRegistryEntry } from "../types";
import { STORAGE_KEY, REGISTRY_KEY, ACTIVE_KEY, ROADMAP_KEY_PREFIX, DEFAULT_ROADMAPS } from "../constants";

// --- Registry ---

export function loadRegistry(): RoadmapRegistryEntry[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RoadmapRegistryEntry[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.log("Registry load error:", e);
  }
  return [];
}

export function saveRegistry(registry: RoadmapRegistryEntry[]): void {
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  } catch (e) {
    console.log("Registry save error:", e);
  }
}

// --- Active ID ---

export function loadActiveId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function saveActiveId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_KEY, id);
  } catch (e) {
    console.log("Active ID save error:", e);
  }
}

// --- Roadmap data by ID ---

export function loadRoadmap(id: string): RoadmapData | null {
  try {
    const raw = localStorage.getItem(ROADMAP_KEY_PREFIX + id);
    if (raw) {
      const parsed = JSON.parse(raw) as RoadmapData;
      if (parsed && parsed.blocks && Array.isArray(parsed.blocks)) return parsed;
    }
  } catch (e) {
    console.log("Roadmap load error:", e);
  }
  return null;
}

export function saveRoadmap(id: string, data: RoadmapData): boolean {
  try {
    localStorage.setItem(ROADMAP_KEY_PREFIX + id, JSON.stringify(data));
    return true;
  } catch (e) {
    console.log("Roadmap save error:", e);
    return false;
  }
}

export function deleteRoadmapData(id: string): void {
  try {
    localStorage.removeItem(ROADMAP_KEY_PREFIX + id);
  } catch (e) {
    console.log("Roadmap delete error:", e);
  }
}

// --- Migration from old single-key format ---

export function migrateIfNeeded(): { registry: RoadmapRegistryEntry[]; activeId: string } {
  const existing = loadRegistry();
  if (existing.length > 0) {
    const activeId = loadActiveId() || existing[0].id;
    return { registry: existing, activeId };
  }

  // Check for old single-key data
  let oldData: RoadmapData | null = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RoadmapData;
      if (parsed && parsed.blocks && parsed.blocks.length > 0) oldData = parsed;
    }
  } catch { /* ignore */ }

  // Build registry from defaults
  const registry: RoadmapRegistryEntry[] = DEFAULT_ROADMAPS.map(d => ({ id: d.id, name: d.name }));
  const activeId = DEFAULT_ROADMAPS[0].id;

  // Save each default, but use old data for first if it exists
  DEFAULT_ROADMAPS.forEach((d, i) => {
    if (i === 0 && oldData) {
      saveRoadmap(d.id, oldData);
    } else {
      saveRoadmap(d.id, d.factory());
    }
  });

  saveRegistry(registry);
  saveActiveId(activeId);

  // Clean up old key
  if (oldData) {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }

  return { registry, activeId };
}
