import { PageHero } from "@/components/Page";
import { Reveal, Tilt } from "@/components/Motion";
import { Newsletter } from "@/components/Sections";
import SmartLink from "@/components/SmartLink";
import { getPage } from "@/lib/content";

export const metadata = { title: "Topics" };

export default async function TopicsPage() {
  const t = await getPage("topics");
  return (
    <>
      <PageHero eyebrow="Browse by topic" title={t.title} lede={t.lede} color="#6a3ecb" />
      <section aria-label="Topic groups" className="tight">
        <div className="wrap">
          <ul className="topic-groups">
            {t.groups.map((g, i) => (
              <Reveal as="li" zoom delay={i * 0.08} key={g.name}>
                <Tilt className="topic-card" style={{ "--c": g.color }}>
                  <span className="tc-num" aria-hidden="true">0{i + 1}</span>
                  <h2>{g.name}</h2>
                  <p>{g.text}</p>
                  <ul>
                    {g.items.map(([label, path]) => (
                      <li key={label}><SmartLink href={`https://epoch.ai${path}`}>{label}<span className="ext" aria-hidden="true">↗</span><span className="sr-only"> (on epoch.ai)</span></SmartLink></li>
                    ))}
                  </ul>
                </Tilt>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
      <Newsletter />
    </>
  );
}
