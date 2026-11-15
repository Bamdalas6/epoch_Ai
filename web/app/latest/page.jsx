import { PageHero, FilterList } from "@/components/Page";
import { Newsletter } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getPage } from "@/lib/content";

export const metadata = { title: "Latest work" };

export default async function LatestPage() {
  const p = await getPage("latest");
  return (
    <>
      <PageHero eyebrow="Publications" title={p.title} lede={p.lede}>
        <SmartLink className="btn" href="https://epochai.substack.com/subscribe" mark>Subscribe to our newsletters</SmartLink>
      </PageHero>
      <section aria-labelledby="pubs-h" className="tight">
        <div className="wrap">
          <h2 id="pubs-h" className="sr-only">Publications</h2>
          <FilterList items={p.items} facet="type" />
        </div>
      </section>
      <Newsletter />
    </>
  );
}
