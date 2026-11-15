"use client";

import { motion } from "motion/react";
import { useState } from "react";
import SmartLink from "@/components/SmartLink";
import { EASE, Reveal } from "@/components/Motion";
import { SubNav } from "@/components/Page";

const MODES = [
  { id: "x", label: "Increase per year" },
  { id: "dbl", label: "Doubling time" },
  { id: "oom", label: "Orders of magnitude per year" },
];

const fmt = (n, d = 1) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const months = (f) => (12 * Math.LN2) / Math.log(f);

function growth(f, mode) {
  if (mode === "dbl") {
    const m = months(f);
    return m < 24 ? { v: fmt(m), u: "months to double" } : { v: fmt(m / 12), u: "years to double" };
  }
  if (mode === "oom") return { v: fmt(Math.log10(f), 2), u: "OOM / year" };
  return { v: `${f < 2 ? fmt(f, 2) : fmt(f, f % 1 ? 1 : 0)}×`, u: "per year" };
}

function range(r, mode) {
  if (!r) return null;
  if (mode === "dbl") {
    const [a, b] = [months(r[1]), months(r[0])];
    return a < 24 ? `${fmt(a)} to ${fmt(b)} months` : `${fmt(a / 12)} to ${fmt(b / 12)} years`;
  }
  if (mode === "oom") return `${fmt(Math.log10(r[0]), 2)} to ${fmt(Math.log10(r[1]), 2)} OOM`;
  return `${r[0]}× to ${r[1]}×`;
}

function StatCard({ s, mode, color, i }) {
  const g = s.kind === "growth" ? growth(s.factor, mode) : { v: s.display, u: s.unit };
  const ci = s.kind === "growth" ? range(s.range, mode) : s.ci;
  return (
    <Reveal as="li" zoom delay={(i % 3) * 0.07} className="tstat" style={{ "--c": color }}>
      <h3>{s.label}</h3>
      <p className="fig" aria-live="off">
        <motion.span key={g.v} initial={{ opacity: 0.2, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
          {g.v}
        </motion.span>
        <small>{g.u}</small>
      </p>
      <p className="stat-text">{s.text}</p>
      {ci && <p className="ci-row"><span>90% CI</span><b>{ci}</b></p>}
    </Reveal>
  );
}

export default function TrendsDashboard({ trends }) {
  const [mode, setMode] = useState("x");
  const nav = trends.groups.map((g) => ({ id: g.id, label: g.name, color: g.color }));

  return (
    <>
      <div className="wrap">
        <Reveal className="mode-bar">
          <fieldset className="seg">
            <legend>Show growth values as</legend>
            <div className="seg-opts">
              {MODES.map((m) => (
                <label key={m.id} className={mode === m.id ? "on" : ""}>
                  <input type="radio" name="mode" value={m.id} checked={mode === m.id} onChange={() => setMode(m.id)} />
                  {mode === m.id && <motion.span layoutId="seg" className="seg-pill" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="sr-only" role="status" aria-live="polite">{`Growth values now shown as ${MODES.find((m) => m.id === mode).label.toLowerCase()}.`}</p>
        </Reveal>
        <div className="t-intro">
          {trends.intro.map((p, i) => <Reveal as="p" key={i} delay={i * 0.1}>{p}</Reveal>)}
        </div>
      </div>

      <SubNav items={nav} label="Trend categories" />

      {trends.groups.map((g) => (
        <section key={g.id} id={g.id} className="tgroup" aria-labelledby={`${g.id}-h`} style={{ "--c": g.color }}>
          <div className="wrap tg-grid">
            <div className="tg-side">
              <Reveal>
                <p className="tg-name"><span className="dot" aria-hidden="true" />{g.name}</p>
                <h2 id={`${g.id}-h`}>{g.headline}</h2>
                <p>{g.text}</p>
              </Reveal>
              {g.data && (
                <Reveal delay={0.1}>
                  <SmartLink className="data-link" href={g.data.href}>
                    <span className="eyebrow">Data on AI</span>
                    <b>{g.data.title}</b>
                    <span>{g.data.text}</span>
                    <span className="arrow" aria-hidden="true">→</span>
                  </SmartLink>
                </Reveal>
              )}
            </div>
            <ul className="tstats">
              {g.stats.map((s, i) => <StatCard key={s.label} s={s} mode={mode} color={g.color} i={i} />)}
            </ul>
          </div>
        </section>
      ))}
    </>
  );
}
