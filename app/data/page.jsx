import { PageHero } from "@/components/Page";
import { DataHub } from "@/components/Hubs";
import { Consult } from "@/components/Sections";
import { getLibrary, getPage } from "@/lib/content";

export const metadata = { title: "Data on AI" };

export default async function DataPage() {
  const [d, lib] = await Promise.all([getPage("data"), getLibrary()]);
  const slugOf = Object.fromEntries(Object.entries(lib.datasets).map(([slug, x]) => [x.title, slug]));
  d.more = d.more.map((x) => ({ ...x, href: slugOf[x.title] ? `/data/${slugOf[x.title]}` : "/data" }));
  return (
    <>
      <PageHero eyebrow="Open data" title={d.title} lede={d.lede} color="#ea8d00" />
      <DataHub data={d} />
      <Consult />
    </>
  );
}
