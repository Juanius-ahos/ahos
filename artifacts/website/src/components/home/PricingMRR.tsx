import { Link } from "wouter";
import { Reveal } from "../motion";

const tiers = [
  {
    name: "Custom Build",
    price: "Custom quote",
    tagline: "For founders building something real.",
    desc: "Custom software, SaaS platforms, mobile apps, AI tools, and Web3. Scoped to your business, architected to scale, delivered in milestones.",
    features: ["SaaS & web apps", "Mobile (iOS / Android)", "AI & automation", "Web3 & smart contracts"],
    cta: "Scope my project",
    href: "/contact",
    flagship: true,
  },
  {
    name: "Growth",
    price: "From $800",
    tagline: "Most projects start here.",
    desc: "Conversion-focused websites and online stores — multi-page sites, e-commerce, and web apps built to bring in and convert real customers.",
    features: ["Business websites", "E-commerce stores", "CMS & analytics", "SEO built in"],
    cta: "Start a project",
    href: "/contact",
    popular: true,
  },
  {
    name: "Launch",
    price: "From $300",
    tagline: "Get online, fast.",
    desc: "A sharp, custom landing page or single-purpose site — live in days, not weeks. The fastest way to look legit and start capturing leads.",
    features: ["Landing pages", "Custom design", "Contact & forms", "Live in 2–3 days"],
    cta: "Launch fast",
    href: "/pricing",
  },
];

/** Repositioned pricing: the flagship Custom tier anchors the page, the cheap
 *  "Launch" tier is the entry — not the identity. Plus the recurring-revenue
 *  offer (care & growth plans) that turns one-off projects into MRR. */
export function PricingMRR() {
  return (
    <section className="pm ed ed-sec" data-accent="255,106,26">
      <style>{css}</style>
      <div className="pm-head">
        <Reveal dir="left">
          <span className="ed-label">
            <span className="ed-label-line" /><span className="ed-label-text">Pricing</span>
          </span>
        </Reveal>
        <Reveal>
          <h2 className="ed-h2">The best money<br />you'll spend this quarter.</h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="pm-sub">Fixed price, in writing, before we start. Milestone payments, 100% code ownership, and a 30-day warranty on every build.</p>
        </Reveal>
      </div>

      <div className="pm-grid">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 80} className={`pm-card ${t.flagship ? "is-flagship" : ""} ${t.popular ? "is-popular" : ""}`}>
            {t.popular && <span className="pm-badge">Most popular</span>}
            <div className="pm-card-top">
              <h3 className="pm-name">{t.name}</h3>
              <div className="pm-price">{t.price}</div>
              <p className="pm-tagline">{t.tagline}</p>
            </div>
            <p className="pm-desc">{t.desc}</p>
            <ul className="pm-features">
              {t.features.map((f) => (
                <li key={f}><span className="pm-check" aria-hidden="true">✓</span>{f}</li>
              ))}
            </ul>
            <Link href={t.href} className={`pm-cta ${t.flagship ? "pm-cta-solid" : ""}`}>{t.cta} <span aria-hidden="true">↗</span></Link>
          </Reveal>
        ))}
      </div>

      {/* Recurring revenue — the MRR pitch */}
      <Reveal delay={120}>
        <div className="pm-mrr">
          <div className="pm-mrr-tx">
            <span className="pm-mrr-eyebrow">After launch</span>
            <h3 className="pm-mrr-title">We don't hand you the keys and vanish.</h3>
            <p className="pm-mrr-body">Care &amp; growth plans keep your product fast, secure, and improving — hosting, monitoring, updates, and a monthly block of improvements. Most clients stay, because momentum is where the real growth happens.</p>
          </div>
          <Link href="/contact" className="pm-mrr-cta">Ask about care plans <span aria-hidden="true">→</span></Link>
        </div>
      </Reveal>
    </section>
  );
}

const css = `
.pm-head { margin-bottom: clamp(40px, 5vw, 64px); max-width: 42ch; }
.pm-sub { margin-top: 20px; font-size: clamp(15px, 1.3vw, 17px); line-height: 1.6; color: var(--text-muted); }

.pm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.pm-card { position: relative; display: flex; flex-direction: column; padding: clamp(26px, 2.6vw, 38px); border-radius: var(--radius-xl); background: var(--bg-card); border: 1px solid var(--border); transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; }
.pm-card:hover { border-color: var(--border-hover); transform: translateY(-3px); }
.pm-card.is-flagship { background: linear-gradient(160deg, rgba(255,106,26,0.08), var(--bg-card) 42%); border-color: var(--border-hover); }
.pm-card.is-popular { box-shadow: 0 24px 60px rgba(0,0,0,0.35); }
.pm-badge { position: absolute; top: 18px; right: 18px; padding: 5px 11px; border-radius: 999px; background: var(--orange); color: #0a0a0b; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
.pm-name { font-family: var(--font-display); font-size: 15px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-dim); }
.pm-price { font-family: var(--font-display); font-size: clamp(30px, 3.6vw, 44px); font-weight: 700; letter-spacing: -0.03em; margin: 10px 0 6px; }
.pm-tagline { font-size: 13.5px; color: var(--orange); font-weight: 500; }
.pm-desc { margin: 20px 0; font-size: 14px; line-height: 1.6; color: var(--text-muted); }
.pm-features { list-style: none; display: flex; flex-direction: column; gap: 9px; margin-bottom: 26px; }
.pm-features li { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: var(--text); }
.pm-check { display: grid; place-items: center; width: 18px; height: 18px; border-radius: 50%; background: var(--orange-soft); color: var(--orange); font-size: 10px; font-weight: 700; flex-shrink: 0; }
.pm-cta { margin-top: auto; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 20px; border-radius: 999px; border: 1px solid var(--border-hover); color: var(--text); font-size: 13.5px; font-weight: 600; transition: all 0.25s; }
.pm-cta:hover { background: var(--orange-soft); color: var(--orange); }
.pm-cta-solid { background: var(--orange); color: #0a0a0b; border-color: var(--orange); box-shadow: 0 8px 26px rgba(255,106,26,0.28); }
.pm-cta-solid:hover { background: var(--orange-light); color: #0a0a0b; }

.pm-mrr { display: flex; align-items: center; justify-content: space-between; gap: clamp(24px, 4vw, 56px); flex-wrap: wrap; margin-top: 22px; padding: clamp(28px, 3.4vw, 48px); border-radius: var(--radius-xl); background: var(--bg-2); border: 1px solid var(--border-soft); }
.pm-mrr-tx { max-width: 62ch; }
.pm-mrr-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--orange); }
.pm-mrr-title { font-family: var(--font-display); font-size: clamp(22px, 2.6vw, 34px); font-weight: 600; letter-spacing: -0.025em; margin: 12px 0 14px; line-height: 1.1; }
.pm-mrr-body { font-size: 14.5px; line-height: 1.65; color: var(--text-muted); }
.pm-mrr-cta { flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px; padding: 14px 24px; border-radius: 999px; background: var(--bg-card); border: 1px solid var(--border-hover); color: var(--text); font-size: 14px; font-weight: 600; transition: all 0.25s; }
.pm-mrr-cta:hover { background: var(--orange); color: #0a0a0b; border-color: var(--orange); }

@media (max-width: 900px) { .pm-grid { grid-template-columns: 1fr; } .pm-mrr { flex-direction: column; align-items: flex-start; } }
`;
