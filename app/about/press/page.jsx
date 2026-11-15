import { PageHero, BlockHead, Facts, PubCards } from "@/components/Page";
import { Reveal } from "@/components/Motion";
import SmartLink from "@/components/SmartLink";
import { getLibrary, getPublications } from "@/lib/content";

export const metadata = { title: "Press" };

export default async function PressPage() {
  const [{ press: p }, pubs] = await Promise.all([getLibrary(), getPublications()]);
  return (
    <>
      <PageHero crumbs={[{ label: "About", href: "/about" }]} eyebrow="Press" title="Press and media" lede={p.lede} color="#009af1">
        <a className="btn" href="mailto:press@epoch.ai">Email press@epoch.ai</a>
        <a className="btn ghost" href="tel:+16504497269">Call +1 (650) 449-7269</a>
      </PageHero>
      <section aria-labelledby="pf-h" className="tight">
        <div className="wrap">
          <h2 id="pf-h" className="sr-only">About Epoch AI</h2>
          <Facts facts={p.facts} color="#009af1" />
        </div>
      </section>
      <section aria-labelledby="speak-h">
        <div className="wrap split">
          <BlockHead id="speak-h" eyebrow="Expertise" title="What our researchers can speak to">
            <p className="side-note">A non-advocacy research nonprofit: we provide evidence and context, not positions.</p>
          </BlockHead>
          <Reveal>
            <ul className="chips">{p.speak.map((s) => <li key={s}><SmartLink href="/topics">{s}</SmartLink></li>)}</ul>
            <p className="gap"><SmartLink className="more" href="/about/team">Meet our researchers</SmartLink></p>
          </Reveal>
        </div>
      </section>
      <section aria-labelledby="pr-h">
        <div className="wrap">
          <BlockHead id="pr-h" eyebrow="Recent work" title="Latest findings">
            <SmartLink className="more" href="/latest">All publications</SmartLink>
          </BlockHead>
          <PubCards items={pubs.slice(0, 4)} />
        </div>
      </section>
    </>
  );
}
