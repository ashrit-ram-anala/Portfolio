/**
 * Leopard frogs, leaping between stationary lily pads.
 *
 * A frog rests on a pad, breathing and blinking,
 * then leaps: it flies in a straight line over the ground while its height
 * follows a parabola. Seen from above, height means coming toward you, so the
 * frog draws bigger at the top of the arc. The hind legs unfold from a folded
 * Z into a long straight kick and fold back on landing, the front legs reach
 * forward to catch it, and each landing splashes into the trail.
 *
 * Look, from above: a pear-shaped body widest at the hips and a broad blunt
 * head; pale ridges down the back, dark spots with pale halos, banded legs,
 * splayed toes and webbed hind feet. Each eye is exactly one cell (white
 * with a solid black pupil, or a closed lid mid-blink), so the pair always
 * matches however the frog turns.
 */
import { SHARED_TUNING, type Animal, type Creature, type Flock } from "../flock";
import { INK_DARK, INK_GLASS, INK_LIT, ink, type RGB } from "../ink";
import { clamp, frac, lerp, rand, smoothstep } from "../math";
import type { Pen } from "../renderer";
import { seg, spotted, toSegment } from "./shapes";

export interface Frog extends Creature {
  leaping: boolean;
  /** When the current sit ends. */
  until: number;
  /** Progress through the current leap, 0 → 1. */
  s: number;
  dur: number;
  pad: number;
  destination: number;
  exit: -1 | 0 | 1;
}

const DEFAULTS = {
  ...SHARED_TUNING,
  fog: 0,
  size: 1.2,
  density: 1.3,
  sway: 0,
  spread: 0,
  farthest: 0.35,
  farBias: 1.4,
  separation: 450,
  trail: 3.45,
  trailFade: 0.4,
  shimmer: 0.15,
  sparkle: 0.05,
  hop: 1,
  leap: 0.45,
  height: 1,
};

const SKIN: RGB = [149, 194, 79];
const LEG: RGB = [116, 177, 70];
const SPOT: RGB = [30, 70, 30];
const HALO: RGB = [190, 222, 130];
const RIDGE: RGB = [206, 226, 150];
const BAND: RGB = [36, 80, 32];
/** Big white eyes with solid black pupils. */
const EYE_WHITE: RGB = [240, 240, 228];
const PUPIL: RGB = [16, 16, 12];
const LID: RGB = [20, 30, 16];
const WEB: RGB = [120, 190, 90];

type Joint = [number, number];
/** Hind leg (hip, knee, ankle, foot) for the right side: folded in a Z at rest, splayed outward and back mid-leap. */
const HIND_REST: Joint[] = [[-0.16, 0.11], [0.0, 0.22], [-0.19, 0.25], [-0.04, 0.31]];
const HIND_KICK: Joint[] = [[-0.16, 0.11], [-0.34, 0.24], [-0.54, 0.32], [-0.68, 0.37]];
const HIND_RADII = [0.056, 0.04, 0.026];
/** Front leg (shoulder, elbow, hand): reaching forward at rest, tucked back mid-leap, reaching to land. */
const FRONT_REST: Joint[] = [[0.06, 0.1], [0.09, 0.19], [0.18, 0.2]];
const FRONT_AIR: Joint[] = [[0.06, 0.1], [0.02, 0.16], [-0.06, 0.15]];
const FRONT_REACH: Joint[] = [[0.08, 0.11], [0.16, 0.19], [0.27, 0.19]];
const FRONT_RADII = [0.028, 0.022];
/** Where the eyes sit (right side), in body coordinates. */
const EYE: Joint = [0.18, 0.1];

const blend = (a: Joint[], b: Joint[], t: number): Joint[] => a.map(([u, v], i) => [lerp(u, b[i][0], t), lerp(v, b[i][1], t)]);

/** Half-width of the body at u: a pear widest at the hips, then a broad, blunt head. */
function halfWidth(u: number, breathe: number) {
  const trunk = 0.155 * Math.sqrt(Math.max(0, 1 - ((u + 0.1) / 0.18) ** 2));
  let head = 0.15 * breathe * Math.sqrt(Math.max(0, 1 - ((u - 0.12) / 0.18) ** 2));
  if (u > 0.18) head *= 1 - 0.5 * ((u - 0.18) / 0.12) ** 2;
  return Math.max(trunk, head);
}

/** On a limb chain (tapered capsules)? Writes how far down it into seg.t. */
function onLimb(joints: Joint[], radii: number[], u: number, v: number) {
  for (let i = 0; i < joints.length - 1; i++) {
    const [au, av] = joints[i];
    const [bu, bv] = joints[i + 1];
    if (toSegment(u, v, au, av, bu, bv) <= radii[i] * (1 - 0.25 * seg.t)) {
      seg.t = (i + seg.t) / (joints.length - 1);
      return true;
    }
  }
  return false;
}

const at = { x: 0, y: 0 };
// Positions in the lake as fractions of the canvas, independent of the frogs.
const PADS = [
  [0.075, 0.16], [0.32, 0.10], [0.58, 0.14], [0.86, 0.20],
  [0.18, 0.39], [0.43, 0.32], [0.70, 0.39], [0.93, 0.47],
  [0.08, 0.64], [0.34, 0.61], [0.62, 0.67], [0.84, 0.71],
  [0.23, 0.88], [0.49, 0.84], [0.73, 0.90],
];

function padPosition(flock: Flock<Frog>, index: number) {
  const [x, y] = PADS[index];
  return { x: x * flock.width, y: y * flock.height };
}

function openPads(flock: Flock<Frog>) {
  const occupied = new Set(flock.creatures.flatMap(f => [f.pad, f.destination]));
  return PADS.map((_, index) => index).filter(index => !occupied.has(index));
}

export const frogs: Animal<Frog> = {
  key: "frogs",
  label: "Frog",
  swatch: [104, 184, 76],
  defaults: DEFAULTS,
  hide: ["grip"],
  controls: [
    ["Leaping", [
      { key: "hop", label: "How often", min: 0.2, max: 4, step: 0.05, hint: "How often they leap." },
      { key: "leap", label: "Leap length", min: 0.3, max: 2.5, step: 0.05, hint: "How strongly frogs favor nearby pads." },
      { key: "height", label: "Leap height", min: 0, max: 2.5, step: 0.05, hint: "How high each leap arcs: they draw bigger at the top and the shadow slides further away." },
    ]],
  ],
  area: 75000,
  max: PADS.length - 1,
  scale: 0.95,
  speed: 80,
  trail: { light: [80, 150, 170], dark: [110, 200, 220] },

  create: (c) => ({ ...c, leaping: false, until: 0, s: 0, dur: 0.5, pad: -1, destination: -1, exit: 0 }),

  enter(f, flock) {
    f.leaping = false;
    f.s = 0;
    f.vx = 0;
    f.vy = 0;
    f.heading = flock.heading;
    if (f.pad < 0) {
      const available = openPads(flock);
      f.pad = available[Math.floor(Math.random() * available.length)] ?? -1;
    }
    if (f.pad >= 0) Object.assign(f, padPosition(flock, f.pad));
    f.until = flock.time + rand(0.6, 2.2);
  },

  update(f, flock, dt) {
    const k = flock.tuning as typeof DEFAULTS;
    const t = flock.time;
    if (f.pad < 0) {
      if (t >= f.until) flock.reenter(f);
      return;
    }

    const from = padPosition(flock, f.pad);
    if (!f.leaping) {
      Object.assign(f, from);
      if (t >= f.until) leap(f, flock);
      return;
    }

    const to = f.exit
      ? { x: f.exit < 0 ? -f.span : flock.width + f.span, y: from.y }
      : padPosition(flock, f.destination);
    f.s = Math.min(1, f.s + dt / f.dur);
    f.x = lerp(from.x, to.x, f.s);
    f.y = lerp(from.y, to.y, f.s);
    if (f.s < 1) return;

    Object.assign(f, to);
    f.leaping = false;
    f.pad = f.destination;
    f.destination = -1;
    f.exit = 0;
    f.until = t + (f.pad < 0 ? rand(0.8, 1.5) : rand(0.6, 1.3) / (k.hop * k.speed));
    if (f.pad >= 0) flock.events.push({ x: f.x, y: f.y, radius: 2, amount: 0.7 * f.depth * k.trail });
  },

  startle(f, dx, dy, strength, flock) {
    if (f.leaping || f.pad < 0) return;
    leap(f, flock, { dx, dy, strength });
  },

  drawAll(flock, pen) {
    for (let index = 0; index < PADS.length; index++) drawPad(flock, pen, index);
    for (const f of flock.creatures) {
      if (f.pad >= 0) drawFrog(f, pen, flock);
    }
  },
};

function leap(f: Frog, flock: Flock<Frog>, scare?: { dx: number; dy: number; strength: number }) {
  const k = flock.tuning as typeof DEFAULTS;
  const from = padPosition(flock, f.pad);
  const reach = f.span * 3 * k.leap * k.speed;
  const edgeReach = Math.max(reach, flock.width * 0.085);
  const exit = scare && scare.dx < -0.35 && from.x < edgeReach ? -1
    : scare && scare.dx > 0.35 && flock.width - from.x < edgeReach ? 1 : 0;
  let destination = -1;
  let to = { x: exit < 0 ? -f.span : flock.width + f.span, y: from.y };

  if (!exit) {
    let best = -Infinity;
    for (const pad of openPads(flock)) {
      const point = padPosition(flock, pad);
      const dx = point.x - from.x;
      const dy = point.y - from.y;
      const distance = Math.hypot(dx, dy);
      const away = scare ? (dx * scare.dx + dy * scare.dy) / distance : 0;
      const score = away * (2 + (scare?.strength ?? 0)) - distance / reach + rand(0, 0.65);
      if (score <= best) continue;
      best = score;
      destination = pad;
      to = point;
    }
    if (destination < 0) {
      f.until = flock.time + 0.35;
      return;
    }
  }

  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  f.leaping = true;
  f.s = 0;
  f.destination = destination;
  f.exit = exit;
  f.heading = Math.atan2(to.y - from.y, to.x - from.x);
  f.dur = clamp(distance / 380, 0.36, 0.8) * (scare ? 0.87 : 1);
}

function drawPad(flock: Flock<Frog>, pen: Pen, index: number) {
  const { x, y } = padPosition(flock, index);
  const span = clamp(flock.width * 0.09, 59, 115) * (index % 2 ? 0.9 : 1);
  const pad = { x, y, span, depth: 0.85, id: index, heading: index * 1.7 };
  pen.shape(pad, 0.7, (u, v) => {
    const radius = Math.hypot(u / 0.63, v / 0.45);
    if (radius > 1 || (u > 0.12 && Math.abs(v) < u * 0.43)) return false;
    if (radius > 0.86) return ink(pen.ink, 88, 134, 85, INK_LIT, "+");
    return ink(pen.ink, 38, 94, 76, INK_GLASS, "=");
  });
}

function drawFrog(f: Frog, pen: Pen, flock: Flock<Frog>) {
  const k = flock.tuning as typeof DEFAULTS;
  const s = f.leaping ? f.s : 0;
  const h = 4 * s * (1 - s) * k.height;
  const S = f.span * (1 + 0.35 * h);
  const location = f.leaping ? f : padPosition(flock, f.pad);
  const pose = { x: location.x, y: location.y, heading: f.heading, span: S, depth: f.depth, id: f.id };
  const out = pen.ink;

  // The knees spread as the feet kick back, then tuck again for landing.
  const kick = f.leaping ? smoothstep(0, 0.16, s) * (1 - smoothstep(0.72, 1, s)) : 0;
  const hind = blend(HIND_REST, HIND_KICK, kick);
  const halfCell = Math.hypot(pen.cw, pen.ch) / (2 * S);
  const front = f.leaping
    ? s < 0.6 ? blend(FRONT_REST, FRONT_AIR, smoothstep(0, 0.2, s)) : blend(FRONT_AIR, FRONT_REACH, smoothstep(0.6, 0.95, s))
    : FRONT_REST;
  // Breathing: the throat swells while sitting. A blink now and then.
  const breathe = f.leaping ? 1 : 1 + 0.045 * Math.sin(pen.t * 6 + f.id);
  const blinking = !f.leaping && frac(pen.t * 0.21 + f.id * 0.37) < 0.035;

  // Toes: splayed lines off each hand and foot (trailing behind mid-leap).
  for (const side of [-1, 1]) {
    const toes = (from: Joint, to: Joint, n: number, len: number, fan: number) => {
      const dir = Math.atan2(to[1] - from[1], to[0] - from[0]);
      for (let i = 0; i < n; i++) {
        const a = dir + (i / (n - 1) - 0.5) * fan;
        pen.lineBody(pose, to[0], to[1] * side, to[0] + Math.cos(a) * len, (to[1] + Math.sin(a) * len) * side, WEB);
      }
    };
    toes(hind[2], hind[3], 4, 0.075, 1.2);
    toes(front[1], front[2], 3, 0.045, 1.1);
  }

  pen.shape(pose, 0.9, (u, v) => {
    const av = Math.abs(v);
    // Body: pale ridges down the back, dark spots with pale halos, a soft highlight down the middle.
    const hw = halfWidth(u, breathe);
    if (av <= hw && u > -0.29 && u < 0.3) {
      if (Math.abs(av - 0.11) < 0.012 && u > -0.22 && u < 0.14) return ink(out, ...RIDGE, INK_LIT);
      if (u < 0.1) {
        if (spotted(u, v, 0.085, 0.024, f.id)) return ink(out, ...SPOT, INK_DARK);
        if (spotted(u, v, 0.085, 0.036, f.id)) return ink(out, ...HALO, INK_LIT);
      }
      const g = 0.9 + 0.2 * (1 - av / Math.max(hw, 1e-3));
      return ink(out, SKIN[0] * g, SKIN[1] * g, SKIN[2] * g, INK_LIT);
    }
    // Reserve a clear cell between the extended legs behind the body.
    if (kick > 0 && u < -0.28 && av < halfCell * kick) return false;

    // Webbing between the hind toes.
    const [fu, fv] = hind[3];
    const [au, av2] = hind[2];
    const dir = Math.atan2(fv - av2, fu - au);
    const off = Math.atan2(av - fv, u - fu) - dir;
    if (Math.hypot(u - fu, av - fv) < 0.06 && Math.abs(Math.atan2(Math.sin(off), Math.cos(off))) < 0.5) {
      return ink(out, ...WEB, INK_GLASS, ".");
    }
    // Banded legs.
    if (onLimb(hind, HIND_RADII, u, av) || onLimb(front, FRONT_RADII, u, av)) {
      return frac(seg.t * 4.5) < 0.3 ? ink(out, ...BAND, INK_DARK) : ink(out, ...LEG, INK_LIT);
    }
    return false;
  }, { light: 1 + 0.15 * h });

  // Eyes: exactly one cell each, so the pair always matches however the frog turns.
  for (const side of [-1, 1]) {
    pen.toWorld(pose, EYE[0], EYE[1] * side, at);
    if (blinking) pen.spot(at.x, at.y, "-", LID, SKIN, f.depth);
    else pen.spot(at.x, at.y, "●", PUPIL, EYE_WHITE, f.depth);
  }
}
