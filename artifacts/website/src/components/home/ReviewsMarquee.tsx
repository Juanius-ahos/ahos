import { useRef } from "react";

const REVIEWS = [
  {
    source: "Google",
    text: "I'm grateful for the team at AHOS, they did an amazing job building my website. Highly professional, neat work, amazing prices, and they reply fast. Kudos!",
    name: "Yorgo",
    role: "SpeeAligner.com, Lebanon",
    photo: null,
  },
  {
    source: "Google",
    text: "AHOS took our taxi business from a rough idea to a polished iOS app and website. Real-time booking, driver dispatch, secure payments — they handled every layer with care.",
    name: "Khalil",
    role: "Ido Taxi, Lebanon",
    photo: null,
  },
  {
    source: "Google",
    text: "We brought AHOS in to shape our content strategy, and they exceeded every expectation. They took complex concepts and turned them into clear, engaging material.",
    name: "Doran",
    role: "Marketing Lead, defi.app",
    photo: null,
  },
  {
    source: "Google",
    text: "Professional, fast, and easy to communicate with. They built us a platform that's ready for AI and Google. The result exceeded expectations.",
    name: "Carlos",
    role: "Web Development Client",
    photo: null,
  },
  {
    source: "Google",
    text: "After bad experiences with two other companies, I finally found a team that helped me develop my web platform clearly, quickly, and efficiently. Highly recommended.",
    name: "Ahmad",
    role: "E-Commerce, Beirut",
    photo: null,
  },
  {
    source: "Google",
    text: "They showed me transparently why things are done a certain way and simplified many processes. Fair prices and always focused on quality.",
    name: "Marielena",
    role: "Entrepreneur",
    photo: null,
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
    <section className="rv" aria-label="Google reviews">
      <style>{css}</style>
      <div className="rv-row">
        <div className="rv-track" onMouseEnter={pause} onMouseLeave={resume}>
          {cards.map((r, i) => (
            <article className="rv-card" key={i} aria-hidden={i >= REVIEWS.length ? "true" : undefined}>
              <div className="rv-top">
                <span className="rv-source">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  google reviews
                </span>
                <Stars />
              </div>
              <p className="rv-quote">
                "{r.text}"
                <span className="rv-more">Click to read more →</span>
              </p>
              <div className="rv-by">
                <div className="rv-avatar" />
                <div className="rv-meta">
                  <strong>{r.name}</strong>
                  <span>{r.role}</span>
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
  background: var(--border);
  flex-shrink: 0;
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
