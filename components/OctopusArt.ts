const WIDTH = 186;
const HEIGHT = 112;
const CELL = 5;
const ROW = 6;

function texture(x: number, y: number) {
  const value = Math.sin(127.1 * x + 311.7 * y) * 43758.5;
  return value - Math.floor(value);
}

function prepare(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.scale(width / WIDTH, height / HEIGHT);
  ctx.font = "bold 6px Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
}

function cell(ctx: CanvasRenderingContext2D, x: number, y: number, tile: string, ink: string, glyph: string) {
  ctx.fillStyle = tile;
  ctx.fillRect(x, y, CELL - 1, ROW - 1);
  ctx.fillStyle = ink;
  ctx.fillText(glyph, x + 2, y + 3);
}

export function paintRock(ctx: CanvasRenderingContext2D, width: number, height: number) {
  prepare(ctx, width, height);
  for (let y = 60; y <= 102; y += ROW) {
    for (let x = 30; x <= 155; x += CELL) {
      const u = (x - 93) / 65;
      const v = (102 - y) / 46;
      const edge = Math.abs(u + v * .13) + v * .73;
      if (edge > 1.01 - (x > 120 ? .035 : 0)) continue;
      const face = u < -.42 + v * .42 ? 1 : u > .29 - v * .28 ? 0 : 2;
      const shade = v > .65 && face > 0 ? 3 : face;
      ctx.fillStyle = ["#334c5c", "#496572", "#587681", "#748f95"][shade];
      ctx.fillRect(x, y, CELL, ROW);
    }
  }

  ctx.restore();
}

function drawHead(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.translate(93, 58);
  ctx.scale(.82, .82);
  ctx.translate(-93, -58);
  for (let y = 31; y <= 85; y += ROW) {
    for (let x = 60; x <= 125; x += CELL) {
      const u = (x - 93) / 34;
      const v = (y - 58) / 29;
      const form = Math.pow(Math.abs(u), 2.35) + Math.pow(Math.abs(v), 2.3);
      if (form > 1 || (v > .58 && Math.abs(u) > .69)) continue;
      const grain = texture(x, y);
      const light = 1 - form * .5 - v * .23 - u * .13 + grain * .16;
      const i = light > .91 ? 2 : light > .63 ? 1 : 0;
      const skin = ["#824b73", "#b96d93", "#d992a8"][i];
      const sample = ["#c88caa", "#f6bdca", "#ffdcd5"][i];
      cell(ctx, x, y, skin, sample, (v < -.25 ? "+.*:" : ".;:=+")[Math.floor(grain * (v < -.25 ? 4 : 5))]);
    }
  }
  cell(ctx, 75, 61, "#f7d9ca", "#4a3050", "o");
  cell(ctx, 105, 61, "#f7d9ca", "#4a3050", "o");
  cell(ctx, 90, 73, "#9f587e", "#efbaca", "w");
  ctx.restore();
}

export function paintHead(ctx: CanvasRenderingContext2D, width: number, height: number) {
  prepare(ctx, width, height);
  drawHead(ctx);
  ctx.restore();
}

type Point = { x: number; y: number };
type Rim = { left: number; right: number; top: number; bottom: number };
type Stop = Point & { at: number };
export type OctopusScene = { home: Point; rims: Rim[]; scale: number; origin: Point };
const ROUTES = ["top-edge", "right-corner", "lower-edge"] as const;
type Route = typeof ROUTES[number];
export type OctopusTrip = { route: Route; path: Stop[]; born: number; duration: number; returnAt?: number };

export function measureOctopusScene(art: HTMLCanvasElement, rock: HTMLElement, cards: HTMLElement[]): OctopusScene {
  const bounds = art.getBoundingClientRect();
  const den = rock.getBoundingClientRect();
  const home = { x: den.left + den.width * .5 - bounds.left, y: den.top + den.height * .8 - bounds.top };
  const rims = cards.map(card => {
    const r = card.getBoundingClientRect();
    return { left: r.left - bounds.left, right: r.right - bounds.left, top: r.top - bounds.top, bottom: r.bottom - bounds.top };
  });
  return { home, rims, scale: den.width / WIDTH, origin: { x: art.offsetLeft, y: art.offsetTop } };
}

export function planTrip({ home, rims }: OctopusScene, previous?: Route): OctopusTrip {
  const first = rims[0];
  const available = ROUTES.filter(route => route !== previous);
  const route = available[Math.floor(Math.random() * available.length)];
  const edge = first.right - (first.right - first.left < 590 ? 18 : 8);
  const top = first.top - 3;
  const width = first.right - first.left;
  const drop = Math.min(54, (first.bottom - first.top) * (.48 + Math.random() * .2));
  const topReach = Math.min(width * .26, 108) * (.75 + Math.random() * .25);
  const bottomReach = 28 + Math.random() * 20;
  const corner = { x: edge - 8, y: top };
  const side = { x: edge, y: top + 8 };
  const routes: Record<Route, Point[]> = {
    "top-edge": [
      { x: Math.max(first.left + 14, home.x - topReach), y: top },
      { x: Math.max(first.left + 20, home.x - topReach + 6), y: top + 5 },
    ],
    "right-corner": [
      corner, side,
      { x: edge, y: top + drop },
      { x: edge - 4, y: top + drop - 5 },
      side, corner,
    ],
    "lower-edge": [
      corner, side,
      { x: edge, y: first.bottom - 9 },
      { x: edge - 8, y: first.bottom + 1 },
      { x: edge - bottomReach, y: first.bottom + 1 },
      { x: edge - 8, y: first.bottom - 3 },
      { x: edge, y: first.bottom - 11 },
      side, corner,
    ],
  };
  const landing = { x: home.x, y: top };
  const points = [home, landing, ...routes[route], landing, home];

  const distance = points.slice(1).reduce((total, point, i) => (
    total + Math.hypot(point.x - points[i].x, point.y - points[i].y)
  ), 0);
  const speed = Math.max(39 + Math.random() * 9, distance / 8.5);
  let at = 0;
  const path = points.map((point, i) => {
    if (i) at += Math.max(.18, Math.hypot(point.x - points[i - 1].x, point.y - points[i - 1].y) / speed);
    return { ...point, at };
  });
  return { route, path, born: performance.now(), duration: at };
}

function bodyAt(path: Stop[], time: number): Point {
  const index = path.findIndex(stop => stop.at >= time);
  if (index <= 0) return index === 0 ? path[0] : path[path.length - 1];
  const from = path[index - 1];
  const to = path[index];
  const p = (time - from.at) / (to.at - from.at);
  const smooth = p * .7 + p * p * (3 - 2 * p) * .3;
  return { x: from.x + (to.x - from.x) * smooth, y: from.y + (to.y - from.y) * smooth };
}

export function returnToDen(trip: OctopusTrip): OctopusTrip {
  if (trip.returnAt !== undefined) return trip;
  const time = Math.max(0, Math.min(trip.duration, (performance.now() - trip.born) / 1000));
  const past = trip.path.filter(stop => stop.at < time);
  const current = bodyAt(trip.path, time);
  const back = [...past].reverse();
  const ahead = trip.path.filter(stop => stop.at > time);
  const length = (stops: Point[]) => stops.reduce((total, stop, i) => {
    const previous = i ? stops[i - 1] : current;
    return total + Math.hypot(stop.x - previous.x, stop.y - previous.y);
  }, 0);
  const route = back.length && length(back) < length(ahead) ? back : ahead;
  let at = time;
  let from = current;
  const retreat = route.map(stop => {
    at += Math.max(.11, Math.hypot(stop.x - from.x, stop.y - from.y) / 92);
    from = stop;
    return { x: stop.x, y: stop.y, at };
  });
  return {
    ...trip, duration: at, returnAt: time,
    path: [...past, { ...current, at: time }, ...retreat],
  };
}

function gripAt(trip: OctopusTrip, scene: OctopusScene, time: number, angle: number): Point {
  const body = bodyAt(trip.path, time);
  const aim = { x: body.x + Math.cos(angle) * 46 * scene.scale, y: body.y + Math.sin(angle) * 42 * scene.scale };
  let best = 19 * scene.scale;
  let grip = aim;
  const consider = (x: number, y: number) => {
    const distance = Math.hypot(x - aim.x, y - aim.y);
    if (distance < best) {
      best = distance;
      grip = { x, y };
    }
  };
  for (const rim of scene.rims) {
    const y = Math.max(rim.top + 4, Math.min(rim.bottom - 4, aim.y));
    const x = Math.max(rim.left + 9, Math.min(rim.right - 9, aim.x));
    consider(rim.right - 2, y);
    consider(x, rim.top + 2);
    consider(x, rim.bottom - 2);
  }
  return grip;
}

function denTip(scene: OctopusScene, arm: number, time: number): Point {
  const lane = arm % 4;
  const side = arm < 4 ? 1 : -1;
  const x = [53, 69, 81, 65][lane];
  const y = [-32, -15, 7, 27][lane];
  return {
    x: scene.home.x + side * (x + Math.sin(time * 1.32 + arm) * 2.7) * scene.scale,
    y: scene.home.y + (y + Math.sin(time * 1.46 + arm * 1.8) * 2.3) * scene.scale,
  };
}

export function paintClimbingOctopus(
  ctx: CanvasRenderingContext2D, width: number, height: number,
  scene: OctopusScene | null, trip: OctopusTrip | null, ambient: number,
) {
  ctx.clearRect(0, 0, width, height);
  if (!scene) return;
  const time = trip ? Math.min(trip.duration, (performance.now() - trip.born) / 1000) : 0;
  const travel = trip ? Math.min(1, time / 1.15, (trip.duration - time) / 1.15) : 0;
  const blend = travel * travel * (3 - 2 * travel);
  const body = trip ? bodyAt(trip.path, time) : scene.home;
  const scale = scene.scale;
  const bob = Math.sin(time * 4) * 1.3 * blend;
  const cellStep = Math.max(3, Math.round(5 * scale));
  ctx.font = `bold ${Math.max(6, Math.round(7 * scale))}px Menlo, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < 8; i++) {
    const lane = i % 4;
    const fan = -.97 + lane * .65;
    const angle = i < 4 ? fan : Math.PI - fan;
    const den = denTip(scene, i, ambient);
    let lift = 0;
    let tip = den;

    if (trip && blend > 0) {
      const period = 1.05;
      const offset = i * .27;
      const startReturn = trip.returnAt ?? Infinity;
      const strideTime = time + Math.max(0, time - startReturn) * .8;
      const physicalTime = (t: number) => t <= startReturn ? t : startReturn + (t - startReturn) / 1.8;
      const stride = strideTime / period + offset;
      const stage = stride - Math.floor(stride);
      const base = (Math.floor(stride) - offset) * period;
      const from = gripAt(trip, scene, Math.max(0, physicalTime(base)), angle);
      const to = gripAt(trip, scene, Math.min(trip.duration, physicalTime(base + period)), angle);
      const reach = Math.max(0, (stage - .68) / .32);
      const glide = reach * reach * (3 - 2 * reach);
      lift = Math.sin(reach * Math.PI);
      const movingX = from.x + (to.x - from.x) * glide;
      const movingY = from.y + (to.y - from.y) * glide - 10 * scale * lift;
      tip = { x: den.x + (movingX - den.x) * blend, y: den.y + (movingY - den.y) * blend };
    }

    const root = {
      x: body.x + Math.cos(angle) * 18 * scale,
      y: body.y + bob + (Math.sin(angle) * 12 + 9) * scale,
    };
    const bend = (i % 2 ? -1 : 1) * (9 + Math.sin(ambient * 2 + i) * 2 + lift * 7) * scale;
    const seen = new Set<string>();
    for (let segment = 0; segment <= 26; segment++) {
      const d = segment / 26;
      const bow = Math.sin(d * Math.PI) * bend;
      const x = Math.round((root.x + (tip.x - root.x) * d - Math.sin(angle) * bow) / cellStep) * cellStep;
      const y = Math.round((root.y + (tip.y - root.y) * d + Math.cos(angle) * bow) / cellStep) * cellStep;
      const key = `${x},${y}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const sucker = d > .56;
      ctx.fillStyle = sucker ? "#ab678b" : "#795176";
      ctx.fillRect(x, y, cellStep - 1, cellStep);
      ctx.fillStyle = sucker ? "#f4c5ce" : "#dca6bf";
      ctx.fillText(sucker ? "o" : "~", x + cellStep / 2, y + cellStep * .58);
    }
  }

  if (trip && time < trip.duration) {
    ctx.save();
    ctx.translate(body.x, body.y + bob);
    ctx.scale(scale, scale);
    ctx.translate(-93, -58);
    drawHead(ctx);
    ctx.restore();
  }
  return trip && time < trip.duration ? body : undefined;
}
