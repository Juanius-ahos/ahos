/**
 * Motion layer. Loaded right after hydration, never blocking first paint.
 * Every page renders complete without it; motion only enhances what is there.
 *
 * Kept deliberately quiet: the four tiles of the AHOS "O" land once on load,
 * headlines rise in, screenshots open as they scroll into view. Nothing to
 * wait for, nothing in the way of reading or getting in touch.
 *
 * Hooks, all by data attribute:
 *   [data-hero]          hero section: the logo tiles land once
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
    const [{ gsap: g }, { ScrollTrigger: st }, { SplitText: split }, { ScrambleTextPlugin }, { DrawSVGPlugin }, { CustomEase }, { CustomBounce }, { default: Lenis }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/SplitText"),
      import("gsap/ScrambleTextPlugin"),
      import("gsap/DrawSVGPlugin"),
      import("gsap/CustomEase"),
      import("gsap/CustomBounce"),
      import("lenis"),
    ]);
    gsap = g;
    ScrollTrigger = st;
    SplitText = split;
    gsap.registerPlugin(st, split, ScrambleTextPlugin, DrawSVGPlugin, CustomEase, CustomBounce);
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
        autoSplit: true,
        onSplit(self) {
          return g.from(self.lines, { yPercent: 115, duration: 1.1, ease: "expo.out", stagger: 0.08, delay: intro ? 0.1 : 0.05 });
        },
      });
    });
  });
}

/* ---------------------------------------------------------------- */
/* hero: the four logo tiles land once on load, quietly              */
/* ---------------------------------------------------------------- */

function hero() {
  const g = gsap!;
  const section = document.querySelector<HTMLElement>("[data-hero]");
  if (!section) return;
  const tiles = g.utils.toArray<SVGPolygonElement>(section.querySelectorAll("[data-tile]"));
  if (tiles.length !== 4) return;
  g.set(tiles, { transformOrigin: "50% 100%" });
  const tl = g.timeline({ delay: 0.2 });
  tiles.forEach((t, i) => {
    tl.fromTo(t, { y: -120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "tileBounce" }, i * 0.1);
    tl.fromTo(t, { scaleX: 1, scaleY: 1 }, { scaleX: 1.08, scaleY: 0.92, duration: 0.9, ease: "tileSquash" }, i * 0.1);
  });
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
