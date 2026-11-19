import { Defer } from "../components/Defer";
import { Spotlight } from "@/components/corsair/spotlight";
import { Link } from "wouter";
import { Arrow } from "../components/Arrow";
import { Icon } from "../components/Icons";
import { CountUp } from "../components/kit";
import { Founder, ProcessLine, Testimonials, WhereWeWork } from "../components/sections";
import { Marquee } from "../components/Marquee";
import { Close, Head, PageHeader, Hl } from "../components/ui";
import { caseStudies, clientReviews, services, site } from "../site.config";

const DISCIPLINES = [
  { icon: "design", name: "Designers", body: "Interfaces and brands, drawn screen by screen and signed off by you before anything is built." },
  { icon: "engineering", name: "Engineers", body: "Websites, online stores, mobile apps and custom software that stay fast and keep working." },
  { icon: "ai", name: "AI engineers", body: "Assistants, bots and automation that answer your customers and take work off your team." },
  { icon: "motion", name: "Animators", body: "Motion and 3D, like the reels in our Lab, for launches, ads and the moments on your site." },
];

export default function About() {
  const quotes = [...clientReviews, ...caseStudies.flatMap((c) => (c.quote ? [c.quote] : []))];
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "About" }]}
        title={<>Freelancers who became a <Hl>studio</Hl>.</>}
        lead={`We started as individual freelancers with day jobs. Today AHOS is a team of designers, engineers, AI engineers and animators that builds and ships together, for clients in ${site.areasLine}.`}
        bg="ascii" shape="eclipse"
      >
        <Link href="/contact" className="btn" data-magnetic>Talk to us <Arrow /></Link>
        <Link href="/work" className="btn btn-ghost">See our work</Link>
      </PageHeader>

      <Defer>
        <section className="sec" aria-labelledby="story-title">
          <div className="wrap about-story">
            <h2 id="story-title" className="d d-5">How it started.</h2>
            <div>
              <p>AHOS began with freelancers. Each of us had a full-time job and clients on the side, and Jean Paul was building for Web3 projects. We met through the work.</p>
              <p>In {site.founded} we founded AHOS together. The different jobs we each did became one studio, and a group of individual freelancers became a team that plans, designs, builds and ships together.</p>
              <p>We have delivered more than 100 projects since. The aim has not changed: the best results at the best price, with the people who designed your product building it.</p>
            </div>
          </div>
        </section>
      </Defer>

      <Defer>
        <section className="sec" style={{ paddingTop: 0 }} aria-label="AHOS in numbers">
          <div className="wrap">
            <ul className="band">
              <li><b><CountUp text="100+" /></b><span>projects delivered</span></li>
              <li><b>{site.founded}</b><span>the year we founded AHOS</span></li>
              <li><b><CountUp text="4" /></b><span>regions: Lebanon, the US, Europe and Oman</span></li>
              <li><b><CountUp text="30" /></b><span>days of free fixes after every launch</span></li>
            </ul>
          </div>
        </section>
      </Defer>

      <Defer>
        <Marquee items={services.map((s) => s.label)} />
      </Defer>

      <Defer>
        <section className="sec alt" aria-labelledby="team-title">
          <div className="wrap">
            <Head id="team-title" title="One team, four crafts." lead="You do not hand your project from agency to agency. The people who design it are the people who build it." />
            <div className="disc-grid">
              {DISCIPLINES.map((d) => (
                <Spotlight key={d.name} asChild color="var(--primary)" size={340}><article className="cx">
                  <span className="cx-ico"><Icon name={d.icon} /></span>
                  <h3>{d.name}</h3>
                  <p className="cx-body">{d.body}</p>
                </article></Spotlight>
              ))}
            </div>
          </div>
        </section>
      </Defer>

      <Defer>
        <Founder />
      </Defer>

      <Defer>
        <section className="sec" aria-labelledby="how-title">
          <div className="wrap">
            <Head id="how-title" title="Five steps, the same every time." lead="From the first call to launch day you always know what happens next." />
            <ProcessLine />
          </div>
        </section>
      </Defer>

      <Defer>
        <WhereWeWork />
      </Defer>
      <Defer>
        <Testimonials items={quotes} />
      </Defer>
      <Defer>
        <Close where="about" title="Let's build something together." />
      </Defer>
    </>
  );
}
