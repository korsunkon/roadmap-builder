export interface RoadmapData {
  title: string;
  subtitle: string;
  startDate: string;
  periodsCount: number;
  blocks: Block[];
}

export interface Block {
  id: string;
  label: string;
  bars: Bar[];
  milestones: Milestone[];
}

export interface Bar {
  id: string;
  start: number;
  end: number;
  color: string;
}

export interface Milestone {
  id: string;
  pos: number;
  label: string;
}

export interface DragState {
  type: "move" | "resize-left" | "resize-right";
  blockId: string;
  barId: string;
  startX: number;
  origStart: number;
  origEnd: number;
}

export interface Selection {
  blockId: string;
  barId?: string;
  msId?: string;
}

export interface PaletteEntry {
  color: string;
  name: string;
}
