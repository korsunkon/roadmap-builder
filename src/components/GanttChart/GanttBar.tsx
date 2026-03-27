import React from "react";
import type { Bar, Selection, DragState } from "../../types";
import { COL_W, BAR_H } from "../../constants";
import { toPx } from "../../utils/geometry";
import { barDates } from "../../utils/dates";

interface Props {
  bar: Bar;
  blockId: string;
  y: number;
  rowH: number;
  sel: Selection | null;
  drag: DragState | null;
  startDate: string;
  onStartDrag: (e: React.PointerEvent, type: DragState["type"], blockId: string, barId: string, origStart: number, origEnd: number) => void;
  onSelect: (blockId: string, barId: string) => void;
}

export const GanttBar: React.FC<Props> = ({ bar, blockId, y, rowH, sel, drag, startDate, onStartDrag, onSelect }) => {
  const bx = toPx(bar.start);
  const bw = (bar.end - bar.start) * COL_W;
  const by = y + (rowH - BAR_H) / 2;
  const isSel = sel?.barId === bar.id;
  const isDark = bar.color === "#3A3A3A";

  return (
    <>
      <rect
        x={bx} y={by} width={bw} height={BAR_H} rx={4} fill={bar.color}
        opacity={isSel ? 1 : 0.8}
        stroke={isSel ? "#222" : "none"}
        strokeWidth={isSel ? 1.5 : 0}
        style={{ cursor: drag ? "grabbing" : "grab", transition: "opacity .1s" }}
        onPointerDown={e => onStartDrag(e, "move", blockId, bar.id, bar.start, bar.end)}
        onClick={e => { e.stopPropagation(); onSelect(blockId, bar.id); }}
      />
      <rect x={bx - 1} y={by} width={7} height={BAR_H} fill="transparent" style={{ cursor: "ew-resize" }}
        onPointerDown={e => onStartDrag(e, "resize-left", blockId, bar.id, bar.start, bar.end)} />
      <rect x={bx + bw - 6} y={by} width={7} height={BAR_H} fill="transparent" style={{ cursor: "ew-resize" }}
        onPointerDown={e => onStartDrag(e, "resize-right", blockId, bar.id, bar.start, bar.end)} />
      {isSel && (
        <>
          <rect x={bx - 2} y={by + BAR_H / 2 - 4} width={4} height={8} rx={1} fill="#222" />
          <rect x={bx + bw - 2} y={by + BAR_H / 2 - 4} width={4} height={8} rx={1} fill="#222" />
        </>
      )}
      {bw > 80 && (
        <text x={bx + bw / 2} y={by + BAR_H / 2 + 3.5} textAnchor="middle" fontSize={9} fontWeight={500}
          fill={isDark ? "#ccc" : "#666"} fontFamily="Inter,sans-serif" style={{ pointerEvents: "none" }}>
          {barDates(startDate, bar.start, bar.end)}
        </text>
      )}
    </>
  );
};
