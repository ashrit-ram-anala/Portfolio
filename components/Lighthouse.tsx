"use client";

import { LandscapeCanvas } from "./LandscapeCanvas";

const PIXEL = 3;

function block(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, width: number, height = PIXEL) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x / PIXEL) * PIXEL, Math.round(y / PIXEL) * PIXEL, width, height);
}

function paintLighthouse(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  ctx.clearRect(0, 0, width, height);
  const night = Number(getComputedStyle(ctx.canvas).getPropertyValue("--ocean-night")) || 0;
  const ridge = height - 119;
  const water = Math.round(ridge * .87 / PIXEL) * PIXEL;
  const x = Math.round(width * (width < 640 ? .84 : .9) / PIXEL) * PIXEL;
  const top = water - 51;
  const left = Math.sin(time * .58) * .5 + .5;
  const throwLength = x * (.22 + left * .61);
  const targetY = water + 31 + left * 21;
  const glow = (.29 + night * .63) * (.75 + left * .25);

  // Long, tapered strips keep the beam stepped even as it sweeps.
  for (let distance = 0; distance < throwLength; distance += PIXEL) {
    const d = distance / throwLength;
    const center = top + (targetY - top) * d;
    const rise = 2 + Math.round(12 * d);
    ctx.globalAlpha = glow * .34 * (1 - d * d);
    block(ctx, "#ffefb4", x - distance, center - rise, PIXEL, rise * 2);
    ctx.globalAlpha *= .6;
    block(ctx, "#fff7ce", x - distance, center - 2, PIXEL, 4);
  }

  const reflectionStart = (water + 4 - top) / (targetY - top);
  for (let i = 0; i < 17; i++) {
    const d = i / 17;
    const rx = x - throwLength * (reflectionStart + (1 - reflectionStart) * d) + Math.sin(time * 1.68 + i * 1.3) * (3 + d * 6);
    const ry = water + 5 + d * (targetY - water + 42);
    ctx.globalAlpha = glow * (1 - d) * (i % 3 ? .6 : .28);
    block(ctx, i % 3 ? "#f6e2a5" : "#e1e8c9", rx - 6 - d * 7, ry, 10 + d * 21);
  }

  ctx.globalAlpha = 1;
  block(ctx, "#537d76", x - 18, water - 3, 37, 5);
  for (let i = 0; i < 13; i++) {
    const side = 6 + Math.floor(i / 4) * 2;
    const y = water - 42 + i * PIXEL;
    const stripe = i === 3 || i === 4 || i === 8 || i === 9;
    block(ctx, stripe ? "#a86660" : "#e5ddc3", x - side, y, side * 2);
    block(ctx, stripe ? "#805b59" : "#a3b3a7", x + side - 4, y, 4);
  }
  block(ctx, "#50686b", x - 3, water - 12, 5, 9);
  block(ctx, "#516d70", x - 10, top + 5, 21, 4);
  block(ctx, "#7e7265", x - 6, top - 5, 13, 10);
  block(ctx, "#ffe9a2", x - 3, top - 3, 7, 6);
  block(ctx, "#556b6d", x - 9, top - 8, 18);
  block(ctx, "#556b6d", x - 6, top - 11, 12);
  block(ctx, "#556b6d", x - 3, top - 14, 6);
  ctx.globalAlpha = glow * .6;
  block(ctx, "#fff4b7", x - 1, top - 10, 3, 20);
  block(ctx, "#fff4b7", x - 10, top - 1, 20);
  ctx.globalAlpha = 1;
}

export function Lighthouse() {
  return <LandscapeCanvas className="lighthouse-art" paint={paintLighthouse} />;
}
