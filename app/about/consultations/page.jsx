import { PageHero, BlockHead, ContactForm } from "@/components/Page";
import { Reveal, ScrollZoom } from "@/components/Motion";
import { Trusted } from "@/components/Sections";
import { getPage } from "@/lib/content";

export const metadata = { title: "Consultations" };

const FIELDS = [
  { name: "name", label: "Name", required: true, autoComplete: "name" },
  { name: "email", label: "Email address", type: "email", required: true, autoComplete: "email" },
  { name: "org", label: "Company or organization", required: true, autoComplete: "organization", wide: true },
  { name: "message", label: "Message", type: "textarea", required: true, min: 20, wide: true, hint: "What question or project do you have in mind? Timelines and budget help us reply faster." },
];

export default async function ConsultPage() {
  const c = await getPage("consultations");
  return (
    <>
      <PageHero crumbs={[{ label: "About", href: "/about" }]} eyebrow="Consultations" title={c.title} lede={c.lede}>
        <a className="btn" href="#enquire">Start an enquiry<span className="arrow" aria-hidden="true">↓</span></a>
      </PageHero>
      <Trusted names={c.clients} />
      <section aria-labelledby="svc-h">
        <div className="wrap">
          <BlockHead id="svc-h" eyebrow="Custom research projects" title="Commission us on a question aligned with our mission" />
          <ol className="services">
            {c.services.map((s, i) => (
              <Reveal as="li" zoom delay={(i % 3) * 0.08} key={s.name}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <section aria-labelledby="od-h" className="tight">
        <div className="wrap">
          <ScrollZoom from={0.93}>
            <div className="on-demand">
              <p className="eyebrow">Retainer</p>
              <h2 id="od-h">Epoch on demand</h2>
              <p>{c.onDemand}</p>
              <p className="od-badge"><b>24h</b><span>turnaround<br />on queries</span></p>
            </div>
          </ScrollZoom>
        </div>
      </section>
      <section aria-label="Highlights">
        <div className="wrap duo">
          {c.highlights.map((h, i) => (
            <Reveal className="duo-card" delay={i * 0.1} key={h.name}>
              <p className="eyebrow">Highlight</p>
              <h2>{h.name}</h2>
              <p>{h.text}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section aria-labelledby="enquire-h" id="enquire">
        <div className="wrap split">
          <BlockHead id="enquire-h" eyebrow="Get in touch" title="Tell us what you need">
            <p className="side-note">Our team will get back to you shortly. Please review the Consultation Terms and Conditions before booking a briefing.</p>
          </BlockHead>
          <Reveal><ContactForm fields={FIELDS} submitLabel="Contact Epoch AI" /></Reveal>
        </div>
      </section>
    </>
  );
}
