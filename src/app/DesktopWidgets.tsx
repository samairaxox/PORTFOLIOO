"use client";

import { useEffect, useRef, useState } from "react";

const featuredTrack = {
  title: "Rollercoaster",
  artist: "Bleachers",
  albumArt: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02aa31c98f0add81591375af01",
};

const audioSrc = "/audio/rollercoaster-bleachers.mp3";

type ContributionDay = { date: string; count: number; column: number; row: number };
type ContributionResponse = { available: boolean; reason?: string; days?: Array<{ date: string; count: number }>; years?: number[]; failedYears?: Array<{ year: number; category: string }>; complete?: boolean; leapDayOmitted?: number };

const calendarDays: ContributionDay[] = (() => {
  // A non-leap reference year keeps the combined view to exactly 365 month/day slots.
  const year = 2025;
  const firstWeekday = new Date(year, 0, 1).getDay();
  return Array.from({ length: 365 }, (_, index) => {
    const date = new Date(year, 0, index + 1);
    const slot = firstWeekday + index;
    return {
      date: `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
      count: 0,
      column: Math.floor(slot / 7),
      row: date.getDay(),
    };
  });
})();

function WelcomeWidget() {
  return <section className="glass-widget welcome-widget welcome-widget--quote" aria-label="Your direction is more important than your speed.">
    <div className="welcome-quote">
      <span className="welcome-turtle" aria-hidden="true"><img src="/quote-turtle.png" alt="" draggable={false}/></span>
      <span className="welcome-quote__line welcome-quote__line--first">Your <i>direction</i></span>
      <span className="welcome-quote__line welcome-quote__line--second">is more <i>important</i></span>
      <span className="welcome-quote__line welcome-quote__line--third">than your <i>speed.</i></span>
    </div>
  </section>;
}

function VinylWidget() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      setAudioError("");
      try { await audio.play(); } catch { setAudioPlaying(false); setAudioError("Audio could not be played."); }
    } else audio.pause();
  };
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

  return <section className="glass-widget vinyl-widget">
    <div className="widget-topline"><span>NOW PLAYING</span></div>
    <div className="vinyl-widget-content">
      <div className={`vinyl-record ${audioPlaying ? "vinyl-record--spinning" : ""}`} aria-label="Black vinyl record with Strange Desire album artwork">
        <div className="vinyl-label"><img src={featuredTrack.albumArt} alt="Strange Desire album artwork by Bleachers"/></div>
      </div>
      <div className="vinyl-track-info"><p className="vinyl-title">{featuredTrack.title}</p><p className="vinyl-artist">{featuredTrack.artist}</p></div>
      <button className="vinyl-playback-control" type="button" onClick={toggleAudio} aria-label={audioPlaying ? "Pause Rollercoaster" : "Play Rollercoaster"}>{audioPlaying ? "Ⅱ" : "▶"}</button>
      <div className="vinyl-audio-progress"><span>{formatTime(currentTime)}</span><input aria-label="Rollercoaster playback position" type="range" min="0" max={duration || 1} value={Math.min(currentTime, duration || 1)} disabled={!duration} onChange={(event) => { if (audioRef.current) audioRef.current.currentTime = Number(event.target.value); }}/><span>{duration ? formatTime(duration) : "—:——"}</span></div>
      {audioError && <span className="vinyl-audio-error" role="status">{audioError}</span>}
    </div>
    <audio ref={audioRef} src={audioSrc} preload="none" onPlaying={() => setAudioPlaying(true)} onPause={() => setAudioPlaying(false)} onWaiting={() => setAudioPlaying(false)} onStalled={() => setAudioPlaying(false)} onEnded={(event) => { setAudioPlaying(false); setCurrentTime(event.currentTarget.duration || event.currentTarget.currentTime); }} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)} onDurationChange={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)} onError={() => { setAudioPlaying(false); setAudioError("Audio file unavailable. Check the local file path."); }}/>
  </section>;
}

function PhotosWidget() {
  const [result, setResult] = useState<ContributionResponse | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/github-contributions")
      .then(async (response) => {
        const data = await response.json() as ContributionResponse;
        if (!response.ok && data.available !== false) throw new Error("Contribution history unavailable");
        return data;
      })
      .then((data) => { if (active) setResult(data); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, []);

  const counts = new Map((result?.days ?? []).map(({ date, count }) => [date, count]));
  const days = calendarDays.map((day) => ({ ...day, count: counts.get(day.date) ?? 0 }));
  const maxCount = Math.max(1, ...days.map(({ count }) => count));
  const levelFor = (count: number) => count === 0 ? 0 : count <= maxCount * 0.25 ? 1 : count <= maxCount * 0.5 ? 2 : count <= maxCount * 0.75 ? 3 : 4;
  const monthLabels = Array.from({ length: 12 }, (_, month) => new Date(2025, month, 1).toLocaleString("en", { month: "short" }));
  const errorCopy: Record<string, string> = {
    MISSING_TOKEN: "Add GITHUB_TOKEN to .env.local, then restart Next.js.",
    AUTHENTICATION_FAILED: "GitHub rejected GITHUB_TOKEN. Replace it with a valid token and restart Next.js.",
    RATE_LIMITED: "GitHub rate limited this request. Try again later.",
    FORBIDDEN: "The token does not have permission to read this profile’s contribution data.",
    PROFILE_NOT_FOUND: "GitHub could not find the samairaxox profile.",
    GRAPHQL_ERROR: "GitHub returned a GraphQL error. The contribution history could not be read.",
    NETWORK_ERROR: "GitHub could not be reached. Check the connection and try again.",
  };

  return <section className="glass-widget photos-widget contribution-widget" aria-label="GitHub contribution calendar">
    <div className="widget-topline"><span>THE COMMIT DIARY</span></div>
    <p className="contribution-subtitle">A little code, almost every day.</p>
    {result?.available && result.days ? <>
      <div className="contribution-months" aria-hidden="true">{monthLabels.map((month) => <span key={month}>{month}</span>)}</div>
      <div className="contribution-grid" aria-label="Combined daily GitHub contributions across years">
        {days.map(({ date, count, column, row }) => {
          const label = new Date(`2025-${date}T12:00:00`).toLocaleDateString(undefined, { month: "long", day: "numeric" });
          return <span key={date} className={`contribution-cell contribution-cell--${levelFor(count)}`} style={{ gridColumn: column + 1, gridRow: row + 1 }} title={`${label}: ${count} combined contributions`} aria-label={`${label}: ${count} combined contributions`} />;
        })}
      </div>
      <div className="contribution-footer">
        <span className="contribution-period"><span>Combined activity across years</span><small>{result.years?.length ? result.years.join(" · ") : "No activity years returned"}</small></span>
        <span className="contribution-legend" aria-label="Contribution intensity: less to more"><span>Less</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`contribution-cell--${level}`} />)}<span>More</span></span>
      </div>
      {result.failedYears?.length ? <p className="contribution-partial" role="status">Unavailable years: {result.failedYears.map(({ year, category }) => `${year} (${category})`).join(", ")}</p> : null}
      <a className="contribution-profile" href="https://github.com/samairaxox" target="_blank" rel="noreferrer">View GitHub profile ↗</a>
    </> : <div className="contribution-unavailable" role="status">
      <p>{failed ? "Contribution history could not be loaded." : result?.reason ? errorCopy[result.reason] ?? `GitHub error: ${result.reason}.` : "Loading real contribution history…"}</p>
      <a className="contribution-profile" href="https://github.com/samairaxox" target="_blank" rel="noreferrer">View GitHub profile ↗</a>
    </div>}
  </section>;
}

function CalendarWidget({ now }: { now: Date | null }) {
  if (!now) return <section className="glass-widget calendar-widget" aria-label="Loading local calendar">
    <div className="widget-topline"><span>AT A GLANCE</span><span className="calendar-live-dot"/></div>
  </section>;
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return <section className="glass-widget calendar-widget">
    <div className="widget-topline"><span>AT A GLANCE</span><span className="calendar-live-dot"/> </div>
    <div className="calendar-heading"><div><span className="calendar-weekday">{now.toLocaleDateString(undefined, { weekday: "long" }).toUpperCase()}</span><strong>{now.getDate()}</strong></div><span className="calendar-month">{now.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</span></div>
    <div className="calendar-grid" aria-label={`${now.toLocaleDateString(undefined, { month: "long" })} calendar`}>
      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span className="calendar-day-name" key={`${day}-${index}`}>{day}</span>)}
      {Array.from({ length: firstDay }, (_, index) => <span className="calendar-day calendar-day--empty" key={`blank-${index}`}/>)}
      {Array.from({ length: daysInMonth }, (_, index) => <span className={`calendar-day ${index + 1 === now.getDate() ? "calendar-day--today" : ""}`} key={index + 1}>{index + 1}</span>)}
    </div>
  </section>;
}

export default function DesktopWidgets({ now }: { now: Date | null }) {
  return <div className="desktop-widgets" aria-label="Desktop widgets">
    <WelcomeWidget/>
    <div className="desktop-widget-columns">
      <div className="desktop-widget-column desktop-widget-column--left"><VinylWidget/></div>
      <div className="desktop-widget-column desktop-widget-column--right"><CalendarWidget now={now}/></div>
    </div>
    <PhotosWidget/>
  </div>;
}
