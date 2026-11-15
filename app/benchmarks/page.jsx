import { PageHero, BlockHead, Accordion, Timeline } from "@/components/Page";
import { CountUp, Reveal } from "@/components/Motion";
import { Consult } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getLibrary, getPage } from "@/lib/content";
import { Tilt } from "@/components/Motion";

export const metadata = { title: "AI benchmarks & capabilities" };

const SET_LINKS = { Math: "/benchmarks/frontiermath", "Software engineering": "/benchmarks/mirrorcode", "Epoch administered": "/benchmarks/epoch-automation-reports", "Knowledge & reasoning": "/benchmarks/eci" };

export default async function BenchmarksPage() {
  const [b, lib] = await Promise.all([getPage("benchmarks"), getLibrary()]);
  return (
    <>
      <PageHero crumbs={[{ label: "Data on AI", href: "/data" }]} eyebrow="Benchmarking hub" meta={`Updated ${b.updated}`} title={b.title} lede={b.lede} color="#009af1">
        <a className="btn" href="#our-benchmarks">Explore our benchmarks<span className="arrow" aria-hidden="true">↓</span></a>
        <SmartLink className="btn ghost" href="/benchmarks/eci">Epoch Capabilities Index</SmartLink>
      </PageHero>
      <section aria-label="Benchmark hub at a glance" className="tight">
        <div className="wrap">
          <ul className="big-stats">
            {b.stats.map((s, i) => (
              <Reveal as="li" zoom delay={i * 0.08} key={s.label} className="big-stat" style={{ "--c": s.color }}>
                <p className="fig"><CountUp value={s.value} /></p>
                <h2>{s.label}</h2>
                {s.note && <p className="note">{s.note}</p>}
                <p>{s.text}</p>
                <SmartLink className="more" href={s.href}>{s.cta}</SmartLink>
              </Reveal>
            ))}
          </ul>
          <Reveal className="sets">
            <p className="eyebrow" id="sets-h">Benchmark sets you can compare</p>
            <ul className="chips" aria-labelledby="sets-h">{b.sets.map((s) => <li key={s}><SmartLink href={SET_LINKS[s] || "/benchmarks/eci"}>{s}</SmartLink></li>)}</ul>
          </Reveal>
        </div>
      </section>
      <section aria-labelledby="ours-h" id="our-benchmarks">
        <div className="wrap">
          <BlockHead id="ours-h" eyebrow="Built by Epoch AI" title="Our benchmarks" />
          <ul className="cards">
            {Object.entries(lib.benchmarks).map(([slug, x], i) => (
              <Reveal as="li" zoom delay={i * 0.07} key={slug}>
                <Tilt className="card" style={{ "--c": x.color }}>
                  <i aria-hidden="true" />
                  <h3><SmartLink href={`/benchmarks/${slug}`}>{x.title}</SmartLink></h3>
                  <p>{x.text}</p>
                  <span className="go" aria-hidden="true">→</span>
                </Tilt>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section aria-labelledby="act-h">
        <div className="wrap split">
          <BlockHead id="act-h" eyebrow="Latest activity" title="What changed recently" />
          <Timeline items={b.activity} />
        </div>
      </section>
      <section aria-labelledby="faq-h">
        <div className="wrap split">
          <BlockHead id="faq-h" eyebrow="Methodology" title="Common questions" />
          <Accordion items={b.faq} />
        </div>
      </section>
      <Consult />
    </>
  );
}
