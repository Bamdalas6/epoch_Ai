"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import SmartLink from "@/components/SmartLink";
import { EASE, Reveal, Tilt } from "@/components/Motion";
import { Avatar } from "@/components/Page";

/* ---------- Data hub ---------- */

export function DataHub({ data }) {
  const uid = useId();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("All");
  const groups = useMemo(() => ["All", ...new Set(data.more.map((d) => d.group))], [data.more]);
  const shown = data.more.filter((d) =>
    (group === "All" || d.group === group) && `${d.title} ${d.text}`.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <section aria-labelledby="dh-feat" className="tight">
        <div className="wrap">
          <h2 id="dh-feat" className="sr-only">Featured datasets</h2>
          <ul className="dh-featured">
            {data.featured.map((d, i) => (
              <Reveal as="li" zoom delay={i * 0.08} key={d.title}>
                <Tilt className="dh-card" style={{ "--c": d.color }}>
                  <span className="dh-stat">{d.stat}</span>
                  <h3><SmartLink href={d.href}>{d.title}</SmartLink></h3>
                  <p>{d.text}</p>
                  <p className="meta">Updated {d.updated}</p>
                  <span className="go" aria-hidden="true">→</span>
                  <svg className="dh-spark" viewBox="0 0 120 40" aria-hidden="true" fill="none">
                    <motion.path d={`M2 ${36 - i * 2} C 30 ${34 - i}, 60 ${26 - i * 2}, 80 18 S 108 ${6 + i}, 118 4`} stroke="var(--c)" strokeWidth="2.5" strokeLinecap="round"
                      initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeInOut" }} />
                  </svg>
                </Tilt>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="dh-more">
        <div className="wrap">
          <Reveal className="sec-head">
            <div>
              <p className="eyebrow">Additional datasets</p>
              <h2 id="dh-more">Find a dataset</h2>
            </div>
          </Reveal>
          <Reveal className="toolbar compact" role="search" aria-label="Filter datasets">
            <div className="tb-search">
              <label htmlFor={`${uid}-q`}>Search datasets</label>
              <div className="tb-input">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="7" cy="7" r="5" /><path d="m11 11 4 4" /></svg>
                <input id={`${uid}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. chips, polling, GPU" />
              </div>
            </div>
            <div className="tb-group">
              <span className="tb-label" id={`${uid}-g`}>Area</span>
              <div className="filters" role="group" aria-labelledby={`${uid}-g`}>
                {groups.map((g) => (
                  <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(g)}>
                    {group === g && <motion.span layoutId={`${uid}-pill`} className="pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                    <span className="lbl">{g}</span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
          <p className="fl-status" role="status" aria-live="polite"><span><b>{shown.length}</b> of {data.more.length} datasets</span></p>
          <motion.ul className="ds-list" layout>
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((d) => (
                <motion.li key={d.title} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease: EASE }}>
                  <article className="ds">
                    <p className="ds-top"><span className="tag">{d.group}</span><span className="meta">Updated {d.updated}</span></p>
                    <h3><SmartLink href="https://epoch.ai/data">{d.title}</SmartLink></h3>
                    <p>{d.text}</p>
                  </article>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
          {shown.length === 0 && (
            <div className="empty"><p><b>No datasets match.</b> Try another word, or pick “All”.</p>
              <button type="button" className="btn ghost" onClick={() => { setQ(""); setGroup("All"); }}>Show all datasets</button></div>
          )}
          <Reveal className="licence">
            <p><b>Free to use.</b> All Epoch AI data is published under a Creative Commons Attribution licence. Download every dataset as ZIP files from the live data page.</p>
            <SmartLink className="btn ghost" href="https://epoch.ai/data" mark>Download our data</SmartLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ---------- Team directory ---------- */

export function TeamGrid({ team }) {
  const uid = useId();
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("Everyone");
  const t = q.trim().toLowerCase();
  const groups = team.groups.map((g) => ({
    ...g,
    people: g.people.filter(([n, r]) => !t || `${n} ${r}`.toLowerCase().includes(t)),
  })).filter((g) => (group === "Everyone" || g.name === group) && g.people.length);
  const total = groups.reduce((n, g) => n + g.people.length, 0);

  return (
    <section aria-labelledby="team-h" className="tight">
      <div className="wrap">
        <h2 id="team-h" className="sr-only">Team members</h2>
        <Reveal className="toolbar compact" role="search" aria-label="Find people">
          <div className="tb-search">
            <label htmlFor={`${uid}-q`}>Find a person</label>
            <div className="tb-input">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="7" cy="7" r="5" /><path d="m11 11 4 4" /></svg>
              <input id={`${uid}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name or role" />
            </div>
          </div>
          <div className="tb-group">
            <span className="tb-label" id={`${uid}-g`}>Team</span>
            <div className="filters" role="group" aria-labelledby={`${uid}-g`}>
              {["Everyone", ...team.groups.map((g) => g.name)].map((g) => (
                <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(g)}>
                  {group === g && <motion.span layoutId={`${uid}-pill`} className="pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className="lbl">{g}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>
        <p className="fl-status" role="status" aria-live="polite"><span><b>{total}</b> {total === 1 ? "person" : "people"}</span></p>
        {groups.map((g) => (
          <div key={g.name} className="team-group">
            <h3 className="tg-title">{g.name} <span>{g.people.length}</span></h3>
            <motion.ul className="people-grid" layout>
              <AnimatePresence mode="popLayout" initial={false}>
                {g.people.map(([n, r], i) => (
                  <motion.li key={n} layout initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, delay: (i % 4) * 0.04, ease: EASE }} className="person">
                    <Avatar name={n} />
                    <span><b>{n}</b><span>{r}</span></span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>
        ))}
        {total === 0 && <div className="empty"><p><b>No one matches “{q}”.</b></p><button type="button" className="btn ghost" onClick={() => { setQ(""); setGroup("Everyone"); }}>Show everyone</button></div>}
      </div>
    </section>
  );
}
