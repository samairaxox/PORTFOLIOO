"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { achievements, type AchievementRecord } from "./professional-data";

export default function ProfessionalAchievements() {
  const [selected, setSelected] = useState<AchievementRecord | null>(null);
  const [paused, setPaused] = useState(false);
  const reelRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const positionsRef = useRef<number[]>([]);
  const pausedRef = useRef(false);
  const reducedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const pause = useCallback((value: boolean) => {
    const shouldPause = value || reducedRef.current || Boolean(selected);
    pausedRef.current = shouldPause;
    setPaused(shouldPause);
  }, [selected]);

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current) pause(true);
    const reel = reelRef.current;
    if (!reel) return;
    const cards = cardsRef.current.filter((card): card is HTMLButtonElement => card !== null);
    if (!cards.length) return;

    let frame = 0;
    let lastTime = 0;
    let width = cards[0].getBoundingClientRect().width;
    let visible = false;
    const gap = () => Number.parseFloat(getComputedStyle(reel).columnGap) || 20;
    const place = () => cards.forEach((card, index) => { card.style.transform = `translate3d(${positionsRef.current[index] ?? index * (width + gap())}px,0,0)`; });
    const measure = () => {
      width = cards[0].getBoundingClientRect().width;
      positionsRef.current = cards.map((_, index) => index * (width + gap()));
      place();
    };
    measure();

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = Math.min((time - lastTime) / 1000, .05);
      lastTime = time;
      if (visible && !pausedRef.current && !document.hidden) {
        const spacing = gap();
        positionsRef.current = positionsRef.current.map((position) => position - 23 * delta);
        positionsRef.current.forEach((position, index, all) => {
          if (position + width < 0) all[index] = Math.max(...all.map((item) => item + width)) + spacing;
        });
        place();
      }
      frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(reel);
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", measure);
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", measure);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [pause]);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight") setSelected((current) => current ? achievements[(achievements.findIndex((item) => item.id === current.id) + 1) % achievements.length] : current);
      if (event.key === "ArrowLeft") setSelected((current) => current ? achievements[(achievements.findIndex((item) => item.id === current.id) - 1 + achievements.length) % achievements.length] : current);
    };
    window.addEventListener("keydown", closeOnEscape);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  const step = (direction: -1 | 1) => {
    const cards = cardsRef.current.filter((card): card is HTMLButtonElement => card !== null);
    if (cards.length < 2) return;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    pause(true);
    const width = cards[0].getBoundingClientRect().width;
    const stride = width + (Number.parseFloat(getComputedStyle(reelRef.current!).columnGap) || 20);
    cards.forEach((card) => { card.style.transition = reducedRef.current ? "none" : "transform 520ms cubic-bezier(.22,1,.36,1)"; });
    positionsRef.current = positionsRef.current.map((position) => position + direction * stride);
    cards.forEach((card, index) => { card.style.transform = `translate3d(${positionsRef.current[index]}px,0,0)`; });
    timerRef.current = window.setTimeout(() => {
      const right = reelRef.current?.clientWidth ?? 0;
      positionsRef.current.forEach((position, index, all) => {
        if (direction < 0 && position + width < 0) all[index] = Math.max(...all.map((item) => item + width)) + 20;
        if (direction > 0 && position > right) all[index] = Math.min(...all) - width - 20;
      });
      cards.forEach((card) => { card.style.transition = "none"; });
      cards.forEach((card, index) => { card.style.transform = `translate3d(${positionsRef.current[index]}px,0,0)`; });
      requestAnimationFrame(() => cards.forEach((card) => { card.style.transition = ""; }));
      pause(false);
    }, reducedRef.current ? 0 : 540);
  };

  const selectedIndex = selected ? achievements.findIndex((item) => item.id === selected.id) : -1;
  const closeStory = () => { setSelected(null); window.setTimeout(() => cardsRef.current[selectedIndex]?.focus(), 0); };

  return <>
    <section className="pro-achievements pro-section" id="achievements" aria-labelledby="achievements-title">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">04</span><span>RECOGNITION / THE HIGHLIGHT REEL</span><span className="pro-section-aside">04 DOCUMENTED MILESTONES</span></div>
      <div className="pro-achievements__heading pro-reveal"><h2 id="achievements-title">A few things<br/><em>worth keeping.</em></h2><p>Scroll with the reel, pause to look closer, or open a story for its supporting record.</p></div>
      <div className="pro-achievements__controls" aria-label="Achievement reel controls"><span>SELECTED MILESTONES · 2026</span><div><button type="button" onClick={() => step(1)} aria-label="Previous achievement">←</button><button type="button" onClick={() => step(-1)} aria-label="Next achievement">→</button></div></div>
      <div className={`pro-achievement-reel ${paused ? "pro-achievement-reel--paused" : ""}`} ref={reelRef} aria-label="Continuously moving achievement cards" onPointerEnter={(event) => { if (event.pointerType !== "touch") pause(true); }} onPointerLeave={(event) => { if (event.pointerType !== "touch" && !selected) pause(false); }} onFocusCapture={() => pause(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !selected) pause(false); }} onTouchStart={(event) => { const touch = event.touches[0]; touchStartRef.current = { x: touch.clientX, y: touch.clientY }; pause(true); }} onTouchEnd={(event) => { const start = touchStartRef.current; const touch = event.changedTouches[0]; if (start && Math.abs(touch.clientX - start.x) > 44 && Math.abs(touch.clientX - start.x) > Math.abs(touch.clientY - start.y)) step(touch.clientX < start.x ? -1 : 1); else if (!selected) window.setTimeout(() => pause(false), 1200); touchStartRef.current = null; }}>
        {achievements.map((item, index) => <button className={`pro-achievement-card pro-achievement-card--${item.id}`} type="button" key={item.id} ref={(node) => { cardsRef.current[index] = node; }} onClick={() => { pause(true); setSelected(item); }} aria-label={`Read ${item.title}: ${item.result}`}>
          <span className="pro-achievement-card__meta"><span>{item.number} / 04</span><span>{item.period || "CERTIFICATION"}</span></span>
          {item.image ? <span className="pro-achievement-card__image"><img src={item.image} alt="" draggable={false} loading="lazy"/></span> : <span className="pro-achievement-card__certificate" aria-hidden="true"><span>V—A</span><i/><strong>NISM</strong><small>Mutual Fund Distributors</small></span>}
          <span className="pro-achievement-card__copy"><span>{item.organization}</span><strong>{item.title}</strong><i>{item.result}</i></span>
          <span className="pro-achievement-card__action">OPEN STORY <b aria-hidden="true">↗</b></span>
        </button>)}
      </div>
      <div className="pro-achievements__foot"><span>Runner-Up · JPMorgan Chase Code for Good</span><span>Top 20 shortlisted · Finding the Next Signal</span><span>Finalist · DataZen</span><span>NISM Series V-A · Certified</span></div>
    </section>
    {selected && <div className="pro-achievement-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeStory(); }}>
      <section className="pro-achievement-story" role="dialog" aria-modal="true" aria-labelledby="achievement-story-title" tabIndex={-1}>
        <header className="pro-achievement-story__bar"><span>{selected.number} / 04 · {selected.result.toUpperCase()}</span><button type="button" ref={closeRef} onClick={closeStory} aria-label="Close achievement story">CLOSE <b aria-hidden="true">×</b></button></header>
        <div className="pro-achievement-story__content"><div className="pro-achievement-story__text"><span>{selected.organization}{selected.period && ` · ${selected.period}`}</span><h3 id="achievement-story-title">{selected.title}<i>.</i></h3><strong>{selected.result}</strong><p>{selected.description}</p></div>
          {selected.image ? <figure><img src={selected.image} alt={selected.imageAlt ?? selected.title}/><figcaption>{selected.imageCaption ?? "Supporting image from the portfolio archive."}<span>01 / 01 AVAILABLE IMAGES</span></figcaption></figure> : <div className="pro-achievement-story__no-image"><span>V—A</span><strong>NISM SERIES V-A</strong><p>No certificate image is available in the portfolio files.</p></div>}
        </div>
        <footer className="pro-achievement-story__footer"><button type="button" onClick={() => setSelected(achievements[(selectedIndex - 1 + achievements.length) % achievements.length])}>← PREVIOUS</button><span>{String(selectedIndex + 1).padStart(2,"0")} — 04</span><button type="button" onClick={() => setSelected(achievements[(selectedIndex + 1) % achievements.length])}>NEXT →</button></footer>
      </section>
    </div>}
  </>;
}
