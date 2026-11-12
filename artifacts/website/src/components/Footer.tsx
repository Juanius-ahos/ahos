import { Link } from "wouter";
import { Logo } from "./Mark";
import { projects, services, site } from "../site.config";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <p className="foot-line">A design and engineering studio in Beirut. One team designs and builds websites, apps, AI and Web3 for businesses in {site.areasLine}.</p>
          <div>
            <h2>Studio</h2>
            <ul>
              <li><Link href="/work">Work</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/aria-ai">ARIA</Link></li>
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
            <h2>Case studies</h2>
            <ul>{projects.map((p) => <li key={p.id}><Link href={p.caseStudy}>{p.name}</Link></li>)}</ul>
          </div>
          <div>
            <h2>Reach us</h2>
            <ul>
              <li><a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp {site.contact.phone}</a></li>
              <li><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
              {site.socials.map((s) => <li key={s.href}><a href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
            </ul>
          </div>
        </div>
        <Logo className="foot-logo" title={`${site.name}, ${site.legalName}`} />
        <div className="foot-bot">
          <span>&copy; {new Date().getFullYear()} {site.name}, {site.legalName}</span>
          <span>Designed and built in Beirut</span>
          <a href="#top" className="lnk">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
