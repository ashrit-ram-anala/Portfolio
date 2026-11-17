"use client";

import { useEffect, useRef } from "react";
import { AnimalEngine } from "@/lib/ascii-animals/engine";
import { CRAB_CANVAS_TOP, type CrabFootprint } from "@/lib/shoreline";
import type { CraneCargo } from "./CraneDrop";
import type { AnimalKey } from "@/lib/ascii-animals/animals";

const scenes = {
  butterflies: { count: 3, theme: "light", tuning: { size: 1.5, farthest: 0.58, fog: 0, speed: 0.62, trail: 0.18, direction: 0, spread: 0.32, alternateCourse: true, stayInBand: true } },
  cranes: { count: 3, theme: "light", tuning: { size: 1.24, speed: 0.93, direction: 180, spread: 0.20, fog: 0, stayInBand: true, foldFlap: true } },
  ducks: { count: 6, theme: "light", tuning: { size: 1.25, farthest: 0.62, detail: 2.1, trail: 0.55 } },
  koi: { count: 6, theme: "dark", tuning: { size: 1.8, sizeLimit: 105, detail: 2.1, direction: 24, spread: 0.22, alternateCourse: true, farthest: 0.65, fog: 0.16, speed: 0.92, trail: 0.28 } },
  jellyfish: { count: 6, theme: "dark", tuning: { size: 1.26, sizeLimit: 105, speed: 0.57, direction: 34, spread: 0.24, alternateCourse: true, ambientGlow: 0.38 } },
  crabs: { count: 5, theme: "light", tuning: { size: 1.25, speed: 0.66, walksNearSurf: true } },
} as const;

export function Wildlife({ animal }: { animal: keyof typeof scenes & AnimalKey }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvas.current) return;
    const { tuning, ...settings } = scenes[animal];
    const habitat = canvas.current.parentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onFootprint = animal === "crabs" ? (x: number, y: number) => {
      if (!reduced.matches) habitat?.dispatchEvent(new CustomEvent<CrabFootprint>("crab-footprint", {
        detail: { x, y: y + CRAB_CANVAS_TOP },
      }));
    } : undefined;
    const current = new AnimalEngine(canvas.current, {
      ...settings,
      animal,
      interactionGroup: habitat ?? undefined,
      onFootprint,
      tuning: { grid: 0, trail: 0.45, ...tuning },
    });
    if (animal === "cranes") {
      const surface = habitat?.closest(".surface-world");
      let timer = 0;
      const queue = () => {
        current.queueCraneCarrier(carrier => {
          surface?.dispatchEvent(new CustomEvent<CraneCargo>("crane-cargo", { detail: { carrier } }));
          timer = window.setTimeout(queue, 18000 + Math.random() * 13000);
        });
      };
      timer = window.setTimeout(queue, 7000 + Math.random() * 6500);
      return () => {
        clearTimeout(timer);
        current.destroy();
      };
    }
    if (animal !== "jellyfish") return () => current.destroy();

    const adjustGlow = () => {
      const start = habitat?.getBoundingClientRect().top ?? 0;
      const depth = Math.max(0, Math.min(1, (window.innerHeight * .6 - start) / window.innerHeight));
      const pulse = Math.round((1.36 + depth * .94) * 20) / 20;
      if (current.tuning.pulseGlow !== pulse) current.set("pulseGlow", pulse);
    };
    adjustGlow();
    window.addEventListener("scroll", adjustGlow, { passive: true });
    window.addEventListener("resize", adjustGlow);
    return () => {
      window.removeEventListener("scroll", adjustGlow);
      window.removeEventListener("resize", adjustGlow);
      current.destroy();
    };
  }, [animal]);

  return <canvas ref={canvas} className="wildlife" data-animal={animal} aria-hidden="true" />;
}
