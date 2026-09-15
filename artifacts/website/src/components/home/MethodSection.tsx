import { useEffect, useRef, useState } from "react";

const PHASES = [
  { n: "01", title: "Discover", ghost: "DISCOVER", accent: "#ff6a1a", headline: "80% of tech projects fail because no one asked the right question.", notes: ["We don't start at the solution — we start at the uncomfortable truth", "How your business actually runs, not the org-chart version", "Clarity before code"] },
  { n: "02", title: "Diagnose", ghost: "DIAGNOSE", accent: "#ff8c4a", headline: "If it can't be measured, it doesn't exist.", notes: ["Every friction, bottleneck, and silent leak — mapped", "An executive diagnosis few consultants will sign their name to", "Quantified truth. Zero opinions."] },
  { n: "03", title: "Design", ghost: "DESIGN", accent: "#e0560a", headline: "We don't prescribe software. We prescribe outcomes.", notes: ["Every architectural decision tied to a business KPI", "If it doesn't move the needle, it doesn't make the plan", "Blueprint, not buzzwords"] },
  { n: "04", title: "Deliver", ghost: "DELIVER", accent: "#ffb074", headline: "Code without adoption is debt with ego.", notes: ["Victory isn't deploy — it's your team running it without us", "Understood without a manual. Improved without permission.", "Adoption, not delivery"] },
  { n: "05", title: "Evolve", ghost: "EVOLVE", accent: "#cc5500", headline: "What doesn't evolve is already dying.", notes: ["While most invoice and disappear, we stay", "Your business changes every quarter — your tech has to match", "Partnership, not project"] },
];

const SLIDE_W = 70; // vw per phase
const TOTAL_W = PHASES.length * SLIDE_W; // 350vw

export function MethodSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroVisible(false);
      return;
    }

    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const gsap = (await import("gsap")).default;
        const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
        gsap.registerPlugin(ScrollTrigger);

        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        // Hide intro once we scroll past it
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${window.innerHeight * 0.8}`,
          onLeave: () => setIntroVisible(false),
          onEnterBack: () => setIntroVisible(true),
        });

        // Horizontal scroll-jack: map vertical scroll to horizontal track movement
        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const idx = Math.min(
                PHASES.length - 1,
                Math.floor(progress * PHASES.length)
              );
              setActive(idx);
            },
          },
        });

        cleanup = () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      } catch {
        setIntroVisible(false);
      }
    })();
    return () => cleanup?.();
  }, []);

  const rm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section className="mth-section" ref={sectionRef}>
      <style>{css}</style>

      {/* Intro screen (visible before scroll-jack starts) */}
      <div className={`mth-intro ${introVisible ? "is-visible" : ""}`}>
        <span className="mth-intro-label">[ The framework ]</span>
        <h2 className="mth-intro-title">
          The 5 method<span className="mth-dot" aria-hidden="true" />
        </h2>
        <p className="mth-intro-lead">
          Technology accelerates faster every day. Most businesses fall behind. We're the AI specialists who close that gap — a five-phase method that doesn't follow the curve, it bends it.
        </p>
        <p className="mth-intro-phases">
          Discover · Diagnose · Design · Deliver · <span style={{ color: "var(--orange)" }}>Evolve</span>
        </p>
      </div>

      {/* Horizontal scroll track */}
      <div className="mth-track" ref={trackRef}>
        {PHASES.map((p, i) => (
          <article
            key={p.n}
            className={`mth-slide ${i === active ? "is-active" : ""}`}
            style={{ width: `${SLIDE_W}vw` } as React.CSSProperties}
            data-accent={p.accent}
          >
            <span className="mth-watermark" aria-hidden="true">{p.n}</span>
            <div className="mth-slide-inner">
              <span className="mth-phase-n">Phase {p.n}</span>
              <h3 className="mth-phase-title">
                {p.title}
                <span className="mth-dot" aria-hidden="true" />
              </h3>
              <div className="mth-divider" style={{ background: p.accent }} />
              <p className="mth-headline">{p.headline}</p>
              <ul className="mth-bullets">
                {p.notes.map((note, j) => (
                  <li key={j} className="mth-bullet">
                    <span className="mth-bullet-bar" style={{ background: p.accent }} />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      {/* Fixed progress indicator */}
      <div className="mth-progress" aria-hidden={rm ? "true" : undefined}>
        <svg viewBox="0 0 740 100" className="mth-progress-svg">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <circle
                cx={20 + i * 175}
                cy={50}
                r={9}
                fill={i <= active ? PHASES[i].accent : "transparent"}
                stroke={i <= active ? PHASES[i].accent : "rgba(255,255,255,0.15)"}
                strokeWidth={1.5}
                style={{ transition: "fill 0.4s, stroke 0.4s" }}
              />
              {i < 4 && (
                <rect
                  x={39 + i * 175}
                  y={49.25}
                  width={i < active ? 137 : i === active ? 137 * ((active - i + 1) * PHASES.length - (active - i)) / PHASES.length : 0}
                  height={1.5}
                  rx={0.75}
                  fill={PHASES[i].accent}
                  style={{ transition: "width 0.4s" }}
                />
              )}
            </g>
          ))}
        </svg>
        <div className="mth-progress-labels">
          {PHASES.map((p, i) => (
            <span
              key={p.n}
              className="mth-progress-label"
              style={{
                left: `${(i / (PHASES.length - 1)) * 100}%`,
                color: i === active ? p.accent : undefined,
                transition: "color 0.4s",
              }}
            >
              {p.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const css = `
.mth-section { position: relative; z-index: 4; }

/* Intro screen */
.mth-intro { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; justify-content: center; padding-left: clamp(32px, 8vw, 120px); opacity: 0; transition: opacity 0.5s; pointer-events: none; }
.mth-intro.is-visible { opacity: 1; pointer-events: auto; }
.mth-intro-label { font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 16px; }
.mth-intro-title { font-family: var(--font-display); font-size: clamp(54px, 8.5vw, 111px); font-weight: 700; letter-spacing: -0.04em; line-height: 1; color: var(--text); margin-bottom: 24px; }
.mth-intro-lead { max-width: 560px; font-size: clamp(16px, 1.8vw, 20px); line-height: 1.6; color: var(--text-muted); margin-bottom: 20px; }
.mth-intro-phases { font-family: var(--font-mono); font-size: clamp(12px, 1.2vw, 14px); font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dim); }

/* Period dot */
.mth-dot { display: inline-block; width: 0.18em; height: 0.18em; border-radius: 50%; background: currentColor; margin-left: 0.02em; vertical-align: baseline; }

/* Horizontal track */
.mth-track { display: flex; width: fit-content; will-change: transform; }

/* Each phase slide */
.mth-slide { position: relative; flex-shrink: 0; height: 100vh; display: flex; align-items: center; overflow: hidden; border-left: 1px solid var(--border-soft); }
.mth-slide:first-child { border-left: none; }
.mth-slide-inner { position: relative; z-index: 2; padding: clamp(32px, 5vw, 80px) clamp(24px, 4vw, 60px); max-width: 640px; }

/* Ghost watermark number */
.mth-watermark { position: absolute; right: clamp(24px, 4vw, 48px); top: 50%; transform: translateY(-50%); font-family: var(--font-display); font-size: clamp(200px, 30vh, 400px); font-weight: 700; color: var(--text); opacity: 0.04; line-height: 0.8; letter-spacing: -0.05em; pointer-events: none; user-select: none; }

/* Phase content */
.mth-phase-n { font-family: var(--font-mono); font-size: 13px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mth-accent, var(--orange)); }
.mth-phase-title { font-family: var(--font-display); font-size: clamp(56px, 10vw, 150px); font-weight: 700; letter-spacing: -0.04em; line-height: 0.92; color: var(--text); margin: 14px 0 20px; }
.mth-divider { width: 120px; height: 0.5px; margin-bottom: 24px; }
.mth-headline { font-family: var(--font-display); font-size: clamp(18px, 2vw, 26px); font-weight: 500; line-height: 1.4; color: var(--text-muted); margin-bottom: 28px; max-width: 52ch; }
.mth-bullets { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 16px; }
.mth-bullet { display: flex; align-items: flex-start; gap: 14px; font-size: clamp(15px, 1.5vw, 20px); line-height: 1.5; color: var(--text-muted); }
.mth-bullet-bar { display: block; width: 12px; height: 0.5px; flex-shrink: 0; margin-top: 0.7em; }

/* Progress indicator */
.mth-progress { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); z-index: 20; pointer-events: none; width: clamp(200px, 40vw, 340px); }
.mth-progress-svg { width: 100%; height: auto; }
.mth-progress-labels { position: relative; margin-top: 4px; height: 14px; }
.mth-progress-label { position: absolute; transform: translateX(-50%); font-family: var(--font-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-dim); white-space: nowrap; transition: color 0.4s; }

/* Responsive: static fallback on mobile */
@media (max-width: 900px) {
  .mth-section { overflow: visible; }
  .mth-intro { position: static; height: auto; padding: var(--section-pad) var(--gutter); opacity: 1; pointer-events: auto; }
  .mth-track { flex-direction: column; width: 100%; }
  .mth-slide { width: 100% !important; height: auto; min-height: auto; padding: clamp(40px, 7vh, 72px) 0; border-left: none; border-top: 1px solid var(--border-soft); }
  .mth-watermark { display: none; }
  .mth-progress { display: none; }
}
@media (max-width: 600px) {
  .mth-phase-title { font-size: clamp(40px, 14vw, 60px); }
  .mth-bullet { font-size: 15px; }
}
`;
