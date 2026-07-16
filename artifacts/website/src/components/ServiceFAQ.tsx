export interface QA {
  q: string;
  a: string;
}

/**
 * Visible per-service FAQ + matching FAQPage JSON-LD. The content is rendered
 * on the page (Google requires FAQ rich-result content to be user-visible) and
 * the extra keyword-rich copy helps the page rank for question-style queries.
 */
export function ServiceFAQ({ items, heading = "Common questions" }: { items: QA[]; heading?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };

  return (
    <section className="sf ed ed-sec" aria-labelledby="sf-heading">
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="sf-head">
        <span className="ed-label">
          <span className="ed-label-line" /><span className="ed-label-text">FAQ</span>
        </span>
        <h2 id="sf-heading" className="ed-h2">{heading}</h2>
      </div>
      <div className="sf-list">
        {items.map((it) => (
          <details key={it.q} className="sf-item">
            <summary className="sf-q">{it.q}</summary>
            <p className="sf-a">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

const css = `
.sf-head { margin-bottom: 24px; }
.sf-list { display: flex; flex-direction: column; border-top: 1px solid var(--border-soft); }
.sf-item { border-bottom: 1px solid var(--border-soft); }
.sf-q {
  list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 20px;
  padding: 20px 4px; font-family: var(--font-display); font-size: clamp(16px, 2.2vw, 20px); font-weight: 600;
  letter-spacing: -0.02em; color: var(--text); transition: color 0.2s ease;
}
.sf-q::-webkit-details-marker { display: none; }
.sf-q::after { content: "+"; flex-shrink: 0; font-family: var(--font-sans); font-size: 22px; font-weight: 400; color: var(--orange); transition: transform 0.25s ease; }
.sf-item[open] .sf-q::after { transform: rotate(45deg); }
.sf-q:hover { color: var(--orange); }
.sf-a { padding: 0 4px 22px; max-width: 68ch; font-size: 15px; line-height: 1.75; color: var(--text-muted); }
`;
