import { Link } from "wouter";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { Testimonials } from "../components/Testimonials";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { ServiceSchema } from "../seo/ServiceSchema";
import { ServiceFAQ } from "../components/ServiceFAQ";
import { RelatedServices } from "../components/RelatedServices";

const faqs = [
  { q: "How much does custom software cost?", a: "Custom software and SaaS platforms start at $1,500 and scale with scope. You get a fixed-price quote after a free discovery call — no open-ended hourly billing." },
  { q: "How long does a custom software project take?", a: "SaaS platforms typically take 6–16 weeks; smaller internal tools and dashboards are faster. We work in milestones so you see working software throughout." },
  { q: "Will I own the source code?", a: "Yes — full ownership of all source code, architecture, and IP on delivery, plus 30 days of post-launch support. No vendor lock-in." },
];

const services = [
  {
    n: "01",
    name: "SaaS Platform Development",
    tag: "Multi-tenant, scalable, built to grow.",
    desc: "Full SaaS platforms from scratch — subscription billing, team management, role-based access, onboarding flows, and usage analytics. We handle the architecture so you can focus on the product. Deployed with CI/CD, monitoring, and 99.9% uptime SLAs.",
    chips: ["Multi-Tenant", "Subscription Billing", "Team Management", "RBAC", "Usage Analytics"],
  },
  {
    n: "02",
    name: "Custom Dashboards & Internal Tools",
    tag: "Stop bending your workflows to off-the-shelf software.",
    desc: "Admin panels, analytics dashboards, reporting tools, CRM integrations, and internal systems — built around how your team actually works. Web-based, responsive, and connected to your existing databases and APIs.",
    chips: ["Admin Panels", "Analytics Dashboards", "Reporting Tools", "CRM Integration", "Custom Workflows"],
    popular: true,
  },
  {
    n: "03",
    name: "API & Backend Development",
    tag: "The engine behind your product.",
    desc: "RESTful and GraphQL APIs, microservices architecture, event-driven systems, and real-time data pipelines. We design APIs that are clean to consume and boringly reliable in production — with documentation, rate limiting, and monitoring included.",
    chips: ["REST / GraphQL", "Microservices", "Event-Driven", "Real-Time Pipelines", "API Documentation"],
  },
  {
    n: "04",
    name: "Legacy System Modernization",
    tag: "Modernize without downtime.",
    desc: "Replace aging, unmaintainable systems without breaking your business. We plan the migration in phases — extract services, rebuild modules, and cut over when each piece is proven stable in production.",
    chips: ["Migration Planning", "Phased Cutover", "Code Audit", "Modern Stack", "Data Migration"],
  },
  {
    n: "05",
    name: "Integration & Automation",
    tag: "Make your tools talk to each other.",
    desc: "Connect your CRM, ERP, marketing tools, payment gateways, and operational systems into a single workflow. Automated data syncs, webhook pipelines, Zapier-style automation on custom infrastructure — less manual work, fewer errors.",
    chips: ["CRM Integration", "ERP Systems", "Payment Gateways", "Webhook Pipelines", "Workflow Automation"],
  },
];

export default function CustomSoftware() {
  return (
    <>
      <SEOHead
        title="Custom Software Development Company in Lebanon | AHOS"
        description="AHOS is a custom software development company in Lebanon building SaaS platforms, dashboards, APIs, and automation — fixed-price, full ownership, serving the US and worldwide."
        path="/custom-software"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Custom Software", url: "/custom-software" }]} />
      <ServiceSchema name="Custom Software Development" description="Tailored SaaS products, internal dashboards, APIs, and automation systems built around how your business actually runs." />

      <style>{css}</style>

      <motion.header
        className="ed ed-page-hero cs-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="cs-hero-grid">
          <div>
            <div className="ed-label">
              <span className="ed-label-n">03</span><span className="ed-label-line" /><span className="ed-label-text">Custom Software</span>
            </div>
            <h1 className="ed-h1">Software that fits<br /><em>your workflow.</em></h1>
            <p className="ed-lead">Off-the-shelf tools make you bend to their logic. We build custom platforms, dashboards, and systems shaped to how your business actually runs — from first sketch to deployed, scalable product you fully own.</p>
            <div className="ed-cta-row" style={{ marginTop: 32 }}>
              <Link href="/contact" className="ed-btn ed-btn-lg">Build your software<span>↗</span></Link>
              <Link href="/services" className="ed-link-arrow">See all services →</Link>
            </div>
          </div>
          <div className="cs-diagram" aria-hidden="true">
            <div className="cs-diagram-box">
              <div className="cs-diagram-title">System Architecture</div>
              <div className="cs-diagram-grid">
                <div className="cs-diagram-node" style={{ background: "var(--orange-soft)", borderColor: "var(--border-hover)" }}>Frontend</div>
                <div className="cs-diagram-node">API</div>
                <div className="cs-diagram-node" style={{ background: "var(--orange-soft)", borderColor: "var(--border-hover)" }}>DB</div>
                <div className="cs-diagram-node">Cache</div>
                <div className="cs-diagram-node" style={{ background: "var(--orange-soft)", borderColor: "var(--border-hover)" }}>Queue</div>
                <div className="cs-diagram-node">CDN</div>
              </div>
              <div className="cs-diagram-arrow">→</div>
              <div className="cs-diagram-outcome">Shipped. Owned. Scaled.</div>
            </div>
          </div>
        </div>
      </motion.header>

      <section className="cs-rows-wrap">
        {services.map((s, i) => (
          <section key={s.n} className={`ed ed-sec ${i % 2 === 1 ? "cs-alt" : ""}`}>
            <div className="cs-row">
              <div className="cs-row-head">
                <span className="cs-n">{s.n}</span>
                <h2 className="cs-name">{s.name}{s.popular && <span className="cs-pop">Popular</span>}</h2>
              </div>
              <div className="cs-row-body">
                <p className="cs-tag">{s.tag}</p>
                <p className="cs-desc">{s.desc}</p>
                <div className="cs-chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
              </div>
            </div>
          </section>
        ))}
      </section>

      <motion.section
        className="ed ed-sec cs-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="cs-cta-inner">
          <h2 className="ed-h2">Stop bending your business<br />to software that doesn't fit.</h2>
          <p className="ed-lead" style={{ margin: "18px 0 30px" }}>Book a free 30-minute call. We'll listen, sketch a solution, and hand you a fixed-price quote — no obligation.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap" }}>
            <Link href="/contact" className="ed-btn ed-btn-lg">Book a call<span>↗</span></Link>
            <Link href="/faq" className="ed-link-arrow">Process & pricing →</Link>
          </div>
        </div>
      </motion.section>

      <ServiceFAQ items={faqs} />
      <RelatedServices current="/custom-software" />
      <Testimonials />
      <Footer />
    </>
  );
}

const css = `
.cs-hero-grid { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.cs-diagram { display: flex; justify-content: center; }
.cs-diagram-box { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: clamp(20px, 3vw, 32px); width: 100%; max-width: 320px; }
.cs-diagram-title { font-family: var(--font-mono); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 16px; text-align: center; }
.cs-diagram-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.cs-diagram-node { padding: 10px; border-radius: 8px; background: var(--bg); border: 1px solid var(--border); font-family: var(--font-mono); font-size: 10px; font-weight: 600; color: var(--text-dim); text-align: center; }
.cs-diagram-arrow { text-align: center; font-size: 20px; color: var(--orange); margin: 12px 0 10px; opacity: 0.6; }
.cs-diagram-outcome { text-align: center; font-family: var(--font-display); font-size: 16px; font-weight: 600; color: var(--orange); letter-spacing: -0.02em; }

.cs-rows-wrap { border-top: 1px solid var(--border-soft); }
.cs-row { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(24px, 5vw, 72px); padding: clamp(32px, 4vw, 52px) 4px; border-bottom: 1px solid var(--border-soft); transition: background 0.3s; }
.cs-row:hover { background: linear-gradient(90deg, var(--orange-soft), transparent 55%); }
.cs-alt { background: var(--bg-2); }
.cs-row-head { display: flex; align-items: baseline; gap: 18px; }
.cs-n { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--orange); }
.cs-name { font-family: var(--font-display); font-size: clamp(24px, 3.4vw, 42px); font-weight: 600; line-height: 1.02; letter-spacing: -0.03em; }
.cs-pop { display: inline-block; margin-left: 12px; padding: 4px 11px; border-radius: 999px; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; vertical-align: middle; white-space: nowrap; }
.cs-tag { font-size: 16px; font-weight: 500; color: var(--orange); margin-bottom: 12px; }
.cs-desc { font-size: 15px; line-height: 1.75; color: var(--text-muted); margin-bottom: 20px; max-width: 60ch; }
.cs-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.cs-chips span { padding: 6px 13px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-muted); font-size: 12px; font-weight: 600; }

@media (max-width: 860px) {
  .cs-hero-grid { grid-template-columns: 1fr; }
  .cs-row { grid-template-columns: 1fr; gap: 16px; }
}
`;
