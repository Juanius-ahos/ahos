import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { FAQSchema } from "../seo/FAQSchema";
import { FilmHero } from "../components/film/FilmHero";
import { Voices, Closing } from "../components/Blocks";
import { trackEvent } from "../lib/analytics";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

// Real client work. Copy describes what each product does; no invented metrics.
const WORK = [
  {
    name: "Threads Activewear",
    kind: "Online store",
    where: "Beirut",
    line: "A sportswear store for original Nike, adidas, On and The North Face, with cash on delivery anywhere in Lebanon.",
    img: "work/r-threads",
    loop: "ecom",
    href: "https://threadsactivewear.com",
    cta: "Visit store",
  },
  {
    name: "SpeeAligner",
    kind: "Website",
    where: "Lebanon",
    line: "Clear aligner planning for dental clinics: treatment plans, case submission and a 24-hour turnaround, explained in one scroll.",
    img: "work/r-speealigner",
    loop: "web",
    href: "/work/speealigner",
    cta: "Read the case study",
  },
  {
    name: "Jul's Auto Repair",
    kind: "Website",
    where: "Raynham, Massachusetts",
    line: "A local service site built around one action: call the shop or get directions in a single tap.",
    img: "work/r-julsauto",
    loop: "jul",
    href: "https://julsauto.com",
    cta: "Visit site",
  },
  {
    name: "I Do Taxi",
    kind: "Website and iOS app",
    where: "Beirut",
    line: "Lebanon's 24/7 taxi service, bookable by app, phone or WhatsApp, with dispatch running around the clock.",
    img: "work/r-idotaxi",
    loop: "mobile",
    href: "/work/ido-taxi",
    cta: "Read the case study",
  },
];

const BUILD = [
  {
    n: "01",
    title: "Websites and online stores",
    line: "Fast, search-ready sites and stores that turn visitors into orders, built on Shopify or fully custom.",
    links: [["Web development", "/web-development"], ["E-commerce", "/ecommerce-development"]],
  },
  {
    n: "02",
    title: "Apps and custom software",
    line: "iOS and Android apps, dashboards and internal tools, shaped around how your business actually runs.",
    links: [["Mobile apps", "/mobile-app-development"], ["Custom software", "/custom-software"]],
  },
  {
    n: "03",
    title: "AI and automation",
    line: "Assistants, WhatsApp flows and automations that take repetitive work off your team's plate.",
    links: [["AI development", "/ai-development"], ["UI and brand design", "/ui-ux-design"]],
  },
];

// Written as direct answers so search engines and AI assistants can quote them as-is.
const FAQ = [
  {
    question: "What does AHOS do?",
    answer: "AHOS is a digital product studio in Beirut, Lebanon. We design and build websites, online stores, mobile apps, custom software and AI automations for founders and businesses in Lebanon, the Gulf, Europe and the US.",
  },
  {
    question: "How long does it take to build a website or app?",
    answer: "A landing page takes about one to two weeks, a full website or online store two to four weeks, and a mobile app or custom platform usually six to twelve weeks. You get a timeline in writing before work starts.",
  },
  {
    question: "Do I own the code and design?",
    answer: "Yes. On delivery you own all source code, designs and content. There is no lock-in and no licence you have to keep paying for.",
  },
  {
    question: "How does pricing work?",
    answer: "Every project gets a fixed quote in writing after a free 30-minute call, with payments split into milestones. There is no hourly billing.",
  },
  {
    question: "Can you work with clients outside Lebanon?",
    answer: "Yes. Most of our work runs remotely, with clients across Lebanon, the Gulf, Europe and the United States. We work in English, Arabic and French.",
  },
  {
    question: "What happens after launch?",
    answer: "Every build includes a 30-day warranty. After that, care plans cover hosting, updates, monitoring and a monthly block of improvements.",
  },
];

// ---------- work: cinematic panels that stack as you scroll ----------
function Work() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".wk-card"));
    let raf = 0;
    const tick = () => {
      raf = 0;
      const vh = window.innerHeight;
      cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (!next) { c.style.setProperty("--k", "0"); return; }
        // how far the next card has slid over this one (0..1)
        const k = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - 96) / (vh * 0.8)));
        c.style.setProperty("--k", k.toFixed(3));
      });
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  return (
    <section id="work" className="hm-sec wk" ref={ref} aria-labelledby="wk-title">
      <div className="hm-wrap">
        <header className="hm-head">
          <p className="hm-kicker"><span className="hm-rule" />Selected work</p>
          <h2 id="wk-title" className="hm-h2">Products we designed, built <em>and shipped.</em></h2>
        </header>
        <div className="wk-list">
          {WORK.map((w, i) => {
            const external = w.href.startsWith("http");
            const body = (
              <>
                <div className="wk-media">
                  <img
                    src={asset(`${w.img}.webp`)}
                    srcSet={`${asset(`${w.img}-800.webp`)} 800w, ${asset(`${w.img}.webp`)} 1600w`}
                    sizes="(max-width: 900px) 100vw, 1200px"
                    alt={`${w.name} on a laptop and phone, designed and built by AHOS`}
                    loading={i === 0 ? "eager" : "lazy"}
                    width={1600}
                    height={1000}
                  />
                  <video data-loop muted loop playsInline preload="none" poster={asset(`${w.img}.webp`)} aria-hidden="true">
                    <source src={asset(`loops/work-${w.loop}.mp4`)} type="video/mp4" />
                  </video>
                </div>
                <div className="wk-meta">
                  <span className="wk-idx">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="wk-name">{w.name}</h3>
                  <p className="wk-kind">{w.kind} · {w.where}</p>
                  <p className="wk-line">{w.line}</p>
                  <span className="wk-cta">{w.cta} <span aria-hidden="true">{external ? "↗" : "→"}</span></span>
                </div>
              </>
            );
            return (
              <article className="wk-card" key={w.name} style={{ zIndex: i + 1 }}>
                {external ? (
                  <a className="wk-inner" href={w.href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("work_click", { project: w.name })}>{body}</a>
                ) : (
                  <Link className="wk-inner" href={w.href} onClick={() => trackEvent("work_click", { project: w.name })}>{body}</Link>
                )}
              </article>
            );
          })}
        </div>
        <p className="wk-also">
          Also shipped: <a href="https://www.yourprovider-lb.com" target="_blank" rel="noopener noreferrer">YourProvider</a>,{" "}
          <a href="https://www.aleph.com.lb" target="_blank" rel="noopener noreferrer">Aleph</a>,{" "}
          <Link href="/aria-ai">ARIA AI</Link> and more.
        </p>
      </div>
    </section>
  );
}

function Build() {
  return (
    <section className="hm-sec bd" aria-labelledby="bd-title">
      <div className="hm-wrap">
        <header className="hm-head">
          <p className="hm-kicker"><span className="hm-rule" />What we build</p>
          <h2 id="bd-title" className="hm-h2">Three things, <em>done properly.</em></h2>
        </header>
        <div className="bd-grid">
          {BUILD.map((b) => (
            <div className="bd-item" key={b.n}>
              <span className="bd-n">{b.n}</span>
              <h3 className="bd-title">{b.title}</h3>
              <p className="bd-line">{b.line}</p>
              <ul className="bd-links">
                {b.links.map(([label, href]) => <li key={href}><Link href={href}>{label} <span aria-hidden="true">→</span></Link></li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BeirutClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(id); }, []);
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Beirut" }).format(now);
  const hour = +new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Beirut" }).format(now);
  const online = hour >= 9 && hour < 21;
  return (
    <p className="st-clock">
      <span className={`st-dot${online ? " is-on" : ""}`} aria-hidden="true" />
      {time} in Beirut · {online ? "we're online" : "we reply first thing tomorrow"}
    </p>
  );
}

function Studio() {
  return (
    <section className="hm-sec st" aria-labelledby="st-title">
      <div className="hm-wrap st-grid">
        <div>
          <p className="hm-kicker"><span className="hm-rule" />The studio</p>
          <h2 id="st-title" className="st-statement">
            A small senior team in Beirut. You talk to the people who <em>build your product,</em> from the first call to launch day.
          </h2>
          <BeirutClock />
        </div>
        <dl className="st-facts">
          <div><dt>Since</dt><dd>2023</dd></div>
          <div><dt>Products shipped</dt><dd>50+</dd></div>
          <div><dt>Trustpilot</dt><dd>5.0</dd></div>
          <div><dt>First reply</dt><dd>&lt; 24h</dd></div>
          <div><dt>Code ownership</dt><dd>100%</dd></div>
          <div><dt>Warranty</dt><dd>30 days</dd></div>
        </dl>
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section className="hm-sec qa" aria-labelledby="qa-title">
      <FAQSchema items={FAQ} />
      <div className="hm-wrap qa-grid">
        <header>
          <p className="hm-kicker"><span className="hm-rule" />Questions</p>
          <h2 id="qa-title" className="hm-h2">Straight <em>answers.</em></h2>
          <Link href="/faq" className="qa-more">All questions →</Link>
        </header>
        <div className="qa-list">
          {FAQ.map((f, i) => (
            <details key={f.question} open={i === 0}>
              <summary>{f.question}<span aria-hidden="true" /></summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SEOHead
        title="AHOS | Websites, Apps and Software for Founders, Built in Beirut"
        description="AHOS is a digital product studio in Beirut, Lebanon. We design and build websites, online stores, mobile apps and custom software for founders in Lebanon, the Gulf, Europe and the US. Fixed quotes, and you own the code."
        path="/"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }]} />
      <FilmHero />
      <Work />
      <Build />
      <Studio />
      <Voices />
      <Questions />
      <Closing />
      <Footer />
    </>
  );
}
