import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Close, PageHeader, Shot } from "../components/ui";
import { alsoBuilt, projects, site } from "../site.config";

export default function Work() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Work" }]}
        title="Case studies."
        lead={`Six live products, each with the story of how it was made. Over 50 shipped since ${site.founded}; these are the ones our clients are happy for us to show.`}
      />
      <section className="sec" aria-label="All case studies">
        <div className="wrap">
          <ul className="wgrid">
            {projects.map((p) => (
              <li key={p.id} className={p.flagship ? "wcard is-big" : "wcard"}>
                <Link href={p.caseStudy} className="wcard-link">
                  <div className="wcard-media"><Shot p={p} sizes={p.flagship ? "(max-width: 900px) 92vw, 46vw" : "(max-width: 900px) 92vw, 30vw"} /></div>
                  <div className="wcard-text">
                    <h2 className="wcard-name">{p.name}</h2>
                    <p className="wcard-what">{p.what}, {p.where}, {p.year}</p>
                    <p className="wcard-out">{p.outcome}</p>
                    <span className="lnk">Read the case study <Arrow /></span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="more-note">Also built by us: {alsoBuilt.map((a) => <a key={a.name} className="lnk" href={a.href} target="_blank" rel="noopener noreferrer">{a.name}</a>)}.</p>
        </div>
      </section>
      <Close where="work" />
    </>
  );
}
