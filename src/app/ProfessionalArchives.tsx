"use client";

import { useEffect, useRef, useState } from "react";
import { photoDiary } from "./professional-data";

type ImageStory = { src: string; alt: string; caption: string };

export default function ProfessionalArchives() {
  const [image, setImage] = useState<ImageStory | null>(null);
  const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>({});
  const drag = useRef<{ index: number; x: number; y: number; originX: number; originY: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
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

  return <>
    <section className="pro-diary pro-section" id="journal" aria-labelledby="diary-title">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">03</span><span>PERSONAL ARCHIVE / PHOTO DIARY</span><span className="pro-section-aside">A FEW MOMENTS BETWEEN BUILDS</span></div>
      <div className="pro-diary__heading pro-reveal"><h2 id="diary-title">Little moments,<br/><em>kept close.</em></h2><p>People, places, and small details that stay with me.</p></div>
      <p className="pro-diary__instruction" id="diary-instructions">Drag a photograph to rearrange the desk · use arrow keys to nudge · select to enlarge</p>
      <div className="pro-diary__grid">
        {photoDiary.map((photo, index) => <button className={`pro-diary__photo pro-diary__photo--${index + 1} pro-reveal`} type="button" key={photo.src} style={{ "--photo-x": `${positions[index]?.x ?? 0}px`, "--photo-y": `${positions[index]?.y ?? 0}px` } as React.CSSProperties} onClick={() => {
          if (suppressClick.current) { suppressClick.current = false; return; }
          setImage(photo);
        }} onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const position = positions[index] ?? { x: 0, y: 0 };
          drag.current = { index, x: event.clientX, y: event.clientY, originX: position.x, originY: position.y, moved: false };
          suppressClick.current = false;
          event.currentTarget.setPointerCapture(event.pointerId);
        }} onPointerMove={(event) => {
          const active = drag.current;
          if (!active || active.index !== index) return;
          const dx = event.clientX - active.x;
          const dy = event.clientY - active.y;
          if (!active.moved && Math.hypot(dx, dy) < 5) return;
          active.moved = true;
          suppressClick.current = true;
          movePhoto(index, active.originX + dx, active.originY + dy);
        }} onPointerUp={() => { drag.current = null; window.setTimeout(() => { suppressClick.current = false; }, 0); }} onPointerCancel={() => { drag.current = null; suppressClick.current = false; }} onKeyDown={(event) => {
          const delta = event.shiftKey ? 18 : 8;
          const current = positions[index] ?? { x: 0, y: 0 };
          const offsets: Record<string, [number, number]> = { ArrowLeft: [-delta, 0], ArrowRight: [delta, 0], ArrowUp: [0, -delta], ArrowDown: [0, delta] };
          const offset = offsets[event.key];
          if (!offset) return;
          event.preventDefault();
          movePhoto(index, current.x + offset[0], current.y + offset[1]);
        }} aria-describedby="diary-instructions" aria-label={`Drag or nudge photograph; select to enlarge: ${photo.caption}`}>
          <span><img src={photo.src} alt={photo.alt} loading="lazy"/></span><small>0{index + 1} / {photo.caption}</small>
        </button>)}
      </div>
    </section>

    {image && <div className="pro-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImage(null); }}><section className="pro-lightbox__panel" role="dialog" aria-modal="true" aria-label={image.caption}><button type="button" onClick={() => setImage(null)} aria-label="Close image">CLOSE <span aria-hidden="true">×</span></button><img src={image.src} alt={image.alt}/><p>{image.caption}</p></section></div>}
  </>;
}
