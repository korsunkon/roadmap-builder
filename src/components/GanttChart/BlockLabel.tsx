import React from "react";
import type { Block } from "../../types";
import { LEFT_COL, ROW_H } from "../../constants";

interface Props {
  block: Block;
  idx: number;
  editingLabel: string | null;
  onEditLabel: (id: string) => void;
  onUpdateLabel: (id: string, label: string) => void;
  onMoveBlock: (id: string, dir: number) => void;
  onAddBar: (blockId: string) => void;
  onDeleteBlock: (id: string) => void;
}

export const BlockLabel: React.FC<Props> = ({
  block, idx, editingLabel,
  onEditLabel, onUpdateLabel, onMoveBlock, onAddBar, onDeleteBlock,
}) => {
  const y = idx * ROW_H;
  const isEd = editingLabel === block.id;
  const elements: React.ReactNode[] = [];

  // Row separator
  elements.push(<line key={`rl${block.id}`} x1={0} y1={y + ROW_H} x2={LEFT_COL} y2={y + ROW_H} stroke="#F0EFE8" strokeWidth={0.5} />);

  // Label
  if (isEd) {
    elements.push(
      <foreignObject key={`fo${block.id}`} x={8} y={y + 4} width={LEFT_COL - 80} height={ROW_H - 8}>
        <input
          autoFocus
          defaultValue={block.label}
          onBlur={e => { onUpdateLabel(block.id, e.target.value); onEditLabel(""); }}
          onKeyDown={e => {
            if (e.key === "Enter") { onUpdateLabel(block.id, (e.target as HTMLInputElement).value); onEditLabel(""); }
          }}
          style={{ width: "100%", fontSize: 11, border: "none", borderBottom: "2px solid #C9B88C", outline: "none", background: "transparent", fontFamily: "Inter,sans-serif", padding: "4px 0" }}
        />
      </foreignObject>
    );
  } else {
    const truncLabel = block.label.length > 42 ? block.label.slice(0, 42) + "\u2026" : block.label;
    elements.push(
      <text key={`lbl${block.id}`} x={20} y={y + ROW_H / 2 + 4} fontSize={11} fontWeight={500} fill="#333" fontFamily="Inter,sans-serif"
        style={{ cursor: "text" }} onDoubleClick={() => onEditLabel(block.id)}>
        {truncLabel}
      </text>
    );
  }

  // Controls
  elements.push(
    <text key={`up${block.id}`} x={LEFT_COL - 65} y={y + ROW_H / 2 + 4} fontSize={13} fill="#AAA" opacity={0.5} style={{ cursor: "pointer" }}
      onClick={() => onMoveBlock(block.id, -1)}>&#9650;</text>
  );
  elements.push(
    <text key={`dn${block.id}`} x={LEFT_COL - 50} y={y + ROW_H / 2 + 4} fontSize={13} fill="#AAA" opacity={0.5} style={{ cursor: "pointer" }}
      onClick={() => onMoveBlock(block.id, 1)}>&#9660;</text>
  );
  elements.push(
    <text key={`ab${block.id}`} x={LEFT_COL - 35} y={y + ROW_H / 2 + 4} fontSize={14} fill="#999" fontWeight={700} opacity={0.5} style={{ cursor: "pointer" }}
      onClick={() => onAddBar(block.id)}>+</text>
  );
  elements.push(
    <text key={`db${block.id}`} x={LEFT_COL - 18} y={y + ROW_H / 2 + 4} fontSize={12} fill="#CCC" opacity={0.5} style={{ cursor: "pointer" }}
      onClick={() => onDeleteBlock(block.id)}>&#10005;</text>
  );

  return <>{elements}</>;
};
