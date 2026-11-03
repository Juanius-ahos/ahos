import { Link } from "wouter";
import { Arrow } from "./Arrow";
import { trackEvent } from "../lib/analytics";

const VOICES = [
  {
    text: "Highly professional, neat work, and they reply fast. They did an amazing job building my website.",
    name: "Yorgo",
    role: "SpeeAligner, Lebanon",
    link: "https://www.trustpilot.com/reviews/69ea9b17ea057c732e8d4c18",
  },
  {
    text: "AHOS took our taxi business from a rough idea to a polished iOS app and website. The app is live, our drivers love it, and our passengers keep growing.",
    name: "Khalil",
    role: "I Do Taxi, Lebanon",
  },
  {
    text: "They took complex concepts and turned them into clear material that actually connects with our audience. Engagement is up and our community is growing.",
    name: "Doran",
    role: "Marketing lead, defi.app",
  },
];

export function Voices({ title = "From the people", accent = "we built for." }: { title?: string; accent?: string }) {
  return (
    <section className="hm-sec vc" aria-labelledby="vc-title">
      <div className="hm-wrap">
        <header className="hm-head">
          <p className="hm-kicker"><span className="hm-rule" />Client words</p>
          <h2 id="vc-title" className="hm-h2">{title} <em>{accent}</em></h2>
        </header>
        <div className="vc-grid">
          {VOICES.map((v) => (
            <figure className="vc-item" key={v.name}>
              <blockquote>{v.text}</blockquote>
              <figcaption>
                <b>{v.name}</b><span>{v.role}</span>
                {v.link && <a href={v.link} target="_blank" rel="noopener noreferrer">Verified on Trustpilot ↗</a>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Closing({ head = "Let's build", accent = "yours.", lead = "Tell us what you're making. A real person replies within 24 hours with a plan and a fixed quote.", where = "closing" }: { head?: string; accent?: string; lead?: string; where?: string }) {
  return (
    <section className="hm-sec cl" aria-labelledby="cl-title">
      <div className="hm-wrap">
        <p className="hm-kicker"><span className="hm-rule" />Next</p>
        <h2 id="cl-title" className="cl-title">{head} <em>{accent}</em></h2>
        <p className="cl-sub">{lead}</p>
        <div className="cl-ctas">
          <Link href="/contact" className="btn" onClick={() => trackEvent("cta_click", { where })}>Book a 30-min call <Arrow /></Link>
          <a href="https://wa.me/96170165601" className="lnk" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          <a href="mailto:info@ahos.xyz" className="lnk">info@ahos.xyz</a>
        </div>
      </div>
    </section>
  );
}

/** Answer-style FAQ with visible content and matching FAQPage schema. */
export function FaqBlock({ items, title = "Straight", accent = "answers.", more = true }: { items: { q: string; a: string }[]; title?: string; accent?: string; more?: boolean }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({ "@type": "Question", name: it.q, acceptedAnswer: { "@type": "Answer", text: it.a } })),
  };
  return (
    <section className="hm-sec qa" aria-labelledby="qa-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="hm-wrap qa-grid">
        <header>
          <p className="hm-kicker"><span className="hm-rule" />Questions</p>
          <h2 id="qa-title" className="hm-h2">{title} <em>{accent}</em></h2>
          {more && <Link href="/faq" className="qa-more">All questions →</Link>}
        </header>
        <div className="qa-list">
          {items.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary>{f.q}<span aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
