"use client";

import { useCallback, useEffect, useRef } from "react";
import { WATER_ASPECT, WHIRLPOOL_SECONDS, whirlpoolStrength, type LakeWhirlpool } from "@/lib/whirlpool";
import { InterestNotes, placeInterestTargets, type Interest } from "./InterestNotes";
import { LandscapeCanvas } from "./LandscapeCanvas";
import { drawSprite, type PixelSprite } from "./PixelSprite";

type Point = { x: number; y: number };
type CargoKind = "car" | "black-hole";
export type CraneCargo = { kind: CargoKind; carrier: () => Point | undefined };

type Drop = {
  cargo: CraneCargo;
  point: Point;
  born: number;
  carry: number;
  visibleAt?: number;
  releasedAt?: number;
  target?: number;
  whirlpool?: LakeWhirlpool & { worldX: number; worldY: number };
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

function drawBlackHole(ctx: CanvasRenderingContext2D, x: number, y: number, time: number, size: number) {
  const aura = ["#64427e", "#9b65bb", "#dca8eb", "#b57be1"];
  for (let i = 0; i < 48; i++) {
    const stream = i % 3;
    const distance = (i / 48 * 1.2 + time * .93) % 1;
    const angle = stream * Math.PI * 2 / 3 + distance * 5.5 + time * 2.9;
    const r = size * (.43 + distance * 1.03);
    ctx.globalAlpha = .85 - distance * .52;
    ctx.fillStyle = aura[i % aura.length];
    const side = i % 8 === 0 ? 3 : 2;
    ctx.fillRect(Math.round(x + Math.cos(angle) * r), Math.round(y + Math.sin(angle) * r * .72), side, side);
  }
  ctx.globalAlpha = 1;
  for (let row = -4; row <= 4; row++) {
    const half = Math.round(Math.sqrt(18 - row * row) * size * .11);
    ctx.fillStyle = "#171528";
    ctx.fillRect(Math.round(x - half), Math.round(y + row * size * .08), half * 2 + 1, 2);
  }
}

function basin(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, pull: number) {
  const tones = ["#355864", "#2c4c5e", "#254157", "#203746", "#192b42", "#132336", "#0e1c2c", "#0b1526"];
  for (let band = 0; band < tones.length; band++) {
    const t = band / (tones.length - 1);
    const width = radius * (.74 - t * .64);
    const height = width * WATER_ASPECT * .72;
    const down = t * t * 24;
    ctx.globalAlpha = pull * (.14 + t * .34);
    ctx.fillStyle = tones[band];
    for (let row = -height; row < height; row += 3) {
      const edge = Math.sqrt(Math.max(0, 1 - (row / height) ** 2)) * width;
      ctx.fillRect(Math.round(x - edge), Math.round(y + down + row), Math.round(edge * 2), 3);
    }
  }
  ctx.globalAlpha = 1;
}

function paintWhirlpool(ctx: CanvasRenderingContext2D, vortex: NonNullable<Drop["whirlpool"]>, now: number) {
  const age = (now - vortex.born) / 1000;
  const pull = whirlpoolStrength(age);
  if (!pull) return;

  const { worldX: x, worldY: y, radius } = vortex;
  basin(ctx, x, y, radius, pull);
  // Two foam arms curl into the surface. A second, wider current trails each arm.
  for (let i = 0; i < 94; i++) {
    const depth = (i % 47) / 46;
    const r = (6 + depth * radius * .77) * (.75 + pull * .25);
    const angle = age * (2.9 - age * .095) + depth * 7.2 + (i < 47 ? 0 : Math.PI);
    const px = x + Math.cos(angle) * r;
    const down = (1 - depth) ** 2 * 26 * pull;
    const py = y + down + Math.sin(angle) * r * WATER_ASPECT;
    ctx.globalAlpha = pull * (.24 + depth * .41);
    ctx.fillStyle = i % 5 === 0 ? "#d7e6f1" : i % 5 === 1 ? "#b2bedc" : "#f8fff5";
    const size = i % 9 === 0 ? 3 : 2;
    ctx.fillRect(Math.round(px), Math.round(py), size + 1, size);
    if (i % 3 === 0) {
      ctx.globalAlpha = pull * .19;
      ctx.fillStyle = "#a3d1da";
      ctx.fillRect(Math.round(x + Math.cos(angle + .38) * (r + 8)), Math.round(y + down + Math.sin(angle + .38) * (r + 8) * WATER_ASPECT), 9, 2);
    }
  }
  ctx.globalAlpha = 1;
  if (age < 2.1) drawBlackHole(ctx, x, y + 20 * pull, age, 15 * (1 - age / 2.6));
}

export function CraneDrop() {
  const marker = useRef<HTMLSpanElement>(null);
  const drop = useRef<Drop | null>(null);
  const notes = useRef<HTMLDivElement>(null);

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
    ctx.clearRect(0, 0, width, height);
    const active = drop.current;
    const world = marker.current?.parentElement;
    if (!active || !world) {
      placeInterestTargets(notes.current, []);
      return;
    }
    const note = (id: Interest, x: number, y: number, width: number, height: number) => {
      placeInterestTargets(notes.current, [{ id, x, y, width, height }]);
    };
    const now = performance.now();

    if (active.whirlpool) {
      paintWhirlpool(ctx, active.whirlpool, now);
      if (now - active.whirlpool.born > WHIRLPOOL_SECONDS * 1000) {
        drop.current = null;
        placeInterestTargets(notes.current, []);
      } else {
        const { worldX, worldY, radius } = active.whirlpool;
        note("black-hole", worldX, worldY + 12, radius * 1.92, radius * 1.26);
      }
      return;
    }

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
        if (active.cargo.kind === "car") drawSprite(ctx, CAR, active.point.x, active.point.y, 2);
        else drawBlackHole(ctx, active.point.x, active.point.y, age, 13);
        if (active.point.x < width) note(active.cargo.kind, active.point.x, active.point.y, 68, 57);
        else placeInterestTargets(notes.current, []);
        return;
      }
      const lake = world.querySelector('[data-animal="ducks"]')?.getBoundingClientRect();
      if (!lake) {
        drop.current = null;
        return;
      }
      active.releasedAt = now;
      active.target = lake.top - base.top + (active.cargo.kind === "car" ? 44 : 126);
    }

    const target = active.target ?? active.point.y;
    const age = (now - active.releasedAt) / 1000;
    const fall = .55 + Math.sqrt(Math.max(0, target - active.point.y) / 300);
    const arrived = age - fall;
    const descent = Math.min(1, age / fall);
    const x = Math.min(width - 24, Math.max(24, active.point.x - descent * 17));

    if (active.cargo.kind === "black-hole") {
      if (arrived < 0) {
        const y = active.point.y + (target - active.point.y) * descent ** 2;
        drawBlackHole(ctx, x, y, age, 14);
        note("black-hole", x, y, 75, 64);
      } else {
        const lakeCanvas = world.querySelector('[data-animal="ducks"]');
        const lake = lakeCanvas?.getBoundingClientRect();
        if (!lake || !lakeCanvas) {
          drop.current = null;
          return;
        }
        const base = world.getBoundingClientRect();
        const radius = Math.min(224, Math.max(96, width * .27));
        const pool: LakeWhirlpool = { x: x + base.left - lake.left, y: target + base.top - lake.top, radius, born: now };
        active.whirlpool = { ...pool, worldX: x, worldY: target };
        lakeCanvas.parentElement?.dispatchEvent(new CustomEvent<LakeWhirlpool>("lake-whirlpool", { detail: pool }));
      }
      return;
    }

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
    note("car", drift, y, 58, 46);
    ctx.globalAlpha = 1;
  }, []);

  return <>
    <span ref={marker} hidden aria-hidden="true" />
    <LandscapeCanvas className="crane-drop-art" paint={paint} />
    <InterestNotes host={notes} names={["car", "black-hole"]} />
  </>;
}
