import { Link } from "wouter";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";

const plans = [
  {
    name: "Landing Page",
    price: "$300",
    timeline: "2 days",
    desc: "Single-page website perfect for startups, products, or personal brands.",
    features: [
      "1 page, fully responsive",
      "Custom design, no templates",
      "Contact form or email integration",
      "SEO meta tags & Open Graph",
      "Fast hosting on your domain",
    ],
  },
  {
    name: "Standard Website",
    price: "$500",
    timeline: "3 days",
    desc: "Multi-page site for small businesses ready to establish their online presence.",
    features: [
      "Up to 5 pages",
      "Fully responsive on all devices",
      "Custom design & branding",
      "SEO optimization (meta, schema, speed)",
      "CMS (update content yourself)",
      "Contact form & social links",
      "Google Analytics setup",
    ],
    popular: true,
  },
  {
    name: "E-Commerce Store",
    price: "$800",
    timeline: "5 days",
    desc: "Full online store with product management, payments, and shipping.",
    features: [
      "Up to 50 products",
      "Shopping cart & checkout",
      "Payment gateway (Stripe/PayPal)",
      "Order management dashboard",
      "Product categories & search",
      "Shipping & tax configuration",
      "SEO for product pages",
    ],
  },
  {
    name: "Custom Web App",
    price: "From $1,500",
    timeline: "1-3 weeks",
    desc: "Bespoke web applications — dashboards, portals, SaaS platforms, and tools.",
    features: [
      "Full-stack development",
      "User authentication & accounts",
      "Database & API integration",
      "Admin dashboard",
      "Source code ownership",
      "Deployment & hosting setup",
      "30-day post-launch support",
    ],
  },
];

const faqs = [
  { q: "What's included in the $500 standard website?", a: "A fully custom 5-page website with responsive design, SEO meta tags, contact form, CMS (so you can edit content), social links, and Google Analytics. You own the code. No templates." },
  { q: "How fast can you deliver?", a: "Landing pages in 2 days, standard sites in 3 days, e-commerce in 5 days. We work fast because we don't do meetings about meetings." },
  { q: "Do I need hosting? Will you set it up?", a: "We can host your site or deploy to your existing hosting. Setup is included — you don't need to touch a control panel. Ongoing hosting at cost ($5-15/mo)." },
  { q: "What if I need changes after launch?", a: "We include 30 days of post-launch support at no extra cost. After that, we offer maintenance retainers or per-task fixes." },
  { q: "Do you offer payment plans?", a: "We work on milestones. Typically 50% upfront, 50% on launch. E-commerce and web apps may be split into 3 payments." },
];

export default function Pricing() {
  return (
    <>
      <SEOHead
        title="Website Pricing From $300 | Web Development Costs | AHOS Beirut"
        description="Transparent web development pricing from AHOS. Landing pages from $300, standard websites from $500, e-commerce from $800. Custom designs, no templates, full ownership. Launch in days."
        path="/pricing"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Pricing", url: "/pricing" }]} />

      <style>{css}</style>

      <motion.header
        className="ed ed-page-hero pr-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="ed-label">
          <span className="ed-label-n">Pricing</span>
          <span className="ed-label-line" />
          <span className="ed-label-text">Transparent, fair, fixed</span>
        </span>
        <h1 className="ed-page-title">Websites from <span className="pr-accent">$300</span></h1>
        <p className="ed-page-lead">Fixed prices, custom work, full ownership. What you see is what you pay.</p>
        <div className="ed-hero-actions" style={{ marginTop: 24 }}>
          <Link href="/contact" className="ed-btn ed-btn-lg">Start your project <span>↗</span></Link>
          <Link href="/faq" className="ed-link-arrow">Visit FAQ</Link>
        </div>
      </motion.header>

      <section className="ed pr-grid">
        {plans.map((p, i) => (
          <div key={p.name} className={`pr-card ${p.popular ? "pr-popular" : ""}`}>
            {p.popular && <span className="pr-badge">Most popular</span>}
            <div className="pr-head">
              <h2 className="pr-name">{p.name}</h2>
              <div className="pr-price">{p.price}</div>
              <div className="pr-timeline">Delivery: {p.timeline}</div>
            </div>
            <p className="pr-desc">{p.desc}</p>
            <ul className="pr-feats">
              {p.features.map((f) => (
                <li key={f} className="pr-feat">{f}</li>
              ))}
            </ul>
            <Link href="/contact" className="pr-cta">Get this plan <span>↗</span></Link>
          </div>
        ))}
      </section>

      <section className="ed pr-faq">
        <h2 className="pr-faq-title">Pricing FAQ</h2>
        <div className="pr-faq-grid">
          {faqs.map((f) => (
            <details key={f.q} className="pr-faq-item">
              <summary className="pr-faq-q">{f.q}</summary>
              <p className="pr-faq-a">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="ed pr-cta-section">
        <div className="pr-cta-inner">
          <h2 className="pr-cta-title">Not sure which plan fits?</h2>
          <p className="pr-cta-text">We'll listen to what you need and recommend the right option — no pressure, no sales pitch.</p>
          <Link href="/contact" className="ed-btn ed-btn-lg">Talk to us <span>↗</span></Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

const css = `
.pr-hero { padding-top: clamp(80px, 12vw, 140px); padding-bottom: clamp(48px, 6vw, 80px); }
.pr-accent { color: var(--orange); }

.pr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; padding-bottom: clamp(60px, 8vw, 100px); }
.pr-card { position: relative; display: flex; flex-direction: column; padding: 28px 24px; border-radius: 16px; border: 1px solid var(--border); background: var(--bg-2); transition: transform 0.25s ease, border-color 0.25s; }
.pr-card:hover { transform: translateY(-4px); border-color: var(--border-hover); }
.pr-popular { border-color: var(--orange); background: var(--bg-3); }
.pr-popular:hover { border-color: var(--orange-light); }
.pr-badge { position: absolute; top: -11px; left: 50%; transform: translateX(-50%); padding: 3px 14px; border-radius: 999px; background: var(--orange); color: #0a0a0b; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; }
.pr-head { margin-bottom: 16px; }
.pr-name { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.pr-price { font-family: var(--font-display); font-size: 38px; font-weight: 700; letter-spacing: -0.03em; color: var(--orange); line-height: 1.1; }
.pr-timeline { font-size: 13px; color: var(--text-dim); margin-top: 4px; }
.pr-desc { font-size: 14px; line-height: 1.65; color: var(--text-muted); margin-bottom: 18px; }
.pr-feats { list-style: none; padding: 0; margin: 0 0 24px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.pr-feat { position: relative; padding-left: 18px; font-size: 13.5px; color: var(--text-muted); line-height: 1.5; }
.pr-feat::before { content: ""; position: absolute; left: 0; top: 7px; width: 5px; height: 5px; border-radius: 50%; background: var(--orange); }
.pr-cta { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--text); text-decoration: none; transition: color 0.2s; }
.pr-cta span { transition: transform 0.2s; }
.pr-cta:hover { color: var(--orange); }
.pr-cta:hover span { transform: translate(2px, -2px); }

.pr-faq { padding-bottom: clamp(60px, 8vw, 100px); }
.pr-faq-title { font-family: var(--font-display); font-size: clamp(28px, 4vw, 42px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 28px; }
.pr-faq-grid { display: flex; flex-direction: column; gap: 8px; max-width: 700px; }
.pr-faq-item { border-radius: 12px; border: 1px solid var(--border); background: var(--bg-2); overflow: hidden; }
.pr-faq-q { padding: 14px 18px; font-size: 14.5px; font-weight: 600; color: var(--text); cursor: pointer; user-select: none; list-style: none; display: flex; align-items: center; justify-content: space-between; transition: color 0.2s; }
.pr-faq-q::-webkit-details-marker { display: none; }
.pr-faq-q::after { content: "+"; font-size: 18px; color: var(--text-dim); transition: transform 0.25s ease; }
details[open] .pr-faq-q::after { transform: rotate(45deg); }
.pr-faq-q:hover { color: var(--orange); }
.pr-faq-a { padding: 0 18px 14px; font-size: 14px; line-height: 1.7; color: var(--text-muted); margin: 0; }

.pr-cta-section { padding-bottom: clamp(64px, 10vw, 120px); }
.pr-cta-inner { text-align: center; padding: clamp(40px, 6vw, 64px); border-radius: 20px; background: var(--bg-2); border: 1px solid var(--border); }
.pr-cta-title { font-family: var(--font-display); font-size: clamp(24px, 3.5vw, 36px); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 12px; }
.pr-cta-text { font-size: 15px; color: var(--text-muted); margin-bottom: 24px; max-width: 480px; margin-left: auto; margin-right: auto; }

@media (max-width: 640px) {
  .pr-grid { grid-template-columns: 1fr; }
}
`;
