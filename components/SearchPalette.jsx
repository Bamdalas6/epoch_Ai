"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { isExternal, SEARCH_INDEX } from "@/lib/nav";

/**
 * Quick-find dialog (Ctrl/Cmd + K or "/").
 * Native <dialog> gives a real modal: focus is trapped, Escape closes, the page behind is inert.
 * The input follows the ARIA combobox pattern so arrow keys move through results.
 */
export default function SearchPalette({ open, onClose }) {
  const ref = useRef(null);
  const input = useRef(null);
  const listId = useId();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return SEARCH_INDEX.slice(0, 8);
    return SEARCH_INDEX.filter((r) => `${r.label} ${r.group}`.toLowerCase().includes(t)).slice(0, 12);
  }, [q]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setQ("");
      setActive(0);
      requestAnimationFrame(() => input.current?.focus());
    } else if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => setActive(0), [q]);

  const go = (r) => {
    if (!r) return;
    onClose();
    if (isExternal(r.href)) window.location.href = r.href;
    else router.push(r.href);
  };

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Home") { e.preventDefault(); setActive(0); }
    else if (e.key === "End") { e.preventDefault(); setActive(results.length - 1); }
    else if (e.key === "Enter") { e.preventDefault(); go(results[active]); }
  };

  useEffect(() => {
    document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, listId]);

  return (
    <dialog ref={ref} className="palette" aria-labelledby={`${listId}-label`} onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="palette-box">
        <div className="palette-field">
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="7" cy="7" r="5" /><path d="m11 11 4 4" /></svg>
          <label id={`${listId}-label`} htmlFor={`${listId}-input`} className="sr-only">Search Epoch AI pages</label>
          <input ref={input} id={`${listId}-input`} type="text" role="combobox" autoComplete="off" spellCheck="false"
            placeholder="Search data, topics and pages…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
            aria-expanded={results.length > 0} aria-controls={listId} aria-autocomplete="list"
            aria-activedescendant={results.length ? `${listId}-${active}` : undefined} />
          <button type="button" className="palette-close" onClick={onClose}>Esc<span className="sr-only"> close search</span></button>
        </div>
        <ul id={listId} role="listbox" aria-label="Results" className="palette-list">
          {results.map((r, i) => (
            <li key={r.label + r.href} id={`${listId}-${i}`} role="option" aria-selected={i === active}
              onMouseMove={() => setActive(i)} onClick={() => go(r)}>
              <span>{r.label}{isExternal(r.href) && <span className="ext" aria-hidden="true">↗</span>}</span><small>{r.group}{isExternal(r.href) ? " · epoch.ai" : ""}</small>
            </li>
          ))}
        </ul>
        {results.length === 0 && <p className="palette-empty">No pages match “{q}”. Try “chips”, “models” or “FrontierMath”.</p>}
        <p className="sr-only" role="status" aria-live="polite">{q ? `${results.length} result${results.length === 1 ? "" : "s"}` : ""}</p>
        <p className="palette-hint" aria-hidden="true"><kbd>↑</kbd><kbd>↓</kbd> to move · <kbd>Enter</kbd> to open · <kbd>Esc</kbd> to close</p>
      </div>
    </dialog>
  );
}
