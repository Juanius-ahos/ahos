import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { PriceCard } from "../components/cards";
import { Close, FaqList, Head, PageHeader, Specs } from "../components/ui";
import { money, pricing, services, site } from "../site.config";

export default function Pricing() {
  const sorted = [...services].sort((a, b) => a.from - b.from);
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Pricing" }]}
        title={<>Start-from prices. <span className="hl">Fixed</span> quotes.</>}
        lead={pricing.promise}
        aside={<Specs rows={[["Lowest start", money(Math.min(...services.map((s) => s.from)))], ["Quote", "Fixed, in writing"], ["Payments", "Milestones"], ["First reply", `Within ${site.contact.replyWithin}`], ["After launch", site.warranty]]} />}
        word="Price"
      >
        <Link href="/contact" className="btn" data-magnetic>Get your fixed quote <Arrow /></Link>
        <a href="#included" className="lnk">What every project includes</a>
      </PageHeader>

      <section className="sec" aria-labelledby="price-title">
        <div className="wrap">
          <h2 id="price-title" className="sr">Prices by service</h2>
          <div className="px-grid">
            {sorted.map((s) => <PriceCard key={s.href} s={s} />)}
          </div>
          <p className="small" style={{ marginTop: 28 }}>Prices in US dollars. Your quote is fixed in writing after the call and does not move unless the scope does.</p>
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
