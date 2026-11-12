import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Mark } from "../components/Mark";
import { Close, FaqList, Phone, Quote, Shot, useBeirut } from "../components/ui";
import { alsoBuilt, caseStudies, homeFaq, process, projects, serviceBySlug, serviceGroups, site } from "../site.config";
import { trackEvent } from "../lib/analytics";

export default function Home() {
  const clock = useBeirut();
  const flagships = projects.filter((p) => p.flagship);
  const more = projects.filter((p) => !p.flagship);
  const yorgo = caseStudies.find((c) => c.quote)?.quote;

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="hero" aria-labelledby="hero-title" data-hero>
        <div className="wrap hero-in">
          <h1 id="hero-title" className="hero-h1" data-split>
            <span>Design that sells.</span> <span>Code that holds.</span>
          </h1>
          <div className="hero-copy">
            <p className="lead hero-lead">
              AHOS is a design and engineering studio in Beirut. One team designs and builds websites, online stores, apps and AI for businesses in {site.areasLine}, on a fixed quote, and everything we make is yours.
            </p>
            <div className="acts">
              <Link href="/contact" className="btn" onClick={() => trackEvent("cta_click", { where: "hero" })}>Start a project <Arrow /></Link>
              <a href="#work" className="btn btn-ghost">See the work</a>
            </div>
          </div>
          <div className="hero-mark">
            <Mark tiles />
            <p className="hero-hint" aria-hidden="true">Click anywhere up here. Things fall.</p>
          </div>
        </div>
        <div className="wrap">
          <dl className="hero-meta">
            <div><dt>Studio</dt><dd>Beirut, Lebanon</dd></div>
            <div><dt>Shipped since {site.founded}</dt><dd>50+ products</dd></div>
            <div><dt>First reply</dt><dd>Within {site.contact.replyWithin}</dd></div>
            <div><dt>Beirut time</dt><dd>{clock ? clock.time : " "}</dd></div>
          </dl>
        </div>
      </section>

      {/* ---------- flagship work ---------- */}
      <section id="work" className="sec work-sec" aria-labelledby="work-title">
        <div className="wrap">
          <header className="head head-split">
            <h2 id="work-title" className="d d-5">Work that has to perform.</h2>
            <p className="lead">Everything here is live and doing a job for a real business. Our two favourites from this year first, each with the full story behind it.</p>
          </header>
        </div>

        {flagships.map((p) => (
          <article key={p.id} className="flag" aria-labelledby={`flag-${p.id}`}>
            <div className="wrap">
              <h3 id={`flag-${p.id}`} className="flag-name"><Link href={p.caseStudy}>{p.name}</Link></h3>
              <div className="flag-media">
                <div className="flag-shot" data-reveal-tile><Link href={p.caseStudy} tabIndex={-1} aria-hidden="true"><Shot p={p} sizes="(max-width: 900px) 92vw, 72vw" /></Link></div>
                <div className="flag-phone" data-float><Phone p={p} /></div>
              </div>
              <div className="flag-foot">
                <dl className="flag-facts">
                  <div><dt>What we made</dt><dd>{p.what}</dd></div>
                  <div><dt>Where</dt><dd>{p.where}</dd></div>
                  <div><dt>Year</dt><dd>{p.year}</dd></div>
                </dl>
                <p className="flag-out">{p.outcome}</p>
                <div className="acts">
                  <Link href={p.caseStudy} className="btn">Read the case study <Arrow /></Link>
                  <a href={p.live} className="lnk" target="_blank" rel="noopener noreferrer">Visit {p.liveLabel}</a>
                </div>
              </div>
            </div>
          </article>
        ))}

        <div className="wrap">
          <h3 className="more-title">More case studies</h3>
          <ul className="more" data-more>
            {more.map((p) => (
              <li key={p.id} className="more-row" data-shot={p.shot ? `/work/d-${p.shot}-880.webp` : ""}>
                <Link href={p.caseStudy} className="more-link">
                  <span className="more-name">{p.name}</span>
                  <span className="more-what">{p.what}</span>
                  <span className="more-where">{p.where}</span>
                  <Arrow size={20} />
                </Link>
                <p className="more-out">{p.outcome}</p>
              </li>
            ))}
          </ul>
          <p className="more-note">
            Also built by us: {alsoBuilt.map((a, i) => <span key={a.name}>{i > 0 && ", "}<a className="lnk" href={a.href} target="_blank" rel="noopener noreferrer">{a.name}</a></span>)}. And plenty more since {site.founded} that our clients keep to themselves.
          </p>
        </div>
      </section>

      {/* ---------- services ---------- */}
      <section className="sec svc-sec" aria-labelledby="svc-title">
        <div className="wrap">
          <header className="head head-split">
            <h2 id="svc-title" className="d d-5">What we make.</h2>
            <p className="lead">Four kinds of work, one senior team from the first sketch to launch day.</p>
          </header>
          <ul className="svc">
            {serviceGroups.map((g) => (
              <li key={g.name} className="svc-row">
                <h3 className="svc-name">{g.name}</h3>
                <p className="svc-body">{g.body}</p>
                <div className="svc-links">
                  {g.links.map((slug) => { const s = serviceBySlug(slug)!; return <Link key={slug} href={s.href} className="chip">{s.label}</Link>; })}
                </div>
                <span className="svc-time">{g.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- process ---------- */}
      <section className="sec proc-sec" aria-labelledby="proc-title">
        <div className="wrap">
          <header className="head head-split">
            <h2 id="proc-title" className="d d-5">How a project goes.</h2>
            <p className="lead">The same five steps every time, so you always know what happens next and when.</p>
          </header>
          <div className="proc">
            <svg className="proc-line" viewBox="0 0 1000 10" preserveAspectRatio="none" aria-hidden="true"><path d="M0 5H1000" data-draw /></svg>
            <ol>
              {process.map((s, i) => (
                <li key={s.name}>
                  <span className="proc-n" aria-hidden="true">{i + 1}</span>
                  <h3>{s.name}</h3>
                  <p>{s.body}</p>
                  <span className="proc-t">{s.time}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {yorgo && <Quote {...yorgo} />}

      {/* ---------- FAQ ---------- */}
      <section className="sec" aria-labelledby="faq-title">
        <div className="wrap qa-grid">
          <header>
            <h2 id="faq-title" className="d d-5">Questions people ask first.</h2>
            <Link href="/faq" className="lnk" style={{ marginTop: 20, display: "inline-block" }}>Read every answer</Link>
          </header>
          <FaqList items={homeFaq} openFirst />
        </div>
      </section>

      <Close where="home" />
    </>
  );
}
