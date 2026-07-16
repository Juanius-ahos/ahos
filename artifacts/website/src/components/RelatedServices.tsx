import { Link } from "wouter";
import { otherServices } from "../data/services";

/**
 * Contextual cross-links between sibling service pages. Strengthens internal
 * linking (keyword-rich anchors pointing at the other service pages) and gives
 * visitors an obvious next step. Rendered near the foot of every service page.
 */
export function RelatedServices({ current }: { current: string }) {
  const items = otherServices(current);
  return (
    <section className="rs ed ed-sec" aria-labelledby="rs-heading">
      <style>{css}</style>
      <div className="rs-head">
        <span className="ed-label">
          <span className="ed-label-line" /><span className="ed-label-text">Explore more</span>
        </span>
        <h2 id="rs-heading" className="ed-h2">Other things we build</h2>
      </div>
      <div className="rs-grid">
        {items.map((s) => (
          <Link key={s.href} href={s.href} className="rs-card">
            <span className="rs-card-name">{s.label}</span>
            <span className="rs-card-blurb">{s.blurb}</span>
            <span className="rs-card-arrow" aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

const css = `
.rs-head { margin-bottom: 28px; }
.rs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.rs-card {
  position: relative; display: flex; flex-direction: column; gap: 4px;
  padding: 20px 22px; border-radius: var(--radius-lg);
  background: var(--bg-card); border: 1px solid var(--border);
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}
.rs-card:hover { border-color: var(--border-hover); background: var(--bg-2); transform: translateY(-2px); }
.rs-card-name { font-family: var(--font-display); font-size: 17px; font-weight: 600; letter-spacing: -0.02em; color: var(--text); }
.rs-card-blurb { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
.rs-card-arrow { position: absolute; top: 18px; right: 20px; color: var(--text-faint); transition: transform 0.2s ease, color 0.2s ease; }
.rs-card:hover .rs-card-arrow { color: var(--orange); transform: translateX(3px); }

@media (max-width: 860px) { .rs-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .rs-grid { grid-template-columns: 1fr; } }
`;
