"use client";

import { useEffect, useRef } from "react";

type Painter = (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, tint: string) => void;

export function LandscapeCanvas({ className, paint, tintProperty, animate = true }: {
  className: string;
  paint: Painter;
  tintProperty?: string;
  animate?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const ctx = element?.getContext("2d");
    if (!element || !ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;
    let width = 0;
    let height = 0;
    let last = 0;
    let time = 0;
    let tint = "";

    const draw = () => {
      if (!width || !height) return;
      ctx.save();
      paint(ctx, width, height, time, tint);
      ctx.restore();
    };
    const tick = (now: number) => {
      if (!last || now - last >= 40) {
        if (last) time += Math.min(now - last, 100) / 1000;
        last = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    const syncMotion = () => {
      cancelAnimationFrame(frame);
      last = 0;
      draw();
      if (animate && visible && !motion.matches) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      width = element.clientWidth;
      height = element.clientHeight;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      element.width = Math.round(width * dpr);
      element.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tint = tintProperty ? getComputedStyle(element).getPropertyValue(tintProperty).trim() : "";
      draw();
    };

    const seasonChanges = new MutationObserver(draw);
    seasonChanges.observe(document.documentElement, { attributes:true, attributeFilter:["data-ocean-season"] });
    const sizes = new ResizeObserver(resize);
    sizes.observe(element);
    const viewport = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncMotion();
    });
    viewport.observe(element);
    motion.addEventListener("change", syncMotion);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      seasonChanges.disconnect();
      sizes.disconnect();
      viewport.disconnect();
      motion.removeEventListener("change", syncMotion);
    };
  }, [animate, paint, tintProperty]);

  return <canvas ref={canvas} className={className} aria-hidden="true" />;
}
