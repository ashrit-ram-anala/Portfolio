import type { Interest, InterestTarget } from "./InterestNotes";
import { drawSprite, type PixelSprite } from "./PixelSprite";
import { shoreBend, waveEdge } from "@/lib/shoreline";

const PADDLE: PixelSprite = {
  rows: ["..RRR....", ".RRRrr...", "RRRrrrr..", "RRrrrrr..", ".rrrrr...", "..rrrWb..", ".....Wbb.", "......bb."],
  ink: { R: "#ed7569", r: "#a73e46", W: "#ecd1a0", b: "#7e563e" },
};
const SWORD: PixelSprite = {
  rows: [
    "....................asc.",
    "................ascssca.",
    "............assCssaa....",
    ".........asCCssaa.......",
    "......gasssaaa..........",
    "....gGgCssa.............",
    "mololgGg................",
    "molo..gg................",
    "......g.................",
  ],
  ink: {
    a: "#626875", s: "#a3acb0", C: "#e4e3d4", c: "#fbf0d7",
    g: "#795a4c", G: "#ba9366", m: "#a67b54", o: "#50383c", l: "#805052",
  },
};
const HAT: PixelSprite = {
  rows: ["...GGGGG...", "..GGGGGgg..", "..GGGGGgg..", "..GGGGggg..", "..BBBBBBB..", ".gGGGGGGGG.", "ggggggggggg", "..gggggg..."],
  ink: { G: "#63666a", g: "#3b434c", B: "#222b39" },
};

const FINDS: { id: Interest; x: number; offset: number; sprite: PixelSprite }[] = [
  { id: "paddle", x: .24, offset: 2, sprite: PADDLE },
  { id: "monster", x: .51, offset: -1, sprite: SWORD },
  { id: "hat", x: .77, offset: 2, sprite: HAT },
];

const SIZE = 2;

function fullyCovered(sprite: PixelSprite, x: number, y: number, edgeAt: (x: number) => number) {
  const left = Math.round(x - sprite.rows[0].length * SIZE / 2);
  const top = Math.round(y - sprite.rows.length * SIZE / 2);
  for (let row = 0; row < sprite.rows.length; row++) {
    for (let col = 0; col < sprite.rows[row].length; col++) {
      if (!sprite.ink[sprite.rows[row][col]]) continue;
      const px = left + col * SIZE;
      const bottom = top + (row + 1) * SIZE;
      if (bottom > Math.min(edgeAt(px), edgeAt(px + SIZE - 1))) return false;
    }
  }
  return true;
}

export function createBeachFinds() {
  const finds = FINDS.map(find => ({ ...find, submerged: false, drift: 0, washOffset: 0 }));
  let lastTide = 0;

  return (ctx: CanvasRenderingContext2D, width: number, height: number, tide: number, cell: number): InterestTarget[] => {
    if (width < 1 || height < 1) return [];
    const targets: InterestTarget[] = [];
    const step = Math.max(0, Math.min(.08, (tide - lastTide) / 1.24));
    lastTide = tide;
    const edgeAt = (x: number) => waveEdge(Math.floor(x / cell) * cell, height, tide);
    const sandY = (x: number, offset: number) => height * .55 + shoreBend(x) + offset;

    for (const find of finds) {
      let x = width * find.x;
      let y = sandY(x, find.offset);
      const submerged = fullyCovered(find.sprite, x, y, edgeAt);
      if (submerged && !find.submerged) {
        find.drift = (Math.random() < .55 ? 1 : -1) * (22 + Math.random() * 27);
        find.washOffset = (Math.random() - .5) * 3;
      }
      find.submerged = submerged;
      if (submerged && step > 0) {
        const next = x + find.drift * step;
        if (next < width * .055 || next > width * .945) find.drift *= -1;
        const nextX = Math.max(width * .055, Math.min(width * .945, x + find.drift * step));
        const nextOffset = Math.max(-2, Math.min(2, find.offset + find.washOffset * step));
        const nextY = sandY(nextX, nextOffset);
        if (fullyCovered(find.sprite, nextX, nextY, edgeAt)) {
          find.x = nextX / width;
          find.offset = nextOffset;
          x = nextX;
          y = nextY;
        }
      }

      let shown = 0;
      drawSprite(ctx, find.sprite, x, y, SIZE, (px, py) => {
        const visible = py >= edgeAt(px) + 3;
        if (visible) shown++;
        return visible;
      });
      if (shown >= 4) targets.push({ id: find.id, x, y, width: Math.max(44, find.sprite.rows[0].length * SIZE + 12), height: 38 });
    }
    return targets;
  };
}
