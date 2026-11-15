import { PageHero } from "@/components/Page";
import TrendsDashboard from "@/components/Trends";
import { Consult } from "@/components/Sections";
import { getPage } from "@/lib/content";

export const metadata = { title: "Trends in AI" };

export default async function TrendsPage() {
  const t = await getPage("trends");
  return (
    <>
      <PageHero eyebrow="Dashboard" meta={`Updated ${t.updated}`} title={t.title} lede={t.lede} />
      <TrendsDashboard trends={t} />
      <Consult />
    </>
  );
}
