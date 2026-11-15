"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LandscapeCanvas } from "./LandscapeCanvas";
import { measureOctopusScene, paintClimbingOctopus, paintHead, paintRock, planTrip, returnToDen, type OctopusScene, type OctopusTrip } from "./OctopusArt";

export function OctopusRock() {
  const button = useRef<HTMLButtonElement>(null);
  const hide = useRef(0);
  const movingButton = useRef<HTMLButtonElement>(null);
  const scurryHome = useRef<() => void>(() => {});
  const trip = useRef<OctopusTrip | null>(null);
  const scene = useRef<OctopusScene | null>(null);
  const [peeking, setPeeking] = useState(false);
  const [roaming, setRoaming] = useState(false);

  const peek = useCallback(() => {
    if (trip.current) return;
    clearTimeout(hide.current);
    setPeeking(true);
    hide.current = window.setTimeout(() => setPeeking(false), 2450);
  }, []);

  useEffect(() => {
    const element = button.current;
    const stack = element?.parentElement;
    const trail = stack?.querySelector<HTMLCanvasElement>(".octopus-trail");
    const cards = stack ? Array.from(stack.querySelectorAll<HTMLElement>(".stack-group")) : [];
    if (!element || !stack || !trail || !cards.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    let arrival = 0;
    let visible = false;
    let firstTrip = true;
    let previousRoute: OctopusTrip["route"] | undefined;
    scene.current = measureOctopusScene(trail, element, cards);

    const endTrip = () => {
      clearTimeout(arrival);
      trip.current = null;
      setRoaming(false);
    };
    const finishAt = (outing: OctopusTrip) => {
      clearTimeout(arrival);
      const remaining = Math.max(0, outing.born + outing.duration * 1000 - performance.now());
      arrival = window.setTimeout(() => {
        endTrip();
        schedule();
      }, remaining);
    };
    scurryHome.current = () => {
      if (!trip.current || trip.current.returnAt !== undefined) return;
      trip.current = returnToDen(trip.current);
      finishAt(trip.current);
    };
    const schedule = () => {
      clearTimeout(timer);
      if (!visible || reduce.matches || trip.current) return;
      timer = window.setTimeout(() => {
        if (!document.hidden && (firstTrip || Math.random() < .56)) {
          firstTrip = false;
          clearTimeout(hide.current);
          setPeeking(false);
          scene.current = measureOctopusScene(trail, element, cards);
          const outing = planTrip(scene.current, previousRoute);
          previousRoute = outing.route;
          trip.current = outing;
          setRoaming(true);
          finishAt(outing);
          return;
        }
        if (!document.hidden) peek();
        schedule();
      }, firstTrip ? 6800 + Math.random() * 5000 : 11000 + Math.random() * 10000);
    };

    const motionChanged = () => {
      if (reduce.matches) endTrip();
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      schedule();
    });
    observer.observe(stack);
    const onResize = () => {
      scene.current = measureOctopusScene(trail, element, cards);
      if (trip.current) {
        endTrip();
        schedule();
      }
    };
    const size = new ResizeObserver(onResize);
    size.observe(stack);
    size.observe(element);
    window.addEventListener("resize", onResize);
    reduce.addEventListener("change", motionChanged);
    return () => {
      scurryHome.current = () => {};
      clearTimeout(timer);
      clearTimeout(arrival);
      clearTimeout(hide.current);
      observer.disconnect();
      size.disconnect();
      window.removeEventListener("resize", onResize);
      reduce.removeEventListener("change", motionChanged);
    };
  }, [peek]);

  const paintTrail = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const rock = button.current;
    if (!scene.current && rock?.parentElement) {
      const cards = Array.from(rock.parentElement.querySelectorAll<HTMLElement>(".stack-group"));
      scene.current = measureOctopusScene(ctx.canvas, rock, cards);
    }
    const position = paintClimbingOctopus(ctx, width, height, scene.current, trip.current, time);
    if (position && scene.current && movingButton.current) {
      const { origin } = scene.current;
      movingButton.current.style.transform = `translate3d(${origin.x + position.x}px, ${origin.y + position.y}px, 0) translate(-50%, -50%)`;
    }
  }, []);

  return (
    <>
      <LandscapeCanvas className="octopus-trail" paint={paintTrail} />
      <button ref={movingButton} className="octopus-return-target" type="button" aria-label="Send the octopus back to its rock" hidden={!roaming} onClick={() => scurryHome.current()} />
      <button ref={button} type="button" className="octopus-rock" aria-label={roaming ? "Octopus rock, octopus is exploring" : "Make the octopus peek out"} data-peeking={peeking} data-roaming={roaming} onClick={peek}>
        <LandscapeCanvas className="octopus-head" paint={paintHead} animate={false} />
        <LandscapeCanvas className="octopus-den" paint={paintRock} animate={false} />
      </button>
    </>
  );
}
