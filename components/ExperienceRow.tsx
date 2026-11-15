import type { CSSProperties } from "react";
import type { Experience } from "./data";
import { Logo } from "./Logo";

export function ExperienceRow({ e }: { e: Experience }) {
  return (
    <li className="xp water-glass" data-wildlife-glass>
      <div className="xp-layer">
        <span className="xp-logo-set" data-brand={e.logo} style={{ "--brand": e.team } as CSSProperties} aria-hidden="true">
          <Logo name={e.logo} layer="base" className="xp-logo" />
          <Logo name={e.logo} layer={e.fill === "contain" ? "themed" : "base"} fill={e.fill} className="xp-logo xp-logo-color" />
        </span>
        <div className="xp-text">
          <p className="xp-co">{e.company}</p>
          <p className="xp-role">{e.role}</p>
        </div>
        <span className="xp-year">{e.year}</span>
      </div>
    </li>
  );
}
