/**
 * Motion layer. Loaded after first paint, never on the critical path.
 * Every page renders complete without it; motion only enhances what is there.
 *
 * Hooks, all by data attribute:
 *   [data-reveal]       rises in once when it enters the viewport (only if it starts below the fold)
 *   [data-count]        counts up to its value once in view
 *   [data-grow]         line grows once on load; [data-grow-scrub] grows with scroll
 *   [data-sweep]        work frame: the drawing is drawn over the live screenshot, then a build line sweeps it away
 *   [data-magnetic]     follows the pointer a little (fine pointers only)
 *
 * GSAP lessons kept from the Issam build: every tween gets its own scrollTrigger
 * config, and any pin is created after the other triggers on the same element.
 */
import type { default as LenisType } from "lenis";

type Gsap = typeof import("gsap").gsap;
type ST = typeof import("gsap/ScrollTrigger").ScrollTrigger;

let gsap: Gsap | null = null;
let ScrollTrigger: ST | null = null;
let lenis: LenisType | null = null;
let ctx: ReturnType<Gsap["context"]> | null = null;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export async function startMotion() {
  if (reduced()) return;
  const [{ gsap: g }, { ScrollTrigger: st }, { default: Lenis }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("lenis"),
  ]);
  gsap = g;
  ScrollTrigger = st;
  gsap.registerPlugin(st);

  lenis = new Lenis({ lerp: 0.12, smoothWheel: true });
  lenis.on("scroll", st.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  document.documentElement.classList.add("m-ready");
  bind();
}

/** Re-scan the page after a client-side route change. */
export function rebindMotion() {
  if (!gsap) return;
  ctx?.revert();
  lenis?.scrollTo(0, { immediate: true });
  requestAnimationFrame(() => { bind(); ScrollTrigger?.refresh(); });
}

function bind() {
  const g = gsap!;
  ctx = g.context(() => {
    const vh = window.innerHeight;

    // reveals, only for things the visitor has not seen yet
    g.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.92) return;
      g.fromTo(el, { autoAlpha: 0, y: 32 }, {
        autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    // counters
    g.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const to = parseFloat(el.dataset.count || "0");
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const suf = el.dataset.suffix || "";
      const o = { v: 0 };
      g.to(o, {
        v: to, duration: 1.4, ease: "power2.out",
        onUpdate: () => { el.textContent = o.v.toFixed(dec) + suf; },
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
      });
    });

    // lines that grow: once on load (hero), or scrubbed to scroll (process)
    g.utils.toArray<HTMLElement>("[data-grow]").forEach((el) => {
      g.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power3.inOut", delay: 0.15 });
    });
    g.utils.toArray<HTMLElement>("[data-grow-scrub]").forEach((el) => {
      const vertical = el.getBoundingClientRect().height > el.getBoundingClientRect().width;
      g.fromTo(el, vertical ? { scaleY: 0 } : { scaleX: 0 }, {
        ...(vertical ? { scaleY: 1 } : { scaleX: 1 }), ease: "none",
        scrollTrigger: { trigger: el.parentElement || el, start: "top 75%", end: "bottom 65%", scrub: 0.6 },
      });
    });

    // work frames: draw, then build
    g.utils.toArray<HTMLElement>("[data-sweep]").forEach((frame) => {
      const svg = frame.querySelector<SVGSVGElement>(".draw");
      const veil = frame.querySelector<HTMLElement>(".draw-veil");
      const line = frame.querySelector<HTMLElement>(".build-line");
      const view = frame.querySelector<HTMLElement>(".frame-view");
      if (!svg || !veil || !line || !view) return;
      const paths = Array.from(svg.querySelectorAll<SVGGeometryElement>("path"));
      const texts = svg.querySelectorAll("text, circle");
      paths.forEach((p) => { const l = p.getTotalLength(); p.style.strokeDasharray = `${l}`; p.style.strokeDashoffset = `${l}`; });
      const h = () => view.getBoundingClientRect().height;
      const tl = g.timeline({ scrollTrigger: { trigger: frame, start: "top 80%", end: "bottom 35%", scrub: 0.8 } });
      tl.set(svg, { autoAlpha: 1 })
        .to(veil, { autoAlpha: 1, duration: 0.15 }, 0)
        .to(paths, { strokeDashoffset: 0, duration: 0.45, stagger: 0.01, ease: "none" }, 0)
        .fromTo(texts, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.35)
        .set(line, { autoAlpha: 1, y: 0 }, 0.55)
        .to(line, { y: () => h(), duration: 0.4, ease: "none" }, 0.55)
        .fromTo([veil, svg], { clipPath: "inset(0% 0 0 0)" }, { clipPath: "inset(100% 0 0 0)", duration: 0.4, ease: "none" }, 0.55)
        .to(line, { autoAlpha: 0, duration: 0.05 }, 0.95);
    });

    // magnetic buttons
    if (window.matchMedia("(pointer: fine)").matches) {
      g.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
        const xTo = g.quickTo(el, "x", { duration: 0.5, ease: "power3" });
        const yTo = g.quickTo(el, "y", { duration: 0.5, ease: "power3" });
        el.addEventListener("pointermove", (e) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.25);
          yTo((e.clientY - r.top - r.height / 2) * 0.35);
        });
        el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
      });
    }
  });
}
