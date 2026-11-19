import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { canRunShaders } from "./FxLayer";
import type { GradientASCIIShape } from "../rb/GradientASCII";

/**
 * The ASCII family of backgrounds, from React Bits (https://reactbits.dev, free, open source): an ASCII
 * gradient (an orange sunrise, ring or funnel drawn in characters) and a field of glitching letters. Both are
 * set in the AHOS colours (black, orange, cream) and used the same way as the glyph field:
 *   - put `<RbLayer kind="ascii" shape="eclipse" />` as the first child of an element with the class `fx-host`;
 *   - the shader code is a separate chunk, fetched only when the section is within 300 px of the screen;
 *   - never on data-saver, never without WebGL, never on phones or weak devices (the CSS backdrop stays);
 *   - the layer is decorative: hidden from assistive tech and from the pointer, which the components read from the window.
 */
const Ascii = lazy(() => import("../rb/GradientASCII"));
const Letters = lazy(() => import("../rb/LetterGlitch"));

export type RbKind = "ascii" | "letters";

const ORANGE = "#ff6a1a";
const CREAM = "#efe9df";

export function RbLayer({ kind, shape = "eclipse" }: { kind: RbKind; shape?: GradientASCIIShape }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !canRunShaders()) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMount(true); io.disconnect(); } }, { rootMargin: "300px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fx-layer fx-${kind}`} aria-hidden="true">
      {mount && (
        <Suspense fallback={null}>
          {kind === "ascii" ? (
            <Ascii
              colors={[ORANGE, "#ffb27a", CREAM]}
              shape={shape}
              cellSize={15}
              density={0.85}
              glyphOpacity={0.9}
              gradientOpacity={0.85}
              glow={0.4}
              flicker={0.25}
              grain={0.05}
            />
          ) : (
            <Letters
              glitchColors={[ORANGE, CREAM]}
              baseColor={CREAM}
              baseOpacity={0.3}
              fontSize={13}
              glitchAmount={0.6}
              fontFamily='"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace'
            />
          )}
        </Suspense>
      )}
    </div>
  );
}
