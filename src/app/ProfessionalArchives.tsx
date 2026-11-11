"use client";

import { useEffect, useRef, useState } from "react";
import { photoDiary } from "./professional-data";

type ImageStory = { src: string; alt: string; caption: string };

export default function ProfessionalArchives() {
  const [image, setImage] = useState<ImageStory | null>(null);
  const [order, setOrder] = useState(() => photoDiary.map((_, index) => index));
  const [front, setFront] = useState<number | null>(null);
  const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>({});
  const drag = useRef<{ index: number; x: number; y: number; originX: number; originY: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const lightboxTouch = useRef<number | null>(null);
  const activeIndex = image ? photoDiary.findIndex((photo) => photo.src === image.src) : -1;
  useEffect(() => {
    if (!image) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setImage(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [image]);

  const movePhoto = (index: number, x: number, y: number) => setPositions((current) => ({
    ...current,
    [index]: { x: Math.max(-54, Math.min(54, x)), y: Math.max(-30, Math.min(30, y)) },
  }));
  const showPhoto = (index: number) => setImage(photoDiary[(index + photoDiary.length) % photoDiary.length]);
  const shuffle = () => {
    const next = [...order];
    for (let i = next.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [next[i], next[j]] = [next[j], next[i]]; }
    setOrder(next);
    setFront(null);
    setPositions({});
  };
  const reset = () => { setOrder(photoDiary.map((_, index) => index)); setPositions({}); setFront(null); };

  return <>
    <section className="pro-diary pro-section" id="journal" aria-labelledby="diary-title">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">03</span><span>PERSONAL ARCHIVE / PHOTO DIARY</span><span className="pro-section-aside">A FEW MOMENTS BETWEEN BUILDS</span></div>
      <div className="pro-diary__heading pro-reveal"><h2 id="diary-title">Little moments,<br/><em>kept close.</em></h2><p>People, places, and small details that stay with me.</p></div>
      <div className="pro-diary__toolbar"><p className="pro-diary__instruction" id="diary-instructions">Drag to rearrange · arrow keys to nudge · view to enlarge</p><div><button type="button" onClick={shuffle}>Shuffle photos ↻</button><button type="button" onClick={reset}>Reset arrangement</button></div></div>
      <div className="pro-diary__grid">
        {order.map((photoIndex, visualIndex) => { const photo = photoDiary[photoIndex]; return <div className={`pro-diary__photo pro-diary__photo--${visualIndex + 1} pro-reveal`} key={photo.src} style={{ "--photo-x": `${positions[photoIndex]?.x ?? 0}px`, "--photo-y": `${positions[photoIndex]?.y ?? 0}px`, "--photo-z": front === photoIndex ? 8 : visualIndex + 1 } as React.CSSProperties} role="group" tabIndex={0} onPointerDown={(event) => {
          setFront(photoIndex);
          if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const position = positions[photoIndex] ?? { x: 0, y: 0 };
          drag.current = { index: photoIndex, x: event.clientX, y: event.clientY, originX: position.x, originY: position.y, moved: false };
          suppressClick.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
        }} onPointerMove={(event) => {
          const active = drag.current;
          if (!active || active.index !== photoIndex) return;
          const dx = event.clientX - active.x;
          const dy = event.clientY - active.y;
          if (!active.moved && Math.hypot(dx, dy) < 5) return;
          active.moved = true;
          suppressClick.current = true;
          movePhoto(photoIndex, active.originX + dx, active.originY + dy);
        }} onPointerUp={() => { drag.current = null; window.setTimeout(() => { suppressClick.current = false; }, 0); }} onPointerCancel={() => { drag.current = null; suppressClick.current = false; }} onKeyDown={(event) => {
          const delta = event.shiftKey ? 18 : 8;
          const current = positions[photoIndex] ?? { x: 0, y: 0 };
          const offsets: Record<string, [number, number]> = { ArrowLeft: [-delta, 0], ArrowRight: [delta, 0], ArrowUp: [0, -delta], ArrowDown: [0, delta] };
          const offset = offsets[event.key];
          if (!offset) return;
          event.preventDefault();
          movePhoto(photoIndex, current.x + offset[0], current.y + offset[1]);
        }} aria-describedby="diary-instructions" aria-label={`Drag or nudge photograph: ${photo.caption}`}>
          <span><img src={photo.src} alt={photo.alt} loading="lazy"/></span><small>0{visualIndex + 1} / {photo.caption}</small><button className="pro-diary__photo-view" type="button" onPointerDown={(event) => event.stopPropagation()} onClick={() => setImage(photo)}>View photo ↗</button>
        </div>;})}
      </div>
    </section>

    {image && <div className="pro-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImage(null); }}><section className="pro-lightbox__panel" role="dialog" aria-modal="true" aria-label={image.caption} onTouchStart={(event) => { lightboxTouch.current = event.touches[0].clientX; }} onTouchEnd={(event) => { const start = lightboxTouch.current; if (start === null) return; const delta = event.changedTouches[0].clientX - start; if (Math.abs(delta) > 50) showPhoto(activeIndex + (delta < 0 ? 1 : -1)); lightboxTouch.current = null; }}><div className="pro-lightbox__controls"><button type="button" onClick={() => showPhoto(activeIndex - 1)} aria-label="Previous photograph">←</button><span>{String(activeIndex + 1).padStart(2, "0")} / {String(photoDiary.length).padStart(2, "0")}</span><button type="button" onClick={() => showPhoto(activeIndex + 1)} aria-label="Next photograph">→</button><button type="button" onClick={() => setImage(null)} aria-label="Close image">CLOSE <b aria-hidden="true">×</b></button></div><img src={image.src} alt={image.alt}/><p>{image.caption}</p></section></div>}
  </>;
}
