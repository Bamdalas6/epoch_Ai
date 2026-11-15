"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import SmartLink from "@/components/SmartLink";
import { EASE, Reveal } from "@/components/Motion";

/* ---------- Page hero with breadcrumbs ---------- */

export function PageHero({ crumbs = [], eyebrow, title, lede, meta, color = "#34d2b9", children }) {
  const words = title.split(" ");
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="crumbs">
          <ol>
            <li><SmartLink href="/">Home</SmartLink></li>
            {crumbs.map((c) => <li key={c.href}><SmartLink href={c.href}>{c.label}</SmartLink></li>)}
            <li><span aria-current="page">{title}</span></li>
          </ol>
        </nav>
        <div className="ph-grid">
          <div>
            {(eyebrow || meta) && (
              <motion.p className="ph-meta" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
                {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                {meta && <span className="ph-updated">{meta}</span>}
              </motion.p>
            )}
            <h1 id="page-title">
              {words.map((w, i) => (
                <Fragment key={i}>
                  <span className="word"><motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.05 + i * 0.04, ease: EASE }}>{w}</motion.span></span>{" "}
                </Fragment>
              ))}
            </h1>
            {lede && <motion.p className="ph-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35, ease: EASE }}>{lede}</motion.p>}
            {children && <motion.div className="ph-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5, ease: EASE }}>{children}</motion.div>}
          </div>
          <svg className="ph-art" viewBox="0 0 220 220" aria-hidden="true" fill="none">
            <g stroke="#e3e4e4">{[44, 88, 132, 176].map((v) => <path key={v} d={`M0 ${v}H220M${v} 0V220`} />)}</g>
            {[[22, 154, 40, "#e6fef3"], [70, 106, 50, "#abfae3"], [128, 52, 62, color]].map(([x, y, s, f], i) => (
              <motion.rect key={i} x={x} y={y} width={s} height={s} rx="3" fill={f}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 170, damping: 14, delay: 0.3 + i * 0.14 }} />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ---------- Generic block heading ---------- */

export function BlockHead({ id, eyebrow, title, children }) {
  return (
    <Reveal className="sec-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id}>{title}</h2>
        <motion.span className="rule" aria-hidden="true" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }} />
      </div>
      {children}
    </Reveal>
  );
}

/* ---------- Search + filter list (Latest, Data Insights) ---------- */

export function FilterList({ items, facet = "type", facetLabel = "Type", topicLabel = "Topic", linkHref = "/latest" }) {
  const uid = useId();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("All");
  const [topic, setTopic] = useState("All");
  const [sort, setSort] = useState("new");

  const kinds = useMemo(() => ["All", ...new Set(items.map((i) => i[facet]).filter(Boolean))], [items, facet]);
  const topics = useMemo(() => ["All", ...[...new Set(items.map((i) => i.topic).filter(Boolean))].sort()], [items]);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = items.filter((i) =>
      (kind === "All" || i[facet] === kind) &&
      (topic === "All" || i.topic === topic) &&
      (!t || `${i.title} ${i.summary} ${i.authors}`.toLowerCase().includes(t)));
    return [...list].sort((a, b) => (sort === "new" ? b.iso.localeCompare(a.iso) : a.iso.localeCompare(b.iso)));
  }, [items, q, kind, topic, sort, facet]);

  const reset = () => { setQ(""); setKind("All"); setTopic("All"); };
  const filtered = q || kind !== "All" || topic !== "All";

  return (
    <div className="flist">
      <Reveal className="toolbar" role="search" aria-label="Filter publications">
        <div className="tb-search">
          <label htmlFor={`${uid}-q`}>Search</label>
          <div className="tb-input">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="7" cy="7" r="5" /><path d="m11 11 4 4" /></svg>
            <input id={`${uid}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Titles, summaries, authors" />
          </div>
        </div>
        {kinds.length > 2 && (
          <div className="tb-group">
            <span className="tb-label" id={`${uid}-k`}>{facetLabel}</span>
            <div className="filters" role="group" aria-labelledby={`${uid}-k`}>
              {kinds.map((k) => (
                <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>
                  {kind === k && <motion.span layoutId={`${uid}-pill`} className="pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className="lbl">{k}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="tb-selects">
          <div>
            <label htmlFor={`${uid}-t`}>{topicLabel}</label>
            <select id={`${uid}-t`} value={topic} onChange={(e) => setTopic(e.target.value)}>
              {topics.map((t) => <option key={t} value={t}>{t === "All" ? "All topics" : t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor={`${uid}-s`}>Sort</label>
            <select id={`${uid}-s`} value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
            </select>
          </div>
        </div>
      </Reveal>

      <div className="fl-status">
        <p role="status" aria-live="polite"><b>{shown.length}</b> of {items.length} shown</p>
        {filtered && <button type="button" className="linkish" onClick={reset}>Clear filters</button>}
      </div>

      <motion.ol className="pubs" layout>
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((it, i) => (
            <motion.li key={it.title} layout initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -5% 0px" }}
              exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.04, ease: EASE }}>
              <article className="pub">
                <div className="pub-meta">
                  {it[facet] && <span className="tag">{it[facet]}</span>}
                  <time dateTime={it.iso}>{it.date}</time>
                  {it.topic && <span className="pub-topic">{it.topic}</span>}
                </div>
                <h3><SmartLink href={it.href || linkHref}>{it.title}</SmartLink></h3>
                {it.summary && <p>{it.summary}</p>}
                {it.authors && <p className="by">By {it.authors}</p>}
                <span className="pub-go" aria-hidden="true">→</span>
              </article>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ol>

      {shown.length === 0 && (
        <div className="empty">
          <p><b>Nothing matches those filters.</b> Try a broader search or a different topic.</p>
          <button type="button" className="btn ghost" onClick={reset}>Clear filters</button>
        </div>
      )}
    </div>
  );
}

/* ---------- Accordion (FAQ, roles) ---------- */

export function Accordion({ items, headingLevel = 3 }) {
  const uid = useId();
  const [open, setOpen] = useState(null);
  const H = `h${headingLevel}`;
  return (
    <div className="accordion">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <Reveal className="acc-item" key={it.q} delay={i * 0.05}>
            <H className="acc-h">
              <button type="button" aria-expanded={isOpen} aria-controls={`${uid}-${i}`} id={`${uid}-b${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                <span>{it.q}{it.sub && <small>{it.sub}</small>}</span>
                <span className="acc-icon" aria-hidden="true" />
              </button>
            </H>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`${uid}-${i}`} role="region" aria-labelledby={`${uid}-b${i}`} className="acc-panel"
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}>
                  <div className="acc-body">{typeof it.a === "string" ? <p>{it.a}</p> : it.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ---------- Scroll-spy sub navigation ---------- */

export function SubNav({ items, label = "On this page" }) {
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef(null);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-35% 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-id="${active}"]`)?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [active]);
  return (
    <nav className="subnav" aria-label={label}>
      <div className="wrap">
        <ul ref={listRef}>
          {items.map((i) => (
            <li key={i.id}>
              <a href={`#${i.id}`} data-id={i.id} aria-current={active === i.id ? "true" : undefined} style={{ "--c": i.color }}>
                {i.color && <span className="dot" aria-hidden="true" />}{i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/* ---------- Accessible form with error summary ---------- */

export function ContactForm({ fields, submitLabel = "Send message", note, success = "Thanks, your message is ready to send. This is a concept build, so nothing was sent." }) {
  const uid = useId();
  const summaryRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // After a failed submit, move focus to the error summary so it is read out first.
  useEffect(() => { if (attempt) summaryRef.current?.focus(); }, [attempt]);

  const validate = (form) => {
    const e = {};
    fields.forEach((f) => {
      const el = form.elements[f.name];
      const v = el.value.trim();
      if (f.required && !v) e[f.name] = `${f.type === "select" ? "Choose" : "Enter"} ${f.article || "your"} ${f.label.toLowerCase()}.`;
      else if (f.type === "email" && v && !el.validity.valid) e[f.name] = "Enter an email address in the format name@example.com.";
      else if (f.min && v && v.length < f.min) e[f.name] = `${f.label} must be at least ${f.min} characters.`;
    });
    return e;
  };

  async function submit(ev) {
    ev.preventDefault();
    const e = validate(ev.currentTarget);
    setErrors(e);
    if (Object.keys(e).length) {
      setAttempt((n) => n + 1);
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 700));
    setBusy(false);
    setSent(true);
  }

  if (sent) {
    return (
      <motion.div className="form-done" role="status" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, ease: EASE }}>
        <span className="done-icon" aria-hidden="true">✓</span>
        <p><b>Message received.</b> {success}</p>
        <button type="button" className="btn ghost" onClick={() => setSent(false)}>Send another message</button>
      </motion.div>
    );
  }

  const list = Object.entries(errors);
  return (
    <form className="cform" onSubmit={submit} noValidate>
      {list.length > 0 && (
        <div className="err-summary" role="alert" tabIndex={-1} ref={summaryRef} aria-labelledby={`${uid}-es`}>
          <h2 id={`${uid}-es`}>Please fix {list.length} {list.length === 1 ? "problem" : "problems"}</h2>
          <ul>{list.map(([name, msg]) => <li key={name}><a href={`#${uid}-${name}`}>{msg}</a></li>)}</ul>
        </div>
      )}
      <div className="cf-grid">
        {fields.map((f) => {
          const id = `${uid}-${f.name}`;
          const err = errors[f.name];
          const common = {
            id, name: f.name, required: f.required, "aria-invalid": err ? true : undefined,
            "aria-describedby": [f.hint && `${id}-h`, err && `${id}-e`].filter(Boolean).join(" ") || undefined,
            autoComplete: f.autoComplete,
            onBlur: (e) => { if (errors[f.name] && e.target.value.trim()) setErrors((x) => { const n = { ...x }; delete n[f.name]; return n; }); },
          };
          return (
            <div className={`cf-field${f.wide ? " wide" : ""}`} key={f.name}>
              <label htmlFor={id}>{f.label}{f.required ? <span className="req" aria-hidden="true"> *</span> : <span className="opt"> (optional)</span>}</label>
              {f.hint && <p className="hint" id={`${id}-h`}>{f.hint}</p>}
              {err && <p className="cf-err" id={`${id}-e`}><span aria-hidden="true">! </span>{err}</p>}
              {f.type === "textarea" ? <textarea rows={6} {...common} />
                : f.type === "select" ? (
                  <select defaultValue="" {...common}>
                    <option value="" disabled>Choose a subject</option>
                    {f.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : <input type={f.type || "text"} {...common} />}
            </div>
          );
        })}
      </div>
      <p className="hint"><span aria-hidden="true">*</span> Required fields. {note}</p>
      <button className="btn" type="submit" disabled={busy} aria-busy={busy}>{busy ? "Sending…" : submitLabel}<span className="arrow" aria-hidden="true">→</span></button>
    </form>
  );
}

/* ---------- Monogram avatar for people ---------- */

const HUES = ["#00a5a6", "#009af1", "#6a3ecb", "#ea8d00", "#e62c11", "#29a629"];
export function Avatar({ name }) {
  const initials = name.split(/\s+/).filter((w) => /^[A-ZÀ-Ý]/.test(w)).map((w) => w[0]).slice(0, 2).join("");
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return <span className="avatar" aria-hidden="true" style={{ "--c": HUES[h % HUES.length] }}>{initials}</span>;
}

/* ---------- Timeline whose line draws as you scroll ---------- */

export function Timeline({ items }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  return (
    <ol className="timeline" ref={ref}>
      <motion.span className="tl-line" style={{ scaleY }} aria-hidden="true" />
      {items.map((it, i) => (
        <Reveal as="li" key={it.title || it.year} delay={0.05} className="tl-item">
          <span className="tl-dot" aria-hidden="true" />
          <p className="tl-when">{it.iso ? <time dateTime={it.iso}>{it.date}</time> : it.year}</p>
          {it.title && <h3>{it.title}</h3>}
          <p>{it.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/* ---------- Key facts ---------- */

export function Facts({ facts, color = "#00a5a6", label = "Key numbers" }) {
  return (
    <ul className="facts" aria-label={label} style={{ "--c": color }}>
      {facts.map(([value, text], i) => (
        <Reveal as="li" zoom delay={i * 0.07} key={text} className="fact">
          <b>{value}</b>
          <span>{text}</span>
        </Reveal>
      ))}
    </ul>
  );
}

/* ---------- Publication cards ---------- */

export function PubCards({ items }) {
  return (
    <ol className="pubs">
      {items.map((it, i) => (
        <Reveal as="li" key={it.href} delay={Math.min(i, 4) * 0.05} y={18}>
          <article className="pub">
            <div className="pub-meta">
              {it.type && <span className="tag">{it.type}</span>}
              <time dateTime={it.iso}>{it.date}</time>
              {it.topic && <span className="pub-topic">{it.topic}</span>}
            </div>
            <h3><SmartLink href={it.href}>{it.title}</SmartLink></h3>
            {it.summary && <p>{it.summary}</p>}
            {it.authors && <p className="by">By {it.authors}</p>}
            <span className="pub-go" aria-hidden="true">→</span>
          </article>
        </Reveal>
      ))}
    </ol>
  );
}

/* ---------- Citation with copy button ---------- */

export function CiteBox({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {}
  };
  return (
    <div className="cite">
      <p className="eyebrow" id="cite-h">Cite this work</p>
      <p className="cite-text" aria-labelledby="cite-h">{text}</p>
      <button type="button" className="btn ghost btn-sm" onClick={copy}>{copied ? "Copied ✓" : "Copy citation"}</button>
      <span className="sr-only" role="status" aria-live="polite">{copied ? "Citation copied to clipboard" : ""}</span>
    </div>
  );
}
