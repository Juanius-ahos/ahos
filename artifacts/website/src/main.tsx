import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { BASE, site } from "./site.config";
import { retryPendingLeads } from "./lib/aria";
import "./styles/app.css";

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

// Motion starts straight away (it is async and never blocks paint): the hero intro waits for it.
import("./motion/motion").then((m) => m.startMotion()).catch(() => document.documentElement.classList.remove("js-intro"));
later(() => retryPendingLeads());

// GA4 waits for the first interaction, or five seconds, whichever comes first.
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
later(() => setTimeout(loadGa, 5000));
