"use client";

import { seasonForMonth, type Season } from "@/lib/seasons";
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
  const season = (document.documentElement.dataset.oceanSeason ?? seasonForMonth(new Date().getMonth())) as Season;
  const winter = season === "winter";
  const spring = season === "spring";
  const fall = season === "fall";
  const colors = winter ? ["#a7bdc5", "#c2d3d8", "#a6bebc"]
    : spring ? ["#88aaa0", "#abc6ad", "#7b9f76"]
    : fall ? ["#a5a08a", "#c1b99b", "#a49066"] : ["#95b0aa", "#aac2b9", "#769b8b"];
  ctx.font = "bold 9px Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let x = 0; x < width; x += CELL) {
    const position = x / width;
    const slope = terrain(RIDGES[0], Math.min(1, (x + CELL) / width)) - terrain(RIDGES[0], position);
    const distant = Math.round((terrain(RIDGES[0], position) * ridgeHeight) / ROW) * ROW;
    const near = Math.round((terrain(RIDGES[1], position) * ridgeHeight) / ROW) * ROW;
    ctx.fillStyle = slope > 0 ? colors[0] : colors[1];
    ctx.fillRect(x, distant, CELL, near - distant);

    const snowline = Math.round((ridgeHeight * ((winter ? .63 : .32) + Math.sin(position * 48) * .025)) / ROW) * ROW;
    if (distant < snowline) {
      ctx.fillStyle = winter ? (slope > 0 ? "#d7e4e7" : "#edf3ee") : (slope > 0 ? "#cadcd1" : "#e0eadd");
      ctx.fillRect(x, distant, CELL, snowline - distant);
    }

    const shore = shoreHeight(x, ridgeHeight);
    ctx.fillStyle = colors[2];
    ctx.fillRect(x, near, CELL, Math.max(0, shore - near));
    ctx.fillStyle = "#618e85";
    ctx.fillRect(x, shore - 3, CELL, 3);
    ctx.fillStyle = "#c7e1d6";
    ctx.fillRect(x, shore, CELL, 2);
  }

  // Small trees sit in the foothills, keeping the mountain silhouette readable.
  for (let i = 0; i < Math.floor(width / 42); i++) {
    const x = Math.round((i * 42 + grain(i, 8) * 24) / 2) * 2;
    const near = terrain(RIDGES[1], x / width) * ridgeHeight;
    const shore = shoreHeight(x, ridgeHeight);
    if (shore - near < 13) continue;
    const y = Math.round((near + (shore - near) * .65) / 2) * 2;
    const size = 5 + Math.round(grain(i, 11) * 3);
    ctx.fillStyle = "#6d7862";ctx.fillRect(x, y - size, 2, size);
    ctx.fillStyle = winter ? "#73918b" : fall ? (i % 2 ? "#b18b53" : "#a16f4d") : "#537e65";
    ctx.fillRect(x - 4, y - size - 4, 10, 4);ctx.fillRect(x - 2, y - size - 8, 6, 4);
    if (winter) {ctx.fillStyle = "#e6efea";ctx.fillRect(x - 2, y - size - 8, 6, 2);ctx.fillRect(x - 4, y - size - 4, 10, 2);}
    if (spring) {
      for (let j = 0; j < 3; j++) {
        const fx = x + 10 + j * 5, fy = Math.min(shore - 4, y + j % 2 * 3);
        ctx.fillStyle = "#6e9366";ctx.fillRect(fx, fy, 1, 3);
        ctx.fillStyle = j % 2 ? "#f1d5b5" : "#dcaac0";ctx.fillRect(fx - 1, fy - 1, 3, 2);
      }
    }
  }
  if (winter) {
    // Two short downhill traverses. Skiers follow the actual ridge, not floating paths.
    for (let i = 0; i < 2; i++) {
      const progress = (time / 27 + i * .5) % 1;
      const u = .43 + progress * .13;
      const x = Math.round(u * width / 2) * 2;
      const y = Math.round((terrain(RIDGES[0], u) * ridgeHeight + 9 + progress * 8) / 2) * 2;
      ctx.globalAlpha = Math.min(1, progress * 12, (1 - progress) * 12);
      ctx.fillStyle = "#6b7c83";ctx.fillRect(x - 4, y + 5, 11, 1);ctx.fillRect(x - 2, y + 8, 11, 1);
      ctx.fillStyle = i ? "#597ba1" : "#ae675e";ctx.fillRect(x, y - 2, 3, 5);
      ctx.fillStyle = "#e9dfc7";ctx.fillRect(x + 1, y - 5, 3, 3);
      ctx.fillStyle = "#617179";ctx.fillRect(x - 1, y + 3, 2, 3);ctx.fillRect(x + 4, y + 1, 1, 5);
    }
    ctx.globalAlpha = 1;
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
