import { useEffect, useRef } from "react";

/* Thin scroll-progress bar pinned to the top of the viewport.
   One passive listener + rAF — negligible cost. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? h.scrollTop / max : 0;
      el.style.transform = `scaleX(${p.toFixed(4)})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <style>{`
        .scrollprog { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 1100;
          background: linear-gradient(90deg, var(--orange), var(--orange-light));
          transform: scaleX(0); transform-origin: 0 50%; will-change: transform;
          box-shadow: 0 0 12px rgba(255,106,26,0.5); }
        .scrollprog::after { content: ""; position: absolute; right: -4px; top: -3px;
          width: 8px; height: 8px; border-radius: 50%; background: var(--orange);
          box-shadow: 0 0 10px var(--orange), 0 0 20px rgba(255,106,26,0.35); }
      `}</style>
      <div ref={ref} className="scrollprog" aria-hidden="true" />
    </>
  );
}
