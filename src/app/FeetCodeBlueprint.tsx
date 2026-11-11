"use client";

import { useState } from "react";

const nodes = [
  { id: "route", label: "Demo route", eyebrow: "APP ROUTER", detail: "The public app/demo/page.tsx route builds a resettable sample dashboard in client-side React state. The demo is explicitly designed to work without sign-in." },
  { id: "dashboard", label: "HomeDashboard", eyebrow: "UI COMPONENT", detail: "The route passes challenge collections, demo coins, loading state, join callbacks, and the create-challenge dialog into the reusable HomeDashboard component." },
  { id: "state", label: "Local demo state", eyebrow: "REACT STATE", detail: "Sample challenges and 450 demo coins live in the demo page component. Joining or creating challenges updates this in-memory state; the sample resets on refresh." },
  { id: "create", label: "Create challenge", eyebrow: "DEMO ACTION", detail: "The demo form validates problem count, rating, duration, and stake against the local coin balance, then adds a fictional challenge to the local state." },
  { id: "join", label: "Join challenge", eyebrow: "DEMO ACTION", detail: "The join callback checks the sample balance and participant list, then updates the local pool, participation, and demo coin total." },
  { id: "auth", label: "Firebase Auth", eyebrow: "PRODUCTION APP", detail: "Outside the self-contained demo route, the production AuthProvider listens for Firebase authentication state changes." },
  { id: "token", label: "Firebase ID token", eyebrow: "AUTH FLOW", detail: "When a production user is signed in, the client obtains an ID token and includes it as a Bearer token in its profile request." },
  { id: "api", label: "Configured API", eyebrow: "PRODUCTION APP", detail: "The production profile request targets API_BASE_URL + /api/auth/me. API_BASE_URL is configured through NEXT_PUBLIC_API_URL, with a documented Render service fallback." },
];

export default function FeetCodeBlueprint() {
  const [activeId, setActiveId] = useState("route");
  const active = nodes.find((node) => node.id === activeId) ?? nodes[0];
  return <section className="feetcode-blueprint" aria-labelledby="feetcode-blueprint-title">
    <div className="feetcode-blueprint__heading"><div><span className="work-dialog__label">SYSTEM NOTES / VERIFIED CLIENT FLOWS</span><h3 id="feetcode-blueprint-title">A small map of<br/><em>how it connects.</em></h3></div><span className="feetcode-blueprint__index">01—08</span></div>
    <div className="feetcode-blueprint__flow" aria-label="FeetCode architecture explorer">
      <p className="feetcode-blueprint__flow-label">PUBLIC DEMO · SELF-CONTAINED</p>
      <div className="feetcode-blueprint__nodes">
        {nodes.slice(0, 5).map((node, index) => <div className="feetcode-blueprint__step" key={node.id}>
          <button type="button" className={activeId === node.id ? "is-active" : ""} aria-pressed={activeId === node.id} onFocus={() => setActiveId(node.id)} onClick={() => setActiveId(node.id)}><small>{node.eyebrow}</small><strong>{node.label}</strong></button>
          {index < 4 && <span className="feetcode-blueprint__connector" aria-hidden="true">{index === 1 ? "↔" : "→"}</span>}
        </div>)}
      </div>
      <p className="feetcode-blueprint__flow-label feetcode-blueprint__flow-label--production">PRODUCTION APP · AUTHENTICATED PROFILE PATH</p>
      <div className="feetcode-blueprint__nodes feetcode-blueprint__nodes--production">
        {nodes.slice(5).map((node, index) => <div className="feetcode-blueprint__step" key={node.id}>
          <button type="button" className={activeId === node.id ? "is-active" : ""} aria-pressed={activeId === node.id} onFocus={() => setActiveId(node.id)} onClick={() => setActiveId(node.id)}><small>{node.eyebrow}</small><strong>{node.label}</strong></button>
          {index < 2 && <span className="feetcode-blueprint__connector" aria-hidden="true">→</span>}
        </div>)}
      </div>
    </div>
    <div className="feetcode-blueprint__detail" aria-live="polite"><span>{active.eyebrow} / SELECTED</span><p>{active.detail}</p></div>
    <p className="feetcode-blueprint__note">This map reflects inspected client files; the demo’s fictional challenge activity is not connected to production data.</p>
  </section>;
}
