"use client";

import Link from "next/link";
import { useMemo } from "react";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category?: string;
  status?: string;
  score?: string;
  startTime?: string;
  round?: string;
};

type PlannedMatch = Match & {
  timeLabel: string;
  bucket: "Live now" | "Next up" | "Morning" | "Afternoon" | "Evening" | "Later";
  startsInLabel: string;
  sortTime: number;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchSlug(match: Match) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = String(match.id || "").split(":").pop();
  return `${readablePart}-${numericId}`;
}

function getTimeZoneLabel() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "your local time";
  } catch {
    return "your local time";
  }
}

function formatLocalTime(value?: string) {
  if (!value) return "Time TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time TBA";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function startsIn(value?: string) {
  if (!value) return "time TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "time TBA";

  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "started";

  const minutes = Math.round(diff / 60000);
  if (minutes < 60) return `in ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours < 24) return rest ? `in ${hours}h ${rest}m` : `in ${hours}h`;

  const days = Math.floor(hours / 24);
  return days === 1 ? "tomorrow" : `in ${days} days`;
}

function bucketFor(match: Match, index: number): PlannedMatch["bucket"] {
  const status = String(match.status || "").toUpperCase();
  if (status === "LIVE") return "Live now";
  if (index < 3) return "Next up";

  const date = match.startTime ? new Date(match.startTime) : null;
  if (!date || Number.isNaN(date.getTime())) return "Later";

  const hour = date.getHours();
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  if (hour < 23) return "Evening";
  return "Later";
}

function isUseful(match: Match) {
  const status = String(match.status || "").toUpperCase();
  if (["CANCELLED", "EXPIRED", "FINISHED"].includes(status)) return false;
  return Boolean(match.player1 && match.player2);
}

export default function TennisTimeZonePlanner({ matches }: { matches: Match[] }) {
  const plannedMatches = useMemo<PlannedMatch[]>(() => {
    const sorted = matches
      .filter(isUseful)
      .sort((left, right) => {
        const leftStatus = String(left.status || "").toUpperCase() === "LIVE" ? -1 : 0;
        const rightStatus = String(right.status || "").toUpperCase() === "LIVE" ? -1 : 0;
        if (leftStatus !== rightStatus) return leftStatus - rightStatus;

        return new Date(left.startTime || 0).getTime() - new Date(right.startTime || 0).getTime();
      })
      .slice(0, 12);

    return sorted.map((match, index) => ({
      ...match,
      bucket: bucketFor(match, index),
      timeLabel: formatLocalTime(match.startTime),
      startsInLabel: startsIn(match.startTime),
      sortTime: new Date(match.startTime || 0).getTime(),
    }));
  }, [matches]);

  if (plannedMatches.length === 0) return null;

  const timeZone = getTimeZoneLabel();
  const buckets: PlannedMatch["bucket"][] = [
    "Live now",
    "Next up",
    "Morning",
    "Afternoon",
    "Evening",
    "Later",
  ];

  return (
    <section className="mb-14 rounded-[2.5rem] border border-sky-400/40 bg-gradient-to-br from-sky-950/30 via-zinc-950 to-black p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-sky-400 px-4 py-2 text-sm font-black text-black">
          🌍 Local time planner
        </span>
        <span className="text-sm text-zinc-400">
          Times shown in {timeZone}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <h2 className="mb-3 text-4xl font-black text-white">
            Plan your tennis day without timezone math
          </h2>
          <p className="mb-5 leading-7 text-zinc-300">
            A compact viewing plan that converts today&apos;s match times to your browser timezone and separates the schedule into live, next up and later blocks.
          </p>
          <Link
            href="/tennis-time-zone-converter"
            className="inline-flex rounded-2xl bg-sky-400 px-5 py-3 font-black text-black hover:bg-sky-300"
          >
            Open timezone guide →
          </Link>
        </div>

        <div className="grid gap-4">
          {buckets.map((bucket) => {
            const bucketMatches = plannedMatches.filter((match) => match.bucket === bucket).slice(0, 3);
            if (bucketMatches.length === 0) return null;

            return (
              <div key={bucket} className="rounded-3xl border border-zinc-800 bg-black/40 p-5">
                <h3 className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-sky-300">
                  {bucket}
                </h3>
                <div className="space-y-3">
                  {bucketMatches.map((match) => (
                    <Link
                      key={`${bucket}-${match.id}`}
                      href={`/watch/${matchSlug(match)}`}
                      className="block rounded-2xl border border-zinc-900 bg-zinc-950 p-4 hover:border-sky-400"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-zinc-400">
                        <span>{match.category || "Tennis"}</span>
                        <span>•</span>
                        <span>{match.timeLabel}</span>
                        <span>•</span>
                        <span>{match.startsInLabel}</span>
                      </div>
                      <p className="font-black text-white">
                        {match.player1} vs {match.player2}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">{match.tournament}</p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
