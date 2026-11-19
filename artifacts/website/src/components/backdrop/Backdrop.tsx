import { lazy, Suspense, useEffect, useState } from "react";
import { Aurora } from "@/components/corsair/aurora";
import { Grain } from "@/components/corsair/grain";
import { Particles } from "@/components/corsair/particles";
import { FxLayer } from "@/components/fx/FxLayer";

/**
 * The background behind a page header or a section. Every kind is a real component from Corsair UI
 * (https://21st.dev/@kevingirelli, MIT), used as published; this file only chooses one and sets the
 * AHOS colours. Aurora is always underneath as a soft glow. The three WebGL2 kinds (light rays, warp
 * gradient, topography) and the particles run only on a wide screen with a mouse, load as separate
 * chunks and start once the page has finished loading, so they never compete with the first paint and
 * never run down a phone. Phones keep the Aurora glow, held still (see pages.css). Each pauses off screen and draws one still frame for
 * reduced motion, and falls back to plain CSS where WebGL2 is missing (their own behaviour).
 */
const LightRays = lazy(() => import("@/components/corsair/light-rays").then((m) => ({ default: m.LightRays })));
const WarpGradient = lazy(() => import("@/components/corsair/warp-gradient").then((m) => ({ default: m.WarpGradient })));
const Topography = lazy(() => import("@/components/corsair/topography").then((m) => ({ default: m.Topography })));

/** "arcs" (Chrome Arcs) and "glyph" (the glyph field) are the two components the site owner chose from 21st.dev. */
export type BackdropKind = "aurora" | "rays" | "warp" | "topography" | "particles" | "arcs" | "glyph";

const ORANGE = "#ff6a1a";

/** True once the page has loaded and a moment has passed. */
function useAfterLoad(ms = 1600) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let t = 0;
    const start = () => { t = window.setTimeout(() => setReady(true), ms); };
    if (document.readyState === "complete") start(); else window.addEventListener("load", start, { once: true });
    return () => { window.clearTimeout(t); window.removeEventListener("load", start); };
  }, [ms]);
  return ready;
}

/** A wide screen, a mouse and enough cores: the only place the shader backgrounds run. */
function useDesktop() {
  const [yes, setYes] = useState(false);
  useEffect(() => {
    setYes(window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches && (navigator.hardwareConcurrency || 4) >= 4);
  }, []);
  return yes;
}

export function Backdrop({ kind = "aurora" }: { kind?: BackdropKind }) {
  const desktop = useDesktop();
  const ready = useAfterLoad() && desktop;
  return (
    <div className="bd pointer-events-none absolute inset-0" aria-hidden="true">
      <Aurora className="absolute inset-0" colors={[ORANGE, "#ffb27a", "#8a3208"]} intensity={kind === "aurora" ? 0.5 : 0.24} duration={24} />
      {kind === "arcs" && <FxLayer kind="arcs" />}
      {kind === "glyph" && <FxLayer kind="glyph" />}
      {desktop && kind === "particles" && <Particles count={56} className="text-primary/80" />}
      {ready && kind === "rays" && (
        <Suspense fallback={null}><LightRays colors={[ORANGE, "#ffd9b8"]} /></Suspense>
      )}
      {ready && kind === "warp" && (
        <Suspense fallback={null}><WarpGradient preset="tide" colors={["#0a0a0b", "#22100a", "#6b2a0a"]} grain={0.2} /></Suspense>
      )}
      {ready && kind === "topography" && (
        <Suspense fallback={null}><Topography color={ORANGE} density={0.55} opacity={0.32} pointer /></Suspense>
      )}
      <Grain opacity={0.1} />
    </div>
  );
}
