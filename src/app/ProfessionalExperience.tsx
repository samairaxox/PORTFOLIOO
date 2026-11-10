"use client";

import { useEffect, useRef, useState } from "react";
import { experience } from "./professional-data";

export default function ProfessionalExperience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeline = timelineRef.current;
    const scroller = timeline?.closest<HTMLElement>(".professional-site");
    if (!timeline || !scroller) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = timeline.getBoundingClientRect();
        const linePosition = scroller.clientHeight * 0.72;
        const amount = (linePosition - rect.top) / Math.max(rect.height, 1);
        setProgress(Math.max(0, Math.min(1, amount)));
      });
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <section className="pro-experience pro-section" id="experience" aria-labelledby="experience-title">
    <div className="pro-section-heading pro-reveal"><span className="pro-section-index">02</span><span>EXPERIENCE / FIELD NOTES</span><span className="pro-section-aside">FIVE CHAPTERS · 2025—2027</span></div>
    <div className="pro-experience__intro pro-reveal"><h2 id="experience-title">Where ideas<br/>meet <em>execution.</em></h2><p>Engineering work, industry practice, and developer communities. Open a chapter for its details.</p></div>
    <div className="pro-timeline" ref={timelineRef} style={{ "--timeline-progress": `${progress * 100}%` } as React.CSSProperties}>
      {experience.map((item, index) => {
        const isOpen = expanded === index;
        const detailsId = `professional-experience-${index}`;
        return <article className="pro-role pro-reveal" data-side={index % 2 ? "right" : "left"} key={item.name}>
          <span className="pro-role__index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div className="pro-role__main">
            <button className="pro-role__toggle" type="button" aria-expanded={isOpen} aria-controls={detailsId} onClick={() => setExpanded(isOpen ? null : index)}>
              <span className="pro-role__meta"><span>{item.date}</span><span>{item.kind}</span></span>
              <span className="pro-role__company">{item.name}{item.incoming && <i>INCOMING</i>}</span>
              <span className="pro-role__title">{item.role}</span>
              <span className="pro-role__expand" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            <div className={`pro-role__details ${isOpen ? "pro-role__details--open" : ""}`} id={detailsId} aria-hidden={!isOpen}>
              <div className="pro-role__details-inner"><p>{item.detail}</p>{item.contributions.length > 0 && <ul>{item.contributions.map((contribution) => <li key={contribution}>{contribution}</li>)}</ul>}{item.tools && <div className="pro-tags" aria-label="Documented tools">{item.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>}</div>
            </div>
          </div>
        </article>;
      })}
    </div>
  </section>;
}
