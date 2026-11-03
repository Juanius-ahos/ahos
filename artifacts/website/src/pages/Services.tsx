import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Close, Head, PageHeader, fromPrice } from "../components/ui";
import { pricing, process, services } from "../site.config";

export default function Services() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        title="Everything we draw and build."
        lead="Seven kinds of work, one team. Pick the closest match; the 30-minute call sorts out the rest."
        proof
      >
        <Link href="/contact" className="btn" data-magnetic>Book a 30-minute call <Arrow /></Link>
        <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
      </PageHeader>

      <section className="sec" aria-labelledby="svc-title">
        <div className="wrap">
          <h2 id="svc-title" className="sr">Services</h2>
          <div className="index-head" aria-hidden="true"><span>Service</span><span>What it is</span><span>Starts at</span></div>
          <ul className="index">
            {services.map((s) => (
              <li key={s.href} className="index-row has-link" data-reveal>
                <h3 className="d">{s.label}</h3>
                <div>
                  <p className="body">{s.blurb}</p>
                  <p className="tags">{s.offers.map((o) => <span key={o.name}>{o.name}</span>)}</p>
                </div>
                <div className="meta"><b>{fromPrice(s.from)}</b><span className="small">{s.timeline}</span></div>
                <Link href={s.href} className="row-link" aria-label={`${s.label}: read more`} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sec tone-paper2" aria-labelledby="how-title">
        <div className="wrap">
          <Head id="how-title" title="Same process, every service." lead={pricing.promise} />
          <ol className="index">
            {process.map((s, i) => (
              <li key={s.name} className="index-row" data-reveal>
                <h3 className="d"><span className="dim" style={{ marginRight: 14 }}>{i + 1}</span>{s.name}</h3>
                <p className="body">{s.body}</p>
                <div className="meta"><span className="dim">{s.time}</span></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Close where="services" />
    </>
  );
}
