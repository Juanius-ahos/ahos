// Real, verifiable AHOS reviews only. Do not add testimonials we cannot stand
// behind, and never carry over another company's reviews.
const REVIEWS = [
  {
    text: "I'm grateful for the team at AHOS, they did an amazing job building my website. Highly professional, neat work, amazing prices, and they reply fast. Kudos!",
    name: "Yorgo",
    role: "SpeeAligner.com, Lebanon",
    source: "Trustpilot",
    link: "https://www.trustpilot.com/reviews/69ea9b17ea057c732e8d4c18",
  },
  {
    text: "AHOS took our taxi business from a rough idea to a polished iOS app and website. Real-time booking, driver dispatch, secure payments, they handled every layer with care. The app is live, our drivers love it, and our passengers keep growing.",
    name: "Khalil",
    role: "Ido Taxi, Lebanon",
    source: "Client",
    link: null,
  },
  {
    text: "We brought AHOS in to shape our content strategy, and they exceeded every expectation. They took complex DeFi concepts and turned them into clear, engaging material that connects with our audience. Engagement is up and our community is growing.",
    name: "Doran",
    role: "Marketing Lead, defi.app",
    source: "Client",
    link: null,
  },
];

function Stars() {
  return (
    <span className="rv-stars" aria-label="5 out of 5 stars" style={{ color: "#F5B90A" }}>
      {"★★★★★"}
    </span>
  );
}

export function ReviewsMarquee() {
  const rm = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pause = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = "paused"; };
  const resume = (e: React.MouseEvent<HTMLElement>) => { if (!rm) (e.currentTarget as HTMLElement).style.animationPlayState = ""; };

  const cards = [...REVIEWS, ...REVIEWS];

  return (
    <section className="rv" aria-label="Client reviews">
      <style>{css}</style>
      <div className="rv-row">
        <div className="rv-track" onMouseEnter={pause} onMouseLeave={resume}>
          {cards.map((r, i) => (
            <article className="rv-card" key={i} aria-hidden={i >= REVIEWS.length ? "true" : undefined}>
              <div className="rv-top">
                <Stars />
                <span className="rv-source">{r.source}</span>
              </div>
              <p className="rv-quote">"{r.text}"</p>
              <div className="rv-by">
                <div className="rv-avatar">{r.name[0]}</div>
                <div className="rv-meta">
                  <strong>{r.name}</strong>
                  <span>{r.role}</span>
                  {r.link && (
                    <a className="rv-more" href={r.link} target="_blank" rel="noopener noreferrer">Verified on Trustpilot ↗</a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const css = `
.rv { position: relative; z-index: 20; padding: clamp(32px, 4vw, 56px) 0 clamp(48px, 6vw, 80px); overflow: hidden; }
.rv-row {
  display: flex;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%);
  mask-image: linear-gradient(90deg, transparent 0%, #000 12%, #000 88%, transparent 100%);
}
.rv-track {
  display: flex;
  flex-shrink: 0;
  gap: 16px;
  padding: 0 clamp(16px, 3vw, 32px);
  animation: rv-scroll 50s linear infinite;
  will-change: transform;
  touch-action: pan-y;
  user-select: none;
}
.rv-track:hover { animation-play-state: paused; }

.rv-card {
  flex: 0 0 400px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: clamp(20px, 2.5vw, 30px);
  border-radius: 14px;
  border: 1px solid var(--border);
  background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%);
  backdrop-filter: blur(12px) saturate(1.5);
  -webkit-backdrop-filter: blur(12px) saturate(1.5);
  cursor: pointer;
}

.rv-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.rv-source {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(237,232,224,0.45);
}
.rv-stars { font-size: 13px; letter-spacing: 1px; }

.rv-quote {
  font-family: var(--font-mono);
  font-size: clamp(13px, 1.2vw, 14.5px);
  line-height: 1.7;
  font-style: italic;
  color: var(--text);
  margin: 0;
  flex: 1;
  overflow: hidden;
}
.rv-more {
  display: block;
  margin-top: 6px;
  font-style: normal;
  font-size: 12px;
  color: var(--orange);
  cursor: pointer;
}

.rv-by {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
}
.rv-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--orange-soft);
  border: 1px solid var(--border-hover);
  color: var(--orange);
  flex-shrink: 0;
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
}
.rv-meta { display: flex; flex-direction: column; gap: 1px; }
.rv-meta strong { font-size: 13px; font-weight: 600; color: var(--text); }
.rv-meta span { font-size: 12px; color: var(--text-dim); }

@keyframes rv-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@media (max-width: 600px) {
  .rv-card { flex: 0 0 300px; min-height: 180px; }
  .rv-track { animation-duration: 65s; }
}
@media (prefers-reduced-motion: reduce) {
  .rv-track { animation: none; flex-wrap: nowrap; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  .rv-card { scroll-snap-align: start; }
}
`;
