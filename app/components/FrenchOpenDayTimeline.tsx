"use client";

import { useEffect, useMemo, useState } from "react";

type TimelineMatch = {
  id?: string;
  tournament?: string;
  round?: string;
  category?: string;
  player1?: string;
  player2?: string;
  status?: string;
  score?: string;
  winner?: string;
  date?: string;
  time?: string;
  startTime?: string;
  court?: string;
};

type TimelineResponse = {
  success?: boolean;
  matches?: TimelineMatch[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchSlug(match: TimelineMatch) {
  const readablePart = slugify(`${match.player1 || "player"}-vs-${match.player2 || "player"}`);
  const numericId = String(match.id || "").split(":").pop() || "match";

  return `${readablePart}-${numericId}`;
}

function matchHref(match: TimelineMatch) {
  return `/watch/${matchSlug(match)}`;
}

function isLive(match: TimelineMatch) {
  return `${match.status || ""}`.toUpperCase() === "LIVE";
}

function isFinished(match: TimelineMatch) {
  const status = `${match.status || ""}`.toLowerCase();

  return (
    status.includes("finished") ||
    status.includes("complete") ||
    status.includes("ended") ||
    status.includes("final") ||
    status.includes("retired") ||
    status.includes("walkover")
  );
}

function statusLabel(match: TimelineMatch) {
  if (isLive(match)) return "LIVE";
  if (isFinished(match)) return "DONE";
  return "NEXT";
}

function statusClass(match: TimelineMatch) {
  if (isLive(match)) return "bg-lime-400 text-black";
  if (isFinished(match)) return "bg-zinc-800 text-zinc-300";
  return "bg-orange-500 text-black";
}

function timeLabel(match: TimelineMatch) {
  if (match.time) return match.time.slice(0, 5);
  if (match.startTime) {
    const date = new Date(match.startTime);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  }

  return "TBA";
}

function winnerLine(match: TimelineMatch) {
  if (isLive(match)) return match.score ? `Live score: ${match.score}` : "Live now";
  if (isFinished(match)) {
    return [match.winner ? `${match.winner} advanced` : "Completed", match.score]
      .filter(Boolean)
      .join(" · ");
  }

  return [match.round, match.court ? `Court: ${match.court}` : "Scheduled today"]
    .filter(Boolean)
    .join(" · ");
}



function normalizeMatchPart(value?: string) {
  return `${value || ""}`.trim().toLowerCase();
}

function matchIdentity(match: TimelineMatch) {
  const stableId = match.id ? `id:${match.id}` : "";
  if (stableId) return stableId;

  const slug = match.player1 && match.player2 ? matchSlug(match) : "";
  if (slug && !slug.endsWith("-match")) return `slug:${slug}`;

  return [
    normalizeMatchPart(match.player1),
    normalizeMatchPart(match.player2),
    normalizeMatchPart(match.tournament),
    normalizeMatchPart(match.round),
    normalizeMatchPart(match.date),
    normalizeMatchPart(match.time || match.startTime),
  ].join("|");
}

function isSameMatch(a?: TimelineMatch | null, b?: TimelineMatch | null) {
  if (!a || !b) return false;
  return matchIdentity(a) === matchIdentity(b);
}

function isMainTourSingles(match: TimelineMatch) {
  const haystack = [match.category, match.round, match.tournament]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (!haystack) return false;

  const isSingles = haystack.includes("singles");
  const isMainTour = haystack.includes("atp") || haystack.includes("wta");

  const excludedSignals = [
    "double",
    "mixed",
    "boy",
    "girl",
    "junior",
    "wheelchair",
    "legend",
    "qualifying",
  ];

  return isSingles && isMainTour && !excludedSignals.some((signal) => haystack.includes(signal));
}

function sortTimeline(a: TimelineMatch, b: TimelineMatch) {
  const aKey = `${a.date || ""} ${a.time || ""}`;
  const bKey = `${b.date || ""} ${b.time || ""}`;

  return aKey.localeCompare(bKey);
}

function buildCurrentFocus(matches: TimelineMatch[]) {
  const live = matches.find(isLive);
  if (live) return { label: "Now playing", match: live };

  const next = matches.find((match) => !isFinished(match));
  if (next) return { label: "Next up", match: next };

  const latest = [...matches].reverse().find(isFinished);
  if (latest) return { label: "Latest result", match: latest };

  return null;
}

export default function FrenchOpenDayTimeline({ compact = false }: { compact?: boolean }) {
  const [matches, setMatches] = useState<TimelineMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadTimeline() {
      try {
        const res = await fetch("/api/french-open-today", { cache: "no-store" });
        if (!res.ok) return;

        const data: TimelineResponse | TimelineMatch[] = await res.json();
        const nextMatches = Array.isArray(data) ? data : data.matches || [];

        if (active) setMatches(nextMatches.filter((match) => match.player1 && match.player2));
      } catch {
        if (active) setMatches([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTimeline();

    return () => {
      active = false;
    };
  }, []);

  const timeline = useMemo(() => {
    const sortedMatches = [...matches].sort(sortTimeline);
    const mainTourSingles = sortedMatches.filter(isMainTourSingles);
    const sourceMatches = mainTourSingles.length ? mainTourSingles : sortedMatches;

    return sourceMatches.slice(0, compact ? 8 : 18);
  }, [matches, compact]);
  const focus = useMemo(() => buildCurrentFocus(timeline), [timeline]);
  const visibleTimeline = useMemo(() => {
    if (!focus) return timeline;

    return timeline.filter((match) => !isSameMatch(match, focus.match));
  }, [timeline, focus]);

  if (loading) {
    return (
      <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 text-zinc-400">
        Loading Roland Garros day timeline…
      </section>
    );
  }

  if (!timeline.length) return null;

  return (
    <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-[0.24em] text-orange-300">Day timeline</p>
          <h2 className="text-3xl font-black md:text-4xl">French Open timeline today</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
            Track the biggest ATP and WTA singles matches of the day.
          </p>
        </div>

        <a
          href="/french-open"
          className="rounded-2xl border border-orange-500/60 px-5 py-3 text-sm font-black text-orange-300 transition hover:bg-orange-500 hover:text-black"
        >
          Full today page →
        </a>
      </div>

      {focus ? (
        <a
          href={matchHref(focus.match)}
          className="mb-6 block rounded-3xl border border-orange-500/50 bg-orange-500/10 p-5 transition hover:bg-orange-500/15"
        >
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-black">{focus.label}</span>
            <span className="text-sm font-bold text-zinc-400">{timeLabel(focus.match)}</span>
            {focus.match.round ? <span className="text-sm text-zinc-500">{focus.match.round}</span> : null}
          </div>
          <p className="text-2xl font-black text-white">
            {focus.match.player1} <span className="text-zinc-500">vs</span> {focus.match.player2}
          </p>
          <p className="mt-2 text-sm text-zinc-300">{winnerLine(focus.match)}</p>
        </a>
      ) : null}

      <div className="relative space-y-3 before:absolute before:bottom-2 before:left-[4.25rem] before:top-2 before:w-px before:bg-zinc-800 md:before:left-[5.25rem]">
        {visibleTimeline.map((match) => (
          <a
            key={`${match.id}-${match.status}-${match.time}`}
            href={matchHref(match)}
            className="relative grid grid-cols-[4.75rem_1fr] gap-4 rounded-2xl border border-zinc-900 bg-black/50 p-4 transition hover:border-orange-500/70 hover:bg-zinc-950 md:grid-cols-[5.75rem_1fr]"
          >
            <div className="text-right">
              <p className="text-lg font-black text-white">{timeLabel(match)}</p>
              <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-black ${statusClass(match)}`}>
                {statusLabel(match)}
              </span>
            </div>

            <div className="pl-5">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                {match.round ? <span>{match.round}</span> : null}
                {match.court ? <span>· {match.court}</span> : null}
                {match.category ? <span>· {match.category}</span> : null}
              </div>
              <p className="mt-1 text-lg font-black text-white">
                {match.player1} <span className="text-zinc-500">vs</span> {match.player2}
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">{winnerLine(match)}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
