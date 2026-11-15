"use client";

import SmartLink from "@/components/SmartLink";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CountUp, EASE, Reveal, ScrollZoom, Tilt } from "@/components/Motion";
import { HOME, LINKS } from "@/lib/nav";

export function SectionHead({ id, eyebrow, title, more, moreHref = HOME, moreSr, children }) {
  return (
    <Reveal className="sec-head">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id}>{title}</h2>
        <motion.span className="rule" aria-hidden="true" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }} />
      </div>
      {children}
      {more && <SmartLink className="more" href={moreHref}>{more}{moreSr && <span className="sr-only"> {moreSr}</span>}</SmartLink>}
    </Reveal>
  );
}

/* ---------- Key trends ---------- */

function CiBar({ value, range, color }) {
  const lo = Math.min(range[0], value);
  const hi = Math.max(range[1], value);
  const pad = (hi - lo) * 0.6 || 1;
  const min = lo - pad, max = hi + pad;
  const pct = (v) => `${((v - min) / (max - min)) * 100}%`;
  return (
    <span className="ci-bar" aria-hidden="true" style={{ "--c": color }}>
      <motion.span className="band" style={{ left: pct(range[0]), width: `calc(${pct(range[1])} - ${pct(range[0])})`, transformOrigin: "center" }}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.3, ease: EASE }} />
      <motion.span className="mark" style={{ left: pct(value) }}
        initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.8 }} />
    </span>
  );
}

export function Stats({ stats }) {
  return (
    <section className="stats-sec" id="trends" aria-labelledby="h-stats">
      <div className="wrap">
        <Reveal className="stats-head">
          <h2 id="h-stats">Key trends at a glance</h2>
          <p>Central estimates with 90% confidence intervals (CI). <SmartLink href={LINKS.trends}>All trends &amp; statistics</SmartLink></p>
        </Reveal>
        <ul className="stats">
          {stats.map((s, i) => (
            <Reveal as="li" zoom delay={(i % 3) * 0.08} className="stat" key={s.label} style={{ "--c": s.color }}>
              <p className="stat-topic"><span className="dot" aria-hidden="true" />{s.topic || s.label}</p>
              <h3><SmartLink href={s.href || LINKS.trends}>{s.label}</SmartLink></h3>
              <div className="fig">
                <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                <small>{s.unit}</small>
              </div>
              <p className="stat-text">{s.text}</p>
              <div className="ci">
                {s.range && <CiBar value={s.value} range={s.range} color={s.color} />}
                <span className="ci-row"><span>{s.ciLabel}</span><b>{s.ci}</b></span>
              </div>
              <span className="go" aria-hidden="true">→</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Trusted by ---------- */

export function Trusted({ names }) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="trusted">
      <div className="wrap trusted-head">
        <p className="eyebrow" id="h-trust">Cited by leading publications and institutions</p>
        <button type="button" className="pause" aria-pressed={paused} onClick={() => setPaused(!paused)}>
          <span aria-hidden="true">{paused ? "▶" : "❚❚"}</span> {paused ? "Play" : "Pause"}<span className="sr-only"> scrolling list</span>
        </button>
      </div>
      <div className={`marquee${paused ? " paused" : ""}`}>
        <ul aria-labelledby="h-trust">{names.map((n) => <li key={n}>{n}</li>)}</ul>
        <ul aria-hidden="true">{names.map((n) => <li key={n}>{n}</li>)}</ul>
      </div>
    </div>
  );
}

/* ---------- Featured ---------- */

export function Featured({ featured }) {
  const { lead, items } = featured;
  return (
    <section aria-labelledby="h-feat">
      <div className="wrap">
        <SectionHead id="h-feat" eyebrow="Featured" title="Reliable data and independent research" />
        <div className="featured">
          <ScrollZoom>
            <article className="lead-card">
              <svg viewBox="0 0 300 200" aria-hidden="true" fill="none">
                <g stroke="#e3e4e4"><path d="M0 40h300M0 80h300M0 120h300M0 160h300M60 0v200M120 0v200M180 0v200M240 0v200" /></g>
                {[[96, 96, 24, "#70efd1"], [150, 60, 32, "#34d2b9"], [204, 30, 46, "#072b33"]].map(([x, y, s, f], i) => (
                  <motion.rect key={i} x={x} y={y} width={s} height={s} rx="2" fill={f}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    initial={{ scale: 0, rotate: -20 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 160, damping: 13, delay: 0.2 + i * 0.15 }} />
                ))}
              </svg>
              <span className="tag">{lead.tag}</span>
              <h3><SmartLink href={lead.href || HOME}>{lead.title}</SmartLink></h3>
              <p>{lead.text}</p>
              <span className="more fake" aria-hidden="true">Open the database</span>
            </article>
          </ScrollZoom>
          <ul className="rows">
            {items.map((it, i) => (
              <Reveal as="li" delay={i * 0.08} key={it.title}>
                <div className="top"><span className="tag">{it.tag}</span>{it.date ? <span className="meta">{it.date}</span> : null}</div>
                <h3><SmartLink href={it.href || HOME}>{it.title}</SmartLink></h3>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- Latest work, with filters ---------- */

export function Latest({ items }) {
  const types = useMemo(() => ["All", ...new Set(items.map((i) => i.tag))], [items]);
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? items : items.filter((i) => i.tag === filter);
  const plural = (t) => `${t}s`;

  return (
    <section className="latest" id="latest" aria-labelledby="h-latest">
      <div className="wrap">
        <SectionHead id="h-latest" title="Our latest work" more="See the latest" moreHref={LINKS.latest} moreSr="publications" />
        <Reveal className="filters" role="group" aria-label="Filter latest work by type">
          {types.map((t) => (
            <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)}>
              {filter === t && <motion.span layoutId="pill" className="pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="lbl">{t === "All" ? "All" : plural(t)}</span>
              <span className="count">{t === "All" ? items.length : items.filter((i) => i.tag === t).length}</span>
            </button>
          ))}
        </Reveal>
        <p className="sr-only" role="status" aria-live="polite">{`Showing ${shown.length} ${filter === "All" ? "items" : plural(filter).toLowerCase()}`}</p>
        <motion.ul className="rows" layout>
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((it, i) => (
              <motion.li key={it.title} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }}>
                <div className="top"><time className="meta" dateTime={it.iso}>{it.date}</time><span className="tag">{it.tag}</span></div>
                <h3><SmartLink href={LINKS.latest}>{it.title}</SmartLink></h3>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}

/* ---------- Snapshot: scroll-driven chart story ---------- */

function buildSeries(snap) {
  const surgeRate = snap.surgePerYear || 6;
  const surge = (snap.surgeQuarters || []).map((q, i) => ({ q, v: surgeRate ** (i / 4), phase: "surge" }));
  const start = surge.length ? surgeRate : 1;
  const trend = snap.quarters.map((q, i) => ({ q, v: start * snap.growthPerYear ** (i / 4), phase: "trend" }));
  return [...surge, ...trend];
}

const W = 640, H = 320, X0 = 56, X1 = 624, BASE = 262, TOPV = 64;
const r2 = (n) => Math.round(n * 100) / 100;
const ylog = (v) => r2(BASE - (Math.log(v) / Math.log(TOPV)) * (BASE - 20));

function StoryChart({ series, focus }) {
  const bw = r2((X1 - X0) / series.length);
  const recentFrom = series.length - 3;
  const trendPts = series.map((d, i) => ({ ...d, i })).filter((d) => d.phase === "trend");
  const line = trendPts.map((d, k) => `${k ? "L" : "M"}${r2(X0 + d.i * bw + bw / 2)} ${ylog(d.v)}`).join(" ");
  const doublings = [6, 12, 24, 48];

  const lit = (d, i) => {
    if (focus === "surge") return d.phase === "surge";
    if (focus === "trend" || focus === "double") return d.phase === "trend";
    if (focus === "recent") return i >= recentFrom;
    return true;
  };

  const notes = {
    surge: { x: X0 + 2 * bw, y: ylog(4.5) - 18, text: "≈ 6× in one year" },
    trend: { x: X0 + 9 * bw, y: ylog(14) - 30, text: "2.5× per year" },
    double: { x: X0 + 9 * bw, y: ylog(14) - 30, text: "×2 every ~9 months" },
    recent: { x: X0 + (recentFrom + 1) * bw, y: ylog(48) - 26, text: "Slowdown? Not significant" },
  };
  const note = notes[focus];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="c-title c-desc">
      <title id="c-title">Illustrative fitted trend in quarterly additions of global AI computing capacity, 2023 Q1 to 2026 Q2, log scale</title>
      <desc id="c-desc">Additions grow about sixfold during 2023, then about 2.5 times per year from 2024, which is a doubling roughly every nine months.</desc>
      <g className="grid">
        {[1, 3, 10, 30].map((t) => (
          <g key={t}>
            <path d={`M${X0 - 8} ${ylog(t)}H${X1}`} />
            <text x={X0 - 14} y={ylog(t) + 4} textAnchor="end">{t}×</text>
          </g>
        ))}
      </g>
      <AnimatePresence>
        {focus === "double" && (
          <motion.g className="doubling" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {doublings.map((v, i) => (
              <motion.g key={v} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.12 }}>
                <path d={`M${X0 + 4 * bw} ${ylog(v)}H${X1}`} />
                {i > 0 && <text x={X1 - 4} y={ylog(v) - 5} textAnchor="end">×2</text>}
              </motion.g>
            ))}
          </motion.g>
        )}
      </AnimatePresence>
      <g>
        {series.map((d, i) => {
          const h = r2(BASE - ylog(d.v));
          const on = lit(d, i);
          return (
            <motion.rect key={d.q} x={r2(X0 + i * bw + 5)} width={r2(bw - 10)} y={r2(BASE - h)} height={h} rx="2"
              className={`bar ${d.phase}${on ? " on" : ""}${focus === "recent" && i >= recentFrom ? " dashed" : ""}`}
              style={{ transformBox: "fill-box", originY: 1 }}
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: EASE }} />
          );
        })}
      </g>
      <motion.path d={line} className="fit" initial={false}
        animate={{ pathLength: focus === "trend" || focus === "double" ? 1 : 0, opacity: focus === "trend" || focus === "double" ? 1 : 0 }}
        transition={{ duration: 0.9, ease: "easeInOut" }} />
      <path className="axis" d={`M${X0 - 8} ${BASE}H${X1}`} />
      <g textAnchor="middle" className="xlab">
        {series.map((d, i) => {
          const [year, quarter] = d.q.split(" ");
          return (
            <g key={d.q}>
              <text x={r2(X0 + i * bw + bw / 2)} y={BASE + 18}>{quarter}</text>
              {quarter === "Q1" && <text x={r2(X0 + i * bw + bw / 2)} y={BASE + 36} className="yr">{year}</text>}
            </g>
          );
        })}
      </g>
      <AnimatePresence mode="wait">
        {note && (
          <motion.g key={focus} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>
            <rect className="note-bg" x={note.x - 6} y={note.y - 17} width={note.text.length * 7.4 + 12} height="26" rx="13" />
            <text className="note" x={note.x + 6} y={note.y}>{note.text}</text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}

function Step({ step, index, total, onActive }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => { if (inView) onActive(index); }, [inView, index, onActive]);
  return (
    <li ref={ref} className="step" data-active={inView || undefined}>
      <p className="step-kicker"><span aria-hidden="true">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>{step.kicker}</p>
      <h3>{step.title}</h3>
      <p>{step.text}</p>
    </li>
  );
}

export function Snapshot({ snap }) {
  const series = useMemo(() => buildSeries(snap), [snap]);
  const [active, setActive] = useState(0);
  const steps = snap.steps?.length ? snap.steps : [{ focus: "trend", kicker: "Trend", title: snap.trend, text: snap.paragraphs?.[0] || "" }];
  const focus = steps[active]?.focus;

  return (
    <section aria-labelledby="h-snap" className="snap-sec">
      <div className="wrap">
        <SectionHead id="h-snap" eyebrow="Snapshots from our databases" title={snap.title} more="See more insights" moreHref={LINKS.insights} />
        <div className="story">
          <div className="story-chart">
            <figure className="chart">
              <div className="chart-top">
                <span className="trend">{snap.trend}</span>
                <ol className="dots" aria-hidden="true">
                  {steps.map((s, i) => <li key={s.title} className={i === active ? "on" : ""} />)}
                </ol>
              </div>
              <StoryChart series={series} focus={focus} />
              <figcaption>Illustrative fitted trend on a log scale, indexed to 2023 Q1 = 1; not the measured series. Source: Epoch AI, AI Chip Sales hub. CC-BY.</figcaption>
              <details>
                <summary>View chart data as a table</summary>
                <table>
                  <caption>Index of quarterly capacity additions (fitted)</caption>
                  <thead><tr><th scope="col">Quarter</th><th scope="col">Index</th></tr></thead>
                  <tbody>{series.map((d) => <tr key={d.q}><th scope="row">{d.q}</th><td>{d.v.toFixed(1)}</td></tr>)}</tbody>
                </table>
              </details>
            </figure>
          </div>
          <div className="story-steps">
            <ol>
              {steps.map((s, i) => <Step key={s.title} step={s} index={i} total={steps.length} onActive={setActive} />)}
            </ol>
            <Reveal className="story-end">
              <SmartLink className="btn" href={snap.href || LINKS.insights}>Read the full data insight<span className="arrow" aria-hidden="true">→</span></SmartLink>
              <p className="eyebrow gap" id="h-chips">More snapshots</p>
              <ul className="chips" aria-labelledby="h-chips">
                {snap.more.map((m) => <li key={m}><SmartLink href={LINKS.insights}>{m}</SmartLink></li>)}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Data explorers ---------- */

export function DataCards({ items }) {
  return (
    <section id="data" aria-labelledby="h-data" className="data-sec">
      <div className="wrap">
        <SectionHead id="h-data" eyebrow="Open data" title="Discover more data" more="See all data on AI" moreHref={LINKS.data} />
        <ul className="cards">
          {items.map((d, i) => (
            <Reveal as="li" zoom delay={i * 0.09} key={d.title}>
              <Tilt className="card" style={{ "--c": d.color }}>
                <i aria-hidden="true" />
                <h3><SmartLink href={d.href || LINKS.data}>{d.title}</SmartLink></h3>
                <p>{d.text}</p>
                <span className="go" aria-hidden="true">→</span>
              </Tilt>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Experts: accessible carousel ---------- */

export function Experts({ quotes }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.firstElementChild;
      if (!card) return;
      const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 0);
      setIndex(Math.min(quotes.length - 1, Math.round(el.scrollLeft / step)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [quotes.length]);

  const go = (dir) => {
    const el = track.current;
    const card = el.children[Math.max(0, Math.min(quotes.length - 1, index + dir))];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="experts" aria-labelledby="h-exp">
      <div className="wrap">
        <SectionHead id="h-exp" eyebrow="Endorsements" title="What experts say about Epoch AI">
          <div className="car-ctrl">
            <span className="car-count" aria-hidden="true"><b>{index + 1}</b> / {quotes.length}</span>
            <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-controls="quotes">
              <span aria-hidden="true">←</span><span className="sr-only">Previous quote</span>
            </button>
            <button type="button" onClick={() => go(1)} disabled={index >= quotes.length - 1} aria-controls="quotes">
              <span aria-hidden="true">→</span><span className="sr-only">Next quote</span>
            </button>
          </div>
        </SectionHead>
      </div>
      <div className="car-outer">
        <ul className="car" id="quotes" ref={track} tabIndex={0} aria-label="Expert quotes, scroll horizontally">
          {quotes.map((q, i) => (
            <Reveal as="li" key={q.name} delay={Math.min(i, 3) * 0.08} className={i === index ? "on" : ""}>
              <figure>
                <span className="qmark" aria-hidden="true">“</span>
                <blockquote><p>{q.text}</p></blockquote>
                <figcaption><b>{q.name}</b>{q.role}</figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Consultation ---------- */

export function Consult() {
  return (
    <section aria-labelledby="h-consult" className="consult-sec">
      <div className="wrap">
        <ScrollZoom from={0.92}>
          <div className="consult">
            <div>
              <p className="eyebrow">Work with our experts</p>
              <h2 id="h-consult">Trusted by leaders at OpenAI, DeepMind, and governments worldwide</h2>
              <p>Need deeper insights? Our team offers custom research and advisory services.</p>
            </div>
            <SmartLink className="btn" href={LINKS.consult}>Book a consultation<span className="arrow" aria-hidden="true">→</span></SmartLink>
            <svg className="consult-deco" viewBox="0 0 160 160" aria-hidden="true" fill="none">
              {[[0, 112, 48, "#e6fef3"], [56, 64, 48, "#abfae3"], [112, 16, 48, "#34d2b9"]].map(([x, y, s, f], i) => (
                <motion.rect key={i} x={x} y={y} width={s} height={s} fill={f}
                  initial={{ opacity: 0, y: y + 30 }} whileInView={{ opacity: 1, y }} viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease: EASE }} />
              ))}
            </svg>
          </div>
        </ScrollZoom>
      </div>
    </section>
  );
}

/* ---------- Newsletter ---------- */

export function Newsletter() {
  const [status, setStatus] = useState({ text: "", ok: false });
  const [invalid, setInvalid] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const input = e.currentTarget.elements.email;
    if (!input.validity.valid) {
      setInvalid(true);
      setStatus({ text: input.value ? "That email address looks incomplete. Check it, for example you@example.com." : "Enter your email address to subscribe.", ok: false });
      input.focus();
      return;
    }
    setInvalid(false);
    setBusy(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: input.value }),
      });
      const body = await res.json();
      setStatus({ text: res.ok ? body.message : body.detail || "Something went wrong. Please try again.", ok: res.ok });
    } catch {
      setStatus({ text: "The signup service could not be reached. You can subscribe on Substack instead.", ok: false });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="signup" aria-labelledby="h-news">
      <div className="wrap signup-grid">
        <Reveal>
          <p className="eyebrow">Gradient Updates</p>
          <h2 id="h-news">Stay informed</h2>
          <p>Get the latest updates on our research and weekly commentary on AI news and developments.</p>
        </Reveal>
        <Reveal as="form" delay={0.1} onSubmit={submit} noValidate>
          <label htmlFor="email">Email address</label>
          <div className="field">
            <input id="email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com"
              aria-describedby="email-hint email-status" aria-invalid={invalid || undefined} required />
            <button className="btn" type="submit" disabled={busy} aria-busy={busy}>{busy ? "Sending…" : "Subscribe"}</button>
          </div>
          <p className="hint" id="email-hint">One email a week. Unsubscribe at any time. Prefer Substack? <SmartLink href={LINKS.subscribe}>Subscribe there</SmartLink>.</p>
          <p className={`status${status.ok ? " ok" : status.text ? " err" : ""}`} id="email-status" role="status" aria-live="polite">
            {status.text && <span aria-hidden="true">{status.ok ? "✓ " : "! "}</span>}{status.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
