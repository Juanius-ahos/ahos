import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { FAQSchema } from "../seo/FAQSchema";
import { FilmHero } from "../components/film/FilmHero";
import { Sheet, type Project } from "../components/Sheet";
import { Arrow } from "../components/Arrow";
import { trackEvent } from "../lib/analytics";
import "./home.css";

// Real client work. Each drawing is measured from the live site's own first screen.
const WORK: Project[] = [
  {
    id: "threads", name: "Threads Activewear", what: "Online store", where: "Beirut", href: "https://threadsactivewear.com", linkLabel: "threadsactivewear.com",
    marks: [
      { k: "bar", x: 0, y: 0, w: 1, h: 0.04 },
      { k: "box", x: 0.02, y: 0.055, w: 0.095, h: 0.035 }, { k: "text", x: 0.13, y: 0.06, w: 0.37, h: 0.025, lines: 1 }, { k: "box", x: 0.89, y: 0.055, w: 0.08, h: 0.035 },
      { k: "text", x: 0.02, y: 0.2, w: 0.2, h: 0.02, lines: 1 },
      { k: "text", x: 0.02, y: 0.25, w: 0.25, h: 0.36, lines: 3, heavy: true },
      { k: "text", x: 0.02, y: 0.65, w: 0.36, h: 0.1, lines: 3 },
      { k: "btn", x: 0.02, y: 0.81, w: 0.11, h: 0.06, fill: true }, { k: "btn", x: 0.14, y: 0.81, w: 0.09, h: 0.06 },
      { k: "img", x: 0.52, y: 0.22, w: 0.45, h: 0.55 },
      { k: "text", x: 0.69, y: 0.82, w: 0.09, h: 0.09, lines: 2 }, { k: "box", x: 0.68, y: 0.92, w: 0.11, h: 0.05 },
    ],
    notes: [
      { x: 0.42, y: 0.16, to: [0.25, 0.3], text: "one line, the whole promise" },
      { x: 0.3, y: 0.95, to: [0.075, 0.84], text: "cash on delivery, in one tap" },
    ],
  },
  {
    id: "speealigner", name: "SpeeAligner", what: "Website", where: "Lebanon", href: "/work/speealigner", linkLabel: "Read the case study",
    marks: [
      { k: "box", x: 0.128, y: 0.02, w: 0.028, h: 0.05 }, { k: "text", x: 0.347, y: 0.03, w: 0.39, h: 0.025, lines: 1 }, { k: "btn", x: 0.768, y: 0.02, w: 0.103, h: 0.047, fill: true },
      { k: "text", x: 0.125, y: 0.19, w: 0.62, h: 0.07, lines: 1, heavy: true }, { k: "rule", x: 0.125, y: 0.295, w: 0.747 },
      { k: "text", x: 0.125, y: 0.33, w: 0.5, h: 0.07, lines: 1, heavy: true }, { k: "rule", x: 0.125, y: 0.433, w: 0.747 },
      { k: "text", x: 0.125, y: 0.46, w: 0.675, h: 0.08, lines: 1, heavy: true },
      { k: "text", x: 0.125, y: 0.61, w: 0.37, h: 0.1, lines: 3 },
      { k: "btn", x: 0.125, y: 0.77, w: 0.113, h: 0.05, fill: true }, { k: "btn", x: 0.246, y: 0.77, w: 0.126, h: 0.05 },
      { k: "rule", x: 0.125, y: 0.9, w: 0.225 },
    ],
    notes: [
      { x: 0.93, y: 0.3, to: [0.75, 0.225], text: "three lines, one rhythm" },
      { x: 0.5, y: 0.84, to: [0.18, 0.795], text: "clinics submit a case here" },
    ],
  },
  {
    id: "julsauto", name: "Jul's Auto Repair", what: "Website", where: "Raynham, Massachusetts", href: "https://julsauto.com", linkLabel: "julsauto.com",
    marks: [
      { k: "bar", x: 0, y: 0, w: 1, h: 0.08 },
      { k: "img", x: 0, y: 0.08, w: 1, h: 0.92 },
      { k: "text", x: 0.455, y: 0.278, w: 0.092, h: 0.033, lines: 1 },
      { k: "text", x: 0.37, y: 0.344, w: 0.262, h: 0.178, lines: 2, heavy: true },
      { k: "btn", x: 0.338, y: 0.573, w: 0.169, h: 0.06, fill: true }, { k: "btn", x: 0.518, y: 0.573, w: 0.142, h: 0.06 },
      { k: "box", x: 0.083, y: 0.689, w: 0.834, h: 0.167 },
      { k: "ring", x: 0.218, y: 0.758, r: 0.024 }, { k: "ring", x: 0.497, y: 0.758, r: 0.024 }, { k: "ring", x: 0.774, y: 0.758, r: 0.024 },
    ],
    notes: [
      { x: 0.16, y: 0.5, to: [0.42, 0.6], text: "call the shop, first thing you see" },
      { x: 0.92, y: 0.3, to: [0.86, 0.04], text: "booking never scrolls away" },
    ],
  },
  {
    id: "idotaxi", name: "I Do Taxi", what: "Website and iOS app", where: "Beirut", href: "/work/ido-taxi", linkLabel: "Read the case study",
    marks: [
      { k: "box", x: 0.114, y: 0.024, w: 0.094, h: 0.032 }, { k: "text", x: 0.454, y: 0.031, w: 0.33, h: 0.018, lines: 1 }, { k: "btn", x: 0.806, y: 0.02, w: 0.084, h: 0.042, fill: true },
      { k: "text", x: 0.11, y: 0.2, w: 0.168, h: 0.015, lines: 1 },
      { k: "text", x: 0.11, y: 0.269, w: 0.246, h: 0.064, lines: 1, heavy: true },
      { k: "text", x: 0.11, y: 0.371, w: 0.322, h: 0.062, lines: 2 },
      { k: "btn", x: 0.11, y: 0.484, w: 0.157, h: 0.056, fill: true }, { k: "btn", x: 0.278, y: 0.484, w: 0.115, h: 0.056 },
      { k: "text", x: 0.11, y: 0.589, w: 0.1, h: 0.055, lines: 2 },
      { k: "box", x: 0.568, y: 0.296, w: 0.321, h: 0.242 }, { k: "rule", x: 0.59, y: 0.417, w: 0.28 },
      { k: "text", x: 0.11, y: 0.811, w: 0.779, h: 0.078, lines: 2 },
    ],
    notes: [
      { x: 0.47, y: 0.68, to: [0.19, 0.512], text: "book by WhatsApp, not a form" },
      { x: 0.95, y: 0.7, to: [0.73, 0.5], text: "24/7, said plainly" },
    ],
  },
];

const MAKE = [
  { what: "Websites and online stores", who: "For businesses that need to be found and sell online. Shopify or fully custom, with cash on delivery and WhatsApp ordering where your customers expect it.", time: "2 to 4 weeks", links: [["Web development", "/web-development"], ["Online stores", "/ecommerce-development"]] },
  { what: "Apps and custom software", who: "iOS and Android apps, dashboards and internal tools, shaped around how your business already runs.", time: "6 to 12 weeks", links: [["Mobile apps", "/mobile-app-development"], ["Custom software", "/custom-software"]] },
  { what: "AI and automation", who: "Assistants and WhatsApp flows that answer customers, take orders and handle the repetitive work.", time: "Scoped on the call", links: [["AI and automation", "/ai-development"], ["Interface design", "/ui-ux-design"]] },
];

const STEPS = [
  { name: "A 30-minute call", body: "Free. You tell us what you're building, we ask the questions that shape it.", time: "Day 1" },
  { name: "A plan and a fixed quote", body: "In writing: what we'll make, the milestones, the price. No hourly meter.", time: "Within 24 hours" },
  { name: "The drawings", body: "Every screen designed before code is written. You see exactly what you're getting, and sign it off.", time: "1 to 2 weeks" },
  { name: "The build", body: "Built by the people who drew it, with a working preview at every milestone.", time: "2 to 10 weeks" },
  { name: "Launch", body: "Live, fast, and yours: code, designs and content. Then a 30-day warranty.", time: "Launch day" },
];

// Written as direct answers so search engines and AI assistants can quote them as-is.
const FAQ = [
  { question: "What does AHOS do?", answer: "AHOS is a digital product studio in Beirut, Lebanon. We design and build websites, online stores, mobile apps, custom software and AI automations for founders and businesses in Lebanon, the Gulf, Europe and the US." },
  { question: "How long does it take to build a website or app?", answer: "A landing page takes about one to two weeks, a full website or online store two to four weeks, and a mobile app or custom platform usually six to twelve weeks. You get a timeline in writing before work starts." },
  { question: "Do I own the code and design?", answer: "Yes. On delivery you own all source code, designs and content. There is no lock-in and no licence you have to keep paying for." },
  { question: "How does pricing work?", answer: "Every project gets a fixed quote in writing after a free 30-minute call, with payments split into milestones. There is no hourly billing." },
  { question: "Can you work with clients outside Lebanon?", answer: "Yes. Most of our work runs remotely, with clients across Lebanon, the Gulf, Europe and the United States. We work in English, Arabic and French." },
  { question: "What happens after launch?", answer: "Every build includes a 30-day warranty. After that, care plans cover hosting, updates, monitoring and a monthly block of improvements." },
];

function useBeirut() {
  const read = () => {
    const d = new Date();
    return {
      time: new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Beirut" }).format(d),
      online: (() => { const h = +new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Beirut" }).format(d); return h >= 9 && h < 21; })(),
    };
  };
  const [s, set] = useState(read);
  useEffect(() => { const id = setInterval(() => set(read()), 20000); return () => clearInterval(id); }, []);
  return s;
}

function Hoarding() {
  return (
    <section className="hd tone-signal" data-tone="signal" aria-labelledby="hd-title">
      <div className="w-wrap hd-grid">
        <h2 id="hd-title" className="hd-say w-display"><span>We draw your product.</span> <span>Then we build it.</span></h2>
        <div className="hd-side">
          <p className="hd-sub">Websites, online stores, apps and custom software for founders. One small team in Beirut does the drawing and the building, on a fixed quote, and every line of code is yours.</p>
          <div className="hd-act">
            <Link href="/contact" className="btn" onClick={() => trackEvent("cta_click", { where: "home_hoarding" })}>Book a 30-minute call <Arrow /></Link>
            <a href="#work" className="lnk">See the drawings</a>
          </div>
        </div>
        <dl className="tb hd-tb">
          <div><dt>Studio</dt><dd>AHOS, Advanced Hybrid Online Systems</dd></div>
          <div><dt>Based in</dt><dd>Beirut, Lebanon</dd></div>
          <div><dt>Building for</dt><dd>Lebanon, the Gulf, Europe and the US</dd></div>
          <div><dt>First reply</dt><dd>Within 24 hours</dd></div>
        </dl>
      </div>
    </section>
  );
}

function Drawings() {
  return (
    <section id="work" className="dw" data-tone="paper" aria-labelledby="dw-title">
      <div className="w-wrap">
        <header className="sec-head">
          <h2 id="dw-title" className="w-display sec-title">Drawn here. Live now.</h2>
          <p className="sec-lead">Four of the products we've shipped, each shown the way it started: as a drawing. Scroll, and each one gets built.</p>
        </header>
        <div className="dw-list">
          {WORK.map((p, i) => <Sheet key={p.id} p={p} index={i} total={WORK.length} />)}
        </div>
        <p className="dw-also">
          Also built by us: <a className="lnk" href="https://www.yourprovider-lb.com" target="_blank" rel="noopener noreferrer">YourProvider</a>, <a className="lnk" href="https://www.aleph.com.lb" target="_blank" rel="noopener noreferrer">Aleph</a> and <Link className="lnk" href="/aria-ai">ARIA</Link>.
        </p>
      </div>
    </section>
  );
}

function Make() {
  return (
    <section className="mk" data-tone="paper" aria-labelledby="mk-title">
      <div className="w-wrap">
        <header className="sec-head">
          <h2 id="mk-title" className="w-display sec-title">What we make.</h2>
          <p className="sec-lead">Three kinds of work, so every project gets the same senior people from the first drawing to launch day.</p>
        </header>
        <table className="mk-table">
          <thead><tr><th scope="col">What</th><th scope="col">For</th><th scope="col">Usually takes</th></tr></thead>
          <tbody>
            {MAKE.map((m) => (
              <tr key={m.what}>
                <th scope="row" className="w-display">{m.what}</th>
                <td>
                  <p>{m.who}</p>
                  <p className="mk-links">{m.links.map(([l, h]) => <Link key={h} className="lnk" href={h}>{l}</Link>)}</p>
                </td>
                <td className="w-measure">{m.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Sequence() {
  return (
    <section className="sq" data-tone="paper" aria-labelledby="sq-title">
      <div className="w-wrap">
        <header className="sec-head">
          <h2 id="sq-title" className="w-display sec-title">How a project goes.</h2>
          <p className="sec-lead">The same five steps every time, so you always know what happens next and when.</p>
        </header>
        <ol className="sq-list">
          {STEPS.map((s, i) => (
            <li key={s.name}>
              <span className="sq-n num">{i + 1}</span>
              <h3 className="w-display">{s.name}</h3>
              <p>{s.body}</p>
              <span className="w-measure sq-t">{s.time}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Word() {
  return (
    <section className="wd tone-signal" data-tone="signal" aria-label="What a client says">
      <figure className="w-wrap wd-fig">
        <blockquote className="w-display wd-q">AHOS took our taxi business from a rough idea to a polished iOS app and website. The app is live, our drivers love it, and our passengers keep growing.</blockquote>
        <figcaption className="wd-by">
          <span><b>Khalil</b>, I Do Taxi, Beirut</span>
          <span className="wd-more">“Highly professional, neat work, and they reply fast.” Yorgo, SpeeAligner, <a className="lnk" href="https://www.trustpilot.com/reviews/69ea9b17ea057c732e8d4c18" target="_blank" rel="noopener noreferrer">on Trustpilot</a></span>
        </figcaption>
      </figure>
    </section>
  );
}

function Questions() {
  return (
    <section className="qs" data-tone="paper" aria-labelledby="qs-title">
      <FAQSchema items={FAQ} />
      <div className="w-wrap qs-grid">
        <header>
          <h2 id="qs-title" className="w-display sec-title">Questions people ask first.</h2>
          <p className="sec-lead"><Link href="/faq" className="lnk">Read every answer</Link></p>
        </header>
        <div className="qs-list">
          {FAQ.map((f, i) => (
            <details key={f.question} open={i === 0}>
              <summary className="w-display">{f.question}<i aria-hidden="true" /></summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Close() {
  const { time, online } = useBeirut();
  return (
    <section className="cs" data-tone="paper" aria-labelledby="cs-title">
      <div className="w-wrap">
        <h2 id="cs-title" className="w-display cs-title">Tell us what you're building.</h2>
        <p className="cs-sub">A real person replies within 24 hours with a plan and a fixed quote. It's <span className="w-measure">{time}</span> in Beirut, {online ? "and we're at our desks." : "so expect us first thing in the morning."}</p>
        <ul className="cs-ways">
          <li><Link href="/contact" onClick={() => trackEvent("cta_click", { where: "home_close_call" })}><span className="w-display">Book a 30-minute call</span><span className="cs-how">Pick a time that suits you</span><Arrow size={22} /></Link></li>
          <li><a href="https://wa.me/96170165601" target="_blank" rel="noopener noreferrer"><span className="w-display">WhatsApp us</span><span className="cs-how w-measure">+961 70 165 601</span><Arrow size={22} /></a></li>
          <li><a href="mailto:info@ahos.xyz"><span className="w-display">Write to us</span><span className="cs-how w-measure">info@ahos.xyz</span><Arrow size={22} /></a></li>
        </ul>
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
      <Hoarding />
      <Drawings />
      <Make />
      <Sequence />
      <Word />
      <Questions />
      <Close />
      <Footer />
    </>
  );
}
