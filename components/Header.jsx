"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LINKS, NAV } from "@/lib/nav";
import SearchPalette from "@/components/SearchPalette";
import SmartLink from "@/components/SmartLink";

const EASE = [0.22, 1, 0.36, 1];

export function Wordmark({ className = "wordmark" }) {
  return (
    <Link className={className} href="/">
      <i aria-hidden="true" />Epoch AI<span className="sr-only"> home</span>
    </Link>
  );
}

const slug = (s) => s.replace(/\s+/g, "-").toLowerCase();

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);   // mobile drawer
  const [panel, setPanel] = useState(null);          // open dropdown (label)
  const [hover, setHover] = useState(null);          // hover highlight (desktop)
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef(null);
  const menuBtn = useRef(null);
  const btnRefs = useRef({});
  const timer = useRef(null);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const here = (href) => href === pathname || (href !== "/" && pathname.startsWith(href + "/"));

  // Close everything after navigating to another page.
  useEffect(() => { setMenuOpen(false); setPanel(null); }, [pathname]);

  // Hide the bar while reading down; bring it back as soon as the visitor scrolls up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    if (y < 240 || menuOpen || panel || searchOpen) setHidden(false);
    else if (y > prev + 4) setHidden(true);
    else if (y < prev - 4) setHidden(false);
  });

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !/input|textarea|select/i.test(e.target.tagName))) {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (e.key !== "Escape") return;
      if (panel) { btnRefs.current[panel]?.focus(); setPanel(null); }
      else if (menuOpen) { setMenuOpen(false); menuBtn.current?.focus(); }
    };
    const onClick = (e) => { if (!headerRef.current?.contains(e.target)) setPanel(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, [panel, menuOpen]);

  // Let sticky elements (sub-navs, charts) follow the header in and out.
  useEffect(() => { document.documentElement.dataset.header = hidden ? "hidden" : "shown"; }, [hidden]);

  // Mobile drawer: lock the page behind it and size it to the space under the header.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("locked", menuOpen);
    if (menuOpen) root.style.setProperty("--menu-top", `${Math.round(headerRef.current?.getBoundingClientRect().bottom ?? 68)}px`);
    return () => root.classList.remove("locked");
  }, [menuOpen]);

  // If the window grows past the mobile breakpoint, close the drawer.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 62rem)");
    const onChange = () => { if (mq.matches) setMenuOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Desktop hover intent: open after a short pause, close with a grace period so diagonal moves don't flicker.
  const isDesktopMouse = (e) => e.pointerType === "mouse" && window.matchMedia("(min-width: 62rem)").matches;
  const enter = (e, label) => {
    if (!isDesktopMouse(e)) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPanel(label), panel ? 0 : 90);
  };
  const leave = (e) => {
    if (!isDesktopMouse(e)) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPanel(null), 220);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  // Keyboard users tabbing out of the navigation close any open dropdown.
  const onNavBlur = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPanel(null); };

  return (
    <>
      <motion.header ref={headerRef} className={`site-header${scrolled ? " is-scrolled" : ""}${panel ? " has-panel" : ""}`}
        onFocus={() => setHidden(false)} animate={{ y: hidden ? "-100%" : "0%" }} transition={{ duration: 0.3, ease: EASE }}>
        <div className="wrap bar">
          <Wordmark />

          <nav aria-label="Primary" className="primary" onBlur={onNavBlur} onPointerLeave={leave}>
            <button ref={menuBtn} className="menu-btn" type="button" aria-expanded={menuOpen} aria-controls="nav-list"
              onClick={() => { setMenuOpen(!menuOpen); setPanel(null); }}>
              <span className={`burger${menuOpen ? " x" : ""}`} aria-hidden="true"><i /><i /><i /></span>
              {menuOpen ? "Close" : "Menu"}
            </button>

            <ul className={`nav-list${menuOpen ? " open" : ""}`} id="nav-list" onPointerLeave={() => setHover(null)}>
              {NAV.map((item) => {
                const hoverPill = hover === item.label && <motion.span layoutId="nav-hover" className="nav-hover" transition={{ type: "spring", stiffness: 500, damping: 38 }} />;
                if (item.href) {
                  return (
                    <li key={item.label} onPointerEnter={(e) => { setHover(item.label); leave(e); }}>
                      <Link className="nav-link" href={item.href} aria-current={here(item.href) ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                        {hoverPill}<span>{item.label}</span>
                      </Link>
                    </li>
                  );
                }
                const id = `panel-${slug(item.label)}`;
                const open = panel === item.label;
                const active = item.groups.some((g) => g.links.some((l) => here(l.href)));
                return (
                  <li key={item.label} className="has-panel" onPointerEnter={(e) => { setHover(item.label); enter(e, item.label); }}>
                    <button className={`nav-btn${active ? " is-here" : ""}`} type="button" aria-expanded={open} aria-controls={id}
                      ref={(el) => { btnRefs.current[item.label] = el; }}
                      onClick={() => { clearTimeout(timer.current); setPanel(open ? null : item.label); }}>
                      {hoverPill}<span>{item.label}</span><i className="chev" aria-hidden="true" />
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div className="mega" id={id}
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.22, ease: EASE }}>
                          <div className="wrap mega-inner" style={{ "--cols": item.cols }}>
                            {item.intro && (
                              <div className="mega-intro">
                                <p className="mega-title">{item.intro.title}</p>
                                <p>{item.intro.text}</p>
                                <Link className="more" href={item.intro.href}>{item.intro.cta}</Link>
                              </div>
                            )}
                            <div className="mega-groups">
                              {item.groups.map((g, gi) => (
                                <motion.div key={g.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * gi, duration: 0.25, ease: EASE }}>
                                  <p className="panel-title" id={`${id}-${gi}`}>{g.title}</p>
                                  <ul aria-labelledby={`${id}-${gi}`}>
                                    {g.links.map((l) => (
                                      <li key={l.label}><SmartLink href={l.href} mark aria-current={here(l.href) ? "page" : undefined}>{l.label}</SmartLink></li>
                                    ))}
                                  </ul>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
              <li className="drawer-cta"><Link className="btn" href={LINKS.subscribe} onClick={() => setMenuOpen(false)}>Subscribe to updates</Link></li>
            </ul>
          </nav>

          <div className="actions">
            <button type="button" className="search-btn" onClick={() => setSearchOpen(true)} aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K /">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="7" cy="7" r="5" /><path d="m11 11 4 4" /></svg>
              <span className="label">Search</span>
              <kbd aria-hidden="true">Ctrl K</kbd>
            </button>
            <Link className="btn btn-sm head-cta" href={LINKS.subscribe}>Subscribe</Link>
          </div>
        </div>
      </motion.header>
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
