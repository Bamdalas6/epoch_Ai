import { PageHero, ContactForm } from "@/components/Page";
import { Reveal } from "@/components/Motion";
import SmartLink from "@/components/SmartLink";

export const metadata = { title: "Contact" };

const FIELDS = [
  { name: "name", label: "Name", required: true, autoComplete: "name" },
  { name: "email", label: "Email address", type: "email", required: true, autoComplete: "email" },
  { name: "subject", label: "Subject", type: "select", required: true, article: "a", options: ["General", "Consultations", "Press", "Data", "Math", "Careers"], wide: true },
  { name: "message", label: "Message", type: "textarea", required: true, min: 10, wide: true },
];

const DIRECT = [
  ["General questions", "info@epoch.ai"],
  ["Press and media", "press@epoch.ai"],
  ["Donations", "donate@epoch.ai"],
];

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch" color="#00a5a6"
        lede="Questions, corrections, data requests or ideas: we read every message and reply when we can accommodate the request." />
      <section aria-label="Contact options" className="tight">
        <div className="wrap contact-grid">
          <Reveal><ContactForm fields={FIELDS} /></Reveal>
          <aside aria-labelledby="direct-h">
            <Reveal className="direct">
              <h2 id="direct-h">Prefer email?</h2>
              <ul>{DIRECT.map(([l, e]) => <li key={e}><span>{l}</span><a href={`mailto:${e}`}>{e}</a></li>)}</ul>
              <p>Looking to commission research? Our <SmartLink href="/about/consultations">consultations page</SmartLink> explains what we offer.</p>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
