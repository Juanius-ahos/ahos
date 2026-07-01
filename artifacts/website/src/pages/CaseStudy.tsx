import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { Footer } from "../components/Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { Reveal } from "../components/motion";
import { caseStudyBySlug } from "../data/caseStudies";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const study = slug ? caseStudyBySlug(slug) : undefined;

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!study) {
    return (
      <>
        <SEOHead title="Case study not found" description="This case study doesn't exist." path="/work" noindex />
        <div className="ed ed-page-hero" style={{ textAlign: "center" }}>
          <h1 className="ed-h1">Not found.</h1>
          <Link href="/" className="ed-link-arrow">Back home →</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={`${study.name} — Case Study`}
        description={`How AHOS built ${study.name}: a ${study.category.toLowerCase()} project, in the client's own words.`}
        path={`/work/${study.slug}`}
      />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "Work", url: "/" }, { name: study.name, url: `/work/${study.slug}` }]} />

      <style>{css}</style>

      <header className="ed ed-page-hero cs-hero">
        <Reveal className="ed-label" y={12}>
          <span className="ed-label-n">Case study</span><span className="ed-label-line" /><span className="ed-label-text">{study.category}</span>
        </Reveal>
        <Reveal delay={80}><h1 className="ed-h1">{study.name}</h1></Reveal>
        <Reveal delay={160} className="cs-meta">
          <span className="ed-cap">{study.year}</span>
          <a href={study.url} target="_blank" rel="noopener noreferrer" className="ed-link-arrow">Visit live site →</a>
        </Reveal>
      </header>

      <Reveal className="ed cs-shot-wrap">
        <img src={asset(study.img)} alt={`${study.name} — ${study.category}, built by AHOS`} className="cs-shot" width={1280} height={860} loading="lazy" decoding="async" />
      </Reveal>

      <section className="ed ed-sec cs-body">
        <div className="cs-grid">
          <div>
            <div className="ed-cap" style={{ marginBottom: 12 }}>What we built</div>
            <div className="cs-chips">
              {study.services.map((s) => <span key={s}>{s}</span>)}
            </div>
          </div>
          <blockquote className="cs-quote">
            <p>&ldquo;{study.testimonial.text}&rdquo;</p>
            <footer>
              <span className="cs-quote-name">{study.testimonial.name}</span>
              <span className="cs-quote-role">{study.testimonial.role}</span>
              {study.testimonial.link && (
                <a href={study.testimonial.link} target="_blank" rel="noopener noreferrer" className="cs-quote-link">Verified on Trustpilot ↗</a>
              )}
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="ed ed-sec" style={{ borderTop: "1px solid var(--border-soft)", textAlign: "center" }}>
        <div className="ed-label" style={{ justifyContent: "center" }}><span className="ed-label-n">+</span><span className="ed-label-line" /><span className="ed-label-text">Building something similar?</span></div>
        <h2 className="ed-h2">Let's build yours next.</h2>
        <div style={{ marginTop: 24 }}>
          <Link href="/contact" className="ed-btn ed-btn-lg">Start a project<span>↗</span></Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

const css = `
.cs-meta { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; margin-top: 8px; }
.cs-shot-wrap { margin-bottom: clamp(40px, 6vw, 72px); }
.cs-shot { width: 100%; height: auto; border-radius: var(--radius-xl); border: 1px solid var(--border-soft); display: block; }
.cs-grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(32px, 5vw, 64px); align-items: start; }
.cs-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.cs-chips span { padding: 7px 14px; border-radius: 8px; background: var(--bg-card); border: 1px solid var(--border); color: var(--text-muted); font-size: 12.5px; font-weight: 600; }
.cs-quote { border-left: 2px solid var(--orange); padding-left: clamp(20px, 3vw, 32px); margin: 0; }
.cs-quote p { font-family: var(--font-display); font-size: clamp(20px, 2.6vw, 30px); line-height: 1.4; letter-spacing: -0.01em; color: var(--text); margin-bottom: 20px; }
.cs-quote footer { display: flex; flex-wrap: wrap; align-items: baseline; gap: 12px; }
.cs-quote-name { font-weight: 700; color: var(--text); }
.cs-quote-role { color: var(--text-dim); font-size: 14px; }
.cs-quote-link { color: var(--orange); font-size: 13px; font-weight: 600; }

@media (max-width: 760px) {
  .cs-grid { grid-template-columns: 1fr; }
}
`;
