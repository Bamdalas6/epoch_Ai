import { PageHero, BlockHead } from "@/components/Page";
import { Reveal, ScrollZoom } from "@/components/Motion";

export const metadata = { title: "Donate" };

const WHY = [
  ["Independent research", "Donations keep our work neutral to any specific agenda.", "#00a5a6"],
  ["Open data for everyone", "Our databases and charts are free to use under a CC-BY licence.", "#009af1"],
  ["Better decisions", "Policymakers and researchers rely on our evidence about AI.", "#6a3ecb"],
];

export default function DonatePage() {
  return (
    <>
      <PageHero crumbs={[{ label: "About", href: "/about" }]} eyebrow="Support us" title="Donate" color="#e62c11"
        lede="Support our mission to improve the shared understanding of AI. Your contribution funds independent research that informs better policy and decision-making.">
        <a className="btn" href="https://www.every.org/">Donate via every.org<span className="ext" aria-hidden="true">↗</span><span className="sr-only"> (external site)</span></a>
        <a className="btn ghost" href="mailto:donate@epoch.ai">Email donate@epoch.ai</a>
      </PageHero>
      <section aria-labelledby="why-h" className="tight">
        <div className="wrap">
          <BlockHead id="why-h" eyebrow="Why give" title="What your gift makes possible" />
          <ul className="pillars">
            {WHY.map(([h, t, c], i) => (
              <Reveal as="li" zoom delay={i * 0.08} key={h} className="pillar" style={{ "--c": c }}>
                <span className="pillar-num" aria-hidden="true">0{i + 1}</span><h3>{h}</h3><p>{t}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <section aria-labelledby="how-h">
        <div className="wrap">
          <ScrollZoom from={0.94}>
            <div className="on-demand">
              <p className="eyebrow">How to give</p>
              <h2 id="how-h">Most donations go through every.org</h2>
              <p>All every.org donations are re-granted to Epoch AI as unrestricted donations. Every.org does not charge Epoch for the platform, but transaction fees may be deducted for some donation types. For questions or donation support, email <a href="mailto:donate@epoch.ai">donate@epoch.ai</a>.</p>
            </div>
          </ScrollZoom>
          <Reveal>
            <details className="legal-note">
              <summary>Charity registration details</summary>
              <p>Epoch Artificial Intelligence, Inc.’s mission is to conduct and disseminate scientific research on the trajectory and impact of artificial intelligence, to enable better policy and decision-making. Contributions are deductible for federal income tax purposes in accordance with applicable law. Registration in a state does not imply endorsement, approval, or recommendation by the state.</p>
            </details>
          </Reveal>
        </div>
      </section>
    </>
  );
}
