import { useEffect, useRef } from "react";

export function Loader({ onComplete }: { onComplete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let safetyTimer: ReturnType<typeof setTimeout>;

    (async () => {
      const gsap = (await import("gsap")).default;
      if (cancelled) return;
      const els = ref.current;
      if (!els) { onComplete(); return; }

      const cols = els.querySelectorAll<HTMLDivElement>(".ld-col-inner");
      const brand = els.querySelector<HTMLDivElement>(".ld-brand");
      const sub = els.querySelector<HTMLDivElement>(".ld-sub");

      if (!cols.length) { onComplete(); return; }

      const tl = gsap.timeline({
        onComplete: () => {
          if (done.current) return;
          done.current = true;
          clearTimeout(safetyTimer);
          onComplete();
        },
      });

      tl.fromTo(cols, { scaleY: 1 }, { scaleY: 0, duration: 0.55, stagger: 0.05, ease: "power3.inOut", delay: 2.8 })
        .to(brand, { opacity: 0, duration: 0.45, ease: "power2.out" }, "-=0.5")
        .to(sub, { opacity: 0, duration: 0.35, ease: "power2.out" }, "-=0.3")
        .to(els, { opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");
    })();

    safetyTimer = setTimeout(() => {
      if (!done.current) {
        done.current = true;
        onComplete();
      }
    }, 8000);

    return () => { cancelled = true; clearTimeout(safetyTimer); };
  }, [onComplete]);

  return (
    <>
      <style>{`
        .ld-overlay {
          position: fixed; inset: 0; z-index: 5000;
          background: #0a0a0b;
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
        }
        .ld-brand {
          position: relative; z-index: 10;
          text-align: center;
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .ld-brand-text {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(56px, 12vw, 120px);
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #ede8e0;
          line-height: 0.9;
        }
        .ld-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(10px, 1.2vw, 13px);
          font-weight: 500;
          letter-spacing: 0.28em;
          color: #ff6a1a;
          text-transform: uppercase;
        }
        .ld-cols {
          position: fixed; inset: 0;
          display: flex;
          pointer-events: none;
        }
        .ld-col {
          position: absolute; top: 0; bottom: 0;
          width: 16.666%;
          overflow: hidden;
          display: flex;
          align-items: center; justify-content: center;
        }
        .ld-col-inner {
          width: 100%; height: 100%;
          background: var(--bg-3);
          transform-origin: center center;
          border-right: 1px solid var(--border-soft);
        }
      `}</style>
      <div ref={ref} className="ld-overlay">
        <div className="ld-brand">
          <span className="ld-brand-text">AHOS</span>
          <span className="ld-sub">DIGITAL PRODUCT STUDIO</span>
        </div>
        <div className="ld-cols">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="ld-col" style={{ left: `${(i / 6) * 100}%` }}>
              <div className="ld-col-inner" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
