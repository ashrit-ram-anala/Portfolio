import { SHARED_TUNING, type Animal, type Creature } from "../flock";
import { INK_DARK, INK_SHIMMER, ink, type RGB } from "../ink";
import { rand } from "../math";
import { inEllipse } from "./shapes";

interface Duck extends Creature {
  pace: number;
  escapeHeading: number;
}

const HEAD: RGB = [32, 113, 77];
const BILL: RGB = [233, 175, 47];
const COLLAR: RGB = [246, 240, 217];
const CHEST: RGB = [130, 76, 53];
const WING: RGB = [157, 152, 130];
const TAIL: RGB = [78, 80, 71];
const PATCH: RGB = [61, 93, 154];
const WAKE: RGB = [184, 221, 209];
const at = { x: 0, y: 0 };

export const ducks: Animal<Duck> = {
  key: "ducks",
  label: "Mallard",
  swatch: HEAD,
  defaults: {
    ...SHARED_TUNING,
    direction: 0,
    spread: .24,
    grip: 1.8,
    fog: .1,
    separation: 380,
    stayInBand: true,
    alternateCourse: true,
    sizeLimit: 105,
  },
  controls: [],
  area: 96000,
  scale: 1.28,
  speed: 36,
  trail: { light: WAKE, dark: WAKE },

  create: (c) => ({ ...c, pace: rand(.8, 1.18), escapeHeading: 0 }),

  update(d, flock, dt) {
    const startled = flock.time < d.startledUntil;
    const course = flock.headingFor(d) + d.bias * flock.tuning.spread;
    const weave = .2 * Math.sin(flock.time * .7 + d.id * 2);
    const speed = flock.cruise(d) * d.pace * (startled ? 3 : 1);
    flock.begin();
    flock.steer(d, startled ? d.escapeHeading : course + weave, speed, startled ? 5 : 1.8);
    flock.separate(d, flock.tuning.separation, .55);
    const moved = flock.move(d, dt, speed * 1.45);
    if (flock.passed(d)) flock.reenter(d);
    if (moved > 2) flock.face(d, dt, startled ? 7 : 2.8);
  },

  startle(d, dx, dy, strength, flock) {
    d.escapeHeading = Math.atan2(dy, dx);
    d.startledUntil = flock.time + .8 + strength * .55;
    flock.events.push({ x: d.x, y: d.y, radius: 3, amount: .6 });
  },

  draw(d, pen, flock) {
    const pose = { x: d.x, y: d.y, heading: d.heading, span: d.span, depth: d.depth, id: d.id };
    const stroke = (pen.t * (flock.time < d.startledUntil ? 2 : 1.1) + d.id * .37) % 1;
    for (const side of [-1, 1]) {
      for (let ripple = 0; ripple < 3; ripple++) {
        const travel = (ripple + stroke) / 3;
        pen.toWorld(pose, -.33 - travel * .51, side * (.12 + travel * .21), at);
        pen.dot(at.x, at.y, ripple % 2 ? "~" : "-", WAKE, d.depth, .14 + travel * .58);
      }
    }
    pen.toWorld(pose, -.35, 0, at);
    pen.shed(at.x, at.y, .23 * d.depth);

    pen.shape(pose, .68, (u, v) => {
      const out = pen.ink;
      if (inEllipse(u, v, .465, -.075, .115, .044)) return ink(out, ...BILL, undefined, "-=+");
      if (inEllipse(u, v, .31, -.065, .136, .108)) return ink(out, ...HEAD, INK_SHIMMER);
      if (inEllipse(u, v, .19, -.04, .091, .107)) return ink(out, ...COLLAR);
      if (u < -.16 && u > -.5 && Math.abs(v) < .065 + (u + .5) * .33) return ink(out, ...TAIL, INK_DARK);
      if (!inEllipse(u, v, -.085, 0, .324, .167)) return false;
      if (u > .075) return ink(out, ...CHEST, undefined, ".:*");
      if (inEllipse(u, v, -.185, .085, .117, .043)) return ink(out, ...PATCH, INK_SHIMMER);
      const light = 1 + .11 * Math.max(0, 1 - Math.abs(v + .035) * 7);
      return ink(out, WING[0] * light, WING[1] * light, WING[2] * light, undefined, ".;=:");
    });

    pen.toWorld(pose, .345, -.099, at);
    pen.spot(at.x, at.y, ".", [246, 235, 206], [31, 60, 45], d.depth);
  },
};
