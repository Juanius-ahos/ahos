/**
 * Continuous stats ticker under the hero, weevolveit-style, but with only real
 * AHOS facts (no fabricated years/project counts). Reuses the marquee loop
 * (mq-scroll keyframe) with its own compact .tk-* styling.
 */
const ITEMS = [
  "SINCE 2023",
  "50+ PROJECTS SHIPPED",
  "★ 5.0 ON TRUSTPILOT",
  "BEIRUT → WORLDWIDE",
  "100% CODE OWNERSHIP",
  "24H AVG FIRST REPLY",
  "FIXED QUOTES, NO SURPRISES",
];

export function StatsTicker() {
  const rm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pause = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; };
  const resume = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = ""; };

  return (
    <section className="tk-section" aria-label="AHOS at a glance">
      <div className="tk-row">
        <div className="tk-inner" onMouseEnter={pause} onMouseLeave={resume}>
          {[...ITEMS, ...ITEMS].map((item, i) => (
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
