"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

const NOTES = {
  car: { label: "Formula 1 car", text: "I love watching f1 on Sundays" },
  "black-hole": { label: "Black hole", text: "Deep space is something I find interesting" },
  paddle: { label: "Ping-pong paddle", text: "I play ping pong recreationally" },
  monster: { label: "Monster sword", text: "Monster is my favorite show" },
  hat: { label: "Oppenheimer’s hat", text: "Oppenheimer is my favorite biopic" },
} as const;

export type Interest = keyof typeof NOTES;
export type InterestTarget = { id: Interest; x: number; y: number; width: number; height: number };

export function placeInterestTargets(host: HTMLDivElement | null, targets: InterestTarget[]) {
  if (!host) return;
  for (const button of Array.from(host.querySelectorAll<HTMLButtonElement>("[data-interest]"))) {
    const target = targets.find(candidate => candidate.id === button.dataset.interest);
    if (!target) {
      if (!button.hidden) {
        button.hidden = true;
        button.dispatchEvent(new Event("interest-lost"));
      }
      continue;
    }
    button.style.left = `${Math.round(target.x)}px`;
    button.style.top = `${Math.round(target.y)}px`;
    button.style.width = `${Math.round(target.width)}px`;
    button.style.height = `${Math.round(target.height)}px`;
    button.hidden = false;
  }
}

function TypedNote({ text }: { text: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length);
      return;
    }
    let pos = 0;
    const timer = window.setInterval(() => {
      setCount(++pos);
      if (pos >= text.length) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [text]);
  return <span aria-hidden="true">{text.slice(0, count)}{count < text.length && <span className="interest-cursor">▌</span>}</span>;
}

function InterestButton({ name }: { name: Interest }) {
  const button = useRef<HTMLButtonElement>(null);
  const linger = useRef(0);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [pinned, setPinned] = useState(false);
  const note = NOTES[name];
  const open = hover || focus || pinned;
  const id = `interest-note-${name}`;

  useEffect(() => {
    const target = button.current;
    if (!target) return;
    const close = () => {
      clearTimeout(linger.current);
      setHover(false);
      setFocus(false);
      setPinned(false);
    };
    target.addEventListener("interest-lost", close);
    return () => {
      clearTimeout(linger.current);
      target.removeEventListener("interest-lost", close);
    };
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const target = button.current;
    const bubble = target?.querySelector<HTMLElement>(".interest-bubble");
    if (!target || !bubble) return;

    const orient = () => {
      const r = target.getBoundingClientRect();
      const half = bubble.offsetWidth / 2;
      const middle = r.left + r.width / 2;
      const safe = Math.max(half + 10, Math.min(window.innerWidth - half - 10, middle));
      target.style.setProperty("--note-shift", `${safe - middle}px`);
      target.dataset.noteBelow = String(r.top < 92);
    };
    const measure = new ResizeObserver(orient);
    measure.observe(bubble);
    orient();
    return () => measure.disconnect();
  }, [open]);

  return (
    <button ref={button} type="button" className="interest-target" data-interest={name} aria-label={note.label} aria-describedby={open ? id : undefined} hidden
      onPointerEnter={e => {
        if (e.pointerType !== "mouse") return;
        clearTimeout(linger.current);
        setHover(true);
      }}
      onPointerLeave={() => {
        if (name === "car" || name === "black-hole") {
          linger.current = window.setTimeout(() => setHover(false), 1450);
        } else setHover(false);
      }}
      onFocus={e => {
        if (!e.currentTarget.matches(":focus-visible")) return;
        setFocus(true);
      }}
      onBlur={() => { setFocus(false); setPinned(false); }}
      onClick={() => setPinned(value => !value)}
      onKeyDown={e => {
        if (e.key === "Escape") {
          clearTimeout(linger.current);
          setHover(false);
          setFocus(false);
          setPinned(false);
        }
      }}
    >
      {open && <span className="interest-bubble" role="tooltip" id={id}>
        <span className="interest-sr">{note.text}</span>
        <span className="interest-measure" aria-hidden="true">{note.text}▌</span>
        <TypedNote text={note.text} />
      </span>}
    </button>
  );
}

export function InterestNotes({ host, names }: { host: RefObject<HTMLDivElement | null>; names: Interest[] }) {
  return <div className="interest-targets" ref={host}>
    {names.map(name => <InterestButton name={name} key={name} />)}
  </div>;
}
