import { Defer } from "../components/Defer";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Close, FaqList, PageHeader, Hl } from "../components/ui";
import { faqCategories } from "../site.config";

export default function Faq() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<number | null>(null);
  const norm = q.trim().toLowerCase();

  // Every question is in the page for search engines; the filter only narrows what a visitor sees.
  const groups = useMemo(
    () => faqCategories
      .map((c, i) => ({ name: c.name, i, items: c.items.filter((f) => !norm || `${f.q} ${f.a}`.toLowerCase().includes(norm)) }))
      .filter((g) => (cat === null || g.i === cat) && g.items.length > 0),
    [norm, cat],
  );
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "FAQ" }]}
        title={<>Straight <Hl>answers</Hl>.</>}
        lead="Timelines, prices, ownership and what happens after launch. If yours is not here, ask us; a person replies within 24 hours."
        bg="glyph"
      >
        <Link href="/contact" className="btn">Ask us directly <Arrow /></Link>
      </PageHeader>
      <section className="sec" aria-label="Questions">
        <div className="wrap faq-wide">
          <div className="faq-tools">
            <div className="faq-search" role="search">
              <label className="sr" htmlFor="faq-q">Search the questions</label>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
              <input id="faq-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search: price, timeline, ownership" autoComplete="off" />
            </div>
            <div className="faq-chips" role="group" aria-label="Topics">
              <button type="button" aria-pressed={cat === null} onClick={() => setCat(null)}>All</button>
              {faqCategories.map((c, i) => (
                <button key={c.name} type="button" aria-pressed={cat === i} onClick={() => setCat(cat === i ? null : i)}>{c.name}<span>{c.items.length}</span></button>
              ))}
            </div>
            <p className="small" aria-live="polite">{total} {total === 1 ? "answer" : "answers"}{norm ? ` for "${q.trim()}"` : ""}</p>
          </div>

          <div className="faq-list">
            {groups.map((g) => (
              <div key={g.name} id={`faq-${g.i}`} className="qa-cat">
                <h2 className="d d-5">{g.name}</h2>
                <FaqList items={g.items} openFirst={!!norm} />
              </div>
            ))}
            {groups.length === 0 && (
              <p className="faq-empty">Nothing matches that yet. <Link href="/contact" className="lnk">Ask us directly <Arrow /></Link></p>
            )}
          </div>
        </div>
      </section>
      <Defer>
        <Close where="faq" />
      </Defer>
    </>
  );
}
