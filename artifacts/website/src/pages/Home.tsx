import { Link } from "wouter";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import { Footer } from "../components/Footer";
import { OverlayParticles } from "../components/OverlayParticles";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { trackEvent } from "../lib/analytics";
import { HeroMain } from "../components/home/HeroMain";
import { IntroAnimation } from "../components/home/IntroAnimation";
import { ScrollProgressIndicator } from "../components/home/ScrollProgressIndicator";
import { LogoMarquee } from "../components/home/LogoMarquee";
import { ReviewsMarquee } from "../components/home/ReviewsMarquee";
import { MethodSection } from "../components/home/MethodSection";
import { StatsTicker } from "../components/home/StatsTicker";
import { AuditSection } from "../components/home/AuditSection";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
const hexToRgb = (h: string) => {
  const v = parseInt(h.replace("#", ""), 16);
  return `${(v >> 16) & 255},${(v >> 8) & 255},${v & 255}`;
};
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
  { name: "SpeeAligner", cat: "Web · Healthcare", year: "2026", img: "work/speealigner.jpg", url: "/work/speealigner" },
  { name: "Jul's Auto", cat: "Web · Automotive", year: "2026", img: "work/julsauto.jpg", url: "https://julsauto.com" },
  { name: "YourProvider", cat: "Web · Services", year: "2023", img: "work/yourprovider.jpg", url: "https://www.yourprovider-lb.com" },
  { name: "Aleph", cat: "Web · Print & Packaging", year: "2026", img: "work/aleph.jpg", url: "https://www.aleph.com.lb" },
  { name: "Ido Taxi", cat: "Web & Mobile App · Transport", year: "2025", img: "work/idotaxi.jpg", url: "/work/ido-taxi" },
  { name: "ARIA AI", cat: "AI · Chat", year: "2026", img: "work/aria-ai.svg", url: "/aria-ai" },
];

function ScrollingMarquee() {
  const text = "YOUR TECHNOLOGY DOESN'T HAVE TO BE THE MOST SOPHISTICATED. YOUR PROCESSES DON'T HAVE TO BE THE MOST BUREAUCRATIC. NOR THE MOST EXPENSIVE. THEY NEED TO BE RIGHT. · ";
  const repeated = text.repeat(6);
  const rm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pause = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; };
  const resume = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = ""; };

  return (
    <section className="sm-section" data-accent="255,106,26">
      <style>{smCss}</style>
      <div className="sm-row">
        <div className="sm-track" onMouseEnter={pause} onMouseLeave={resume}>
          <span className="sm-text">{repeated}</span>
        </div>
      </div>
    </section>
  );
}

const smCss = `
.sm-section { overflow: hidden; border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); padding: clamp(28px, 4vw, 48px) 0; background: var(--bg); }
.sm-row { display: flex; overflow: hidden; }
.sm-track { display: flex; white-space: nowrap; animation: sm-scroll 60s linear infinite; will-change: transform; }
.sm-track:hover { animation-play-state: paused; }
.sm-text { font-family: var(--font-display); font-size: clamp(14px, 1.6vw, 20px); font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-faint); }
@keyframes sm-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .sm-track { animation: none; } }
`;

function WorkRail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = work.length;
  const total = n + 1;
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${n * 88 + n * 3}vw`]);
  const [idx, setIdx] = useState(1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(total, Math.floor(v * total) + 1);
    setIdx((prev) => (prev === next ? prev : next));
  });

  return (
    <section className="hs-section" style={{ height: `${total * 100}vh` }} ref={ref} data-accent="255,140,74">
      <div className="hs-sticky">
        <div className="hs-heading">
          <div className="ed-label">
            <span className="ed-label-n">02</span>
            <span className="ed-label-line" />
            <span className="ed-label-text">Selected work</span>
          </div>
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
                <div key={p.name + p.cat} className="hs-card">
                  <Link href={p.url} className="hs-card-inner-link" onClick={() => trackEvent("select_content", { content_type: "work_sample", item_id: p.name })}>
                    <picture>
                      {p.img.endsWith(".jpg") && <source srcSet={srcsetWebp(p.img)} type="image/webp" sizes="(max-width: 600px) 480px, 880px" />}
                      <img src={asset(p.img)} alt={`${p.name}, ${p.cat} project built by AHOS`} {...(p.img.endsWith(".jpg") ? { srcSet: srcset(p.img), sizes: "(max-width: 600px) 480px, 880px" } : {})} width={1280} height={860} loading="eager" decoding="async" fetchPriority="low" />
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
                      <span className="hs-go" aria-hidden="true">{p.url.startsWith("/work/") ? "Case study →" : "Visit ↗"}</span>
                    </div>
                  </Link>
                </div>
              ) : (
                <div key={p.name + p.cat} className="hs-card">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="hs-card-inner-link" onClick={() => trackEvent("select_content", { content_type: "work_sample", item_id: p.name })}>
                    <picture>
                      {p.img.endsWith(".jpg") && <source srcSet={srcsetWebp(p.img)} type="image/webp" sizes="(max-width: 600px) 480px, 880px" />}
                      <img src={asset(p.img)} alt={`${p.name}, ${p.cat} project built by AHOS`} {...(p.img.endsWith(".jpg") ? { srcSet: srcset(p.img), sizes: "(max-width: 600px) 480px, 880px" } : {})} width={1280} height={860} loading="eager" decoding="async" fetchPriority="low" />
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
                </div>
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

function CtaFooter() {
  return (
    <section className="cta-section" data-accent="255,106,26">
      <style>{ctaCss}</style>
      <div className="cta-inner">
        <h2 className="cta-title">And every business<br />deserves to evolve</h2>
        <div className="cta-links">
          <a href="mailto:info@ahos.xyz" className="cta-link">
            <span className="cta-link-label">email</span>
            <span className="cta-link-text">write to us · info@ahos.xyz</span>
            <span className="cta-link-arrow" aria-hidden="true">→</span>
          </a>
          <a href="https://wa.me/96170165601" className="cta-link" target="_blank" rel="noopener noreferrer">
            <span className="cta-link-label">whatsapp</span>
            <span className="cta-link-text">let's talk · +961 70 165 601</span>
            <span className="cta-link-arrow" aria-hidden="true">→</span>
          </a>
        </div>
        <div className="cta-socials">
          <a href="https://www.instagram.com/ahos.xyz/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a>
          <a href="https://www.linkedin.com/company/ahos-xyz" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
          <a href="https://www.youtube.com/@ahos_xyz" target="_blank" rel="noopener noreferrer" aria-label="YouTube">YouTube</a>
        </div>
      </div>
    </section>
  );
}

const ctaCss = `
.cta-section { border-top: 1px solid var(--border-soft); padding: clamp(64px, 10vh, 120px) var(--gutter); background: var(--bg); }
.cta-inner { width: min(var(--max-width), 100%); margin: 0 auto; }
.cta-title { font-family: var(--font-display); font-size: clamp(32px, 5vw, 64px); font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin-bottom: clamp(40px, 6vw, 72px); color: var(--text); }
.cta-links { display: flex; flex-direction: column; gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); border-radius: var(--radius-xl); overflow: hidden; margin-bottom: clamp(32px, 4vw, 56px); }
.cta-link { display: flex; align-items: center; gap: 16px; padding: clamp(20px, 3vw, 32px) clamp(24px, 3vw, 40px); background: var(--bg-card); transition: background 0.3s; }
.cta-link:hover { background: var(--bg-card-hover); }
.cta-link-label { font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--orange); min-width: 80px; }
.cta-link-text { font-family: var(--font-display); font-size: clamp(16px, 2vw, 22px); font-weight: 500; color: var(--text); flex: 1; }
.cta-link-arrow { font-size: 20px; color: var(--text-dim); transition: color 0.3s, transform 0.3s; }
.cta-link:hover .cta-link-arrow { color: var(--orange); transform: translateX(4px); }
.cta-socials { display: flex; gap: 24px; }
.cta-socials a { font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-dim); transition: color 0.3s; }
.cta-socials a:hover { color: var(--orange); }
@media (max-width: 600px) {
  .cta-link { flex-wrap: wrap; gap: 8px; }
  .cta-link-label { min-width: auto; }
}
`;

export default function Home() {
  return (
    <>
      <SEOHead
        title="AHOS | Your Digital Partner, Evolved"
        description="AHOS is a boutique digital product studio in Beirut building websites, custom software, AI, and Web3 for founders in the US, Gulf, and worldwide. A five-phase method — Discover, Diagnose, Design, Deliver, Evolve."
        path="/"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }]} />
      <OverlayParticles />

      <IntroAnimation />

      <ScrollProgressIndicator />

      <HeroMain />

      <LogoMarquee />

      <StatsTicker />

      <ReviewsMarquee />

      <MethodSection />

      <AuditSection />

      <ScrollingMarquee />

      <WorkRail />

      <Footer />
    </>
  );
}
