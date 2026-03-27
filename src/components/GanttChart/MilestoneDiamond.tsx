import React from "react";
import type { Milestone, Selection } from "../../types";
import { toPx } from "../../utils/geometry";
import { ROW_H } from "../../constants";

interface Props {
  ms: Milestone;
  blockId: string;
  y: number;
  sel: Selection | null;
  onSelect: (blockId: string, msId: string) => void;
}

export const MilestoneDiamond: React.FC<Props> = ({ ms, blockId, y, sel, onSelect }) => {
  const mx = toPx(ms.pos);
  const my = y + ROW_H / 2;
  const isSel = sel?.msId === ms.id;

  return (
    <>
      <polygon
        points={`${mx},${my - 8} ${mx + 8},${my} ${mx},${my + 8} ${mx - 8},${my}`}
        fill="#E85D3A"
        opacity={isSel ? 1 : 0.85}
        stroke={isSel ? "#222" : "none"}
        strokeWidth={1.5}
        style={{ cursor: "pointer" }}
        onClick={e => { e.stopPropagation(); onSelect(blockId, ms.id); }}
      />
      <text x={mx + 12} y={my + 4} fontSize={9} fontWeight={600} fill="#E85D3A" fontFamily="Inter,sans-serif" style={{ pointerEvents: "none" }}>
        {ms.label}
      </text>
    </>
  );
};
