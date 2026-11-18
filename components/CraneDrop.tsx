"use client";

import { useCallback, useEffect, useRef } from "react";
import { LandscapeCanvas } from "./LandscapeCanvas";
import { drawSprite, type PixelSprite } from "./PixelSprite";

type Point = { x: number; y: number };
export type CraneCargo = { carrier: () => Point | undefined };

type Drop = {
  cargo: CraneCargo;
  point: Point;
  born: number;
  carry: number;
  visibleAt?: number;
  releasedAt?: number;
  target?: number;
};

const CAR: PixelSprite = {
  rows: [
    "..............",
    "..rr...cr.....",
    ".*rr..rpr...r.",
    ".*rrRRRrrRRrrr",
    ".kKrrRRRrrkKrr",
    ".kk.......kk..",
  ],
  ink: { r: "#be3e43", R: "#ed6150", k: "#28313a", K: "#526470", c: "#f9d79c", p: "#f6e8cf", "*": "#e88a68" },
};

const FLOAT_SECONDS = 9;
const SINK_SECONDS = 1.65;

export function CraneDrop() {
  const marker = useRef<HTMLSpanElement>(null);
  const drop = useRef<Drop | null>(null);

  useEffect(() => {
    const world = marker.current?.parentElement;
    if (!world) return;
    const load = (event: Event) => {
      const cargo = (event as CustomEvent<CraneCargo>).detail;
      const point = cargo.carrier();
      if (!point || drop.current) return;
      const base = world.getBoundingClientRect();
      drop.current = { cargo, point: { x: point.x - base.left, y: point.y - base.top + 24 }, born: performance.now(), carry: 1.7 + Math.random() * 1.15 };
    };
    world.addEventListener("crane-cargo", load);
    return () => world.removeEventListener("crane-cargo", load);
  }, []);

  const paint = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear the complete backing store before drawing the car's next position.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(ctx.canvas.width / width, 0, 0, ctx.canvas.height / height, 0, 0);
    const active = drop.current;
    const world = marker.current?.parentElement;
    if (!active || !world) return;
    const now = performance.now();

    if (active.releasedAt === undefined) {
      const bird = active.cargo.carrier();
      const age = (now - active.born) / 1000;
      const base = world.getBoundingClientRect();
      if (bird) active.point = { x: bird.x - base.left + Math.sin(age * 5) * 3, y: bird.y - base.top + 24 };
      if (bird && active.visibleAt === undefined && active.point.x < width - 10) active.visibleAt = now;
      const shown = active.visibleAt === undefined ? 0 : (now - active.visibleAt) / 1000;
      if (shown < active.carry && bird) {
        ctx.fillStyle = "#6d6470";
        ctx.fillRect(Math.round(active.point.x), Math.round(active.point.y - 17), 1, 10);
        drawSprite(ctx, CAR, active.point.x, active.point.y, 2);
        return;
      }
      const lake = world.querySelector('[data-animal="ducks"]')?.getBoundingClientRect();
      if (!lake) {
        drop.current = null;
        return;
      }
      active.releasedAt = now;
      active.target = lake.top - base.top + 44;
    }

    const target = active.target ?? active.point.y;
    const age = (now - active.releasedAt) / 1000;
    const fall = .55 + Math.sqrt(Math.max(0, target - active.point.y) / 300);
    const arrived = age - fall;
    const descent = Math.min(1, age / fall);
    const x = Math.min(width - 24, Math.max(24, active.point.x - descent * 17));

    const drift = Math.min(width - 18, x + Math.max(0, arrived) * 4);
    const sunk = Math.max(0, arrived - FLOAT_SECONDS) / SINK_SECONDS;
    if (sunk >= 1) {
      drop.current = null;
      return;
    }
    const y = active.point.y + (target - active.point.y) * descent ** 2
      + (arrived > 0 ? Math.sin(arrived * 4) * 2 + sunk * 37 : 0);
    if (arrived >= 0 && arrived < 1.2) {
      const radius = 3 + arrived * 28;
      ctx.globalAlpha = .8 * (1 - arrived / 1.2);
      ctx.fillStyle = "#f0f5db";
      for (let i = 0; i < 14; i++) {
        const angle = i / 14 * Math.PI * 2;
        ctx.fillRect(Math.round(drift + Math.cos(angle) * radius), Math.round(target + 6 + Math.sin(angle) * radius * .26), 3, 2);
      }
    }
    ctx.globalAlpha = 1 - sunk * sunk;
    drawSprite(ctx, CAR, drift, y, 2);
    ctx.globalAlpha = 1;
  }, []);

  return <>
    <span ref={marker} hidden aria-hidden="true" />
    <LandscapeCanvas className="crane-drop-art" paint={paint} />
  </>;
}
