/**
 * Scrolling reviews marquee in the weevolveit arrangement: a continuous row of
 * review cards. Uses only AHOS's real, verified reviews (no fabricated ones),
 * duplicated for a seamless loop. Pauses on hover.
 */
const REVIEWS = [
  {
    source: "Trustpilot",
    text: "I'm grateful for the team at AHOS, they did an amazing job building my website. Highly professional, neat work, amazing prices, and they reply fast. Kudos!",
    name: "Yorgo",
    role: "SpeeAligner.com, Lebanon",
    link: "https://www.trustpilot.com/reviews/69ea9b17ea057c732e8d4c18",
  },
  {
    source: "Client",
    text: "AHOS took our taxi business from a rough idea to a polished iOS app and website. Real-time booking, driver dispatch, secure payments, they handled every layer with care. The app is live, our drivers love it, and our passengers keep growing.",
    name: "Khalil",
    role: "Ido Taxi, Lebanon",
  },
  {
    source: "Client",
    text: "We brought AHOS in to shape our content strategy, and they exceeded every expectation. They took complex DeFi concepts and turned them into clear, engaging material. Engagement is up, our community is growing, and we finally have a voice that matches our product.",
    name: "Doran",
    role: "Marketing Lead, defi.app",
  },
];

function Stars() {
  return (
    <span className="rv-stars" aria-label="5 out of 5 stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1l2.4 4.9 5.4.8-3.9 3.8.9 5.4L10 13.2l-4.8 2.7.9-5.4-3.9-3.8 5.4-.8L10 1z" />
        </svg>
      ))}
    </span>
  );
}

export function ReviewsMarquee() {
  const rm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pause = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; };
  const resume = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = ""; };

  const cards = [...REVIEWS, ...REVIEWS];

  return (
    <section className="rv" data-accent="255,140,74">
      <style>{css}</style>
      <div className="ed rv-head">
        <div className="ed-label">
          <span className="ed-label-n">04</span>
          <span className="ed-label-line" />
          <span className="ed-label-text">What clients say</span>
        </div>
        <h2 className="ed-h2">Kind words from people<br />we've worked with.</h2>
      </div>

      <div className="rv-row">
        <div className="rv-track" onMouseEnter={pause} onMouseLeave={resume}>
          {cards.map((r, i) => (
            <article className="rv-card" key={i} aria-hidden={i >= REVIEWS.length ? "true" : undefined}>
              <div className="rv-top">
                <Stars />
                <span className="rv-src">{r.source}</span>
              </div>
              <p className="rv-quote">"{r.text}"</p>
              <div className="rv-by">
                <strong>{r.name}</strong>
                <span>{r.role}</span>
                {r.link && (
                  <a className="rv-verified" href={r.link} target="_blank" rel="noopener noreferrer">Verified on Trustpilot ↗</a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const css = `
.rv { padding: var(--section-pad) 0; border-top: 1px solid var(--border-soft); overflow: hidden; margin-top: -2vh; }
.rv-head { margin-bottom: clamp(36px, 5vw, 60px); }

.rv-row { display: flex; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent); }
.rv-track { display: flex; flex-shrink: 0; gap: 20px; padding-left: 20px; animation: mq-scroll 46s linear infinite; will-change: transform; }
.rv-row:hover .rv-track { animation-play-state: paused; }

.rv-card { flex: 0 0 min(380px, 82vw); display: flex; flex-direction: column; gap: 16px; padding: clamp(24px, 2.6vw, 34px); border: 1px solid var(--border); border-radius: var(--radius-xl); background: var(--bg-card); box-sizing: border-box; }
.rv-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.rv-stars { display: inline-flex; gap: 2px; color: var(--orange); }
.rv-src { font-family: var(--font-mono); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-faint); }
.rv-quote { font-size: clamp(14px, 1.3vw, 15.5px); line-height: 1.7; color: var(--text-muted); margin: 0; }
.rv-by { margin-top: auto; display: flex; flex-direction: column; gap: 2px; }
.rv-by strong { font-size: 14px; font-weight: 600; color: var(--text); }
.rv-by span { font-size: 12.5px; color: var(--text-dim); }
.rv-verified { margin-top: 6px; font-size: 12px; font-weight: 600; color: var(--orange); transition: opacity 0.2s; }
.rv-verified:hover { opacity: 0.75; }

@media (max-width: 600px) {
  .rv-track { animation-duration: 60s; }
}
@media (prefers-reduced-motion: reduce) {
  .rv-track { animation: none; flex-wrap: nowrap; overflow-x: auto; scroll-snap-type: x mandatory; }
  .rv-card { scroll-snap-align: start; }
}
`;
