"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAV } from "@/lib/nav";
import SearchPalette from "@/components/SearchPalette";
import SmartLink from "@/components/SmartLink";

export function Wordmark({ className = "wordmark" }) {
  return (
    <Link className={className} href="/">
      <i aria-hidden="true" />Epoch AI<span className="sr-only"> home</span>
    </Link>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [panel, setPanel] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef(null);
  const menuBtn = useRef(null);
  const btnRefs = useRef({});
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const here = (href) => href === pathname || (href !== "/" && pathname.startsWith(href + "/"));

  // Close menus after navigating to another page.
  useEffect(() => { setMenuOpen(false); setPanel(null); }, [pathname]);

  // Hide the bar while reading down; bring it back as soon as the visitor scrolls up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const busy = menuOpen || panel || searchOpen;
    if (y < 240 || busy) setHidden(false);
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
    const onClick = (e) => { if (!navRef.current?.contains(e.target)) setPanel(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("click", onClick); };
  }, [panel, menuOpen]);

  // Let sticky elements (sub-navs, charts) follow the header in and out.
  useEffect(() => { document.documentElement.dataset.header = hidden ? "hidden" : "shown"; }, [hidden]);

  // Lock page scroll behind the open mobile menu, and size the menu to the space under the header.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("locked", menuOpen);
    if (menuOpen) {
      const bottom = navRef.current?.closest("header")?.getBoundingClientRect().bottom ?? 68;
      root.style.setProperty("--menu-top", `${Math.round(bottom)}px`);
    }
  }, [menuOpen]);

  // Close an open mega-panel when focus leaves it (keyboard users tabbing onward).
  const onBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setPanel(null);
  };

  return (
    <>
      <motion.header className="site-header" onFocus={() => setHidden(false)} animate={{ y: hidden ? "-100%" : "0%" }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <div className="wrap bar">
          <Wordmark />
          <nav aria-label="Primary" ref={navRef} className="primary">
            <button ref={menuBtn} className="menu-btn" type="button" aria-expanded={menuOpen} aria-controls="nav-list"
              onClick={() => { setMenuOpen(!menuOpen); setPanel(null); }}>
              <span className={`burger${menuOpen ? " x" : ""}`} aria-hidden="true"><i /><i /><i /></span>
              {menuOpen ? "Close" : "Menu"}
            </button>
            <ul className={`nav-list${menuOpen ? " open" : ""}`} id="nav-list">
              {NAV.map((item) => {
                if (item.href) {
                  return <li key={item.label}><Link className="nav-link" href={item.href} aria-current={here(item.href) ? "page" : undefined} onClick={() => setMenuOpen(false)}>{item.label}</Link></li>;
                }
                const id = `panel-${item.label.replace(/\s+/g, "-").toLowerCase()}`;
                const open = panel === item.label;
                const active = item.groups.some((g) => g.links.some((l) => here(l.href)));
                return (
                  <li key={item.label} onBlur={onBlur}>
                    <button className={`nav-btn${active ? " is-here" : ""}`} type="button" aria-expanded={open} aria-controls={id}
                      ref={(el) => { btnRefs.current[item.label] = el; }}
                      onClick={() => setPanel(open ? null : item.label)}>
                      {item.label}
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div className="panel" id={id} style={{ "--cols": item.cols, transformOrigin: "top" }}
                          initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.18 }}>
                          {item.groups.map((g, gi) => (
                            <motion.div key={g.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * gi, duration: 0.25 }}>
                              <p className="panel-title" id={`${id}-${gi}`}>{g.title}</p>
                              <ul aria-labelledby={`${id}-${gi}`}>{g.links.map((l) => <li key={l.label}><SmartLink href={l.href} mark aria-current={here(l.href) ? "page" : undefined}>{l.label}</SmartLink></li>)}</ul>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </nav>
          <button type="button" className="search-btn" onClick={() => setSearchOpen(true)} aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K /">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="7" cy="7" r="5" /><path d="m11 11 4 4" /></svg>
            <span className="label">Search</span>
            <kbd aria-hidden="true">Ctrl K</kbd>
          </button>
        </div>
      </motion.header>
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
