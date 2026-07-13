import { Link } from "wouter";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { ServiceSchema } from "../seo/ServiceSchema";

const services = [
  {
    n: "01",
    name: "Custom Websites & Landing Pages",
    tag: "Built to convert from the first pixel.",
    desc: "From high-impact landing pages that turn visitors into leads to full multi-page corporate sites — every element is designed to load fast, rank well, and drive action. Responsive on every screen, accessible by default, and shipped with a CMS if you need to update content yourself.",
    chips: ["Landing Pages", "Corporate Websites", "Portfolio Sites", "Startup MVPs", "CMS Integration"],
  },
  {
    n: "02",
    name: "E-Commerce Development",
    tag: "Sell harder, manage smarter.",
    desc: "Custom Shopify, WooCommerce, and headless e-commerce stores built for speed, checkout conversion, and inventory sanity. Product filtering, payment gateways, order management, and analytics — everything you need to run an online store that actually grows revenue.",
    chips: ["Shopify", "WooCommerce", "Headless Commerce", "Payment Gateways", "Inventory Systems"],
    popular: true,
  },
  {
    n: "03",
    name: "Web Application Development",
    tag: "Performance tools, not pretty brochures.",
    desc: "Full-stack web applications that handle real workflows — dashboards, client portals, booking systems, SaaS backends, and internal tools. We build with modern frameworks (React, Next.js, Node.js) and ship with CI/CD, monitoring, and documentation baked in.",
    chips: ["Dashboards", "Client Portals", "Booking Systems", "SaaS Backends", "API Development"],
  },
  {
    n: "04",
    name: "SEO & Performance Optimization",
    tag: "Rank higher, load faster, convert better.",
    desc: "Technical SEO audits, Core Web Vitals optimization, semantic HTML, structured data, and performance tuning that pushes your site to the top of search results. We fix what's slow, improve what's hidden, and measure the impact.",
    chips: ["Technical SEO", "Core Web Vitals", "Structured Data", "Speed Optimization", "Accessibility"],
  },
  {
    n: "05",
    name: "Maintenance & Hosting",
    tag: "Your site, always up to date.",
    desc: "Security patches, dependency updates, content changes, backups, and performance monitoring — all handled so you never worry about your site breaking at 2 AM. Optional retainer or per-task basis.",
    chips: ["Security Updates", "Backup & Recovery", "Performance Monitoring", "Content Updates", "24/7 Support"],
  },
];

export default function WebDevelopment() {
  return (
    <>
      <SEOHead
        title="Web Development Agency | Custom Websites & Web Apps | AHOS"
        description="AHOS builds premium websites, e-commerce stores, and web applications that load fast, rank well, and convert visitors into clients. Custom development from Beirut, serving worldwide."
        path="/web-development"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Web Development", url: "/web-development" }]} />
      <ServiceSchema name="Web Development" description="Premium websites, e-commerce stores, and web applications that load fast, rank well, and convert visitors into clients." />

      <style>{css}</style>

      <motion.header
        className="ed ed-page-hero wd-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="wd-hero-grid">
          <div>
            <div className="ed-label">
              <span className="ed-label-n">01</span><span className="ed-label-line" /><span className="ed-label-text">Web Development</span>
            </div>
            <h1 className="ed-h1">Websites that<br /><em>earn their keep.</em></h1>
            <p className="ed-lead">Pixel-tight, fast, and built to convert — from a single landing page to a full-scale web application. Every site we ship is responsive, accessible, and tuned to perform.</p>
            <div className="ed-cta-row" style={{ marginTop: 32 }}>
              <Link href="/contact" className="ed-btn ed-btn-lg">Start your website<span>↗</span></Link>
              <Link href="/services" className="ed-link-arrow">See all services →</Link>
            </div>
          </div>
          <div className="wd-hero-quote" aria-hidden="true">
            <div className="wd-q-num">50+</div>
            <div className="wd-q-label">Webships delivered</div>
            <div className="wd-q-line" />
            <div className="wd-q-text">"They don't just design sites — they build systems that earn their keep. Every pixel has a job."</div>
          </div>
        </div>
      </motion.header>

      <section className="wd-rows-wrap">
        {services.map((s, i) => (
          <section key={s.n} className={`ed ed-sec ${i % 2 === 1 ? "wd-alt" : ""}`}>
            <div className="wd-row">
              <div className="wd-row-head">
                <span className="wd-n">{s.n}</span>
                <h2 className="wd-name">{s.name}{s.popular && <span className="wd-pop">Popular</span>}</h2>
              </div>
              <div className="wd-row-body">
                <p className="wd-tag">{s.tag}</p>
                <p className="wd-desc">{s.desc}</p>
                <div className="wd-chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
              </div>
            </div>
          </section>
        ))}
      </section>

      <motion.section
        className="ed ed-sec wd-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="wd-cta-grid">
          <div>
            <h2 className="ed-h2">Ready to build<br />something people<br />actually use?</h2>
            <p className="ed-lead" style={{ margin: "18px 0 30px" }}>Book a free 30-minute call. We'll listen, sketch a plan, and give you a fixed-price quote — no pressure, no commitment.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap" }}>
              <Link href="/contact" className="ed-btn ed-btn-lg">Book a call<span>↗</span></Link>
              <Link href="/faq" className="ed-link-arrow">Process & pricing →</Link>
            </div>
          </div>
          <div className="wd-cta-tech">
            {["React", "Next.js", "Node.js", "TypeScript", "Tailwind", "GSAP", "Three.js", "Framer"].map((t) => (
              <span key={t} className="wd-tech-pill">{t}</span>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
    </>
  );
}

const css = `
.wd-hero-grid { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.wd-hero-quote { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: clamp(24px, 3vw, 38px); text-align: center; }
.wd-q-num { font-family: var(--font-display); font-size: clamp(44px, 6vw, 70px); font-weight: 700; color: var(--orange); line-height: 0.9; letter-spacing: -0.04em; }
.wd-q-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-faint); margin: 6px 0 18px; }
.wd-q-line { width: 40px; height: 2px; background: var(--orange); margin: 0 auto 18px; border-radius: 2px; opacity: 0.5; }
.wd-q-text { font-size: 13.5px; line-height: 1.7; color: var(--text-muted); font-style: italic; }

.wd-rows-wrap { border-top: 1px solid var(--border-soft); }
.wd-row { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(24px, 5vw, 72px); padding: clamp(32px, 4vw, 52px) 4px; border-bottom: 1px solid var(--border-soft); transition: background 0.3s; }
.wd-row:hover { background: linear-gradient(90deg, var(--orange-soft), transparent 55%); }
.wd-alt { background: var(--bg-2); }
.wd-row-head { display: flex; align-items: baseline; gap: 18px; }
.wd-n { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--orange); }
.wd-name { font-family: var(--font-display); font-size: clamp(24px, 3.4vw, 42px); font-weight: 600; line-height: 1.02; letter-spacing: -0.03em; }
.wd-pop { display: inline-block; margin-left: 12px; padding: 4px 11px; border-radius: 999px; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; vertical-align: middle; white-space: nowrap; }
.wd-tag { font-size: 16px; font-weight: 500; color: var(--orange); margin-bottom: 12px; }
.wd-desc { font-size: 15px; line-height: 1.75; color: var(--text-muted); margin-bottom: 20px; max-width: 60ch; }
.wd-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.wd-chips span { padding: 6px 13px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-muted); font-size: 12px; font-weight: 600; }

.wd-cta-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: clamp(32px, 5vw, 72px); align-items: center; }
.wd-cta-tech { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
.wd-tech-pill { padding: 8px 18px; border-radius: 999px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-dim); font-size: 13px; font-weight: 600; font-family: var(--font-mono); transition: border-color 0.2s, color 0.2s; }
.wd-tech-pill:hover { border-color: var(--border-hover); color: var(--orange); }

@media (max-width: 860px) {
  .wd-hero-grid { grid-template-columns: 1fr; }
  .wd-row { grid-template-columns: 1fr; gap: 16px; }
  .wd-cta-grid { grid-template-columns: 1fr; }
}
`;
