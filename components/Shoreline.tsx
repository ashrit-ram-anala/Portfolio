"use client";

import { useCallback, useEffect, useRef } from "react";
import { shoreBend, waveEdge, type CrabFootprint } from "@/lib/shoreline";
import { createBeachFinds } from "./BeachFinds";
import { LandscapeCanvas } from "./LandscapeCanvas";

const CELL = 7;
const ROW = 9;
const FOAM = [".", ":", "~", "*", "o"];
const WHITE_FOAM = "#fffef7";
type Mark = CrabFootprint & { born: number };
const WATER = ["#294f58", "#3a6970", "#508284", "#6b9995"];

function noise(column: number, row: number) {
  const value = Math.sin(column * 127.1 + row * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function paintShore(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, deep: string, marks: Mark[], paintBeachFinds: ReturnType<typeof createBeachFinds>) {
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
    const bend = shoreBend(x);
    const edge = waveEdge(x, height, tide);
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

  paintBeachFinds(ctx, width, height, tide, CELL);

  // A print can only survive in the exposed part of the wet sand.
  for (let i = marks.length - 1; i >= 0; i--) {
    const { x, y, born } = marks[i];
    const column = Math.floor(x / CELL) * CELL;
    const edge = waveEdge(column, height, tide);
    const wetEdge = height * .71 + shoreBend(column);
    const age = (performance.now() - born) / 1000;
    if (x < 0 || x >= width || y <= edge + 2 || y > wetEdge + 1 || age > 18) {
      marks.splice(i, 1);
      continue;
    }
    ctx.globalAlpha = .7 * (1 - age / 18);
    ctx.fillStyle = "#664d3d";
    ctx.fillRect(x, y, 2, 2);
    ctx.fillRect(x + 2, y - 1, 1, 1);
  }
  ctx.globalAlpha = 1;
}

export function Shoreline() {
  const marker = useRef<HTMLSpanElement>(null);
  const prints = useRef<Mark[]>([]);
  const finds = useRef(createBeachFinds());
  useEffect(() => {
    const beach = marker.current?.parentElement;
    if (!beach) return;
    const addMark = (event: Event) => {
      const point = (event as CustomEvent<CrabFootprint>).detail;
      if (point.y < 52 || point.y > 139) return;
      prints.current.push({ x: Math.round(point.x), y: Math.round(point.y), born: performance.now() });
      if (prints.current.length > 300) prints.current.shift();
    };
    beach.addEventListener("crab-footprint", addMark);
    return () => beach.removeEventListener("crab-footprint", addMark);
  }, []);
  const paint = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, time: number, tint: string) => {
    paintShore(ctx, w, h, time, tint, prints.current, finds.current);
  }, []);
  return <>
    <span ref={marker} hidden aria-hidden="true" />
    <LandscapeCanvas className="shoreline" paint={paint} tintProperty="--deep-water-floor" />
  </>;
}
