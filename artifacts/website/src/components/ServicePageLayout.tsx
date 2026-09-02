import { Link } from "wouter";
import { Footer } from "./Footer";
import { Testimonials } from "./Testimonials";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { ServiceSchema } from "../seo/ServiceSchema";
import { ServiceFAQ } from "./ServiceFAQ";
import { RelatedServices } from "./RelatedServices";
import { Reveal } from "./motion";

export interface QA { q: string; a: string; }
export interface BuildItem { n: string; name: string; body: string; chips: string[]; popular?: boolean; }
export interface ServiceProof { name: string; text: string; quote?: string; author?: string; href: string; }

export interface ServicePageData {
  title: string;
  description: string;
  path: string;
  schemaName: string;
  schemaDesc: string;
  crumb: string;
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  lead: string;
  trust: [string, string][];
  intro: string;
  introAccent: string;
  buildEyebrow: string;
  buildHead: string;
  buildHeadAccent: string;
  build: BuildItem[];
  proof?: ServiceProof;
  ctaHead: string;
  ctaAccent: string;
  ctaLead: string;
  faqs: QA[];
}

const PROMISES: [string, string][] = [
  ["Fixed price", "Quoted up front, in writing. No hourly meter."],
  ["You own it", "100% of the code and IP, yours on delivery."],
  ["Built to perform", "Fast, accessible, and measured after launch."],
  ["30-day warranty", "We stick around after launch, free."],
];

/** One elevated, human template every service page renders, so the whole site
 *  is consistent by construction. Content comes in as data; SEO stays intact. */
export function ServicePageLayout(d: ServicePageData) {
  return (
    <>
      <SEOHead title={d.title} description={d.description} path={d.path} />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: d.crumb, url: d.path }]} />
      <ServiceSchema name={d.schemaName} description={d.schemaDesc} />

      <style>{css}</style>

      {/* Hero */}
      <header className="ed sv-hero">
        <nav className="sv-crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span>{d.crumb}</span>
        </nav>
        <div className="ed-label">
          <span className="ed-label-line" /><span className="ed-label-text">{d.eyebrow}</span>
        </div>
        <h1 className="sv-h1">{d.titleLead}<br /><em>{d.titleAccent}</em></h1>
        <p className="sv-lead">{d.lead}</p>
        <div className="sv-cta-row">
          <Link href="/contact" className="ed-btn ed-btn-lg">Start a project<span>↗</span></Link>
          <Link href="/pricing" className="sv-link">See pricing →</Link>
        </div>
        <div className="sv-trust">
          {d.trust.map(([strong, rest], i) => (
            <span key={i} className="sv-trust-item">
              {i > 0 && <span className="sv-trust-dot" />}
              <strong>{strong}</strong> {rest}
            </span>
          ))}
        </div>
      </header>

      {/* Positioning */}
      <section className="ed sv-intro">
        <Reveal>
          <p className="sv-intro-tx">{d.intro} <em>{d.introAccent}</em></p>
        </Reveal>
      </section>

      {/* What we build */}
      <section className="ed ed-sec sv-build">
        <div className="sv-build-head">
          <span className="ed-label"><span className="ed-label-line" /><span className="ed-label-text">{d.buildEyebrow}</span></span>
          <h2 className="ed-h2">{d.buildHead}<br />{d.buildHeadAccent}</h2>
        </div>
        <div className="sv-build-list">
          {d.build.map((s) => (
            <Reveal key={s.n} className="sv-item">
              <span className="sv-item-n">{s.n}</span>
              <div className="sv-item-body">
                <h3 className="sv-item-name">{s.name}{s.popular && <span className="sv-pop">Most requested</span>}</h3>
                <p className="sv-item-desc">{s.body}</p>
                <div className="sv-chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Promises */}
      <section className="ed ed-sec sv-promise">
        <div className="sv-promise-grid">
          {PROMISES.map(([k, v], i) => (
            <Reveal key={k} delay={i * 70} className="sv-promise-card">
              <span className="sv-promise-check" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 6" /></svg>
              </span>
              <h3 className="sv-promise-k">{k}</h3>
              <p className="sv-promise-v">{v}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Proof */}
      {d.proof && (
        <section className="ed ed-sec sv-proof">
          <Reveal className="sv-proof-inner">
            <div>
              <span className="ed-label"><span className="ed-label-line" /><span className="ed-label-text">Recently shipped</span></span>
              <h2 className="sv-proof-h">{d.proof.name}</h2>
              <p className="sv-proof-tx">{d.proof.text}</p>
              {d.proof.quote && <blockquote className="sv-proof-quote">"{d.proof.quote}"<footer>{d.proof.author}</footer></blockquote>}
              <Link href={d.proof.href} className="sv-link">See the work →</Link>
            </div>
          </Reveal>
        </section>
      )}

      {/* CTA */}
      <section className="ed ed-sec sv-cta">
        <Reveal>
          <h2 className="ed-h2">{d.ctaHead}<br /><em>{d.ctaAccent}</em></h2>
          <p className="sv-lead" style={{ margin: "18px 0 30px" }}>{d.ctaLead}</p>
          <div className="sv-cta-row">
            <Link href="/contact" className="ed-btn ed-btn-lg">Book a 30-min call<span>↗</span></Link>
            <a href="mailto:info@ahos.xyz" className="sv-link">info@ahos.xyz</a>
          </div>
        </Reveal>
      </section>

      <ServiceFAQ items={d.faqs} />
      <RelatedServices current={d.path} />
      <Testimonials />
      <Footer />
    </>
  );
}

const css = `
.sv-hero { padding-top: clamp(40px, 7vh, 88px); padding-bottom: clamp(36px, 5vh, 64px); }
.sv-crumb { display: flex; align-items: center; gap: 10px; font-size: 12.5px; color: var(--text-faint); margin-bottom: 28px; }
.sv-crumb a { color: var(--text-dim); transition: color 0.2s; }
.sv-crumb a:hover { color: var(--orange); }
.sv-h1 { font-family: var(--font-display); font-size: clamp(42px, 7.6vw, 104px); font-weight: 700; line-height: 0.94; letter-spacing: -0.045em; margin-bottom: 26px; }
.sv-h1 em { font-style: normal; color: var(--orange); }
.sv-lead { font-size: clamp(16px, 1.5vw, 20px); line-height: 1.6; color: var(--text-muted); max-width: 60ch; }
.sv-cta-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; margin-top: 34px; }
.sv-link { font-size: 14px; font-weight: 600; color: var(--text-dim); transition: color 0.2s; }
.sv-link:hover { color: var(--orange); }
.sv-trust { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 38px; font-size: 13.5px; color: var(--text-dim); }
.sv-trust-item { display: inline-flex; align-items: center; gap: 16px; }
.sv-trust strong { color: var(--text); font-weight: 700; }
.sv-trust-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--border-hover); }

.sv-intro { padding: clamp(48px, 7vh, 96px) 0; border-top: 1px solid var(--border-soft); }
.sv-intro-tx { font-family: var(--font-display); font-size: clamp(22px, 3vw, 40px); font-weight: 500; line-height: 1.35; letter-spacing: -0.02em; max-width: 24ch; margin: 0 auto; text-align: center; color: var(--text); }
.sv-intro-tx em { font-style: normal; color: var(--orange); }

.sv-build-head { margin-bottom: clamp(36px, 5vw, 60px); }
.sv-build-head .ed-h2 { margin-top: 6px; }
.sv-build-list { display: flex; flex-direction: column; }
.sv-item { display: grid; grid-template-columns: 64px 1fr; gap: clamp(16px, 3vw, 40px); padding: clamp(28px, 3.5vw, 44px) 0; border-top: 1px solid var(--border-soft); transition: background 0.35s ease; }
.sv-item:hover { background: linear-gradient(100deg, var(--orange-soft), transparent 62%); }
.sv-item:last-child { border-bottom: 1px solid var(--border-soft); }
.sv-item-n { font-family: var(--font-display); font-size: 16px; font-weight: 600; color: var(--orange); padding-top: 6px; }
.sv-item-name { font-family: var(--font-display); font-size: clamp(22px, 3vw, 34px); font-weight: 600; letter-spacing: -0.025em; line-height: 1.05; margin-bottom: 14px; }
.sv-pop { display: inline-block; margin-left: 12px; padding: 4px 11px; border-radius: 999px; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 9.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; vertical-align: middle; white-space: nowrap; }
.sv-item-desc { font-size: clamp(14.5px, 1.3vw, 16px); line-height: 1.7; color: var(--text-muted); max-width: 64ch; margin-bottom: 18px; }
.sv-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.sv-chips span { padding: 6px 13px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-dim); font-size: 12px; font-weight: 600; }

.sv-promise-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); border-radius: var(--radius-xl); overflow: hidden; }
.sv-promise-card { background: var(--bg); padding: clamp(24px, 2.6vw, 34px); transition: background 0.3s ease; }
.sv-promise-card:hover { background: var(--bg-2); }
.sv-promise-check { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--orange-soft); color: var(--orange); margin-bottom: 16px; }
.sv-promise-k { font-family: var(--font-display); font-size: clamp(17px, 1.7vw, 21px); font-weight: 600; letter-spacing: -0.02em; margin-bottom: 8px; }
.sv-promise-v { font-size: 13.5px; line-height: 1.6; color: var(--text-muted); }

.sv-proof-inner { background: var(--bg-2); border: 1px solid var(--border-soft); border-radius: var(--radius-xl); padding: clamp(32px, 5vw, 64px); }
.sv-proof-h { font-family: var(--font-display); font-size: clamp(30px, 4vw, 52px); font-weight: 700; letter-spacing: -0.03em; margin: 6px 0 14px; }
.sv-proof-tx { font-size: clamp(15px, 1.4vw, 18px); line-height: 1.65; color: var(--text-muted); max-width: 54ch; margin-bottom: 24px; }
.sv-proof-quote { font-family: var(--font-display); font-size: clamp(18px, 2vw, 26px); font-weight: 500; line-height: 1.4; letter-spacing: -0.02em; color: var(--text); max-width: 40ch; margin-bottom: 22px; }
.sv-proof-quote footer { margin-top: 12px; font-family: var(--font-sans); font-size: 13.5px; font-weight: 600; color: var(--text-dim); }

.sv-cta { text-align: center; }
.sv-cta .ed-h2 em { font-style: normal; color: var(--orange); }
.sv-cta .sv-lead { margin-left: auto; margin-right: auto; }
.sv-cta .sv-cta-row { justify-content: center; }

@media (max-width: 720px) {
  .sv-promise-grid { grid-template-columns: 1fr 1fr; }
  .sv-item { grid-template-columns: 1fr; gap: 4px; }
  .sv-item-n { padding-top: 0; }
}
@media (max-width: 440px) {
  .sv-promise-grid { grid-template-columns: 1fr; }
}
`;
