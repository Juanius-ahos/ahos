import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Lab } from "../components/sections";
import { Close, PageHeader, WhatsAppIcon, Hl } from "../components/ui";
import { site } from "../site.config";
import { trackEvent } from "../lib/analytics";

export default function LabPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Lab" }]}
        title={<>Motion and 3D, <Hl>made in house</Hl>.</>}
        lead="The reels we make for ourselves. Same team, same tools we use on your site."
        bg="warp"
      />
      <Lab bare />
      <section className="sec alt" aria-labelledby="lab-cta">
        <div className="wrap">
          <h2 id="lab-cta" className="d d-5">Want something like this for your brand?</h2>
          <p className="lead" style={{ marginTop: 22 }}>A launch reel, a 3D moment on your homepage, an ad that moves. Tell us what you are launching and we will say what we would make.</p>
          <div className="acts">
            <a href={site.contact.whatsappHello} className="btn btn-wa btn-lg" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { where: "lab_page" })}><WhatsAppIcon /> Message us on WhatsApp</a>
            <Link href="/contact" className="lnk">Or write to us <Arrow /></Link>
          </div>
        </div>
      </section>
      <Close where="lab" />
    </>
  );
}
