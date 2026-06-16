import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

const work = [
  { name: "SpeeAligner", cat: "Web · Healthcare", ghost: "SA", year: "2026", img: "work/speealigner.jpg", url: "https://www.speealigner.com" },
  { name: "YourProvider", cat: "Web · Services", ghost: "YP", year: "2023", img: "work/yourprovider.jpg", url: "https://www.yourprovider-lb.com" },
  { name: "Aleph", cat: "Web · Print & Packaging", ghost: "AL", year: "2026", img: "work/aleph.jpg", url: "https://www.aleph.com.lb" },
  { name: "Ido Taxi", cat: "Web · Transport", ghost: "IT", year: "2025", img: "work/idotaxi.jpg", url: "https://www.idotaxi.net" },
];

const capabilities = [
  { n: "01", title: "Web Development", desc: "Fast, pixel-tight sites built to earn their keep. Responsive on every screen, tuned for search, and ready to scale the day you need it to — from a single landing page to full e-commerce.", href: "/services", accent: "#ff6a1a", bg: "#0a0a0b" },
  { n: "02", title: "Custom Software", desc: "Off-the-shelf tools make you bend to their logic. We do the opposite: software shaped to how your business actually runs, from first sketch to a deployed product you fully own.", href: "/services", accent: "#e0560a", bg: "#1a1a20" },
  { n: "03", title: "Web3 & Blockchain", desc: "Audited smart contracts, dapps, token launches, and DeFi interfaces. From contracts to creative — every layer of your Web3 project under one roof.", href: "/web3", accent: "#ff8c4a", bg: "#1a0e08" },
  { n: "04", title: "AI & Automation", desc: "Custom AI tools, chatbots, and workflow automations that compound over time. From a simple chat interface to full agent pipelines — built to save you hours every week.", href: "/aria-ai", accent: "#cc5500", bg: "#100e1a" },
  { n: "05", title: "Media & Branding", desc: "Visuals that tell your story and hold a room. Video, motion, identity systems, and social packs — so everything you put out looks like it came from one confident brand.", href: "/services", accent: "#ffb074", bg: "#14100d" },
];

const steps = [
  { n: "01", title: "Discovery", text: "A free consultation to learn your goals, define the product, and map a clear plan with a fixed-price quote." },
  { n: "02", title: "Design & Build", text: "We craft your solution with clean code and sharp design — milestone updates at every stage." },
  { n: "03", title: "Launch & Support", text: "We deploy, monitor, and support from day one, with 24/7 availability and a 30-day warranty." },
];

const stats = [
  { to: 100, suffix: "%", label: "Source code, yours" },
  { to: 30, suffix: "", label: "Day post-launch warranty" },
  { to: 24, suffix: "h", label: "Average first reply" },
  { to: 0, suffix: "", label: "Hidden fees, fixed quotes" },
];

function Label({ n, text }: { n: string; text: string }) {
  return (
    <div className="ed-label">
      <span className="ed-label-n">{n}</span>
      <span className="ed-label-line" />
      <span className="ed-label-text">{text}</span>
    </div>
  );
}

function ZoomReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const gsap = (await import("gsap")).default;
        const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
        gsap.registerPlugin(ScrollTrigger);

        const words = ref.current?.querySelectorAll<HTMLSpanElement>(".zoom-word");
        if (!words || !words.length) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1,
          },
        });
        tl.fromTo(words, { opacity: 0, scale: 0.15, rotateX: 25 }, { opacity: 1, scale: 1, rotateX: 0, ease: "none" });

        cleanup = () => tl.kill();
      } catch {
        ref.current?.querySelectorAll<HTMLSpanElement>(".zoom-word").forEach((w) => { w.style.opacity = "1"; w.style.scale = "1"; });
      }
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section className="zoom-section" ref={ref}>
      <div className="zoom-sticky">
        <div className="zoom-text">
          <span className="zoom-word">From</span>
          <span className="zoom-word">idea</span>
          <span className="zoom-word">to</span>
          <span className="zoom-word" style={{ color: "var(--orange)" }}>launch</span>
          <br />
          <span className="zoom-word">one</span>
          <span className="zoom-word">team</span>
          <span className="zoom-word">no</span>
          <span className="zoom-word">handoffs.</span>
        </div>
      </div>
    </section>
  );
}

function WorkRail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = work.length;
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(n - 1) * 88 + (n - 1) * 3}vw`]);
  const [idx, setIdx] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIdx(Math.min(n, Math.floor(v * n) + 1));
  });

  return (
    <section className="hs-section" style={{ height: `${n * 100}vh` }} ref={ref}>
      <div className="hs-sticky">
        <div className="hs-heading">
          <Label n="02" text="Selected work" />
          <div className="hs-heading-row">
            <h2 className="ed-h2" style={{ margin: 0 }}>Projects we've shipped.</h2>
            <div className="hs-counter">
              <span className="hs-counter-cur">{String(idx).padStart(2, "0")}</span>
              <span className="hs-counter-total">{String(n).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
        <div className="hs-track-wrap">
          <motion.div className="hs-track" style={{ x }}>
            {work.map((p) => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="hs-card">
                <img src={asset(p.img)} alt={`${p.name} website screenshot`} width={1280} height={860} loading="lazy" decoding="async" />
                <span className="hs-scrim" />
                <span className="hs-ghost">{p.ghost}</span>
                <div className="hs-cap">
                  <div className="hs-cap-tx">
                    <h3 className="hs-name">{p.name}</h3>
                    <span className="hs-cat">{p.cat}</span>
                  </div>
                  <span className="hs-go" aria-hidden="true">Visit ↗</span>
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServicesStack() {
  return (
    <section className="sc-section">
      <div className="sc-stack">
        <div className="sc-card" style={{ '--card-accent': '#ff6a1a', '--card-bg': '#0a0a0b' } as React.CSSProperties}>
          <div className="sc-card-inner sc-card-intro">
            <div className="sc-card-accent" />
            <Label n="03" text="Capabilities" />
            <h2 className="ed-h2" style={{ margin: "8px 0 0" }}>Five capabilities,<br />one studio.</h2>
          </div>
        </div>
        {capabilities.map((c) => (
          <div
            key={c.n}
            className="sc-card"
            style={{ '--card-accent': c.accent, '--card-bg': c.bg } as React.CSSProperties}
          >
            <div className="sc-card-inner">
              <div className="sc-card-accent" />
              <span className="sc-card-num">{c.n}</span>
              <h3 className="sc-card-title">{c.title}</h3>
              <p className="sc-card-desc">{c.desc}</p>
              <div className="sc-card-link">
                <Link href={c.href} className="ed-link-arrow">Learn more →</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const gsap = (await import("gsap")).default;
        const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
            },
          });

          if (labelRef.current) {
            tl.from(labelRef.current, { x: -60, opacity: 0, ease: "none" }, 0);
          }
          if (titleRef.current) {
            tl.from(titleRef.current, { x: 80, opacity: 0, ease: "none" }, 0);
          }
          const stepEls = stepsRef.current?.querySelectorAll<HTMLDivElement>(".ed-step");
          if (stepEls?.length) {
            tl.from(stepEls, { x: (i) => (i % 2 === 0 ? -60 : 60), opacity: 0, ease: "none" }, 0.15);
          }
        }, ref.current);

        cleanup = () => ctx.revert();
      } catch {
        // fallback — reveal all
      }
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section className="ps-section" ref={ref}>
      <div className="ps-sticky section-light">
        <div className="ed ps-inner">
          <div ref={labelRef}><Label n="04" text="How we work" /></div>
          <h2 ref={titleRef} className="ed-h2 ps-title">Three steps to a<br />live product.</h2>
          <div ref={stepsRef} className="ed-steps">
            {steps.map((s) => (
              <div key={s.n} className="ed-step">
                <span className="ed-step-n">{s.n}</span>
                <h3 className="ed-step-title">{s.title}</h3>
                <p className="ed-step-text">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      try {
        const gsap = (await import("gsap")).default;
        const ScrollTrigger = (await import("gsap/ScrollTrigger")).default;
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: 1,
              onUpdate: (self) => setProgress(self.progress),
            },
          });

          if (labelRef.current) tl.from(labelRef.current, { y: 40, opacity: 0, ease: "none" }, 0);
          if (titleRef.current) tl.from(titleRef.current, { y: 40, opacity: 0, ease: "none" }, 0.1);
          if (gridRef.current) tl.from(gridRef.current, { y: 60, opacity: 0, ease: "none" }, 0.2);
        }, ref.current);

        cleanup = () => ctx.revert();
      } catch { /* fallback */ }
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section className="sg-section" ref={ref}>
      <div className="sg-sticky">
        <div className="ed sg-inner">
          <div ref={labelRef}><Label n="05" text="The fine print, up front" /></div>
          <h2 ref={titleRef} className="ed-h2 sg-title">No surprises.<br />In writing.</h2>
          <div ref={gridRef} className="ed-stats">
            {stats.map((s) => (
              <div key={s.label} className="ed-stat">
                <div className="ed-stat-num">
                  <CountUpVal to={s.to} suffix={s.suffix} play={progress > 0} />
                </div>
                <div className="ed-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUpVal({ to, suffix, play }: { to: number; suffix: string; play: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!play) return;
    if (to === 0) { setVal(0); return; }
    let raf = 0;
    let start = 0;
    const duration = 1600;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [play, to]);
  return <>{val}{suffix}</>;
}

function Marquee() {
  const row1 = ["BUILD", "·", "SHIP", "·", "SCALE", "·", "REPEAT"];
  const row2 = ["strategy", "·", "design", "·", "code", "·", "launch"];

  return (
    <section className="mq-section">
      <div className="mq-row">
        <div className="mq-row-inner">
          {[...row1, ...row1].map((w, i) =>
            w === "·" ? <span key={i} className="mq-dot" /> : <span key={i} className="mq-word">{w}</span>
          )}
        </div>
      </div>
      <div className="mq-row">
        <div className="mq-row-inner mq-row-inner-reverse">
          {[...row2, ...row2].map((w, i) =>
            w === "·" ? <span key={i} className="mq-dot" /> : <span key={i} className="mq-word-dim">{w}</span>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEOHead
        title="AHOS — Digital Product Studio"
        description="AHOS builds premium websites, custom software, Web3 platforms, AI tools, and brand identities for businesses worldwide. From strategy to launch — under one roof."
        path="/"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }]} />

      {/* ─── HERO ─── */}
      <header className="ed-hero">
        <div className="ed ed-hero-inner">
          <div className="ed-hero-badge">Available for new projects</div>
          <div className="ed-hero-meta">
            <span>AHOS</span><span className="ed-dot" /><span>Digital Studio</span>
          </div>
          <h1 className="ed-hero-title">
            <span className="ed-hero-line">We build digital</span>
            <span className="ed-hero-line ed-hero-line-accent">experiences.</span>
          </h1>
          <div className="ed-hero-lead">
            <p>We don't follow templates. We architect custom digital solutions — from strategy to launch — for businesses that are built to stand out.</p>
            <div className="ed-hero-actions">
              <Link href="/contact" className="ed-btn ed-btn-lg">Start a project<span>↗</span></Link>
              <Link href="/services" className="ed-link-arrow">Explore services</Link>
            </div>
          </div>
        </div>
        <span className="ed-hero-scroll" aria-hidden="true">Scroll</span>
      </header>

      {/* ─── ZOOM MISSION ─── */}
      <ZoomReveal />

      {/* ─── WORK RAIL ─── */}
      <WorkRail />

      {/* ─── SERVICES STACK ─── */}
      <ServicesStack />

      {/* ─── PROCESS (light) ─── */}
      <ProcessSection />

      {/* ─── STATS ─── */}
      <StatsGrid />

      {/* ─── MARQUEE ─── */}
      <Marquee />

      {/* ─── CTA ─── */}
      <section className="ed ed-sec" style={{ borderTop: "1px solid var(--border-soft)" }}>
        <div className="ed">
          <Label n="06" text="Start here" />
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(80px, 22vw, 360px)",
            fontWeight: 700,
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
            marginBottom: 16,
          }}>
            START?
          </h2>
          <p style={{ fontSize: "clamp(18px, 2.5vw, 32px)", fontStyle: "italic", color: "var(--text-muted)", marginBottom: 40 }}>
            tell us your idea.
          </p>
          <div className="ed-cta-row">
            <Link href="/contact" className="ed-btn ed-btn-lg">Start a project<span>↗</span></Link>
            <a href="mailto:info@ahos.xyz" className="ed-link-arrow">info@ahos.xyz</a>
          </div>
          <p style={{ marginTop: 20, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-dim)" }}>
            Free 30-min call · No commitment · We reply within 24h
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
