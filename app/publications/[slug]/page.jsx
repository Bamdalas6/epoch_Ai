import { notFound } from "next/navigation";
import { PageHero, BlockHead, PubCards, CiteBox, Avatar } from "@/components/Page";
import { Reveal } from "@/components/Motion";
import { Newsletter } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getLibrary, getPublications } from "@/lib/content";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getPublications()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = (await getPublications()).find((x) => x.slug === slug);
  return { title: p ? p.title : "Publication", description: p?.summary };
}

const SECTION = {
  "Report": ["Latest", "/latest"],
  "Update": ["Latest", "/latest"],
  "Data Insight": ["Data Insights", "/data-insights"],
  "Newsletter": ["Newsletter", "/newsletter"],
  "Podcast": ["Podcast", "/podcast"],
};

export default async function PublicationPage({ params }) {
  const { slug } = await params;
  const [pubs, lib] = await Promise.all([getPublications(), getLibrary()]);
  const p = pubs.find((x) => x.slug === slug);
  if (!p) notFound();

  const [secLabel, secHref] = SECTION[p.type] || SECTION.Report;
  const topicSlug = Object.entries(lib.topics).find(([, t]) => t.name === p.topic || t.match[0] === p.topic)?.[0];
  const authors = (p.authors || "").split(/,\s*(?:and\s+)?|\s+and\s+/).map((a) => a.trim()).filter(Boolean);
  const related = pubs.filter((x) => x.slug !== slug && x.topic === p.topic).slice(0, 3);
  const more = related.length ? related : pubs.filter((x) => x.slug !== slug).slice(0, 3);
  const isPodcast = p.type === "Podcast";

  return (
    <>
      <PageHero crumbs={[{ label: secLabel, href: secHref }]} eyebrow={p.type} meta={p.date} title={p.title} lede={p.summary || undefined} color="#70efd1" />

      <section aria-label="Article details" className="tight">
        <div className="wrap article">
          <aside className="article-meta" aria-label="About this publication">
            <Reveal>
              {authors.length > 0 && (
                <>
                  <p className="eyebrow">{isPodcast ? "With" : "Authors"}</p>
                  <ul className="authors">{authors.map((a) => <li key={a} className="person"><Avatar name={a} /><span><b>{a}</b></span></li>)}</ul>
                </>
              )}
              <dl className="meta-list">
                <div><dt>Published</dt><dd><time dateTime={p.iso}>{p.date}</time></dd></div>
                <div><dt>Type</dt><dd>{p.type}</dd></div>
                {p.topic && <div><dt>Topic</dt><dd>{topicSlug ? <SmartLink href={`/topics/${topicSlug}`}>{p.topic}</SmartLink> : p.topic}</dd></div>}
              </dl>
            </Reveal>
          </aside>
          <div className="article-body">
            <Reveal className="summary-box">
              <p className="eyebrow">{isPodcast ? "Episode summary" : "Summary"}</p>
              <p>{p.summary || (isPodcast
                ? `In this episode of Epoch After Hours, ${p.authors} discuss “${p.title}”.`
                : `${p.authors ? `${p.authors} write about` : "A look at"} “${p.title}” in this ${p.type.toLowerCase()} from Epoch AI.`)}</p>
            </Reveal>
            <Reveal className="concept-note">
              <p>This redesign concept shows each publication’s summary and details. The full text, charts and data appendix would appear here in the production site.</p>
            </Reveal>
            <Reveal><CiteBox text={`${p.authors || "Epoch AI"} (${p.iso.slice(0, 4)}), “${p.title}”. Published online at Epoch AI, ${p.date}.`} /></Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="more-h">
        <div className="wrap">
          <BlockHead id="more-h" eyebrow="Keep reading" title={related.length ? `More on ${p.topic.toLowerCase()}` : "More from Epoch AI"}>
            <SmartLink className="more" href={secHref}>All {secLabel.toLowerCase()}</SmartLink>
          </BlockHead>
          <PubCards items={more} />
        </div>
      </section>
      <Newsletter />
    </>
  );
}
