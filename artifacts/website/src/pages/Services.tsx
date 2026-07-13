import { Link } from "wouter";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { AllServicesSchema } from "../seo/ServiceSchema";

const services = [
  {
    n: "01",
    name: "Custom Software",
    from: "$1,500",
    tag: "Built around your workflow — not the other way around.",
    desc: "Off-the-shelf tools make you bend to their logic. We do the opposite: software shaped to how your business actually runs, from first sketch to a deployed, scalable product you fully own.",
    chips: ["SaaS Platforms", "Web Apps", "Dashboards", "Automation", "API Integration"],
    gets: ["Full source-code ownership", "Architecture that scales with you", "Optional hosting & long-term support"],
    href: "/custom-software",
  },
  {
    n: "02",
    name: "Web Development",
    from: "$300",
    tag: "Sites that turn visitors into clients.",
    desc: "Every site we ship is fast, pixel-tight, and built to earn its keep — responsive on every screen, tuned for search, and ready to scale the day you need it to. From a single landing page to full e-commerce.",
    chips: ["Landing Pages", "Corporate Sites", "E-Commerce", "Maintenance", "Hosting"],
    gets: ["Responsive on every device", "Speed & conversion optimised", "Scalable foundation from day one"],
    popular: true,
    href: "/web-development",
  },
  {
    n: "03",
    name: "Mobile Apps",
    from: "$1,000",
    tag: "iOS, Android, cross-platform — built to ship.",
    desc: "Native or cross-platform mobile applications from concept to App Store. Swift, Kotlin, Flutter, or React Native — we pick the right stack for your product and ship it with confidence.",
    chips: ["iOS / Swift", "Android / Kotlin", "Flutter", "React Native", "Cross-Platform"],
    gets: ["App Store & Play Store deployment", "Push notifications & real-time", "Ongoing support & updates"],
    href: "/mobile-app-development",
  },
  {
    n: "04",
    name: "AI & Automation",
    from: "$500",
    tag: "AI that actually does real work.",
    desc: "Custom AI tools, chatbots, workflow automations, and LLM-powered systems that save your team hours every week. From strategy through deployment — AI built to compound, not just demo.",
    chips: ["AI Tools", "Chatbots", "Automation", "LLM Integration", "Fine-Tuning"],
    gets: ["Custom AI built for your workflow", "Seamless integration with existing tools", "Measurable time & cost savings"],
    href: "/ai-development",
  },
  {
    n: "05",
    name: "E-Commerce",
    from: "$500",
    tag: "Stores that actually sell.",
    desc: "Shopify, WooCommerce, or fully custom — we build e-commerce platforms optimized for checkout speed, conversion rate, and inventory sanity. Payment gateways, multi-currency, and full migration support.",
    chips: ["Shopify", "WooCommerce", "Custom Stores", "Payment Gateways", "Multi-Currency"],
    gets: ["High-conversion checkout flow", "Multi-currency & local payments", "Migration without downtime"],
    href: "/ecommerce-development",
  },
  {
    n: "06",
    name: "UI/UX & Brand Design",
    from: "$200",
    tag: "Impossible to scroll past.",
    desc: "Interfaces, brand identities, and design systems that communicate clearly and convert consistently. From user research and wireframes to pixel-perfect UI — design that scales across every touchpoint.",
    chips: ["UI/UX Design", "Brand Identity", "Design Systems", "Prototyping", "Motion Design"],
    gets: ["Cohesive brand across all channels", "Design system for consistent output", "Production-ready Figma files"],
    href: "/ui-ux-design",
  },
];

export default function Services() {
  return (
    <>
      <SEOHead
        title="Websites, Apps & AI | Full-Stack Digital Studio | AHOS"
        description="Custom software, web development, and media & branding from AHOS. One team, strategy to launch, full code ownership."
        path="/services"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Services", url: "/services" }]} />
      <AllServicesSchema />

      <style>{css}</style>

      <motion.header
        className="ed ed-page-hero sv-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="sv-hero-inner">
          <div className="ed-label">
            <span className="ed-label-n">01 / 06</span><span className="ed-label-line" /><span className="ed-label-text">Services</span>
          </div>
          <h1 className="ed-h1">Everything you need,<br />done <em>properly.</em></h1>
          <p className="ed-lead">Web development, mobile apps, custom software, AI & automation, e-commerce, and design — handled by one team that talks to itself. No agency relay race, no finger-pointing when something breaks.</p>
        </div>
        <div className="sv-hero-strip">
          <div className="sv-strip-inner">
            {["Custom Software", "Web Development", "Mobile Apps", "AI & Automation", "E-Commerce", "UI/UX Design", "Custom Software", "Web Development"].map((s, i) => (
              <span key={i} className="sv-strip-word">{s}<span className="sv-strip-dot" /></span>
            ))}
          </div>
        </div>
      </motion.header>

      <div className="sv-body">
        {services.map((s, i) => (
          <section key={s.n} className={`ed ed-sec ${i % 2 === 1 ? "sv-alt" : ""}`}>
            <div style={{ maxWidth: 240, marginBottom: 32 }}>
              <div className="sv-num">{s.n}</div>
              {s.popular && <span className="sv-pop">Most requested</span>}
            </div>
            <div className="sv-grid">
              <div className="sv-left">
                <h2 className="sv-name">{s.name}</h2>
                <span className="sv-price">From {s.from}</span>
                <p className="sv-tag">{s.tag}</p>
              </div>
              <div className="sv-right">
                <p className="sv-desc">{s.desc}</p>
                <div className="sv-chips">
                  {s.chips.map((c) => <span key={c}>{c}</span>)}
                </div>
                <div className="sv-gets">
                  {s.gets.map((g) => (
                    <div key={g} className="sv-get">{g}</div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 24 }}>
                  {s.href && <Link href={s.href} className="ed-link-arrow" style={{ alignSelf: "center" }}>Learn more →</Link>}
                  <Link href="/contact" className="ed-btn">Start a project<span>↗</span></Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <motion.section
        className="ed ed-sec"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="ed-sec-head">
          <div className="ed-label"><span className="ed-label-n">+</span><span className="ed-label-line" /><span className="ed-label-text">Not sure where to start?</span></div>
          <h2 className="ed-h2">Book a free 30-minute call.</h2>
          <p className="ed-lead" style={{ marginTop: 18 }}>We'll listen, point you at the right move, and hand you a clear plan — no pressure, no commitment.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap", justifyContent: "center" }}>
          <Link href="/contact" className="ed-btn ed-btn-lg">Book a call<span>↗</span></Link>
          <Link href="/faq" className="ed-link-arrow">Read the FAQ →</Link>
        </div>
      </motion.section>

      <Footer />
    </>
  );
}

const css = `
.sv-hero { position: relative; }
.sv-hero-inner { position: relative; z-index: 1; }
.sv-hero-strip { position: absolute; bottom: 40px; left: 0; right: 0; overflow: hidden; z-index: 0; pointer-events: none; }
.sv-strip-inner { display: flex; white-space: nowrap; gap: 0; animation: sv-scroll 28s linear infinite; }
.sv-strip-word { font-family: var(--font-display); font-size: clamp(48px, 8vw, 100px); font-weight: 700; color: var(--text-faint); letter-spacing: -0.02em; display: flex; align-items: center; }
.sv-strip-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: rgba(255,106,26,0.15); margin: 0 2vw; }
@keyframes sv-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@media (max-width: 600px) { .sv-strip-inner { animation-duration: 50s; } }

.sv-num { font-family: var(--font-display); font-size: 80px; font-weight: 700; color: rgba(255,106,26,0.08); line-height: 0.8; letter-spacing: -0.04em; }
.sv-pop { display: inline-block; margin-top: 12px; padding: 4px 12px; border-radius: 999px; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
.sv-alt { background: var(--bg-2); }
.sv-alt .sv-num { color: rgba(255,106,26,0.12); }

.sv-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(32px, 6vw, 90px); align-items: start; }
.sv-left { position: sticky; top: 110px; }
.sv-name { font-family: var(--font-display); font-size: clamp(32px, 4.5vw, 58px); font-weight: 600; line-height: 1; letter-spacing: -0.035em; margin: 16px 0 14px; }
.sv-price { display: inline-block; margin-bottom: 14px; padding: 6px 14px; border-radius: 999px; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-family: var(--font-mono); font-size: 12.5px; font-weight: 700; letter-spacing: 0.02em; width: fit-content; }
.sv-tag { font-size: 17px; line-height: 1.5; color: var(--orange); font-weight: 500; max-width: 22ch; }
.sv-desc { font-size: clamp(15px, 1.5vw, 18px); line-height: 1.75; color: var(--text-muted); margin-bottom: 26px; max-width: 56ch; }
.sv-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 30px; }
.sv-chips span { padding: 7px 14px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-muted); font-size: 12.5px; font-weight: 600; transition: border-color 0.2s, color 0.2s; }
.sv-chips span:hover { border-color: var(--border-hover); color: var(--text); }
.sv-gets { display: grid; gap: 12px; }
.sv-get { display: flex; align-items: flex-start; gap: 12px; color: var(--text); font-size: 15px; }
.sv-get::before { content: ""; flex-shrink: 0; width: 18px; height: 18px; margin-top: 2px; border-radius: 50%; background: var(--orange-soft); border: 1px solid var(--border-hover); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 6.5l2.2 2.2L9.5 3.8' stroke='%23ff6a1a' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: center; }

@media (max-width: 860px) {
  .sv-grid { grid-template-columns: 1fr; gap: 28px; }
  .sv-left { position: static; }
}
`;
