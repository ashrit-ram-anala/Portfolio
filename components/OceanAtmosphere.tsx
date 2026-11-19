"use client";

import { LandscapeCanvas } from "./LandscapeCanvas";

const STREAMS = [
  { x: .043, phase: .10, speed: 24 },
  { x: .943, phase: .37, speed: 31 },
  { x: .057, phase: .63, speed: 29 },
  { x: .971, phase: .88, speed: 22 },
];

function paintBubbles(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  ctx.clearRect(0, 0, width, height);
  for (const stream of STREAMS) {
    const run = height + 132;
    const origin = height + 64 - (time * stream.speed + run * stream.phase) % run;
    for (let i = 0; i < 3; i++) {
      const y = Math.round((origin + i * 16) / 2) * 2;
      if (y < -12 || y > height + 12) continue;
      const rise = 1 - y / height;
      const x = Math.round((width * stream.x + Math.sin(y * .018 + i * 1.7) * Math.min(11, width * .015)) / 2) * 2;
      const size = i === 1 ? 9 : 5;
      ctx.globalAlpha = Math.max(0, Math.min(1, y / 42, (height - y) / 55)) * (.24 + .52 * rise);
      ctx.fillStyle = rise > .55 ? "#e0faf3" : "#98c4d5";
      ctx.fillRect(x + 2, y, size - 3, 2);
      ctx.fillRect(x + 2, y + size, size - 3, 2);
      ctx.fillRect(x, y + 2, 2, size - 2);
      ctx.fillRect(x + size - 1, y + 2, 2, size - 2);
      if (size > 5) ctx.fillRect(x + 3, y + 3, 2, 2);
    }
  }
  ctx.globalAlpha = 1;
}

export function RisingBubbles() {
  return <LandscapeCanvas className="rising-bubbles" paint={paintBubbles} />;
}
