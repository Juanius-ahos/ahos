import { useState } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { MotionConfig, motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { HeroCanvas } from "@/components/HeroCanvas";
import { SmartCTA } from "@/components/SmartCTA";
import { AriaWidget } from "@/components/AriaWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { CornerGlow } from "@/components/CornerGlow";
import { Loader } from "@/components/Loader";
import { OrganizationSchema } from "@/seo/SEOHead";
import Home from "@/pages/Home";
import CaseStudy from "@/pages/CaseStudy";
import Services from "@/pages/Services";
import Web3 from "@/pages/Web3";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import AriaAI from "@/pages/AriaAI";
import FAQ from "@/pages/FAQ";
import WebDevelopment from "@/pages/WebDevelopment";
import MobileDev from "@/pages/MobileDev";
import CustomSoftware from "@/pages/CustomSoftware";
import AIDevelopment from "@/pages/AIDevelopment";
import Ecommerce from "@/pages/Ecommerce";
import UIDesign from "@/pages/UIDesign";

function NotFound() {
  return (
    <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "120px 24px", fontFamily: "var(--font-sans)" }}>
      <h1 style={{ fontSize: 48, color: "var(--orange)", marginBottom: 12 }}>404</h1>
      <p style={{ marginBottom: 24 }}>Page not found</p>
      <a href="/" style={{ color: "var(--orange)", fontWeight: 600 }}>Go home →</a>
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  return (
    <motion.div
      key={location}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <main id="main-content" style={{ paddingTop: 64 }}>
        <Switch>
          <Route path="/"><ErrorBoundary><Home /></ErrorBoundary></Route>
          <Route path="/work/:slug"><ErrorBoundary><CaseStudy /></ErrorBoundary></Route>
          <Route path="/services"><ErrorBoundary><Services /></ErrorBoundary></Route>
          <Route path="/web3"><ErrorBoundary><Web3 /></ErrorBoundary></Route>
          <Route path="/careers"><ErrorBoundary><Careers /></ErrorBoundary></Route>
          <Route path="/contact"><ErrorBoundary><Contact /></ErrorBoundary></Route>
          <Route path="/aria-ai"><ErrorBoundary><AriaAI /></ErrorBoundary></Route>
          <Route path="/faq"><ErrorBoundary><FAQ /></ErrorBoundary></Route>
          <Route path="/web-development"><ErrorBoundary><WebDevelopment /></ErrorBoundary></Route>
          <Route path="/mobile-app-development"><ErrorBoundary><MobileDev /></ErrorBoundary></Route>
          <Route path="/custom-software"><ErrorBoundary><CustomSoftware /></ErrorBoundary></Route>
          <Route path="/ai-development"><ErrorBoundary><AIDevelopment /></ErrorBoundary></Route>
          <Route path="/ecommerce-development"><ErrorBoundary><Ecommerce /></ErrorBoundary></Route>
          <Route path="/ui-ux-design"><ErrorBoundary><UIDesign /></ErrorBoundary></Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </motion.div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Loader onComplete={() => setLoaded(true)} />
        <HeroCanvas />
        <CornerGlow />
        <svg className="grain" aria-hidden="true" preserveAspectRatio="none">
          <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
          <rect width="100%" height="100%" filter="url(#grain)"/>
        </svg>
        <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease" }}>
          <OrganizationSchema />
          <a href="#main-content" className="skip-link">Skip to content</a>
          <div className="vlines">
            <div className="vl"></div><div className="vl"></div><div className="vl"></div>
          </div>
          <SmoothScroll />
          <Cursor />
          <ScrollProgress />
          <Nav />
          <Router />
          <SmartCTA />
          <AriaWidget />
        </div>
      </WouterRouter>
    </MotionConfig>
  );
}
