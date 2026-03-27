import { useState, useEffect, useCallback } from "react";
import type { DragState, RoadmapData } from "../types";
import { COL_W, SNAP_VAL } from "../constants";
import { snapTo, clampVal } from "../utils/geometry";

export function useDrag(
  setData: React.Dispatch<React.SetStateAction<RoadmapData>>,
  getSvgX: (clientX: number) => number
) {
  const [drag, setDrag] = useState<DragState | null>(null);

  const startDrag = useCallback(
    (e: React.PointerEvent, type: DragState["type"], blockId: string, barId: string, origStart: number, origEnd: number) => {
      e.stopPropagation();
      setDrag({ type, blockId, barId, startX: getSvgX(e.clientX), origStart, origEnd });
    },
    [getSvgX]
  );

  useEffect(() => {
    if (!drag) return;

    function move(e: PointerEvent) {
      const dp = (getSvgX(e.clientX) - drag!.startX) / COL_W;
      setData(prev => ({
        ...prev,
        blocks: prev.blocks.map(b => {
          if (b.id !== drag!.blockId) return b;
          return {
            ...b,
            bars: b.bars.map(bar => {
              if (bar.id !== drag!.barId) return bar;
              const pc = prev.periodsCount;
              if (drag!.type === "move") {
                const dur = drag!.origEnd - drag!.origStart;
                let ns = snapTo(drag!.origStart + dp);
                ns = clampVal(ns, 0, pc - dur);
                return { ...bar, start: ns, end: ns + dur };
              }
              if (drag!.type === "resize-left") {
                let ns = snapTo(drag!.origStart + dp);
                ns = clampVal(ns, 0, bar.end - SNAP_VAL);
                return { ...bar, start: ns };
              }
              if (drag!.type === "resize-right") {
                let ne = snapTo(drag!.origEnd + dp);
                ne = clampVal(ne, bar.start + SNAP_VAL, pc);
                return { ...bar, end: ne };
              }
              return bar;
            }),
          };
        }),
      }));
    }

    function up() {
      setData(prev => ({
        ...prev,
        blocks: prev.blocks.map(b => ({
          ...b,
          bars: b.bars.filter(r => r.end - r.start >= SNAP_VAL),
        })),
      }));
      setDrag(null);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [drag, getSvgX, setData]);

  return { drag, setDrag, startDrag };
}
