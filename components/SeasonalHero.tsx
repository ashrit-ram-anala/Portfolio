"use client";

import { useEffect, useRef } from "react";
import { currentSeason, type Season } from "@/lib/seasons";

type Perch = { x: number; y: number; amount: number; refill: number };
type Flake = { x: number; y: number; vx: number; vy: number; seed: number; age: number; loose: boolean };

/** Sparse weather and letter-top deposits share one paused, low-resolution canvas. */
export function SeasonalHero() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current, sky = canvas?.parentElement;
    const name = sky?.querySelector<HTMLElement>(".name");
    if (!canvas || !sky || !name) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let season: Season = currentSeason();
    let width = 0, height = 0, perches: Perch[] = [], flakes: Flake[] = [];
    let clouds: { x: number; y: number; width: number }[] = [];
    let frame = 0, last = 0, elapsed = 0, spawn = 0, visible = false, disposed = false;
    const resize = () => {
      const box = sky.getBoundingClientRect();
      width = sky.clientWidth; height = sky.clientHeight;
      canvas.width = width; canvas.height = height;
      season = currentSeason();
      const mask = document.createElement("canvas");mask.width = width;mask.height = height;
      const ink = mask.getContext("2d", { willReadFrequently: true });
      if (!ink) return;
      const style = getComputedStyle(name);
      ink.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      ink.fillStyle = "#fff";
      const text = name.firstChild;
      if (text?.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        const content = text.textContent ?? "";
        for (let i = 0; i < content.length; i++) {
          range.setStart(text, i);range.setEnd(text, i + 1);
          const r = range.getBoundingClientRect();
          const metrics = ink.measureText(content[i]);
          ink.fillText(content[i], r.left - box.left, r.bottom - box.top - metrics.fontBoundingBoxDescent);
        }
      }
      const pixels = ink.getImageData(0, 0, width, height).data;
      perches = [];
      for (let x = 0; x < width; x += 2) {
        for (let y = 0; y < height; y++) {
          if (pixels[(y * width + x) * 4 + 3] > 110) {
            perches.push({ x, y, amount: season === "winter" ? 3 + Math.sin(x * .035) * .4 : Math.random() < .05 ? 1 : 0, refill: season === "winter" ? 0 : elapsed + 5 + Math.random() * 6 });
            break;
          }
        }
      }
      if (season === "winter") {
        const roof = perches;
        perches = roof.filter((p, i) => {
          const left = roof[i - 1], right = roof[i + 1];
          // Snow rests on shallow upper ledges, not the steep sides of A's and stems.
          return !!left && !!right && p.x - left.x <= 2 && right.x - p.x <= 2
            && Math.abs(p.y - left.y) <= 2 && Math.abs(right.y - p.y) <= 2;
        });
      }
      clouds = Array.from(sky.querySelectorAll(".sky-clouds span"), el => {
        const r = el.getBoundingClientRect();
        return { x: r.left - box.left, y: r.bottom - box.top - 3, width: r.width };
      });
      flakes = [];
    };
    const piece = (x: number, y: number, seed: number, size = 1) => {
      const px = Math.round(x / 2) * 2, py = Math.round(y / 2) * 2;
      ctx.fillStyle = season === "winter" ? "#f8fcff" : season === "spring" ? (seed > .5 ? "#f3b9ca" : "#f9d9df") : (seed > .5 ? "#bb6137" : "#d7a24a");
      if (season === "winter") { ctx.fillRect(px, py, size > 2 ? 4 : 2, size); return; }
      ctx.save();ctx.translate(px, py);ctx.rotate(Math.sin(seed * 20 + elapsed * 1.2) * .7);
      ctx.fillRect(-2, -2, 6, 4);ctx.fillRect(0, -4, 2, 8);
      if (season === "fall") {ctx.fillStyle = "#8c653b";ctx.fillRect(0, 3, 1, 4);}
      ctx.restore();
    };
    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      if (season === "summer") return;
      elapsed += dt;spawn += dt;
      const winter = season === "winter";
      for (let i = 0; i < perches.length; i++) {
        const p = perches[i];
        if (!winter && p.refill && elapsed > p.refill) {
          if (p.amount > .1 && !reduced.matches) flakes.push({ x:p.x, y:p.y-2, vx:5+Math.random()*8, vy:3, seed:i*.17%1, age:0, loose:true });
          p.amount = 0;p.refill = 0;
        }
        if (p.amount > .1) {
          if (winter) {
            const depth = Math.max(2, Math.round(p.amount / 2) * 2);
            const y = Math.round(p.y / 2) * 2;
            ctx.fillStyle = "#d6e5ed";
            ctx.fillRect(p.x - 1, y - 1, 4, 2);
            ctx.fillStyle = "#f8fcff";
            ctx.fillRect(p.x - 1, y - depth, 4, depth);
          } else piece(p.x, p.y - 1, i * .17);
        }
      }
      if (!reduced.matches && spawn > (winter ? .12 : 1.1)) {
        spawn = 0;
        const cloud = clouds[Math.floor(Math.random() * clouds.length)];
        const x = winter && cloud ? cloud.x + Math.random() * cloud.width : Math.random() * width;
        const y = winter && cloud ? cloud.y : -10;
        flakes.push({ x, y, vx: 3 + Math.random() * 6, vy: winter ? 15 + Math.random() * 14 : 18 + Math.random() * 10, seed: Math.random(), age: 0, loose: false });
      }
      for (const f of flakes) {
        const oldY = f.y;f.age += dt;
        f.x += (f.vx + Math.sin(elapsed * .9 + f.seed * 30) * (winter ? 5 : 12)) * dt;
        f.y += f.vy * dt;
        if (f.loose) { f.vy += dt * 65;f.vx *= Math.exp(-dt * .3); }
        if (!f.loose) {
          const p = perches.find(p => Math.abs(p.x - f.x) < 4 && oldY <= p.y && f.y >= p.y);
          if (p) {
            if (winter) {
              // A landing flake spreads into a small connected patch along its ledge.
              for (const neighbour of perches) {
                const distance = Math.abs(neighbour.x - p.x);
                if (distance <= 7 && Math.abs(neighbour.y - p.y) <= 4) {
                  neighbour.amount = Math.min(6, neighbour.amount + (distance <= 3 ? 2 : 1));
                }
              }
            } else p.amount = 1;
            p.refill = elapsed + 5 + f.seed * 5;f.age = 99;
          }
        }
        ctx.globalAlpha = Math.min(1, (height - f.y) / 60, f.loose ? Math.max(0, 1 - f.age / 2.2) : .8);
        piece(f.x, f.y, f.seed, winter ? 2 : 1);
      }
      flakes = flakes.filter(f => f.age < (f.loose ? 2.2 : 90) && f.y < height && f.x > -30 && f.x < width + 30).slice(-140);
      ctx.globalAlpha = 1;
    };
    const tick = (now: number) => {
      if (!last || now - last >= 40) { const dt = last ? Math.min(.08, (now - last) / 1000) : 0;last = now;draw(dt); }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {cancelAnimationFrame(frame);last = 0;draw(0);if (visible && !reduced.matches) frame = requestAnimationFrame(tick);};
    const pointer = (e: PointerEvent) => {
      if (reduced.matches || season === "summer") return;
      const r = sky.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      for (const p of perches) {
        if (p.amount > .1 && Math.hypot(p.x - x, p.y - y) < 25) {
          for (let i = 0; i < (season === "winter" ? 2 : 1); i++) flakes.push({ x:p.x, y:p.y-3, vx:(p.x-x)*2+(Math.random()-.5)*25, vy:-12-Math.random()*20, seed:Math.random(), age:0, loose:true });
          p.amount = 0;p.refill = elapsed + 10;
        }
      }
    };
    const seasonChanges = new MutationObserver(() => {
      if (season !== currentSeason()) {resize();sync();}
    });
    seasonChanges.observe(document.documentElement, { attributes:true, attributeFilter:["data-ocean-season"] });
    const sizes = new ResizeObserver(() => {resize();draw(0);});sizes.observe(sky);sizes.observe(name);
    const observer = new IntersectionObserver(([e]) => {visible = e.isIntersecting;sync();});observer.observe(sky);
    reduced.addEventListener("change", sync);window.addEventListener("pointermove", pointer, { passive:true });
    document.fonts.ready.then(() => {if (!disposed) {resize();draw(0);}});
    resize();
    return () => {disposed = true;seasonChanges.disconnect();cancelAnimationFrame(frame);sizes.disconnect();observer.disconnect();reduced.removeEventListener("change", sync);window.removeEventListener("pointermove", pointer);};
  }, []);
  return <canvas ref={ref} className="seasonal-hero" aria-hidden="true" />;
}
