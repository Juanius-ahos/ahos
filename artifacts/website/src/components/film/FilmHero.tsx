import { useEffect, useRef } from "react";
import { Link } from "wouter";
import "./film.css";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
const FILM_SECONDS = 12;

// Chapters are keyed to film time (seconds). [in, out] is when the copy is on screen.
const CHAPTERS = [
  { id: "hook", at: [0, 1.0] },
  { id: "design", at: [1.35, 3.55] },
  { id: "build", at: [3.75, 5.55] },
  { id: "ship", at: [5.85, 7.9] },
  { id: "scale", at: [8.5, 12.5] },
] as const;

export function FilmHero() {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current, video = videoRef.current;
    if (!root || !video) return;
    const portrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches;
    video.poster = asset(portrait ? "film/poster-port.jpg" : "film/poster-land.jpg");
    video.src = asset(portrait ? "film/port.mp4" : "film/land.mp4");
    video.load();

    let target = 0, shown = -1, raf = 0;
    const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-ch]"));
    const bar = root.querySelector<HTMLElement>(".fh-progress i");

    const measure = () => {
      const r = root.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, span)));
      target = p * FILM_SECONDS;
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      // ease toward the scroll position so the scrub feels like a camera, not a slideshow
      const cur = shown < 0 ? target : shown + (target - shown) * 0.16;
      if (Math.abs(cur - shown) > 0.004) {
        shown = cur;
        if (video.readyState >= 1 && Number.isFinite(video.duration)) {
          const t = Math.min(video.duration - 0.05, (cur / FILM_SECONDS) * video.duration);
          if (Math.abs(video.currentTime - t) > 0.02) video.currentTime = t;
        }
        chapters.forEach((el, i) => {
          const [a, b] = CHAPTERS[i].at;
          const fadeIn = i === 0 ? 1 : Math.min(1, Math.max(0, (cur - a) / 0.35));
          const fadeOut = i === CHAPTERS.length - 1 ? 1 : Math.min(1, Math.max(0, (b - cur) / 0.35));
          const o = Math.min(fadeIn, fadeOut);
          el.style.opacity = String(o);
          el.style.transform = `translate3d(0, ${(1 - fadeIn) * 28 - (1 - fadeOut) * 18}px, 0)`;
          el.style.visibility = o > 0.01 ? "visible" : "hidden";
        });
        if (bar) bar.style.transform = `scaleY(${cur / FILM_SECONDS})`;
      }
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="fh" ref={rootRef} aria-label="How AHOS builds a product">
      <div className="fh-stage">
        <video
          ref={videoRef}
          className="fh-video"
          muted
          playsInline
          preload="auto"
          poster={asset("film/poster-land.jpg")}
          aria-hidden="true"
        />
        <div className="fh-shade" aria-hidden="true" />

        <div className="fh-copy">
          <div className="fh-ch fh-hook" data-ch="hook">
            <p className="fh-kicker"><span className="fh-rule" />AHOS · Digital product studio</p>
            <h1 className="fh-h1">What if you could watch your product <em>being built?</em></h1>
            <p className="fh-scroll" aria-hidden="true">Scroll</p>
          </div>

          <div className="fh-ch" data-ch="design">
            <p className="fh-num">01 <span>Design</span></p>
            <h2 className="fh-h2">Every screen is drawn before a line of code.</h2>
            <p className="fh-p">We map your product screen by screen, so you see exactly what you are getting before we build it.</p>
          </div>

          <div className="fh-ch" data-ch="build">
            <p className="fh-num">02 <span>Build</span></p>
            <h2 className="fh-h2">Built by the people who <em>designed it.</em></h2>
            <p className="fh-p">Design and engineering under one roof. Nothing gets lost in a handoff, and every line of code is yours.</p>
          </div>

          <div className="fh-ch" data-ch="ship">
            <p className="fh-num">03 <span>Ship</span></p>
            <h2 className="fh-h2">Live, fast, and <em>selling.</em></h2>
            <p className="fh-p">On screen: Threads Activewear, an online store we designed and built for a sportswear retailer in Beirut.</p>
          </div>

          <div className="fh-ch" data-ch="scale">
            <p className="fh-num">04 <span>Scale</span></p>
            <h2 className="fh-h2">Then the world <em>finds it.</em></h2>
            <p className="fh-p">Search, speed and support after launch, so your product keeps working while you grow. For founders in Beirut, the Gulf, Europe and the US.</p>
            <div className="fh-ctas">
              <Link href="/contact" className="fh-btn">Book a 30-min call <span aria-hidden="true">↗</span></Link>
              <a href="#work" className="fh-ghost">See the work</a>
            </div>
          </div>
        </div>

        <div className="fh-progress" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
