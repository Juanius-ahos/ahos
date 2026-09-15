const PHASES = [
  { n: "01", title: "Discover", accent: "#ff6a1a", headline: "80% of tech projects fail because no one asked the right question.", notes: ["We don't start at the solution — we start at the uncomfortable truth", "How your business actually runs, not the org-chart version", "Clarity before code"] },
  { n: "02", title: "Diagnose", accent: "#ff8c4a", headline: "If it can't be measured, it doesn't exist.", notes: ["Every friction, bottleneck, and silent leak — mapped", "An executive diagnosis few consultants will sign their name to", "Quantified truth. Zero opinions."] },
  { n: "03", title: "Design", accent: "#e0560a", headline: "We don't prescribe software. We prescribe outcomes.", notes: ["Every architectural decision tied to a business KPI", "If it doesn't move the needle, it doesn't make the plan", "Blueprint, not buzzwords"] },
  { n: "04", title: "Deliver", accent: "#ffb074", headline: "Code without adoption is debt with ego.", notes: ["Victory isn't deploy — it's your team running it without us", "Understood without a manual. Improved without permission.", "Adoption, not delivery"] },
  { n: "05", title: "Evolve", accent: "#cc5500", headline: "What doesn't evolve is already dying.", notes: ["While most invoice and disappear, we stay", "Your business changes every quarter — your tech has to match", "Partnership, not project"] },
];

export function MethodSection() {
  return (
    <section className="mth-section">
      <style>{css}</style>
      <div className="ed">
        <div className="mth-header">
          <span className="ed-label">
            <span className="ed-label-n">03</span>
            <span className="ed-label-line" />
            <span className="ed-label-text">The framework</span>
          </span>
          <h2 className="ed-h2">The 5 method.</h2>
          <p className="mth-lead">
            Technology accelerates faster every day. Most businesses fall behind. We're the AI specialists who close that gap — a five-phase method that doesn't follow the curve, it bends it.
          </p>
          <p className="mth-phases">
            Discover · Diagnose · Design · Deliver · <span style={{ color: "var(--orange)" }}>Evolve</span>
          </p>
        </div>

        <div className="mth-grid">
          {PHASES.map((p) => (
            <article key={p.n} className="mth-card">
              <div className="mth-card-accent" style={{ background: p.accent }} />
              <span className="mth-card-n">{p.n}</span>
              <h3 className="mth-card-title">{p.title}</h3>
              <p className="mth-card-headline">{p.headline}</p>
              <ul className="mth-card-bullets">
                {p.notes.map((note, j) => (
                  <li key={j} className="mth-card-bullet">
                    <span className="mth-card-bar" style={{ background: p.accent }} />
                    {note}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const css = `
.mth-section {
  padding: var(--section-pad) 0;
  border-top: 1px solid var(--border-soft);
  background: var(--bg);
}
.mth-header { margin-bottom: clamp(40px, 6vw, 72px); }
.mth-lead { margin-top: 18px; font-size: clamp(15px, 1.6vw, 19px); line-height: 1.7; color: var(--text-muted); max-width: 560px; }
.mth-phases { margin-top: 16px; font-family: var(--font-mono); font-size: clamp(12px, 1.2vw, 14px); font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dim); }

.mth-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1px; background: var(--border-soft); border: 0.5px solid var(--border-soft); border-radius: var(--radius-lg); overflow: hidden; }
.mth-card { position: relative; background: var(--bg-card); padding: clamp(28px, 4vw, 44px) clamp(24px, 3vw, 36px); }
.mth-card-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; }
.mth-card-n { font-family: var(--font-mono); font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-faint); }
.mth-card-title { font-family: var(--font-display); font-size: clamp(28px, 3.5vw, 44px); font-weight: 700; letter-spacing: -0.03em; color: var(--text); margin: 12px 0 16px; }
.mth-card-headline { font-size: clamp(14px, 1.3vw, 16px); line-height: 1.6; color: var(--text-muted); margin-bottom: 20px; }
.mth-card-bullets { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 12px; }
.mth-card-bullet { display: flex; align-items: flex-start; gap: 12px; font-size: clamp(13px, 1.2vw, 15px); line-height: 1.5; color: var(--text-dim); }
.mth-card-bar { display: block; width: 10px; height: 0.5px; flex-shrink: 0; margin-top: 0.7em; }

@media (max-width: 600px) {
  .mth-grid { grid-template-columns: 1fr; }
  .mth-card-title { font-size: clamp(24px, 7vw, 32px); }
}
`;
