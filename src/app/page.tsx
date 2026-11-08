"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DesktopExperience from "./Desktop";

type Phase = "intro" | "zooming" | "desktop" | "editorial";

type GazePose = "center" | "left" | "right" | "up" | "down" | "up-left" | "up-right" | "down-left" | "down-right";

const gazePoses: GazePose[] = ["center", "left", "right", "up", "down", "up-left", "up-right", "down-left", "down-right"];

function CursorAvatar({ frozen }: { frozen: boolean }) {
  const [pose, setPose] = useState<GazePose>("center");

  useEffect(() => {
    gazePoses.forEach((direction) => {
      const image = new Image();
      image.src = `/character-gaze/poses/${direction}.png`;
    });

  }, []);

  useEffect(() => {
    if (frozen) return;
    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      const horizontal = Math.abs(x) > 0.2 ? (x < 0 ? "left" : "right") : "";
      const vertical = Math.abs(y) > 0.2 ? (y < 0 ? "up" : "down") : "";
      const nextPose = (vertical && horizontal ? `${vertical}-${horizontal}` : vertical || horizontal || "center") as GazePose;
      setPose((current) => current === nextPose ? current : nextPose);
    };
    const resetPose = () => setPose("center");

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", resetPose);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", resetPose);
    };
  }, [frozen]);

  return <img className="intro-character" src={`/character-gaze/poses/${pose}.png`} alt="Illustrated character with headphones looking toward the cursor, seated behind a heart-marked laptop" draggable={false} />;
}

const destinations = [
  { title: "About" },
  { title: "Work" },
  { title: "Experience" },
  { title: "Skills" },
];

function Masthead() {
  return (
    <div className="masthead">
      <a className="masthead-brand" href="#home" aria-label="Samaira Sharma home">SS<span>.</span></a>
      <span className="masthead-center">Independent practice in technology</span>
      <a className="masthead-contact" href="#contents-title">Explore <span>↓</span></a>
    </div>
  );
}

function LampIllustration({ pull, sway, dragging }: { pull: number; sway: number; dragging: boolean }) {
  return (
    <svg className="lamp-art" viewBox="0 0 360 590" role="img" aria-label="A matte black pendant lamp with a pull chain">
      <defs>
        <linearGradient id="lampShell" x1="0" y1="0" x2="1" y2=".85"><stop stopColor="#41413d"/><stop offset=".22" stopColor="#242421"/><stop offset=".66" stopColor="#10100f"/><stop offset="1" stopColor="#050505"/></linearGradient>
        <linearGradient id="lampRim" x1="0" x2="1"><stop stopColor="#68655d"/><stop offset=".35" stopColor="#252522"/><stop offset="1" stopColor="#080808"/></linearGradient>
        <radialGradient id="bulbGlow"><stop stopColor="#ffd89a" stopOpacity=".96"/><stop offset=".28" stopColor="#e7a750" stopOpacity=".36"/><stop offset="1" stopColor="#cf8738" stopOpacity="0"/></radialGradient>
        <filter id="softGlow" x="-100%" y="-20%" width="300%" height="180%"><feGaussianBlur stdDeviation="20"/></filter>
      </defs>
      <g className="lamp-sway" style={{ transform: `rotate(${sway}deg)`, transformOrigin: "300px 0" }}>
        <path d="M300 -6v82" stroke="#252522" strokeWidth="3"/>
        <path d="M297 -6v79" stroke="#5d5b55" strokeWidth=".8" opacity=".55"/>
        <path d="M272 72q28-13 56 0l-4 24q-24 12-48 0z" fill="url(#lampShell)"/>
        <path d="M205 89q67-26 135 0l17 52q-8 21-84 24t-85-24z" fill="url(#lampShell)"/>
        <path d="M205 89q68-22 135 0" fill="none" stroke="#56554f" strokeWidth="1.5" opacity=".65"/>
        <path d="M190 139q82 22 164 0" fill="none" stroke="url(#lampRim)" strokeWidth="8" strokeLinecap="round"/>
        <path d="M204 143q68 17 136 0" fill="none" stroke="#030303" strokeWidth="3" strokeLinecap="round"/>
        <ellipse cx="272" cy="154" rx="31" ry="12" fill="url(#bulbGlow)" filter="url(#softGlow)"/>
        <ellipse cx="272" cy="151" rx="8" ry="4" fill="#ffd89a"/>
        <circle cx="272" cy="151" r="3" fill="#fff1d2"/>
        <path d={`M272 153 Q${270 + pull * .18} 276 ${272 + pull * .12} ${397 + pull}`} fill="none" stroke="#a89c86" strokeWidth="1.2" style={{ transition: dragging ? "none" : "d 360ms cubic-bezier(.22,.75,.25,1)" }}/>
        <path d={`M270.5 153 Q${268.5 + pull * .18} 276 ${270.5 + pull * .12} ${397 + pull}`} fill="none" stroke="#ece3d3" strokeWidth=".45" opacity=".82" style={{ transition: dragging ? "none" : "d 360ms cubic-bezier(.22,.75,.25,1)" }}/>
        <path d={`M${272 + pull * .12} ${397 + pull}v18`} stroke="#b7ab95" strokeWidth="1.5"/>
        <rect x={268 + pull * .12} y="413" width="8" height="18" rx="3" fill="url(#lampShell)" stroke="#827969" strokeWidth=".8" style={{ transform: `translateY(${pull}px)`, transition: dragging ? "none" : "transform 360ms cubic-bezier(.22,.75,.25,1)" }}/>
      </g>
    </svg>
  );
}

function Intro({ onEnter, onSkip, zooming }: { onEnter: () => void; onSkip: () => void; zooming: boolean }) {
  const [pull, setPull] = useState(0);
  const [sway, setSway] = useState(0);
  const [lightOn, setLightOn] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [eyesFrozen, setEyesFrozen] = useState(false);
  const startY = useRef(0);
  const reducedMotion = useRef(false);
  const activated = useRef(false);
  const dragged = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const activate = useCallback(() => {
    if (activated.current) return;
    activated.current = true;
    setEyesFrozen(true);
    if (reducedMotion.current) { onEnter(); return; }
    setPull((current) => Math.max(current, 44));
    setSway(-1.5);
    window.setTimeout(() => setLightOn(false), 100);
    window.setTimeout(() => setSway(1), 160);
    window.setTimeout(onEnter, 360);
  }, [onEnter]);

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    startY.current = event.clientY;
    dragged.current = false;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    const distance = Math.max(0, Math.min(110, event.clientY - startY.current));
    if (distance > 8) dragged.current = true;
    setPull(distance);
    if (distance > 58) { setDragging(false); activate(); }
  };
  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    setPull(0);
  };

  return (
    <section className={`intro ${zooming ? "intro--zooming" : ""}`} aria-label="Interactive lamp introduction">
      <button onClick={onSkip} className="skip-link">Skip intro <span>↗</span></button>
      <div className="character-light" aria-hidden="true" />
      <div className="intro-avatar-position">
        <div className="intro-avatar-zoom">
          <CursorAvatar frozen={eyesFrozen} />
          <span className="heart-portal" aria-hidden="true" />
        </div>
      </div>
      <div className={`lamp-stage ${lightOn ? "lamp-stage--lit" : "lamp-stage--off"}`}>
        <LampIllustration pull={pull} sway={sway} dragging={dragging} />
        <button className="chain-hitbox" aria-label="Pull the lamp chain to enter" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onClick={() => { if (dragged.current) { dragged.current = false; return; } activate(); }}>
          <span className="chain-target" />
        </button>
      </div>
      <p className="intro-prompt">PULL THE STRING TO ENTER</p>
    </section>
  );
}

function NavigationArt({ title, eye }: { title: string; eye: { x: number; y: number } }) {
  if (title === "About") return (
    <svg className="nav-art eyes-art" viewBox="0 0 72 38" aria-hidden="true">
      <path d="M2 19Q18-3 36 19Q18 41 2 19Zm34 0Q53-3 70 19Q53 41 36 19Z" fill="#fff" stroke="#111110" strokeWidth="2.2"/>
      <circle cx={19 + eye.x} cy={19 + eye.y} r="6.2" fill="#111110"/><circle cx={53 + eye.x} cy={19 + eye.y} r="6.2" fill="#111110"/>
      <circle cx={21 + eye.x} cy={16.5 + eye.y} r="1.8" fill="#fff"/><circle cx={55 + eye.x} cy={16.5 + eye.y} r="1.8" fill="#fff"/>
    </svg>
  );
  if (title === "Work") return (
    <svg className="nav-art hammer-art" viewBox="0 0 52 52" aria-hidden="true">
      <g className="hammer-swing" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path d="m14 39 17-19" strokeWidth="3"/><path d="m23 9 15 12-6 7-15-12z" strokeWidth="2"/><path d="m12 42 7 2" strokeWidth="2"/>
      </g>
      <path className="hammer-impact" d="M14 45q5-5 10 0" fill="none" stroke="var(--red)" strokeWidth="1.5"/>
    </svg>
  );
  if (title === "Experience") return (
    <svg className="nav-art star-art" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 2 28 17 41 8 33 21 47 24 32 28 41 41 27 33 24 47 20 32 7 41 15 27 1 24 16 20 7 7 21 15Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="24" cy="24" r="3" fill="var(--red)"/>
    </svg>
  );
  return (
    <svg className="nav-art escape-art" viewBox="0 0 52 40" aria-hidden="true">
      <path d="M4 20h41m-15-14 15 14-15 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [eye, setEye] = useState({ x: 0, y: 0 });
  const [workHit, setWorkHit] = useState(-1);
  return (
    <main className="home" id="home">
      <div className="page-shell">
        <Masthead />
        <section className="hero-editorial">
          <div className="hero-overline">SOFTWARE ENGINEER <span>·</span> AI <span>·</span> FINTECH</div>
          <h1 className="hero-name"><span className="hero-word hero-word--samaira">Samaira</span><span className="hero-word hero-word--sharma">Sharma</span></h1>
          <div className="hero-bottom">
            <p className="hero-caption">Software Engineer<br />exploring AI and FinTech</p>
            <p className="hero-description">Building with curiosity, intention,<br className="desktop-break"/> and a point of view.</p>
          </div>
        </section>
        <section className="contents-section" aria-labelledby="contents-title">
          <div className="contents-heading"><h2 id="contents-title">Enter</h2><span className="contents-aside">Move through the work</span></div>
          <nav className="destination-list" aria-label="Portfolio sections">
            {destinations.map((item) => (
              <a
                className={`destination destination--${item.title.toLowerCase()} ${selected === item.title ? "destination--selected" : ""} ${item.title === "Work" && workHit >= 0 ? `work-hit-${workHit % 2 ? "b" : "a"}` : ""}`}
                href={`#${item.title.toLowerCase()}`}
                key={item.title}
                aria-current={selected === item.title ? "true" : undefined}
                onPointerMove={(event) => {
                  if (item.title !== "About") return;
                  const bounds = event.currentTarget.querySelector(".eyes-art")?.getBoundingClientRect();
                  if (!bounds) return;
                  const x = ((event.clientX - (bounds.left + bounds.width / 2)) / 62) * 10;
                  const y = ((event.clientY - (bounds.top + bounds.height / 2)) / 43) * 5;
                  setEye({ x: Math.max(-10, Math.min(10, x)), y: Math.max(-4.5, Math.min(4.5, y)) });
                }}
                onPointerLeave={() => item.title === "About" && setEye({ x: 0, y: 0 })}
                onPointerEnter={() => item.title === "Work" && setWorkHit((hit) => hit + 1)}
                onFocus={() => item.title === "Work" && setWorkHit((hit) => hit + 1)}
                onClick={(event) => { event.preventDefault(); setSelected(item.title); if (item.title === "Work") setWorkHit((hit) => hit + 1); }}
              >
                <span className="destination-label"><span className="destination-title">{item.title}</span><NavigationArt title={item.title} eye={eye}/></span>
              </a>
            ))}
          </nav>
        </section>
        <footer className="page-footer"><span>{selected ? `A closer look at ${selected}` : "A personal portfolio"}</span><span>Samaira Sharma</span></footer>
      </div>
    </main>
  );
}

export default function Page() {
  const [phase, setPhase] = useState<Phase>("intro");
  const enter = useCallback(() => setPhase("zooming"), []);
  const skip = useCallback(() => setPhase("desktop"), []);
  useEffect(() => {
    if (phase !== "zooming") return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => setPhase("desktop"), reducedMotion ? 0 : 1550);
    return () => window.clearTimeout(timeout);
  }, [phase]);
  const desktopVisible = phase === "zooming" || phase === "desktop";
  return <>
    {(phase === "intro" || phase === "zooming") && <div className={`intro-wrap ${phase === "zooming" ? "intro-wrap--zooming" : ""}`}><Intro onEnter={enter} onSkip={skip} zooming={phase === "zooming"} /></div>}
    <DesktopExperience visible={desktopVisible} onOpenEditorial={() => setPhase("editorial")} />
    {phase === "editorial" && <div className="editorial-experience"><button className="back-to-desktop" onClick={() => setPhase("desktop")}>← Back to desktop</button><Home /></div>}
  </>;
}
