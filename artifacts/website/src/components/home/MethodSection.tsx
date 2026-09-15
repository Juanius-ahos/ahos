import { Reveal } from "../motion";
import { GhostHeading } from "./GhostHeading";

/**
 * The five-phase method, rendered as a scroll-jacked stack: each phase is a
 * full opaque screen that wipes up over the previous one (same choreography as
 * the services stack). Behind each phase sits a giant ghosted word. Content is
 * a truthful, more granular telling of the AHOS process, no invented services,
 * no em-dashes.
 */
const PHASES = [
  { n: "01", title: "Discover", ghost: "DISCOVER", accent: "#ff6a1a", notes: ["Free consultation, no commitment", "We map goals, scope, and risks", "You get a fixed-price quote in writing"] },
  { n: "02", title: "Design", ghost: "DESIGN", accent: "#ff8c4a", notes: ["UX flows, then pixel-tight UI", "A clickable direction to react to", "You sign off before a line of code"] },
  { n: "03", title: "Build", ghost: "BUILD", accent: "#e0560a", notes: ["Clean, documented, tested code", "Milestone demos as it takes shape", "No black box, you watch it grow"] },
  { n: "04", title: "Launch", ghost: "LAUNCH", accent: "#ffb074", notes: ["Deploy, QA, and load-check", "Analytics and SEO wired in", "Full handover, the code is yours"] },
  { n: "05", title: "Evolve", ghost: "EVOLVE", accent: "#cc5500", notes: ["30-day post-launch warranty", "Support when you need a human", "Improvements as your business grows"] },
];

export function MethodSection() {
  const cardCount = 1 + PHASES.length;
  return (
    <section className="mth-section">
      <div className="mth-stack" style={{ height: `${cardCount * 100}vh` } as React.CSSProperties}>
        {/* Intro chapter */}
        <div className="mth-card">
          <GhostHeading variant="outline" from="right" className="mth-ghost" style={{ WebkitTextStrokeColor: "var(--border-hover)" }}>METHOD</GhostHeading>
          <div className="mth-inner">
            <div className="ed-label">
              <span className="ed-label-n">05</span>
              <span className="ed-label-line" />
              <span className="ed-label-text">How we work</span>
            </div>
            <h2 className="ed-h2 mth-intro-h">A five-phase method,<br />idea to live product.</h2>
            <p className="ed-lead mth-intro-lead">
              The same path on every project. You always know what happens next, what it costs, and who owns the result. You do.
            </p>
          </div>
        </div>

        {/* Phases */}
        {PHASES.map((p, i) => (
          <div key={p.n} className="mth-card" data-accent={p.accent}>
            <GhostHeading
              variant="outline"
              from={i % 2 === 0 ? "left" : "right"}
              className="mth-ghost"
              style={{ WebkitTextStrokeColor: "var(--border-hover)" }}
            >
              {p.ghost}
            </GhostHeading>
            <div className="mth-inner" style={{ "--mth-accent": p.accent } as React.CSSProperties}>
              <Reveal><span className="mth-n">Phase {p.n}</span></Reveal>
              <Reveal delay={80}><h3 className="mth-title">{p.title}</h3></Reveal>
              <ul className="mth-notes">
                {p.notes.map((note, j) => (
                  <Reveal key={note} delay={140 + j * 70}>
                    <li className="mth-note">
                      <span className="mth-note-tick" aria-hidden="true">›</span>
                      {note}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
