"use client";

import { useEffect } from "react";

const semesters = [
  { label: "01", score: 9.54 },
  { label: "02", score: 9.64 },
  { label: "03", score: 9.72 },
  { label: "04", score: 10.0 },
];

const experience = [
  { date: "SUMMER 2027", kind: "INCOMING", name: "JPMorgan Chase", role: "Software Engineering Intern", detail: "An upcoming internship. Details will be added after the role begins." },
  { date: "MAY — JULY 2026", kind: "INTERNSHIP", name: "Investigen", role: "AI Intern", detail: "Mutual-fund data automation, SID/KIM compliance checking, and Scheme Information Document generation.", tags: ["Python", "Pandas", "PostgreSQL", "PDF processing"] },
  { date: "MAY — AUGUST 2025", kind: "INTERNSHIP", name: "Orcawise", role: "Software Engineer Intern", detail: "Contributed to AI chatbot architecture and workflow design using LangChain and FAISS, alongside feature development and application integration.", tags: ["LangChain", "FAISS"] },
  { date: "AUGUST 2025 — PRESENT", kind: "COMMUNITY", name: "CodeCell KJSCE", role: "Marketing Team Member", detail: "Co-hosted technical onboarding sessions for students and supported industry outreach." },
  { date: "2025 — 2026", kind: "COMMUNITY", name: "Google Developer Groups", role: "Core Team Member", detail: "Co-hosted a Golang technical session and supported developer workshops." },
];

const achievements = [
  { title: "Code for Good", result: "Runner-Up", detail: "JPMorgan Chase · Mumbai · 2026", image: "/assets/achievements/jpmorgan-code-for-good.png", alt: "Code for Good event materials and certificate" },
  { title: "Finding the Next Signal", result: "Top 20 shortlisted", detail: "Investment Research Competition · 2026", image: "/assets/achievements/finding-the-next-signal.png", alt: "Finding the Next Signal competition poster" },
  { title: "DataZen", result: "Finalist", detail: "Case Study Competition · 2026", image: "/assets/achievements/datazen-certificate.png", alt: "DataZen Certificate of Appreciation" },
  { title: "NISM Series V-A", result: "Certified", detail: "Mutual Fund Distributors Certification" },
];

const skillGroups = [
  { label: "LANGUAGES & DATA", items: ["Python", "TypeScript", "JavaScript", "SQL", "C++", "Pandas", "PostgreSQL"] },
  { label: "AI & SEARCH", items: ["LangChain", "LangGraph", "FAISS", "HuggingFace"] },
  { label: "PRODUCT ENGINEERING", items: ["React", "Next.js", "FastAPI", "Flask", "Tailwind CSS", "Electron"] },
  { label: "PLATFORMS", items: ["MongoDB", "Firebase", "Git", "GitHub"] },
];

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
        <a href="#about">About</a><a href="#experience">Experience</a><a href="#work">Work</a><a href="#achievements">Recognition</a>
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
          <div className="pro-education"><span>EDUCATION</span><strong>B.Tech, Information Technology</strong><p>K. J. Somaiya College of Engineering, Mumbai <i>·</i> Expected 2028</p></div>
        </div>
        <div className="pro-academics pro-reveal">
          <div className="pro-academics__top"><span>ACADEMIC PERFORMANCE</span><span>01 — 04</span></div>
          <div className="pro-academics__score"><strong>9.73</strong><span>/ 10</span></div>
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
          <div className="pro-role__main"><div className="pro-role__meta"><span>{item.date}</span><span>{item.kind}</span></div><h3>{item.name}</h3><p className="pro-role__title">{item.role}</p><p className="pro-role__detail">{item.detail}</p>{item.tags && <div className="pro-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}</div>
          <span className="pro-role__arrow" aria-hidden="true">↗</span>
        </article>)}
      </div>
    </section>

    <section className="pro-work pro-section" id="work">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">03</span><span>SELECTED WORK</span><span className="pro-section-aside">PRODUCT THINKING, BUILT WITH CODE</span></div>
      <article className="pro-project pro-project--feetcode pro-reveal">
        <div className="pro-project__visual" aria-label="FeetCode project preview illustration">
          <div className="pro-code-window"><div className="pro-code-window__bar"><i/><i/><i/><span>FEETCODE / DEMO</span></div><div className="pro-code-window__body"><div className="pro-code-window__rail"><span>OVERVIEW</span><span>CHALLENGES</span><span>PROGRESS</span></div><div className="pro-code-window__content"><span className="pro-code-window__kicker">WEEKLY PRACTICE</span><strong>Stay in the<br/>solving habit.</strong><div className="pro-code-window__progress"><i/><i/><i/><i/><i/><i/><i/></div><span className="pro-code-window__caption">GOALS · CHALLENGES · PROGRESS</span></div></div></div>
          <span className="pro-project__visual-index">PROJECT / 01</span>
        </div>
        <div className="pro-project__copy"><div className="pro-project__meta"><span>01 / FULL-STACK PRODUCT</span><span>ACCOUNTABILITY × CODE</span></div><h3>FeetCode<span>.</span></h3><p>A competitive-programming accountability platform built around weekly goals, challenge participation, stake-based motivation, and progress tracking.</p><div className="pro-project__stack"><span>Next.js</span><span>TypeScript</span><span>Tailwind CSS</span><span>Express.js</span><span>MongoDB</span><span>Firebase Auth</span><span>Electron</span></div><div className="pro-project__links"><a href="https://feetcode-portfolio-demo.vercel.app/demo" target="_blank" rel="noreferrer">Live demo <span>↗</span></a><a href="https://feetcode.vercel.app/home" target="_blank" rel="noreferrer">Original website <span>↗</span></a></div></div>
      </article>
      <article className="pro-project pro-project--beneficiary pro-reveal">
        <div className="pro-project__copy"><div className="pro-project__meta"><span>02 / TEAM PROJECT</span><span>CODE FOR GOOD · 2026</span></div><h3>Beneficiary<br/>operations<span>.</span></h3><p>A team-built platform for ISRA designed to simplify access to support schemes, with guided onboarding, OTP authentication, eligibility checks, document handling, and application workflows.</p><div className="pro-project__stack"><span>Guided onboarding</span><span>OTP authentication</span><span>Eligibility workflows</span></div><p className="pro-project__footnote">Developed with a team at JPMorgan Chase Code for Good, Mumbai.</p></div><figure className="pro-project__proof"><img src="/assets/achievements/jpmorgan-code-for-good.png" alt="Event materials from JPMorgan Chase Code for Good"/><figcaption>BUILDING FOR GOOD <span>↗</span></figcaption></figure>
      </article>
    </section>

    <section className="pro-recognition pro-section" id="achievements">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">04</span><span>RECOGNITION</span><span className="pro-section-aside">MOMENTS THAT MARK THE WORK</span></div>
      <div className="pro-recognition__heading pro-reveal"><h2>Good work,<br/><em>noticed.</em></h2><p>Selected milestones from competitions, research, and continued learning.</p></div>
      <div className="pro-awards">
        {achievements.map((item, index) => <article className="pro-award pro-reveal" key={item.title}><span className="pro-award__number">0{index + 1}</span><div className="pro-award__copy"><span>{item.detail}</span><h3>{item.title}</h3><p>{item.result}</p></div>{item.image && <img src={item.image} alt={item.alt} loading="lazy"/>}<span className="pro-award__arrow" aria-hidden="true">↗</span></article>)}
      </div>
    </section>

    <section className="pro-skills pro-section" id="skills">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">05</span><span>TOOLS &amp; METHODS</span></div>
      <div className="pro-skills__layout"><h2 className="pro-reveal">A toolkit for<br/><em>making things.</em></h2><div className="pro-skill-groups">{skillGroups.map((group) => <div className="pro-skill-group pro-reveal" key={group.label}><span>{group.label}</span><div>{group.items.map((skill) => <i key={skill}>{skill}</i>)}</div></div>)}</div></div>
    </section>

    <footer className="pro-contact" id="contact">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">06</span><span>CONTACT</span></div>
      <div className="pro-contact__main pro-reveal"><p>HAVE A THOUGHTFUL PROBLEM?</p><h2>Let’s make<br/><em>it matter.</em></h2><a className="pro-contact__email" href="mailto:samairasharma152@gmail.com">samairasharma152@gmail.com <span>↗</span></a></div>
      <div className="pro-contact__bottom"><span>Samaira Sharma · Software Engineer</span><div><a href="https://www.linkedin.com/in/samaira-sharma-4b9664264" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://github.com/samairaxox" target="_blank" rel="noreferrer">GitHub ↗</a><button type="button" onClick={onOpenInteractive}>Interactive View ↗</button></div><a href="#professional-top">Back to top ↑</a></div>
    </footer>
  </main>;
}
