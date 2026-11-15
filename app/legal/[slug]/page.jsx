import { notFound } from "next/navigation";
import { PageHero } from "@/components/Page";
import { Reveal } from "@/components/Motion";
import SmartLink from "@/components/SmartLink";

const PAGES = {
  privacy: {
    title: "Privacy policy",
    lede: "How this redesign concept handles your information. Short version: it collects nothing.",
    sections: [
      ["What we collect", "Nothing. This concept site has no accounts, no analytics and no tracking. Forms check what you type in your browser but do not send or store it."],
      ["Forms", "The newsletter, contact, consultation and job application forms are demonstrations. Their contents never leave your device."],
      ["Third parties", "Pages are served by Vercel, which keeps standard server logs (such as IP address and time of request) to run the service. No other third-party services receive your data."],
      ["Questions", "For questions about Epoch AI’s own privacy practices, contact the Epoch AI team."],
    ],
  },
  cookies: {
    title: "Cookie policy",
    lede: "This concept site does not use cookies.",
    sections: [
      ["Cookies", "No cookies are set, so there is no consent banner to dismiss."],
      ["Browser storage", "Nothing is saved in your browser’s local storage either. Filters and settings reset when you reload a page."],
      ["Your choices", "Because nothing is stored, there is nothing to opt out of or delete."],
    ],
  },
};

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(PAGES).map((slug) => ({ slug })); }
export async function generateMetadata({ params }) { const { slug } = await params; return { title: PAGES[slug]?.title || "Legal" }; }

export default async function LegalPage({ params }) {
  const { slug } = await params;
  const p = PAGES[slug];
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow="Legal" meta="Updated Nov. 2026" title={p.title} lede={p.lede} color="#c7caca" />
      <section aria-label={p.title} className="tight">
        <div className="wrap legal-body">
          {p.sections.map(([h, t], i) => (
            <Reveal key={h} delay={i * 0.05} className="prose-item"><h2>{h}</h2><p>{t}</p></Reveal>
          ))}
          <Reveal className="gap"><SmartLink className="more" href={slug === "privacy" ? "/legal/cookies" : "/legal/privacy"}>{slug === "privacy" ? "Cookie policy" : "Privacy policy"}</SmartLink></Reveal>
          <Reveal><SmartLink className="more" href="/contact">Contact us</SmartLink></Reveal>
        </div>
      </section>
    </>
  );
}
