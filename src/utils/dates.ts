import { PERIOD_DAYS, DAY_MS } from "../constants";

export function fmtDate(d: Date): string {
  return String(d.getDate()).padStart(2, "0") + "." + String(d.getMonth() + 1).padStart(2, "0");
}

export function periodLabel(startStr: string, idx: number): string {
  const s = new Date(startStr);
  const ps = new Date(s.getTime() + idx * PERIOD_DAYS * DAY_MS);
  const pe = new Date(ps.getTime() + (PERIOD_DAYS - 1) * DAY_MS);
  return fmtDate(ps) + " \u2013 " + fmtDate(pe);
}

export function periodSub(idx: number): string {
  const w1 = idx * 2 + 1;
  return "нед. " + w1 + "\u2013" + (w1 + 1);
}

export function getTodayFrac(startStr: string): number {
  const s = new Date(startStr);
  const now = new Date();
  return (now.getTime() - s.getTime()) / (PERIOD_DAYS * DAY_MS);
}

export function barDates(startStr: string, a: number, b: number): string {
  const s = new Date(startStr);
  const ds = new Date(s.getTime() + a * PERIOD_DAYS * DAY_MS);
  const de = new Date(s.getTime() + b * PERIOD_DAYS * DAY_MS - DAY_MS);
  return fmtDate(ds) + " \u2013 " + fmtDate(de);
}

export function rangeText(startStr: string, count: number): string {
  const s = new Date(startStr);
  const e = new Date(s.getTime() + count * PERIOD_DAYS * DAY_MS);
  return "Диапазон: " + fmtDate(s) + " \u2013 " + fmtDate(e);
}
