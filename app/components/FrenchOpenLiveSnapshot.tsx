"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { startSmartMatchPolling } from "@/app/lib/smartMatchPolling";

type FrenchOpenMatch = {
  id?: string;
  tournament?: string;
  round?: string;
  category?: string;
  player1?: string;
  player2?: string;
  status?: "LIVE" | "Scheduled" | "Finished" | string;
  rawStatus?: string;
  score?: string;
  winner?: string;
  date?: string;
  time?: string;
  court?: string;
};

type FrenchOpenTodayResponse = {
  success?: boolean;
  count?: number;
  dateStart?: string;
  dateStop?: string;
  matches?: FrenchOpenMatch[];
  error?: string;
};

function getMatchTime(match: FrenchOpenMatch) {
  if (match.status === "LIVE") return 0;

  const parsed = new Date(`${match.date || "9999-12-31"}T${match.time || "23:59"}:00`).getTime();
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

function getMatchTitle(match: FrenchOpenMatch) {
  return `${match.player1 || "TBD"} vs ${match.player2 || "TBD"}`;
}

function getMatchHref(match: FrenchOpenMatch) {
  if (match.status === "LIVE") return "/french-open-live";
  if (match.status === "Finished") return "/french-open-results";

  return "/french-open-today";
}

function statusPill(match: FrenchOpenMatch) {
  if (match.status === "LIVE") return "Live now";
  if (match.status === "Finished") return "Result";

  return "Upcoming";
}

export default function FrenchOpenLiveSnapshot({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<FrenchOpenTodayResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadSnapshot() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/french-open-today", { cache: "no-store" });
        const payload: FrenchOpenTodayResponse = await response.json();

        if (!ignore) setData(payload);
        return payload.matches || [];
      } catch (error) {
        console.error("French Open live snapshot failed:", error);
        if (!ignore) setData({ error: "Unable to load French Open live snapshot." });
        return [];
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    const stopPolling = startSmartMatchPolling({ load: loadSnapshot });

    return () => {
      ignore = true;
      stopPolling();
    };
  }, []);

  const stats = useMemo(() => {
    const matches = data?.matches || [];

    return {
      live: matches.filter((match) => match.status === "LIVE").length,
      upcoming: matches.filter((match) => match.status === "Scheduled").length,
      finished: matches.filter((match) => match.status === "Finished").length,
      total: matches.length,
    };
  }, [data]);

  const priorityMatches = useMemo(() => {
    return (data?.matches || [])
      .filter((match) => match.status === "LIVE" || match.status === "Scheduled" || match.status === "Finished")
      .sort((a, b) => {
        if (a.status === "LIVE" && b.status !== "LIVE") return -1;
        if (b.status === "LIVE" && a.status !== "LIVE") return 1;
        if (a.status === "Scheduled" && b.status === "Finished") return -1;
        if (b.status === "Scheduled" && a.status === "Finished") return 1;

        return getMatchTime(a) - getMatchTime(b);
      })
      .slice(0, compact ? 3 : 5);
  }, [compact, data]);

  if (isLoading) {
    return (
      <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm font-bold text-zinc-400">Loading today’s French Open snapshot…</p>
      </section>
    );
  }

  if (!data?.matches?.length) {
    return (
      <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
        <p className="mb-2 text-xs font-black uppercase tracking-widest text-orange-300">Today’s snapshot</p>
        <h2 className="text-3xl font-black">French Open match feed is quiet right now</h2>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
          Check the schedule, draw tracker or country viewing guide while the live match feed updates.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/french-open-today" className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-black text-black transition hover:bg-orange-400">
            Open today’s schedule →
          </Link>
          <Link href="/where-to-watch-french-open" className="rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-black transition hover:border-orange-500">
            Where to watch →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10 rounded-[2rem] border border-orange-500/40 bg-gradient-to-br from-zinc-950 via-black to-orange-950/20 p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-orange-300">Today’s French Open snapshot</p>
          <h2 className="text-3xl font-black">What to follow right now</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
            A quick live/upcoming/results summary so visitors can choose the fastest path: watch, follow the draw, or catch up.
          </p>
        </div>
        <Link href="/french-open-today" className="rounded-2xl border border-orange-500/50 px-4 py-3 text-sm font-black text-orange-200 transition hover:bg-orange-500 hover:text-black">
          Full schedule →
        </Link>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        {[
          ["Live", stats.live],
          ["Upcoming", stats.upcoming],
          ["Results", stats.finished],
          ["Total loaded", stats.total],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-zinc-800 bg-black p-4">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {priorityMatches.map((match, index) => (
          <article key={`${match.id || getMatchTitle(match)}-${index}`} className="rounded-3xl border border-zinc-800 bg-black p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-black uppercase tracking-widest text-zinc-400">
                {match.round || match.category || "French Open"}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${match.status === "LIVE" ? "bg-orange-500 text-black" : match.status === "Finished" ? "bg-emerald-950 text-emerald-200" : "bg-sky-950 text-sky-200"}`}>
                {statusPill(match)}
              </span>
            </div>
            <h3 className="text-xl font-black leading-tight">{getMatchTitle(match)}</h3>
            <p className="mt-3 text-sm text-zinc-500">
              {[match.date, match.time, match.court].filter(Boolean).join(" · ") || match.rawStatus || "Schedule details updating"}
            </p>
            {match.score ? <p className="mt-2 text-sm font-black text-emerald-300">{match.score}</p> : null}
            <Link href={getMatchHref(match)} className="mt-4 inline-flex rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-black transition hover:border-orange-500 hover:text-orange-200">
              {match.status === "Finished" ? "View result" : "Follow match"} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
