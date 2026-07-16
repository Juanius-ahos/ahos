import { useEffect, useRef } from "react";

type RGB = [number, number, number];

const parseRGB = (s?: string | null): RGB => {
  const p = (s || "255,118,30").split(",").map((n) => Number(n.trim()));
  return [p[0] || 255, p[1] || 118, p[2] || 30];
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpRGB = (a: RGB, b: RGB, t: number): RGB => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

// Base colour-drift endpoints (dark theme): near-black → faintly warm.
const DRIFT_A: RGB = [10, 10, 11];
const DRIFT_B: RGB = [17, 14, 12];

export function CornerGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Accent anchors for the reactive glow. Each [data-accent] element
    // contributes its colour at its vertical centre; the glow lerps between
    // the two anchors bracketing the viewport centre for a smooth hue drift.
    const anchors = [...document.querySelectorAll<HTMLElement>("[data-accent]")].map((a) => ({
      a,
      rgb: parseRGB(a.dataset.accent),
    }));

    let raf = 0;
    const update = () => {
      raf = 0;
      const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollMax > 0 ? window.scrollY / scrollMax : 0;

      // Globe path: x 8→4→0→-4→-7, scale 1→0.3
      // Glow is opposite: when globe right, glow left. When globe left, glow right.
      const warmX = -15 + pct * 50; // vw: -15 → 35
      const warmY = 85 - pct * 8;   // vh: 85 → 77
      const coolX = -15 + pct * 50; // vw: -15 → 35
      const coolY = 10 + pct * 6;   // vh: 10 → 16
      const size = 34 - pct * 12;   // vw: 34 → 22

      el.style.setProperty("--cg-ox", `${warmX}vw`);
      el.style.setProperty("--cg-oy", `${warmY}vh`);
      el.style.setProperty("--cg-gx", `${coolX}vw`);
      el.style.setProperty("--cg-gy", `${coolY}vh`);
      el.style.setProperty("--cg-s", `${size}vw`);

      const isLight = document.documentElement.dataset.theme === "light";

      // ── Accent-reactive glow hue ──
      if (anchors.length) {
        const vc = window.scrollY + window.innerHeight / 2;
        const pts = anchors
          .map(({ a, rgb }) => {
            const r = a.getBoundingClientRect();
            return { y: window.scrollY + r.top + r.height / 2, rgb };
          })
          .sort((p, q) => p.y - q.y);

        let rgb: RGB = pts[0].rgb;
        if (vc >= pts[pts.length - 1].y) {
          rgb = pts[pts.length - 1].rgb;
        } else if (vc > pts[0].y) {
          for (let i = 0; i < pts.length - 1; i++) {
            if (vc >= pts[i].y && vc <= pts[i + 1].y) {
              const span = pts[i + 1].y - pts[i].y || 1;
              rgb = lerpRGB(pts[i].rgb, pts[i + 1].rgb, (vc - pts[i].y) / span);
              break;
            }
          }
        }
        el.style.setProperty("--glow-rgb", rgb.map(Math.round).join(","));
      }

      // ── Base colour-drift (dark theme only) ──
      if (driftRef.current) {
        if (isLight) {
          driftRef.current.style.backgroundColor = "transparent";
        } else {
          const d = lerpRGB(DRIFT_A, DRIFT_B, pct).map(Math.round);
          driftRef.current.style.backgroundColor = `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
        }
      }

      // ── Dim the glow over the bright/inverted panels ──
      let alpha = 1;
      for (const lightEl of document.querySelectorAll(".section-light")) {
        const rect = lightEl.getBoundingClientRect();
        const dist = Math.abs(rect.top) / window.innerHeight;
        if (dist < 1.2) alpha = Math.min(alpha, Math.max(0.1, dist / 1.2));
      }
      if (isLight) alpha *= 0.3;
      el.style.setProperty("--cg-a", String(alpha));
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Re-run when the theme toggles (no scroll fires then) so the drift layer
    // clears in light mode and the panel inversion recolors immediately. Call
    // update() directly so it applies synchronously rather than next frame.
    const themeObserver = new MutationObserver(() => update());
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      themeObserver.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={driftRef} className="bg-drift" aria-hidden="true" />
      <div ref={ref} className="corner-glow" aria-hidden="true" />
    </>
  );
}
