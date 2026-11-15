import { notFound } from "next/navigation";
import { PageHero, ContactForm } from "@/components/Page";
import { Reveal } from "@/components/Motion";
import SmartLink from "@/components/SmartLink";
import { getPage } from "@/lib/content";
import { slugify } from "@/lib/slug";

export const dynamicParams = false;

async function allRoles() {
  const c = await getPage("careers");
  return [...c.roles, ...c.interest.map((r) => ({ ...r, team: "Expression of interest" }))];
}

export async function generateStaticParams() {
  return (await allRoles()).map((r) => ({ slug: slugify(r.title) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = (await allRoles()).find((x) => slugify(x.title) === slug);
  return { title: r ? `Apply: ${r.title}` : "Apply" };
}

const FIELDS = [
  { name: "name", label: "Full name", required: true, autoComplete: "name" },
  { name: "email", label: "Email address", type: "email", required: true, autoComplete: "email" },
  { name: "link", label: "CV, portfolio or LinkedIn link", type: "url", wide: true, hint: "Optional. A link to where we can see your work.", autoComplete: "url" },
  { name: "message", label: "Why this role", type: "textarea", required: true, min: 30, wide: true, article: "a few words on", hint: "A few sentences on your background and what draws you to Epoch AI." },
];

export default async function ApplyPage({ params }) {
  const { slug } = await params;
  const r = (await allRoles()).find((x) => slugify(x.title) === slug);
  if (!r) notFound();
  return (
    <>
      <PageHero crumbs={[{ label: "About", href: "/about" }, { label: "Careers", href: "/about/careers" }]} eyebrow={r.team} title={r.title} lede={r.text} color="#ea8d00" />
      <section aria-labelledby="apply-h" className="tight">
        <div className="wrap contact-grid">
          <div>
            <h2 id="apply-h" className="block-title">Apply for this role</h2>
            <Reveal><ContactForm fields={FIELDS} submitLabel="Submit application" success="Thanks for applying. This is a concept build, so your application was not sent." /></Reveal>
          </div>
          <aside aria-labelledby="why-h">
            <Reveal className="direct">
              <h2 id="why-h">Working at Epoch AI</h2>
              <p>An interdisciplinary team of researchers, engineers and communicators improving the world’s understanding of AI.</p>
              <p><SmartLink href="/about">Our mission and values</SmartLink></p>
              <p><SmartLink href="/about/team">Meet the team</SmartLink></p>
              <p><SmartLink href="/about/careers">All open roles</SmartLink></p>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
