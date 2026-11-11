"use client";

import { useEffect, useRef, useState } from "react";

/** A tiny paper-and-ink editor who keeps watch over the portfolio. */
export default function ProfessionalMascot() {
  const mascotRef = useRef<HTMLButtonElement>(null);
  const [noteOpen, setNoteOpen] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let frame = 0;
    let pointer: { x: number; y: number } | null = null;
    const follow = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const element = mascotRef.current;
        if (!element || !pointer) return;
        const bounds = element.getBoundingClientRect();
        const eyeX = bounds.left + bounds.width * .47;
        const eyeY = bounds.top + bounds.height * .36;
        const dx = Math.max(-3.5, Math.min(3.5, (pointer.x - eyeX) / 70));
        const dy = Math.max(-2.5, Math.min(2.5, (pointer.y - eyeY) / 80));
        element.style.setProperty("--mascot-eye-x", `${dx}px`);
        element.style.setProperty("--mascot-eye-y", `${dy}px`);
      });
    };

    window.addEventListener("pointermove", follow, { passive: true });
    return () => {
      window.removeEventListener("pointermove", follow);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <button
    ref={mascotRef}
    className={`pro-mascot${noteOpen ? " is-note-open" : ""}`}
    type="button"
    aria-label="Pip, the tiny editorial assistant. Show a note."
    aria-expanded={noteOpen}
    onClick={() => setNoteOpen((open) => !open)}
  >
    <span className="pro-mascot__note" aria-live="polite">{noteOpen ? "Pip says: keep following the interesting questions." : ""}</span>
    <svg viewBox="0 0 112 112" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pip-paper" x1=".1" y1="0" x2=".9" y2="1">
          <stop stopColor="#fff5e8"/><stop offset=".65" stopColor="#ead8c9"/><stop offset="1" stopColor="#c9a99b"/>
        </linearGradient>
        <linearGradient id="pip-ink" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#51343c"/><stop offset="1" stopColor="#281d24"/>
        </linearGradient>
      </defs>
      <ellipse cx="57" cy="98" rx="31" ry="6" fill="#170e13" opacity=".22"/>
      <path d="M31 77q2-25 25-28 26 3 29 28l-8 14H39z" fill="url(#pip-paper)" stroke="#9b7473" strokeWidth="1.5"/>
      <path d="M44 84q12-11 25 0" fill="none" stroke="#b37a7b" strokeWidth="2" strokeLinecap="round"/>
      <path d="M38 38q1-23 21-24 21 1 23 24l-4 18q-8 11-19 11-12 0-19-11z" fill="url(#pip-paper)" stroke="#86616a" strokeWidth="1.6"/>
      <path d="M38 34q4-22 22-22 19 0 23 22-13-9-23-8-11-1-22 8Z" fill="url(#pip-ink)" stroke="#251b21" strokeWidth="1.4"/>
      <path d="m52 20 7-11 7 11" fill="#9b6270" stroke="#6a414e" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M31 78q-12-3-13 2 2 6 13 6M82 78q12-3 13 2-2 6-13 6" fill="none" stroke="#9b7473" strokeWidth="2" strokeLinecap="round"/>
      <g className="pro-mascot__eyes">
        <ellipse cx="50" cy="43" rx="3.8" ry="5.2" fill="#35232a"/>
        <ellipse cx="70" cy="43" rx="3.8" ry="5.2" fill="#35232a"/>
        <circle cx="51" cy="41.5" r="1.25" fill="#fff8eb"/>
        <circle cx="71" cy="41.5" r="1.25" fill="#fff8eb"/>
      </g>
      <path d="m57 51 4 2-4 2-4-2z" fill="#a65c66"/>
      <path d="M57 56q4 4 8 0" fill="none" stroke="#7d5159" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="m77 69 15 21-4 3-16-20z" fill="#a97752" stroke="#704c3e" strokeWidth="1.2"/>
      <path d="m88 91 4-1-1 5z" fill="#e6c88f"/>
      <path d="M27 88v5m17-5v5" stroke="#79535a" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 94h9m12 0h9" stroke="#79535a" strokeWidth="1.7" strokeLinecap="round"/>
    </svg>
    <span className="pro-mascot__label" aria-hidden="true">PIP · EDITORIAL ASSISTANT</span>
  </button>;
}
