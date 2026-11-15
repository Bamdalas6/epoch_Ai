"use client";

import SmartLink from "@/components/SmartLink";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Fragment, useMemo, useRef } from "react";
import { LINKS } from "@/lib/nav";
import { EASE } from "@/components/Motion";

const COLORS = ["#00a5a6", "#34d2b9", "#009af1", "#6a3ecb", "#ea8d00"];

// Deterministic pseudo-random scatter so server and client render the same dots.
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

export default function Hero({ headline, lede }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const words = headline.split(" ");

  const dots = useMemo(() => {
    const r = rng(7);
    return Array.from({ length: 46 }, (_, i) => {
      const t = i / 45;
      const x = 30 + t * 440 + (r() - 0.5) * 30;
      const yy = 360 - Math.pow(t, 1.35) * 300 + (r() - 0.5) * 60;
      const q = (n) => Math.round(n * 10) / 10;
      return { x: q(x), y: q(Math.max(20, Math.min(372, yy))), r: q(3 + r() * 4), c: COLORS[Math.floor(r() * COLORS.length)], d: t };
    });
  }, []);

  return (
    <section className="hero" aria-labelledby="h-hero" ref={ref}>
      <div className="wrap hero-grid">
        <motion.div style={reduce ? undefined : { y: textY }}>
          <motion.p className="hero-kicker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            <span className="live" aria-hidden="true" />Independent research on AI · Updated weekly
          </motion.p>
          <h1 id="h-hero">
            {words.map((w, i) => (
              <Fragment key={i}>
                <span className="word">
                  <motion.span initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1 + 0.05 * i, ease: EASE }}>
                    {w === "AI" ? <em>{w}</em> : w}
                  </motion.span>
                </span>{" "}
              </Fragment>
            ))}
          </h1>
          <motion.p className="lede" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55, ease: EASE }}>
            {lede}
          </motion.p>
          <motion.div className="cta-row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7, ease: EASE }}>
            <SmartLink className="btn" href={LINKS.trends}>See all AI trends &amp; statistics<span className="arrow" aria-hidden="true">→</span></SmartLink>
            <SmartLink className="btn ghost" href="#data">Explore the data</SmartLink>
          </motion.div>
        </motion.div>

        <motion.div className="hero-art" aria-hidden="true" style={reduce ? undefined : { scale, y, opacity: fade }}>
          <svg viewBox="0 0 500 400" fill="none">
            <g stroke="#e3e4e4">
              {[60, 135, 210, 285, 360].map((v) => <path key={`h${v}`} d={`M20 ${v}H490`} />)}
              {[20, 137, 255, 372, 490].map((v) => <path key={`v${v}`} d={`M${v} 20V372`} />)}
            </g>
            {dots.map((d, i) => (
              <motion.circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} fillOpacity=".85"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.5 + d.d * 1.2 }} />
            ))}
            <motion.path d="M24 362 C 150 340, 260 270, 340 180 S 450 50, 486 28" stroke="#072b33" strokeWidth="3" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.8, delay: 0.6, ease: "easeInOut" }} />
          </svg>
          <motion.div className="hero-badge b1" initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.5, ease: EASE }}>
            <b>5×</b><span>per year<br />training compute</span>
          </motion.div>
          <motion.div className="hero-badge b2" initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 2.1, duration: 0.5, ease: EASE }}>
            <b>3,200+</b><span>models<br />tracked</span>
          </motion.div>
        </motion.div>
      </div>
      <motion.a href="#trends" className="scroll-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
        <span aria-hidden="true" className="mouse"><i /></span>Scroll to key trends
      </motion.a>
    </section>
  );
}
