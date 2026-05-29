"use client";

import { useEffect, useMemo, useState } from "react";

type Match = {
  id: string;
  player1?: string;
  player2?: string;
  status: string;
  score: string;
  pointScore?: string | null;
  startTime: string | null;
};

type MatchesApiResponse = Match[] | { matches?: Match[]; error?: string };

function normalizeStatus(status: string) {
  return status.toUpperCase();
}

function isLive(status: string) {
  return normalizeStatus(status) === "LIVE";
}

function isFinished(status: string) {
  return ["FINISHED", "CANCELLED", "RETIRED", "COMPLETED"].includes(
    normalizeStatus(status)
  );
}

function getStatusStyles(status: string) {
  const normalized = normalizeStatus(status);

  if (normalized === "LIVE") {
    return "bg-red-500 text-white shadow-lg shadow-red-500/20 animate-pulse";
  }

  if (normalized === "UPCOMING") {
    return "bg-sky-400 text-black";
  }

  if (normalized === "SUSPENDED") {
    return "bg-yellow-400 text-black";
  }

  if (isFinished(status)) {
    return "bg-zinc-700 text-zinc-200";
  }

  return "bg-green-500 text-black";
}

function getPointScoreDisplay(match: Match) {
  const pointScore = String(match.pointScore || "").trim();

  if (!pointScore || pointScore === "-" || pointScore === "0-0") {
    if (isLive(match.status)) return "Waiting for next point";
    return "Not live";
  }

  return pointScore;
}

function hasLivePointScore(match: Match) {
  return isLive(match.status);
}

function hasPointValue(match: Match) {
  const pointScore = String(match.pointScore || "").trim();

  return Boolean(pointScore && pointScore !== "-" && pointScore !== "0-0");
}

function getScoreDisplay(match: Match) {
  const score = String(match.score || "").trim();

  if (!score || score === "-" || score === "0-0") {
    if (isLive(match.status)) return "Live score pending";
    if (normalizeStatus(match.status) === "UPCOMING") return "Not started";
    return "Score unavailable";
  }

  return score;
}

function getScoreParts(match: Match) {
  const score = getScoreDisplay(match);

  if (["Live score pending", "Not started", "Score unavailable"].includes(score)) {
    return [];
  }

  return score
    .split(",")
    .map((part) => part.trim().replace(/\s+/g, " ").replace(/\s*-\s*/g, "-"))
    .filter(Boolean);
}

function formatShortTime(value: string | null) {
  if (!value) return "TBC";

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "TBC";

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getMatchPhase(match: Match) {
  if (isLive(match.status)) return "Live now";
  if (normalizeStatus(match.status) === "UPCOMING") return "Upcoming match";
  if (normalizeStatus(match.status) === "SUSPENDED") return "Delayed or suspended";
  if (isFinished(match.status)) return "Completed match";
  return "Match status";
}

function getTimeContext(match: Match) {
  if (!match.startTime) return "Official start time has not been confirmed yet.";

  const start = new Date(match.startTime).getTime();
  if (Number.isNaN(start)) return "Official start time has not been confirmed yet.";

  const diff = start - Date.now();
  const minutes = Math.round(Math.abs(diff) / 60000);

  if (isLive(match.status)) return "Match is marked as live in the current feed.";
  if (diff > 0 && minutes <= 90) return `Scheduled to start in about ${minutes} minutes.`;
  if (diff > 0) return `Scheduled for ${new Date(match.startTime).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}.`;
  if (isFinished(match.status)) return "This match is no longer active.";

  return "Start time may have moved. Check official order of play before watching.";
}

function getMatchesFromResponse(data: MatchesApiResponse) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.matches)) return data.matches;
  return [];
}

function ScorePills({ match }: { match: Match }) {
  const scoreParts = getScoreParts(match);

  if (scoreParts.length === 0) {
    return <p className="text-2xl font-black text-white sm:text-3xl">{getScoreDisplay(match)}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2" aria-label="Set score" aria-live="polite">
      {scoreParts.map((scorePart, index) => (
        <div
          key={`${scorePart}-${index}`}
          className="min-w-16 rounded-2xl border border-white/10 bg-zinc-950/70 px-3 py-2 text-center shadow-inner"
        >
          <p className="text-[10px] font-black uppercase tracking-wide text-zinc-500">
            Set {index + 1}
          </p>
          <p className="whitespace-nowrap text-2xl font-black leading-tight text-white sm:text-3xl">
            {scorePart}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function LiveMatchScore({ initialMatch }: { initialMatch: Match }) {
  const [match, setMatch] = useState(initialMatch);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const shouldPoll = useMemo(() => !isFinished(match.status), [match.status]);

  useEffect(() => {
    if (!shouldPoll) return;

    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function refreshMatch() {
      try {
        setIsRefreshing(true);
        const response = await fetch(
          `/api/matches?matchId=${encodeURIComponent(initialMatch.id)}&_=${Date.now()}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          }
        );

        if (!response.ok) throw new Error("Match update request failed");

        const data = (await response.json()) as MatchesApiResponse;
        const freshMatch = getMatchesFromResponse(data).find(
          (item) => String(item.id) === String(initialMatch.id)
        );

        if (!isMounted) return;

        if (freshMatch) {
          setMatch((current) => ({ ...current, ...freshMatch }));
          setLastUpdatedAt(new Date());
          setUpdateError(null);
        }
      } catch {
        if (isMounted) {
          setUpdateError("Live score update temporarily unavailable");
        }
      } finally {
        if (isMounted) {
          setIsRefreshing(false);
          refreshMatch();
        }
      }
    }

    timeoutId = setTimeout(refreshMatch, 15000);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [initialMatch.id, shouldPoll]);

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/60 p-5 shadow-2xl sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-black uppercase tracking-wide text-zinc-500">
          Current score
        </p>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${getStatusStyles(match.status)}`}>
          {getMatchPhase(match)}
        </span>
      </div>

      <div className="grid gap-4">
        <section>
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-zinc-500">Sets / games</p>
          <ScorePills match={match} />
        </section>

        <section className={`rounded-3xl border p-4 ${hasLivePointScore(match) ? "border-red-400/40 bg-red-500/10" : "border-white/10 bg-zinc-950/60"}`}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Current game</p>
            {hasLivePointScore(match) ? (
              <span className="rounded-full bg-red-500/20 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-red-200">
                Points enabled
              </span>
            ) : (
              <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-zinc-400">
                Not live
              </span>
            )}
          </div>
          <p className={`${hasPointValue(match) ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl"} break-words font-black leading-tight text-white`} aria-live="polite">
            {getPointScoreDisplay(match)}
          </p>
          {hasLivePointScore(match) && !hasPointValue(match) ? (
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              Live point updates are enabled and will appear here as soon as the feed exposes the current in-game score.
            </p>
          ) : null}
        </section>
      </div>

      <div className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between gap-4 border-t border-zinc-800 pt-3">
          <span className="text-zinc-500">Start time</span>
          <span className="font-bold text-zinc-200">{formatShortTime(match.startTime)}</span>
        </div>
        <div className="flex justify-between gap-4 border-t border-zinc-800 pt-3">
          <span className="text-zinc-500">Status</span>
          <span className="font-bold text-zinc-200">{match.status}</span>
        </div>
        <div className="border-t border-zinc-800 pt-3 text-zinc-400">
          {getTimeContext(match)}
        </div>
        <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-500" aria-live="polite">
          {isRefreshing
            ? "Updating live score…"
            : lastUpdatedAt
              ? `Last updated ${lastUpdatedAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })}`
              : shouldPoll
                ? "Live updates enabled"
                : "Live updates stopped"}
          {updateError ? <span className="block text-yellow-400">{updateError}</span> : null}
        </div>
      </div>
    </div>
  );
}
