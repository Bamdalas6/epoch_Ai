import { PageHero, BlockHead } from "@/components/Page";
import { Reveal } from "@/components/Motion";
import SmartLink from "@/components/SmartLink";
import { getLibrary } from "@/lib/content";

export const metadata = { title: "Transparency" };

export default async function TransparencyPage() {
  const { transparency: t } = await getLibrary();
  return (
    <>
      <PageHero crumbs={[{ label: "About", href: "/about" }]} eyebrow="Transparency" title="Who funds and works with us" lede={t.lede} color="#00a5a6">
        <a className="btn" href="#funders">Our funders<span className="arrow" aria-hidden="true">↓</span></a>
        <a className="btn ghost" href="#collaborations">Collaborations</a>
      </PageHero>

      <section aria-labelledby="funders-h" id="funders" className="tight">
        <div className="wrap">
          <BlockHead id="funders-h" eyebrow="Funders" title="Major contributions">
            <p className="side-note">{t.fundersNote}</p>
          </BlockHead>
          <Reveal className="table-wrap" role="region" aria-labelledby="funders-h" tabIndex={0}>
            <table className="data-table">
              <caption className="sr-only">Contributions of $70,000 or more</caption>
              <thead><tr><th scope="col">Funder</th><th scope="col">Purpose</th><th scope="col">When</th><th scope="col">Amount</th></tr></thead>
              <tbody>{t.funders.map(([f, p, w, a]) => <tr key={f}><th scope="row">{f}</th><td>{p}</td><td>{w}</td><td>{a}</td></tr>)}</tbody>
            </table>
          </Reveal>
          <Reveal className="licence">
            <p><b>Want to support independent research on AI?</b> Every contribution is a vote of confidence in our work.</p>
            <SmartLink className="btn" href="/about/donate">Donate</SmartLink>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="collaborations-h" id="collaborations">
        <div className="wrap">
          <BlockHead id="collaborations-h" eyebrow="Collaborations and consultations" title="Organizations we work with" />
          <ul className="services">
            {t.collaborations.map(([org, what], i) => (
              <Reveal as="li" zoom delay={(i % 3) * 0.07} key={org}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{org}</h3>
                <p>{what}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="gap"><SmartLink className="more" href="/about/consultations">Learn about our services</SmartLink></Reveal>
        </div>
      </section>
    </>
  );
}
