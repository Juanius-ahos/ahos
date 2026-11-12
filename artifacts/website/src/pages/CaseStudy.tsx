import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Close, Crumbs, Phone, Quote, Shot, Specs } from "../components/ui";
import { caseStudies, projectById, type CaseStudy as CS } from "../site.config";

export default function CaseStudy({ c }: { c: CS }) {
  const p = projectById(c.project);
  const next = caseStudies[(caseStudies.indexOf(c) + 1) % caseStudies.length];
  const np = projectById(next.project);
  const external = p.live.startsWith("http");

  return (
    <>
      <header className="cs-hero">
        <div className="wrap">
          <Crumbs items={[{ name: "Home", href: "/" }, { name: "Work", href: "/work" }, { name: p.name }]} />
          <p className="cs-name">{p.name}</p>
          <div className="cs-head">
            <h1 className="d d-5" data-split>{c.title}</h1>
            <div>
              <p className="lead">{c.lead}</p>
              <div className="acts">
                {external
                  ? <a href={p.live} className="btn" target="_blank" rel="noopener noreferrer">Visit {p.liveLabel} <Arrow /></a>
                  : <Link href={p.live} className="btn">{p.liveLabel} <Arrow /></Link>}
                <Link href="/contact" className="lnk">Start a project like this</Link>
              </div>
            </div>
          </div>
          <Specs rows={[["Client", p.name], ["What we made", p.what], ["Where", p.where], ["Year", p.year], ["Services", c.services.join(", ")]]} />
        </div>
      </header>

      <section className="sec cs-media-sec" aria-label="The live product">
        <div className="wrap">
          <div className="flag-media">
            <div className="flag-shot" data-reveal-tile><Shot p={p} eager sizes="(max-width: 1440px) 92vw, 1320px" /></div>
            <div className="flag-phone" data-float><Phone p={p} /></div>
          </div>
        </div>
      </section>

      <section className="sec cs-facts-sec" aria-label="In short">
        <div className="wrap">
          <ul className="cs-facts">
            {c.facts.map(([v, l]) => <li key={l}><b>{v}</b><span>{l}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="sec" aria-labelledby="brief-title">
        <div className="wrap">
          <div className="cs-grid">
            <h2 id="brief-title" className="d d-4">The brief</h2>
            <p className="cs-p">{c.brief}</p>
          </div>
          <div className="cs-grid">
            <h2 className="d d-4">What we built</h2>
            <ul className="cs-list">
              {c.built.map((b) => (
                <li key={b.name}><h3>{b.name}</h3><p>{b.body}</p></li>
              ))}
            </ul>
          </div>
          <div className="cs-grid">
            <h2 className="d d-4">Where it is now</h2>
            <p className="cs-p">{c.now}</p>
          </div>
        </div>
      </section>

      {c.quote && <Quote {...c.quote} />}

      <section className="sec cs-next" aria-labelledby="next-title">
        <div className="wrap">
          <Link href={`/work/${next.slug}`} className="cs-next-link">
            <span className="cs-next-k">Next case study</span>
            <span id="next-title" className="cs-next-name">{np.name}</span>
            <span className="cs-next-what">{np.what}, {np.where}</span>
            <Arrow size={36} />
          </Link>
        </div>
      </section>

      <Close where={`case_${c.slug}`} />
    </>
  );
}
