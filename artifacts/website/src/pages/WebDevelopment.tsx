import { Link } from "wouter";
import { Footer } from "../components/Footer";
import { Testimonials } from "../components/Testimonials";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { ServiceSchema } from "../seo/ServiceSchema";
import { ServiceFAQ } from "../components/ServiceFAQ";
import { RelatedServices } from "../components/RelatedServices";
import { Reveal } from "../components/motion";

const faqs = [
  { q: "How much does a website cost?", a: "Landing pages start at $300, business sites around $500, and e-commerce from $800. You get one fixed price after a free call. No hourly meter running quietly in the background." },
  { q: "How long until my site is live?", a: "A landing page is usually live within a few days. Business sites take two to four weeks, bigger builds three to six. Most of it comes down to how ready your content is, and we'll tell you honestly where you stand before we start." },
  { q: "Do I actually own it?", a: "Yes, completely. The code, the design, the content: all of it lands in your hands on delivery. No proprietary builder holding your site hostage. Host it with us or take it anywhere you like." },
  { q: "What if something breaks after launch?", a: "Every build includes 30 days of support at no cost. After that, our care plans quietly handle updates, backups, and security in the background. You're never locked into one, though." },
];

const build = [
  {
    n: "01",
    name: "Custom websites & landing pages",
    body: "The site people actually remember. We design it around your brand and what you're trying to do, whether that's a one-page launch, a full corporate site, or a portfolio that makes you the obvious pick. Want to update it yourself later? We'll add a CMS so you never have to call a developer to fix a typo.",
    chips: ["Landing pages", "Corporate sites", "Portfolios", "Startup MVPs", "CMS"],
  },
  {
    n: "02",
    name: "E-commerce that sells",
    body: "A store built to move product, not just sit there looking pretty. Fast checkout, sane inventory, real analytics, and payment gateways that don't scare people off. We'll build it on Shopify, WooCommerce, or fully custom. Whichever one actually makes you the most money.",
    chips: ["Shopify", "WooCommerce", "Headless", "Payments", "Migrations"],
    popular: true,
  },
  {
    n: "03",
    name: "Web apps & platforms",
    body: "Sometimes a website isn't enough. Dashboards, client portals, booking systems, SaaS backends: the real tools your team and customers open every day. We build them on React and Node, then hand over the monitoring and docs that keep them running long after launch day.",
    chips: ["Dashboards", "Portals", "Booking", "SaaS", "APIs"],
  },
  {
    n: "04",
    name: "SEO and speed, baked in",
    body: "Pretty is nice. Found is better. We wire technical SEO, clean structure, and Core Web Vitals into the build from line one. Google gets every reason to send people your way, and those people don't leave because the page took four seconds to load.",
    chips: ["Technical SEO", "Core Web Vitals", "Schema", "Speed", "Accessibility"],
  },
];

const promises = [
  { k: "Fixed price", v: "Quoted up front, in writing. No hourly meter." },
  { k: "You own it", v: "100% of the code and IP, yours on delivery." },
  { k: "Built to rank", v: "SEO and speed handled from day one." },
  { k: "30-day warranty", v: "We stick around after launch, free." },
];

export default function WebDevelopment() {
  return (
    <>
      <SEOHead
        title="Web Development Company in Lebanon | Custom Websites | AHOS"
        description="AHOS is a web development company in Lebanon building custom websites, e-commerce stores, and web apps that load fast and convert. We serve clients in the US and worldwide."
        path="/web-development"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Web Development", url: "/web-development" }]} />
      <ServiceSchema name="Web Development" description="Custom websites, e-commerce stores, and web applications that load fast, rank well, and turn visitors into customers." />

      <style>{css}</style>

      {/* ── Hero ── */}
      <header className="ed sv-hero">
        <nav className="sv-crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span>Web Development</span>
        </nav>
        <div className="ed-label">
          <span className="ed-label-line" /><span className="ed-label-text">Web Development</span>
        </div>
        <h1 className="sv-h1">Websites that<br /><em>earn their keep.</em></h1>
        <p className="sv-lead">
          A website isn't a brochure. It's your hardest-working salesperson. We design and build
          yours from scratch: fast, sharp, easy to update, and wired to turn visitors into
          customers. No templates. No lock-in. None of that "it'll be ready next quarter" routine.
        </p>
        <div className="sv-cta-row">
          <Link href="/contact" className="ed-btn ed-btn-lg">Start your website<span>↗</span></Link>
          <Link href="/pricing" className="sv-link">See pricing →</Link>
        </div>
        <div className="sv-trust">
          <span><strong>50+</strong> sites shipped</span>
          <span className="sv-trust-dot" />
          <span><strong>5.0</strong> on Trustpilot</span>
          <span className="sv-trust-dot" />
          <span>Live in <strong>days</strong>, not months</span>
        </div>
      </header>

      {/* ── Positioning ── */}
      <section className="ed sv-intro">
        <Reveal>
          <p className="sv-intro-tx">
            Most people learn this the expensive way. A cheap template site quietly costs you
            customers every day it's live. It loads slowly. It falls apart on a phone. It gives
            nobody a reason to trust you. <em>We build the opposite:</em> sites that load in a
            blink, look like you spent real money, and start ranking and converting on day one.
          </p>
        </Reveal>
      </section>

      {/* ── What we build ── */}
      <section className="ed ed-sec sv-build">
        <div className="sv-build-head">
          <span className="ed-label"><span className="ed-label-line" /><span className="ed-label-text">What we build</span></span>
          <h2 className="ed-h2">From a landing page<br />to a platform.</h2>
        </div>
        <div className="sv-build-list">
          {build.map((s) => (
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

      {/* ── Promises ── */}
      <section className="ed ed-sec sv-promise">
        <div className="sv-promise-grid">
          {promises.map((p, i) => (
            <Reveal key={p.k} delay={i * 70} className="sv-promise-card">
              <span className="sv-promise-check" aria-hidden="true">✓</span>
              <h3 className="sv-promise-k">{p.k}</h3>
              <p className="sv-promise-v">{p.v}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Proof ── */}
      <section className="ed ed-sec sv-proof">
        <Reveal className="sv-proof-inner">
          <div>
            <span className="ed-label"><span className="ed-label-line" /><span className="ed-label-text">Recently shipped</span></span>
            <h2 className="sv-proof-h">SpeeAligner</h2>
            <p className="sv-proof-tx">A healthcare web platform we designed and built from the ground up. From the first rough sketch to a fast, live site the client runs comfortably on their own.</p>
            <blockquote className="sv-proof-quote">"Highly professional, neat work, amazing prices, and they reply fast. Kudos."<footer>Yorgo, SpeeAligner</footer></blockquote>
            <Link href="/work/speealigner" className="sv-link">See the work →</Link>
          </div>
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section className="ed ed-sec sv-cta">
        <Reveal>
          <h2 className="ed-h2">Let's build you a site<br />that <em>pays for itself.</em></h2>
          <p className="sv-lead" style={{ margin: "18px 0 30px" }}>Book a free 30-minute call. We'll listen, sketch a plan, and hand you a fixed quote. No pressure, no jargon, no chasing you afterward.</p>
          <div className="sv-cta-row">
            <Link href="/contact" className="ed-btn ed-btn-lg">Book a 30-min call<span>↗</span></Link>
            <a href="mailto:info@ahos.xyz" className="sv-link">info@ahos.xyz</a>
          </div>
        </Reveal>
      </section>

      <ServiceFAQ items={faqs} />
      <RelatedServices current="/web-development" />
      <Testimonials />
      <Footer />
    </>
  );
}

const css = `
.sv-hero { padding-top: clamp(48px, 8vh, 96px); padding-bottom: clamp(40px, 6vh, 72px); }
.sv-crumb { display: flex; align-items: center; gap: 10px; font-size: 12.5px; color: var(--text-faint); margin-bottom: 30px; }
.sv-crumb a { color: var(--text-dim); transition: color 0.2s; }
.sv-crumb a:hover { color: var(--orange); }
.sv-h1 { font-family: var(--font-display); font-size: clamp(46px, 8vw, 108px); font-weight: 700; line-height: 0.94; letter-spacing: -0.045em; margin-bottom: 28px; }
.sv-h1 em { font-style: normal; color: var(--orange); }
.sv-lead { font-size: clamp(16px, 1.5vw, 20px); line-height: 1.6; color: var(--text-muted); max-width: 60ch; }
.sv-cta-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; margin-top: 34px; }
.sv-link { font-size: 14px; font-weight: 600; color: var(--text-dim); transition: color 0.2s; }
.sv-link:hover { color: var(--orange); }
.sv-trust { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 40px; font-size: 13.5px; color: var(--text-dim); }
.sv-trust strong { color: var(--text); font-weight: 700; }
.sv-trust-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--border-hover); }

.sv-intro { padding: clamp(48px, 7vh, 96px) 0; border-top: 1px solid var(--border-soft); }
.sv-intro-tx { font-family: var(--font-display); font-size: clamp(22px, 3vw, 40px); font-weight: 500; line-height: 1.35; letter-spacing: -0.02em; max-width: 22ch; margin: 0 auto; text-align: center; color: var(--text); }
.sv-intro-tx em { font-style: normal; color: var(--orange); }

.sv-build-head { margin-bottom: clamp(36px, 5vw, 60px); }
.sv-build-head .ed-h2 { margin-top: 6px; }
.sv-build-list { display: flex; flex-direction: column; }
.sv-item { display: grid; grid-template-columns: 64px 1fr; gap: clamp(16px, 3vw, 40px); padding: clamp(28px, 3.5vw, 44px) 0; border-top: 1px solid var(--border-soft); }
.sv-item:last-child { border-bottom: 1px solid var(--border-soft); }
.sv-item-n { font-family: var(--font-display); font-size: 16px; font-weight: 600; color: var(--orange); padding-top: 6px; }
.sv-item-name { font-family: var(--font-display); font-size: clamp(22px, 3vw, 34px); font-weight: 600; letter-spacing: -0.025em; line-height: 1.05; margin-bottom: 14px; }
.sv-pop { display: inline-block; margin-left: 12px; padding: 4px 11px; border-radius: 999px; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 9.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; vertical-align: middle; white-space: nowrap; }
.sv-item-desc { font-size: clamp(14.5px, 1.3vw, 16px); line-height: 1.7; color: var(--text-muted); max-width: 64ch; margin-bottom: 18px; }
.sv-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.sv-chips span { padding: 6px 13px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-dim); font-size: 12px; font-weight: 600; }

.sv-promise-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); border-radius: var(--radius-xl); overflow: hidden; }
.sv-promise-card { background: var(--bg); padding: clamp(24px, 2.6vw, 34px); }
.sv-promise-check { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--orange-soft); color: var(--orange); font-size: 13px; font-weight: 700; margin-bottom: 16px; }
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
