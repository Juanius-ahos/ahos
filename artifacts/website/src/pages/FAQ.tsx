import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { FAQSchema } from "../seo/FAQSchema";
import { faqCategories, allFaqItems } from "../data/faq";
import { Reveal } from "../components/motion";

export default function FAQ() {
  const [cat, setCat] = useState(faqCategories[0].category);
  const [open, setOpen] = useState<string | null>(faqCategories[0].items[0].question);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const items = faqCategories.find((c) => c.category === cat)?.items || [];

  return (
    <>
      <SEOHead
        title="FAQ — Answers on Process, Pricing & Timelines"
        description="Straight answers about how AHOS works — services, timelines, pricing, code ownership, Web3, AI, and support. No jargon."
        path="/faq"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "FAQ", url: "/faq" }]} />
      <FAQSchema items={allFaqItems} />

      <style>{css}</style>
      <div className="ed-bg" aria-hidden="true" />

      <header className="ed ed-page-hero">
        <Reveal className="ed-label" y={12}>
          <span className="ed-label-n">00</span><span className="ed-label-line" /><span className="ed-label-text">Support</span>
        </Reveal>
        <Reveal delay={80}><h1 className="ed-h1">No fluff.<br /><em>Straight answers.</em></h1></Reveal>
        <Reveal delay={160}><p className="ed-lead">Everything people actually ask before they hit "start a project." Can't find it? Email us — a human replies.</p></Reveal>
      </header>

      <section className="ed ed-sec">
        <div className="faq-grid">
          <aside className="faq-nav">
            {faqCategories.map((c) => (
              <button
                key={c.category}
                className={`faq-cat ${cat === c.category ? "is-active" : ""}`}
                onClick={() => { setCat(c.category); setOpen(c.items[0].question); }}
              >
                <span>{c.category}</span>
                <span className="faq-cat-count">{c.items.length}</span>
              </button>
            ))}
          </aside>

          <div className="faq-list">
            {items.map((it, i) => {
              const isOpen = open === it.question;
              return (
                <Reveal key={it.question} delay={i * 40}>
                  <div className={`faq-item ${isOpen ? "is-open" : ""}`}>
                    <button className="faq-q" onClick={() => setOpen(isOpen ? null : it.question)} aria-expanded={isOpen}>
                      <span>{it.question}</span>
                      <span className="faq-icon" aria-hidden="true" />
                    </button>
                    <div className="faq-a-wrap"><div className="faq-a">{it.answer}</div></div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ed ed-sec faq-cta">
        <Reveal>
          <h2 className="ed-h2">Still wondering?</h2>
          <p className="ed-lead" style={{ margin: "18px 0 30px" }}>Skip the form. Tell us what you're building and we'll tell you straight whether we're the right team for it.</p>
          <div className="faq-cta-row">
            <Link href="/contact" className="ed-btn">Start a project<span>↗</span></Link>
            <a href="mailto:info@ahos.xyz" className="ed-link-arrow">info@ahos.xyz</a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}

const css = `
.faq-grid { display: grid; grid-template-columns: 240px 1fr; gap: clamp(32px, 6vw, 80px); align-items: start; }
.faq-nav { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 4px; }
.faq-cat { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px; border-radius: 10px; background: none; border: 1px solid transparent; color: var(--text-dim); font-family: var(--font-sans); font-size: 14.5px; font-weight: 600; text-align: left; cursor: pointer; transition: color 0.2s, background 0.2s, border-color 0.2s; }
.faq-cat:hover { color: var(--text); }
.faq-cat.is-active { color: var(--text); background: var(--orange-soft); border-color: var(--border-hover); }
.faq-cat-count { font-size: 11px; font-weight: 600; color: var(--text-faint); }
.faq-cat.is-active .faq-cat-count { color: var(--orange); }

.faq-list { border-top: 1px solid var(--border-soft); }
.faq-item { border-bottom: 1px solid var(--border-soft); }
.faq-q { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 24px 4px; background: none; border: none; cursor: pointer; text-align: left; font-family: var(--font-display); font-size: clamp(17px, 1.8vw, 22px); font-weight: 600; letter-spacing: -0.01em; color: var(--text); transition: color 0.2s; }
.faq-q:hover { color: var(--orange); }
.faq-icon { position: relative; flex-shrink: 0; width: 18px; height: 18px; }
.faq-icon::before, .faq-icon::after { content: ""; position: absolute; background: var(--orange); border-radius: 2px; transition: transform 0.3s ease, opacity 0.3s; }
.faq-icon::before { top: 8px; left: 0; width: 18px; height: 2px; }
.faq-icon::after { top: 0; left: 8px; width: 2px; height: 18px; }
.faq-item.is-open .faq-icon::after { transform: rotate(90deg); opacity: 0; }
.faq-a-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.36s cubic-bezier(0.4,0,0.2,1); }
.faq-item.is-open .faq-a-wrap { grid-template-rows: 1fr; }
.faq-a { overflow: hidden; color: var(--text-muted); font-size: 15px; line-height: 1.75; }
.faq-item.is-open .faq-a { padding: 0 4px 26px; }

.faq-cta-row { display: flex; align-items: center; gap: 26px; flex-wrap: wrap; }

@media (max-width: 760px) {
  .faq-grid { grid-template-columns: 1fr; gap: 28px; }
  .faq-nav { position: static; flex-direction: row; flex-wrap: wrap; }
  .faq-cat { flex: 0 0 auto; }
}
`;
