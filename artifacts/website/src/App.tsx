import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { MotionConfig } from "framer-motion";
import { Nav } from "@/components/Nav";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Curtain } from "@/components/Curtain";
import { OrganizationSchema } from "@/seo/SEOHead";
import { retryPendingLeads } from "@/lib/aria";
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
import Pricing from "@/pages/Pricing";

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
  useEffect(() => { window.scrollTo(0, 0); }, [location]);

  return (
    <div key={location}>
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
          <Route path="/pricing"><ErrorBoundary><Pricing /></ErrorBoundary></Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

export default function App() {
  const loaded = true;
  useEffect(() => { retryPendingLeads(); }, []);

  return (
    <MotionConfig reducedMotion="user">
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease" }}>
          <OrganizationSchema />
          <a href="#main-content" className="skip-link">Skip to content</a>
          <SmoothScroll />
          <Nav />
          <Router />
          <Curtain />
        </div>
      </WouterRouter>
    </MotionConfig>
  );
}
