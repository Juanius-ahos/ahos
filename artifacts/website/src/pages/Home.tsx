import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Defer } from "../components/Defer";
import { Close, FaqList, useBeirut } from "../components/ui";
import { Button, CaseStory, DeviceScene, Kicker, ProofBar, SectionHeader, WhatsAppCta } from "../components/kit";
import { Founder, FreeCheck, Lab, OutcomeCard, ProcessLine, Testimonials, WorkMore } from "../components/sections";
import { caseStudies, homeFaq, outcomes, projectById, site } from "../site.config";

/** The four case studies told in full on the homepage. The rest live on /work. */
const FEATURED = ["oman-with-issam", "threads-activewear", "speealigner", "juls-auto-repair"];

/**
 * Homepage. One job: get the right people to message us on WhatsApp.
 * Order: hero, proof, work as stories, services by outcome, how we work, the founder,
 * client words, the lab, the free check, answers, contact.
 */
export default function Home() {
  const clock = useBeirut();
  const featured = FEATURED.map((slug) => caseStudies.find((c) => c.slug === slug)!).filter((c) => c?.story);
  const quotes = caseStudies.flatMap((c) => (c.quote ? [c.quote] : []));

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="hero2 grain" aria-labelledby="hero-title">
        <div className="wrap hero2-grid">
          <div className="hero2-copy">
            <Kicker>Design and engineering studio in Beirut</Kicker>
            <h1 id="hero-title" className="hero2-h1">Design that sells. Code that holds.</h1>
            <p className="lead hero2-lead">Websites, online stores, bots and AI for businesses that want to look as good as they are.</p>
            <div className="acts">
              <WhatsAppCta where="hero" size="lg" />
              <Button href="#work" variant="outline" size="lg" magnetic={false}>See our work</Button>
            </div>
            <p className="hero2-reply">
              <span className={`dot${clock?.atDesk ? " on" : ""}`} aria-hidden="true" />
              {clock ? (clock.atDesk ? `We're online (${clock.time} Beirut time). Expect a reply today.` : `It's ${clock.time} in Beirut. We reply first thing in the morning.`) : `A real person replies within ${site.contact.replyWithin}.`}
            </p>
          </div>
          <div className="hero2-vis"><DeviceScene eager /></div>
        </div>
        <span className="scroll-cue" aria-hidden="true">Scroll</span>
      </section>

      {/* ---------- proof bar ---------- */}
      <div className="wrap"><ProofBar /></div>

      {/* ---------- selected work, as stories ---------- */}
      {featured.map((c, i) => (
        <Defer key={c.slug}>
          <CaseStory id={i === 0 ? "work" : undefined} c={c} p={projectById(c.project)} no={String(i + 1).padStart(2, "0")} flip={i % 2 === 1} />
        </Defer>
      ))}
      <Defer><WorkMore /></Defer>

      {/* ---------- services by outcome ---------- */}
      <Defer>
      <section id="services" className="sec" aria-labelledby="svc-title">
        <div className="wrap">
          <SectionHeader id="svc-title" kicker="Services" title="What we build, and what it costs." lead="Every project gets a fixed quote in writing after a free call. These are the starting points." />
          <div className="oc-grid">
            {outcomes.map((o) => <OutcomeCard key={o.id} o={o} />)}
          </div>
          <p className="oc-more"><Link href="/services" className="lnk">See every service, with prices and what is included <Arrow /></Link></p>
        </div>
      </section>
      </Defer>

      {/* ---------- how we work ---------- */}
      <Defer>
      <section id="how" className="sec alt" aria-labelledby="how-title">
        <div className="wrap">
          <SectionHeader id="how-title" kicker="How we work" title="Five steps, the same every time." lead="From the first call to launch day you always know what happens next." />
          <ProcessLine />
        </div>
      </section>
      </Defer>

      {/* ---------- the founder ---------- */}
      <Defer><Founder /></Defer>

      {/* ---------- testimonials ---------- */}
      <Defer><Testimonials items={quotes} /></Defer>

      {/* ---------- the lab ---------- */}
      <Defer><Lab /></Defer>

      {/* ---------- free website check ---------- */}
      <Defer><FreeCheck where="home" /></Defer>

      {/* ---------- faq ---------- */}
      <Defer>
      <section id="faq" className="sec" aria-labelledby="faq-title">
        <div className="wrap qa-grid">
          <header>
            <Kicker>Answers</Kicker>
            <h2 id="faq-title" className="d d-5" style={{ marginTop: 22 }}>Quick answers.</h2>
            <Link href="/faq" className="lnk" style={{ marginTop: 20, display: "inline-flex" }}>All questions <Arrow /></Link>
          </header>
          <FaqList items={homeFaq} openFirst />
        </div>
      </section>
      </Defer>

      {/* ---------- final cta ---------- */}
      <Defer><Close where="home" /></Defer>
    </>
  );
}
