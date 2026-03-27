import { LEFT_COL, COL_W, SNAP_VAL } from "../constants";

export function toPx(p: number): number {
  return LEFT_COL + p * COL_W;
}

export function toPeriod(px: number): number {
  return (px - LEFT_COL) / COL_W;
}

export function snapTo(v: number): number {
  return Math.round(v / SNAP_VAL) * SNAP_VAL;
}

export function clampVal(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}
