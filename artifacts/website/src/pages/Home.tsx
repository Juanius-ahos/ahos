import { Hero } from "../components/home/Hero";
import { WhatWeBuild } from "../components/home/WhatWeBuild";
import { Close } from "../components/ui";
import { ProofBar, SectionHeader } from "../components/kit";
import { ProcessLine, Testimonials } from "../components/sections";
import { caseStudies, clientReviews } from "../site.config";

/**
 * Homepage. One job: say what we do, show it, and get the right people to message us.
 * Five short screens: the hero with the work running under it, the proof, what we build with prices,
 * how a project goes, what clients say, and the message box. Everything longer (the case studies, the
 * founder, the lab, the free check, the questions) has its own page and is one click away.
 */
export default function Home() {
  const quotes = [...clientReviews, ...caseStudies.flatMap((c) => (c.quote ? [c.quote] : []))].slice(0, 2);

  return (
    <>
      <Hero />
      <div className="wrap"><ProofBar /></div>
      <WhatWeBuild />
      <section id="how" className="sec alt" aria-labelledby="how-title">
        <div className="wrap">
          <SectionHeader id="how-title" title="Five steps, the same every time." />
          <ProcessLine />
        </div>
      </section>
      <Testimonials items={quotes} />
      <Close where="home" />
    </>
  );
}
