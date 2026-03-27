import { useEffect } from "react";
import type { Selection } from "../types";

export function useKeyboard(
  sel: Selection | null,
  setSel: (s: Selection | null) => void,
  editingLabel: string | null,
  editingTitle: boolean,
  editingSub: boolean,
  deleteBar: (blockId: string, barId: string) => void,
  deleteMilestone: (blockId: string, msId: string) => void,
  setMilestoneMode: (v: boolean) => void,
  setShowSettings: (v: boolean) => void
) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (editingLabel || editingTitle || editingSub) return;
        const el = document.activeElement;
        if (el && (el as HTMLElement).tagName === "INPUT") return;
        if (sel?.barId) deleteBar(sel.blockId, sel.barId);
        else if (sel?.msId) deleteMilestone(sel.blockId, sel.msId);
      }
      if (e.key === "Escape") {
        setSel(null);
        setMilestoneMode(false);
        setShowSettings(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, editingLabel, editingTitle, editingSub, deleteBar, deleteMilestone, setSel, setMilestoneMode, setShowSettings]);
}
