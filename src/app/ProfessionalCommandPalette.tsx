"use client";

import { useEffect, useRef, useState } from "react";

export type PortfolioCommand = {
  label: string;
  detail: string;
  href: string;
  external?: boolean;
  action?: "feetcode";
};

export default function ProfessionalCommandPalette({
  open,
  onClose,
  items,
  onFeetcode,
}: {
  open: boolean;
  onClose: () => void;
  items: PortfolioCommand[];
  onFeetcode: () => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = items.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (!open) { setQuery(""); setActive(0); return; }
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (active >= filtered.length) setActive(Math.max(0, filtered.length - 1));
  }, [active, filtered.length]);

  if (!open) return null;

  const choose = (item: PortfolioCommand) => {
    onClose();
    if (item.action === "feetcode") { onFeetcode(); return; }
    if (item.external) { window.open(item.href, "_blank", "noopener,noreferrer"); return; }
    document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <div className="command-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="command-palette" role="dialog" aria-modal="true" aria-labelledby="command-title" onKeyDown={(event) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      else if (event.key === "ArrowDown" && filtered.length) { event.preventDefault(); setActive((value) => (value + 1) % filtered.length); }
      else if (event.key === "ArrowUp" && filtered.length) { event.preventDefault(); setActive((value) => (value - 1 + filtered.length) % filtered.length); }
      else if (event.key === "Enter" && filtered[active]) { event.preventDefault(); choose(filtered[active]); }
      else if (event.key === "Tab") {
        const focusables = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('input,button:not([disabled])'));
        const first = focusables[0]; const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }}>
      <div className="command-palette__masthead"><span id="command-title">INDEX / SEARCH</span><span>PORTFOLIO · SS</span></div>
      <label className="command-palette__search"><span aria-hidden="true">⌕</span><input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} placeholder="Where would you like to go?" aria-label="Search portfolio sections" aria-controls="portfolio-command-list" aria-activedescendant={filtered[active] ? `portfolio-command-${active}` : undefined}/><kbd>ESC</kbd></label>
      <div className="command-palette__columns"><span>DESTINATION</span><span>SECTION</span></div>
      <div id="portfolio-command-list" className="command-palette__list" role="listbox" aria-label="Portfolio destinations">
        {filtered.length ? filtered.map((item, index) => <button id={`portfolio-command-${index}`} key={item.label} type="button" role="option" aria-selected={active === index} className={active === index ? "is-active" : ""} onMouseEnter={() => setActive(index)} onClick={() => choose(item)}><strong>{item.label}</strong><span>{item.detail}</span><i aria-hidden="true">{item.external ? "↗" : "↵"}</i></button>) : <p className="command-palette__empty">No matching section in this edition.</p>}
      </div>
      <footer className="command-palette__footer"><span><kbd>↑</kbd><kbd>↓</kbd> TO MOVE</span><span><kbd>ENTER</kbd> TO OPEN</span><button type="button" onClick={onClose} aria-label="Close command palette">CLOSE <b>×</b></button></footer>
    </section>
  </div>;
}
