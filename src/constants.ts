import type { PaletteEntry, Block, RoadmapData } from "./types";

export const LEFT_COL = 320;
export const COL_W = 150;
export const ROW_H = 48;
export const BAR_H = 20;
export const HEADER_H = 52;
export const SNAP_VAL = 0.25;
export const PERIOD_DAYS = 14;
export const DAY_MS = 86400000;
export const STORAGE_KEY = "roadmap-builder-data";

export const PALETTE: PaletteEntry[] = [
  { color: "#C9B88C", name: "Золото" },
  { color: "#D6CEBA", name: "Песок" },
  { color: "#3A3A3A", name: "Тёмный" },
  { color: "#E85D3A", name: "Акцент" },
  { color: "#5B8C5A", name: "Зелёный" },
  { color: "#6B8DB5", name: "Синий" },
  { color: "#B07BAC", name: "Фиолет" },
  { color: "#D4896A", name: "Терракота" },
];

function makeBlocks(): Block[] {
  return [
    { id: "b1", label: "1. CustDev", bars: [{ id: "r1", start: 0, end: 1, color: "#C9B88C" }], milestones: [] },
    { id: "b2", label: "2. Анализ конкурентов", bars: [{ id: "r2", start: 0, end: 0.75, color: "#C9B88C" }], milestones: [] },
    { id: "b3", label: "3. Разработка требований к продукту", bars: [{ id: "r3", start: 0.5, end: 1.5, color: "#C9B88C" }], milestones: [] },
    { id: "b4", label: "4. Создание PoC (Claude + web)", bars: [{ id: "r4", start: 1, end: 2.5, color: "#D6CEBA" }], milestones: [] },
    { id: "b5", label: "5. Создание маркетинговых материалов", bars: [{ id: "r5", start: 1.5, end: 3, color: "#D6CEBA" }], milestones: [] },
    { id: "b6", label: "6. Проработка архитектуры и создание PRD", bars: [{ id: "r6", start: 1.5, end: 2.5, color: "#6B8DB5" }], milestones: [{ id: "m6", pos: 2.5, label: "PRD готов" }] },
    { id: "b7", label: "7. Расчёт экономики продукта", bars: [{ id: "r7", start: 2, end: 2.75, color: "#6B8DB5" }], milestones: [] },
    { id: "b8", label: "8. Разработка MVP на платформе", bars: [{ id: "r8", start: 2.5, end: 4.75, color: "#3A3A3A" }], milestones: [{ id: "m8", pos: 4.75, label: "MVP готов" }] },
    { id: "b9", label: "9. Разработка модуля прогнозов", bars: [{ id: "r9", start: 3.5, end: 5.25, color: "#3A3A3A" }], milestones: [] },
    { id: "b10", label: "10. Разработка модуля валидации", bars: [{ id: "r10", start: 4, end: 5.5, color: "#3A3A3A" }], milestones: [] },
    { id: "b11", label: "11. Обучение продаж + старт продаж", bars: [{ id: "r11", start: 5, end: 6.5, color: "#E85D3A" }], milestones: [] },
    { id: "b12", label: "12. Референсные интервью", bars: [{ id: "r12", start: 1, end: 2, color: "#5B8C5A" }], milestones: [] },
    { id: "b13", label: "13. Аналитика первых пользователей", bars: [{ id: "r13", start: 5, end: 6, color: "#5B8C5A" }], milestones: [] },
    { id: "b14", label: "14. Обзор итогов MVP", bars: [{ id: "r14", start: 4.75, end: 5.25, color: "#5B8C5A" }], milestones: [] },
    { id: "b15", label: "15. Создание PRD для версии 1.0", bars: [{ id: "r15", start: 5.25, end: 6.25, color: "#B07BAC" }], milestones: [] },
    { id: "b16", label: "16. Разработка интеграций (АП)", bars: [{ id: "r16", start: 4.5, end: 6, color: "#D4896A" }], milestones: [] },
    { id: "b17", label: "17. Разработка RAG модуля", bars: [{ id: "r17", start: 5, end: 6.5, color: "#D4896A" }], milestones: [] },
    { id: "b18", label: "18. Система триггерных нотификаций", bars: [{ id: "r18", start: 5.5, end: 7, color: "#D4896A" }], milestones: [] },
  ];
}

export function makeDefault(): RoadmapData {
  return {
    title: "Дорожная карта Talk to your Data",
    subtitle: "Цель — выход на продажи",
    startDate: "2026-03-02",
    periodsCount: 7,
    blocks: makeBlocks(),
  };
}
