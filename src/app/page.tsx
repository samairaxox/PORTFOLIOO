"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DesktopExperience from "./Desktop";
import ProfessionalPortfolio from "./ProfessionalPortfolio";

type Phase = "intro" | "zooming" | "desktop" | "professional";

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
function LampIllustration({ pull, sway, dragging }: { pull: number; sway: number; dragging: boolean }) {
  return (
    <svg className="lamp-art" viewBox="0 0 360 590" role="img" aria-label="A dusty rose vintage pendant lamp with an interactive pull chain">
      <defs>
        <linearGradient id="lampShell" x1="0" y1="0" x2="1" y2=".85"><stop stopColor="#b48687"/><stop offset=".16" stopColor="#906670"/><stop offset=".43" stopColor="#694956"/><stop offset=".72" stopColor="#493440"/><stop offset="1" stopColor="#30252f"/></linearGradient>
        <linearGradient id="lampRim" x1="0" x2="1"><stop stopColor="#ddbd91"/><stop offset=".25" stopColor="#a67d59"/><stop offset=".54" stopColor="#745644"/><stop offset=".79" stopColor="#c7a274"/><stop offset="1" stopColor="#826149"/></linearGradient>
        <linearGradient id="lampInner" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff0d3"/><stop offset=".42" stopColor="#e8c79f"/><stop offset="1" stopColor="#bd896f"/></linearGradient>
        <linearGradient id="pullPearl" x1="0" y1="0" x2="1" y2=".2"><stop stopColor="#b99074"/><stop offset=".24" stopColor="#fff0d5"/><stop offset=".57" stopColor="#e7d0b6"/><stop offset=".82" stopColor="#fff2dc"/><stop offset="1" stopColor="#b28465"/></linearGradient>
        <radialGradient id="bulbGlow"><stop stopColor="#fff1cf" stopOpacity=".94"/><stop offset=".3" stopColor="#f4c478" stopOpacity=".32"/><stop offset="1" stopColor="#dc9853" stopOpacity="0"/></radialGradient>
        <filter id="softGlow" x="-130%" y="-70%" width="360%" height="260%"><feGaussianBlur stdDeviation="23"/></filter>
      </defs>
      <g className="lamp-sway" style={{ transform: `rotate(${sway}deg)`, transformOrigin: "300px 0" }}>
        <path d="M300 -6v82" stroke="#85664e" strokeWidth="3"/>
        <path d="M297 -6v79" stroke="#e1c49c" strokeWidth=".8" opacity=".72"/>
        <path d="M272 72q28-13 56 0l-4 24q-24 12-48 0z" fill="url(#lampShell)"/>
        <path d="M205 89q67-26 135 0l17 52q-8 21-84 24t-85-24z" fill="url(#lampShell)"/>
        <path className="lamp-shell-highlight" d="M211 95q63-23 123-1l13 42" fill="none" stroke="#e5bdac" strokeWidth="2" strokeLinecap="round" opacity=".58"/>
        <path d="M205 89q68-22 135 0" fill="none" stroke="#d5b49a" strokeWidth="1.5" opacity=".76"/>
        <path className="lamp-interior" d="M197 141q75 20 150 0-5 22-75 24t-75-24z" fill="url(#lampInner)"/>
        <path d="M190 139q82 22 164 0" fill="none" stroke="url(#lampRim)" strokeWidth="8" strokeLinecap="round"/>
        <path d="M204 143q68 17 136 0" fill="none" stroke="#62474a" strokeWidth="2" strokeLinecap="round" opacity=".72"/>
        <path d="M199 145q73 18 146 0" fill="none" stroke="#f0d3aa" strokeWidth="1" strokeLinecap="round" opacity=".88"/>
        <ellipse className="lamp-bloom" cx="272" cy="154" rx="31" ry="12" fill="url(#bulbGlow)" filter="url(#softGlow)"/>
        <ellipse className="lamp-bulb" cx="272" cy="151" rx="8" ry="4" fill="#ffe0a4"/>
        <circle className="lamp-bulb-core" cx="272" cy="151" r="3" fill="#fff5dc"/>
        <path className="lamp-cord" d={`M272 153 Q${270 + pull * .18} 276 ${272 + pull * .12} ${397 + pull}`} fill="none" stroke="#c4a174" strokeWidth="1.25" style={{ transition: dragging ? "none" : "d 360ms cubic-bezier(.22,.75,.25,1)" }}/>
        <path className="lamp-cord-highlight" d={`M270.5 153 Q${268.5 + pull * .18} 276 ${270.5 + pull * .12} ${397 + pull}`} fill="none" stroke="#fff0d2" strokeWidth=".45" opacity=".88" style={{ transition: dragging ? "none" : "d 360ms cubic-bezier(.22,.75,.25,1)" }}/>
        <path d={`M${272 + pull * .12} ${397 + pull}v18`} stroke="#d7b88c" strokeWidth="1.6"/>
        <rect className="lamp-handle" x={268 + pull * .12} y="413" width="8" height="18" rx="4" fill="url(#pullPearl)" stroke="#b88f66" strokeWidth=".9" style={{ transform: `translateY(${pull}px)`, transition: dragging ? "none" : "transform 360ms cubic-bezier(.22,.75,.25,1)" }}/>
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
      <div className="intro-room" aria-hidden="true">
        <div className="intro-room__wall" />
        <div className="intro-room__fairy-lights" aria-hidden="true">
          <span /><span /><span /><span /><span /><span />
        </div>
        <div className="intro-room__window">
          <span className="intro-room__moon" />
          <span className="intro-room__skyline" />
          <span className="intro-room__rain intro-room__rain--one" />
          <span className="intro-room__rain intro-room__rain--two" />
          <span className="intro-room__rain intro-room__rain--three" />
          <span className="intro-room__rain intro-room__rain--four" />
          <span className="intro-room__city-light intro-room__city-light--one" />
          <span className="intro-room__city-light intro-room__city-light--two" />
          <span className="intro-room__city-light intro-room__city-light--three" />
          <span className="intro-room__city-light intro-room__city-light--four" />
          <span className="intro-room__window-cross intro-room__window-cross--vertical" />
          <span className="intro-room__window-cross intro-room__window-cross--horizontal" />
        </div>
        <div className="intro-room__art"><span /><i /></div>
        <div className="intro-room__right-shelf" aria-hidden="true">
          <div className="intro-wall-shelf__objects">
            <span className="intro-wall-shelf__books"><i /><i /><i /></span>
            <svg className="intro-wall-shelf__bunny" viewBox="0 0 54 68" aria-hidden="true">
              <defs>
                <linearGradient id="bunny-ceramic" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#fff0df" />
                  <stop offset=".58" stopColor="#d9b5a9" />
                  <stop offset="1" stopColor="#9c6d73" />
                </linearGradient>
              </defs>
              <ellipse cx="27" cy="59" rx="17" ry="5" fill="#1b1017" opacity=".34" />
              <path d="M17 28C14 17 10 4 15 3c6-1 11 12 13 24M35 27C37 14 42 7 46 10c4 3-1 15-5 22" fill="url(#bunny-ceramic)" stroke="#8c6069" strokeWidth="1.5" />
              <ellipse cx="27" cy="48" rx="19" ry="15" fill="url(#bunny-ceramic)" stroke="#8c6069" strokeWidth="1.5" />
              <circle cx="27" cy="31" r="15" fill="url(#bunny-ceramic)" stroke="#8c6069" strokeWidth="1.5" />
              <circle cx="22" cy="31" r="1.15" fill="#50353b" /><circle cx="32" cy="31" r="1.15" fill="#50353b" />
              <path d="M25 35q2 2 4 0" fill="none" stroke="#9c586b" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M27 21c-5-6-10 0-5 4l5 3 5-3c5-4 0-10-5-4Z" fill="#bd7889" stroke="#f1d0c6" strokeWidth=".8" />
              <circle cx="27" cy="24" r="1.5" fill="#f3d8c5" />
            </svg>
            <span className="intro-wall-shelf__vase">
              <i className="intro-wall-shelf__stem intro-wall-shelf__stem--one" />
              <i className="intro-wall-shelf__stem intro-wall-shelf__stem--two" />
              <i className="intro-wall-shelf__stem intro-wall-shelf__stem--three" />
              <i className="intro-wall-shelf__flower intro-wall-shelf__flower--one" />
              <i className="intro-wall-shelf__flower intro-wall-shelf__flower--two" />
              <i className="intro-wall-shelf__flower intro-wall-shelf__flower--three" />
              <b />
            </span>
            <span className="intro-wall-shelf__trailing-plant"><i /><i /><b /></span>
          </div>
          <div className="intro-wall-shelf__plank" />
        </div>
        <div className="intro-room__shelf">
          <span className="intro-room__book intro-room__book--one" />
          <span className="intro-room__book intro-room__book--two" />
          <span className="intro-room__book intro-room__book--three" />
          <span className="intro-room__shelf-plant"><i /><i /><i /><b /></span>
          <span className="intro-room__vase"><i /><i /><i /><b /></span>
        </div>
        <div className="intro-room__floor" />
        <div className="intro-room__desk"><span className="intro-room__desk-light" /></div>
        <span className="intro-room__screen-light" />
      </div>
      <button onClick={onSkip} className="skip-link">Skip intro <span>↗</span></button>
      <div className="character-light" aria-hidden="true" />
      <div className="intro-avatar-position">
        <div className="intro-avatar-zoom">
          <CursorAvatar frozen={eyesFrozen} />
          <span className="heart-portal" aria-hidden="true" />
        </div>
      </div>
      <div className="intro-desk-lip" aria-hidden="true" />
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
    <DesktopExperience visible={desktopVisible} onOpenProfessional={() => setPhase("professional")} />
    {phase === "professional" && <ProfessionalPortfolio onOpenInteractive={() => setPhase("desktop")} />}
  </>;
}
