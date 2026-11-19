import { Defer } from "../components/Defer";
import { useState } from "react";
import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Close, PageHeader, Hl } from "../components/ui";
import { CountUp } from "../components/kit";
import { alsoBuilt, asset, projects, site } from "../site.config";

/**
 * The work index: one panel per case study. On a wide screen the panel under the pointer (or the
 * keyboard focus) opens and the others fold to a thin strip; on a phone they are plain stacked cards.
 */
function WorkAccordion() {
  const [on, setOn] = useState(0);
  return (
    <ul className="wacc" role="list">
      {projects.map((p, i) => (
        <li key={p.id} className={`wacc-item${on === i ? " is-on" : ""}`} onMouseEnter={() => setOn(i)}>
          <Link href={p.caseStudy} className="wacc-link" onFocus={() => setOn(i)}>
            {p.shot ? (
              <span className="wacc-img">
                <img
                  src={asset(`/work/d-${p.shot}-880.webp`)}
                  srcSet={`${asset(`/work/d-${p.shot}-880.webp`)} 880w, ${asset(`/work/d-${p.shot}.webp`)} 1440w`}
                  sizes="(max-width: 900px) 92vw, 62vw"
                  width={1440}
                  height={900}
                  alt=""
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              </span>
            ) : (
              <span className="wacc-poster" aria-hidden="true">{p.name}</span>
            )}
            <span className="wacc-shade" aria-hidden="true" />
            <span className="wacc-no" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="wacc-vert" aria-hidden="true">{p.name}</span>
            <span className="wacc-open">
              <span className="wacc-name">{p.name}</span>
              <span className="wacc-what">{p.what}, {p.where}, {p.year}</span>
              <span className="wacc-out">{p.outcome}</span>
              <span className="wacc-cta">Read the case study <Arrow /></span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Work() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Work" }]}
        title={<>Work you can <Hl>click</Hl>.</>}
        lead={`Six live products, each with the story of how it was made. More than 100 delivered since ${site.founded}; these are the ones our clients are happy for us to show.`}
        bg="glyph"
      />
      <section className="sec" aria-label="All case studies">
        <div className="wrap">
          <WorkAccordion />
          <ul className="band" style={{ marginTop: "clamp(56px, 7vw, 96px)" }} aria-label="In numbers">
            <li><b><CountUp text="100+" /></b><span>projects delivered</span></li>
            <li><b><CountUp text="6" /></b><span>case studies, every one live</span></li>
            <li><b><CountUp text="4" /></b><span>regions: Lebanon, the US, Europe and Oman</span></li>
            <li><b><CountUp text="30" /></b><span>days of free fixes after every launch</span></li>
          </ul>
          <p className="more-note">Also built by us: {alsoBuilt.map((a) => <a key={a.name} className="lnk" href={a.href} target="_blank" rel="noopener noreferrer">{a.name}</a>)}.</p>
        </div>
      </section>
      <Defer>
        <Close where="work" />
      </Defer>
    </>
  );
}
