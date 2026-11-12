import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Mark } from "../components/Mark";
import { Close, FaqList, Shot, Head, PageHeader, Quote, fromPrice } from "../components/ui";
import { caseStudies, process, projectById, services, type Service } from "../site.config";

export default function ServicePage({ s }: { s: Service }) {
  const proof = s.proofProject ? projectById(s.proofProject) : undefined;
  const cs = proof ? caseStudies.find((c) => c.project === proof.id) : undefined;
  const related = services.filter((x) => x.href !== s.href).slice(0, 3);

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: s.label }]}
        title={s.h1}
        lead={s.lead}
        aside={proof ? <Shot p={proof} eager sizes="(max-width: 900px) 92vw, 44vw" /> : <div className="ph-mark"><Mark /></div>}
      >
        <Link href="/contact" className="btn" data-magnetic>Book a 30-minute call <Arrow /></Link>
        <span className="small"><b style={{ color: "var(--ink)" }}>{fromPrice(s.from)}</b>, {s.timeline.toLowerCase()}</span>
      </PageHeader>

      <section className="sec statement signal" aria-label="Why it matters">
        <div className="wrap">
          <p className="d d-6">{s.problem}</p>
        </div>
      </section>

      <section className="sec" aria-labelledby="offers-title">
        <div className="wrap">
          <Head id="offers-title" title="What we build." lead="Each one designed screen by screen, signed off by you, then built by the people who designed it." />
          <ul className="index">
            {s.offers.map((o, i) => (
              <li key={o.name} className="index-row">
                <h3 className="d"><span className="dim" style={{ marginRight: 14 }}>{String(i + 1).padStart(2, "0")}</span>{o.name}</h3>
                <p className="body">{o.body}</p>
                <p className="tags meta" style={{ marginTop: 0 }}>{o.tags.map((t) => <span key={t}>{t}</span>)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {proof && (
        <section className="sec alt" aria-labelledby="proof-title">
          <div className="wrap">
            <div className="work">
              <div className="work-media"><Link href={proof.caseStudy} tabIndex={-1} aria-hidden="true"><Shot p={proof} sizes="(max-width: 900px) 92vw, 62vw" /></Link></div>
              <div className="work-text">
                <p className="small" style={{ marginBottom: 12 }}>Case study</p>
                <h2 id="proof-title" className="d d-5" style={{ marginBottom: 16 }}>{proof.name}</h2>
                <p className="body" style={{ marginBottom: 28 }}>{proof.outcome}</p>
                <Link href={proof.caseStudy} className="btn">Read the case study <Arrow /></Link>
              </div>
            </div>
          </div>
        </section>
      )}
      {cs?.quote && <Quote {...cs.quote} />}

      <section className="sec" aria-labelledby="proc-title">
        <div className="wrap">
          <Head id="proc-title" title="How it goes." lead="A free call, a fixed quote within 24 hours, designs you sign off, then the build." />
          <ol className="index">
            {process.map((p, i) => (
              <li key={p.name} className="index-row">
                <h3 className="d"><span className="dim" style={{ marginRight: 14 }}>{i + 1}</span>{p.name}</h3>
                <p className="body">{p.body}</p>
                <div className="meta"><span className="dim">{p.time}</span></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sec alt" aria-labelledby="faq-title">
        <div className="wrap qa-grid">
          <header className="sticky"><h2 id="faq-title" className="d d-6">Straight answers.</h2></header>
          <FaqList items={s.faqs} openFirst />
        </div>
      </section>

      <section className="sec" aria-labelledby="rel-title">
        <div className="wrap">
          <h2 id="rel-title" className="d d-5" style={{ marginBottom: 32 }}>Often paired with</h2>
          <ul className="index">
            {related.map((r) => (
              <li key={r.href} className="index-row has-link">
                <h3 className="d">{r.label}</h3>
                <p className="body">{r.blurb}</p>
                <div className="meta"><b>{fromPrice(r.from)}</b></div>
                <Link href={r.href} className="row-link" aria-label={r.label} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Close where={s.slug} />
    </>
  );
}
