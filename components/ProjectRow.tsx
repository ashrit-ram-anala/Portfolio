"use client";

import type { Project } from "./data";
import { useTilt } from "./useTilt";

/** A project card with a screenshot preview that tilts toward the pointer. */
export function ProjectRow({ p }: { p: Project }) {
  const { ref, onPointerMove, reset } = useTilt<HTMLAnchorElement>({ x: 6, y: 2.5 });

  return (
    <li>
      <a className="water-glass" ref={ref} href={p.href} target="_blank" rel="noreferrer" onPointerMove={onPointerMove} onPointerLeave={reset}>
        <span className="proj-main">
          <span className="proj-name">{p.name}</span>
          <span className="proj-context">{p.context}</span>
          <span className="proj-stack">{p.stack.join(" · ")}</span>
        </span>
        <span className="proj-year">{p.year}</span>
        <span className="proj-arrow" aria-hidden="true">
          ↗
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="proj-shot" src={`/projects/${p.shot}.jpg`} alt="" loading="lazy" />
      </a>
    </li>
  );
}
