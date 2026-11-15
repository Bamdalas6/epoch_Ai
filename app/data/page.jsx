import { PageHero } from "@/components/Page";
import { DataHub } from "@/components/Hubs";
import { Consult } from "@/components/Sections";
import { getPage } from "@/lib/content";

export const metadata = { title: "Data on AI" };

export default async function DataPage() {
  const d = await getPage("data");
  return (
    <>
      <PageHero eyebrow="Open data" title={d.title} lede={d.lede} color="#ea8d00" />
      <DataHub data={d} />
      <Consult />
    </>
  );
}
