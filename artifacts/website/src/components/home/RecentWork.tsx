import { Link } from "wouter";
import { Arrow } from "../Arrow";
import { asset, projectById } from "../../site.config";

/**
 * Four of our live sites, plain: the picture, the name and what it is. Each is a link to its case study.
 * The hero carries no pictures, so this is the first place a visitor sees the work.
 */
const IDS = ["issam", "threads", "speealigner", "julsauto"];

export function RecentWork() {
  const items = IDS.map((id) => projectById(id));
  return (
    <section id="work" className="sec" aria-labelledby="work-title">
      <div className="wrap">
        <header className="rw-head">
          <h2 id="work-title" className="d d-5">Recent work.</h2>
          <Link href="/work" className="lnk">All our work <Arrow /></Link>
        </header>
        <ul className="rw-grid">
          {items.map((p) => (
            <li key={p.id}>
              <Link href={p.caseStudy} className="rw-card" aria-label={`${p.name}, ${p.what.toLowerCase()}. View the case study`}>
                <span className="rw-img">
                  <img
                    src={asset(`/work/d-${p.shot}-880.webp`)}
                    srcSet={`${asset(`/work/h-${p.shot}-640.webp`)} 640w, ${asset(`/work/d-${p.shot}-880.webp`)} 880w`}
                    sizes="(max-width: 720px) 92vw, 46vw"
                    width={880}
                    height={550}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="rw-meta"><b>{p.name}</b><span>{p.what}, {p.where}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
