import { useEffect } from "react";
import Lenis from "lenis";

/* Initializes Lenis for buttery, inertia smooth-scroll.

   Lenis drives the native scrollbar, so framer-motion's useScroll (which reads
   window scroll) stays in sync automatically. GSAP ScrollTrigger, however, runs
   on its own ticker — so we explicitly unify the loops: ScrollTrigger.update is
   fired on every Lenis scroll, and Lenis.raf is driven by gsap.ticker with
   lagSmoothing disabled. That keeps scrubbed timelines frame-locked to the
   smoothed scroll position instead of trailing it by a frame.

   Disabled under reduced-motion, on coarse pointers, and on small touch
   devices. Falls back to a standalone rAF loop if GSAP can't be loaded. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && window.innerWidth < 1024) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    document.documentElement.classList.add("lenis");

    let cancelled = false;
    let raf = 0;
    let gsapRef: (typeof import("gsap"))["default"] | null = null;
    let tickerFn: ((t: number) => void) | null = null;

    // Drive Lenis immediately so there's never a frame it isn't updated, then
    // hand off to the shared GSAP ticker once ScrollTrigger is available.
    const standalone = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(standalone);
    };
    raf = requestAnimationFrame(standalone);

    (async () => {
      try {
        const gsap = (await import("gsap")).default;
        const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        gsapRef = gsap;

        // Stop the standalone loop and unify onto gsap.ticker.
        cancelAnimationFrame(raf);
        raf = 0;
        lenis.on("scroll", ScrollTrigger.update);
        tickerFn = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);
      } catch {
        // Keep the standalone rAF loop already running.
      }
    })();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (gsapRef && tickerFn) gsapRef.ticker.remove(tickerFn);
      lenis.destroy();
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return null;
}
