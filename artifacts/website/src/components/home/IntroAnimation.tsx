import { useEffect, useState } from "react";

export function IntroAnimation() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Skip on mobile, reduced-motion, or repeat visits
    const skip =
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      sessionStorage.getItem("ahos_intro_seen");

    if (skip) {
      setVisible(false);
      return;
    }

    sessionStorage.setItem("ahos_intro_seen", "1");

    let raf = 0;
    let start = 0;
    const duration = 2200;

    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);

      setProgress(Math.round(eased * 100));
      setPhase(Math.min(4, Math.floor(eased * 5)));

      if (p < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setTimeout(() => setVisible(false), 400);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  const phases = ["DISCOVER", "DESIGN", "BUILD", "LAUNCH", "EVOLVE"];

  return (
    <div className="intro-overlay" aria-hidden="true">
      <style>{css}</style>
      <div className="intro-counter">
        <span className="intro-num">{String(progress).padStart(3, "0")}</span>
        <span className="intro-pct">%</span>
      </div>
      <div className="intro-dots">
        {phases.map((name, i) => (
          <div key={name} className="intro-dot-group">
            <span className={`intro-dot ${i <= phase ? "is-active" : ""}`} />
            <span className="intro-dot-label">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const css = `
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  animation: intro-fade 0.4s ease-in-out 2.6s forwards;
}
.intro-counter {
  display: flex;
  align-items: baseline;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--text);
}
.intro-num {
  font-size: clamp(54px, 8.5vw, 111px);
  line-height: 1;
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
.intro-pct {
  font-size: clamp(28px, 3.5vw, 40px);
  color: var(--text-dim);
  margin-left: 4px;
}
.intro-dots {
  display: flex;
  align-items: flex-start;
  gap: clamp(16px, 3vw, 48px);
  margin-top: clamp(40px, 5vw, 56px);
}
.intro-dot-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.intro-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
}
.intro-dot.is-active {
  background: var(--orange);
  border-color: var(--orange);
  box-shadow: 0 0 10px var(--orange-glow);
}
.intro-dot-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
}
@keyframes intro-fade {
  to { opacity: 0; pointer-events: none; }
}
@media (prefers-reduced-motion: reduce) {
  .intro-overlay { display: none; }
}
`;
