import type { RoadmapData } from "../types";
import { LEFT_COL, COL_W, ROW_H, HEADER_H, PERIOD_DAYS, DAY_MS, BAR_H, PALETTE } from "../constants";

// --- date helpers (duplicated as pure functions to avoid import issues) ---

function fmtD(d: Date): string {
  return String(d.getDate()).padStart(2, "0") + "." + String(d.getMonth() + 1).padStart(2, "0");
}

function pLabel(startStr: string, idx: number): string {
  const s = new Date(startStr);
  const ps = new Date(s.getTime() + idx * PERIOD_DAYS * DAY_MS);
  const pe = new Date(ps.getTime() + (PERIOD_DAYS - 1) * DAY_MS);
  return fmtD(ps) + " \u2013 " + fmtD(pe);
}

function pSub(idx: number): string {
  const w1 = idx * 2 + 1;
  return "\u043D\u0435\u0434. " + w1 + "\u2013" + (w1 + 1);
}

function bDates(startStr: string, a: number, b: number): string {
  const s = new Date(startStr);
  const ds = new Date(s.getTime() + a * PERIOD_DAYS * DAY_MS);
  const de = new Date(s.getTime() + b * PERIOD_DAYS * DAY_MS - DAY_MS);
  return fmtD(ds) + " \u2013 " + fmtD(de);
}

function todayFrac(startStr: string): number {
  const s = new Date(startStr);
  return (Date.now() - s.getTime()) / (PERIOD_DAYS * DAY_MS);
}

// --- SVG builder ---

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildFullSvg(data: RoadmapData): { svg: string; width: number; height: number } {
  const totalW = LEFT_COL + data.periodsCount * COL_W + 40;
  const totalH = HEADER_H + data.blocks.length * ROW_H + 60;
  const tF = todayFrac(data.startDate);
  const todayX = LEFT_COL + tF * COL_W;
  const todayVis = tF >= 0 && tF <= data.periodsCount;

  const lines: string[] = [];
  const font = "'Inter','Helvetica Neue',Arial,sans-serif";

  lines.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" style="font-family:${font}">`);

  // Backgrounds
  lines.push(`<rect width="${totalW}" height="${totalH}" fill="#FAFAF8"/>`);
  lines.push(`<rect width="${LEFT_COL}" height="${totalH}" fill="#fff"/>`);

  // Header label
  lines.push(`<text x="20" y="${HEADER_H / 2 + 2}" font-size="10" font-weight="600" fill="#AAA" letter-spacing="2" font-family="${font}">\u0411\u041B\u041E\u041A\u0418</text>`);

  // Period headers
  for (let i = 0; i < data.periodsCount; i++) {
    const x = LEFT_COL + i * COL_W;
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${totalH}" stroke="#ECECEC" stroke-width="0.5"/>`);
    lines.push(`<text x="${x + COL_W / 2}" y="${HEADER_H / 2 - 4}" text-anchor="middle" font-size="10" font-weight="600" fill="#777" font-family="${font}">${esc(pLabel(data.startDate, i))}</text>`);
    lines.push(`<text x="${x + COL_W / 2}" y="${HEADER_H / 2 + 10}" text-anchor="middle" font-size="9" fill="#BBB" font-family="${font}">${esc(pSub(i))}</text>`);
    // Mid-period dash
    const mx = x + COL_W / 2;
    lines.push(`<line x1="${mx}" y1="${HEADER_H}" x2="${mx}" y2="${totalH}" stroke="#F5F5F0" stroke-width="0.5" stroke-dasharray="3,4"/>`);
  }

  // Closing column line
  const cx = LEFT_COL + data.periodsCount * COL_W;
  lines.push(`<line x1="${cx}" y1="0" x2="${cx}" y2="${totalH}" stroke="#ECECEC" stroke-width="0.5"/>`);

  // Header / left-col borders
  lines.push(`<line x1="0" y1="${HEADER_H}" x2="${totalW}" y2="${HEADER_H}" stroke="#E0E0E0" stroke-width="1"/>`);
  lines.push(`<line x1="${LEFT_COL}" y1="0" x2="${LEFT_COL}" y2="${totalH}" stroke="#E0E0E0" stroke-width="1"/>`);

  // Today marker
  if (todayVis) {
    lines.push(`<rect x="${todayX - 32}" y="2" width="64" height="20" rx="3" fill="#222"/>`);
    lines.push(`<text x="${todayX}" y="15" text-anchor="middle" font-size="8.5" font-weight="700" fill="#fff" letter-spacing="1" font-family="${font}">\u0421\u0415\u0413\u041E\u0414\u041D\u042F</text>`);
    lines.push(`<line x1="${todayX}" y1="24" x2="${todayX}" y2="${totalH}" stroke="#222" stroke-width="1.5" stroke-dasharray="5,4" opacity="0.4"/>`);
  }

  // Title watermark at top-right
  lines.push(`<text x="${totalW - 20}" y="18" text-anchor="end" font-size="9" fill="#CCC" font-family="${font}">${esc(data.title)}</text>`);

  // Block rows
  data.blocks.forEach((block, idx) => {
    const y = HEADER_H + idx * ROW_H;

    // Row line
    lines.push(`<line x1="0" y1="${y + ROW_H}" x2="${totalW}" y2="${y + ROW_H}" stroke="#F0EFE8" stroke-width="0.5"/>`);

    // Label
    const truncLabel = block.label.length > 42 ? block.label.slice(0, 42) + "\u2026" : block.label;
    lines.push(`<text x="20" y="${y + ROW_H / 2 + 4}" font-size="11" font-weight="500" fill="#333" font-family="${font}">${esc(truncLabel)}</text>`);

    // Bars
    block.bars.forEach(bar => {
      const bx = LEFT_COL + bar.start * COL_W;
      const bw = (bar.end - bar.start) * COL_W;
      const by = y + (ROW_H - BAR_H) / 2;
      const isDark = bar.color === "#3A3A3A";
      lines.push(`<rect x="${bx}" y="${by}" width="${bw}" height="${BAR_H}" rx="4" fill="${bar.color}" opacity="0.85"/>`);
      if (bw > 80) {
        lines.push(`<text x="${bx + bw / 2}" y="${by + BAR_H / 2 + 3.5}" text-anchor="middle" font-size="9" font-weight="500" fill="${isDark ? "#ccc" : "#666"}" font-family="${font}">${esc(bDates(data.startDate, bar.start, bar.end))}</text>`);
      }
    });

    // Milestones
    block.milestones.forEach(ms => {
      const mx = LEFT_COL + ms.pos * COL_W;
      const my = y + ROW_H / 2;
      lines.push(`<polygon points="${mx},${my - 8} ${mx + 8},${my} ${mx},${my + 8} ${mx - 8},${my}" fill="#E85D3A" opacity="0.85"/>`);
      lines.push(`<text x="${mx + 12}" y="${my + 4}" font-size="9" font-weight="600" fill="#E85D3A" font-family="${font}">${esc(ms.label)}</text>`);
    });
  });

  // Legend at bottom
  const legendY = totalH - 20;
  lines.push(`<text x="20" y="${legendY}" font-size="9" fill="#BBB" font-family="${font}">1 \u0441\u0442\u043E\u043B\u0431\u0435\u0446 = 2 \u043D\u0435\u0434.</text>`);
  let lx = 140;
  PALETTE.slice(0, 4).forEach(p => {
    lines.push(`<rect x="${lx}" y="${legendY - 7}" width="12" height="8" rx="2" fill="${p.color}"/>`);
    lines.push(`<text x="${lx + 16}" y="${legendY}" font-size="9" fill="#BBB" font-family="${font}">${esc(p.name)}</text>`);
    lx += 70;
  });
  // Milestone legend
  lines.push(`<polygon points="${lx + 5},${legendY - 7} ${lx + 9},${legendY - 3} ${lx + 5},${legendY + 1} ${lx + 1},${legendY - 3}" fill="#E85D3A"/>`);
  lines.push(`<text x="${lx + 14}" y="${legendY}" font-size="9" fill="#BBB" font-family="${font}">\u0412\u0435\u0445\u0430</text>`);

  lines.push(`</svg>`);
  return { svg: lines.join("\n"), width: totalW, height: totalH };
}

// --- Render SVG string to canvas ---

function svgToCanvas(svgStr: string, width: number, height: number, scale: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);
      ctx.fillStyle = "#FAFAF8";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to render SVG"));
    };
    img.src = url;
  });
}

// --- Public API ---

export async function exportPng(data: RoadmapData): Promise<void> {
  const { svg, width, height } = buildFullSvg(data);
  const canvas = await svgToCanvas(svg, width, height, 2); // 2x for retina
  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roadmap.png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

export async function exportPdf(data: RoadmapData): Promise<void> {
  const { svg, width, height } = buildFullSvg(data);
  const canvas = await svgToCanvas(svg, width, height, 2);

  // Lazy-load jsPDF
  const { jsPDF } = await import("jspdf");

  const orientation = width > height ? "landscape" : "portrait";
  const pdf = new jsPDF({ orientation, unit: "px", format: [width, height] });

  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save("roadmap.pdf");
}
