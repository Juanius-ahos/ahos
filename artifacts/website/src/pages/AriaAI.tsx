import { useEffect } from "react";
import { HtmlBlock } from "../components/HtmlBlock";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { pageBlocks } from "../data/aria";
import { Reveal } from "../components/motion";

export default function AriaAI() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEOHead
        title="ARIA — Your AI Project Advisor"
        description="Chat with ARIA, the AHOS AI project advisor. Describe what you want to build and get instant, honest guidance — scope, timeline, and next steps."
        path="/aria-ai"
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "ARIA AI", url: "/aria-ai" }]} />

      <style>{css}</style>
      <div className="ed-bg" aria-hidden="true" />

      <header className="ed ed-page-hero ar-hero">
        <Reveal className="ed-label" y={12}>
          <span className="ed-label-n">05</span><span className="ed-label-line" /><span className="ed-label-text">AHOS AI</span>
        </Reveal>
        <Reveal delay={80}><h1 className="ed-h1">Meet <em>ARIA.</em></h1></Reveal>
        <Reveal delay={160}>
          <p className="ed-lead">
            Our AI project advisor. Tell her what you're thinking of building and she'll talk you
            through scope, rough timelines, and the smart next step — no form, no sales pitch.
          </p>
        </Reveal>
        <Reveal delay={220} className="ar-note">
          <span className="ar-live"><span className="ar-live-dot" /> Online now</span>
          <span>Powered by AHOS · answers in seconds</span>
        </Reveal>
      </header>

      <section className="ed ed-sec ar-sec">
        <Reveal className="ar-stage">
          {pageBlocks.map((block, i) => (
            <HtmlBlock key={i} html={block} />
          ))}
        </Reveal>
      </section>

      <Footer />
    </>
  );
}

const css = `
.ar-hero { text-align: center; display: flex; flex-direction: column; align-items: center; }
.ar-hero .ed-lead { margin: 0 auto; }
.ar-note { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; justify-content: center; margin-top: 28px; font-size: 13px; color: var(--text-dim); }
.ar-live { display: inline-flex; align-items: center; gap: 8px; color: var(--text-muted); }
.ar-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #46d27e; box-shadow: 0 0 0 0 rgba(70,210,126,0.5); animation: ar-pulse 2.2s infinite; }
@keyframes ar-pulse { 0%{box-shadow:0 0 0 0 rgba(70,210,126,0.5);} 70%{box-shadow:0 0 0 8px rgba(70,210,126,0);} 100%{box-shadow:0 0 0 0 rgba(70,210,126,0);} }
.ar-sec { padding-top: clamp(8px, 2vw, 24px); border-top: none; }
.ar-stage { max-width: 680px; margin: 0 auto; }
`;
