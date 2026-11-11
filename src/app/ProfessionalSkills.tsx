"use client";

import { useState } from "react";
import { skillGroups } from "./professional-data";

export default function ProfessionalSkills() {
  const [active, setActive] = useState(0);
  const group = skillGroups[active];

  return <section className="pro-skills pro-section" id="skills" aria-labelledby="skills-title">
    <div className="pro-section-heading pro-reveal"><span className="pro-section-index">06</span><span>TOOLS &amp; METHODS / A WORKING VOCABULARY</span><span className="pro-section-aside">NO SCORES · JUST PRACTICE</span></div>
    <div className="pro-skills__layout">
      <div className="pro-skills__intro pro-reveal"><span className="pro-skills__ornament" aria-hidden="true">S—S</span><h2 id="skills-title">A toolkit for<br/><em>making things.</em></h2><p>Choose a discipline to see the technologies in my working toolkit.</p></div>
      <div className="pro-skills__explorer pro-reveal">
        <div className="pro-skills__tabs" role="tablist" aria-label="Skill categories">
          {skillGroups.map((item, index) => <button key={item.label} id={`skill-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="skill-panel" tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
            event.preventDefault();
            const next = event.key === "Home" ? 0 : event.key === "End" ? skillGroups.length - 1 : (active + (event.key === "ArrowRight" ? 1 : -1) + skillGroups.length) % skillGroups.length;
            setActive(next);
            document.getElementById(`skill-tab-${next}`)?.focus();
          }}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}</button>)}
        </div>
        <div className="pro-skills__panel" id="skill-panel" role="tabpanel" aria-labelledby={`skill-tab-${active}`} key={active}>
          <span className="pro-skills__panel-label">FIELD {String(active + 1).padStart(2, "0")} / {skillGroups.length}</span>
          <h3>{group.label.toLowerCase()}</h3>
          <div className="pro-skills__items">{group.items.map((skill, index) => <span className="pro-skill-item" key={skill} style={{ "--skill-index": index } as React.CSSProperties}>{skill}</span>)}</div>
          <span className="pro-skills__count">{String(group.items.length).padStart(2, "0")} DOCUMENTED TOOLS</span>
        </div>
      </div>
    </div>
  </section>;
}
