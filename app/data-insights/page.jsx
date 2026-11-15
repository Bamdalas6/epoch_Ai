import { PageHero, FilterList, BlockHead } from "@/components/Page";
import { Reveal } from "@/components/Motion";
import { Newsletter } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getPage } from "@/lib/content";
import { pubHref } from "@/lib/slug";

export const metadata = { title: "Data Insights" };

export default async function InsightsPage() {
  const p = await getPage("insights");
  return (
    <>
      <PageHero crumbs={[{ label: "Latest", href: "/latest" }]} eyebrow="Publications" title={p.title} lede={p.lede} color="#009af1" />
      <section aria-labelledby="ins-feat" className="tight">
        <div className="wrap">
          <BlockHead id="ins-feat" eyebrow="Featured" title="Start with these" />
          <ul className="ins-featured">
            {p.featured.map((f, i) => (
              <Reveal as="li" zoom delay={i * 0.08} key={f.title} className="ins-card" style={{ "--c": f.color }}>
                <span className="ins-bars" aria-hidden="true">{[38, 52, 46, 70, 88].map((h, k) => <i key={k} style={{ height: `${h - i * 6}%`, transitionDelay: `${k * 60}ms` }} />)}</span>
                <p className="meta"><span className="tag">Data Insight</span> <time dateTime={f.iso}>{f.date}</time></p>
                <h3><SmartLink href={pubHref(f.title)}>{f.title}</SmartLink></h3>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section aria-labelledby="ins-all">
        <div className="wrap">
          <BlockHead id="ins-all" eyebrow="Archive" title="All data insights" />
          <FilterList items={p.items.map((i) => ({ ...i, href: pubHref(i.title) }))} facet="none" />
        </div>
      </section>
      <Newsletter />
    </>
  );
}
