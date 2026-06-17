import { useEffect, useRef } from "react";

export function CornerGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollMax > 0 ? window.scrollY / scrollMax : 0;

      // Globe path: x 8→4→0→-4→-7, scale 1→0.3
      // Glow is opposite: when globe right, glow left. When globe left, glow right.
      // Orange glow: bottom-left, drifts right as globe moves left
      const warmX = -15 + pct * 50; // vw: -15 → 35
      const warmY = 85 - pct * 8;   // vh: 85 → 77

      // Gray haze: top-right, drifts left as globe moves left
      const coolX = -15 + pct * 50; // vw: -15 → 35 (mirrored from right edge)
      const coolY = 10 + pct * 6;   // vh: 10 → 16

      // Size shrinks with globe scale (1 → 0.3)
      const size = 42 - pct * 20; // vw: 42 → 22

      el.style.setProperty("--cg-ox", `${warmX}vw`);
      el.style.setProperty("--cg-oy", `${warmY}vh`);
      el.style.setProperty("--cg-gx", `${coolX}vw`);
      el.style.setProperty("--cg-gy", `${coolY}vh`);
      el.style.setProperty("--cg-s", `${size}vw`);

      // Dim near light section
      const lightEl = document.querySelector(".section-light");
      let alpha = 1;
      if (lightEl) {
        const rect = lightEl.getBoundingClientRect();
        const dist = Math.abs(rect.top) / window.innerHeight;
        if (dist < 1.2) alpha = Math.max(0.1, dist / 1.2);
      }
      // Theme
      const isLight = document.documentElement.dataset.theme === "light";
      if (isLight) alpha *= 0.3;

      el.style.setProperty("--cg-a", String(alpha));
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="corner-glow" aria-hidden="true" />;
}
