import { lazy, Suspense, useEffect, useState } from "react";
import { canRunShaders } from "./FxLayer";

/**
 * The glyph field, once, behind the whole site: a single canvas fixed to the window, so it costs the
 * same on a short page and a long one, and the page scrolls over it. It comes in two colour sets that
 * follow the theme: cream characters with orange waves on the dark page, charcoal characters with a
 * deeper orange on the light one. The sections let it through (see "site-wide glyph" in styles/fx.css);
 * the bands that stay dark in both themes keep their own backdrops.
 *
 * It starts only on a wide screen with a mouse and enough cores, a few seconds after the page has
 * loaded and the browser is idle, so it is never in the way of the first paint or the first taps. It draws at
 * 30 frames a second, pauses with the tab and still draws one frame for reduced motion. Everywhere
 * else the page is exactly what it was, and `html.has-glyph` (which makes the sections see-through)
 * is never set.
 */

const Glyph = lazy(() => import("./GlyphField"));

type Theme = "dark" | "light";
const read = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

const LOOK: Record<Theme, { glow: string; shape: string; haze: number }> = {
  dark: { glow: "#efe9df", shape: "#ff6a1a", haze: 0.21 },
  light: { glow: "#17181b", shape: "#d9520c", haze: 0.2 },
};

export function GlobalGlyph() {
  const [on, setOn] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    if (!canRunShaders()) return;
    let timer = 0;
    let idleId = 0;
    const win = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    const start = () => {
      timer = window.setTimeout(() => {
        const go = () => { setTheme(read()); setOn(true); };
        if (win.requestIdleCallback) idleId = win.requestIdleCallback(go, { timeout: 3000 }); else go();
      }, 2800);
    };
    if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("load", start); if (idleId) win.cancelIdleCallback?.(idleId); };
  }, []);

  // follow the theme toggle
  useEffect(() => {
    if (!on) return;
    const root = document.documentElement;
    const mo = new MutationObserver(() => setTheme(read()));
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    root.classList.add("has-glyph");
    return () => { mo.disconnect(); root.classList.remove("has-glyph"); };
  }, [on]);

  const look = LOOK[theme];
  return (
    <div className="fx-global" aria-hidden="true">
      {on && (
        <Suspense fallback={null}>
          <Glyph key={theme} glowColor={look.glow} shapeColor={look.shape} fontSize={12} haze={look.haze} interactive pixelRatio={1.25} fps={30} host="window" />
        </Suspense>
      )}
    </div>
  );
}
