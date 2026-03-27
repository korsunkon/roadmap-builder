import type { RoadmapData } from "../types";
import { STORAGE_KEY } from "../constants";

export function loadData(): RoadmapData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as RoadmapData;
      if (parsed && parsed.blocks && parsed.blocks.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.log("Storage load error:", e);
  }
  return null;
}

export function saveData(data: RoadmapData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.log("Storage save error:", e);
    return false;
  }
}

export function clearData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.log("Storage clear error:", e);
  }
}
