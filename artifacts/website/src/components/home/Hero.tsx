import { Link } from "wouter";
import { Marquee } from "@/components/corsair/marquee";
import { Arrow } from "../Arrow";
import { Backdrop } from "../backdrop/Backdrop";
import { WhatsAppCta } from "../kit";
import { asset, projectById } from "../../site.config";

/**
 * The first screen. The headline is set as large as the page allows and its full stops are the AHOS
 * tile (the slanted block of the logo's O). Under it, the work itself, with no browser-window chrome:
 * each site is cut to the logo's own geometry (45 degree corners, like the slabs of the O) and the tiles
 * run edge to edge, so their diagonals line up like the tiles of the mark. The loop is the real Marquee
 * from Corsair UI (https://21st.dev/@kevingirelli): it pauses on hover and off screen, can be dragged,
 * and becomes a scroll box for reduced motion. Every tile links to its case study.
 */
const REEL = ["issam", "threads", "speealigner", "julsauto", "tavern"];

const Stop = () => <span className="hero3-stop">.</span>;

export function Hero() {
  const items = REEL.map((id) => projectById(id));
  return (
    <section className="hero3 bg-host fx-host fx-dark" aria-labelledby="hero-title">
      <Backdrop kind="glyph" />
      <div className="wrap">
        <h1 id="hero-title" className="hero3-h1">
          <span className="hero3-l">Design that sells<Stop /></span>{" "}
          <span className="hero3-l">Code that holds<Stop /></span>
        </h1>
        <div className="hero3-row">
          <p className="lead hero3-lead">A design and engineering studio in Beirut. Websites, online stores, bots and AI for businesses that want to look as good as they are.</p>
          <div className="hero3-act">
            <WhatsAppCta where="hero" size="lg" />
            <Link href="/work" className="lnk">See all our work <Arrow /></Link>
          </div>
        </div>
      </div>
      <div className="hero3-reel" id="work">
        <Marquee duration={80} gap="clamp(10px, 1.2vw, 18px)" pauseOnHover draggable fade fadeAmount={5} repeat={2} label="Selected work">
          {items.map((p, i) => (
            <Link key={p.id} href={p.caseStudy} className="reel-i" aria-label={`${p.name}, ${p.what.toLowerCase()}. View the case study`}>
              <span className="reel-t">
                <img
                  src={asset(`/work/h-${p.shot}-640.webp`)}
                  srcSet={`${asset(`/work/h-${p.shot}-640.webp`)} 640w, ${asset(`/work/d-${p.shot}-880.webp`)} 880w`}
                  sizes="(max-width: 720px) 300px, 36vw"
                  width={640}
                  height={400}
                  alt=""
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                />
                <span className="reel-go" aria-hidden="true">View case study <Arrow /></span>
              </span>
              <span className="reel-c"><b>{p.name}</b><span>{p.what}, {p.where}</span></span>
            </Link>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
