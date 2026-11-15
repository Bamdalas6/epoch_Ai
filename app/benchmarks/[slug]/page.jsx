import { notFound } from "next/navigation";
import { PageHero, BlockHead, Facts, PubCards, CiteBox } from "@/components/Page";
import { Reveal } from "@/components/Motion";
import { Consult } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getLibrary, getPublications } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const lib = await getLibrary();
  return Object.keys(lib.benchmarks).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const b = (await getLibrary()).benchmarks[slug];
  return { title: b ? b.title : "Benchmark" };
}

export default async function BenchmarkPage({ params }) {
  const { slug } = await params;
  const [lib, pubs] = await Promise.all([getLibrary(), getPublications()]);
  const b = lib.benchmarks[slug];
  if (!b) notFound();
  const related = pubs.filter((p) => ["Capabilities", "Math", "Open models"].includes(p.topic)).slice(0, 4);
  const others = Object.entries(lib.benchmarks).filter(([s]) => s !== slug);

  return (
    <>
      <PageHero crumbs={[{ label: "Benchmarks", href: "/benchmarks" }]} eyebrow={b.kicker} title={b.title} lede={b.text} color={b.color}>
        <a className="btn" href="#about-b">How it works<span className="arrow" aria-hidden="true">↓</span></a>
        <SmartLink className="btn ghost" href="/about/consultations">Commission an evaluation</SmartLink>
      </PageHero>

      <section aria-labelledby="bf-h" className="tight">
        <div className="wrap">
          <h2 id="bf-h" className="sr-only">Key numbers</h2>
          <Facts facts={b.facts} color={b.color} />
        </div>
      </section>

      <section aria-labelledby="about-b-h" id="about-b">
        <div className="wrap split">
          <BlockHead id="about-b-h" eyebrow="Methodology" title={`About ${b.title}`} />
          <div className="prose-list">
            {b.sections.map((s, i) => (
              <Reveal key={s.h} delay={i * 0.06} className="prose-item">
                <h3>{s.h}</h3>
                <p>{s.p}</p>
              </Reveal>
            ))}
            {b.table && (
              <Reveal className="table-wrap" role="region" aria-label="Results table" tabIndex={0}>
                <table className="data-table">
                  <caption>{b.table.caption}</caption>
                  <thead><tr>{b.table.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
                  <tbody>{b.table.rows.map((r) => <tr key={r[0]}>{r.map((c, i) => (i ? <td key={i}>{c}</td> : <th key={i} scope="row">{c}</th>))}</tr>)}</tbody>
                </table>
              </Reveal>
            )}
            <Reveal><CiteBox text={`Epoch AI (2026), “${b.title}”. Benchmark results and methodology. Licensed CC-BY.`} /></Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="br-h">
        <div className="wrap">
          <BlockHead id="br-h" eyebrow="Analysis" title="Related research">
            <SmartLink className="more" href="/topics/capabilities">Capabilities topic</SmartLink>
          </BlockHead>
          <PubCards items={related} />
        </div>
      </section>

      <section aria-labelledby="bo-h" className="tight">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow" id="bo-h">More benchmarks</p>
            <ul className="chips" aria-labelledby="bo-h">{others.map(([s, x]) => <li key={s}><SmartLink href={`/benchmarks/${s}`}>{x.title}</SmartLink></li>)}</ul>
          </Reveal>
        </div>
      </section>
      <Consult />
    </>
  );
}
