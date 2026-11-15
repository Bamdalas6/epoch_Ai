import { PageHero, BlockHead, Accordion, Timeline } from "@/components/Page";
import { CountUp, Reveal } from "@/components/Motion";
import { Consult } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getPage } from "@/lib/content";

export const metadata = { title: "AI benchmarks & capabilities" };

export default async function BenchmarksPage() {
  const b = await getPage("benchmarks");
  return (
    <>
      <PageHero crumbs={[{ label: "Data on AI", href: "/data" }]} eyebrow="Benchmarking hub" meta={`Updated ${b.updated}`} title={b.title} lede={b.lede} color="#009af1">
        <SmartLink className="btn" href="https://epoch.ai/benchmarks" mark>Open the interactive hub</SmartLink>
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
            <ul className="chips" aria-labelledby="sets-h">{b.sets.map((s) => <li key={s}><SmartLink href="https://epoch.ai/benchmarks">{s}</SmartLink></li>)}</ul>
          </Reveal>
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
