/**
 * Motion layer. Loaded right after hydration, never blocking first paint.
 * Every page renders complete without it; motion only enhances what is there.
 *
 * The one loud moment is the hero: the four tiles of the AHOS "O" drop into
 * place with a squash-and-bounce, a click anywhere in the hero throws a burst
 * of tiles with real gravity (Physics2D), and clicking a big tile knocks it
 * out of the logo before it drops back in. Everything else is quiet.
 *
 * Hooks, all by data attribute:
 *   [data-hero]          hero section: intro, debris, knockable tiles, scroll scatter
 *   [data-split]         headline lines rise out of a mask on load (SplitText)
 *   [data-reveal-tile]   screenshot opens from a logo-tile parallelogram as it scrolls in
 *   [data-float]         phone drifts up a little against the screenshot
 *   [data-draw]          SVG stroke draws with scroll (DrawSVG)
 *   [data-more]          list rows show a peek of the project under the cursor, and scramble their label
 */
import type { default as LenisType } from "lenis";

type Gsap = typeof import("gsap").gsap;
type ST = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type Split = typeof import("gsap/SplitText").SplitText;

let gsap: Gsap | null = null;
let ScrollTrigger: ST | null = null;
let SplitText: Split | null = null;
let lenis: LenisType | null = null;
let ctx: ReturnType<Gsap["context"]> | null = null;
const cleanups: (() => void)[] = [];

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => window.matchMedia("(pointer: fine)").matches;

export async function startMotion() {
  const root = document.documentElement;
  if (reduced()) { root.classList.remove("js-intro"); return; }
  try {
    const [{ gsap: g }, { ScrollTrigger: st }, { SplitText: split }, { ScrambleTextPlugin }, { DrawSVGPlugin }, { Physics2DPlugin }, { CustomEase }, { CustomBounce }, { default: Lenis }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
      import("gsap/ScrambleTextPlugin"),
      import("gsap/DrawSVGPlugin"),
      import("gsap/Physics2DPlugin"),
      import("gsap/CustomEase"),
      import("gsap/CustomBounce"),
      import("lenis"),
    ]);
    gsap = g;
    ScrollTrigger = st;
    SplitText = split;
    gsap.registerPlugin(st, split, ScrambleTextPlugin, DrawSVGPlugin, Physics2DPlugin, CustomEase, CustomBounce);
    CustomBounce.create("tileBounce", { strength: 0.45, squash: 2.2, squashID: "tileSquash", endAtStart: false });

    lenis = new Lenis({ lerp: 0.12, smoothWheel: true, anchors: { offset: -80 } } as ConstructorParameters<typeof Lenis>[0]);
    lenis.on("scroll", st.update);
    gsap.ticker.add((t) => lenis?.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    root.classList.add("m-ready");
    bind();
  } catch {
    root.classList.remove("js-intro");
  }
}

/** Re-scan the page after a client-side route change. */
export function rebindMotion() {
  if (!gsap) return;
  unbind();
  lenis?.scrollTo(0, { immediate: true });
  requestAnimationFrame(() => { bind(); ScrollTrigger?.refresh(); });
}

function unbind() {
  ctx?.revert();
  while (cleanups.length) cleanups.pop()!();
}

function on<K extends keyof HTMLElementEventMap>(el: EventTarget, type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions) {
  el.addEventListener(type, fn as EventListener, opts);
  cleanups.push(() => el.removeEventListener(type, fn as EventListener, opts));
}

function bind() {
  const g = gsap!;
  ctx = g.context(() => {
    const intro = document.documentElement.classList.contains("js-intro");
    document.documentElement.classList.remove("js-intro");

    splitHeadlines(intro);
    hero();
    reveals();
    peeks();
  });
}

/* ---------------------------------------------------------------- */
/* headlines                                                         */
/* ---------------------------------------------------------------- */

function splitHeadlines(intro: boolean) {
  const g = gsap!;
  const vh = window.innerHeight;
  g.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
    if (el.getBoundingClientRect().top > vh) return; // only the headline you land on
    document.fonts.ready.then(() => {
      SplitText!.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line-in",
        autoSplit: true,
        onSplit(self) {
          return g.from(self.lines, { yPercent: 115, duration: 1.15, ease: "expo.out", stagger: 0.09, delay: intro ? 0.1 : 0.05 });
        },
      });
    });
  });
}

/* ---------------------------------------------------------------- */
/* hero: tiles with physics                                          */
/* ---------------------------------------------------------------- */

const DEBRIS_COLORS = ["var(--orange)", "var(--orange)", "var(--tile-gray-ui)", "var(--fg)"];
let debrisLayer: HTMLDivElement | null = null;
let debrisCount = 0;

function throwDebris(x: number, y: number, n: number) {
  const g = gsap!;
  if (!debrisLayer || !debrisLayer.isConnected) {
    debrisLayer = document.createElement("div");
    debrisLayer.className = "debris";
    debrisLayer.setAttribute("aria-hidden", "true");
    document.body.appendChild(debrisLayer);
  }
  const count = Math.min(n, 140 - debrisCount);
  for (let i = 0; i < count; i++) {
    const bit = document.createElement("i");
    const s = g.utils.random(0.55, 1.5);
    bit.style.background = DEBRIS_COLORS[i % DEBRIS_COLORS.length];
    debrisLayer.appendChild(bit);
    debrisCount++;
    g.set(bit, { x, y, scale: s, rotation: g.utils.random(0, 360) });
    g.to(bit, {
      duration: g.utils.random(1.6, 2.6),
      physics2D: { velocity: g.utils.random(380, 1050), angle: g.utils.random(-160, -20), gravity: 1700 },
      rotation: `+=${g.utils.random(-900, 900)}`,
      onComplete: () => { bit.remove(); debrisCount--; },
    });
  }
}

function hero() {
  const g = gsap!;
  const section = document.querySelector<HTMLElement>("[data-hero]");
  if (!section) return;
  const svg = section.querySelector<SVGSVGElement>(".mark");
  const tiles = g.utils.toArray<SVGPolygonElement>(section.querySelectorAll("[data-tile]"));
  const groups = g.utils.toArray<SVGGElement>(section.querySelectorAll(".tile-g"));
  if (!svg || tiles.length !== 4) return;

  // intro: the four tiles fall into the logo, one after another, and squash on landing
  g.set(tiles, { transformOrigin: "50% 100%" });
  const intro = g.timeline({ delay: 0.25 });
  tiles.forEach((t, i) => {
    const at = i * 0.16;
    intro.fromTo(t, { y: -640, rotation: g.utils.random(-50, 50), opacity: 1 }, { y: 0, rotation: 0, duration: 1.25, ease: "tileBounce" }, at);
    intro.fromTo(t, { scaleX: 1, scaleY: 1 }, { scaleX: 1.22, scaleY: 0.78, duration: 1.25, ease: "tileSquash" }, at);
  });
  // the meta row scrambles in once the logo has landed
  section.querySelectorAll<HTMLElement>(".hero-meta dd").forEach((dd, i) => {
    if (i === 3) return; // the live clock is React's
    const text = dd.textContent || "";
    intro.to(dd, { duration: 0.9, scrambleText: { text, chars: "AHOS0123456789", speed: 0.6 } }, 1.0 + i * 0.12);
  });

  // a click anywhere in the hero throws tiles with real gravity
  on(section, "pointerdown", (e) => {
    const target = e.target as Element;
    if (target.closest("a, button, input, textarea")) return;
    const tile = target.closest<SVGPolygonElement>("[data-tile]");
    if (tile) { knock(tile, e.clientX); throwDebris(e.clientX, e.clientY, 8); return; }
    throwDebris(e.clientX, e.clientY, window.innerWidth < 700 ? 10 : 16);
  });

  // click a big tile: it gets knocked out of the logo, then drops back in
  function knock(tile: SVGPolygonElement, clientX: number) {
    if (tile.dataset.busy) return;
    tile.dataset.busy = "1";
    const box = tile.getBoundingClientRect();
    const left = clientX < box.left + box.width / 2;
    g.timeline({ onComplete: () => { delete tile.dataset.busy; } })
      .to(tile, {
        duration: 1.1,
        physics2D: { velocity: g.utils.random(260, 340), angle: left ? g.utils.random(-70, -50) : g.utils.random(-130, -110), gravity: 900 },
        rotation: left ? g.utils.random(120, 300) : g.utils.random(-300, -120),
        ease: "none",
      })
      .set(tile, { x: 0, y: -640, rotation: g.utils.random(-40, 40), scaleX: 1, scaleY: 1 }, "+=0.35")
      .to(tile, { y: 0, rotation: 0, duration: 1.2, ease: "tileBounce" })
      .to(tile, { scaleX: 1.22, scaleY: 0.78, duration: 1.2, ease: "tileSquash" }, "<");
  }

  // scroll: the logo comes apart as the hero leaves
  const scatter = [
    { x: -38, y: -52, rotation: -24 },
    { x: 56, y: -26, rotation: 22 },
    { x: 44, y: 64, rotation: 16 },
    { x: -54, y: 36, rotation: -18 },
  ];
  groups.forEach((grp, i) => {
    g.to(grp, { ...scatter[i], ease: "none", transformOrigin: "50% 50%", scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 } });
  });

  // the mark leans toward the pointer
  if (finePointer()) {
    const xTo = g.quickTo(svg, "x", { duration: 0.8, ease: "power3" });
    const yTo = g.quickTo(svg, "y", { duration: 0.8, ease: "power3" });
    const rTo = g.quickTo(svg, "rotation", { duration: 0.8, ease: "power3" });
    on(section, "pointermove", (e) => {
      const r = section.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      xTo(nx * 28); yTo(ny * 22); rTo(nx * 4);
    });
  }
}

/* ---------------------------------------------------------------- */
/* scroll reveals                                                    */
/* ---------------------------------------------------------------- */

function reveals() {
  const g = gsap!;

  // screenshots open out of a logo-tile parallelogram
  g.utils.toArray<HTMLElement>("[data-reveal-tile]").forEach((el) => {
    g.fromTo(el,
      { clipPath: "polygon(22% 0%, 100% 0%, 78% 100%, 0% 100%)" },
      { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", ease: "none", scrollTrigger: { trigger: el, start: "top 95%", end: "top 40%", scrub: 0.6 } });
  });

  g.utils.toArray<HTMLElement>("[data-float]").forEach((el) => {
    g.fromTo(el, { yPercent: 30 }, { yPercent: 2, ease: "none", scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom 40%", scrub: 0.8 } });
  });

  g.utils.toArray<SVGPathElement>("[data-draw]").forEach((path) => {
    const box = path.closest("section") || path;
    g.fromTo(path, { drawSVG: "0%" }, { drawSVG: "100%", ease: "none", scrollTrigger: { trigger: box, start: "top 70%", end: "bottom 75%", scrub: 0.6 } });
  });
}

/* ---------------------------------------------------------------- */
/* list rows: peek image follows the cursor, label scrambles         */
/* ---------------------------------------------------------------- */

function peeks() {
  const g = gsap!;
  const list = document.querySelector<HTMLElement>("[data-more]");
  if (!list) return;

  list.querySelectorAll<HTMLElement>(".more-row").forEach((row) => {
    const label = row.querySelector<HTMLElement>(".more-what");
    const text = label?.textContent || "";
    on(row, "pointerenter", () => { if (label) g.to(label, { duration: 0.6, scrambleText: { text, chars: "lowerCase", speed: 0.8 }, overwrite: true }); });
  });

  if (!finePointer() || window.innerWidth < 860) return;
  const peek = document.createElement("div");
  peek.className = "more-peek";
  peek.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.alt = "";
  peek.appendChild(img);
  document.body.appendChild(peek);
  cleanups.push(() => peek.remove());

  const xTo = g.quickTo(peek, "x", { duration: 0.5, ease: "power3" });
  const yTo = g.quickTo(peek, "y", { duration: 0.5, ease: "power3" });
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

  list.querySelectorAll<HTMLElement>(".more-row").forEach((row) => {
    const src = row.dataset.shot;
    on(row, "pointerenter", (e) => {
      if (!src) return;
      img.src = base + src;
      g.set(peek, { x: e.clientX + 24, y: e.clientY - 110 });
      g.to(peek, { autoAlpha: 1, scale: 1, rotation: -3, duration: 0.35, ease: "power3.out", overwrite: "auto" });
    });
    on(row, "pointermove", (e) => { xTo(e.clientX + 24); yTo(e.clientY - 110); });
    on(row, "pointerleave", () => { g.to(peek, { autoAlpha: 0, scale: 0.92, rotation: 0, duration: 0.25, overwrite: "auto" }); });
  });
}
