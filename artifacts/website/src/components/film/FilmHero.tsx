import { useEffect, useRef, useState } from "react";
import { Arrow } from "../Arrow";
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

const whenIdle = () => new Promise<void>((r) => ((window as any).requestIdleCallback ? (window as any).requestIdleCallback(() => r(), { timeout: 1500 }) : setTimeout(r, 300)));
type Film = Awaited<ReturnType<typeof import("../../three/film").createFilm>>;

export function FilmHero() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = rootRef.current, canvas = canvasRef.current;
    if (!root || !canvas) return;
    const mobile = window.matchMedia("(max-width: 900px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-ch]"));
    const bar = root.querySelector<HTMLElement>(".fh-progress i");
    let film: Film | null = null, raf = 0, disposed = false;
    let target = 0, shown = -1, visible = true, dirty = true;
    let dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.6);
    const frameTimes: number[] = [];

    // the subject lives in the space the copy leaves free
    const layout = () => {
      if (!film) return;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const portrait = w / h < 1.05;
      let r;
      if (portrait) {
        const bottom = Math.max(...chapters.map((c) => c.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top));
        const y = Math.min(h * 0.62, bottom + 12);
        r = { x: 0, y, w, h: h - y };
      } else {
        const right = Math.max(...chapters.map((c) => c.getBoundingClientRect().right));
        const x = Math.min(w * 0.6, right + 24);
        r = { x, y: 64, w: w - x, h: h - 64 };
      }
      film.resize(w * dpr, h * dpr, { x: r.x * dpr, y: r.y * dpr, w: r.w * dpr, h: r.h * dpr });
      dirty = true;
    };
    const measure = () => {
      const r = root.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      target = Math.min(1, Math.max(0, -r.top / Math.max(1, span))) * FILM_SECONDS;
    };
    const updateCopy = (cur: number) => {
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
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      // ease toward the scroll position so the scrub feels like a camera move
      const cur = shown < 0 ? target : shown + (target - shown) * 0.14;
      const moved = Math.abs(cur - shown) > 0.0005;
      if (moved) { shown = cur; updateCopy(cur); }
      if (!film || !visible || document.hidden) return;
      const idle = cur < 0.02 && !reduced;
      if (!idle && !moved && !dirty) return;
      const s = performance.now();
      if (idle) film.renderIdle(now / 1000); else film.render(cur);
      dirty = false;
      // keep the frame rate: step resolution down on slow GPUs
      frameTimes.push(performance.now() - s);
      if (frameTimes.length >= 40) {
        const avg = frameTimes.reduce((x, y) => x + y, 0) / frameTimes.length;
        frameTimes.length = 0;
        if (avg > 22 && dpr > 0.8) { dpr = Math.max(0.8, dpr - 0.25); layout(); }
      }
    };

    measure(); updateCopy(target);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; dirty = true; }, { threshold: 0 });
    io.observe(root);
    const ro = new ResizeObserver(layout); ro.observe(canvas);
    window.addEventListener("scroll", measure, { passive: true });
    raf = requestAnimationFrame(tick);

    whenIdle().then(() => import("../../three/film")).then(({ createFilm }) => createFilm(canvas, { phoneShot: asset("3d/threads-mob.webp"), mobile }))
      .then((f) => { if (disposed) { f.dispose(); return; } film = f; layout(); setReady(true); })
      .catch(() => root.classList.add("fh-nogl"));

    return () => {
      disposed = true; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener("scroll", measure);
      film?.dispose();
    };
  }, []);

  return (
    <section className="fh tone-ink" data-tone="ink" ref={rootRef} aria-label="How AHOS builds a product">
      <div className="fh-stage">
        <canvas ref={canvasRef} className={`fh-canvas${ready ? " is-ready" : ""}`} aria-hidden="true" />
        <div className="fh-shade" aria-hidden="true" />

        <div className="fh-copy">
          <div className="fh-ch fh-hook" data-ch="hook">
            <h1 className="fh-h1">What if you could watch your product being built?</h1>
            <p className="fh-scroll" aria-hidden="true">Scroll to build it</p>
          </div>

          <div className="fh-ch" data-ch="design">
            <p className="fh-num">01 <span>Design</span></p>
            <h2 className="fh-h2">Every screen is drawn before a line of code.</h2>
            <p className="fh-p">We map your product screen by screen, so you see exactly what you are getting before we build it.</p>
          </div>

          <div className="fh-ch" data-ch="build">
            <p className="fh-num">02 <span>Build</span></p>
            <h2 className="fh-h2">Built by the people who designed it.</h2>
            <p className="fh-p">Design and engineering under one roof. Nothing gets lost in a handoff, and every line of code is yours.</p>
          </div>

          <div className="fh-ch" data-ch="ship">
            <p className="fh-num">03 <span>Ship</span></p>
            <h2 className="fh-h2">Live, fast, and selling.</h2>
            <p className="fh-p">On screen: Threads Activewear, an online store we designed and built for a sportswear retailer in Beirut.</p>
          </div>

          <div className="fh-ch" data-ch="scale">
            <p className="fh-num">04 <span>Scale</span></p>
            <h2 className="fh-h2">Then the world finds it.</h2>
            <p className="fh-p">Search, speed and support after launch, so your product keeps working while you grow. For founders in Beirut, the Gulf, Europe and the US.</p>
            <div className="fh-ctas">
              <Link href="/contact" className="btn">Book a 30-min call <Arrow /></Link>
              <a href="#work" className="lnk">See the work</a>
            </div>
          </div>
        </div>

        <div className="fh-progress" aria-hidden="true"><i /></div>
      </div>
    </section>
  );
}
