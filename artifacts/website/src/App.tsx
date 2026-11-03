import { useEffect, useRef } from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServicePage from "./pages/Service";
import CaseStudy from "./pages/CaseStudy";
import Pricing from "./pages/Pricing";
import FAQ from "./pages/Faq";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import AriaAI from "./pages/AriaAI";
import NotFound from "./pages/NotFound";
import { BASE, caseStudies, routeFor, services, site } from "./site.config";

/** Keeps title, description and canonical right after client-side navigation. */
function HeadSync() {
  const [loc] = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const r = routeFor(loc);
    if (r) {
      document.title = r.title;
      document.querySelector('meta[name="description"]')?.setAttribute("content", r.description);
      document.querySelector('link[rel="canonical"]')?.setAttribute("href", `${site.url}${r.path === "/" ? "/" : r.path + "/"}`);
    }
    if (!location.hash) window.scrollTo(0, 0);
    import("./motion/motion").then((m) => m.rebindMotion()).catch(() => {});
    window.gtag?.("event", "page_view", { page_path: loc });
  }, [loc]);
  return null;
}

function Routes() {
  return (
    <Switch>
      <Route path="/"><Home /></Route>
      <Route path="/services"><Services /></Route>
      {services.map((s) => <Route key={s.href} path={s.href}><ServicePage s={s} /></Route>)}
      {caseStudies.map((c) => <Route key={c.slug} path={`/work/${c.slug}`}><CaseStudy c={c} /></Route>)}
      <Route path="/pricing"><Pricing /></Route>
      <Route path="/faq"><FAQ /></Route>
      <Route path="/contact"><Contact /></Route>
      <Route path="/careers"><Careers /></Route>
      <Route path="/aria-ai"><AriaAI /></Route>
      <Route><NotFound /></Route>
    </Switch>
  );
}

export default function App({ ssrPath }: { ssrPath?: string }) {
  return (
    <Router base={BASE} ssrPath={ssrPath ? `${BASE}${ssrPath}` : undefined}>
      <a href="#main" className="skip">Skip to content</a>
      <Nav />
      <main id="main">
        <Routes />
      </main>
      <Footer />
      <HeadSync />
    </Router>
  );
}
