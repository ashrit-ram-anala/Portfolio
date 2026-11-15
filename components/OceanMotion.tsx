"use client";

import { useEffect, useRef } from "react";
import { AnimalEngine } from "@/lib/ascii-animals/engine";
import type { AnimalKey } from "@/lib/ascii-animals/animals";

const scenes = {
  butterflies: { count: 3, theme: "light", tuning: { size: 1.5, farthest: 0.58, fog: 0, speed: 0.62, trail: 0.18, direction: 0, spread: 0.32, alternateCourse: true, stayInBand: true } },
  cranes: { count: 3, theme: "light", tuning: { size: 1.24, speed: 0.93, direction: 180, spread: 0.20, fog: 0, stayInBand: true, foldFlap: true } },
  ducks: { count: 6, theme: "light", tuning: { size: 1.25, farthest: 0.62, detail: 2.1, trail: 0.55 } },
  koi: { count: 6, theme: "dark", tuning: { size: 1.8, sizeLimit: 105, detail: 2.1, direction: 24, spread: 0.22, alternateCourse: true, farthest: 0.65, fog: 0.16, speed: 0.92, trail: 0.28 } },
  jellyfish: { count: 6, theme: "dark", tuning: { size: 1.26, sizeLimit: 105, speed: 0.57, direction: 34, spread: 0.24, alternateCourse: true } },
  crabs: { count: 5, theme: "light", tuning: { size: 1.25, speed: 0.66 } },
} as const;

export function Wildlife({ animal }: { animal: keyof typeof scenes & AnimalKey }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvas.current) return;
    const { tuning, ...settings } = scenes[animal];
    const current = new AnimalEngine(canvas.current, {
      ...settings,
      animal,
      interactionGroup: canvas.current.parentElement ?? undefined,
      tuning: { grid: 0, trail: 0.45, ...tuning },
    });
    return () => current.destroy();
  }, [animal]);

  return <canvas ref={canvas} className="wildlife" data-animal={animal} aria-hidden="true" />;
}
