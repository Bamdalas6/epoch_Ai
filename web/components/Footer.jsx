import { FOOTER, LEGAL, LINKS, SOCIAL } from "@/lib/nav";
import { Wordmark } from "@/components/Header";
import SmartLink from "@/components/SmartLink";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="f-top">
          <p className="f-tag">Investigating the trajectory of AI for the benefit of society</p>
          <a className="btn" href={LINKS.subscribe}>Get the latest in your inbox<span className="arrow" aria-hidden="true">→</span></a>
        </div>
        <div className="f-grid">
          <div className="f-brand">
            <Wordmark />
          </div>
          {FOOTER.map((col, i) => (
            <nav aria-labelledby={`f${i}`} key={col.title}>
              <h2 id={`f${i}`}>{col.title}</h2>
              <ul>{col.links.map((l) => <li key={l.label}><SmartLink href={l.href} mark>{l.label}</SmartLink></li>)}</ul>
            </nav>
          ))}
        </div>
        <div className="legal">
          <span>© 2026 Epoch AI</span>
          {LEGAL.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}
          <ul className="social" aria-label="Social media">{SOCIAL.map((s) => <li key={s}><a href="https://epoch.ai/">{s}</a></li>)}</ul>
        </div>
      </div>
    </footer>
  );
}
