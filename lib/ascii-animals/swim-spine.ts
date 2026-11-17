import { angleDiff, clamp } from "./math";

export const SWIM_NODES = 14;

export function alignSwimSpine(nodes: Float32Array, x: number, y: number, heading: number, length: number) {
  const segment = length / (SWIM_NODES - 1);
  for (let i = 0; i < SWIM_NODES; i++) {
    nodes[i * 2] = x - Math.cos(heading) * segment * i;
    nodes[i * 2 + 1] = y - Math.sin(heading) * segment * i;
  }
}

export function followSwimSpine(nodes: Float32Array, x: number, y: number, heading: number, length: number) {
  const segment = length / (SWIM_NODES - 1);
  nodes[0] = x;
  nodes[1] = y;
  let previous = heading + Math.PI;
  for (let i = 1; i < SWIM_NODES; i++) {
    const angle = Math.atan2(nodes[i * 2 + 1] - nodes[i * 2 - 1], nodes[i * 2] - nodes[i * 2 - 2]);
    previous += clamp(angleDiff(previous, angle), -.22, .22);
    nodes[i * 2] = nodes[i * 2 - 2] + Math.cos(previous) * segment;
    nodes[i * 2 + 1] = nodes[i * 2 - 1] + Math.sin(previous) * segment;
  }
}

export function swimTailPhase(phase: number, dt: number, speed: number, tailBeat: number) {
  return phase + dt * (2 + speed / 25) * tailBeat;
}

export function waveSwimSpine(nodes: Float32Array, spine: Float32Array, length: number, phase: number, tailBeat: number) {
  for (let i = 0; i < SWIM_NODES; i++) {
    const distance = i / (SWIM_NODES - 1);
    const a = Math.max(0, i - 1);
    const b = Math.min(SWIM_NODES - 1, i + 1);
    const dx = nodes[a * 2] - nodes[b * 2];
    const dy = nodes[a * 2 + 1] - nodes[b * 2 + 1];
    const tangent = Math.hypot(dx, dy) || 1;
    const wave = length * .06 * distance ** 1.6 * Math.sin(phase - distance * 4.5) * Math.min(1.5, tailBeat);
    spine[i * 2] = nodes[i * 2] - dy / tangent * wave;
    spine[i * 2 + 1] = nodes[i * 2 + 1] + dx / tangent * wave;
  }
}
