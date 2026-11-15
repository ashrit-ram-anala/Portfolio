export const CRAB_CANVAS_TOP = 72;

export function shoreHeight(width: number) {
  return Math.max(136, Math.min(168, width * .13));
}

export function shoreBend(x: number) {
  return Math.sin(x / 111 + .6) * 10 + Math.sin(x / 37 - .4) * 4;
}

export function waveEdge(x: number, height: number, tide: number) {
  const wash = Math.sin(tide - x / 160) * 12 + Math.sin(tide * 2 - x / 58) * 3;
  return Math.round((height * .55 + shoreBend(x) + wash) / 3) * 3;
}


export type CrabFootprint = { x: number; y: number };
