import { Link } from "wouter";
import { Arrow } from "./Arrow";
import { asset, services, site } from "../site.config";

export function Footer() {
  return (
    <footer className="sec foot tone-ink">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <img src={asset(site.logo)} alt={site.name} width={112} height={37} loading="lazy" />
            <p>A digital product studio in Beirut. We design and build websites, apps and software for founders in {site.areasLine}.</p>
            <Link href="/contact" className="btn">Start a project <Arrow /></Link>
          </div>
          <div>
            <h2>Studio</h2>
            <ul>
              <li><a href={asset("/#work")}>Work</a></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2>Services</h2>
            <ul>{services.map((s) => <li key={s.href}><Link href={s.href}>{s.label}</Link></li>)}</ul>
          </div>
          <div>
            <h2>Connect</h2>
            <ul>
              <li><a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
              {site.socials.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="foot-bot">
          <span>&copy; {new Date().getFullYear()} {site.name}, {site.legalName}</span>
          <span>Drawn and built in Beirut</span>
        </div>
      </div>
    </footer>
  );
}
