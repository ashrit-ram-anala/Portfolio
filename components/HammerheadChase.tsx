"use client";

import { useEffect, useRef } from "react";
import type { PixelSprite } from "./PixelSprite";
import { AnimalEngine } from "@/lib/ascii-animals/engine";
import { angleDiff, clamp, hash3 } from "@/lib/ascii-animals/math";
import { alignSwimSpine, followSwimSpine, swimTailPhase, waveSwimSpine, SWIM_NODES } from "@/lib/ascii-animals/swim-spine";

const shark: PixelSprite = {
  rows: [
    ".................................................",
    "................DDDDD............................",
    "..................DDDDD....................DDD...",
    "...................DDDDDD................DDDDDDD.",
    ".DD..................SDDDDD...............DSSEoDD",
    ".DDDD.................SSSDDDD.............DDSSSSD",
    "..DSDD.................SSSSDDDD...........DDSSSSD",
    "..DSSDD.................SSSSSDDD..........DDSSSBD",
    "...DSSDD.................SSSSSSDD.........DDSSSDD",
    "...DSSSDD................DSSSSSSDD........DDSSSD.",
    "...DDSSSDD...........DDDDDDDDDDDDDDDD....DDDSSD..",
    "....DSSSSDDDDDDDDDDDDDDSSFFFFHHHHHDSDDDDDDDSSSSD.",
    ".....DSSSSSSSSSSSSSSSHHHFFHHHHHHHHHHHHHHSSSSSSSD.",
    ".....DSSSSSSHHHHHHHHHHFFFFFFFFFHHHHHHHHHHHHHHHSD.",
    ".....DSSSSSSSSSSSSSSHHHHHHHHHHHHHHHHHHHHSSSSSSSD.",
    "....DSSSSD.......DDDDDDSSSSSSSSSSSDSDDDDDDDSSSSD.",
    "...DDSSSDD...........DDDDDDSSSSSDDDDD....DDDSSD..",
    "...DSSSDD.................SSSSSSDD........DDSSSD.",
    "...DSSDD.................SSSSSSDD.........DDSSSDD",
    "..DSSDD.................SSSSSDDD..........DDSSSBD",
    "..DSDD.................SSSSDDDD...........DDSSSSD",
    ".DDDD.................SSSDDDD.............DDSSSSD",
    ".DD..................SDDDDD...............DSSEoDD",
    "...................DDDDDD................DDDDDDD.",
    "..................DDDDD....................DDD...",
    "................DDDDD............................",
    ".................................................",
  ],
  ink: { D: "#3d576d", S: "#7296aa", H: "#a1bac4", F: "#557c94", E: "#15384b", o: "#eaf1df", B: "#bbd6d8" },
};

type Swimmer = ReturnType<AnimalEngine["swimmersOnCanvas"]>[number];

interface Hunter {
  x: number;
  y: number;
  heading: number;
  turnRate: number;
  nodes: Float32Array;
  spine: Float32Array;
  length: number;
  phase: number;
  side: number;
  leaving: boolean;
}

type BorrowedSwimmer = NonNullable<ReturnType<AnimalEngine["borrowSwimmer"]>>;

const routes = [
  { cross: false, loops: 1, sweep: .26, direction: 1 },
  { cross: false, loops: 1.25, sweep: .32, direction: -1 },
  { cross: false, loops: .85, sweep: .39, direction: 1 },
  { cross: true, loops: 1, sweep: .32, direction: -1 },
  { cross: true, loops: 1.25, sweep: .37, direction: 1 },
] as const;

interface Escape {
  swimmer: BorrowedSwimmer;
  start: number;
  from: Swimmer;
  route: typeof routes[number];
  turn?: { heading: number; speed: number; x: number; y: number };
  direction: number;
}

const escapeLoopDuration = 4.6;
const escapeExitDuration = 1.9;

function escapePoint(escape: Escape, time: number, width: number, seam: number, bottom: number, side: number) {
  const seconds = time - escape.start;
  const progress = clamp(seconds / escapeLoopDuration, 0, 1);
  const wave = progress * 2 * Math.PI * escape.route.loops;
  const fromAbove = escape.from.y < seam;
  const low = Math.min(escape.from.y, fromAbove ? 36 : seam + 18);
  const high = Math.max(escape.from.y, fromAbove ? seam - 18 : bottom - 35);
  const destination = escape.route.cross
    ? (fromAbove ? seam + Math.min(175, (bottom - seam) * .32) : seam - Math.min(175, seam * .32))
    : clamp(escape.from.y, low + 45, high - 45);
  const center = escape.from.y + (destination - escape.from.y) * (progress * progress * (3 - 2 * progress));
  const radius = Math.min(width * escape.route.sweep, 200);
  const drift = Math.sin(wave) * radius * escape.direction;
  const x = clamp(escape.from.x + (width * .5 - escape.from.x) * progress + drift, Math.min(26, escape.from.x), Math.max(width - 26, escape.from.x));
  let y = center + (1 - Math.cos(wave)) * 53 * (fromAbove ? -1 : 1);
  if (!escape.route.cross) y = clamp(y, low, high);
  else y = clamp(y, Math.min(34, escape.from.y), Math.max(bottom - 34, escape.from.y));
  const exit = Math.max(0, (seconds - escapeLoopDuration) / escapeExitDuration);
  const exitX = side < 0 ? width + escape.from.fish.span * 1.6 : -escape.from.fish.span * 1.6;
  return { x: x + (exitX - x) * exit, y, exited: exit >= 1 };
}

const period = 30;

function createHunter(width: number, prey: Swimmer) {
  const side = prey.x < width / 2 ? -1 : 1;
  const length = clamp(width / 6.55, 100, 205);
  const hunter: Hunter = {
    x: side < 0 ? -28 : width + 28,
    y: prey.y + 52, heading: side < 0 ? -.12 : Math.PI + .12,
    turnRate: 0, nodes: new Float32Array(SWIM_NODES * 2), spine: new Float32Array(SWIM_NODES * 2),
    length, phase: 0, side, leaving: false,
  };
  alignSwimSpine(hunter.nodes, hunter.x, hunter.y, hunter.heading, length);
  return hunter;
}

function updateHunter(hunter: Hunter, target: Swimmer | undefined, width: number, yMin: number, yMax: number, dt: number) {
  const leaving = hunter.leaving || !target;
  const exitSide = -hunter.side;
  let x = exitSide < 0 ? -hunter.length * 2 : width + hunter.length * 2;
  let y = clamp(hunter.y, yMin + 30, yMax - 30);
  const cruising = clamp(width * .36, 245, 485);
  let speed = leaving ? clamp(width * .43, 300, 650) : cruising;

  if (!leaving && target) {
    const distance = Math.hypot(target.x - hunter.x, target.y - hunter.y);
    const lead = distance > 200 ? .12 : -.12;
    x = target.x + target.vx * lead;
    y = clamp(target.y + target.vy * lead, yMin + 22, yMax - 22);
    speed = clamp(Math.hypot(target.vx, target.vy) + (distance - 100) * 1.55, 155, cruising);
  }

  const desired = Math.atan2(y - hunter.y, x - hunter.x);
  const maxTurn = leaving ? 3.5 : 3.4;
  const desiredTurn = clamp(angleDiff(hunter.heading, desired) * 4.6, -maxTurn, maxTurn);
  hunter.turnRate += (desiredTurn - hunter.turnRate) * (1 - Math.exp(-dt * 12));
  hunter.heading += hunter.turnRate * dt;
  hunter.x += Math.cos(hunter.heading) * speed * dt;
  hunter.y += Math.sin(hunter.heading) * speed * dt;
  hunter.phase = swimTailPhase(hunter.phase, dt, speed, 1.1);
  followSwimSpine(hunter.nodes, hunter.x, hunter.y, hunter.heading, hunter.length);
  waveSwimSpine(hunter.nodes, hunter.spine, hunter.length, hunter.phase, 1.5);
}

const SHARK_CELL = 10;

function makeSharkTexture() {
  const texture = document.createElement("canvas");
  texture.width = shark.rows[0].length * SHARK_CELL;
  texture.height = shark.rows.length * SHARK_CELL;
  const ctx = texture.getContext("2d");
  if (!ctx) return;
  ctx.font = "bold 9px Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  shark.rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const tone = row[x];
      const ink = shark.ink[tone];
      if (!ink) continue;
      ctx.fillStyle = ink;
      ctx.fillRect(x * SHARK_CELL, y * SHARK_CELL, SHARK_CELL, SHARK_CELL);
      if (tone === "o" || tone === "E") continue;
      const glyphs = tone === "D" || tone === "F" ? "/#:=." : ".:+=*-";
      const glyph = glyphs[Math.floor(hash3(x, y, 17) * glyphs.length)];
      ctx.fillStyle = tone === "D" || tone === "F" ? "#8aa7b6" : "#304d63";
      ctx.fillText(glyph, (x + .5) * SHARK_CELL, (y + .55) * SHARK_CELL);
    }
  });
  return texture;
}

function drawSwimmingShark(ctx: CanvasRenderingContext2D, hunter: Hunter, texture: HTMLCanvasElement) {
  const width = shark.rows[0].length;
  const height = shark.rows.length;
  const scale = hunter.length / (width - 1);
  for (let col = 0; col < width; col++) {
    const along = (1 - col / (width - 1)) * (SWIM_NODES - 1);
    const node = Math.min(Math.floor(along), SWIM_NODES - 2);
    const fraction = along - node;
    const dx = hunter.spine[node * 2 + 2] - hunter.spine[node * 2];
    const dy = hunter.spine[node * 2 + 3] - hunter.spine[node * 2 + 1];
    ctx.save();
    ctx.translate(hunter.spine[node * 2] + dx * fraction, hunter.spine[node * 2 + 1] + dy * fraction);
    const previous = Math.max(0, node - 1) * 2;
    const following = Math.min(SWIM_NODES - 1, node + 2) * 2;
    const tangentX = (hunter.spine[previous] - hunter.spine[node * 2 + 2]) * (1 - fraction) +
      (hunter.spine[node * 2] - hunter.spine[following]) * fraction;
    const tangentY = (hunter.spine[previous + 1] - hunter.spine[node * 2 + 3]) * (1 - fraction) +
      (hunter.spine[node * 2 + 1] - hunter.spine[following + 1]) * fraction;
    ctx.rotate(Math.atan2(tangentY, tangentX));
    ctx.drawImage(texture, col * SHARK_CELL, 0, SHARK_CELL, texture.height,
      -scale * .59, -height * scale / 2, scale * 1.18, height * scale);
    ctx.restore();
  }
}

export function HammerheadChase() {
  const marker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const area = marker.current?.parentElement;
    const projects = area?.querySelector<HTMLElement>("#projects");
    const education = area?.querySelector<HTMLElement>("#education");
    if (!area || !projects || !education) return;

    const koiCanvas = area.querySelector<HTMLCanvasElement>('[data-animal="koi"]');
    if (!koiCanvas) return;
    const texture = makeSharkTexture();
    if (!texture) return;

    // Paint the same chase in both habitats so their glass cards sit over it.
    const layers = [projects.parentElement, education.parentElement].flatMap(habitat => {
      if (!habitat) return [];
      const element = document.createElement("canvas");
      const ctx = element.getContext("2d");
      if (!ctx) return [];
      element.className = "hammerhead-chase";
      element.setAttribute("aria-hidden", "true");
      element.hidden = true;
      habitat.append(element);
      return [{ habitat, element, ctx }];
    });
    if (!layers.length) return;
    const worldPrey = (worldTop: number) =>
      (AnimalEngine.forCanvas(koiCanvas)?.swimmersOnCanvas() ?? []).map(prey => ({ ...prey, y: prey.y - worldTop }));

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let encounter: { elapsed: number; hunter: Hunter; escape?: Escape; last: number } | undefined;

    const windowInWater = () => {
      const top = Math.max(0, projects.getBoundingClientRect().top);
      const bottom = Math.min(window.innerHeight, education.getBoundingClientRect().bottom);
      return { top, bottom };
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      encounter?.escape?.swimmer.release(false);
      encounter = undefined;
      for (const layer of layers) layer.element.hidden = true;
    };

    const draw = (now: number) => {
      if (!encounter) return;
      const time = encounter.elapsed;
      const { top, bottom } = windowInWater();
      const worldTop = area.getBoundingClientRect().top;
      const yMin = projects.parentElement!.getBoundingClientRect().top - worldTop;
      const seam = education.parentElement!.getBoundingClientRect().top - worldTop;
      const yMax = education.getBoundingClientRect().bottom - worldTop;
      const width = area.clientWidth;
      const hunter = encounter.hunter;
      const exited = hunter.leaving && hunter.spine.every((position, i) =>
        i % 2 || (hunter.side < 0 ? position > width + 65 : position < -65)
      );
      if (exited || time > 17) {
        stop();
        return;
      }

      if (now - encounter.last >= period) {
        const dt = Math.min(.06, (now - encounter.last) / 1000);
        encounter.elapsed += dt;
        const escape = encounter.escape;
        if (escape) {
          const turn = escape.turn;
          let point: ReturnType<typeof escapePoint>;
          if (turn) {
            const away = Math.atan2((turn.y - hunter.y) * .44, turn.x - hunter.x);
            turn.heading += clamp(angleDiff(turn.heading, away), -5 * dt, 5 * dt);
            turn.speed += (285 - turn.speed) * (1 - Math.exp(-dt * 4));
            turn.x = clamp(turn.x + Math.cos(turn.heading) * turn.speed * dt, 20, width - 20);
            const above = escape.from.y < seam;
            turn.y = clamp(turn.y + Math.sin(turn.heading) * turn.speed * dt,
              Math.min(escape.from.y, above ? yMin + 12 : seam + 12),
              Math.max(escape.from.y, above ? seam - 12 : yMax - 12));
            point = { x: turn.x, y: turn.y, exited: false };
          } else {
            point = escapePoint(escape, time, width, seam, yMax, hunter.side);
          }
          const runner = escape.swimmer.steer(point.x, point.y, dt);
          if (turn && time - escape.start >= .92) {
            escape.from = runner;
            escape.direction = Math.cos(turn.heading) < 0 ? -1 : 1;
            escape.start = time;
            escape.turn = undefined;
          }
          if (point.exited) {
            escape.swimmer.release(true);
            encounter.escape = undefined;
            hunter.leaving = true;
          }
          updateHunter(hunter, point.exited ? undefined : runner, width, yMin, yMax, dt);
          if (!point.exited) escape.swimmer.paint(width, Math.ceil(yMax), top - worldTop, bottom - worldTop, dt);
        } else {
          updateHunter(hunter, undefined, width, yMin, yMax, dt);
        }
        for (const { habitat, element, ctx } of layers) {
          const bounds = habitat.getBoundingClientRect();
          const layerTop = Math.floor(Math.max(top, bounds.top)) - 1;
          const layerHeight = Math.ceil(Math.min(bottom, bounds.bottom)) + 1 - layerTop;
          element.hidden = layerHeight <= 0;
          if (element.hidden) continue;
          if (element.width !== width || element.height !== layerHeight) {
            element.width = width;
            element.height = layerHeight;
            element.style.height = `${layerHeight}px`;
          }
          element.style.transform = `translateY(${layerTop - bounds.top}px)`;
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(0, 0, width, layerHeight);
          ctx.translate(0, worldTop - layerTop);
          ctx.globalAlpha = .94;
          drawSwimmingShark(ctx, hunter, texture);
          const swimmer = encounter.escape?.swimmer;
          if (swimmer) {
            ctx.globalAlpha = 1;
            const sourceTop = Math.max(0, Math.floor(layerTop - worldTop));
            const sourceHeight = Math.min(swimmer.canvas.height - sourceTop, layerHeight + 2);
            if (sourceHeight > 0) {
              ctx.drawImage(swimmer.canvas, 0, sourceTop, width, sourceHeight, 0, sourceTop, width, sourceHeight);
            }
          }
          if (habitat === projects.parentElement && layerTop < bounds.top + 58) {
            ctx.globalAlpha = 1;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.globalCompositeOperation = "destination-in";
            const fade = ctx.createLinearGradient(0, bounds.top - layerTop, 0, bounds.top - layerTop + 58);
            fade.addColorStop(0, "transparent");
            fade.addColorStop(1, "#000");
            ctx.fillStyle = fade;
            ctx.fillRect(0, 0, width, layerHeight);
            ctx.globalCompositeOperation = "source-over";
          }
        }
        encounter.last = now;
      }
      frame = requestAnimationFrame(draw);
    };

    const begin = () => {
      if (encounter || motion.matches || document.hidden) return;
      const { top, bottom } = windowInWater();
      if (bottom - top < Math.min(280, window.innerHeight * .52)) return;
      const worldTop = area.getBoundingClientRect().top;
      const prey = worldPrey(worldTop).filter(swimmer => swimmer.y + worldTop >= top && swimmer.y + worldTop <= bottom);
      if (!prey.length) return;
      const width = area.clientWidth;
      const centered = prey.filter(swimmer => swimmer.x > width * .15 && swimmer.x < width * .85);
      const candidates = centered.length ? centered : prey;
      const target = candidates[Math.floor(Math.random() * candidates.length)];
      const hunter = createHunter(width, target);
      const swimmer = target.engine.borrowSwimmer(target.fish, target.y - target.fish.y);
      if (!swimmer) return;
      const escape: Escape = {
        swimmer, start: 0, from: target,
        route: routes[Math.floor(Math.random() * routes.length)],
        direction: hunter.side < 0 ? 1 : -1,
        turn: { x: target.x, y: target.y, heading: target.fish.heading, speed: 285 },
      };
      encounter = { elapsed: 0, hunter, last: performance.now(), escape };
      frame = requestAnimationFrame(draw);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || !event.shiftKey || event.code !== "Digit1" ||
        event.ctrlKey || event.altKey || event.metaKey) return;
      begin();
    };
    window.addEventListener("keydown", onKeyDown);
    motion.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      stop();
      for (const layer of layers) layer.element.remove();
      window.removeEventListener("keydown", onKeyDown);
      motion.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, []);

  return <span ref={marker} hidden />;
}
