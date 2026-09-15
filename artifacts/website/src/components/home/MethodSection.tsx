import { Reveal } from "../motion";
import { GhostHeading } from "./GhostHeading";

const PHASES = [
  { n: "01", title: "Discover", ghost: "DISCOVER", accent: "#ff6a1a", headline: "80% of tech projects fail because no one asked the right question.", notes: ["We don't start at the solution — we start at the uncomfortable truth", "How your business actually runs, not the org-chart version", "Clarity before code"] },
  { n: "02", title: "Diagnose", ghost: "DIAGNOSE", accent: "#ff8c4a", headline: "If it can't be measured, it doesn't exist.", notes: ["Every friction, bottleneck, and silent leak — mapped", "An executive diagnosis few consultants will sign their name to", "Quantified truth. Zero opinions."] },
  { n: "03", title: "Design", ghost: "DESIGN", accent: "#e0560a", headline: "We don't prescribe software. We prescribe outcomes.", notes: ["Every architectural decision tied to a business KPI", "If it doesn't move the needle, it doesn't make the plan", "Blueprint, not buzzwords"] },
  { n: "04", title: "Deliver", ghost: "DELIVER", accent: "#ffb074", headline: "Code without adoption is debt with ego.", notes: ["Victory isn't deploy — it's your team running it without us", "Understood without a manual. Improved without permission.", "Adoption, not delivery"] },
  { n: "05", title: "Evolve", ghost: "EVOLVE", accent: "#cc5500", headline: "What doesn't evolve is already dying.", notes: ["While most invoice and disappear, we stay", "Your business changes every quarter — your tech has to match", "Partnership, not project"] },
];

export function MethodSection() {
  const cardCount = 1 + PHASES.length;
  return (
    <section className="mth-section">
      <div className="mth-stack" style={{ height: `${cardCount * 100}vh` } as React.CSSProperties}>
        <div className="mth-card">
          <GhostHeading variant="outline" from="right" className="mth-ghost" style={{ WebkitTextStrokeColor: "var(--border-hover)" }}>METHOD</GhostHeading>
          <div className="mth-inner">
            <div className="ed-label">
              <span className="ed-label-n">01</span>
              <span className="ed-label-line" />
              <span className="ed-label-text">The framework</span>
            </div>
            <h2 className="ed-h2 mth-intro-h">The 5 method.</h2>
            <p className="ed-lead mth-intro-lead">
              Technology accelerates faster every day. Most businesses fall behind. We're the AI specialists who close that gap — a five-phase method that doesn't follow the curve, it bends it.
            </p>
            <p className="mth-intro-sub">Discover · Diagnose · Design · Deliver · Evolve</p>
          </div>
        </div>

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
              <Reveal delay={120}><p className="mth-headline">{p.headline}</p></Reveal>
              <ul className="mth-notes">
                {p.notes.map((note, j) => (
                  <Reveal key={note} delay={180 + j * 70}>
                    <li className="mth-note">
                      <span className="mth-note-tick" aria-hidden="true">—</span>
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
