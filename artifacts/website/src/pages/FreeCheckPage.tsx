import { Defer } from "../components/Defer";
import { Spotlight } from "@/components/corsair/spotlight";
import { Icon } from "../components/Icons";
import { FreeCheck } from "../components/sections";
import { Close, PageHeader, Hl } from "../components/ui";
import { site } from "../site.config";

const STEPS = [
  { icon: "web-development", name: "Send a link", body: "Your website or your Instagram. That is all we need to start." },
  { icon: "ai-development", name: "A person looks at it", body: "Not a report generator. Someone on the team opens your site the way a customer would." },
  { icon: "ui-ux-design", name: "You get three things", body: `The three things costing you customers, on WhatsApp, usually within ${site.contact.replyWithin}.` },
];

export default function FreeCheckPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Home", href: "/" }, { name: "Free website check" }]}
        title={<>A free website check, <Hl>by a person</Hl>.</>}
        lead="Send us your website or Instagram link and we will tell you the 3 things costing you customers. No email form, no account, no strings."
        bg="glyph"
      />
      <Defer>
        <section className="sec" aria-label="How it works">
          <div className="wrap">
            <div className="fc-steps">
              {STEPS.map((s, i) => (
                <Spotlight key={s.name} asChild color="var(--primary)" size={340}><article className="cx">
                  <div className="cx-top"><span className="cx-ico"><Icon name={s.icon} /></span><span className="cx-no">{String(i + 1).padStart(2, "0")}</span></div>
                  <h3>{s.name}</h3>
                  <p className="cx-body">{s.body}</p>
                </article></Spotlight>
              ))}
            </div>
          </div>
        </section>
      </Defer>
      <Defer>
        <FreeCheck where="free_check_page" />
      </Defer>
      <Defer>
        <Close where="free_check" />
      </Defer>
    </>
  );
}
