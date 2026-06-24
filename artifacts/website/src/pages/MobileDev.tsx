import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";

const services = [
  {
    n: "01",
    name: "iOS App Development",
    tag: "Native Swift experiences for Apple users.",
    desc: "From concept to App Store — we build native iOS applications using Swift and SwiftUI that feel right at home on iPhone and iPad. Push notifications, in-app purchases, Apple Pay, HealthKit, and every modern iOS capability — shipped with full App Store compliance and metadata.",
    chips: ["Swift / SwiftUI", "UIKit", "In-App Purchases", "Push Notifications", "App Store Deployment"],
  },
  {
    n: "02",
    name: "Android App Development",
    tag: "Kotlin-native apps that run on a billion devices.",
    desc: "Built with Kotlin and Jetpack Compose, our Android apps take full advantage of the platform — Material Design, deep linking, background services, Google Pay, and seamless Play Store integration. Optimized for the fragmented Android ecosystem.",
    chips: ["Kotlin / Compose", "Material Design", "Google Pay", "Background Services", "Play Store"],
  },
  {
    n: "03",
    name: "Cross-Platform Apps (Flutter / React Native)",
    tag: "One codebase, two stores, full native feel.",
    desc: "When you need iOS and Android without building twice, we use Flutter or React Native to deliver near-native performance with a single codebase. Shared business logic, platform-specific UI where it counts, and a single development cost.",
    chips: ["Flutter", "React Native", "Shared Codebase", "Native Modules", "Simultaneous Launch"],
    popular: true,
  },
  {
    n: "04",
    name: "App UI/UX & Prototyping",
    tag: "Design that users actually enjoy tapping.",
    desc: "Wireframes, interactive prototypes, user flows, and pixel-perfect UI — designed for mobile-first interaction patterns. We test navigation, thumb zones, loading states, and accessibility before writing a single line of platform code.",
    chips: ["Wireframes", "Interactive Prototypes", "User Flows", "Mobile UI Design", "Usability Testing"],
  },
  {
    n: "05",
    name: "Backend & API for Mobile",
    tag: "The infrastructure your app depends on.",
    desc: "RESTful and GraphQL APIs, real-time WebSocket connections, auth systems (JWT, OAuth), push notification infrastructure, cloud storage, and analytics pipelines — built to scale from day one with your mobile app.",
    chips: ["REST / GraphQL", "WebSockets", "Auth Systems", "Cloud Storage", "Analytics"],
  },
];

export default function MobileDev() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEOHead
        title="Mobile App Development Agency — iOS & Android Apps"
        description="AHOS builds native iOS, Android, and cross-platform mobile applications. From concept to App Store deployment — designed, developed, and shipped by one team in Beirut."
        path="/mobile-app-development"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Mobile App Development", url: "/mobile-app-development" }]} />

      <style>{css}</style>

      <motion.header
        className="ed ed-page-hero md-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="md-hero-grid">
          <div>
            <div className="ed-label">
              <span className="ed-label-n">02</span><span className="ed-label-line" /><span className="ed-label-text">Mobile App Development</span>
            </div>
            <h1 className="ed-h1">Apps people<br /><em>keep using.</em></h1>
            <p className="ed-lead">From concept to app store — iOS, Android, or cross-platform. We design, develop, and ship mobile applications that users genuinely enjoy opening every day.</p>
            <div className="ed-cta-row" style={{ marginTop: 32 }}>
              <Link href="/contact" className="ed-btn ed-btn-lg">Start your app<span>↗</span></Link>
              <Link href="/services" className="ed-link-arrow">See all services →</Link>
            </div>
          </div>
          <div className="md-hero-showcase" aria-hidden="true">
            <div className="md-phone-frame">
              <div className="md-phone-notch" />
              <div className="md-phone-screen">
                <div className="md-phone-bar"><span className="md-phone-time">9:41</span></div>
                <div className="md-phone-app">
                  <div className="md-phone-icon" style={{ background: "var(--orange)" }}>A</div>
                  <div className="md-phone-lines">
                    <div className="md-phone-line" style={{ width: "70%" }} />
                    <div className="md-phone-line" style={{ width: "40%" }} />
                    <div className="md-phone-line" style={{ width: "55%" }} />
                  </div>
                </div>
                <div className="md-phone-app">
                  <div className="md-phone-icon" style={{ background: "var(--border)" }}>B</div>
                  <div className="md-phone-lines">
                    <div className="md-phone-line" style={{ width: "60%" }} />
                    <div className="md-phone-line" style={{ width: "45%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <section className="md-rows-wrap">
        {services.map((s, i) => (
          <section key={s.n} className={`ed ed-sec ${i % 2 === 1 ? "md-alt" : ""}`}>
            <div className="md-row">
              <div className="md-row-head">
                <span className="md-n">{s.n}</span>
                <h2 className="md-name">{s.name}{s.popular && <span className="md-pop">Popular</span>}</h2>
              </div>
              <div className="md-row-body">
                <p className="md-tag">{s.tag}</p>
                <p className="md-desc">{s.desc}</p>
                <div className="md-chips">{s.chips.map((c) => <span key={c}>{c}</span>)}</div>
              </div>
            </div>
          </section>
        ))}
      </section>

      <motion.section
        className="ed ed-sec md-cta"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 className="ed-h2">Ready to launch your app?</h2>
          <p className="ed-lead" style={{ margin: "18px auto 30px", maxWidth: 560 }}>Book a free 30-minute call. We'll map your full mobile build — platforms, features, timeline, and a fixed-price quote — before you commit a dollar.</p>
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
.md-hero-grid { display: grid; grid-template-columns: 1.3fr 0.7fr; gap: clamp(32px, 5vw, 72px); align-items: start; }
.md-hero-showcase { display: flex; justify-content: center; }
.md-phone-frame { width: 200px; background: #0d0d10; border: 2px solid var(--border); border-radius: 32px; padding: 10px; position: relative; overflow: hidden; }
.md-phone-notch { width: 80px; height: 22px; background: #0d0d10; border-radius: 0 0 14px 14px; margin: 0 auto 10px; }
.md-phone-screen { background: var(--bg-2); border-radius: 14px; padding: 12px; }
.md-phone-bar { display: flex; justify-content: center; margin-bottom: 12px; }
.md-phone-time { font-family: var(--font-mono); font-size: 10px; color: var(--text-dim); letter-spacing: 0.05em; }
.md-phone-app { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.md-phone-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-weight: 700; color: var(--text); font-size: 14px; flex-shrink: 0; }
.md-phone-lines { flex: 1; display: flex; flex-direction: column; gap: 5px; }
.md-phone-line { height: 6px; border-radius: 3px; background: var(--border); }

.md-rows-wrap { border-top: 1px solid var(--border-soft); }
.md-row { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(24px, 5vw, 72px); padding: clamp(32px, 4vw, 52px) 4px; border-bottom: 1px solid var(--border-soft); transition: background 0.3s; }
.md-row:hover { background: linear-gradient(90deg, var(--orange-soft), transparent 55%); }
.md-alt { background: var(--bg-2); }
.md-row-head { display: flex; align-items: baseline; gap: 18px; }
.md-n { font-family: var(--font-display); font-size: 14px; font-weight: 600; color: var(--orange); }
.md-name { font-family: var(--font-display); font-size: clamp(24px, 3.4vw, 42px); font-weight: 600; line-height: 1.02; letter-spacing: -0.03em; }
.md-pop { display: inline-block; margin-left: 12px; padding: 4px 11px; border-radius: 999px; background: var(--orange-soft); border: 1px solid var(--border-hover); color: var(--orange); font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; vertical-align: middle; white-space: nowrap; }
.md-tag { font-size: 16px; font-weight: 500; color: var(--orange); margin-bottom: 12px; }
.md-desc { font-size: 15px; line-height: 1.75; color: var(--text-muted); margin-bottom: 20px; max-width: 60ch; }
.md-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.md-chips span { padding: 6px 13px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-muted); font-size: 12px; font-weight: 600; }

@media (max-width: 860px) {
  .md-hero-grid { grid-template-columns: 1fr; }
  .md-row { grid-template-columns: 1fr; gap: 16px; }
}
`;
