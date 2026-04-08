"use client";

import { useEffect, useRef } from "react";

export function AnimatedCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const hoveredRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canUse =
      !window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches &&
      !window.matchMedia?.("(pointer: coarse)")?.matches;

    if (!canUse) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let x = mouseX;
    let y = mouseY;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      hoveredRef.current = !!target?.closest(
        'a,button,input,textarea,select,[role="button"],[data-cursor-hover="true"]',
      );
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    const tick = () => {
      x += (mouseX - x) * 0.18;
      y += (mouseY - y) * 0.18;

      dot.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
      const scale = hoveredRef.current ? 1.5 : 1;
      ring.style.transform = `translate3d(${x - 18}px, ${y - 18}px, 0) scale(${scale})`;

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-50 hidden lg:block">
      <div
        ref={dotRef}
        aria-hidden
        className="absolute h-2 w-2 rounded-full bg-indigo-500/90 shadow-[0_0_18px_rgba(99,102,241,0.8)]"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="absolute h-10 w-10 rounded-full border border-indigo-500/35 bg-indigo-500/5 backdrop-blur-[2px] transition-[transform] duration-150"
      />
    </div>
  );
}

