import { useEffect } from "react";

/* Initializes Lenis (loaded via CDN in index.html) for buttery, inertia
   smooth-scroll. Framer-motion's useScroll listens to the scroll events
   Lenis emits, so scroll-scrubbed animations stay in sync. Disabled under
   reduced-motion. */
export function SmoothScroll() {
  useEffect(() => {
    const Lenis = (window as any).Lenis;
    if (!Lenis) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    document.documentElement.classList.add("lenis");

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return null;
}
