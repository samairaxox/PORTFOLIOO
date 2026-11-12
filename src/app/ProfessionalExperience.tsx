"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { experience } from "./professional-data";

export default function ProfessionalExperience() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const panelRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);
  const followScrollRef = useRef(true);

  const choose = useCallback((index: number, manual = false) => {
    const next = Math.max(0, Math.min(experience.length - 1, index));
    if (manual) followScrollRef.current = false;
    activeRef.current = next;
    setActive(next);
  }, []);

  useEffect(() => {
    const scroller = panelRef.current?.closest<HTMLElement>(".professional-site");
    const section = panelRef.current;
    if (!scroller || !section) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect();
        const viewport = scroller.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (viewport.top + viewport.height * .68 - bounds.top) / Math.max(1, bounds.height)));
        setProgress(p);
        const target = Math.max(0, Math.min(experience.length - 1, Math.floor(p * experience.length)));
        if (followScrollRef.current && target !== activeRef.current) choose(target);
      });
    };
    const resumeScrollFollowing = () => { followScrollRef.current = true; };
    const resumeFromKeyboard = (event: KeyboardEvent) => {
      if (["PageDown", "PageUp", "ArrowDown", "ArrowUp", " "].includes(event.key) && !(event.target instanceof HTMLElement && event.target.closest("button,[role=tab]"))) resumeScrollFollowing();
    };
    scroller.addEventListener("scroll", update, { passive: true });
    scroller.addEventListener("wheel", resumeScrollFollowing, { passive: true });
    scroller.addEventListener("touchstart", resumeScrollFollowing, { passive: true });
    scroller.addEventListener("keydown", resumeFromKeyboard);
    window.addEventListener("resize", update);
    update();
    return () => { cancelAnimationFrame(frame); scroller.removeEventListener("scroll", update); scroller.removeEventListener("wheel", resumeScrollFollowing); scroller.removeEventListener("touchstart", resumeScrollFollowing); scroller.removeEventListener("keydown", resumeFromKeyboard); window.removeEventListener("resize", update); };
  }, [choose]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "ArrowDown") { event.preventDefault(); choose(activeRef.current + 1, true); }
      if (event.altKey && event.key === "ArrowUp") { event.preventDefault(); choose(activeRef.current - 1, true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [choose]);

  const item = experience[active];
  return <section className="pro-experience pro-section" id="experience" aria-labelledby="experience-title" ref={panelRef}>
    <div className="pro-section-heading pro-reveal"><span className="pro-section-index">02</span><span>EXPERIENCE / FIELD NOTES</span><span className="pro-section-aside">FIVE CHAPTERS · 2025—2027</span></div>
    <div className="pro-experience__intro pro-reveal"><h2 id="experience-title">A career in<br/><em>the making.</em></h2><p>Five chapters across engineering, finance, and developer community. Select a milestone to explore.</p></div>
    <div className="pro-journey" style={{"--journey-progress": `${progress * 100}%`} as React.CSSProperties}>
      <div className="pro-journey__rail" role="tablist" aria-label="Experience milestones" aria-orientation="vertical">
        <span className="pro-journey__cursor" aria-hidden="true" style={{ top: `${10 + (experience.length > 1 ? active / (experience.length - 1) * 80 : 0)}%` }}/>
        {experience.map((entry, index) => <button key={entry.name} role="tab" id={`journey-tab-${index}`} aria-selected={active === index} aria-controls="journey-panel" className={`pro-journey__stop ${active === index ? "is-active" : ""}`} onClick={() => choose(index, true)} onKeyDown={(event) => {
          if (!["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === "Home" ? 0 : event.key === "End" ? experience.length - 1 : Math.max(0, Math.min(experience.length - 1, active + (event.key === "ArrowDown" ? 1 : -1)));
          choose(next, true); document.getElementById(`journey-tab-${next}`)?.focus();
        }}><span className="pro-journey__number">{String(index + 1).padStart(2, "0")}</span><span className="pro-journey__stop-copy"><small>{entry.date}</small><strong>{entry.name}</strong></span></button>)}
      </div>
      <article className="pro-journey__panel" id="journey-panel" role="tabpanel" aria-labelledby={`journey-tab-${active}`} key={item.name}>
        <div className="pro-journey__panel-top"><span>CHAPTER {String(active + 1).padStart(2, "0")} / 0{experience.length}</span><span className={item.incoming ? "pro-journey__status is-upcoming" : "pro-journey__status"}>{item.incoming ? "UPCOMING" : item.kind}</span></div>
        <p className="pro-journey__date">{item.date}</p><h3>{item.name}<i>.</i></h3><p className="pro-journey__role">{item.role}</p><p className="pro-journey__detail">{item.detail}</p>
        {item.contributions.length > 0 && <ul className="pro-journey__contributions">{item.contributions.map((contribution) => <li key={contribution}>{contribution}</li>)}</ul>}
        {(item.tools ?? item.tags) && <div className="pro-journey__tools" aria-label="Documented technologies">{(item.tools ?? item.tags ?? []).map((tool) => <span key={tool}>{tool}</span>)}</div>}
        <div className="pro-journey__footer"><span>{item.incoming ? "A new chapter ahead" : "FIELD NOTE · VERIFIED EXPERIENCE"}</span><div><button type="button" onClick={() => choose(active - 1, true)} disabled={active === 0} aria-label="Previous experience">←</button><button type="button" onClick={() => choose(active + 1, true)} disabled={active === experience.length - 1} aria-label="Next experience">→</button></div></div>
      </article>
    </div>
    <p className="pro-journey__hint">Keyboard: ↑ / ↓ on a milestone · Alt + ↑ / ↓ anywhere</p>
  </section>;
}
