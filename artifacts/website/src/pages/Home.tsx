import { Link } from "wouter";
import { Footer } from "../components/Footer";
import { OverlayParticles } from "../components/OverlayParticles";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { trackEvent } from "../lib/analytics";
import { HeroMain } from "../components/home/HeroMain";
import { IntroAnimation } from "../components/home/IntroAnimation";
import { LogoMarquee } from "../components/home/LogoMarquee";
import { ReviewsMarquee } from "../components/home/ReviewsMarquee";
import { MethodSection } from "../components/home/MethodSection";
import { StatsTicker } from "../components/home/StatsTicker";
import { AuditSection } from "../components/home/AuditSection";

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
    <section className="sm-section">
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

function WorkGrid() {
  return (
    <section className="wg-section">
      <style>{wgCss}</style>
      <div className="ed">
        <div className="wg-head">
          <span className="ed-label">
            <span className="ed-label-n">02</span>
            <span className="ed-label-line" />
            <span className="ed-label-text">Selected work</span>
          </span>
          <h2 className="ed-h2">Projects we've shipped.</h2>
        </div>
        <div className="wg-grid">
          {work.map((p) => (
            <div key={p.name + p.cat} className="wg-card">
              {p.url.startsWith("/") ? (
                <Link href={p.url} className="wg-card-link" onClick={() => trackEvent("select_content", { content_type: "work_sample", item_id: p.name })}>
                  <picture>
                    {p.img.endsWith(".jpg") && <source srcSet={srcsetWebp(p.img)} type="image/webp" sizes="(max-width: 600px) 480px, 880px" />}
                    <img src={asset(p.img)} alt={`${p.name}, ${p.cat} project built by AHOS`} {...(p.img.endsWith(".jpg") ? { srcSet: srcset(p.img), sizes: "(max-width: 600px) 480px, 880px" } : {})} width={1280} height={860} loading="lazy" decoding="async" />
                  </picture>
                  <div className="wg-card-bar">
                    <span className="wg-card-dot" /><span className="wg-card-dot" /><span className="wg-card-dot" />
                  </div>
                  <div className="wg-cap">
                    <h3 className="wg-name">{p.name}</h3>
                    <span className="wg-cat">{p.cat}</span>
                  </div>
                </Link>
              ) : (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="wg-card-link" onClick={() => trackEvent("select_content", { content_type: "work_sample", item_id: p.name })}>
                  <picture>
                    {p.img.endsWith(".jpg") && <source srcSet={srcsetWebp(p.img)} type="image/webp" sizes="(max-width: 600px) 480px, 880px" />}
                    <img src={asset(p.img)} alt={`${p.name}, ${p.cat} project built by AHOS`} {...(p.img.endsWith(".jpg") ? { srcSet: srcset(p.img), sizes: "(max-width: 600px) 480px, 880px" } : {})} width={1280} height={860} loading="lazy" decoding="async" />
                  </picture>
                  <div className="wg-card-bar">
                    <span className="wg-card-dot" /><span className="wg-card-dot" /><span className="wg-card-dot" />
                  </div>
                  <div className="wg-cap">
                    <h3 className="wg-name">{p.name}</h3>
                    <span className="wg-cat">{p.cat}</span>
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const wgCss = `
.wg-section { padding: var(--section-pad) 0; border-top: 1px solid var(--border-soft); }
.wg-head { margin-bottom: clamp(36px, 5vw, 56px); }
.wg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr)); gap: 20px; }
.wg-card { border-radius: var(--radius-xl); overflow: hidden; background: var(--bg-card); border: 0.5px solid var(--border); transition: border-color 0.35s, box-shadow 0.35s; }
.wg-card:hover { border-color: var(--border-hover); box-shadow: 0 18px 44px -12px rgba(0,0,0,0.5); }
.wg-card-link { display: flex; flex-direction: column; width: 100%; height: 100%; color: inherit; text-decoration: none; }
.wg-card img { width: 100%; aspect-ratio: 16/10; object-fit: cover; object-position: top center; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
.wg-card:hover img { transform: scale(1.04); }
.wg-card-bar { position: absolute; top: 0; left: 0; right: 0; z-index: 2; display: flex; align-items: center; gap: 6px; padding: 10px 14px; background: linear-gradient(180deg, rgba(14,14,16,0.7) 0%, transparent 100%); }
.wg-card-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--border); }
.wg-cap { padding: clamp(16px, 2vw, 24px); }
.wg-name { font-family: var(--font-display); font-size: clamp(20px, 2.5vw, 28px); font-weight: 600; letter-spacing: -0.02em; color: var(--text); margin: 0 0 4px; }
.wg-cat { font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dim); }
@media (max-width: 600px) {
  .wg-grid { grid-template-columns: 1fr; }
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

      <HeroMain />

      <LogoMarquee />

      <StatsTicker />

      <ReviewsMarquee />

      <MethodSection />

      <AuditSection />

      <ScrollingMarquee />

      <WorkGrid />

      <Footer />
    </>
  );
}
