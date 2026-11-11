"use client";

import { useEffect, useRef, useState } from "react";
import { projects, type ProjectRecord } from "./professional-data";
import FeetCodeBlueprint from "./FeetCodeBlueprint";

export default function ProfessionalProjects() {
  const featuredProject = projects.find((project) => project.id === "feetcode")!;
  const [selected, setSelected] = useState<ProjectRecord | null>(null);
  const [embedAuthorized, setEmbedAuthorized] = useState(false);
  const [activePanel, setActivePanel] = useState<"overview" | "approach" | "stack">("overview");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [demoOrigin] = useState("https://budget-pueblo-hamburger.ngrok-free.dev");

  useEffect(() => {
    setEmbedAuthorized(window.location.origin === demoOrigin);
  }, [demoOrigin]);

  useEffect(() => {
    const openFeetcodeStory = () => setSelected(featuredProject);
    window.addEventListener("portfolio:open-feetcode", openFeetcodeStory);
    return () => window.removeEventListener("portfolio:open-feetcode", openFeetcodeStory);
  }, [featuredProject]);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selected]);

  return <>
    <section className="pro-work pro-section" id="work" aria-labelledby="work-title">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">05</span><span>ONE FEATURED PROJECT / FULL-STACK</span><span className="pro-section-aside">INTERACTIVE CASE STUDY</span></div>
      <div className="work-intro pro-reveal"><h2 id="work-title">Consistency,<br/><em>engineered.</em></h2><p>A closer look at FeetCode: an accountability platform for building a steadier coding practice.</p></div>
      <div className="work-list work-list--featured">
        {[featuredProject].map((project) => <article className={`work-spread work-spread--${project.id} work-spread--${project.tone} pro-reveal`} key={project.id}>
          <button className="work-art" type="button" onClick={() => setSelected(project)} aria-label={`Read the ${project.name} case study`}>
            {project.image ? <img src={project.image} alt={project.imageAlt ?? ""} loading="lazy"/> : <span className="work-art__typography" aria-hidden="true">
              <span className="work-art__number">{project.number} <i>/</i> {project.year}</span>
              <strong>{project.name}</strong>
              <span className="work-art__subtitle">{project.subtitle}</span>
              <span className="work-art__seal">{project.id === "signalforge" ? "S—F" : project.id === "eureka" ? "E!" : project.id === "feetcode" ? "&lt;/&gt;" : "D—Q"}</span>
              <span className="work-art__note">A CODING PRACTICE, BUILT TOGETHER</span>
            </span>}
            {project.image && <span className="work-art__caption">{project.imageCaption}</span>}
            <span className="work-art__open" aria-hidden="true">OPEN STORY ↗</span>
          </button>
          <div className="work-copy">
            <div className="work-copy__meta"><span>{project.number} / {project.category}</span><span>{project.year}</span></div>
            <h3>{project.name}<i>.</i></h3>
            <p className="work-copy__subtitle">{project.subtitle}</p>
            <p className="work-copy__summary">{project.summary}</p>
          <div className="work-copy__footer">
              <span>{project.evidence === "user-listed-details-unavailable" ? "Project named · details not in repo" : project.technologies.length ? `${project.technologies.length} documented technologies` : "Stack not specified"}</span>
              <button type="button" onClick={() => setSelected(project)}>Read the case study <span aria-hidden="true">↗</span></button>
            </div>
          </div>
        </article>)}
      </div>
    </section>

    {selected && <div className="work-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section className="work-dialog" role="dialog" aria-modal="true" aria-labelledby="work-dialog-title" tabIndex={-1}>
        <header className="work-dialog__bar"><span>{selected.number} / CASE STUDY · {selected.year}</span><button ref={closeRef} type="button" onClick={() => setSelected(null)} aria-label="Close case study">CLOSE <span aria-hidden="true">×</span></button></header>
        <div className="work-dialog__scroll">
          <div className="work-dialog__heading"><p>{selected.category}</p><h2 id="work-dialog-title">{selected.name}<i>.</i></h2><h3>{selected.subtitle}</h3><p className="work-dialog__summary">{selected.summary}</p></div>
          {selected.id === "feetcode" && <section className="work-live-demo" aria-label="FeetCode live demo">
            <div className="work-live-demo__heading"><span>LIVE INTERACTIVE DEMO</span><strong>FeetCode / <i>in practice</i></strong></div>
            {embedAuthorized ? <iframe title="Interactive FeetCode live demo" src="https://feetcode-portfolio-demo.vercel.app/demo" allow="clipboard-read; clipboard-write"/> : <div className="work-live-demo__fallback"><div className="work-live-demo__statement"><span>THE LIVE PRODUCT</span><strong>Make consistency<br/>a shared habit.</strong><i>GOALS&nbsp; · &nbsp;CHALLENGES&nbsp; · &nbsp;PROGRESS</i></div><div><p>The live FeetCode demo is not authorized to embed on this portfolio origin. Open the deployed app to explore the real interactive experience.</p><a href="https://feetcode-portfolio-demo.vercel.app/demo" target="_blank" rel="noreferrer">Launch Live Demo ↗</a></div></div>}
            <a className="work-live-demo__original" href="https://feetcode.vercel.app/home" target="_blank" rel="noreferrer">Original FeetCode website ↗</a>
          </section>}
          {selected.id === "feetcode" && <FeetCodeBlueprint/>}
          {selected.image && <figure className="work-dialog__image"><img src={selected.image} alt={selected.imageAlt ?? ""}/>{selected.imageCaption && <figcaption>{selected.imageCaption}</figcaption>}</figure>}
          {selected.id === "feetcode" && <div className="work-case-tabs" role="tablist" aria-label="FeetCode case study panels">{(["overview", "approach", "stack"] as const).map((panel) => <button key={panel} type="button" role="tab" aria-selected={activePanel === panel} onClick={() => setActivePanel(panel)}>{panel}</button>)}</div>}
          <div className="work-dialog__columns">
            <section><span className="work-dialog__label">{activePanel === "approach" ? "MY CONTRIBUTION" : activePanel === "stack" ? "DOCUMENTED STACK" : "THE CONTEXT"}</span>{activePanel === "approach" ? <ul>{selected.contribution.map((item) => <li key={item}>{item}</li>)}</ul> : activePanel === "stack" ? <p>{selected.technologies.join(" · ")}</p> : <p>{selected.problem}</p>}</section>
            <section><span className="work-dialog__label">{activePanel === "approach" ? "PLATFORM AREAS" : activePanel === "stack" ? "TECHNICAL NOTE" : "BUILDING BLOCKS"}</span>{activePanel === "stack" ? <p>Stack details reflect the technologies documented for this project.</p> : <ul>{selected.features.map((item) => <li key={item}>{item}</li>)}</ul>}</section>
          </div>
          {selected.id === "feetcode" && <section className="work-tech-disclosure"><button type="button" aria-expanded={detailsOpen} onClick={() => setDetailsOpen(!detailsOpen)}>{detailsOpen ? "Hide" : "Explore"} technical notes <span>{detailsOpen ? "−" : "+"}</span></button>{detailsOpen && <div><p>{selected.problem}</p><ul>{selected.contribution.map((item) => <li key={item}>{item}</li>)}</ul></div>}</section>}
          <section className="work-dialog__features"><span className="work-dialog__label">FEATURES / AREAS OF WORK</span><div>{selected.features.map((feature) => <span key={feature}>{feature}</span>)}</div></section>
          <section className="work-dialog__stack"><span className="work-dialog__label">DOCUMENTED STACK</span>{selected.technologies.length ? <div>{selected.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div> : <p>{selected.technologyNote}</p>}</section>
          {selected.evidence === "user-listed-details-unavailable" && <aside className="work-evidence-note"><strong>DETAILS NEEDED FOR A FULL CASE STUDY</strong><p>Only the project name and short focus were included in the available information. Role, implementation, stack, images, and project links have not been inferred.</p></aside>}
          {selected.links.length > 0 && <section className="work-dialog__links"><span className="work-dialog__label">VISIT THE PROJECT</span><div>{selected.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</div></section>}
          <p className="work-dialog__honesty">Only available project evidence is shown. No product screenshots or unreported outcome metrics are implied.</p>
        </div>
      </section>
    </div>}
  </>;
}
