import { PageHero, BlockHead, FilterList } from "@/components/Page";
import { Newsletter } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getLibrary } from "@/lib/content";
import { pubHref } from "@/lib/slug";

export const metadata = { title: "Gradient Updates newsletter" };

export default async function NewsletterPage() {
  const { newsletter: n } = await getLibrary();
  return (
    <>
      <PageHero crumbs={[{ label: "Latest", href: "/latest" }]} eyebrow="Weekly newsletter" title={n.title} lede={n.lede} color="#009af1">
        <a className="btn" href="#subscribe">Subscribe<span className="arrow" aria-hidden="true">↓</span></a>
        <SmartLink className="btn ghost" href="/podcast">Listen to the podcast</SmartLink>
      </PageHero>
      <section aria-labelledby="issues-h" className="tight">
        <div className="wrap">
          <BlockHead id="issues-h" eyebrow="Archive" title="Recent issues" />
          <FilterList items={n.items.map((i) => ({ ...i, href: pubHref(i.title) }))} facet="none" />
        </div>
      </section>
      <Newsletter />
    </>
  );
}
