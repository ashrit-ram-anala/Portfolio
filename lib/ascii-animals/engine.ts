import type { LakeWhirlpool } from "../whirlpool";
import { ANIMALS, type AnimalKey } from "./animals";
import { Flock, type Animal, type Tuning } from "./flock";
import { AsciiRenderer, type Theme } from "./renderer";

const STEP = 1 / 60;

/** A built-in animal by name, or any Animal definition. */
const resolve = (animal: AnimalKey | Animal<any>) => (typeof animal === "string" ? ANIMALS[animal] : animal);
const MAX_STEPS = 4;

/**
 * Wires a Flock + AsciiRenderer to a canvas: fixed-timestep loop, resize,
 * click-to-startle, switching animals, pausing off-screen, and
 * prefers-reduced-motion.
 */
export class AnimalEngine {
  /** The current animal's live knobs; change them through set() so resizes and repaints happen. */
  tuning: Tuning;
  animal: Animal<any>;
  private flock: Flock<any>;
  private renderer: AsciiRenderer;
  private count?: number;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private visible = true;
  private reducedMotion: MediaQueryList;
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private disposed = false;
  private interactionGroup?: HTMLElement;

  /** count pins the population; tuning overrides any of the animal's defaults. */
  constructor(
    private canvas: HTMLCanvasElement,
    {
      animal = "butterflies",
      count,
      theme = "light",
      tuning,
      interactionGroup,
      onFootprint,
    }: { animal?: AnimalKey | Animal<any>; count?: number; theme?: Theme; tuning?: Partial<Tuning>; interactionGroup?: HTMLElement; onFootprint?: (x: number, y: number) => void } = {},
  ) {
    this.count = count;
    this.interactionGroup = interactionGroup;
    this.animal = resolve(animal);
    this.tuning = { ...this.animal.defaults, ...tuning } as Tuning;
    this.flock = new Flock(this.animal, this.tuning, count);
    this.renderer = new AsciiRenderer(canvas, this.tuning);
    this.renderer.onFootprint = onFootprint;
    this.renderer.setFontFamily(getComputedStyle(canvas).fontFamily);
    this.renderer.setAnimal(this.animal, this.tuning);
    this.renderer.setTheme(theme);
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.schedule();
    });
    this.intersectionObserver.observe(canvas);

    this.reducedMotion.addEventListener("change", this.onMotionPreference);
    window.addEventListener("pointerdown", this.onPointerDown, { passive: true });

    this.resize();
    this.renderer.render(this.flock, STEP);
    // Canvas text can't trigger a webfont load; once the mono face is in, redraw.
    document.fonts?.load(`600 16px ${getComputedStyle(canvas).fontFamily}`).then(() => {
      if (!this.disposed && this.reducedMotion.matches) this.drawStill();
    });
    this.schedule();
  }

  queueCraneCarrier(onEntrance: (position: () => { x: number; y: number } | undefined) => void) {
    this.flock.onReenter = crane => {
      if (!this.visible || this.reducedMotion.matches || document.hidden) return;
      const rect = this.canvas.getBoundingClientRect();
      const y = rect.top + crane.y;
      if (crane.x < rect.width || y < 16 || y > window.innerHeight - 20) return;

      this.flock.onReenter = undefined;
      onEntrance(() => {
        const bounds = this.canvas.getBoundingClientRect();
        if (crane.gone || crane.x < 20 || crane.x > bounds.width + crane.span) return undefined;
        return { x: bounds.left + crane.x, y: bounds.top + crane.y };
      });
    };
  }

  setLakeWhirlpool(vortex: LakeWhirlpool) {
    this.flock.lakeWhirlpool = vortex;
  }

  destroy() {
    this.disposed = true;
    this.flock.onReenter = undefined;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.reducedMotion.removeEventListener("change", this.onMotionPreference);
    window.removeEventListener("pointerdown", this.onPointerDown);
  }

  /** Swap in another animal with its own defaults (plus any overrides); the screen fills with it at once. */
  setAnimal(animal: AnimalKey | Animal<any>, tuning?: Partial<Tuning>) {
    this.animal = resolve(animal);
    this.tuning = { ...this.animal.defaults, ...tuning } as Tuning;
    this.flock = new Flock(this.animal, this.tuning, this.count);
    this.renderer.setAnimal(this.animal, this.tuning);
    this.resize();
  }

  set(key: string, value: number | boolean) {
    this.tuning[key] = value;
    if (key === "detail") this.resize();
    else if (key === "hueShift" || key === "grid") this.renderer.restyle();
    if (this.reducedMotion.matches) this.drawStill();
  }

  setTheme(theme: Theme) {
    this.renderer.setTheme(theme);
    if (this.reducedMotion.matches) this.drawStill();
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.resize(rect.width, rect.height, dpr);
    this.flock.resize(rect.width, rect.height);
    if (this.reducedMotion.matches) this.drawStill();
  }

  private schedule() {
    cancelAnimationFrame(this.raf);
    if (this.disposed || !this.visible || this.reducedMotion.matches) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private frame = (now: number) => {
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    this.acc += dt;
    let steps = 0;
    while (this.acc >= STEP && steps < MAX_STEPS) {
      this.flock.step(STEP);
      this.acc -= STEP;
      steps++;
    }
    if (steps === MAX_STEPS) this.acc = 0;
    this.renderer.render(this.flock, dt);
    this.raf = requestAnimationFrame(this.frame);
  };

  /** Reduced motion: let the animals spread out, then show a single frame. */
  private drawStill() {
    if (this.flock.time < 4) {
      for (let i = 0; i < 240; i++) this.flock.step(STEP);
    }
    this.renderer.render(this.flock, STEP);
  }

  private onMotionPreference = () => {
    if (this.reducedMotion.matches) {
      cancelAnimationFrame(this.raf);
      this.drawStill();
    } else {
      this.schedule();
    }
  };

  private onPointerDown = (e: PointerEvent) => {
    if (this.reducedMotion.matches || e.button !== 0) return;
    const target = e.target;
    const background = target === this.interactionGroup;
    const glass = this.interactionGroup && target instanceof Element
      && !target.closest("a, button, input, select, textarea")
      && target.closest("[data-wildlife-glass]")?.closest(".habitat") === this.interactionGroup;
    if (target !== this.canvas && !background && !glass) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (rect.width < 1 || rect.height < 1) return;
    // Open sky and shoreline can extend beyond the painted animal layer.
    if (background) {
      this.flock.startle(Math.max(0, Math.min(x, rect.width - 1)), Math.max(0, Math.min(y, rect.height - 1)));
    } else if (x >= 0 && x < rect.width && y >= 0 && y < rect.height) {
      this.flock.startle(x, y);
    }
  };
}
