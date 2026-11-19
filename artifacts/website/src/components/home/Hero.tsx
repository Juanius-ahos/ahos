import { Link } from "wouter";
import { Arrow } from "../Arrow";
import { Backdrop } from "../backdrop/Backdrop";
import { WhatsAppCta } from "../kit";
import { services, site } from "../../site.config";

/**
 * The first screen: what we are, in plain words, and one way to start. No pictures, so nothing competes with
 * the sentence. The glyph field fills the screen behind it and answers the mouse. Every claim here is already
 * stated elsewhere on the site (the studio, the places we work, a fixed written quote, you own the code).
 */
export function Hero() {
  return (
    <section className="hero3 bg-host fx-host fx-dark" aria-labelledby="hero-title">
      <Backdrop kind="glyph" strong />
      <div className="wrap">
        <h1 id="hero-title" className="hero3-h1">One team designs and builds your website, store, app or AI.</h1>
        <p className="lead hero3-lead">AHOS is a design and engineering studio in Beirut, working with businesses in {site.areasLine}. A fixed quote in writing, and you own what we build.</p>
        <ul className="hero3-svc" aria-label="What we build">
          {services.map((s) => <li key={s.slug}><Link href={s.href}>{s.short}</Link></li>)}
        </ul>
        <div className="hero3-act">
          <WhatsAppCta where="hero" size="lg" />
          <a href="#work" className="lnk">See our work <Arrow /></a>
        </div>
      </div>
    </section>
  );
}
