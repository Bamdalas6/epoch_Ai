"use client";

import { animate, motion, MotionConfig, useInView, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const EASE = [0.22, 1, 0.36, 1];

/** Honours the visitor's "reduce motion" setting for every animation below. */
export function MotionRoot({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Fade + rise (and optional zoom) when the element scrolls into view. */
export function Reveal({ as = "div", children, delay = 0, zoom = false, y = 28, ...rest }) {
  const M = motion[as];
  return (
    <M
      initial={{ opacity: 0, y, scale: zoom ? 0.92 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </M>
  );
}

/** Zoom tied to scroll position: grows from `from` to `to` as it enters the screen. */
export function ScrollZoom({ children, from = 0.88, to = 1, className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [from, to]), { stiffness: 140, damping: 26 });
  const opacity = useTransform(scrollYProgress, [0, 0.45], [0.4, 1]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { scale, opacity }}>
      {children}
    </motion.div>
  );
}

/** Gentle vertical parallax for decorative layers. */
export function Parallax({ children, distance = 60, className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }} aria-hidden="true">
      {children}
    </motion.div>
  );
}

/** Number that counts up once, when first seen. Screen readers get the final value only. */
export function CountUp({ value, decimals = 0, prefix = "", suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const fmt = (v) => `${prefix}${v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
  const [text, setText] = useState(fmt(value));

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, { duration: 1.6, ease: EASE, onUpdate: (v) => setText(fmt(v)) });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <span ref={ref}>
      <span className="sr-only">{fmt(value)}</span>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}

/** Thin reading-progress bar at the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}

/** "Back to top" button that appears after the first screen. */
export function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 900));
  const go = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("top")?.focus({ preventScroll: true });
  };
  return (
    <motion.button
      type="button"
      className="to-top"
      onClick={go}
      initial={false}
      animate={show ? { opacity: 1, y: 0, pointerEvents: "auto" } : { opacity: 0, y: 16, pointerEvents: "none" }}
      transition={{ duration: 0.3, ease: EASE }}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 15V3M3.5 8.5 9 3l5.5 5.5" /></svg>
      <span className="sr-only">Back to top</span>
    </motion.button>
  );
}

/** Card that tilts slightly toward the pointer. */
export function Tilt({ as: Tag = "div", children, className, style }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const move = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--ry", `${x * 7}deg`);
    ref.current.style.setProperty("--rx", `${-y * 7}deg`);
  };
  const leave = () => {
    ref.current.style.setProperty("--ry", "0deg");
    ref.current.style.setProperty("--rx", "0deg");
  };
  return (
    <Tag ref={ref} className={className} style={style} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </Tag>
  );
}
