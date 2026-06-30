import { useEffect, useRef } from "react";

/* Custom cursor: a precise dot that tracks the pointer + an outline ring
   that trails with easing and grows over interactive elements. Pointer-fine
   only; hidden under reduced-motion. Native cursor stays visible (a11y). */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (!visible) {
        visible = true;
        dot.current?.style.setProperty("opacity", "1");
        ring.current?.style.setProperty("opacity", "1");
      }
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px)`;
      const t = e.target as HTMLElement;
      const interactive = !!t.closest("a, button, input, textarea, select, [role='button'], .magnetic");
      ring.current?.classList.toggle("is-active", interactive);
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        visible = true;
        dot.current?.style.setProperty("opacity", "1");
        ring.current?.style.setProperty("opacity", "1");
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <>
      <style>{`
        .cursor-dot, .cursor-ring { position: fixed; top: 0; left: 0; z-index: 2000; pointer-events: none; opacity: 0; margin-left: -3px; margin-top: -3px; }
        .cursor-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--orange); transition: opacity 0.3s ease; }
        .cursor-ring { width: 34px; height: 34px; margin-left: -17px; margin-top: -17px; border-radius: 50%; border: 1px solid rgba(255,106,26,0.5); transition: opacity 0.3s ease, width 0.25s ease, height 0.25s ease, margin 0.25s ease, background 0.25s ease, border-color 0.25s ease; }
        .cursor-ring.is-active { width: 52px; height: 52px; margin-left: -26px; margin-top: -26px; background: rgba(255,106,26,0.08); border-color: var(--orange); }
        @media (pointer: fine) { *, *::before, *::after { cursor: none !important; } a:focus-visible, button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible, [tabindex]:focus-visible { cursor: auto !important; } }
        @media (pointer: fine) and (prefers-reduced-motion: reduce) { *, *::before, *::after { cursor: auto !important; } }
        @media (pointer: coarse) { .cursor-dot, .cursor-ring { display: none; } }
      `}</style>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
