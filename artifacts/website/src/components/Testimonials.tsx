import { Reveal } from "./motion";

const items = [
  {
    text: "AHOS built SpeeAligner from scratch — clean code, great UI, and they shipped fast. The whole process was straightforward and they were always available. Highly recommend them for any web project.",
    name: "Yorgo",
    role: "SpeeAligner.com",
    trustpilot: "https://www.trustpilot.com/review/ahos.xyz",
  },
  {
    text: "AHOS took our taxi business from a rough idea to a polished iOS app and website. Real-time booking, driver dispatch, secure payments — they handled every layer with care.",
    name: "Khalil",
    role: "Ido Taxi",
  },
  {
    text: "They built our DeFi dashboard and staking platform on Solana. Smart contracts were audited, frontend was clean, and the whole thing shipped on schedule. Professional work.",
    name: "Doran",
    role: "defi.app",
  },
];

export function Testimonials({ id = "testimonials" }: { id?: string }) {
  return (
    <section className="ed ed-sec" id={id}>
      <Reveal className="ed-label" y={12}>
        <span className="ed-label-n" />
        <span className="ed-label-line" />
        <span className="ed-label-text">What clients say</span>
      </Reveal>
      <div className="tm-grid">
        {items.map((t, i) => (
          <Reveal key={t.name} delay={i * 60}>
            <blockquote className="tm-card">
              <div className="tm-stars" aria-label="5 out of 5 stars">
                {"★★★★★"}
              </div>
              <p className="tm-text">"{t.text}"</p>
              <footer className="tm-footer">
                <strong className="tm-name">{t.name}</strong>
                <span className="tm-role">{t.role}</span>
                {t.trustpilot && (
                  <a href={t.trustpilot} target="_blank" rel="noopener noreferrer" className="tm-trustpilot">
                    Verified on Trustpilot ↗
                  </a>
                )}
              </footer>
            </blockquote>
          </Reveal>
        ))}
      </div>
      <style>{css}</style>
    </section>
  );
}

const css = `
.tm-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 32px; }
.tm-card { display: flex; flex-direction: column; gap: 14px; padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border); background: var(--bg-2); margin: 0; }
.tm-stars { color: var(--orange); font-size: 16px; letter-spacing: 2px; }
.tm-text { font-size: 14px; line-height: 1.75; color: var(--text-muted); margin: 0; flex: 1; }
.tm-footer { display: flex; flex-direction: column; gap: 2px; }
.tm-name { font-size: 14px; font-weight: 600; color: var(--text); }
.tm-role { font-size: 12.5px; color: var(--text-dim); }
.tm-trustpilot { font-size: 12px; color: var(--orange); text-decoration: none; margin-top: 4px; transition: opacity 0.2s; }
.tm-trustpilot:hover { opacity: 0.8; }
@media (max-width: 768px) { .tm-grid { grid-template-columns: 1fr; } }
`;
