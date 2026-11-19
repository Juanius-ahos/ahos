import { useEffect, useRef } from "react";
import createGlobe, { type Arc, type Marker } from "cobe";

/**
 * The "where we work" globe, drawn with COBE (MIT, about 5 KB). It turns slowly, can be dragged, and
 * brings a place to the front when its row is hovered or focused. Everything is decorative: the
 * places are also listed as text next to it.
 */

export type GlobePoint = { id: string; location: [number, number]; home?: boolean };

const ORANGE: [number, number, number] = [1, 0.416, 0.102];
/** The phi that puts a longitude in the middle of the globe (calibrated against COBE's own map). */
const phiFor = (lon: number) => (-(lon + 90) * Math.PI) / 180;
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export default function GlobeCanvas({ points, focus, still }: { points: GlobePoint[]; focus: string | null; still: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef(focus);
  const kick = useRef<() => void>(() => {});
  focusRef.current = focus;
  useEffect(() => kick.current(), [focus]);

  useEffect(() => {
    const host = hostRef.current;
    const home = points.find((p) => p.home) ?? points[0];
    if (!host || !home) return;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block;cursor:grab;touch-action:pan-y;contain:strict";
    host.appendChild(canvas);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const width = Math.max(240, Math.round(host.getBoundingClientRect().width));
    const markers: Marker[] = points.map((p) => ({ location: p.location, size: p.home ? 0.085 : 0.06, id: p.id }));
    const arcs: Arc[] = points.filter((p) => !p.home).map((p) => ({ from: home.location, to: p.location, id: `${home.id}-${p.id}` }));

    let phi = phiFor(home.location[1]);
    let theta = 0.3;
    let dragging = false;
    let lastX = 0;
    let raf = 0;
    let visible = true;
    const find = (id: string | null) => points.find((p) => p.id === id);

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width,
      height: width,
      phi,
      theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 5,
      mapBaseBrightness: 0.04,
      baseColor: [0.17, 0.17, 0.19],
      markerColor: ORANGE,
      glowColor: [0.32, 0.16, 0.07],
      markers,
      arcs,
      arcColor: [1, 0.55, 0.22],
      arcWidth: 0.55,
      arcHeight: 0.26,
      markerElevation: 0.015,
    });

    // one step: ease towards the focused place, otherwise drift. Returns whether it should keep running.
    const step = () => {
      raf = 0;
      const target = find(focusRef.current);
      let moving = false;
      if (!dragging) {
        if (target) {
          const dPhi = wrap(phiFor(target.location[1]) - phi);
          const dTheta = 0.3 + target.location[0] * 0.004 - theta;
          if (still) { phi += dPhi; theta += dTheta; } else { phi += dPhi * 0.08; theta += dTheta * 0.08; }
          moving = Math.abs(dPhi) > 0.002 || Math.abs(dTheta) > 0.002;
        } else if (!still) {
          phi += 0.0026;
          moving = true;
        }
      }
      globe.update({ phi, theta });
      if (visible && (moving || dragging) && !raf) raf = requestAnimationFrame(step);
    };
    kick.current = () => { if (visible && !raf) raf = requestAnimationFrame(step); };
    kick.current();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick.current();
      else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(host);

    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = "grabbing"; kick.current(); };
    const move = (e: PointerEvent) => { if (!dragging) return; phi += ((e.clientX - lastX) / width) * 3.2; lastX = e.clientX; kick.current(); };
    const up = () => { dragging = false; canvas.style.cursor = "grab"; kick.current(); };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      kick.current = () => {};
      io.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      globe.destroy();
      host.replaceChildren();
    };
    // the globe is built once per mount; focus and motion are read through refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={hostRef} className="globe-host" aria-hidden="true" />;
}
