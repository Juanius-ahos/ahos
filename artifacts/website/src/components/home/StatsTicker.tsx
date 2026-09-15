import { SparkleBorder } from "./SparkleBorder";

const STATS = [
  { value: "Since 2023", label: "" },
  { value: "50+", label: "projects shipped" },
  { value: "Beirut →", label: "worldwide" },
  { value: "★ 5.0", label: "Trustpilot" },
];

export function StatsTicker() {
  const rm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pause = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; };
  const resume = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = ""; };

  return (
    <section className="tk-section" aria-label="AHOS at a glance">
      <style>{css}</style>

      {/* Stats bar with sparkle border */}
      <div className="tk-stats-wrap">
        <SparkleBorder />
        <div className="tk-stats">
          {STATS.map((s, i) => (
            <span key={i} className="tk-stat">
              <span className="tk-stat-val">{s.value}</span>
              {s.label && <span className="tk-stat-label">{s.label}</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Scrolling ticker */}
      <div className="tk-row">
        <div className="tk-inner" onMouseEnter={pause} onMouseLeave={resume}>
          {[
            "SINCE 2023",
            "50+ PROJECTS SHIPPED",
            "★ 5.0 ON TRUSTPILOT",
            "BEIRUT → WORLDWIDE",
            "100% CODE OWNERSHIP",
            "24H AVG FIRST REPLY",
            "FIXED QUOTES, NO SURPRISES",
          ].flatMap((item) => [item, item]).map((item, i) => (
            <span key={i} className="tk-item">
              <span className="tk-dot" aria-hidden="true" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const css = `
.tk-section { border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); background: var(--bg-2); overflow: hidden; }

/* Stats bar */
.tk-stats-wrap { position: relative; margin: 0 clamp(16px, 3vw, 48px); padding: clamp(16px, 2.5vw, 28px) clamp(24px, 3vw, 40px); }
.tk-stats { display: flex; align-items: center; justify-content: center; gap: clamp(16px, 3vw, 40px); flex-wrap: wrap; }
.tk-stat { display: inline-flex; align-items: baseline; gap: 6px; white-space: nowrap; }
.tk-stat-val { font-family: var(--font-display); font-size: clamp(16px, 2vw, 24px); font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
.tk-stat-label { font-family: var(--font-mono); font-size: clamp(11px, 1.1vw, 13px); font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-dim); }

/* Scrolling ticker */
.tk-row { display: flex; overflow: hidden; border-top: 1px solid var(--border-soft); }
.tk-inner { display: flex; flex-shrink: 0; align-items: center; animation: tk-scroll 34s linear infinite; }
.tk-item { display: inline-flex; align-items: center; white-space: nowrap; padding: 15px 0; font-family: var(--font-mono); font-size: clamp(11px, 1.1vw, 13px); font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-dim); }
.tk-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--orange); margin: 0 clamp(22px, 3vw, 44px); flex-shrink: 0; box-shadow: 0 0 8px var(--orange-glow); }
.tk-row:hover .tk-inner { animation-play-state: paused; }
@keyframes tk-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@media (max-width: 600px) {
  .tk-inner { animation-duration: 44s; }
  .tk-stats { gap: 12px 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .tk-inner { animation: none; }
}
`;
