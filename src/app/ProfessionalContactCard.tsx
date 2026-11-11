"use client";

import { useState } from "react";

export default function ProfessionalContactCard({
  email, github, linkedin, resume, onCopyEmail,
}: { email: string; github: string; linkedin: string; resume: string; onCopyEmail: () => Promise<boolean> }) {
  const [open, setOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => { setCopied(await onCopyEmail()); window.setTimeout(() => setCopied(false), 1800); };

  return <div className={`pro-contact-card ${open ? "is-open" : ""}`}>
    {!open ? <button className="pro-contact-envelope" type="button" onClick={() => setOpen(true)} aria-label="Open the contact envelope">
      <span className="pro-contact-envelope__stamp" aria-hidden="true">S<span>/</span>S</span><span className="pro-contact-envelope__copy"><small>A NOTE, A QUESTION, A NEW IDEA</small><strong>Let’s talk.</strong><i>OPEN ENVELOPE ↗</i></span><span className="pro-contact-envelope__flap" aria-hidden="true"/>
    </button> : <article className={`pro-contact-card__face ${flipped ? "is-flipped" : ""}`}>
      {!flipped ? <div className="pro-contact-card__intro"><div className="pro-contact-card__top"><span>SAMAIRA SHARMA</span><span>CONTACT / 01</span></div><p>For thoughtful work,<br/><em>and good questions.</em></p><div className="pro-contact-card__actions"><a href={`mailto:${email}`}>Write an email ↗</a><button type="button" onClick={() => setFlipped(true)}>Turn card over <span aria-hidden="true">↻</span></button></div></div> : <div className="pro-contact-card__links"><div className="pro-contact-card__top"><span>OPEN CHANNELS</span><button type="button" onClick={() => setFlipped(false)} aria-label="Turn back to introduction">FRONT ↻</button></div>
        <a href={github} target="_blank" rel="noreferrer"><span>01</span><strong>GitHub</strong><i>↗</i></a>
        <a href={linkedin} target="_blank" rel="noreferrer"><span>02</span><strong>LinkedIn</strong><i>↗</i></a>
        <a href={`mailto:${email}`}><span>03</span><strong>Email</strong><small>{email}</small><i>↗</i></a>
        <div className="pro-contact-card__actions"><button type="button" onClick={copy}>{copied ? "Email copied ✓" : "Copy email"}</button><a href={resume} target="_blank" rel="noreferrer">Résumé PDF ↗</a></div>
      </div>}
      <button className="pro-contact-card__close" type="button" aria-label="Close contact card" onClick={() => { setOpen(false); setFlipped(false); }}>×</button>
    </article>}
  </div>;
}
