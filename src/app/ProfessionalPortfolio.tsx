"use client";

import { useEffect, useState } from "react";
import { education, semesters, unweightedSemesterAverage, professionalLinks } from "./professional-data";
import ProfessionalProjects from "./ProfessionalProjects";
import ProfessionalArchives from "./ProfessionalArchives";
import ProfessionalExperience from "./ProfessionalExperience";
import ProfessionalAchievements from "./ProfessionalAchievements";
import ProfessionalSkills from "./ProfessionalSkills";

export default function ProfessionalPortfolio({ onOpenInteractive }: { onOpenInteractive: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [emailCopied, setEmailCopied] = useState(false);
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".pro-reveal");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.dataset.visible = "true");
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".professional-site");
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".professional-site [id]"))
      .filter((node) => ["about", "experience", "journal", "achievements", "work", "skills", "contact"].includes(node.id));
    if (!root || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { root, rootMargin: "-18% 0px -58% 0px", threshold: [0, .2, .5, .8] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(professionalLinks.email); setEmailCopied(true); window.setTimeout(() => setEmailCopied(false), 1800); }
    catch { window.location.href = `mailto:${professionalLinks.email}`; }
  };

  const closeMenu = () => setMenuOpen(false);

  return <main className="professional-site" id="professional-top">
    <header className="pro-nav">
      <a className="pro-wordmark" href="#professional-top" aria-label="Samaira Sharma, home">S<span>/</span>S</a>
      <button className="pro-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="professional-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "CLOSE" : "MENU"}<span aria-hidden="true">{menuOpen ? "−" : "+"}</span></button>
      <nav id="professional-navigation" className={menuOpen ? "is-open" : ""} aria-label="Professional portfolio sections">
        <a aria-current={activeSection === "about" ? "location" : undefined} href="#about" onClick={closeMenu}>About</a><a aria-current={activeSection === "experience" ? "location" : undefined} href="#experience" onClick={closeMenu}>Experience</a><a aria-current={activeSection === "journal" ? "location" : undefined} href="#journal" onClick={closeMenu}>Journal</a><a aria-current={activeSection === "work" ? "location" : undefined} href="#work" onClick={closeMenu}>Work</a><a aria-current={activeSection === "achievements" ? "location" : undefined} href="#achievements" onClick={closeMenu}>Recognition</a><a aria-current={activeSection === "skills" ? "location" : undefined} href="#skills" onClick={closeMenu}>Skills</a><a aria-current={activeSection === "contact" ? "location" : undefined} href="#contact" onClick={closeMenu}>Contact</a>
      </nav>
      <button className="pro-interactive-link" type="button" onClick={onOpenInteractive}>Interactive View <span aria-hidden="true">↗</span></button>
    </header>

    <section className="pro-hero" aria-labelledby="pro-hero-title">
      <div className="pro-hero__copy">
        <p className="pro-eyebrow"><span className="pro-status-dot"/> SOFTWARE ENGINEER · MUMBAI, INDIA</p>
        <h1 id="pro-hero-title"><span className="pro-hero__line">SAMAIRA</span><span className="pro-hero__line pro-hero__line--second"><em>SHARMA</em><i>.</i></span></h1>
        <div className="pro-hero__bottom">
          <p><strong>AI ENGINEERING / SOFTWARE DEVELOPMENT / FINTECH</strong><br/>Building useful software at the intersection of intelligent systems, thoughtful engineering, and financial technology.</p>
          <a className="pro-text-link" href="#work">Explore selected work <span>↓</span></a>
        </div>
      </div>
      <figure className="pro-hero__portrait">
        <img src="/assets/about/personal-portrait.png" alt="Samaira in a colorful immersive light installation" />
        <figcaption><span>01 / PERSONAL ARCHIVE</span><span>CURIOUS BY DESIGN</span></figcaption>
        <span className="pro-portrait-index" aria-hidden="true">SS—26</span>
      </figure>
      <div className="pro-hero__coordinates" aria-hidden="true"><span>19°04′ N</span><i/><span>72°52′ E</span></div>
    </section>

    <section className="pro-about pro-section" id="about">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">01</span><span>ABOUT &amp; ACADEMICS</span></div>
      <div className="pro-about__layout">
        <div className="pro-about__story pro-reveal">
          <h2>Curiosity,<br/>made <em>useful.</em></h2>
          <div className="pro-copy-block"><p>I’m a B.Tech Information Technology student at K. J. Somaiya College of Engineering, Mumbai. I’m drawn to the point where intelligent systems meet practical, human-centered software.</p><p>I enjoy making complex ideas easier to use—whether that means automating a financial workflow, shaping an AI product, or refining the details of an interface.</p></div>
          <div className="pro-education"><span>EDUCATION</span><strong>{education.degree}</strong><p>{education.institution}, {education.location} <i>·</i> Expected {education.graduation}</p></div>
        </div>
        <div className="pro-academics pro-reveal">
          <div className="pro-academics__top"><span>ACADEMIC PERFORMANCE</span><span>01 — 04</span></div>
          <div className="pro-academics__score"><strong>{unweightedSemesterAverage}</strong><span>/ 10</span></div>
          <p className="pro-academics__caption">Unweighted average of four semester SGPAs</p>
          <svg className="pro-semester-chart" viewBox="0 0 500 148" role="img" aria-label={`Semester SGPA scores: ${semesters.map((term) => `semester ${term.label}, ${term.score.toFixed(2)}`).join("; ")}`}>
            <path className="pro-semester-chart__guide" d="M25 112H475M25 67H475M25 22H475"/>
            <polyline className="pro-semester-chart__line" points={semesters.map((term, index) => `${35 + index * 143},${112 - ((term.score - 9.4) / 0.6) * 78}`).join(" ")}/>
            {semesters.map((term, index) => {
              const x = 35 + index * 143;
              const y = 112 - ((term.score - 9.4) / 0.6) * 78;
              return <g className={term.score === 10 ? "pro-semester-chart__point pro-semester-chart__point--perfect" : "pro-semester-chart__point"} key={term.label}>
                <circle cx={x} cy={y} r={term.score === 10 ? 6 : 4}/>
                <text className="pro-semester-chart__score" x={x} y={y - 13} textAnchor="middle">{term.score.toFixed(2)}</text>
                <text className="pro-semester-chart__term" x={x} y="142" textAnchor="middle">SEM {term.label}</text>
              </g>;
            })}
          </svg>
          <p className="pro-academics__note"><span>10.00 SGPA</span> — Semester 4</p>
        </div>
      </div>
    </section>

    <ProfessionalExperience />

    <ProfessionalArchives />

    <ProfessionalAchievements />

    <ProfessionalProjects />

    <ProfessionalSkills />

    <footer className="pro-contact" id="contact">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">07</span><span>CONTACT</span></div>
      <div className="pro-contact__main pro-reveal"><p>HAVE A THOUGHTFUL PROBLEM?</p><h2>Let’s make<br/><em>it matter.</em></h2><a className="pro-contact__email" href={`mailto:${professionalLinks.email}`}>{professionalLinks.email} <span>↗</span></a><button className="pro-copy-email" type="button" onClick={copyEmail}>{emailCopied ? "Email copied ✓" : "Copy email ↗"}</button><a className="pro-resume-link" href={professionalLinks.resume} download>Download résumé (PDF) <span>↓</span></a></div>
      <div className="pro-contact__bottom"><span>Samaira Sharma · Software Engineer</span><div><a href={professionalLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={professionalLinks.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={professionalLinks.resume} target="_blank" rel="noreferrer">Résumé ↗</a><button type="button" onClick={onOpenInteractive}>Interactive View ↗</button></div><a href="#professional-top">Back to top ↑</a></div>
    </footer>
  </main>;
}
