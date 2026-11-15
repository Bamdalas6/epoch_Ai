import { notFound } from "next/navigation";
import { PageHero, BlockHead, PubCards } from "@/components/Page";
import { Reveal, Tilt } from "@/components/Motion";
import { Newsletter } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getLibrary, getPage, getPublications } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  const lib = await getLibrary();
  return Object.keys(lib.topics).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const t = (await getLibrary()).topics[slug];
  return { title: t ? t.name : "Topic" };
}

export default async function TopicPage({ params }) {
  const { slug } = await params;
  const [lib, trends, pubs] = await Promise.all([getLibrary(), getPage("trends"), getPublications()]);
  const t = lib.topics[slug];
  if (!t) notFound();

  const group = trends.groups.find((g) => g.id === t.trend);
  const related = pubs.filter((p) => t.match.includes(p.topic)).slice(0, 6);
  const work = related.length ? related : pubs.slice(0, 4);
  const datasets = t.datasets.map((s) => ({ slug: s, ...lib.datasets[s] })).filter((d) => d.title);
  const siblings = Object.entries(lib.topics).filter(([s, x]) => x.group === t.group && s !== slug);

  return (
    <>
      <PageHero crumbs={[{ label: "Topics", href: "/topics" }]} eyebrow={t.group} title={t.name} lede={t.intro} color={t.color}>
        <a className="btn" href="#work">Read our work<span className="arrow" aria-hidden="true">↓</span></a>
        {datasets[0] && <SmartLink className="btn ghost" href={datasets[0].href || `/data/${datasets[0].slug}`}>Explore the data</SmartLink>}
      </PageHero>

      <section aria-labelledby="focus-h" className="tight">
        <div className="wrap">
          <BlockHead id="focus-h" eyebrow="What we track" title={`Our research on ${t.name.toLowerCase()}`} />
          <ul className="pillars">
            {t.focus.map((f, i) => (
              <Reveal as="li" zoom delay={i * 0.08} key={f} className="pillar" style={{ "--c": t.color }}>
                <span className="pillar-num" aria-hidden="true">0{i + 1}</span>
                <h3>{f}</h3>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {group && (
        <section aria-labelledby="trend-h">
          <div className="wrap">
            <BlockHead id="trend-h" eyebrow={`Key trend · ${group.name}`} title={group.headline}>
              <SmartLink className="more" href={`/trends#${group.id}`}>All {group.name.toLowerCase()} trends</SmartLink>
            </BlockHead>
            <ul className="tstats">
              {group.stats.map((s, i) => (
                <Reveal as="li" zoom delay={(i % 3) * 0.07} key={s.label} className="tstat" style={{ "--c": group.color }}>
                  <h3>{s.label}</h3>
                  <p className="fig">{s.kind === "growth" ? `${s.factor}×` : s.display}<small>{s.kind === "growth" ? "per year" : s.unit}</small></p>
                  <p className="stat-text">{s.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="work-h" id="work">
        <div className="wrap">
          <BlockHead id="work-h" eyebrow="Publications" title={related.length ? `Latest on ${t.name.toLowerCase()}` : "Our latest work"}>
            <SmartLink className="more" href="/latest">All publications</SmartLink>
          </BlockHead>
          <PubCards items={work} />
        </div>
      </section>

      {datasets.length > 0 && (
        <section aria-labelledby="tdata-h">
          <div className="wrap">
            <BlockHead id="tdata-h" eyebrow="Data on AI" title="Related datasets" />
            <ul className="cards">
              {datasets.map((d, i) => (
                <Reveal as="li" zoom delay={i * 0.08} key={d.slug}>
                  <Tilt className="card" style={{ "--c": d.color || t.color }}>
                    <i aria-hidden="true" />
                    <h3><SmartLink href={d.href || `/data/${d.slug}`}>{d.title}</SmartLink></h3>
                    {d.text && <p>{d.text}</p>}
                    <span className="go" aria-hidden="true">→</span>
                  </Tilt>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {siblings.length > 0 && (
        <section aria-labelledby="sib-h" className="tight">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow" id="sib-h">More in {t.group}</p>
              <ul className="chips">{siblings.map(([s, x]) => <li key={s}><SmartLink href={`/topics/${s}`}>{x.name}</SmartLink></li>)}</ul>
            </Reveal>
          </div>
        </section>
      )}
      <Newsletter />
    </>
  );
}
