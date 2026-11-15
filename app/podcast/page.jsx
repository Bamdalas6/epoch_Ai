import { PageHero, BlockHead, FilterList } from "@/components/Page";
import { Newsletter } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getLibrary } from "@/lib/content";
import { pubHref } from "@/lib/slug";

export const metadata = { title: "Epoch After Hours podcast" };

export default async function PodcastPage() {
  const { podcast: p } = await getLibrary();
  return (
    <>
      <PageHero crumbs={[{ label: "Latest", href: "/latest" }]} eyebrow="Podcast" title={p.title} lede={p.lede} color="#6a3ecb">
        <a className="btn" href="#episodes">Browse episodes<span className="arrow" aria-hidden="true">↓</span></a>
        <SmartLink className="btn ghost" href="/newsletter">Read the newsletter</SmartLink>
      </PageHero>
      <section aria-labelledby="ep-h" id="episodes" className="tight">
        <div className="wrap">
          <BlockHead id="ep-h" eyebrow="All episodes" title="Conversations on the future of AI" />
          <FilterList items={p.items.map((i) => ({ ...i, href: pubHref(i.title) }))} facet="none" />
        </div>
      </section>
      <Newsletter />
    </>
  );
}
