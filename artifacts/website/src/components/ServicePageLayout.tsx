import { Link } from "wouter";
import { Footer } from "./Footer";
import { SEOHead, BreadcrumbSchema } from "../seo/SEOHead";
import { ServiceSchema } from "../seo/ServiceSchema";
import { PageHero, type Visual } from "./PageHero";
import { Voices, Closing, FaqBlock } from "./Blocks";
import { otherServices } from "../data/services";

export interface QA { q: string; a: string; }
export interface BuildItem { n: string; name: string; body: string; chips: string[]; popular?: boolean; }
export interface ServiceProof { name: string; text: string; quote?: string; author?: string; href: string; }

export interface ServicePageData {
  title: string;
  description: string;
  path: string;
  schemaName: string;
  schemaDesc: string;
  crumb: string;
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  lead: string;
  trust: [string, string][];
  intro: string;
  introAccent: string;
  buildEyebrow: string;
  buildHead: string;
  buildHeadAccent: string;
  build: BuildItem[];
  proof?: ServiceProof;
  ctaHead: string;
  ctaAccent: string;
  ctaLead: string;
  faqs: QA[];
}

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;

const PROMISES: [string, string][] = [
  ["Fixed price", "Quoted up front, in writing. No hourly meter."],
  ["You own it", "All of the code and IP, yours on delivery."],
  ["Built to perform", "Fast, accessible, and measured after launch."],
  ["30-day warranty", "We stay on after launch, free."],
];

// One film frame per service, so every page opens like the homepage.
const VISUALS: Record<string, Visual> = {
  "/web-development": "world",
  "/ecommerce-development": "live",
  "/mobile-app-development": "launch",
  "/custom-software": "build",
  "/ui-ux-design": "design",
  "/ai-development": "spark",
  "/web3": "world",
};
// Work renders for projects that have them.
const PROOF_IMG: Record<string, string> = {
  "/work/speealigner": "work/r-speealigner",
  "/work/ido-taxi": "work/r-idotaxi",
};

/** One template every service page renders, so the whole site is consistent by construction. */
export function ServicePageLayout(d: ServicePageData) {
  const proofImg = d.proof ? PROOF_IMG[d.proof.href] : undefined;
  return (
    <>
      <SEOHead title={d.title} description={d.description} path={d.path} />
      <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: d.crumb, url: d.path }]} />
      <ServiceSchema name={d.schemaName} description={d.schemaDesc} />

      <PageHero crumb={d.crumb} kicker={d.eyebrow} titleLead={d.titleLead} titleAccent={d.titleAccent} lead={d.lead} visual={VISUALS[d.path] ?? "live"}>
        <Link href="/contact" className="fh-btn">Start a project <span aria-hidden="true">↗</span></Link>
        <Link href="/pricing" className="fh-ghost">See pricing</Link>
        <ul className="sv-trust">
          {d.trust.map(([strong, rest]) => <li key={strong}><b>{strong}</b> {rest}</li>)}
        </ul>
      </PageHero>

      <section className="hm-sec sv-intro">
        <div className="hm-wrap">
          <p className="st-statement sv-intro-tx">{d.intro} <em>{d.introAccent}</em></p>
        </div>
      </section>

      <section className="hm-sec" aria-labelledby="sv-build">
        <div className="hm-wrap">
          <header className="hm-head">
            <p className="hm-kicker"><span className="hm-rule" />{d.buildEyebrow}</p>
            <h2 id="sv-build" className="hm-h2">{d.buildHead} <em>{d.buildHeadAccent}</em></h2>
          </header>
          <div className="sv-list">
            {d.build.map((s) => (
              <article className="sv-item" key={s.n}>
                <span className="sv-n">{s.n}</span>
                <div>
                  <h3 className="sv-name">{s.name}{s.popular && <span className="sv-pop">Most requested</span>}</h3>
                  <p className="sv-desc">{s.body}</p>
                  <ul className="sv-chips">{s.chips.map((c) => <li key={c}>{c}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hm-sec sv-promise" aria-label="What every project includes">
        <div className="hm-wrap">
          <dl className="sv-promise-grid">
            {PROMISES.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
      </section>

      {d.proof && (
        <section className="hm-sec" aria-labelledby="sv-proof">
          <div className="hm-wrap">
            <p className="hm-kicker"><span className="hm-rule" />Recently shipped</p>
            <Link href={d.proof.href} className={`wk-inner sv-proof${proofImg ? "" : " no-img"}`}>
              {proofImg && (
                <div className="wk-media">
                  <img src={asset(`${proofImg}.webp`)} srcSet={`${asset(`${proofImg}-800.webp`)} 800w, ${asset(`${proofImg}.webp`)} 1600w`} sizes="(max-width: 900px) 100vw, 1200px" alt={`${d.proof.name}, designed and built by AHOS`} loading="lazy" width={1600} height={1000} />
                </div>
              )}
              <div className="wk-meta">
                <h2 id="sv-proof" className="wk-name">{d.proof.name}</h2>
                <p className="wk-line">{d.proof.text}</p>
                {d.proof.quote && <blockquote className="sv-quote">"{d.proof.quote}"<footer>{d.proof.author}</footer></blockquote>}
                <span className="wk-cta">See the work <span aria-hidden="true">→</span></span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <FaqBlock items={d.faqs} title="Common" accent="questions." />

      <section className="hm-sec bd" aria-labelledby="sv-more">
        <div className="hm-wrap">
          <header className="hm-head">
            <p className="hm-kicker"><span className="hm-rule" />Explore more</p>
            <h2 id="sv-more" className="hm-h2">Other things <em>we build.</em></h2>
          </header>
          <ul className="sv-more">
            {otherServices(d.path).map((s) => (
              <li key={s.href}><Link href={s.href}><b>{s.label}</b><span>{s.blurb}</span><i aria-hidden="true">→</i></Link></li>
            ))}
          </ul>
        </div>
      </section>

      <Voices />
      <Closing head={d.ctaHead} accent={d.ctaAccent} lead={d.ctaLead} where={`service_${d.path}`} />
      <Footer />
    </>
  );
}
