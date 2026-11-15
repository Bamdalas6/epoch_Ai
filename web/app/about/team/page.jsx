import { PageHero, Avatar, BlockHead } from "@/components/Page";
import { TeamGrid } from "@/components/Hubs";
import { Reveal } from "@/components/Motion";
import SmartLink from "@/components/SmartLink";
import { getPage } from "@/lib/content";

export const metadata = { title: "Our team" };

export default async function TeamPage() {
  const t = await getPage("team");
  return (
    <>
      <PageHero crumbs={[{ label: "About", href: "/about" }]} eyebrow="People" title={t.title} lede={t.lede} color="#009af1">
        <SmartLink className="btn" href="/about/careers">See open roles<span className="arrow" aria-hidden="true">→</span></SmartLink>
      </PageHero>
      <TeamGrid team={t} />
      <section aria-label="Board and advisors">
        <div className="wrap duo">
          <Reveal className="duo-card">
            <BlockHead id="gov-h" eyebrow="Governance" title="Board of directors" />
            <ul className="people-grid tight-grid" aria-labelledby="gov-h">{t.board.map((n) => <li key={n} className="person"><Avatar name={n} /><span><b>{n}</b><span>Board member</span></span></li>)}</ul>
          </Reveal>
          <Reveal className="duo-card" delay={0.1}>
            <BlockHead id="adv-h" eyebrow="Guidance" title="Advisors" />
            <ul className="people-grid tight-grid" aria-labelledby="adv-h">{t.advisors.map(([n, r]) => <li key={n} className="person"><Avatar name={n} /><span><b>{n}</b><span>{r}</span></span></li>)}</ul>
          </Reveal>
        </div>
      </section>
      <section aria-labelledby="reach-h" className="tight">
        <div className="wrap">
          <Reveal className="reach">
            <h2 id="reach-h">Contact our team</h2>
            <p>For general questions, email <a href="mailto:info@epoch.ai">info@epoch.ai</a>. For media inquiries we aim to respond within a few hours.</p>
            <SmartLink className="btn ghost" href="/contact">Send a message</SmartLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
