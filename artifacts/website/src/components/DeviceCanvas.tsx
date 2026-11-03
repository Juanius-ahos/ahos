import { useEffect, useRef, useState } from "react";
import type { DeviceScene } from "../three/devices";

export type Region = { x: number; y: number; w: number; h: number };

interface Props {
  scene: DeviceScene;
  className?: string;
  /** Where the devices may sit, in CSS px relative to the canvas. Defaults to the whole canvas. */
  region?: (canvas: HTMLCanvasElement) => Region;
}

/** A live 3D product scene: real client work running on titanium devices. */
export function DeviceCanvas({ scene, className = "", region }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const regionRef = useRef(region);
  regionRef.current = region;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stage: Awaited<ReturnType<typeof import("../three/devices").createDevices>> | null = null;
    let raf = 0, visible = false, disposed = false, last = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.6);
    const times: number[] = [];
    const t0 = performance.now();

    const layout = () => {
      if (!stage) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const r = regionRef.current?.(canvas) ?? { x: 0, y: 0, w, h };
      stage.resize(w * dpr, h * dpr, { x: r.x * dpr, y: r.y * dpr, w: r.w * dpr, h: r.h * dpr });
      if (reduced) stage.render(2.4);
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!stage || !visible || document.hidden || reduced) return;
      if (mobile && now - last < 31) return; // 30 fps on phones
      last = now;
      const s = performance.now();
      stage.render((now - t0) / 1000);
      times.push(performance.now() - s);
      if (times.length >= 40) {
        const avg = times.reduce((a, b) => a + b, 0) / times.length; times.length = 0;
        if (avg > 20 && dpr > 0.8) { dpr = Math.max(0.8, dpr - 0.25); layout(); }
      }
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);
    const ro = new ResizeObserver(layout); ro.observe(canvas);
    raf = requestAnimationFrame(tick);
    import("../three/devices").then(({ createDevices }) => createDevices(canvas, { scene, base: import.meta.env.BASE_URL, mobile }))
      .then((s) => { if (disposed) { s.dispose(); return; } stage = s; layout(); stage.render(0); setReady(true); })
      .catch(() => canvas.classList.add("is-failed"));
    return () => { disposed = true; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); stage?.dispose(); };
  }, [scene]);

  return <canvas ref={ref} className={`dv-canvas${ready ? " is-ready" : ""} ${className}`} aria-hidden="true" />;
}
