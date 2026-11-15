"use client";

import { LandscapeCanvas } from "./LandscapeCanvas";

const CELL = 8;
const ROW = 9;
const RIDGES = [
  [.62, .44, .51, .2, .38, .13, .41, .68, .41, .56, .25, .49, .64],
  [.84, .77, .81, .66, .82, .75, .83, .66, .8, .86, .72, .81, .74],
];
function terrain(ridge: number[], x: number) {
  const index = x * (ridge.length - 1);
  const left = Math.floor(index);
  const mix = index - left;
  return ridge[left] * (1 - mix) + (ridge[left + 1] ?? ridge[left]) * mix;
}

function grain(col: number, row: number) {
  const value = Math.sin(col * 49.17 + row * 156.43) * 43758.5453;
  return value - Math.floor(value);
}

function shoreHeight(x: number, ridgeHeight: number) {
  return Math.round((ridgeHeight * .88 + Math.sin(x / 109) * 3 + Math.sin(x / 43) * 2) / 3) * 3;
}

function paintMountains(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  ctx.clearRect(0, 0, width, height);
  const ridgeHeight = height - 42;
  ctx.font = "bold 9px Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let x = 0; x < width; x += CELL) {
    const position = x / width;
    const slope = terrain(RIDGES[0], Math.min(1, (x + CELL) / width)) - terrain(RIDGES[0], position);
    const distant = Math.round((terrain(RIDGES[0], position) * ridgeHeight) / ROW) * ROW;
    const near = Math.round((terrain(RIDGES[1], position) * ridgeHeight) / ROW) * ROW;
    ctx.fillStyle = slope > 0 ? "#95b0aa" : "#aac2b9";
    ctx.fillRect(x, distant, CELL, near - distant);

    const snowline = Math.round((ridgeHeight * (.32 + Math.sin(position * 48) * .025)) / ROW) * ROW;
    if (distant < snowline) {
      ctx.fillStyle = slope > 0 ? "#cadcd1" : "#e0eadd";
      ctx.fillRect(x, distant, CELL, snowline - distant);
    }

    const shore = shoreHeight(x, ridgeHeight);
    ctx.fillStyle = "#769b8b";
    ctx.fillRect(x, near, CELL, Math.max(0, shore - near));
    ctx.fillStyle = "#618e85";
    ctx.fillRect(x, shore - 3, CELL, 3);
    ctx.fillStyle = "#c7e1d6";
    ctx.fillRect(x, shore, CELL, 2);
  }

  for (let i = 0; i < Math.ceil(width / 19); i++) {
    const x = ((i * 19 + grain(i, 34) * 21 + time * 7) % width);
    const depth = 8 + grain(i, 57) * 45;
    const y = Math.round((shoreHeight(x, ridgeHeight) + depth) / 2) * 2;
    const dash = 4 + Math.round(grain(i, 16) * 5) * 3;
    ctx.globalAlpha = (.45 + Math.sin(time * 1.4 + i) * .18) * (1 - depth / 70);
    ctx.fillStyle = i % 3 ? "#e1eee1" : "#568e87";
    ctx.fillRect(Math.round(x / 2) * 2, y, dash, 2);
  }

  // Light spindrift moves over the snowy ridge rather than moving the terrain.
  for (let i = 0; i < 30; i++) {
    const drift = (grain(i, 91) + time * (.028 + grain(i, 22) * .02)) % 1;
    const peak = terrain(RIDGES[0], drift);
    if (peak > .45) continue;
    const y = peak * ridgeHeight - 6 - grain(i, 42) * 16;
    ctx.globalAlpha = .4 + .28 * Math.sin(time * 1.7 + i);
    ctx.fillStyle = "#f7f9e9";
    ctx.fillText(i % 2 ? "." : "~", Math.round(drift * width / CELL) * CELL, y);
  }
  ctx.globalAlpha = 1;
}

export function MountainRange() {
  return <LandscapeCanvas className="mountains" paint={paintMountains} />;
}
