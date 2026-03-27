import React from "react";
import type { Block, Selection, DragState } from "../../types";
import { LEFT_COL, COL_W, ROW_H } from "../../constants";
import { GanttBar } from "./GanttBar";
import { MilestoneDiamond } from "./MilestoneDiamond";

interface Props {
  block: Block;
  idx: number;
  periodsCount: number;
  startDate: string;
  sel: Selection | null;
  drag: DragState | null;
  milestoneMode: boolean;
  chartW: number;
  onStartDrag: (e: React.PointerEvent, type: DragState["type"], blockId: string, barId: string, origStart: number, origEnd: number) => void;
  onSelectBar: (blockId: string, barId: string) => void;
  onSelectMs: (blockId: string, msId: string) => void;
  onStartCreate: (e: React.PointerEvent, blockId: string) => void;
}

export const BlockRow: React.FC<Props> = ({
  block, idx, periodsCount, startDate, sel, drag, milestoneMode, chartW,
  onStartDrag, onSelectBar, onSelectMs, onStartCreate,
}) => {
  const y = idx * ROW_H;
  const elements: React.ReactNode[] = [];

  // Row separator
  elements.push(<line key={`rl${block.id}`} x1={LEFT_COL} y1={y + ROW_H} x2={LEFT_COL + chartW} y2={y + ROW_H} stroke="#F0EFE8" strokeWidth={0.5} />);

  // Grid click area
  elements.push(
    <rect key={`grid${block.id}`} x={LEFT_COL} y={y + 1} width={periodsCount * COL_W} height={ROW_H - 2}
      fill="transparent" data-bg="1"
      onPointerDown={e => onStartCreate(e, block.id)}
      style={{ cursor: milestoneMode ? "crosshair" : "cell" }}
    />
  );

  // Bars
  block.bars.forEach(bar => {
    elements.push(
      <GanttBar key={`bar${bar.id}`} bar={bar} blockId={block.id} y={y} rowH={ROW_H}
        sel={sel} drag={drag} startDate={startDate}
        onStartDrag={onStartDrag} onSelect={onSelectBar} />
    );
  });

  // Milestones
  block.milestones.forEach(ms => {
    elements.push(
      <MilestoneDiamond key={`ms${ms.id}`} ms={ms} blockId={block.id} y={y} sel={sel} onSelect={onSelectMs} />
    );
  });

  return <>{elements}</>;
};
