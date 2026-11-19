import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { ServiceCard } from "../components/cards";
import { ProcessLine } from "../components/sections";
import { Close, Head, PageHeader } from "../components/ui";
import { pricing, services } from "../site.config";

export default function Services() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        title={<>Everything we design and <span className="hl">build</span>.</>}
        lead="Seven kinds of work, one team. Pick the closest match; the 30-minute call sorts out the rest."
        proof
        word="Services"
      >
        <Link href="/contact" className="btn" data-magnetic>Book a 30-minute call <Arrow /></Link>
        <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
      </PageHeader>

      <section className="sec" aria-labelledby="svc-title">
        <div className="wrap">
          <h2 id="svc-title" className="sr">Services</h2>
          <div className="sv-grid">
            {services.map((s, i) => <ServiceCard key={s.href} s={s} no={i + 1} wide={i === 0 || i === services.length - 1} />)}
          </div>
        </div>
      </section>

      <section className="sec alt" aria-labelledby="how-title">
        <div className="wrap">
          <Head id="how-title" title="Same process, every service." lead={pricing.promise} />
          <ProcessLine />
        </div>
      </section>

      <Close where="services" />
    </>
  );
}
