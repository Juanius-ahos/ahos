import { Defer } from "../components/Defer";
import { RevealGroup } from "@/components/corsair/reveal";
import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { ServiceCard } from "../components/cards";
import { ProcessLine } from "../components/sections";
import { Marquee } from "../components/Marquee";
import { Close, Head, PageHeader, Hl } from "../components/ui";
import { pricing, services } from "../site.config";

export default function Services() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
        title={<>Everything we design and <Hl>build</Hl>.</>}
        lead="Seven kinds of work, one team. Pick the closest match; the 30-minute call sorts out the rest."
        proof
        bg="ascii" shape="eclipse"
      >
        <Link href="/contact" className="btn" data-magnetic>Book a 30-minute call <Arrow /></Link>
        <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
      </PageHeader>

      <Defer>
        <section className="sec" aria-labelledby="svc-title">
          <div className="wrap">
            <h2 id="svc-title" className="sr">Services</h2>
            <RevealGroup className="sv-grid" stagger={70}>
              {services.map((s, i) => <ServiceCard key={s.href} s={s} no={i + 1} wide={i === 0 || i === services.length - 1} />)}
            </RevealGroup>
          </div>
        </section>
      </Defer>

      <Defer>
        <Marquee items={services.map((s) => s.label)} seconds={52} />
      </Defer>

      <Defer>
        <section className="sec alt" aria-labelledby="how-title">
          <div className="wrap">
            <Head id="how-title" title="Same process, every service." lead={pricing.promise} />
            <ProcessLine />
          </div>
        </section>
      </Defer>

      <Defer>
        <Close where="services" />
      </Defer>
    </>
  );
}
