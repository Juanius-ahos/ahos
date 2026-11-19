import { Link } from "wouter";
import { Arrow } from "../Arrow";
import { Button, CountUp, Kicker, SectionHeader } from "../kit";
import { Need } from "../ui";
import { Phone, Shot } from "./Frames";
import { ScrollScene, ScrollSceneSlide, ScrollSceneStage, ScrollSceneStep, ScrollSceneSteps } from "@/components/corsair/scroll-scene";
import type { CaseStudy, Project } from "../../site.config";

/**
 * The four case studies told in full on the homepage, as one scrollytelling scene: the text of each
 * story scrolls past on the left while its site sits pinned on the right, in a real browser frame with
 * its phone capture, crossfading as the next story reaches the middle of the screen. The scene is the
 * real ScrollScene from Corsair UI (https://21st.dev/@kevingirelli): below 1024 px nothing is pinned and
 * each story is followed by its own picture.
 */
export function FeaturedWork({ items }: { items: { c: CaseStudy; p: Project }[] }) {
  return (
    <section id="work" className="sec" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHeader id="work-title" kicker="Selected work" title="Four sites, told properly." lead="What we were asked, what we built and where it stands. Each one is live." />
        <ScrollScene pinFrom="lg" stageSide="end" stickyTop="6.5rem" stageHeight="min(70vh, 620px)" className="mt-10">
          <ScrollSceneStage>
            {items.map(({ p }, i) => (
              <ScrollSceneSlide key={p.id} step={i} className="flex items-center justify-center">
                <div className="relative w-full max-w-[680px]">
                  <Shot p={p} sizes="(min-width: 1024px) 46vw, 92vw" />
                  <div className="absolute -bottom-6 -left-5">
                    <Phone p={p} className="w-24 drop-shadow-2xl xl:w-28" />
                  </div>
                </div>
              </ScrollSceneSlide>
            ))}
          </ScrollSceneStage>
          <ScrollSceneSteps>
            {items.map(({ c, p }, i) => {
              const s = c.story!;
              return (
                <ScrollSceneStep key={p.id} step={i}>
                  <div className="story-copy">
                    <Kicker>Case study {String(i + 1).padStart(2, "0")} <span aria-hidden="true">/</span> {p.where}</Kicker>
                    <h3 className="d d-5 story-name">{p.name}</h3>
                    <p className="story-problem">{s.problem}</p>
                    <div className="story-b">
                      <Kicker>What we built</Kicker>
                      <ul>{s.built.map((b) => <li key={b}>{b}</li>)}</ul>
                    </div>
                    <div className="story-r">
                      <Kicker>The result</Kicker>
                      <dl>{s.results.map((r) => <div key={r.l}><dt>{r.l}</dt><dd><CountUp text={r.v} /></dd></div>)}</dl>
                      {s.note && <p className="story-note">{s.note}</p>}
                      {s.need && <p><Need>{s.need}</Need></p>}
                    </div>
                    <div className="acts">
                      <Button href={p.caseStudy} variant="outline">View case study</Button>
                      <a className="lnk" href={p.live} target="_blank" rel="noopener noreferrer">{p.liveLabel} <Arrow /></a>
                    </div>
                  </div>
                </ScrollSceneStep>
              );
            })}
          </ScrollSceneSteps>
        </ScrollScene>
      </div>
    </section>
  );
}
