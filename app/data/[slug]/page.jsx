import { notFound } from "next/navigation";
import { PageHero, BlockHead, Facts, PubCards, CiteBox } from "@/components/Page";
import { Reveal } from "@/components/Motion";
import { Consult } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getLibrary, getPublications } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const lib = await getLibrary();
  return Object.entries(lib.datasets).filter(([, d]) => !d.href).map(([slug]) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = (await getLibrary()).datasets[slug];
  return { title: d ? d.title : "Dataset" };
}

export default async function DatasetPage({ params }) {
  const { slug } = await params;
  const [lib, pubs] = await Promise.all([getLibrary(), getPublications()]);
  const d = lib.datasets[slug];
  if (!d || d.href) notFound();

  const topicNames = (d.topics || []).map((s) => lib.topics[s]?.name).filter(Boolean);
  const related = pubs.filter((p) => (d.topics || []).some((s) => lib.topics[s]?.match.includes(p.topic))).slice(0, 4);
  const others = Object.entries(lib.datasets).filter(([s, x]) => s !== slug && !x.href && x.group === d.group).slice(0, 6);

  return (
    <>
      <PageHero crumbs={[{ label: "Data on AI", href: "/data" }]} eyebrow={`Dataset · ${d.group}`} meta={`Updated ${d.updated}`} title={d.title} lede={d.text} color={d.color}>
        <SmartLink className="btn" href={`/contact`}>Request data access<span className="arrow" aria-hidden="true">→</span></SmartLink>
        <a className="btn ghost" href="#inside">What’s inside</a>
      </PageHero>

      <section aria-labelledby="facts-h" className="tight">
        <div className="wrap">
          <h2 id="facts-h" className="sr-only">Key numbers</h2>
          <Facts facts={d.facts} color={d.color} />
        </div>
      </section>

      <section aria-labelledby="inside-h" id="inside">
        <div className="wrap split">
          <BlockHead id="inside-h" eyebrow="Documentation" title="What’s inside this dataset">
            <p className="side-note">Every record is sourced and reviewed by our team. Use it freely with credit under the Creative Commons Attribution licence.</p>
          </BlockHead>
          <div>
            <ul className="fields">
              {d.fields.map((f, i) => (
                <Reveal as="li" key={f} delay={i * 0.04} y={12}><span className="dot" aria-hidden="true" style={{ "--c": d.color }} />{f}</Reveal>
              ))}
            </ul>
            {topicNames.length > 0 && (
              <Reveal className="gap">
                <p className="eyebrow" id="ds-topics">Related topics</p>
                <ul className="chips" aria-labelledby="ds-topics">{d.topics.map((s) => lib.topics[s] && <li key={s}><SmartLink href={`/topics/${s}`}>{lib.topics[s].name}</SmartLink></li>)}</ul>
              </Reveal>
            )}
            <Reveal className="gap"><CiteBox text={`Epoch AI (2026), “${d.title}”. Dataset, updated ${d.updated}. Licensed CC-BY.`} /></Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="dsr-h">
          <div className="wrap">
            <BlockHead id="dsr-h" eyebrow="Analysis" title="Research using this data" />
            <PubCards items={related} />
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="dso-h" className="tight">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow" id="dso-h">More {d.group.toLowerCase()} data</p>
              <ul className="chips" aria-labelledby="dso-h">{others.map(([s, x]) => <li key={s}><SmartLink href={`/data/${s}`}>{x.title}</SmartLink></li>)}</ul>
            </Reveal>
          </div>
        </section>
      )}
      <Consult />
    </>
  );
}
