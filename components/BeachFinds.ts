import { drawSprite, type PixelSprite } from "./PixelSprite";
import { shoreBend, waveEdge } from "@/lib/shoreline";

const PADDLE: PixelSprite = {
  rows: ["..RRR....", ".RRRrr...", "RRRrrrr..", "RRrrrrr..", ".rrrrr...", "..rrrWb..", ".....Wbb.", "......bb."],
  ink: { R: "#ed7569", r: "#a73e46", W: "#ecd1a0", b: "#7e563e" },
};
const BOTTLE: PixelSprite = {
  rows: [
    ".....dddd.........................",
    "...dBhhhhdddd.....................",
    "...dBbBBBhhhBddd..................",
    "...dbbbbbBLLBBBbddd...............",
    "..dbbbbbbbLLLLLLbbd...............",
    "..dBBbbbbLmmLLLLBbbd..............",
    "...dBBBbbLLLmLLbBBbd..............",
    "...ddBBBbLLLLLLbbbbbdd............",
    ".....dddbbbbLLLbbbbbbBddd...c.....",
    "........ddddbbBbbdddddBbbdddCcc...",
    "...........dddddd.....dddBBBCGC...",
    ".........................ddCCCd...",
    "...........................cGC....",
    "............................cc....",
  ],
  ink: { d: "#412622", b: "#784525", B: "#a05e31", h: "#c3874e", L: "#e7cba0", m: "#864b39", C: "#783c46", c: "#a75b5e", G: "#542729" },
};
const HAT: PixelSprite = {
  rows: ["...GGGGG...", "..GGGGGgg..", "..GGGGGgg..", "..GGGGggg..", "..BBBBBBB..", ".gGGGGGGGG.", "ggggggggggg", "..gggggg..."],
  ink: { G: "#63666a", g: "#3b434c", B: "#222b39" },
};

const FINDS: { x: number; offset: number; sprite: PixelSprite; size?: number; shoreShift?: number; shuffleDistance?: number }[] = [
  { x: .24, offset: 2, sprite: PADDLE },
  { x: .51, offset: -1, sprite: BOTTLE, size: 1.7, shoreShift: -3, shuffleDistance: 18 },
  { x: .77, offset: 2, sprite: HAT },
];

const SIZE = 2;

function fullyCovered(sprite: PixelSprite, x: number, y: number, size: number, edgeAt: (x: number) => number) {
  const left = Math.round(x - sprite.rows[0].length * size / 2);
  const top = Math.round(y - sprite.rows.length * size / 2);
  for (let row = 0; row < sprite.rows.length; row++) {
    for (let col = 0; col < sprite.rows[row].length; col++) {
      if (!sprite.ink[sprite.rows[row][col]]) continue;
      const px = left + col * size;
      const bottom = top + (row + 1) * size;
      if (bottom > Math.min(edgeAt(px), edgeAt(px + size - 1))) return false;
    }
  }
  return true;
}

export function createBeachFinds() {
  const finds = FINDS.map(find => ({ ...find, submerged: false, shuffled: false, drift: 0, washOffset: 0 }));
  let lastTide = 0;

  return (ctx: CanvasRenderingContext2D, width: number, height: number, tide: number, cell: number) => {
    if (width < 1 || height < 1) return;
    const step = Math.max(0, Math.min(.08, (tide - lastTide) / 1.24));
    lastTide = tide;
    const edgeAt = (x: number) => waveEdge(Math.floor(x / cell) * cell, height, tide);
    const sandY = (x: number, offset: number) => height * .55 + shoreBend(x) + offset;

    for (const find of finds) {
      const size = find.size ?? SIZE;
      let x = width * find.x;
      const shoreShift = find.shoreShift ?? 0;
      let y = sandY(x, find.offset + shoreShift);
      const submerged = fullyCovered(find.sprite, x, y, size, edgeAt);
      if (submerged && !find.submerged) {
        find.shuffled = false;
        find.drift = (Math.random() < .55 ? 1 : -1) * (22 + Math.random() * 27);
        find.washOffset = (Math.random() - .5) * 3;
      }
      find.submerged = submerged;
      if (submerged && step > 0) {
        const travel = find.drift * step;
        // Give a long object a visible shift when there is room under the same wave.
        const shuffle = find.shuffleDistance ?? 0;
        if (shuffle > 0 && !find.shuffled) {
          for (const direction of [Math.sign(travel), -Math.sign(travel)]) {
            const nextX = x + shuffle * direction;
            if (nextX < width * .055 || nextX > width * .945) continue;
            const nextY = sandY(nextX, find.offset + shoreShift);
            if (!fullyCovered(find.sprite, nextX, nextY, size, edgeAt)) continue;
            find.x = nextX / width;
            find.shuffled = true;
            x = nextX;
            y = nextY;
            break;
          }
        }
        const next = x + travel;
        if (next < width * .055 || next > width * .945) find.drift *= -1;
        const nextX = Math.max(width * .055, Math.min(width * .945, x + find.drift * step));
        const nextOffset = Math.max(-2, Math.min(2, find.offset + find.washOffset * step));
        const nextY = sandY(nextX, nextOffset + shoreShift);
        if (fullyCovered(find.sprite, nextX, nextY, size, edgeAt)) {
          find.x = nextX / width;
          find.offset = nextOffset;
          x = nextX;
          y = nextY;
        }
      }

      drawSprite(ctx, find.sprite, x, y, size, (px, py) => py >= edgeAt(px) + 3);
    }
  };
}
