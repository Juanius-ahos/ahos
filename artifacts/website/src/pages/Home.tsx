import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Mark } from "../components/Mark";
import { FaqList, Quote, Shot, WhatsAppIcon, useBeirut } from "../components/ui";
import { alsoBuilt, caseStudies, homeFaq, money, process, projects, serviceBySlug, serviceGroups, site } from "../site.config";
import { trackEvent } from "../lib/analytics";

/**
 * Homepage. One job: get the right people to message us on WhatsApp.
 * Short on purpose: hero with proof, services with prices, the work, how it goes, one quote, a few answers, contact.
 */
export default function Home() {
  const clock = useBeirut();
  const yorgo = caseStudies.find((c) => c.quote)?.quote;
  const wa = (where: string) => () => trackEvent("whatsapp_click", { where });
  const trustpilot = site.proof.find((p) => "href" in p && p.href);

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="hero" aria-labelledby="hero-title" data-hero>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title" className="hero-h1" data-split>Websites, apps and AI that make your business look as good as it is.</h1>
            <p className="lead hero-lead">
              AHOS is a design and engineering studio in Beirut. One senior team designs and builds it, the price is fixed before we start, and everything we make is yours.
            </p>
            <div className="acts">
              <a href={site.contact.whatsappHello} className="btn btn-wa" target="_blank" rel="noopener noreferrer" onClick={wa("hero")}>
                <WhatsAppIcon /> Message us on WhatsApp
              </a>
              <a href="#work" className="btn btn-ghost">See our work</a>
            </div>
            <p className="hero-reply">
              <span className={`dot${clock?.atDesk ? " on" : ""}`} aria-hidden="true" />
              {clock ? (clock.atDesk ? `We're at our desks in Beirut (${clock.time}). Expect a reply today.` : `It's ${clock.time} in Beirut. We reply first thing in the morning.`) : `A real person replies within ${site.contact.replyWithin}.`}
            </p>
          </div>
          <div className="hero-mark" aria-hidden="true"><Mark tiles /></div>
        </div>
        <div className="wrap">
          <ul className="trust">
            <li><b>50+</b><span>products shipped since {site.founded}</span></li>
            <li>{trustpilot && "href" in trustpilot ? <a href={trustpilot.href} target="_blank" rel="noopener noreferrer"><b>5.0</b><span>on Trustpilot</span></a> : <><b>5.0</b><span>on Trustpilot</span></>}</li>
            <li><b>Fixed</b><span>price, in writing, before we start</span></li>
            <li><b>100%</b><span>yours: code, design and content</span></li>
          </ul>
        </div>
      </section>

      {/* ---------- services with prices ---------- */}
      <section id="services" className="sec svc-sec" aria-labelledby="svc-title">
        <div className="wrap">
          <header className="head head-split">
            <h2 id="svc-title" className="d d-5">What we build, and what it costs.</h2>
            <p className="lead">Every project gets a fixed quote after a free call. These are the starting points.</p>
          </header>
          <ul className="cards">
            {serviceGroups.map((g) => {
              const items = g.links.map((slug) => serviceBySlug(slug)!);
              const from = Math.min(...items.map((s) => s.from));
              return (
                <li key={g.name} className="card">
                  <h3 className="card-name">{g.name}</h3>
                  <p className="card-body">{g.body}</p>
                  <dl className="card-facts">
                    <div><dt>From</dt><dd>{money(from)}</dd></div>
                    <div><dt>Timeline</dt><dd>{g.time}</dd></div>
                  </dl>
                  <div className="card-links">
                    {items.map((s) => <Link key={s.slug} href={s.href} className="lnk">{s.label}</Link>)}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="more-note">Not sure which one you need? <a className="lnk" href={site.contact.whatsappHello} target="_blank" rel="noopener noreferrer" onClick={wa("services")}>Ask us on WhatsApp</a> or see the full <Link href="/pricing" className="lnk">pricing</Link>.</p>
        </div>
      </section>

      {/* ---------- work ---------- */}
      <section id="work" className="sec" aria-labelledby="work-title">
        <div className="wrap">
          <header className="head head-split">
            <h2 id="work-title" className="d d-5">Work that's live and earning.</h2>
            <p className="lead">Real businesses, real sites. Each one has a short case study: what they needed, what we built, where it is now.</p>
          </header>
          <ul className="wgrid">
            {projects.map((p) => (
              <li key={p.id} className={p.flagship ? "wcard is-big" : "wcard"}>
                <Link href={p.caseStudy} className="wcard-link">
                  <div className="wcard-media"><Shot p={p} sizes={p.flagship ? "(max-width: 900px) 92vw, 46vw" : "(max-width: 900px) 92vw, 30vw"} /></div>
                  <div className="wcard-text">
                    <h3 className="wcard-name">{p.name}</h3>
                    <p className="wcard-what">{p.what}, {p.where}</p>
                    <p className="wcard-out">{p.outcome}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="more-note">Also built by us: {alsoBuilt.map((a, i) => <span key={a.name}>{i > 0 && ", "}<a className="lnk" href={a.href} target="_blank" rel="noopener noreferrer">{a.name}</a></span>)}, and many more our clients keep private.</p>
        </div>
      </section>

      {/* ---------- process ---------- */}
      <section className="sec alt" aria-labelledby="proc-title">
        <div className="wrap">
          <header className="head head-split">
            <h2 id="proc-title" className="d d-5">How it works.</h2>
            <p className="lead">Five steps, the same every time, so you always know what happens next.</p>
          </header>
          <ol className="steps5">
            {process.map((s, i) => (
              <li key={s.name}>
                <span className="steps5-n" aria-hidden="true">{i + 1}</span>
                <h3>{s.name}</h3>
                <p>{s.body}</p>
                <span className="steps5-t">{s.time}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {yorgo && <Quote {...yorgo} />}

      {/* ---------- FAQ ---------- */}
      <section className="sec" aria-labelledby="faq-title">
        <div className="wrap qa-grid">
          <header>
            <h2 id="faq-title" className="d d-5">Quick answers.</h2>
            <Link href="/faq" className="lnk" style={{ marginTop: 20, display: "inline-block" }}>All questions</Link>
          </header>
          <FaqList items={homeFaq.slice(1, 5)} openFirst />
        </div>
      </section>

      {/* ---------- contact ---------- */}
      <section className="sec wa-close" aria-labelledby="close-title">
        <div className="wrap wa-close-in">
          <div>
            <h2 id="close-title" className="d d-6">Tell us what you're building.</h2>
            <p className="lead">Send a WhatsApp message. A real person on the team replies within {site.contact.replyWithin}, usually much sooner, with next steps and a fixed quote.</p>
          </div>
          <div className="wa-close-acts">
            <a href={site.contact.whatsappHello} className="btn btn-wa btn-lg" target="_blank" rel="noopener noreferrer" onClick={wa("close")}>
              <WhatsAppIcon /> Message us on WhatsApp
            </a>
            <p className="wa-alt">
              <span>{site.contact.phone}</span>
              <a className="lnk" href={`mailto:${site.contact.email}`} onClick={() => trackEvent("email_click", { where: "home_close" })}>{site.contact.email}</a>
              <Link href="/contact" className="lnk">Book a call <Arrow /></Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
