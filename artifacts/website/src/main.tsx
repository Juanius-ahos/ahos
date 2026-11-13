import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { BASE, site } from "./site.config";
import { retryPendingLeads } from "./lib/aria";
import "./styles/app.css";
import "./styles/kit.css";
import "./styles/sections.css";

const root = document.getElementById("root")!;
const path = window.location.pathname.slice(BASE.length).replace(/\/+$/, "") || "/";
if (root.hasChildNodes()) hydrateRoot(root, <App ssrPath={path} />);
else createRoot(root).render(<App />);

/** Work that never belongs on the critical path: analytics, motion, retrying queued leads. */
function later(fn: () => void) {
  const run = () => ("requestIdleCallback" in window ? (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(fn) : setTimeout(fn, 200));
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
}

// Motion starts once React has hydrated, because it rewrites headlines and React must see the HTML it
// rendered. A page whose first screen has a headline intro starts it straight away. A page with no
// scripted motion at all (the homepage) never loads GSAP: smooth scrolling runs on Lenis alone, once
// the browser has settled, so the first paint and the first taps are never in its way.
const HOOKS = "[data-split],[data-reveal-tile],[data-float],[data-draw],[data-more],[data-hero]";
const scripted = !!document.querySelector(HOOKS);
const needsIntro = !!document.querySelector("[data-split]");
const hydrated = new Promise<void>((resolve) => window.addEventListener("ahos:hydrated", () => resolve(), { once: true }));
const settled = () => new Promise<void>((resolve) => {
  if (needsIntro) return resolve();
  const go = () => window.setTimeout(resolve, 1500);
  if (document.readyState === "complete") go();
  else window.addEventListener("load", go, { once: true });
});
if (scripted) {
  hydrated.then(settled).then(() => import("./motion/motion")).then((m) => m.startMotion()).catch(() => document.documentElement.classList.remove("js-intro"));
} else {
  document.documentElement.classList.remove("js-intro");
  hydrated.then(settled).then(() => import("./motion/lenis")).then((m) => m.startLenis()).catch(() => {});
}
// sections hydrated later (see Defer) get their motion hooks re-read
window.addEventListener("ahos:refresh", () => { if (scripted) import("./motion/motion").then((m) => m.refreshMotion()).catch(() => {}); });
import("./motion/magnetic").then((m) => m.startMagnetic()).catch(() => {});

// GA4 waits for the first interaction, or twelve seconds, whichever comes first.
function loadGa() {
  // the preview build (served under a base path) never reports to the production property
  if (window.gtag || !site.integrations.ga4 || BASE) return;
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  const gtag = function () { w.dataLayer!.push(arguments); } as (...args: unknown[]) => void;
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", site.integrations.ga4);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${site.integrations.ga4}`;
  document.head.appendChild(s);
}
const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
const onFirst = () => { events.forEach((e) => window.removeEventListener(e, onFirst)); loadGa(); };
events.forEach((e) => window.addEventListener(e, onFirst, { once: true, passive: true }));
later(() => setTimeout(loadGa, 12000));
