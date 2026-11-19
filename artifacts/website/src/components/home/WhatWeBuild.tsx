import { Link } from "wouter";
import { Arrow } from "../Arrow";
import { services } from "../../site.config";

/**
 * Everything we make, as one list a visitor can read in ten seconds: the name, one line on what it is,
 * the usual time. Each row is a link to the full page for that service.
 */
export function WhatWeBuild() {
  return (
    <section id="services" className="sec" aria-labelledby="svc-title">
      <div className="wrap">
        <h2 id="svc-title" className="d d-5">What we build.</h2>
        <ul className="svc-list">
          {services.map((s) => (
            <li key={s.slug}>
              <Link href={s.href} className="svc-row">
                <span className="svc-n">{s.label}</span>
                <span className="svc-b">{s.blurb}</span>
                <span className="svc-p">{s.timeline}</span>
                <span className="svc-a" aria-hidden="true"><Arrow /></span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="svc-note">Every project gets a fixed quote in writing after a free call.</p>
      </div>
    </section>
  );
}
