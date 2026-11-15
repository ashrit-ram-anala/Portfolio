"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

function lineOutline(length: number) {
  // Step the line a pixel at a time, returning it to the hook's eye at the end.
  const offsets = [0, 0, 1, 1, 0, 0, -1, -1];
  const points = [{ x: 4, y: 0 }];
  for (let y = 0; y < length - 14; y += 19) {
    const x = 4 + offsets[(y / 19) % offsets.length];
    const end = Math.min(y + 19, length - 14);
    points.push({ x, y }, { x, y: end });
  }
  points.push({ x: 4, y: Math.max(0, length - 14) }, { x: 4, y: length });

  const left = points.map(({ x, y }) => `${x}px ${y}px`);
  const right = points.reverse().map(({ x, y }) => `${x + 2}px ${y}px`);
  return `polygon(${[...left, ...right].join(",")})`;
}

export function Scrollbar() {
  const bar = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const track = bar.current;
    const hook = thumb.current;
    const cord = line.current;
    if (!track || !hook || !cord) return;

    const doc = document.documentElement;
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
    const limit = () => Math.max(0, doc.scrollHeight - window.innerHeight);
    const travel = () => Math.max(1, track.clientHeight - hook.offsetHeight);

    const update = () => {
      const max = limit();
      track.toggleAttribute("data-ready", desktop.matches && max > 0);
      const progress = max ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const offset = Math.round(progress * travel());
      track.style.setProperty("--hook-y", `${offset}px`);
      cord.style.clipPath = lineOutline(offset + 8);
      hook.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };

    const scroll = (top: number) => {
      const y = Math.min(limit(), Math.max(0, top));
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
      update();
    };

    let drag: { pointer: number; y: number; scroll: number } | undefined;
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || !e.isPrimary) return;
      e.preventDefault();
      hook.focus({ preventScroll: true });
      drag = { pointer: e.pointerId, y: e.clientY, scroll: window.scrollY };
    };
    const onMove = (e: PointerEvent) => {
      if (drag?.pointer !== e.pointerId) return;
      if ((e.buttons & 1) === 0) {
        drag = undefined;
        return;
      }
      scroll(drag.scroll + (e.clientY - drag.y) * limit() / travel());
    };
    const onEnd = (e: PointerEvent) => {
      if (drag?.pointer === e.pointerId) drag = undefined;
    };
    const onKey = (e: KeyboardEvent) => {
      const y = window.scrollY;
      const page = window.innerHeight * .9;
      const targets: Record<string, number> = {
        ArrowUp: y - 40, ArrowDown: y + 40,
        PageUp: y - page, PageDown: y + page,
        Home: 0, End: limit(),
      };
      if (!Object.hasOwn(targets, e.key)) return;
      e.preventDefault();
      scroll(targets[e.key]);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(document.body);
    desktop.addEventListener("change", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    hook.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
    hook.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      hook.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
      hook.removeEventListener("keydown", onKey);
    };
  }, [lenis]);

  return (
    <div ref={bar} className="fishing-scrollbar">
      <div ref={line} className="fishing-line" aria-hidden="true" />
      <div
        ref={thumb}
        className="fishing-thumb"
        role="scrollbar"
        aria-label="Page scroll"
        aria-controls="top"
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        tabIndex={0}
      >
        <span className="fishing-hook" aria-hidden="true" />
      </div>
    </div>
  );
}
