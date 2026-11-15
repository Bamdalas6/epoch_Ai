import { PageHero, BlockHead, Accordion } from "@/components/Page";
import { Reveal } from "@/components/Motion";
import SmartLink from "@/components/SmartLink";
import { getPage } from "@/lib/content";
import { slugify } from "@/lib/slug";

export const metadata = { title: "Careers" };

const apply = (title) => `/about/careers/apply/${slugify(title)}`;

export default async function CareersPage() {
  const c = await getPage("careers");
  const teams = [...new Set(c.roles.map((r) => r.team))];
  return (
    <>
      <PageHero crumbs={[{ label: "About", href: "/about" }]} eyebrow="Careers" title={c.title} lede={c.lede} color="#ea8d00">
        <a className="btn" href="#roles">See {c.roles.length} open roles<span className="arrow" aria-hidden="true">↓</span></a>
      </PageHero>
      <section aria-labelledby="roles-h" id="roles" className="tight">
        <div className="wrap">
          <BlockHead id="roles-h" eyebrow="Open roles" title="Where you could help" />
          {teams.map((team) => {
            const roles = c.roles.filter((r) => r.team === team);
            return (
              <div key={team} className="role-team">
                <h3 className="tg-title">{team} <span>{roles.length}</span></h3>
                <Accordion headingLevel={4} items={roles.map((r) => ({
                  q: r.title,
                  a: (<><p>{r.text}</p><SmartLink className="btn" href={apply(r.title)}>Apply: {r.title}<span className="arrow" aria-hidden="true">→</span></SmartLink></>),
                }))} />
              </div>
            );
          })}
        </div>
      </section>
      <section aria-labelledby="eoi-h">
        <div className="wrap">
          <BlockHead id="eoi-h" eyebrow="Not seeing your role?" title="Send an expression of interest" />
          <ul className="duo">
            {c.interest.map((r, i) => (
              <Reveal as="li" className="duo-card" delay={i * 0.1} key={r.title}>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
                <SmartLink className="btn ghost" href={apply(r.title)}>Submit interest</SmartLink>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
