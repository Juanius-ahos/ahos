import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Close, FaqList, PageHeader } from "../components/ui";
import { faqCategories } from "../site.config";

export default function Faq() {
  return (
    <>
      <PageHeader crumbs={[{ name: "Home", href: "/" }, { name: "FAQ" }]} title="Straight answers." lead="Timelines, prices, ownership and what happens after launch. If yours is not here, ask us; a person replies within 24 hours.">
        <Link href="/contact" className="btn">Ask us directly <Arrow /></Link>
      </PageHeader>
      <section className="sec" aria-label="Questions">
        <div className="wrap qa-grid">
          <nav className="sticky" aria-label="Topics">
            <ul className="index">
              {faqCategories.map((c, i) => (
                <li key={c.name} className="index-row has-link" style={{ gridTemplateColumns: "1fr", paddingBlock: 16 }}>
                  <span className="d" style={{ fontSize: "var(--t-4)" }}><span className="dim" style={{ marginRight: 12 }}>{i + 1}</span>{c.name}</span>
                  <a className="row-link" href={`#faq-${i}`} aria-label={c.name} />
                </li>
              ))}
            </ul>
          </nav>
          <div>
            {faqCategories.map((c, i) => (
              <div key={c.name} id={`faq-${i}`} className="qa-cat">
                <h2 className="d d-5">{c.name}</h2>
                <FaqList items={c.items} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Close where="faq" />
    </>
  );
}
