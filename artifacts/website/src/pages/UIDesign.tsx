import { Link } from "wouter";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";

const services = [
  {
    n: "01",
    name: "UI/UX Design for Web & Mobile",
    tag: "Interfaces people actually enjoy using.",
    desc: "User research, wireframes, high-fidelity mockups, and interactive prototypes — designed for clarity, accessibility, and conversion. Every screen is built around real user flows, not aesthetic preferences. We design in Figma and hand off production-ready specs to your development team.",
    chips: ["User Research", "Wireframes", "High-Fidelity Mockups", "Interactive Prototypes", "Figma Design"],
  },
  {
    n: "02",
    name: "Brand Identity & Design Systems",
    tag: "One brand, every touchpoint, perfectly consistent.",
    desc: "Logo design, color systems, typography, iconography, and comprehensive design systems that scale across web, mobile, print, and social. Style guides, component libraries, and brand playbooks — everything your team needs to stay on-brand without thinking about it.",
    chips: ["Logo Design", "Color Systems", "Typography", "Iconography", "Design System"],
    popular: true,
  },
  {
    n: "03",
    name: "Product Design & Strategy",
    tag: "Features that solve real problems.",
    desc: "End-to-end product design — from concept validation and user testing to pixel-perfect UI and launch. We help you define what to build, validate it with real users before writing code, and iterate fast based on feedback. Lean, research-backed, and outcome-focused.",
    chips: ["Concept Validation", "User Testing", "Product Strategy", "Iterative Design", "Launch Support"],
  },
  {
    n: "04",
    name: "Motion Design & Animation",
    tag: "Movement that tells a story.",
    desc: "Micro-interactions, loading animations, page transitions, scroll-triggered effects, and explainer videos. Motion that serves a purpose — guiding attention, providing feedback, and making your product feel alive without overwhelming the user.",
    chips: ["Micro-Interactions", "Page Transitions", "Scroll Animations", "Explainer Videos", "Lottie / Rive"],
  },
  {
    n: "05",
    name: "Web & Mobile Redesign",
    tag: "Your business grew. Your website didn't.",
    desc: "If your current site or app looks outdated, doesn't convert, or is painful to maintain — we redesign it from the ground up. Complete UX audit, content restructuring, modern visual design, and a fresh front end that works on every screen.",
    chips: ["UX Audit", "Content Restructuring", "Visual Refresh", "Responsive Redesign", "Performance Boost"],
  },
];

export default function UIDesign() {
  return (
    <>
      <SEOHead
        title="UI/UX Design & Brand Identity — Web, Mobile & Product Design"
        description="AHOS designs interfaces, brand identities, and design systems for web and mobile. From user research to pixel-perfect UI — design that converts, communicates, and scales."
        path="/ui-ux-design"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "UI/UX Design", url: "/ui-ux-design" }]} />

      <style>{css}</style>

      <motion.header
        className="ed ed-page-hero ui-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="ui-hero-grid">
          <div>
            <div className="ed-label">
              <span className="ed-label-n">06</span><span className="ed-label-line" /><span className="ed-label-text">UI/UX & Brand</span>
            </div>
            <h1 className="ed-h1">Designed to be<br /><em>impossible to ignore.</em></h1>
            <p className="ed-lead">Interfaces, brand identities, and design systems that communicate clearly, convert consistently, and scale effortlessly — from first sketch to shipped product.</p>
            <div className="ed-cta-row" style={{ marginTop: 32 }}>
              <Link href="/contact" className="ed-btn ed-btn-lg">Start your design<span>↗</span></Link>
              <Link href="/services" className="ed-link-arrow">See all services →</Link>
            </div>
          </div>
          <div className="ui-grid-display" aria-hidden="true">
            <div className="ui-grid-box">
              <div className="ui-grid-row"><div className="ui-cell ui-cell-orange" /><div className="ui-cell ui-cell-dark" /><div className="ui-cell ui-cell-dark" /></div>
              <div className="ui-grid-row"><div className="ui-cell ui-cell-dark" /><div className="ui-cell ui-cell-orange" /><div className="ui-cell ui-cell-dark" /></div>
              <div className="ui-grid-row"><div className="ui-cell ui-cell-dark" /><div className="ui-cell ui-cell-dark" /><div className="ui-cell ui-cell-orange" /></div>
            </div>
          </div>
        </div>
      </motion.header>

      <section className="ui-rows-wrap">
        {services.map((s, i) => (
          <section key={s.n} className={`ed ed-sec ${i % 2 === 1 ? "ui-alt" : ""}`}>
            <div className="ui-row">
              <div className="ui-row-head">
                <span className="ui-n">{s.n}</span>
                <h2 className="ui-name">{s.name}{s.popular && <span className="ui-pop">Popular</span>}</h2>
              </div>
              <div className="ui-row-body">
                <p className="ui-tag">{s.tag}</p>
                <p className="ui-desc">{s.desc}</p>
                <div className="ui-chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
              </div>
            </div>
          </section>
        ))}
      </section>

      <motion.section
        className="ed ed-sec ui-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 className="ed-h2">Ready to make your brand<br />impossible to scroll past?</h2>
          <p className="ed-lead" style={{ margin: "18px auto 30px", maxWidth: 560 }}>Book a free 30-minute call. We'll review your current design, identify what's not working, and sketch a direction — no pressure, just ideas.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 26, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/contact" className="ed-btn ed-btn-lg">Book a call<span>↗</span></Link>
            <Link href="/faq" className="ed-link-arrow">Process & pricing →</Link>
          </div>
        </div>
      </motion.section>

      <Footer />
    </>
  );
}

const css = `
.ui-hero-grid { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.ui-grid-display { display: flex; justify-content: center; align-items: center; }
.ui-grid-box { display: flex; flex-direction: column; gap: 6px; padding: 20px; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); }
.ui-grid-row { display: flex; gap: 6px; }
.ui-cell { width: 48px; height: 48px; border-radius: 10px; }
.ui-cell-orange { background: var(--orange); }
.ui-cell-dark { background: var(--border); }

.ui-rows-wrap { border-top: 1px solid var(--border-soft); }
.ui-row { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(24px, 5vw, 72px); padding: clamp(32px, 4vw, 52px) 4px; border-bottom: 1px solid var(--border-soft); transition: background 0.3s; }
.ui-row:hover { background: linear-gradient(90deg, var(--orange-soft), transparent 55%); }
.ui-alt { background: var(--bg-2); }
.ui-row-head { display: flex; align-items: baseline; gap: 18px; }
.ui-n { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--orange); }
.ui-name { font-family: var(--font-display); font-size: clamp(24px, 3.4vw, 42px); font-weight: 600; line-height: 1.02; letter-spacing: -0.03em; }
.ui-pop { display: inline-block; margin-left: 12px; padding: 4px 11px; border-radius: 999px; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; vertical-align: middle; white-space: nowrap; }
.ui-tag { font-size: 16px; font-weight: 500; color: var(--orange); margin-bottom: 12px; }
.ui-desc { font-size: 15px; line-height: 1.75; color: var(--text-muted); margin-bottom: 20px; max-width: 60ch; }
.ui-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.ui-chips span { padding: 6px 13px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-muted); font-size: 12px; font-weight: 600; }

@media (max-width: 860px) {
  .ui-hero-grid { grid-template-columns: 1fr; }
  .ui-row { grid-template-columns: 1fr; gap: 16px; }
}
`;
