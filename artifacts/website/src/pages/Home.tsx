import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";
import { Footer } from "../components/Footer";
import { OverlayParticles } from "../components/OverlayParticles";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { Reveal, Parallax } from "../components/motion";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
const webpSrc = (jpg: string) => jpg.replace(/\.jpg$/, ".webp");
const srcset = (p: string) => {
  const base = p.replace(/\.\w+$/, "");
  const u = (s: string) => asset(s);
  return `${u(base + "-480w.jpg")} 480w, ${u(base + "-880w.jpg")} 880w`;
};
const srcsetWebp = (p: string) => {
  const base = p.replace(/\.\w+$/, "");
  const u = (s: string) => asset(s);
  return `${u(base + "-480w.webp")} 480w, ${u(base + "-880w.webp")} 880w`;
};

const work = [
  { name: "SpeeAligner", cat: "Web · Healthcare", year: "2026", img: "work/speealigner.jpg", url: "https://www.speealigner.com" },
  { name: "YourProvider", cat: "Web · Services", year: "2023", img: "work/yourprovider.jpg", url: "https://www.yourprovider-lb.com" },
  { name: "Aleph", cat: "Web · Print & Packaging", year: "2026", img: "work/aleph.jpg", url: "https://www.aleph.com.lb" },
  { name: "Ido Taxi", cat: "Web · Transport", year: "2025", img: "work/idotaxi.jpg", url: "https://www.idotaxi.net" },
  { name: "Ido Taxi", cat: "Mobile App · iOS", year: "2025", img: "work/ido-taxi-app.jpg", url: "https://apps.apple.com/us/app/ido-taxi/id1347542411" },
  { name: "ARIA AI", cat: "AI · Chat", year: "2026", img: "work/aria-ai.svg", url: "/aria-ai" },
];

const capabilities = [
  { n: "01", title: "Web Development", desc: "Fast, pixel-tight sites built to earn their keep. Responsive on every screen, tuned for search, and ready to scale the day you need it to — from a single landing page to full e-commerce.", href: "/web-development", accent: "#ff6a1a", bg: "var(--bg)" },
  { n: "02", title: "Custom Software", desc: "Off-the-shelf tools make you bend to their logic. We do the opposite: software shaped to how your business actually runs, from first sketch to a deployed product you fully own.", href: "/custom-software", accent: "#e0560a", bg: "var(--bg-3)" },
  { n: "03", title: "Mobile Apps", desc: "Native iOS, Android, and cross-platform mobile applications designed and shipped from concept to App Store. Swift, Kotlin, Flutter, or React Native — the right stack for your product.", href: "/mobile-app-development", accent: "#ff8c4a", bg: "var(--bg-3)" },
  { n: "04", title: "Web3 & Blockchain", desc: "Audited smart contracts, dapps, token launches, and DeFi interfaces. From contracts to creative — every layer of your Web3 project under one roof.", href: "/web3", accent: "#ffb074", bg: "var(--bg-3)" },
  { n: "05", title: "AI & Automation", desc: "Custom AI tools, chatbots, and workflow automations that compound over time. From a simple chat interface to full agent pipelines — built to save you hours every week.", href: "/ai-development", accent: "#cc5500", bg: "var(--bg-3)" },
  { n: "06", title: "E-Commerce", desc: "Shopify, WooCommerce, or fully custom stores optimized for checkout speed, conversion rate, and inventory sanity. Payment gateways, multi-currency, and full migration support.", href: "/ecommerce-development", accent: "#e0560a", bg: "var(--bg-3)" },
  { n: "07", title: "UI/UX & Brand Design", desc: "Interfaces, brand identities, and design systems that communicate clearly and convert consistently. From user research to pixel-perfect UI — design that scales.", href: "/ui-ux-design", accent: "#ff8c4a", bg: "var(--bg-3)" },
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

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const active = () =>
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !active()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.015)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={reset}
      style={{ transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)", willChange: "transform" }}>
      {children}
    </div>
  );
}

function WorkRail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = work.length;
  const total = n + 1;
  const rawX = useTransform(scrollYProgress, [0, 1], ["0vw", `-${n * 88 + n * 3}vw`]);
  const x = useSpring(rawX, { stiffness: 300, damping: 30, bounce: 0.1 });
  const [idx, setIdx] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setIdx(Math.min(total, Math.floor(v * total) + 1));
  });

  return (
    <section className="hs-section" style={{ height: `${total * 100}vh` }} ref={ref}>
      <div className="hs-sticky">
        <div className="hs-heading">
          <Reveal dir="left"><Label n="02" text="Selected work" /></Reveal>
          <div className="hs-heading-row">
            <h2 className="ed-h2" style={{ margin: 0 }}>Projects we've shipped.</h2>
            <div className="hs-counter">
              <span className="hs-counter-cur">{String(idx).padStart(2, "0")}</span>
              <span className="hs-counter-total">{String(total).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
        <div className="hs-track-wrap">
          <motion.div className="hs-track" style={{ x }}>
            {work.map((p) =>
              p.url.startsWith("/") ? (
                <TiltCard key={p.name} className="hs-card">
                  <Link href={p.url} className="hs-card-inner-link">
                    <picture>
                      {p.img.endsWith(".jpg") && <source srcSet={srcsetWebp(p.img)} type="image/webp" sizes="(max-width: 600px) 480px, 880px" />}
                      <img src={asset(p.img)} alt={`${p.name} — ${p.cat} project built by AHOS`} {...(p.img.endsWith(".jpg") ? { srcSet: srcset(p.img), sizes: "(max-width: 600px) 480px, 880px" } : {})} width={1280} height={860} loading="lazy" decoding="async" />
                    </picture>
                    <div className="hs-card-bar">
                      <span className="hs-card-dot" />
                      <span className="hs-card-dot" />
                      <span className="hs-card-dot" />
                    </div>
                    <div className="hs-cap">
                      <div className="hs-cap-tx">
                        <h3 className="hs-name">{p.name}</h3>
                        <span className="hs-cat">{p.cat}</span>
                      </div>
                      <span className="hs-go" aria-hidden="true">Visit ↗</span>
                    </div>
                  </Link>
                </TiltCard>
              ) : (
                <TiltCard key={p.name} className="hs-card">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="hs-card-inner-link">
                    <picture>
                      {p.img.endsWith(".jpg") && <source srcSet={srcsetWebp(p.img)} type="image/webp" sizes="(max-width: 600px) 480px, 880px" />}
                      <img src={asset(p.img)} alt={`${p.name} — ${p.cat} project built by AHOS`} {...(p.img.endsWith(".jpg") ? { srcSet: srcset(p.img), sizes: "(max-width: 600px) 480px, 880px" } : {})} width={1280} height={860} loading="lazy" decoding="async" />
                    </picture>
                    <div className="hs-card-bar">
                      <span className="hs-card-dot" />
                      <span className="hs-card-dot" />
                      <span className="hs-card-dot" />
                    </div>
                    <div className="hs-cap">
                      <div className="hs-cap-tx">
                        <h3 className="hs-name">{p.name}</h3>
                        <span className="hs-cat">{p.cat}</span>
                      </div>
                      <span className="hs-go" aria-hidden="true">Visit ↗</span>
                    </div>
                  </a>
                </TiltCard>
              )
            )}
            <div className="hs-end-card">
              <div className="hs-card-bar">
                <span className="hs-card-dot" />
                <span className="hs-card-dot" />
                <span className="hs-card-dot" />
              </div>
              <div className="hs-end-inner">
                <span className="hs-end-amp">&</span>
                <h3 className="hs-end-title">many more to come.</h3>
                <p className="hs-end-sub">We're just getting started.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ServicesStack() {
  const cardCount = 1 + capabilities.length;
  return (
    <section className="sc-section">
      <div className="sc-stack" style={{ height: `${cardCount * 100}vh` } as React.CSSProperties}>
        <div className="sc-card" style={{ '--card-accent': '#ff6a1a', '--card-bg': 'var(--bg)' } as React.CSSProperties}>
          <div className="sc-card-inner sc-card-intro">
            <div className="sc-card-accent" />
            <Label n="03" text="Capabilities" />
            <h2 className="ed-h2" style={{ margin: "8px 0 0" }}>Seven capabilities,<br />one studio.</h2>
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
              <Parallax amount={-12} style={{ width: '100%' }}>
                <Reveal><span className="sc-card-num">{c.n}</span></Reveal>
                <Reveal delay={80}><h3 className="sc-card-title">{c.title}</h3></Reveal>
                <Reveal delay={160}><p className="sc-card-desc">{c.desc}</p></Reveal>
                <Reveal delay={240}>
                  <div className="sc-card-link">
                    <Link href={c.href} className="ed-link-arrow">Learn more →</Link>
                  </div>
                </Reveal>
              </Parallax>
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
        }, ref.current ?? undefined);

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
          <div ref={labelRef}><Label n="05" text="How we work" /></div>
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
        }, ref.current ?? undefined);

        cleanup = () => ctx.revert();
      } catch { /* fallback */ }
    })();
    return () => cleanup?.();
  }, []);

  return (
    <section className="sg-section" ref={ref}>
      <div className="sg-sticky">
        <div className="ed sg-inner">
          <div ref={labelRef}><Label n="06" text="The fine print, up front" /></div>
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
  const ref = useRef<HTMLSpanElement>(null);
  const doneRef = useRef(false);
  useEffect(() => {
    if (!play) return;
    if (to === 0) { if (ref.current) ref.current.textContent = "0" + suffix; return; }
    let raf = 0;
    let start = 0;
    const duration = 1600;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      const v = Math.round(eased * to);
      if (ref.current) ref.current.textContent = v + suffix;
      if (p < 1) raf = requestAnimationFrame(step);
      else { doneRef.current = true; if (ref.current) ref.current.classList.add("stat-bounce"); }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [play, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
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

function Testimonials() {
  const t = [
    {
      text: "I'm grateful for the team at AHOS — they did an amazing job building my website. Highly professional, neat work, amazing prices, and they reply fast. Kudos!",
      name: "Yorgo",
      role: "SpeeAligner.com, Lebanon",
      link: "https://www.trustpilot.com/reviews/69ea9b17ea057c732e8d4c18",
    },
    {
      text: "AHOS took our taxi business from a rough idea to a polished iOS app and website. Real-time booking, driver dispatch, secure payments — they handled every layer with care. The app is live, our drivers love it, and our passengers keep growing. Exactly what we needed.",
      name: "Khalil",
      role: "Ido Taxi, Lebanon",
    },
    {
      text: "We brought AHOS in to shape our content strategy, and they exceeded every expectation. They took complex DeFi concepts and turned them into clear, engaging material that actually connects with our audience. Engagement is up, our community is growing, and we finally have a voice that matches our product.",
      name: "Doran",
      role: "Marketing Lead, defi.app",
    },
  ];
  return (
    <section className="ed ed-sec">
      <Label n="04" text="What clients say" />
      <h2 className="ed-h2">Kind words from people we've worked with.</h2>
      <div className="tm-grid">
        {t.map((tc, i) => (
          <Reveal key={tc.name} delay={i * 100} className="tm-card">
            <div className="tm-stars">
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="16" height="16" viewBox="0 0 20 20" fill="var(--orange)">
                  <path d="M10 1l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 13.2l-4.8 2.7.9-5.4-3.9-3.8 5.4-.8L10 1z" />
                </svg>
              ))}
            </div>
            <p className="tm-text">"{tc.text}"</p>
            <div className="tm-meta">
              <span className="tm-name">{tc.name}</span>
              <span className="tm-role">{tc.role}</span>
            </div>
          </Reveal>
        ))}
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
      <OverlayParticles />

      {/* ─── HERO ─── */}
      <header className="ed-hero">
        <div className="ed ed-hero-inner">
          <Parallax amount={35}>
            <Link href="/contact" className="ed-hero-badge">Available for new projects</Link>
          </Parallax>
          <Parallax amount={25}>
            <div className="ed-hero-meta">
              <span>AHOS</span><span className="ed-dot" /><span>Digital Studio</span>
            </div>
          </Parallax>
          <h1 className="ed-hero-title">
            <Parallax amount={12}>
              <span className="ed-hero-line">We build digital</span>
            </Parallax>
            <Parallax amount={5}>
              <span className="ed-hero-line ed-hero-line-accent">experiences.</span>
            </Parallax>
          </h1>
          <div className="ed-hero-lead">
            <Parallax amount={-8}>
              <p>We don't follow templates. We architect custom digital solutions from strategy to launch.</p>
              <p className="ed-hero-lead-sm">For businesses that are built to stand out.</p>
            </Parallax>
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

      {/* ─── TESTIMONIALS ─── */}
      <Testimonials />

      {/* ─── PROCESS (light) ─── */}
      <ProcessSection />

      {/* ─── STATS ─── */}
      <StatsGrid />

      {/* ─── MARQUEE ─── */}
      <Marquee />

      {/* ─── CTA ─── */}
      <section className="ed ed-sec" style={{ borderTop: "1px solid var(--border-soft)" }}>
        <div className="ed">
          <Reveal dir="left"><Label n="07" text="Start here" /></Reveal>
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
