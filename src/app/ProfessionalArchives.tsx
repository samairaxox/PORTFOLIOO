"use client";

import { useEffect, useState } from "react";
import { photoDiary } from "./professional-data";

type ImageStory = { src: string; alt: string; caption: string };

export default function ProfessionalArchives() {
  const [image, setImage] = useState<ImageStory | null>(null);
  useEffect(() => {
    if (!image) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setImage(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [image]);

  return <>
    <section className="pro-diary pro-section" id="journal" aria-labelledby="diary-title">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">03</span><span>PERSONAL ARCHIVE / PHOTO DIARY</span><span className="pro-section-aside">A FEW MOMENTS BETWEEN BUILDS</span></div>
      <div className="pro-diary__heading pro-reveal"><h2 id="diary-title">Little moments,<br/><em>kept close.</em></h2><p>People, places, and small details that stay with me.</p></div>
      <div className="pro-diary__grid">
        {photoDiary.map((photo, index) => <button className={`pro-diary__photo pro-diary__photo--${index + 1} pro-reveal`} type="button" key={photo.src} onClick={() => setImage(photo)} aria-label={`Enlarge photograph: ${photo.caption}`}>
          <span><img src={photo.src} alt={photo.alt} loading="lazy"/></span><small>0{index + 1} / {photo.caption}</small>
        </button>)}
      </div>
    </section>

    {image && <div className="pro-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImage(null); }}><section className="pro-lightbox__panel" role="dialog" aria-modal="true" aria-label={image.caption}><button type="button" onClick={() => setImage(null)} aria-label="Close image">CLOSE <span aria-hidden="true">×</span></button><img src={image.src} alt={image.alt}/><p>{image.caption}</p></section></div>}
  </>;
}
