import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Close, Frame, PageHeader, Quote, TitleBlock } from "../components/ui";
import { caseStudies, projectById, type CaseStudy as CS } from "../site.config";

export default function CaseStudy({ c }: { c: CS }) {
  const p = projectById(c.project);
  const next = caseStudies[(caseStudies.indexOf(c) + 1) % caseStudies.length];
  const np = projectById(next.project);

  return (
    <>
      <PageHeader crumbs={[{ name: "Home", href: "/" }, { name: "Work", href: "/#work" }, { name: p.name }]} title={c.title} lead={c.lead}
        aside={<TitleBlock rows={[["Client", p.name], ["What we made", p.what], ["Where", p.where], ["Year", p.year], ["Services", c.services.join(", ")]]} />}>
        <a href={p.live} className="btn" target="_blank" rel="noopener noreferrer" data-magnetic>Visit {p.liveLabel} <Arrow /></a>
        <Link href="/contact" className="btn btn-ghost">Start a project like this</Link>
      </PageHeader>

      <section className="sec" aria-label="The project">
        <div className="wrap">
          <div className="cs-shot" style={{ marginTop: 0 }}><Frame p={p} eager draw sizes="(max-width: 1440px) 92vw, 1320px" /></div>
        </div>
      </section>

      <section className="sec tone-paper2" aria-labelledby="brief-title">
        <div className="wrap">
          <div className="cs-grid">
            <h2 id="brief-title" className="d d-5">The brief</h2>
            <p className="lead" style={{ color: "var(--ink)" }}>{c.brief}</p>
          </div>
          <div className="cs-grid">
            <h2 className="d d-5">What we built</h2>
            <ul className="cs-list">
              {c.built.map((b) => (
                <li key={b.name} data-reveal><h3 className="d">{b.name}</h3><p>{b.body}</p></li>
              ))}
            </ul>
          </div>
          <div className="cs-grid">
            <h2 className="d d-5">Where it is now</h2>
            <p className="lead" style={{ color: "var(--ink)" }}>{c.now}</p>
          </div>
        </div>
      </section>

      <Quote text={c.quote.text} name={c.quote.name} role={c.quote.role} link={c.quote.link} />

      <section className="sec" aria-labelledby="next-title">
        <div className="wrap">
          <div className="work">
            <div className="work-media"><Link href={`/work/${next.slug}`}><Frame p={np} sizes="(max-width: 900px) 92vw, 62vw" /></Link></div>
            <div className="work-text">
              <span className="dim work-n">Next case study</span>
              <h2 id="next-title" className="d d-5" style={{ marginBottom: 20 }}>{np.name}</h2>
              <Link href={`/work/${next.slug}`} className="btn">Read it <Arrow /></Link>
            </div>
          </div>
        </div>
      </section>

      <Close where={`case_${c.slug}`} />
    </>
  );
}
