import { Defer } from "../components/Defer";
import { TextReveal } from "@/components/corsair/text-reveal";
import { TiltScroll } from "@/components/corsair/tilt-scroll";
import { Spotlight } from "@/components/corsair/spotlight";
import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Icon } from "../components/Icons";
import { Mark } from "../components/Mark";
import type { BackdropKind, GradientASCIIShape } from "../components/backdrop/Backdrop";
import { ServiceCard } from "../components/cards";
import { ProcessLine } from "../components/sections";
import { Close, FaqList, Shot, Head, PageHeader, Quote, fromPrice } from "../components/ui";
import { caseStudies, projectById, services, type Service } from "../site.config";

/** Each service has its own face in the one ASCII family: a shape of the gradient, or the glitching letters for the technical ones. */
const BG: Record<string, { bg: BackdropKind; shape?: GradientASCIIShape }> = {
  "web-development": { bg: "ascii", shape: "eclipse" },
  "ecommerce-development": { bg: "ascii", shape: "eclipse" },
  "mobile-app-development": { bg: "ascii", shape: "eclipse" },
  "custom-software": { bg: "letters" },
  "ai-development": { bg: "letters" },
  "ui-ux-design": { bg: "ascii", shape: "eclipse" },
  web3: { bg: "letters" },
};

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
        aside={proof ? <TiltScroll timeline="root" flatBelow="md"><Shot p={proof} eager sizes="(max-width: 900px) 92vw, 44vw" /></TiltScroll> : <div className="ph-mark"><Mark /></div>}
        bg={BG[s.slug]?.bg}
        shape={BG[s.slug]?.shape}
      >
        <Link href="/contact" className="btn" data-magnetic>Book a 30-minute call <Arrow /></Link>
        <span className="small"><b style={{ color: "var(--fg)" }}>{fromPrice(s.from)}</b>, {s.timeline.toLowerCase()}</span>
      </PageHeader>

      <Defer>
        <section className="sec statement signal" aria-label="Why it matters">
          <div className="wrap">
            <TextReveal as="p" trigger="scroll" dim={0.6} className="d d-6">{s.problem}</TextReveal>
          </div>
        </section>
      </Defer>

      <Defer>
        <section className="sec" aria-labelledby="offers-title">
          <div className="wrap">
            <Head id="offers-title" title="What we build." lead="Each one designed screen by screen, signed off by you, then built by the people who designed it." />
            <div className="of-grid">
              {s.offers.map((o, i) => (
                <Spotlight key={o.name} asChild color="var(--primary)" size={340}><article className="cx">
                  <div className="cx-top">
                    <span className="cx-ico"><Icon name={s.slug} /></span>
                    <span className="cx-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3>{o.name}</h3>
                  <p className="cx-body">{o.body}</p>
                  <p className="tags">{o.tags.map((t) => <span key={t}>{t}</span>)}</p>
                </article></Spotlight>
              ))}
            </div>
          </div>
        </section>
      </Defer>

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

      <Defer>
        <section className="sec" aria-labelledby="proc-title">
          <div className="wrap">
            <Head id="proc-title" title="How it goes." lead="A free call, a fixed quote within 24 hours, designs you sign off, then the build." />
            <ProcessLine />
          </div>
        </section>
      </Defer>

      <Defer>
        <section className="sec alt" aria-labelledby="faq-title">
          <div className="wrap qa-grid">
            <header className="sticky"><h2 id="faq-title" className="d d-6">Straight answers.</h2></header>
            <FaqList items={s.faqs} openFirst />
          </div>
        </section>
      </Defer>

      <Defer>
        <section className="sec" aria-labelledby="rel-title">
          <div className="wrap">
            <h2 id="rel-title" className="d d-5" style={{ marginBottom: 32 }}>Often paired with</h2>
            <div className="rel-grid">
              {related.map((r) => <ServiceCard key={r.href} s={r} size="small" />)}
            </div>
          </div>
        </section>
      </Defer>

      <Defer>
        <Close where={s.slug} />
      </Defer>
    </>
  );
}
