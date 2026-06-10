"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DrawStatus = "advanced" | "eliminated" | "live" | "upcoming" | "potential";

type DrawMatch = {
  round: string;
  player: string;
  opponent: string;
  status: DrawStatus;
  result?: string;
  note?: string;
  watchHref?: string;
};

type PlayerPath = {
  id: string;
  player: string;
  tour: "ATP" | "WTA";
  nextMatchDate?: string;
  nextMatchTime?: string;
  nextMatchStatus?: "LIVE" | "Scheduled";
  nextOpponent?: string;
  matches: DrawMatch[];
};

type DrawTrackerResponse = {
  activePlayers?: PlayerPath[];
  activeCount?: number;
  sourceMatchCount?: number;
  error?: string;
};

type NextMatchCard = {
  id: string;
  player: string;
  opponent: string;
  tour: "ATP" | "WTA";
  round: string;
  status: "LIVE" | "Scheduled";
  date?: string;
  time?: string;
  href: string;
};

function normalizeName(value?: string) {
  return `${value || ""}`.replace(/\s+/g, " ").trim();
}

function matchKey(player: string, opponent: string, date?: string, time?: string) {
  const names = [normalizeName(player).toLowerCase(), normalizeName(opponent).toLowerCase()].sort();
  return [...names, date || "", time || ""].join("|");
}

function getSortValue(match: NextMatchCard) {
  if (match.status === "LIVE") return 0;
  const parsed = new Date(`${match.date || "9999-12-31"}T${match.time || "23:59"}:00`).getTime();
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

export default function FrenchOpenNextMatchesStrip({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<DrawTrackerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadNextMatches() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/french-open-schedule-tracker", { cache: "no-store" });
        const payload: DrawTrackerResponse = await response.json();

        if (!ignore) setData(payload);
      } catch (error) {
        console.error("French Open next matches strip failed:", error);
        if (!ignore) setData({ error: "Unable to load French Open next matches." });
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadNextMatches();

    return () => {
      ignore = true;
    };
  }, []);

  const nextMatches = useMemo(() => {
    const map = new Map<string, NextMatchCard>();

    (data?.activePlayers || []).forEach((path) => {
      const next = path.matches.find((match) => match.status === "live" || match.status === "upcoming");
      if (!next || !path.nextOpponent) return;

      const key = matchKey(path.player, path.nextOpponent, path.nextMatchDate, path.nextMatchTime);

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          player: path.player,
          opponent: path.nextOpponent,
          tour: path.tour,
          round: next.round || "Next match",
          status: path.nextMatchStatus || (next.status === "live" ? "LIVE" : "Scheduled"),
          date: path.nextMatchDate,
          time: path.nextMatchTime,
          href: next.status === "live" ? "/french-open" : "/french-open",
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => getSortValue(a) - getSortValue(b)).slice(0, compact ? 3 : 6);
  }, [compact, data]);

  if (isLoading) {
    return (
      <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm font-bold text-zinc-400">Loading the next active French Open matches…</p>
      </section>
    );
  }

  if (nextMatches.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 rounded-[2rem] border border-orange-500/40 bg-gradient-to-br from-zinc-950 via-black to-orange-950/20 p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-orange-300">Next in the draw</p>
          <h2 className="text-3xl font-black">Active French Open matches to follow</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
            Built from the same active-player feed as the draw tracker, so completed matches do not appear as next fixtures.
          </p>
        </div>
        <Link href="/french-open-order-of-play" className="rounded-2xl border border-orange-500/50 px-4 py-3 text-sm font-black text-orange-200 transition hover:bg-orange-500 hover:text-black">
          Open draw tracker →
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {nextMatches.map((match) => (
          <article key={match.id} className="rounded-3xl border border-zinc-800 bg-black p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-black uppercase tracking-widest text-zinc-400">{match.tour}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${match.status === "LIVE" ? "bg-orange-500 text-black" : "bg-sky-950 text-sky-200"}`}>
                {match.status === "LIVE" ? "Live now" : "Upcoming"}
              </span>
            </div>
            <h3 className="text-xl font-black leading-tight">
              {match.player} <span className="text-zinc-500">vs</span> {match.opponent}
            </h3>
            <p className="mt-3 text-sm font-bold text-zinc-400">{match.round}</p>
            {match.status !== "LIVE" && (match.date || match.time) ? (
              <p className="mt-1 text-sm text-zinc-500">{[match.date, match.time].filter(Boolean).join(" · ")}</p>
            ) : null}
            <Link href={match.href} className="mt-4 inline-flex rounded-2xl border border-zinc-700 px-4 py-3 text-sm font-black transition hover:border-orange-500 hover:text-orange-200">
              Follow match →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
