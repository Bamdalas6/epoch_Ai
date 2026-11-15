import Hero from "@/components/Hero";
import { Stats, Trusted, Featured, Latest, Snapshot, DataCards, Experts, Consult, Newsletter } from "@/components/Sections";
import { getContent } from "@/lib/content";

export default async function Home() {
  const c = await getContent();
  return (
    <>
      <Hero headline={c.headline} lede={c.lede} />
      <Stats stats={c.stats} />
      <Trusted names={c.trusted} />
      <Featured featured={c.featured} />
      <Latest items={c.latest} />
      <Snapshot snap={c.snapshot} />
      <DataCards items={c.datasets} />
      <Experts quotes={c.quotes || [c.quote]} />
      <Consult />
      <Newsletter />
    </>
  );
}
