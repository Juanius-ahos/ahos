import { Reveal } from "../motion";

const points = [
  {
    k: "01",
    title: "One team, idea to launch",
    body: "Strategy, design, and engineering under one roof — no agency relay race, no finger-pointing when something breaks. The people who scope your project are the ones who ship it.",
  },
  {
    k: "02",
    title: "You own everything",
    body: "100% of the source code, assets, and IP are yours on delivery. No proprietary lock-in, no license traps, no hostage situations. Walk away any time — you won't need to.",
  },
  {
    k: "03",
    title: "Fixed price, in writing",
    body: "A clear quote and milestone plan before we start. You know the number and the dates up front. No hourly meter, no surprise invoices, no scope-creep games.",
  },
  {
    k: "04",
    title: "Built to perform, not just look good",
    body: "Fast, accessible, SEO-tuned, and measured. We build products that convert visitors and earn their keep — and we can prove it with the numbers after launch.",
  },
  {
    k: "05",
    title: "We don't disappear at launch",
    body: "Every build ships with a 30-day warranty. After that, care plans and growth retainers keep your product fast, secure, and improving — we stay your team, not a vendor.",
  },
  {
    k: "06",
    title: "Senior craft, sane rates",
    body: "A lean, senior team based in Beirut serving founders in the US, Gulf, and Europe — world-class work without agency-of-record overhead priced into every invoice.",
  },
];

/** Trust / differentiator block — the reasons a founder with a budget chooses
 *  AHOS over a freelancer or a bloated agency. Answers "why you?" head-on. */
export function WhyAhos() {
  return (
    <section className="wa ed ed-sec" data-accent="255,120,40">
      <style>{css}</style>
      <div className="wa-head">
        <Reveal dir="left">
          <span className="ed-label">
            <span className="ed-label-line" /><span className="ed-label-text">Why AHOS</span>
          </span>
        </Reveal>
        <Reveal>
          <h2 className="ed-h2">Serious work,<br />without the agency circus.</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="wa-sub">Most studios make you choose between a cheap freelancer who ghosts you and a bloated agency that bills you for meetings. We're the third option.</p>
        </Reveal>
      </div>

      <div className="wa-grid">
        {points.map((p, i) => (
          <Reveal key={p.k} delay={i * 60} className="wa-card">
            <span className="wa-k">{p.k}</span>
            <h3 className="wa-title">{p.title}</h3>
            <p className="wa-body">{p.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const css = `
.wa-head { margin-bottom: clamp(40px, 5vw, 64px); max-width: 40ch; }
.wa-sub { margin-top: 20px; font-size: clamp(15px, 1.3vw, 17px); line-height: 1.6; color: var(--text-muted); }
.wa-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); border-radius: var(--radius-xl); overflow: hidden; }
.wa-card { background: var(--bg); padding: clamp(28px, 3vw, 40px); transition: background 0.3s ease; }
.wa-card:hover { background: var(--bg-2); }
.wa-k { font-family: var(--font-mono); font-size: 12px; font-weight: 500; color: var(--orange); letter-spacing: 0.05em; }
.wa-title { font-family: var(--font-display); font-size: clamp(19px, 1.9vw, 24px); font-weight: 600; letter-spacing: -0.02em; margin: 14px 0 12px; line-height: 1.15; }
.wa-body { font-size: 14px; line-height: 1.65; color: var(--text-muted); }

@media (max-width: 900px) { .wa-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .wa-grid { grid-template-columns: 1fr; } }
`;

