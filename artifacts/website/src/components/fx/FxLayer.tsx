import { lazy, Suspense, useEffect, useRef, useState } from "react";

/**
 * A WebGL background for a section: put `<FxLayer kind="arcs" />` as the first child of an element
 * with the class `fx-host`. It costs nothing until it matters:
 *   - the shader code is a separate chunk, fetched only when the section is within 300 px of the screen;
 *   - never on data-saver, never without WebGL (the CSS backdrop stays);
 *   - phones and weak devices (touch, or fewer than 4 cores) get one still frame, no loop;
 *   - reduced motion gets the still frame too (the components check it themselves).
 * The layer is decorative: hidden from assistive tech and from pointer events. The pointer is
 * tracked over the `.fx-host` section so the effect still reacts under the page content.
 */

const Arcs = lazy(() => import("./ChromeArcs"));
const Glyph = lazy(() => import("./GlyphField"));

type Kind = "arcs" | "glyph";
type Profile = { still: boolean; interactive: boolean };

function profile(): Profile | null {
  if (typeof window === "undefined" || typeof window.WebGLRenderingContext === "undefined") return null;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return null;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const weak = (navigator.hardwareConcurrency || 4) < 4;
  return { still: touch || weak, interactive: !touch };
}

/** Outer and inner fringes of the chrome streaks: AHOS orange outside, a deeper amber inside. */
const ARC_TINT: [string, string] = ["#ff6a1a", "#ff8a3d"];

export function FxLayer({ kind }: { kind: Kind }) {
  const ref = useRef<HTMLDivElement>(null);
  const [prof, setProf] = useState<Profile | null>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const p = profile();
    if (!el || !p) return;
    setProf(p);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fx-layer fx-${kind}`} aria-hidden="true">
      {mount && prof && (
        <Suspense fallback={null}>
          {kind === "arcs" ? (
            <Arcs tint={ARC_TINT} speed={prof.still ? 0 : 0.8} interactive={prof.interactive} pixelRatio={1.5} host=".fx-host" label="" />
          ) : (
            <Glyph glowColor="#efe9df" shapeColor="#ff6a1a" fontSize={11} haze={0.17} interactive={prof.interactive} still={prof.still} pixelRatio={1.5} host=".fx-host" />
          )}
        </Suspense>
      )}
    </div>
  );
}
