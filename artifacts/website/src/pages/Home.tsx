import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Close, FaqList, Frame, Proof, Quote, fromPrice } from "../components/ui";
import { alsoBuilt, caseStudies, homeFaq, process, projects, serviceBySlug, serviceGroups, site } from "../site.config";
import { trackEvent } from "../lib/analytics";

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero-in">
        <p className="hero-meta">
          <span className="dim">Digital product studio</span>
          <span className="dim">Beirut, Lebanon</span>
          <span className="dim">Since {site.founded}</span>
        </p>
        <h1 id="hero-title" className="d d-8 hero-h1">
          <span className="ln">We draw your product.</span> <span className="ln">Then we build it.</span>
        </h1>
        <div className="hero-dimline" aria-hidden="true">
          <i data-grow />
          <span className="dim">one team, drawing to launch</span>
        </div>
        <div className="hero-foot">
          <div>
            <p className="lead">Websites, online stores, apps and custom software for founders in {site.areasLine}. Every screen is drawn before a line of code, then built by the same people, on a fixed quote.</p>
            <div className="acts">
              <Link href="/contact" className="btn" data-magnetic onClick={() => trackEvent("cta_click", { where: "home_hero" })}>Book a 30-minute call <Arrow /></Link>
              <a href={site.contact.whatsapp} className="btn btn-ghost" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { where: "home_hero" })}>WhatsApp us</a>
            </div>
          </div>
          <Proof />
        </div>
      </div>
    </section>
  );
}

function Rail() {
  return (
    <section className="rail" aria-label="Recent work">
      <div className="wrap">
        <div className="rail-track">
          {projects.map((p, i) => (
            <a key={p.id} href={`#work-${p.id}`} className="rail-item">
              <figure>
                <Frame p={p} eager={i < 2} sizes="(max-width: 900px) 78vw, 24vw" />
                <figcaption><b>{p.name}</b><span className="small">{p.what}</span></figcaption>
              </figure>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" className="sec" aria-labelledby="work-title">
      <div className="wrap">
        <header className="head">
          <h2 id="work-title" className="d d-6">Drawn here. Live now.</h2>
          <p className="lead">Four products we designed and built. Each one started as a drawing like the one that sketches itself over it as you scroll.</p>
        </header>
        <div className="works">
          {projects.map((p, i) => {
            const cs = caseStudies.find((c) => c.project === p.id);
            return (
              <article key={p.id} id={`work-${p.id}`} className="work">
                <div className="work-media"><Frame p={p} draw sizes="(max-width: 900px) 92vw, 62vw" /></div>
                <div className="work-text" data-reveal>
                  <span className="dim work-n">{String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
                  <h3 className="d d-5">{p.name}</h3>
                  <p className="body">{p.outcome}</p>
                  <dl className="facts">
                    <dt>What we made</dt><dd>{p.what}</dd>
                    <dt>Where</dt><dd>{p.where}</dd>
                    <dt>Year</dt><dd>{p.year}</dd>
                  </dl>
                  <div className="acts">
                    {cs && <Link href={`/work/${cs.slug}`} className="btn">Read the case study <Arrow /></Link>}
                    <a href={p.live} className={cs ? "lnk" : "btn btn-ghost"} target="_blank" rel="noopener noreferrer">Visit {p.liveLabel}{!cs && <Arrow />}</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <p className="also">
          Also built by us:{" "}
          {alsoBuilt.map((a, i) => (
            <span key={a.name}>
              {a.href.startsWith("/") ? <Link className="lnk" href={a.href}>{a.name}</Link> : <a className="lnk" href={a.href} target="_blank" rel="noopener noreferrer">{a.name}</a>}
              {i < alsoBuilt.length - 2 ? ", " : i === alsoBuilt.length - 2 ? " and " : "."}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function Make() {
  return (
    <section className="sec tone-signal" aria-labelledby="make-title">
      <div className="wrap">
        <header className="head">
          <h2 id="make-title" className="d d-6">What we make.</h2>
          <p className="lead">Three kinds of work, each with the same senior people from the first drawing to launch day.</p>
        </header>
        <div className="index-head" aria-hidden="true"><span>What</span><span>For</span><span>Usually takes</span></div>
        <ul className="index">
          {serviceGroups.map((g) => {
            const linked = g.links.map((s) => serviceBySlug(s)!);
            const from = Math.min(...linked.map((s) => s.from));
            return (
              <li key={g.name} className="index-row" data-reveal>
                <h3 className="d">{g.name}</h3>
                <div>
                  <p className="body">{g.body}</p>
                  <p className="tags">{linked.map((s) => <Link key={s.href} className="lnk" href={s.href}>{s.label}</Link>)}</p>
                </div>
                <div className="meta"><b>{g.time}</b><span className="small">{fromPrice(from)}</span></div>
              </li>
            );
          })}
        </ul>
        <div className="acts" style={{ marginTop: 40 }}>
          <Link href="/services" className="btn">All services <Arrow /></Link>
          <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="sec" aria-labelledby="steps-title">
      <div className="wrap">
        <header className="head">
          <h2 id="steps-title" className="d d-6">How a project goes.</h2>
          <p className="lead">The same five steps every time, so you always know what happens next and when.</p>
        </header>
        <div className="steps-box">
        <div className="steps-line" data-grow-scrub aria-hidden="true" />
        <ol className="steps">
          {process.map((s, i) => (
            <li key={s.name} className="step">
              <span className="step-n">{i + 1}</span>
              <h3 className="d">{s.name}</h3>
              <p>{s.body}</p>
              <span className="dim">{s.time}</span>
            </li>
          ))}
        </ol>
        </div>
      </div>
    </section>
  );
}

function Questions() {
  return (
    <section className="sec tone-paper2" aria-labelledby="qa-title">
      <div className="wrap qa-grid">
        <header className="sticky">
          <h2 id="qa-title" className="d d-6">Questions people ask first.</h2>
          <p className="lead" style={{ marginTop: 20 }}><Link href="/faq" className="lnk">Read every answer</Link></p>
        </header>
        <FaqList items={homeFaq} openFirst />
      </div>
    </section>
  );
}

export default function Home() {
  const q = caseStudies.find((c) => c.slug === "ido-taxi")!.quote;
  return (
    <>
      <Hero />
      <Rail />
      <Work />
      <Make />
      <Steps />
      <Quote text="AHOS took our taxi business from a rough idea to a polished iOS app and website. The app is live, our drivers love it, and our passengers keep growing." name={q.name} role={q.role} />
      <Questions />
      <Close where="home" />
    </>
  );
}
