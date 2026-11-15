import { PageHero, FilterList } from "@/components/Page";
import { Newsletter } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getPage } from "@/lib/content";
import { pubHref } from "@/lib/slug";

export const metadata = { title: "Latest work" };

export default async function LatestPage() {
  const p = await getPage("latest");
  return (
    <>
      <PageHero eyebrow="Publications" title={p.title} lede={p.lede}>
        <SmartLink className="btn" href="/newsletter#subscribe">Subscribe to our newsletters<span className="arrow" aria-hidden="true">→</span></SmartLink>
        <SmartLink className="btn ghost" href="/podcast">Listen to the podcast</SmartLink>
      </PageHero>
      <section aria-labelledby="pubs-h" className="tight">
        <div className="wrap">
          <h2 id="pubs-h" className="sr-only">Publications</h2>
          <FilterList items={p.items.map((i) => ({ ...i, href: pubHref(i.title) }))} facet="type" />
        </div>
      </section>
      <Newsletter />
    </>
  );
}
