export type LakeWhirlpool = {
  x: number;
  y: number;
  radius: number;
  born: number;
};

export const WHIRLPOOL_SECONDS = 7.4;
export const WATER_ASPECT = .55;

export function whirlpoolStrength(age: number) {
  if (age < 0 || age >= WHIRLPOOL_SECONDS) return 0;
  const fade = Math.max(0, Math.min(1, (WHIRLPOOL_SECONDS - age) / 2.1));
  return Math.min(1, age / .65) * fade * fade * (3 - 2 * fade);
}

export function whirlpoolCurrent(vortex: LakeWhirlpool, x: number, y: number, age: number) {
  const dx = x - vortex.x;
  const dy = (y - vortex.y) / WATER_ASPECT;
  const radius = Math.hypot(dx, dy);
  const pull = whirlpoolStrength(age) * Math.min(1, Math.max(0, (1 - radius / vortex.radius) * 2.8));
  if (!pull) return undefined;

  const r = Math.max(1, radius);
  const velocity = Math.min(172, 52 + radius * 2.5);
  const radial = Math.max(-58, Math.min(90, (radius - vortex.radius * .31) * 1.5));
  return {
    pull,
    vx: (-dy * velocity - dx * radial) / r,
    vy: (dx * velocity - dy * radial) / r * WATER_ASPECT,
  };
}
