/** Shared, bounded drawing samples in beach coordinates; no extra animation loop. */
export type SandMark = { x: number; y: number; born: number };
export const sandCuriosity: {
  marks: readonly SandMark[];
  lastDraw: number;
  inspectedThrough: number;
  owner: object | null;
  nextVisit: number;
} = { marks: [], lastDraw: 0, inspectedThrough: 0, owner: null, nextVisit: 0 };
