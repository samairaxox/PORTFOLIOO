"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DesktopWidgets from "./DesktopWidgets";

type AppId = "about" | "projects" | "experience" | "achievements" | "resume" | "contact";
type OpenWindow = { id: AppId; minimized: boolean; z: number };

const feetCodeDemoUrl = "https://feetcode-portfolio-demo.vercel.app/demo";
const feetCodeHomeUrl = "https://feetcode.vercel.app/home";
const feetCodeTechnologies = ["Next.js", "TypeScript", "Tailwind CSS", "Express.js", "MongoDB", "Firebase Authentication", "Electron"];

const apps: { id: AppId; title: string; mark: string }[] = [
  { id: "about", title: "About Me", mark: "A" },
  { id: "projects", title: "Projects", mark: "P" },
  { id: "experience", title: "Experience", mark: "E" },
  { id: "achievements", title: "Achievements", mark: "✳" },
  { id: "resume", title: "Resume", mark: "R" },
  { id: "contact", title: "Contact", mark: "C" },
];

function AppGlyph({ id }: { id: AppId | "editorial" }) {
  if (id === "editorial") return <span className="desktop-glyph__monogram">SS<span>.</span></span>;
  if (id === "about") return <svg viewBox="0 0 44 44" aria-hidden="true"><circle cx="22" cy="14" r="7"/><path d="M8 37c1-8 6-12 14-12s13 4 14 12"/></svg>;
  if (id === "projects") return <svg viewBox="0 0 44 44" aria-hidden="true"><rect x="7" y="9" width="30" height="26" rx="3"/><path d="M7 16h30M13 23h7m-7 6h18"/></svg>;
  if (id === "experience") return <svg viewBox="0 0 44 44" aria-hidden="true"><path d="M10 13h24M10 22h24M10 31h24"/><circle cx="15" cy="13" r="2"/><circle cx="28" cy="22" r="2"/><circle cx="19" cy="31" r="2"/></svg>;
  if (id === "achievements") return <svg viewBox="0 0 44 44" aria-hidden="true"><path d="m22 5 4.8 10 11 1.5-8 7.7 2 11L22 30l-9.8 5.2 2-11-8-7.7 11-1.5z"/></svg>;
  if (id === "resume") return <svg viewBox="0 0 44 44" aria-hidden="true"><path d="M12 6h14l8 8v24H12zM26 6v9h8M17 22h12M17 28h12M17 34h8"/></svg>;
  return <svg viewBox="0 0 44 44" aria-hidden="true"><rect x="6" y="10" width="32" height="24" rx="3"/><path d="m8 13 14 11 14-11"/></svg>;
}

function ContactIcon({ kind }: { kind: "linkedin" | "github" | "gmail" }) {
  if (kind === "linkedin") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v10M5 5.5v.1M10 19v-6c0-2 1.1-3 2.8-3s2.7 1 2.7 3v6M10 10v9M3 3h18v18H3z"/></svg>;
  if (kind === "github") return <svg viewBox="0 0 24 24" aria-hidden="true"><path className="contact-icon-fill" d="M12 1a11 11 0 0 0-3.48 21.43c.55.1.75-.24.75-.53v-2.07c-3.05.66-3.69-1.3-3.69-1.3-.5-1.26-1.22-1.6-1.22-1.6-.99-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.97 1.66 2.54 1.18 3.16.9.1-.7.38-1.18.69-1.45-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.13-2.95-.12-.28-.49-1.4.11-2.91 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.51.23 2.63.11 2.91.7.77 1.12 1.75 1.12 2.95 0 4.22-2.57 5.15-5.02 5.42.4.34.75 1.01.75 2.03v3.02c0 .29.2.64.76.53A11 11 0 0 0 12 1Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/></svg>;
}

type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  category: string;
  status?: string;
  overview: string;
  contributions: string[];
  tools?: string[];
};

const experienceEntries: ExperienceEntry[] = [
  {
    company: "JPMorgan Chase",
    role: "Software Engineering Intern",
    period: "Summer 2027",
    category: "Incoming internship",
    status: "INCOMING",
    overview: "An upcoming internship. This chapter is marked incoming; details will be added after the role begins.",
    contributions: [],
  },
  {
    company: "Investigen",
    role: "AI Intern",
    period: "May–July 2026",
    category: "Internship",
    overview: "AI internship work spanning mutual-fund data automation, SID/KIM compliance checking, and Scheme Information Document generation.",
    contributions: [
      "Developed an automated AMFI mutual-fund data pipeline using Python and Pandas for data cleaning and PostgreSQL ingestion.",
      "Built a SID/KIM compliance checker that extracts 170+ fields from regulatory PDFs and validates rules.",
      "Automated Scheme Information Document generation with structured Python templates.",
    ],
    tools: ["Python", "Pandas", "PostgreSQL", "PDF processing"],
  },
  {
    company: "Orcawise",
    role: "Software Engineer Intern",
    period: "May–August 2025",
    category: "Internship",
    overview: "Contributed to AI chatbot architecture and application development with an international engineering team.",
    contributions: [
      "Contributed to AI chatbot architecture and workflow design using LangChain and FAISS.",
      "Collaborated on feature development and application integration.",
    ],
    tools: ["LangChain", "FAISS"],
  },
  {
    company: "CodeCell KJSCE",
    role: "Marketing Team Member",
    period: "Aug 2025 — Present",
    category: "Community / leadership",
    overview: "Supporting technical community onboarding and industry outreach.",
    contributions: [
      "Co-hosted technical onboarding sessions for 500+ students.",
      "Supported industry outreach.",
    ],
  },
  {
    company: "Google Developer Groups (GDG)",
    role: "Core Team Member",
    period: "2025–2026",
    category: "Community / leadership",
    overview: "Helped bring developers together through technical sessions and workshops.",
    contributions: [
      "Co-hosted a Golang technical session.",
      "Supported developer workshops.",
    ],
  },
];

function ExperienceTimeline() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const updateProgress = () => {
    const element = scrollRef.current;
    if (!element) return;
    const range = element.scrollHeight - element.clientHeight;
    setProgress(range > 0 ? Math.min(100, (element.scrollTop / range) * 100) : 100);
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateProgress);
    return () => window.cancelAnimationFrame(frame);
  }, [expanded]);

  return <div className="experience-scroll" ref={scrollRef} onScroll={updateProgress}>
    <div className="experience-content">
      <header className="experience-header">
        <div className="experience-header__top"><span className="experience-kicker">The professional journal</span><span className="experience-range">2025 — PRESENT</span></div>
        <h2>The chapters<br/><em>so far.</em></h2>
        <span className="experience-scroll-cue" aria-hidden="true">SCROLL TO EXPLORE <span>↓</span></span>
      </header>

      <section className="experience-timeline" aria-label="Experience timeline" style={{ "--timeline-progress": `${progress}%` } as React.CSSProperties}>
        {experienceEntries.map((entry, index) => {
          const isExpanded = expanded === index;
          return <article className={`experience-chapter ${isExpanded ? "experience-chapter--active" : ""}`} key={entry.company}>
            <span className="experience-marker" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div className={`experience-card ${index % 2 === 0 ? "experience-card--left" : "experience-card--right"}`} style={{ "--chapter-index": index } as React.CSSProperties}>
              <button className="experience-card__toggle" type="button" aria-expanded={isExpanded} onClick={() => setExpanded(isExpanded ? null : index)}>
                <span className="experience-card__meta"><span>{entry.period}</span><span>{entry.category}</span></span>
                <span className="experience-card__title">{entry.company}{entry.status && <span className="experience-status">{entry.status}</span>}</span>
                <span className="experience-card__role">{entry.role}</span>
                <span className="experience-card__expand" aria-hidden="true">{isExpanded ? "−" : "+"}</span>
              </button>
              <div className={`experience-details ${isExpanded ? "experience-details--open" : ""}`} aria-hidden={!isExpanded}>
                <div className="experience-details__inner">
                  <p>{entry.overview}</p>
                  {entry.contributions.length > 0 && <ul>{entry.contributions.map((item) => <li key={item}>{item}</li>)}</ul>}
                  {entry.tools && <div className="experience-tools"><span>TOOLS & METHODS</span><div>{entry.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div>}
                </div>
              </div>
            </div>
          </article>;
        })}
      </section>
    </div>
  </div>;
}

type Achievement = {
  id: string;
  title: string;
  context: string;
  status: string;
  period: string;
  image?: string;
  imageAlt?: string;
  storyTitle: string;
  storySubheading: string;
  story: string;
  caption?: string;
};

const achievements: Achievement[] = [
  {
    id: "code-for-good",
    title: "Code for Good 2026",
    context: "JPMorgan Chase · Mumbai",
    status: "RUNNER-UP",
    period: "September 2026",
    image: "/assets/achievements/jpmorgan-code-for-good.png",
    imageAlt: "JPMorgan Chase Code for Good event materials and participation certificate",
    storyTitle: "Building for Good.",
    storySubheading: "Runner-Up · JPMorgan Chase Code for Good 2026",
    story: "At JPMorgan Chase Code for Good 2026 in Mumbai, our team worked with ISRA to develop a beneficiary operations platform designed to simplify access to support schemes. We built guided onboarding, OTP authentication, eligibility checks, document handling, and application workflows. Our team finished as Runner-Up.",
  },
  {
    id: "next-signal",
    title: "Finding the Next Signal",
    context: "Investment Research Competition",
    status: "TOP 20 SHORTLISTED",
    period: "2026",
    image: "/assets/achievements/finding-the-next-signal.png",
    imageAlt: "Finding the Next Signal competition poster with registration, selection, and shortlist figures",
    storyTitle: "Finding the Next Signal.",
    storySubheading: "Top 20 Shortlisted · Investment Research Competition",
    story: "An investment research challenge focused on uncovering meaningful signals from financial and corporate disclosures. Our research explored evidence-backed insights, inconsistencies, and overlooked relationships in the energy and renewables sector.",
  },
  {
    id: "datazen",
    title: "DataZen",
    context: "Case Study Competition",
    status: "FINALIST",
    period: "2026",
    image: "/assets/achievements/datazen-certificate.png",
    imageAlt: "DataZen Certificate of Appreciation for participation in the 2026 case study competition",
    storyTitle: "Thinking Beyond the Dataset.",
    storySubheading: "Finalist · DataZen Case Study Competition 2026",
    story: "Recognized as a finalist in the DataZen case study competition, an experience centered on analytical thinking, problem-solving, and communicating structured solutions.",
    caption: "Certificate of appreciation for participation, shown as supplied.",
  },
  {
    id: "nism",
    title: "NISM Series V-A",
    context: "Mutual Fund Distributors Certification",
    status: "CERTIFIED",
    period: "",
    storyTitle: "Learning the Language of Finance.",
    storySubheading: "NISM Series V-A · Mutual Fund Distributors Certification",
    story: "Cleared the NISM Series V-A Mutual Fund Distributors Certification examination, strengthening my understanding of mutual funds, investment products, and the fundamentals of financial distribution.",
  },
];

function AchievementGallery() {
  const [selected, setSelected] = useState<Achievement | null>(null);
  const [paused, setPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const positionsRef = useRef<number[]>([]);
  const pausedRef = useRef(false);

  const pauseReel = (value: boolean) => {
    const shouldPause = value || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    pausedRef.current = shouldPause;
    setPaused(shouldPause);
  };

  useEffect(() => {
    if (selected) {
      pausedRef.current = true;
      setPaused(true);
      return;
    }

    const viewport = viewportRef.current;
    if (!viewport) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pausedRef.current = true;
      setPaused(true);
    }
    const cards = cardRefs.current.filter((card): card is HTMLButtonElement => card !== null);
    if (!cards.length) return;

    let frame = 0;
    let lastTime = 0;
    let cardWidth = cards[0].getBoundingClientRect().width;
    const getGap = () => Number.parseFloat(window.getComputedStyle(viewport).columnGap) || 18;
    const placeCards = () => cards.forEach((card, index) => {
      card.style.transform = `translate3d(${positionsRef.current[index] ?? index * (cardWidth + getGap())}px, 0, 0)`;
    });
    const measure = () => {
      const nextWidth = cards[0].getBoundingClientRect().width;
      const nextGap = getGap();
      if (positionsRef.current.length !== cards.length || Math.abs(nextWidth - cardWidth) > 1) {
        cardWidth = nextWidth;
        positionsRef.current = cards.map((_, index) => index * (cardWidth + nextGap));
      } else cardWidth = nextWidth;
      placeCards();
    };
    measure();

    const animate = (time: number) => {
      if (!lastTime) lastTime = time;
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (!pausedRef.current) {
        const gap = getGap();
        const positions = positionsRef.current;
        for (let index = 0; index < positions.length; index += 1) positions[index] -= 24 * delta;
        for (let index = 0; index < positions.length; index += 1) {
          if (positions[index] + cardWidth < 0) {
            const lastRight = Math.max(...positions.map((position) => position + cardWidth));
            positions[index] = lastRight + gap;
          }
        }
        placeCards();
      }
      frame = window.requestAnimationFrame(animate);
    };

    window.addEventListener("resize", measure);
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, [selected]);

  const openStory = (achievement: Achievement) => {
    pauseReel(true);
    setSelected(achievement);
  };

  if (selected) return <div className="achievement-story-view">
    <button className="achievement-back" type="button" onClick={() => { setSelected(null); pauseReel(false); }}><span aria-hidden="true">←</span> Back to Highlights</button>
    <div className={`achievement-story achievement-story--${selected.id}`}>
      <header className="achievement-story__header">
        <span className="achievement-kicker">Honours &amp; milestones <span>·</span> {selected.status}</span>
        <h2>{selected.storyTitle}</h2>
        <p>{selected.storySubheading}</p>
      </header>
      <div className={`achievement-story__body ${selected.image ? "achievement-story__body--image" : "achievement-story__body--type"}`}>
        {selected.image ? <figure className="achievement-story__figure">
          <img src={selected.image} alt={selected.imageAlt} />
          {selected.caption && <figcaption>{selected.caption}</figcaption>}
        </figure> : <div className="nism-certificate" aria-label="Typography-led certification panel"><span className="nism-certificate__mark" aria-hidden="true">V—A</span><span className="nism-certificate__line"/><span className="nism-certificate__label">CERTIFICATION</span><strong>Mutual Fund<br/>Distributors</strong><span className="nism-certificate__seal" aria-hidden="true">✳</span></div>}
        <div className="achievement-story__copy"><span className="achievement-story__index">{String(achievements.findIndex((item) => item.id === selected.id) + 1).padStart(2, "0")} / 04</span><p>{selected.story}</p></div>
      </div>
    </div>
  </div>;

  return <div className="achievement-gallery">
    <header className="achievement-gallery__header">
      <div><span className="achievement-kicker">Honours &amp; milestones</span><h2>The Highlight Reel<span>.</span></h2><p>Some moments deserved more than a line on my résumé.</p></div>
      <span className="achievement-gallery__instruction">A FEW THINGS WORTH KEEPING <span>↘</span></span>
    </header>
    <div className={`achievement-reel ${paused ? "achievement-reel--paused" : ""}`} ref={viewportRef} aria-label="Moving achievement highlights" onPointerEnter={(event) => { if (event.pointerType !== "touch") pauseReel(true); }} onPointerLeave={(event) => { if (event.pointerType !== "touch" && !selected) pauseReel(false); }} onFocusCapture={() => pauseReel(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !selected) pauseReel(false); }} onTouchStart={() => pauseReel(true)} onTouchEnd={() => { if (!selected) pauseReel(false); }}>
      {achievements.map((achievement, index) => <button className={`achievement-card achievement-card--${achievement.id}`} type="button" key={achievement.id} ref={(element) => { cardRefs.current[index] = element; }} onClick={() => openStory(achievement)} aria-label={`View ${achievement.title}: ${achievement.status}`}>
        <span className="achievement-card__top"><span>{String(index + 1).padStart(2, "0")}</span><span>{achievement.period || "NISM CERTIFICATION"}</span></span>
        <span className="achievement-card__title">{achievement.title}</span>
        <span className="achievement-card__context">{achievement.context}</span>
        {achievement.image ? <span className={`achievement-card__image ${achievement.id === "datazen" || achievement.id === "next-signal" ? "achievement-card__image--contain" : ""}`}><img src={achievement.image} alt="" draggable={false}/></span> : <span className="achievement-card__certificate" aria-hidden="true"><span className="achievement-card__certificate-eyebrow">CERTIFICATION / 04</span><span className="achievement-card__certificate-mark">V—A<span>✳</span></span><span className="achievement-card__certificate-rule"/><strong>NISM</strong><i>Mutual Fund Distributors</i></span>}
        <span className="achievement-card__bottom"><strong>{achievement.status}</strong><span>VIEW STORY <i>↗</i></span></span>
      </button>)}
    </div>
    <footer className="achievement-gallery__footer"><span>SELECTED MOMENTS</span><span>01 — 04 <i>✳</i></span></footer>
  </div>;
}

type AboutIconKind = "curiosity" | "build" | "music" | "location";

function AboutIcon({ kind }: { kind: AboutIconKind }) {
  if (kind === "curiosity") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6m-5 3h4m-5-6.5a6 6 0 1 1 6 0c-.8.6-1 1.3-1 2h-4c0-.7-.2-1.4-1-2Z"/><path d="M12 1v2m9 9h-2M5 12H3m15.4-6.4L17 7m-10 0L5.6 5.6"/></svg>;
  if (kind === "build") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-2 14"/></svg>;
  if (kind === "music") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
}

type Polaroid = { src: string; alt: string; caption: string; x: number; y: number; rotation: number; z: number };
const initialPolaroids: Polaroid[] = [
  { src: "/assets/about/speaking-to-audience.png", alt: "Samaira speaking to a full lecture hall", caption: "THE ROOM WAS FULL", x: -26, y: -5, rotation: -4, z: 1 },
  { src: "/assets/about/waterfront-evening.png", alt: "Samaira looking over the waterfront at dusk", caption: "A MOMENT BY THE WATER", x: 26, y: -12, rotation: 4, z: 2 },
  { src: "/assets/about/somaiya-campus-friends.png", alt: "Samaira with friends at Somaiya campus", caption: "CODE FOR GOOD · JPMORGAN", x: 0, y: 65, rotation: -1, z: 3 },
];

const aboutMoods: { label: string; value: string; icon: AboutIconKind }[] = [
  { label: "My curiosity", value: "AI × Finance", icon: "curiosity" },
  { label: "What I do", value: "Build & Experiment", icon: "build" },
  { label: "On repeat", value: "Bleachers", icon: "music" },
  { label: "Based in", value: "Mumbai, India", icon: "location" },
];

const semesterPerformance = [
  { term: "Semester 1", sgpa: 9.54, x: 58 },
  { term: "Semester 2", sgpa: 9.64, x: 232 },
  { term: "Semester 3", sgpa: 9.72, x: 406 },
  { term: "Semester 4", sgpa: 10, x: 580 },
];

const unweightedSemesterAverage = (Math.round((semesterPerformance.reduce((total, semester) => total + semester.sgpa, 0) / semesterPerformance.length + Number.EPSILON) * 100) / 100).toFixed(2);

function AcademicSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const chartTop = 26;
  const chartBottom = 128;
  const chartMin = 9.4;
  const chartMax = 10;
  const plotY = (sgpa: number) => chartTop + ((chartMax - sgpa) / (chartMax - chartMin)) * (chartBottom - chartTop);
  const linePoints = semesterPerformance.map((semester) => `${semester.x},${plotY(semester.sgpa)}`).join(" ");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!("IntersectionObserver" in window)) { setIsVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.18 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return <section ref={sectionRef} className={`about-section academic-section ${isVisible ? "academic-section--visible" : ""}`} aria-labelledby="academic-title">
    <div className="academic-overview">
      <div className="academic-average">
        <span className="about-editorial-label">03 / The academic edition</span>
        <h2 id="academic-title" className="academic-average__number">{unweightedSemesterAverage}</h2>
        <span className="academic-average__scale">Academic performance / 10</span>
        <span className="academic-average__note">Unweighted average of four semester SGPAs</span>
      </div>
      <div className="academic-details">
        <span className="academic-details__label">GRADUATION <i>·</i> 2028</span>
        <h3>B.Tech in<br/>Information Technology</h3>
        <p>K. J. Somaiya College of Engineering<br/>Mumbai</p>
        <div className="academic-details__highlight"><strong>10.00 <i>SGPA</i></strong><span>SEMESTER 4</span></div>
      </div>
    </div>
    <div className="academic-performance">
      <div className="academic-performance__heading"><span>Semester performance</span><span>SGPA / 10</span></div>
      <svg className="academic-chart" viewBox="0 0 640 190" role="img" aria-labelledby="academic-chart-title academic-chart-description" preserveAspectRatio="xMidYMid meet">
        <defs><linearGradient id="academic-line-gradient" x1="0" x2="1"><stop stopColor="#bb7d8b"/><stop offset="1" stopColor="#f0d8d1"/></linearGradient></defs>
        <title id="academic-chart-title">Semester SGPA performance</title>
        <desc id="academic-chart-description">A line chart showing SGPAs of 9.54, 9.64, 9.72, and 10.00 for semesters one through four.</desc>
        {[26, 77, 128].map((y) => <line className="academic-chart__gridline" key={y} x1="34" x2="606" y1={y} y2={y}/>)}
        <polyline className="academic-chart__line" points={linePoints}/>
        {semesterPerformance.map((semester, index) => <g className="academic-chart__point" key={semester.term} style={{ "--point-index": index } as React.CSSProperties}>
          <circle cx={semester.x} cy={plotY(semester.sgpa)} r="5"/>
          <text className="academic-chart__value" x={semester.x} y={plotY(semester.sgpa) - 14} textAnchor="middle">{semester.sgpa.toFixed(2)}</text>
          <text className="academic-chart__term" x={semester.x} y="164" textAnchor="middle">SEMESTER {index + 1}</text>
        </g>)}
      </svg>
    </div>
  </section>;
}

function AboutView() {
  const [photos, setPhotos] = useState(initialPolaroids);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Polaroid | null>(null);
  const [lightsOn, setLightsOn] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dragRef = useRef<{ index: number; pointerId: number; startX: number; startY: number; originX: number; originY: number; currentX: number; currentY: number; width: number; height: number; moved: boolean } | null>(null);
  const frontZ = useRef(4);

  useEffect(() => {
    if (!selectedPhoto) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelectedPhoto(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedPhoto]);

  const beginDrag = (event: React.PointerEvent<HTMLButtonElement>, index: number) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const photo = photos[index];
    dragRef.current = { index, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: photo.x, originY: photo.y, currentX: photo.x, currentY: photo.y, width: event.currentTarget.getBoundingClientRect().width, height: event.currentTarget.getBoundingClientRect().height, moved: false };
    frontZ.current += 1;
    setDraggingIndex(index);
    setPhotos((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, z: frontZ.current } : item));
  };

  const moveDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const board = stageRef.current;
    if (!board) return;
    const width = board.clientWidth;
    const height = board.clientHeight;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    drag.moved ||= Math.hypot(dx, dy) > 5;
    const left = Math.max(drag.width / 2 + 14, Math.min(width - drag.width / 2 - 14, width / 2 + drag.originX / 100 * width + dx));
    const top = Math.max(drag.height / 2 + 14, Math.min(height - drag.height / 2 - 14, height / 2 + drag.originY + dy));
    drag.currentX = ((left - width / 2) / width) * 100;
    drag.currentY = top - height / 2;
    event.currentTarget.style.left = `calc(50% + ${drag.currentX}%)`;
    event.currentTarget.style.top = `calc(50% + ${drag.currentY}px)`;
  };

  const endDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setDraggingIndex(null);
    setPhotos((current) => current.map((item, index) => index === drag.index ? { ...item, x: drag.currentX, y: drag.currentY } : item));
    if (event.type === "pointerup" && event.pointerType === "touch" && !drag.moved) setSelectedPhoto(photos[drag.index]);
  };

  const resetBoard = () => {
    dragRef.current = null;
    frontZ.current = 4;
    setDraggingIndex(null);
    photoRefs.current.forEach((photo) => { if (photo) { photo.style.left = ""; photo.style.top = ""; } });
    setPhotos(initialPolaroids.map((photo) => ({ ...photo })));
  };

  const fairyBulbs = [3, 13, 23, 33, 43, 53, 63, 73, 83, 93];

  return <div className="about-scroll">
    <div className="about-content">
      <section className="about-hero">
        <div className="about-hero__copy">
          <span className="about-editorial-label">The personal edition / no. 01</span>
          <h2>More than<br/>just the <em>code.</em></h2>
          <h3>Hi, I&apos;m Samaira.</h3>
          <div className="about-introduction">
            <p>I&apos;m a B.Tech Information Technology student at K. J. Somaiya College of Engineering, Mumbai, who loves turning ideas into things that actually work. I&apos;m especially interested in Artificial Intelligence, software engineering, and the intersection of technology and finance.</p>
            <p>I enjoy building meaningful digital products, exploring creative solutions, and learning something new along the way. For me, technology is as much about curiosity and creativity as it is about code.</p>
          </div>
        </div>
        <figure className="about-hero__photo"><img src="/assets/about/personal-portrait.png" alt="Samaira standing in front of a vivid, colorful art installation"/><figcaption>A MOMENT, IN COLOUR <span>01</span></figcaption></figure>
      </section>

      <section className="about-section about-world" aria-labelledby="about-world-title">
        <div className="about-section__heading"><span className="about-editorial-label">02 / Currently</span><h2 id="about-world-title">Currently, in my world.</h2></div>
        <div className="about-mood-grid">{aboutMoods.map((item, index) => <article className="about-mood" key={item.label} style={{ "--mood-index": index } as React.CSSProperties}><span className="about-mood__icon"><AboutIcon kind={item.icon}/></span><span className="about-mood__label">{item.label}</span><strong>{item.value}</strong></article>)}</div>
      </section>

      <AcademicSection/>

      <section className="about-section about-diary" aria-labelledby="about-diary-title">
        <div className="about-diary__heading"><div className="about-section__heading"><span className="about-editorial-label">04 / A little photo diary</span><h2 id="about-diary-title">Little moments,<br/><em>big memories.</em></h2></div><button className="about-diary__reset" type="button" onClick={resetBoard}>Reset board <span aria-hidden="true">↺</span></button></div>
        <div className="about-polaroid-stage memory-board" ref={stageRef} aria-label="Memory wall. Drag photographs to arrange them.">
          <div className="memory-board__surface" aria-hidden="true"/>
          <div className={`memory-board__lights ${lightsOn ? "memory-board__lights--on" : ""}`} aria-hidden="true">
            <svg viewBox="0 0 1000 110" preserveAspectRatio="none"><path d="M0 18 C145 104 270 102 385 54 S630 4 748 33 S902 91 1000 56"/></svg>
            {fairyBulbs.map((left, index) => <span className="memory-board__bulb" key={left} style={{ left: `${left}%`, top: `${[17, 37, 58, 70, 63, 43, 26, 25, 43, 56][index]}%`, "--twinkle-delay": `${index * 170}ms` } as React.CSSProperties}/>) }
          </div>
          <button className="memory-board__light-toggle" type="button" onClick={() => setLightsOn((on) => !on)} aria-pressed={lightsOn} aria-label={lightsOn ? "Turn fairy lights off" : "Turn fairy lights on"}>{lightsOn ? "LIGHTS ON" : "LIGHTS OFF"}<span aria-hidden="true">✳</span></button>
          <span className="memory-board__note memory-board__note--left" aria-hidden="true">keep making<br/>room for wonder</span><span className="memory-board__heart" aria-hidden="true">♡</span>
          {photos.map((photo, index) => <button ref={(element) => { photoRefs.current[index] = element; }} className={`about-polaroid about-polaroid--${["one", "two", "three"][index]} ${draggingIndex === index ? "about-polaroid--dragging" : ""}`} type="button" key={photo.src} style={{ "--photo-x": `${photo.x}%`, "--photo-y": `${photo.y}px`, "--photo-rotation": `${photo.rotation}deg`, zIndex: photo.z } as React.CSSProperties} onPointerDown={(event) => beginDrag(event, index)} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onDoubleClick={() => setSelectedPhoto(photo)} onClick={(event) => { if (event.detail === 0) setSelectedPhoto(photo); }} aria-label={`Drag to rearrange: ${photo.alt}. Double-click to enlarge, or tap on mobile.`}><span className="memory-board__pin" aria-hidden="true"/><img src={photo.src} alt={photo.alt} draggable={false}/><span className="about-polaroid__caption">{photo.caption}</span></button>)}
        </div>
        <p className="about-diary__caption">Little moments, big memories <span>♡</span></p>
      </section>
    </div>
    {selectedPhoto && <div className="about-photo-lightbox" role="dialog" aria-modal="true" aria-label={`Photo: ${selectedPhoto.alt}`} onClick={() => setSelectedPhoto(null)}>
      <button className="about-photo-lightbox__close" type="button" aria-label="Close enlarged photo" onClick={() => setSelectedPhoto(null)}>×</button>
      <figure onClick={(event) => event.stopPropagation()}><img src={selectedPhoto.src} alt={selectedPhoto.alt}/><figcaption>{selectedPhoto.caption}</figcaption></figure>
    </div>}
  </div>;
}

function ContactView() {
  return <div className="contact-view">
    <header className="contact-view__header">
      <span className="experience-kicker">A note, a question, a new idea</span>
      <h2>Hey, let&apos;s<br/><em>chat!</em></h2>
      <span className="contact-view__aside">OPEN CHANNELS <span>↘</span></span>
    </header>
    <div className="contact-links">
      <a className="contact-link" href="https://www.linkedin.com/in/samaira-sharma-4b9664264" target="_blank" rel="noreferrer"><span className="contact-icon"><ContactIcon kind="linkedin"/></span><span className="contact-link-copy"><span className="contact-link-label">LinkedIn</span><span className="contact-link-address">www.linkedin.com/in/samaira-sharma-4b9664264</span></span><span className="contact-link-arrow" aria-hidden="true">↗</span></a>
      <a className="contact-link" href="https://github.com/samairaxox" target="_blank" rel="noreferrer"><span className="contact-icon"><ContactIcon kind="github"/></span><span className="contact-link-copy"><span className="contact-link-label">GitHub</span><span className="contact-link-address">github.com/samairaxox</span></span><span className="contact-link-arrow" aria-hidden="true">↗</span></a>
      <a className="contact-link" href="mailto:samairasharma152@gmail.com"><span className="contact-icon"><ContactIcon kind="gmail"/></span><span className="contact-link-copy"><span className="contact-link-label">Gmail</span><span className="contact-link-address">samairasharma152@gmail.com</span></span><span className="contact-link-arrow" aria-hidden="true">↗</span></a>
    </div>
  </div>;
}

function AppContent({ id, onOpenEditorial }: { id: AppId; onOpenEditorial: () => void }) {
  if (id === "about") return <AboutView/>;
  if (id === "projects") return null;
  if (id === "experience") return <ExperienceTimeline/>;
  if (id === "achievements") return <AchievementGallery/>;
  if (id === "resume") return <div className="app-copy"><span className="app-kicker">Document</span><h2>Résumé</h2><p className="app-copy__muted">The résumé opens in a separate browser tab.</p></div>;
  return <ContactView/>;
}

export default function DesktopExperience({ visible, onOpenEditorial }: { visible: boolean; onOpenEditorial: () => void }) {
  const [windows, setWindows] = useState<OpenWindow[]>([]);
  const [clock, setClock] = useState<Date | null>(null);
  const [launchpadOpen, setLaunchpadOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [feetcodeMounted, setFeetcodeMounted] = useState(false);
  const [feetcodeOpen, setFeetcodeOpen] = useState(false);
  const [feetcodeMinimized, setFeetcodeMinimized] = useState(false);
  const [feetcodeMaximized, setFeetcodeMaximized] = useState(false);
  const [feetcodeDetailsOpen, setFeetcodeDetailsOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoSlow, setDemoSlow] = useState(false);
  const [localEmbedUnavailable, setLocalEmbedUnavailable] = useState(false);
  const feetcodeCloseTimer = useRef<number | null>(null);
  const topZ = useRef(10);

  const closeFeetcode = useCallback(() => {
    setLaunchpadOpen(true);
    setFeetcodeOpen(false);
    setFeetcodeMinimized(false);
    setFeetcodeMaximized(false);
    if (feetcodeCloseTimer.current !== null) window.clearTimeout(feetcodeCloseTimer.current);
    feetcodeCloseTimer.current = window.setTimeout(() => setFeetcodeMounted(false), 240);
  }, []);

  const openFeetcode = useCallback(() => {
    const isFirstOpen = !feetcodeMounted;
    const isLocalOrigin = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    if (feetcodeCloseTimer.current !== null) window.clearTimeout(feetcodeCloseTimer.current);
    setLaunchpadOpen(false);
    setFeetcodeMounted(true);
    setFeetcodeOpen(true);
    setFeetcodeMinimized(false);
    setFeetcodeMaximized(false);
    setFeetcodeDetailsOpen(false);
    if (isFirstOpen) {
      setLocalEmbedUnavailable(isLocalOrigin);
      setDemoLoading(!isLocalOrigin);
      setDemoSlow(false);
    }
  }, [feetcodeMounted]);

  useEffect(() => {
    const update = () => setClock(new Date());
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("desktop-mode", visible);
    return () => document.documentElement.classList.remove("desktop-mode");
  }, [visible]);

  useEffect(() => () => {
    if (feetcodeCloseTimer.current !== null) window.clearTimeout(feetcodeCloseTimer.current);
  }, []);

  useEffect(() => {
    if (!feetcodeMounted || !demoLoading) return;
    const timeout = window.setTimeout(() => {
      setDemoLoading(false);
      setDemoSlow(true);
    }, 15_000);
    return () => window.clearTimeout(timeout);
  }, [feetcodeMounted, demoLoading]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (feetcodeOpen && !feetcodeMinimized) {
        closeFeetcode();
        return;
      }
      if (launchpadOpen) {
        setLaunchpadOpen(false);
        return;
      }
      setWindows((current) => {
        const topmost = current.filter((item) => !item.minimized).sort((a, b) => b.z - a.z)[0];
        return topmost ? current.filter((item) => item.id !== topmost.id) : current;
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeFeetcode, feetcodeMinimized, feetcodeOpen, launchpadOpen]);

  const openApp = (id: AppId) => {
    if (id === "projects") {
      setProjectSearch("");
      setLaunchpadOpen(true);
      return;
    }
    if (id === "resume") {
      window.open("/resume.pdf", "_blank", "noopener,noreferrer");
      return;
    }
    topZ.current += 1;
    const z = topZ.current;
    setWindows((current) => current.some((item) => item.id === id)
      ? current.map((item) => item.id === id ? { ...item, minimized: false, z } : item)
      : [...current, { id, minimized: false, z }]);
  };
  const closeApp = (id: AppId) => setWindows((current) => current.filter((item) => item.id !== id));
  const minimizeApp = (id: AppId) => setWindows((current) => current.map((item) => item.id === id ? { ...item, minimized: true } : item));
  const focusApp = (id: AppId) => {
    topZ.current += 1;
    const z = topZ.current;
    setWindows((current) => current.map((item) => item.id === id ? { ...item, z } : item));
  };

  return (
    <main className={`desktop-shell ${visible ? "desktop-shell--visible" : ""}`} aria-label="Samaira Sharma portfolio desktop" aria-hidden={!visible}>
      <div className="desktop-wallpaper" aria-hidden="true" />
      <header className="desktop-menubar">
        <div className="desktop-menubar__identity"><span className="menubar-mark">S</span><strong>Samaira Sharma</strong><span className="menubar-divider"/><span>Portfolio</span></div>
        <button className="menubar-editorial" onClick={onOpenEditorial}>Editorial portfolio <span>↗</span></button>
        <div className="desktop-menubar__status"><span className="status-signal" aria-label="Signal"><i/><i/><i/></span><span className="status-battery" aria-label="Battery"><i/></span><time dateTime={clock?.toISOString()}>{clock ? `${clock.toLocaleDateString([], { month: "short", day: "numeric" })} · ${clock.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : "—"}</time></div>
      </header>

      <DesktopWidgets now={clock}/>

      <section className="desktop-shortcuts" aria-label="Portfolio applications">
        {apps.map((app) => <button className="desktop-shortcut" key={app.id} onClick={() => openApp(app.id)} aria-label={`Open ${app.title}`}>
          <span className={`desktop-glyph desktop-glyph--${app.id}`}><AppGlyph id={app.id}/></span><span className="desktop-shortcut__label">{app.title}</span>
        </button>)}
      </section>

      {launchpadOpen && <section className="projects-launchpad" role="dialog" aria-modal="true" aria-label="Projects Launchpad">
        <div className="projects-launchpad__toolbar">
          <button type="button" className="projects-launchpad__back" onClick={() => setLaunchpadOpen(false)}>← <span>Desktop</span></button>
          <label className="projects-launchpad__search"><span aria-hidden="true">⌕</span><input aria-label="Search projects" placeholder="Search projects" value={projectSearch} onChange={(event) => setProjectSearch(event.target.value)}/><kbd>⌘ K</kbd></label>
          <span className="projects-launchpad__count">01 PROJECT</span>
        </div>
        <div className="projects-launchpad__content">
          <p className="projects-launchpad__eyebrow">Selected work <span>— 01</span></p>
          {"feetcode".includes(projectSearch.trim().toLowerCase()) && <button type="button" className="projects-launchpad__app" onClick={openFeetcode} aria-label="Open FeetCode project">
            <span className="projects-launchpad__app-icon"><span aria-hidden="true">&lt;/&gt;</span><i/></span><span className="projects-launchpad__app-name">FeetCode</span><span className="projects-launchpad__app-kind">Coding platform</span>
          </button>}
          {!"feetcode".includes(projectSearch.trim().toLowerCase()) && <p className="projects-launchpad__empty">No projects found.</p>}
        </div>
        <p className="projects-launchpad__hint">A small collection of things made with intent.</p>
      </section>}

      {feetcodeMounted && <section className={`feetcode-window ${feetcodeOpen ? "feetcode-window--open" : "feetcode-window--closing"} ${feetcodeMinimized ? "feetcode-window--minimized" : ""} ${feetcodeMaximized ? "feetcode-window--maximized" : ""}`} role="dialog" aria-modal="true" aria-label="FeetCode live project" aria-hidden={!feetcodeOpen}>
        <header className="feetcode-window__bar">
          <div className="window-controls" aria-label="Window controls">
            <button className="window-control window-control--close" type="button" aria-label="Close FeetCode window" onClick={closeFeetcode}/>
            <button className="window-control window-control--minimize" type="button" aria-label="Minimize FeetCode window" onClick={() => { setFeetcodeMinimized(true); setLaunchpadOpen(true); }}/>
            <button className="window-control window-control--zoom" type="button" aria-label={feetcodeMaximized ? "Restore FeetCode window" : "Maximize FeetCode window"} onClick={() => setFeetcodeMaximized((value) => !value)}/>
          </div>
          <span className="feetcode-window__title">FeetCode — Live Demo</span>
          <a className="feetcode-window__external" href={feetCodeDemoUrl} target="_blank" rel="noopener noreferrer">Open demo <span>↗</span></a>
        </header>
        <div className="feetcode-window__address"><span aria-hidden="true">◈</span><span>feetcode-portfolio-demo.vercel.app/demo</span><button type="button" onClick={() => setFeetcodeDetailsOpen((value) => !value)} aria-expanded={feetcodeDetailsOpen} aria-controls="feetcode-details-panel">{feetcodeDetailsOpen ? "Back to demo" : "Project details"}</button></div>
        <div className="feetcode-window__workspace">
          <div className="feetcode-window__viewport">
            {localEmbedUnavailable ? <div className="feetcode-window__local-fallback"><span className="feetcode-window__fallback-kicker">LIVE PREVIEW / LOCAL MODE</span><h2>Local preview cannot embed this demo.</h2><p>FeetCode allows embedding only from the exact HTTPS portfolio origin. A local address like 127.0.0.1 cannot be added as that origin.</p><p>To enable the embedded preview after deployment, set FeetCode&apos;s Vercel <code>PORTFOLIO_ORIGIN</code> to the portfolio&apos;s exact HTTPS origin and redeploy FeetCode.</p><a href={feetCodeDemoUrl} target="_blank" rel="noopener noreferrer">Open the live FeetCode demo ↗</a></div> : <><iframe title="Interactive FeetCode live demo" src={feetCodeDemoUrl} allow="clipboard-read; clipboard-write" onLoad={() => setDemoLoading(false)}/>{demoLoading && <div className="feetcode-window__loading" aria-live="polite"><span className="feetcode-window__spinner"/><span>Connecting to the live FeetCode demo…</span></div>}</>}
          </div>
          <aside id="feetcode-details-panel" className={`feetcode-details ${feetcodeDetailsOpen ? "feetcode-details--mobile-open" : ""}`} aria-label="FeetCode project details">
            <span className="feetcode-details__eyebrow">PROJECT / 01</span>
            <h2>FEETCODE</h2>
            <p className="feetcode-details__category">COMPETITIVE PROGRAMMING <i>/</i> FULL-STACK</p>
            <div className="feetcode-details__rule"/>
            <p className="feetcode-details__label">OVERVIEW</p>
            <p className="feetcode-details__overview">FeetCode is a competitive programming accountability platform that helps developers stay consistent through weekly coding goals, challenge participation, stake-based motivation, and progress tracking.</p>
            <div className="feetcode-details__rule"/>
            <p className="feetcode-details__label">TECH STACK</p>
            <div className="feetcode-details__stack">{feetCodeTechnologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
            <div className="feetcode-details__links"><a href={feetCodeDemoUrl} target="_blank" rel="noopener noreferrer"><span>01</span> LIVE DEMO <b>↗</b></a><a href={feetCodeHomeUrl} target="_blank" rel="noopener noreferrer"><span>02</span> ORIGINAL WEBSITE <b>↗</b></a></div>
            <button className="feetcode-details__back" type="button" onClick={() => setFeetcodeDetailsOpen(false)}>← Back to demo</button>
          </aside>
        </div>
        <footer className="feetcode-window__footer"><span>{localEmbedUnavailable ? "Set PORTFOLIO_ORIGIN in the FeetCode Vercel project after deployment." : demoSlow ? "The embedded preview may be blocked by the live site's framing policy." : "If the live preview appears blank or is blocked, open FeetCode directly."}</span><a href={feetCodeDemoUrl} target="_blank" rel="noopener noreferrer">Open FeetCode Demo ↗</a></footer>
      </section>}

      {windows.map((item, index) => {
        const app = apps.find((entry) => entry.id === item.id)!;
        return <section key={item.id} className={`os-window os-window--${item.id} ${item.minimized ? "os-window--minimized" : ""}`} style={{ zIndex: item.z, "--window-offset": `${Math.min(index, 3) * 18}px` } as React.CSSProperties} role="dialog" aria-label={`${app.title} window`} aria-hidden={item.minimized} onPointerDown={() => focusApp(item.id)}>
          <header className="os-window__bar"><div className="window-controls"><button className="window-control window-control--close" aria-label={`Close ${app.title}`} onClick={() => closeApp(item.id)} /><button className="window-control window-control--minimize" aria-label={`Minimize ${app.title}`} onClick={() => minimizeApp(item.id)} /><span className="window-control window-control--zoom" aria-hidden="true" /></div><span className="os-window__title">{app.title}</span>{["about", "achievements", "experience"].includes(item.id) ? <button className="os-window__close" type="button" aria-label={`Close ${app.title}`} onClick={() => closeApp(item.id)}>×</button> : <span className="os-window__bar-end">SS / 01</span>}</header>
          <div className="os-window__content"><AppContent id={item.id} onOpenEditorial={onOpenEditorial}/></div>
        </section>;
      })}

      <nav className="desktop-dock" aria-label="Dock">
        <button className="dock-item dock-item--editorial" onClick={onOpenEditorial} aria-label="Open editorial portfolio" title="Editorial portfolio"><span className="desktop-glyph"><AppGlyph id="editorial"/></span></button>
        <span className="dock-separator" aria-hidden="true"/>
        {apps.map((app) => <button className={`dock-item ${app.id === "projects" ? (launchpadOpen || (feetcodeOpen && !feetcodeMinimized) ? "dock-item--open" : "") : windows.some((item) => item.id === app.id && !item.minimized) ? "dock-item--open" : ""}`} key={app.id} onClick={() => openApp(app.id)} aria-label={`Open ${app.title}`} title={app.title}><span className={`desktop-glyph desktop-glyph--${app.id}`}><AppGlyph id={app.id}/></span></button>)}
      </nav>
    </main>
  );
}
