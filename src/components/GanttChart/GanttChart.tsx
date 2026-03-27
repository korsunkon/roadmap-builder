import React, { useRef, useCallback, useMemo, useState, useEffect } from "react";
import type { RoadmapData, Selection, DragState } from "../../types";
import { LEFT_COL, COL_W, ROW_H, HEADER_H, SNAP_VAL } from "../../constants";
import { toPx, toPeriod, snapTo, clampVal } from "../../utils/geometry";
import { periodLabel, periodSub, getTodayFrac } from "../../utils/dates";
import { uid } from "../../utils/uid";
import { useDrag } from "../../hooks/useDrag";
import { GridHeader } from "./GridHeader";
import { BlockRow } from "./BlockRow";
import { BlockLabel } from "./BlockLabel";
import { btnStyle } from "../styles";

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;

interface Props {
  data: RoadmapData;
  setData: React.Dispatch<React.SetStateAction<RoadmapData>>;
  sel: Selection | null;
  setSel: (s: Selection | null) => void;
  editingLabel: string | null;
  setEditingLabel: (id: string | null) => void;
  milestoneMode: boolean;
  moveBlock: (id: string, dir: number) => void;
  addBar: (blockId: string) => { blockId: string; barId: string };
  deleteBlock: (id: string) => void;
  updateBlockLabel: (id: string, label: string) => void;
  addMilestone: (blockId: string, pos: number) => { blockId: string; msId: string };
}

export const GanttChart: React.FC<Props> = ({
  data, setData, sel, setSel,
  editingLabel, setEditingLabel, milestoneMode,
  moveBlock, addBar, deleteBlock, updateBlockLabel, addMilestone,
}) => {
  const chartSvgRef = useRef<SVGSVGElement>(null);
  const chartScrollRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const labelsScrollRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  // Chart SVG uses viewBox offset at LEFT_COL, so getSvgX adds LEFT_COL
  const getSvgX = useCallback((clientX: number) => {
    if (!chartSvgRef.current) return 0;
    const rect = chartSvgRef.current.getBoundingClientRect();
    return (clientX - rect.left) / zoom + LEFT_COL;
  }, [zoom]);

  const { drag, setDrag } = useDrag(setData, getSvgX);

  const periods = useMemo(() => {
    const arr = [];
    for (let i = 0; i < data.periodsCount; i++) {
      arr.push({ label: periodLabel(data.startDate, i), sub: periodSub(i) });
    }
    return arr;
  }, [data.startDate, data.periodsCount]);

  const chartW = data.periodsCount * COL_W + 40;
  const bodyH = data.blocks.length * ROW_H + 60;
  const tF = getTodayFrac(data.startDate);
  const todayX = toPx(tF);
  const todayVis = tF >= 0 && tF <= data.periodsCount;

  // Scroll sync: chart → header (horizontal) + labels (vertical)
  const handleChartScroll = useCallback(() => {
    const el = chartScrollRef.current;
    if (!el) return;
    if (headerScrollRef.current) headerScrollRef.current.scrollLeft = el.scrollLeft;
    if (labelsScrollRef.current) labelsScrollRef.current.scrollTop = el.scrollTop;
  }, []);

  // Ctrl+wheel zoom on all quadrants
  useEffect(() => {
    const targets = [chartScrollRef.current, headerScrollRef.current, labelsScrollRef.current];
    function onWheel(e: WheelEvent) {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        setZoom(z => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round((z + delta) * 100) / 100)));
      }
    }
    targets.forEach(el => el?.addEventListener("wheel", onWheel, { passive: false }));
    return () => targets.forEach(el => el?.removeEventListener("wheel", onWheel));
  }, []);

  const zoomIn = useCallback(() => setZoom(z => Math.min(MAX_ZOOM, Math.round((z + ZOOM_STEP) * 100) / 100)), []);
  const zoomOut = useCallback(() => setZoom(z => Math.max(MIN_ZOOM, Math.round((z - ZOOM_STEP) * 100) / 100)), []);
  const zoomReset = useCallback(() => setZoom(1), []);

  const handleStartCreate = useCallback((e: React.PointerEvent, blockId: string) => {
    if (milestoneMode) {
      const w = toPeriod(getSvgX(e.clientX));
      if (w >= 0 && w <= data.periodsCount) {
        const result = addMilestone(blockId, w);
        setSel({ blockId: result.blockId, msId: result.msId });
      }
      return;
    }
    const x = getSvgX(e.clientX);
    const w2 = snapTo(clampVal(toPeriod(x), 0, data.periodsCount));
    const barId = uid();
    setData(d => ({
      ...d,
      blocks: d.blocks.map(b =>
        b.id === blockId
          ? { ...b, bars: [...b.bars, { id: barId, start: w2, end: w2 + SNAP_VAL, color: "#C9B88C" }] }
          : b
      ),
    }));
    setDrag({ type: "resize-right", blockId, barId, startX: x, origStart: w2, origEnd: w2 + SNAP_VAL });
    setSel({ blockId, barId });
  }, [milestoneMode, data.periodsCount, getSvgX, addMilestone, setSel, setData, setDrag]);

  const handleChartSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement;
    if (target === chartSvgRef.current || target.getAttribute("data-bg")) {
      setSel(null);
    }
  }, [setSel]);

  const handleSelectBar = useCallback((blockId: string, barId: string) => setSel({ blockId, barId }), [setSel]);
  const handleSelectMs = useCallback((blockId: string, msId: string) => setSel({ blockId, msId }), [setSel]);

  const handleAddBar = useCallback((blockId: string) => {
    const result = addBar(blockId);
    setSel({ blockId: result.blockId, barId: result.barId });
  }, [addBar, setSel]);

  const handleStartDrag = useCallback((e: React.PointerEvent, type: DragState["type"], blockId: string, barId: string, origStart: number, origEnd: number) => {
    e.stopPropagation();
    setDrag({ type, blockId, barId, startX: getSvgX(e.clientX), origStart, origEnd });
    setSel({ blockId, barId });
  }, [getSvgX, setDrag, setSel]);

  const scaledHeaderH = HEADER_H * zoom;
  const scaledLeftW = LEFT_COL * zoom;
  const zoomPct = Math.round(zoom * 100);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      {/* Zoom controls */}
      <div style={{
        position: "absolute", right: 16, top: 8, zIndex: 20,
        display: "flex", alignItems: "center", gap: 4,
        background: "rgba(255,255,255,0.92)", borderRadius: 8, padding: "3px 6px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #E5E5E0",
      }}>
        <button style={{ ...btnStyle, padding: "2px 8px", fontSize: 14, lineHeight: 1 }} onClick={zoomOut} title="Уменьшить">&#8722;</button>
        <span style={{ fontSize: 11, color: "#777", minWidth: 42, textAlign: "center", cursor: "pointer", userSelect: "none" }} onClick={zoomReset} title="Сбросить масштаб">
          {zoomPct}%
        </span>
        <button style={{ ...btnStyle, padding: "2px 8px", fontSize: 14, lineHeight: 1 }} onClick={zoomIn} title="Увеличить">+</button>
      </div>

      {/* ===== Header row ===== */}
      <div style={{ display: "flex", flexShrink: 0 }}>
        {/* Top-left corner: "БЛОКИ" */}
        <div style={{ width: scaledLeftW, flexShrink: 0, height: scaledHeaderH, borderBottom: "1px solid #E0E0E0", borderRight: "1px solid #E0E0E0", background: "#fff", overflow: "hidden" }}>
          <svg width={LEFT_COL} height={HEADER_H} style={{ display: "block", transformOrigin: "0 0", transform: `scale(${zoom})` }}>
            <rect width={LEFT_COL} height={HEADER_H} fill="#fff" />
            <text x={20} y={HEADER_H / 2 + 2} fontSize={10} fontWeight={600} fill="#AAA" letterSpacing={2} fontFamily="Inter,sans-serif">
              БЛОКИ
            </text>
          </svg>
        </div>
        {/* Top-right: period headers */}
        <div ref={headerScrollRef} style={{ flex: 1, overflow: "hidden", height: scaledHeaderH, borderBottom: "1px solid #E0E0E0", background: "#fff" }}>
          <div style={{ width: chartW * zoom, height: scaledHeaderH }}>
            <svg width={chartW} height={HEADER_H} viewBox={`${LEFT_COL} 0 ${chartW} ${HEADER_H}`} style={{ display: "block", transformOrigin: "0 0", transform: `scale(${zoom})` }}>
              {periods.map((p, i) => {
                const x = LEFT_COL + i * COL_W;
                return (
                  <React.Fragment key={i}>
                    <line x1={x} y1={0} x2={x} y2={HEADER_H} stroke="#ECECEC" strokeWidth={0.5} />
                    <text x={x + COL_W / 2} y={HEADER_H / 2 - 4} textAnchor="middle" fontSize={10} fontWeight={600} fill="#777" fontFamily="Inter,sans-serif">{p.label}</text>
                    <text x={x + COL_W / 2} y={HEADER_H / 2 + 10} textAnchor="middle" fontSize={9} fill="#BBB" fontFamily="Inter,sans-serif">{p.sub}</text>
                  </React.Fragment>
                );
              })}
              <line x1={LEFT_COL + periods.length * COL_W} y1={0} x2={LEFT_COL + periods.length * COL_W} y2={HEADER_H} stroke="#ECECEC" strokeWidth={0.5} />
              {todayVis && (
                <>
                  <rect x={todayX - 32} y={2} width={64} height={20} rx={3} fill="#222" />
                  <text x={todayX} y={15} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#fff" letterSpacing={1} fontFamily="Inter,sans-serif">СЕГОДНЯ</text>
                </>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* ===== Body row ===== */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Bottom-left: block labels (syncs vertical scroll) */}
        <div ref={labelsScrollRef} style={{ width: scaledLeftW, flexShrink: 0, overflow: "hidden", borderRight: "1px solid #E0E0E0", background: "#fff" }}>
          <div style={{ width: scaledLeftW, height: bodyH * zoom }}>
            <svg width={LEFT_COL} height={bodyH} style={{ display: "block", transformOrigin: "0 0", transform: `scale(${zoom})`, userSelect: "none" }}>
              <rect width={LEFT_COL} height={bodyH} fill="#fff" />
              {data.blocks.map((block, idx) => (
                <BlockLabel
                  key={block.id}
                  block={block}
                  idx={idx}
                  editingLabel={editingLabel}
                  onEditLabel={(id) => setEditingLabel(id || null)}
                  onUpdateLabel={updateBlockLabel}
                  onMoveBlock={moveBlock}
                  onAddBar={handleAddBar}
                  onDeleteBlock={deleteBlock}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Bottom-right: chart area (main scrollable) */}
        <div
          ref={chartScrollRef}
          onScroll={handleChartScroll}
          style={{ flex: 1, overflow: "auto", cursor: milestoneMode ? "crosshair" : "default" }}
        >
          <div style={{ width: chartW * zoom, height: bodyH * zoom, overflow: "hidden" }}>
            <svg
              ref={chartSvgRef}
              width={chartW}
              height={bodyH}
              viewBox={`${LEFT_COL} 0 ${chartW} ${bodyH}`}
              style={{ display: "block", transformOrigin: "0 0", transform: `scale(${zoom})`, userSelect: "none" }}
              onClick={handleChartSvgClick}
            >
              {/* Background */}
              <rect x={LEFT_COL} width={chartW} height={bodyH} fill="#FAFAF8" data-bg="1" />

              {/* Grid lines */}
              <GridHeader periods={periods} totalH={bodyH} totalW={LEFT_COL + chartW} />

              {/* Today vertical line */}
              {todayVis && (
                <line x1={todayX} y1={0} x2={todayX} y2={bodyH} stroke="#222" strokeWidth={1.5} strokeDasharray="5,4" opacity={0.4} />
              )}

              {/* Block chart rows */}
              {data.blocks.map((block, idx) => (
                <BlockRow
                  key={block.id}
                  block={block}
                  idx={idx}
                  periodsCount={data.periodsCount}
                  startDate={data.startDate}
                  sel={sel}
                  drag={drag}
                  milestoneMode={milestoneMode}
                  chartW={chartW}
                  onStartDrag={handleStartDrag}
                  onSelectBar={handleSelectBar}
                  onSelectMs={handleSelectMs}
                  onStartCreate={handleStartCreate}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
