import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Close, FaqList, Head, PageHeader, Specs, fromPrice } from "../components/ui";
import { money, pricing, services, site } from "../site.config";

export default function Pricing() {
  const sorted = [...services].sort((a, b) => a.from - b.from);
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Pricing" }]}
        title="Start-from prices. Fixed quotes."
        lead={pricing.promise}
        aside={<Specs rows={[["Lowest start", money(Math.min(...services.map((s) => s.from)))], ["Quote", "Fixed, in writing"], ["Payments", "Milestones"], ["First reply", `Within ${site.contact.replyWithin}`], ["After launch", site.warranty]]} />}
      >
        <Link href="/contact" className="btn" data-magnetic>Get your fixed quote <Arrow /></Link>
        <a href="#included" className="lnk">What every project includes</a>
      </PageHeader>

      <section className="sec" aria-labelledby="price-title">
        <div className="wrap">
          <h2 id="price-title" className="sr">Prices by service</h2>
          <div className="index-head" aria-hidden="true"><span>Service</span><span>What you get</span><span>Starts at</span></div>
          <ul className="index">
            {sorted.map((s) => (
              <li key={s.href} className="index-row price-row has-link">
                <h3 className="d">{s.label}</h3>
                <div>
                  <p className="body">{s.blurb}</p>
                  <p className="tags">{s.offers.map((o) => <span key={o.name}>{o.name}</span>)}</p>
                </div>
                <div className="meta"><b>{fromPrice(s.from)}</b><span className="small">{s.timeline}</span></div>
                <Link href={s.href} className="row-link" aria-label={`${s.label}, ${fromPrice(s.from)}`} />
              </li>
            ))}
          </ul>
          <p className="small" style={{ marginTop: 24 }}>Prices in US dollars. Your quote is fixed in writing after the call and does not move unless the scope does.</p>
        </div>
      </section>

      <section id="included" className="sec alt" aria-labelledby="incl-title">
        <div className="wrap">
          <Head id="incl-title" title="In every project." />
          <div className="incl">
            {pricing.included.map((i) => (
              <div key={i.name}><h3 className="d">{i.name}</h3><p>{i.body}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" aria-labelledby="pfaq-title">
        <div className="wrap qa-grid">
          <header className="sticky"><h2 id="pfaq-title" className="d d-6">Pricing questions.</h2></header>
          <FaqList items={pricing.faqs} openFirst />
        </div>
      </section>

      <Close where="pricing" title="Get your fixed quote." />
    </>
  );
}
