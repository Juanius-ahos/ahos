import { Aurora } from "@/components/corsair/aurora";
import { Grain } from "@/components/corsair/grain";
import { FxLayer } from "@/components/fx/FxLayer";
import { RbLayer } from "@/components/fx/RbLayer";
import type { GradientASCIIShape } from "@/components/rb/GradientASCII";

/**
 * The background behind a page header or a section. One family, in the AHOS colours (black, orange, cream):
 *   glyph   a field of characters that drifts and answers the mouse (Animate UI, from 21st.dev): the footer and the first screen;
 *   ascii   an orange gradient drawn in characters, in four shapes (React Bits, free): page headers;
 *   letters a field of glitching letters (React Bits, free): the technical pages;
 *   arcs    the chrome streaks (Chrome Arcs, from 21st.dev): the closing call to action;
 *   aurora  only a quiet CSS glow, which is also what a phone gets for every kind.
 * Under every kind sits the Aurora glow and the grain. The WebGL kinds run only on a wide screen with a mouse, load
 * as separate chunks and start when the section is near, so they never compete with the first paint and never run
 * down a phone. Each fades out at its top and bottom (see "seams" in styles/fx.css), so no section ends in a hard edge.
 */
export type BackdropKind = "aurora" | "glyph" | "ascii" | "letters" | "arcs";
export type { GradientASCIIShape };

const ORANGE = "#ff6a1a";

/** `strong` is for a first screen that has no picture: the glyph field carries it, so the field is clearer and the orange glow quieter. `art` adds the ASCII eclipse on top of another kind, as on the first screen. */
export function Backdrop({ kind = "aurora", shape = "eclipse", strong = false, art }: { kind?: BackdropKind; shape?: GradientASCIIShape; strong?: boolean; art?: GradientASCIIShape }) {
  return (
    <div className="bd pointer-events-none absolute inset-0" aria-hidden="true">
      <Aurora className="absolute inset-0" colors={[ORANGE, "#ffb27a", "#8a3208"]} intensity={kind === "aurora" ? 0.5 : strong ? 0.1 : 0.24} duration={24} />
      {kind === "arcs" && <FxLayer kind="arcs" />}
      {kind === "glyph" && <FxLayer kind="glyph" haze={strong ? 0.34 : undefined} />}
      {kind === "ascii" && <RbLayer kind="ascii" shape={shape} />}
      {kind === "letters" && <RbLayer kind="letters" />}
      {art && kind !== "ascii" && <RbLayer kind="ascii" shape={art} />}
      <Grain opacity={0.1} />
    </div>
  );
}
