"use client";

import { LandscapeCanvas } from "./LandscapeCanvas";

const CELL = 7;
const ROW = 9;
const FOAM = [".", ":", "~", "*", "o"];
const WHITE_FOAM = "#fffef7";
const WATER = ["#294f58", "#3a6970", "#508284", "#6b9995"];

function noise(column: number, row: number) {
  const value = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function paintShore(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, deep: string) {
  ctx.clearRect(0, 0, width, height);
  const sea = ctx.createLinearGradient(0, 0, 0, height * .62);
  sea.addColorStop(0, deep || "#101f2c");
  sea.addColorStop(.27, deep || "#101f2c");
  sea.addColorStop(.77, "#1b3945");
  sea.addColorStop(1, "#2b5661");
  ctx.font = "bold 10px Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const tide = time * 1.24;
  for (let x = 0, col = 0; x < width; x += CELL, col++) {
    const bend = Math.sin(x / 111 + .6) * 10 + Math.sin(x / 37 - .4) * 4;
    const wash = Math.sin(tide - x / 160) * 12 + Math.sin(tide * 2 - x / 58) * 3;
    const edge = Math.round((height * .55 + bend + wash) / 3) * 3;
    const wetEdge = Math.round((height * .71 + bend) / 3) * 3;
    ctx.fillStyle = "#ae9571";
    ctx.fillRect(x, 0, CELL, Math.max(wetEdge, edge + 6));
    if (noise(col, 13) > .62) {
      ctx.fillStyle = "#bea781";
      ctx.fillRect(x, wetEdge, CELL, 3);
    }

    ctx.fillStyle = sea;
    ctx.fillRect(x, 0, CELL, edge);
    for (let row = 0; row < 5; row++) {
      const y = edge - row * ROW;
      const grain = noise(col, row);
      const pulse = Math.sin(tide * 1.5 + col * .27 - row * .8);
      if (row < 2 || grain + pulse * .18 > .46) {
        ctx.fillStyle = WATER[Math.max(0, 3 - row)];
        ctx.fillRect(x, y - 3, CELL, row ? 3 : 6);
      }

      const foam = grain + pulse * .25;
      if (row > 0 && foam > .29 + row * .12) {
        ctx.fillStyle = row === 1 ? "#eaf1e4" : "#a6ceca";
        ctx.fillText(FOAM[Math.floor(grain * FOAM.length)], x + CELL / 2, y);
      }
    }

    const crest = noise(col, 16);
    const swell = Math.sin(tide - x / 160);
    ctx.fillStyle = WHITE_FOAM;
    if (crest + swell * .14 > .11) {
      const thickness = 2 + Math.floor(crest * 3);
      ctx.fillRect(x, edge - 2, CELL, thickness);
      if (crest > .53) ctx.fillRect(x + 2, edge - 5, 3, 3);
      if (crest > .68) ctx.fillRect(x + 4, edge + thickness - 2, 3, 3);
    }

    // The wash breaks into small white islands over the wet sand.
    const breakUp = noise(col, 8);
    if (breakUp + swell * .12 > .68) {
      const spread = edge + 5 + Math.round(noise(col, 1) * 5) * 3;
      ctx.fillStyle = "#f6f3e5";
      ctx.fillRect(x + 1, spread, breakUp > .86 ? 5 : 3, 2);
      if (breakUp > .86) ctx.fillRect(x + 3, spread + 2, 2, 2);
    }
    if (noise(col, 3) > .91) {
      ctx.fillStyle = WHITE_FOAM;
      ctx.fillRect(x + 3, edge - 11, 2, 2);
    }
  }
}

export function Shoreline() {
  return <LandscapeCanvas className="shoreline" paint={paintShore} tintProperty="--deep-water-floor" />;
}
