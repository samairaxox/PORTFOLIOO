"use client";

import { useEffect, useState } from "react";
import { achievements, photoDiary } from "./professional-data";

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

    <section className="pro-recognition pro-section" id="achievements" aria-labelledby="recognition-title">
      <div className="pro-section-heading pro-reveal"><span className="pro-section-index">04</span><span>RECOGNITION / THE RECORD</span><span className="pro-section-aside">COMPETITION · RESEARCH · CERTIFICATION</span></div>
      <div className="pro-recognition__heading pro-reveal"><h2 id="recognition-title">Work in<br/><em>good company.</em></h2><p>Milestones, shown with their original supporting material where available.</p></div>
      <div className="pro-awards">
        {achievements.map((item) => <button className="pro-award pro-reveal" type="button" key={item.id} disabled={!item.image} onClick={() => item.image && setImage({ src: item.image, alt: item.imageAlt ?? item.title, caption: item.imageCaption ?? item.title })} aria-label={`${item.title}, ${item.result}${item.image ? ", view supporting image" : ""}`}>
          <span className="pro-award__number">{item.number}</span><span className="pro-award__copy"><span>{[item.organization, item.period].filter(Boolean).join(" · ")}</span><strong>{item.title}</strong><span className="pro-award__result">{item.result}</span></span>
          {item.image ? <span className="pro-award__thumb"><img src={item.image} alt="" loading="lazy"/></span> : <span className="pro-award__seal" aria-hidden="true">NISM<br/>V-A</span>}
          <span className="pro-award__arrow" aria-hidden="true">{item.image ? "VIEW ↗" : "CERTIFIED"}</span>
        </button>)}
      </div>
      <p className="pro-archive-note">The NISM certification is listed without an image because no certificate artwork is present in the supplied files.</p>
    </section>
    {image && <div className="pro-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setImage(null); }}><section className="pro-lightbox__panel" role="dialog" aria-modal="true" aria-label={image.caption}><button type="button" onClick={() => setImage(null)} aria-label="Close image">CLOSE <span aria-hidden="true">×</span></button><img src={image.src} alt={image.alt}/><p>{image.caption}</p></section></div>}
  </>;
}
