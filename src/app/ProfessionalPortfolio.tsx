"use client";

import { useEffect } from "react";
import { education, experience, semesters, skillGroups, unweightedSemesterAverage, professionalLinks } from "./professional-data";
import ProfessionalProjects from "./ProfessionalProjects";
import ProfessionalArchives from "./ProfessionalArchives";

export default function ProfessionalPortfolio({ onOpenInteractive }: { onOpenInteractive: () => void }) {
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

  return <main className="professional-site" id="professional-top">
    <header className="pro-nav">
      <a className="pro-wordmark" href="#professional-top" aria-label="Samaira Sharma, home">S<span>/</span>S</a>
      <nav aria-label="Professional portfolio sections">
        <a href="#about">About</a><a href="#experience">Experience</a><a href="#journal">Journal</a><a href="#work">Work</a><a href="#achievements">Recognition</a><a href="#skills">Skills</a><a href="#contact">Contact</a>
      </nav>
      <button className="pro-interactive-link" type="button" onClick={onOpenInteractive}>Interactive View <span aria-hidden="true">↗</span></button>
    </header>

    <section className="pro-hero" aria-labelledby="pro-hero-title">
      <div className="pro-hero__copy">
        <p className="pro-eyebrow"><span className="pro-status-dot"/> SOFTWARE ENGINEER · MUMBAI, INDIA</p>
        <h1 id="pro-hero-title">Samaira<br/><em>Sharma</em><span className="pro-period">.</span></h1>
        <div className="pro-hero__bottom">
          <p>Building useful software at the intersection of <strong>artificial intelligence</strong>, thoughtful engineering, and <strong>financial technology.</strong></p>
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
          <div className="pro-semesters" aria-label="Semester SGPA scores">
            {semesters.map((term) => <div className={`pro-semester ${term.score === 10 ? "pro-semester--perfect" : ""}`} key={term.label}><span>SEM {term.label}</span><div className="pro-semester__track"><i style={{ width: `${term.score * 10}%` }}/></div><strong>{term.score.toFixed(2)}</strong></div>)}
          </div>
          <p className="pro-academics__note"><span>10.00 SGPA</span> — Semester 4</p>
        </div>
      </div>
    </section>

    <section className="pro-experience pro-section" id="experience">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">02</span><span>EXPERIENCE</span><span className="pro-section-aside">A RECORD OF LEARNING IN PRACTICE</span></div>
      <div className="pro-experience__intro pro-reveal"><h2>Where ideas<br/>meet <em>execution.</em></h2><p>Internships, engineering, and the communities that make technology move forward.</p></div>
      <div className="pro-timeline">
        {experience.map((item, index) => <article className="pro-role pro-reveal" key={item.name}>
          <span className="pro-role__index">0{index + 1}</span>
          <div className="pro-role__main"><div className="pro-role__meta"><span>{item.date}</span><span>{item.kind}</span></div><h3>{item.name}</h3><p className="pro-role__title">{item.role}</p><p className="pro-role__detail">{item.detail}</p>{item.contributions.length > 0 && <ul className="pro-role__contributions">{item.contributions.map((contribution) => <li key={contribution}>{contribution}</li>)}</ul>}{item.tags && <div className="pro-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}</div>
          <span className="pro-role__arrow" aria-hidden="true">↗</span>
        </article>)}
      </div>
    </section>

    <ProfessionalArchives />

    <ProfessionalProjects />

    <section className="pro-skills pro-section" id="skills">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">06</span><span>TOOLS &amp; METHODS</span></div>
      <div className="pro-skills__layout"><h2 className="pro-reveal">A toolkit for<br/><em>making things.</em></h2><div className="pro-skill-groups">{skillGroups.map((group) => <div className="pro-skill-group pro-reveal" key={group.label}><span>{group.label}</span><div>{group.items.map((skill) => <i key={skill}>{skill}</i>)}</div></div>)}</div></div>
    </section>

    <footer className="pro-contact" id="contact">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">07</span><span>CONTACT</span></div>
      <div className="pro-contact__main pro-reveal"><p>HAVE A THOUGHTFUL PROBLEM?</p><h2>Let’s make<br/><em>it matter.</em></h2><a className="pro-contact__email" href="mailto:samairasharma152@gmail.com">samairasharma152@gmail.com <span>↗</span></a></div>
      <div className="pro-contact__bottom"><span>Samaira Sharma · Software Engineer</span><div><a href={professionalLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={professionalLinks.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={professionalLinks.resume} target="_blank" rel="noreferrer">Résumé ↗</a><button type="button" onClick={onOpenInteractive}>Interactive View ↗</button></div><a href="#professional-top">Back to top ↑</a></div>
    </footer>
  </main>;
}
