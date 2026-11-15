import { PageHero, BlockHead, Timeline } from "@/components/Page";
import { Reveal, ScrollZoom } from "@/components/Motion";
import { Consult } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getPage } from "@/lib/content";

export const metadata = { title: "About" };

export default async function AboutPage() {
  const a = await getPage("about");
  return (
    <>
      <PageHero eyebrow="About Epoch AI" title={a.title} lede={a.lede}>
        <SmartLink className="btn" href="/about/team">Meet the team<span className="arrow" aria-hidden="true">→</span></SmartLink>
        <SmartLink className="btn ghost" href="/about/careers">Join us</SmartLink>
      </PageHero>

      <section aria-labelledby="mission-h" className="tight">
        <div className="wrap">
          <ScrollZoom from={0.94}>
            <div className="mission">
              <h2 className="eyebrow" id="mission-h">Our mission</h2>
              <p className="mission-text">{a.mission}</p>
            </div>
          </ScrollZoom>
        </div>
      </section>

      <section aria-labelledby="research-h">
        <div className="wrap">
          <BlockHead id="research-h" eyebrow="Research" title="We study what drives AI, how fast it progresses, and what it changes" />
          <ul className="pillars">
            {a.pillars.map((p, i) => (
              <Reveal as="li" zoom delay={i * 0.08} key={p.name} className="pillar" style={{ "--c": p.color }}>
                <span className="pillar-num" aria-hidden="true">0{i + 1}</span>
                <h3>{p.name}</h3>
                <p>{p.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="history-h">
        <div className="wrap split">
          <BlockHead id="history-h" eyebrow="History" title="From volunteers to a global research team" />
          <Timeline items={a.history} />
        </div>
      </section>

      <section aria-labelledby="values-h">
        <div className="wrap">
          <BlockHead id="values-h" eyebrow="Our commitments" title="How we work" />
          <ol className="values">
            {a.values.map((v, i) => (
              <Reveal as="li" delay={(i % 3) * 0.07} key={v.name}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{v.name}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section aria-label="Funding and press" className="tight">
        <div className="wrap duo">
          <Reveal className="duo-card">
            <p className="eyebrow">Funding</p>
            <h2>An independent nonprofit</h2>
            <p>We rely on the ongoing support of donors. Every contribution is a vote of confidence in our work and our mission of improving our shared understanding of AI.</p>
            <SmartLink className="btn" href="/about/donate">Support our work<span className="arrow" aria-hidden="true">→</span></SmartLink>
          </Reveal>
          <Reveal className="duo-card" delay={0.1}>
            <p className="eyebrow">Press and partners</p>
            <h2>Working on a story?</h2>
            <p>Journalists can reach us at <a href="mailto:press@epoch.ai">press@epoch.ai</a> or call <a href="tel:+16504497269">+1 (650) 449-7269</a>. {a.partners}</p>
            <SmartLink className="btn ghost" href="/contact">Contact us</SmartLink>
          </Reveal>
        </div>
      </section>
      <Consult />
    </>
  );
}
