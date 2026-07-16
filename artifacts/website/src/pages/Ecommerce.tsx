import { Link } from "wouter";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { Testimonials } from "../components/Testimonials";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { ServiceSchema } from "../seo/ServiceSchema";
import { ServiceFAQ } from "../components/ServiceFAQ";
import { RelatedServices } from "../components/RelatedServices";

const faqs = [
  { q: "How much does an e-commerce store cost?", a: "E-commerce stores start at $500 for a standard build and $800+ for full custom stores with up to 50 products. You get a fixed-price quote after a free call." },
  { q: "How long does it take to launch an online store?", a: "Most stores go live in 3–6 weeks, depending on product count, integrations, and whether you're migrating from an existing platform." },
  { q: "Can you migrate my existing store?", a: "Yes — we migrate from Shopify, WooCommerce, Magento, or custom platforms with full product-data transfer and SEO redirect mapping to protect your rankings." },
];

const services = [
  {
    n: "01",
    name: "Shopify Store Development",
    tag: "Sell faster on the world's leading commerce platform.",
    desc: "Custom Shopify storefronts built with Liquid, Shopify Plus architecture, and headless Commerce Components. Custom themes, product filtering, multi-currency, subscription apps, and seamless third-party integrations — everything you need to launch and scale.",
    chips: ["Custom Themes", "Shopify Plus", "Headless Commerce", "Multi-Currency", "Subscriptions"],
  },
  {
    n: "02",
    name: "WooCommerce & WordPress Stores",
    tag: "Total control over your online store.",
    desc: "Self-hosted e-commerce built on WordPress and WooCommerce with full ownership of your data and code. Custom product types, dynamic pricing, membership systems, booking integrations, and complete control over the checkout experience.",
    chips: ["WooCommerce", "Custom Product Types", "Membership Systems", "Booking Integration", "Custom Checkout"],
  },
  {
    n: "03",
    name: "Custom E-Commerce Platforms",
    tag: "When off-the-shelf isn't enough, build your own.",
    desc: "Headless or full-stack custom e-commerce platforms for businesses with unique requirements — multi-vendor marketplaces, digital product delivery, auction systems, rental platforms, or any model Shopify and WooCommerce can't handle.",
    chips: ["Multi-Vendor", "Digital Delivery", "Auction Systems", "Rental Platforms", "Custom Cart"],
    popular: true,
  },
  {
    n: "04",
    name: "Payment & Checkout Optimization",
    tag: "Remove friction, increase conversions.",
    desc: "One-click checkout, saved payment methods, local payment gateways (including Lebanon-specific processors), multi-currency support, and abandoned cart recovery flows. We audit your funnel and fix every leak between product page and thank-you page.",
    chips: ["One-Click Checkout", "Payment Gateways", "Multi-Currency", "Cart Recovery", "Checkout Audit"],
  },
  {
    n: "05",
    name: "E-Commerce Migration & Maintenance",
    tag: "Move platforms, keep selling.",
    desc: "Migrate from any platform (Magento, BigCommerce, custom) to Shopify or WooCommerce without downtime. Product data migration, SEO redirect mapping, order history transfer, and ongoing maintenance — security patches, updates, and performance monitoring.",
    chips: ["Platform Migration", "SEO Redirect Mapping", "Data Migration", "Security Updates", "Performance Monitoring"],
  },
];

export default function Ecommerce() {
  return (
    <>
      <SEOHead
        title="E-Commerce Development in Lebanon | Shopify & Custom | AHOS"
        description="AHOS builds e-commerce stores in Lebanon on Shopify, WooCommerce, and custom platforms — payment optimisation, multi-currency, and full migration. Serving the US and worldwide."
        path="/ecommerce-development"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "E-Commerce", url: "/ecommerce-development" }]} />
      <ServiceSchema name="E-Commerce Development" description="Shopify, WooCommerce, and custom e-commerce stores optimized for checkout speed, conversion rate, and revenue." />

      <style>{css}</style>

      <motion.header
        className="ed ed-page-hero ec-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="ec-hero-grid">
          <div>
            <div className="ed-label">
              <span className="ed-label-n">05</span><span className="ed-label-line" /><span className="ed-label-text">E-Commerce</span>
            </div>
            <h1 className="ed-h1">Stores built<br /><em>to sell.</em></h1>
            <p className="ed-lead">Shopify, WooCommerce, or fully custom — we build e-commerce platforms optimized for checkout speed, conversion rate, and inventory sanity. Every product page is designed to earn its click.</p>
            <div className="ed-cta-row" style={{ marginTop: 32 }}>
              <Link href="/contact" className="ed-btn ed-btn-lg">Start your store<span>↗</span></Link>
              <Link href="/services" className="ed-link-arrow">See all services →</Link>
            </div>
          </div>
          <div className="ec-stats" aria-hidden="true">
            <div className="ec-stat">
              <div className="ec-stat-num">2.3x</div>
              <div className="ec-stat-label">Avg. conversion improvement</div>
            </div>
            <div className="ec-stat">
              <div className="ec-stat-num">15+</div>
              <div className="ec-stat-label">Payment gateways integrated</div>
            </div>
            <div className="ec-stat">
              <div className="ec-stat-num">98%</div>
              <div className="ec-stat-label">Uptime on hosted stores</div>
            </div>
          </div>
        </div>
      </motion.header>

      <section className="ec-rows-wrap">
        {services.map((s, i) => (
          <section key={s.n} className={`ed ed-sec ${i % 2 === 1 ? "ec-alt" : ""}`}>
            <div className="ec-row">
              <div className="ec-row-head">
                <span className="ec-n">{s.n}</span>
                <h2 className="ec-name">{s.name}{s.popular && <span className="ec-pop">Popular</span>}</h2>
              </div>
              <div className="ec-row-body">
                <p className="ec-tag">{s.tag}</p>
                <p className="ec-desc">{s.desc}</p>
                <div className="ec-chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
              </div>
            </div>
          </section>
        ))}
      </section>

      <motion.section
        className="ed ed-sec ec-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 className="ed-h2">Ready to sell more?</h2>
          <p className="ed-lead" style={{ margin: "18px auto 30px", maxWidth: 560 }}>Book a free 30-minute call. We'll audit your current store or build your new one from scratch — fixed-price quote included.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/contact" className="ed-btn ed-btn-lg">Book a call<span>↗</span></Link>
            <Link href="/faq" className="ed-link-arrow">Process & pricing →</Link>
          </div>
        </div>
      </motion.section>

      <ServiceFAQ items={faqs} />
      <RelatedServices current="/ecommerce-development" />
      <Testimonials />
      <Footer />
    </>
  );
}

const css = `
.ec-hero-grid { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.ec-stats { display: flex; flex-direction: column; gap: 12px; }
.ec-stat { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 24px; }
.ec-stat-num { font-family: var(--font-display); font-size: clamp(32px, 4vw, 48px); font-weight: 700; color: var(--orange); line-height: 0.9; letter-spacing: -0.03em; }
.ec-stat-label { font-size: 12px; color: var(--text-faint); margin-top: 6px; font-weight: 500; }

.ec-rows-wrap { border-top: 1px solid var(--border-soft); }
.ec-row { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(24px, 5vw, 72px); padding: clamp(32px, 4vw, 52px) 4px; border-bottom: 1px solid var(--border-soft); transition: background 0.3s; }
.ec-row:hover { background: linear-gradient(90deg, var(--orange-soft), transparent 55%); }
.ec-alt { background: var(--bg-2); }
.ec-row-head { display: flex; align-items: baseline; gap: 18px; }
.ec-n { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--orange); }
.ec-name { font-family: var(--font-display); font-size: clamp(24px, 3.4vw, 42px); font-weight: 600; line-height: 1.02; letter-spacing: -0.03em; }
.ec-pop { display: inline-block; margin-left: 12px; padding: 4px 11px; border-radius: 999px; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; vertical-align: middle; white-space: nowrap; }
.ec-tag { font-size: 16px; font-weight: 500; color: var(--orange); margin-bottom: 12px; }
.ec-desc { font-size: 15px; line-height: 1.75; color: var(--text-muted); margin-bottom: 20px; max-width: 60ch; }
.ec-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ec-chips span { padding: 6px 13px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-muted); font-size: 12px; font-weight: 600; }

@media (max-width: 860px) {
  .ec-hero-grid { grid-template-columns: 1fr; }
  .ec-row { grid-template-columns: 1fr; gap: 16px; }
}
`;
