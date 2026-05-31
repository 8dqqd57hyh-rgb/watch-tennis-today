"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "watchTennisToday.followedPlayers";

type FollowedPlayer = { slug?: string; name?: string; addedAt?: string };
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

type WatchlistMatch = Match & {
  watchScore: number;
  reason: string;
  followedName?: string;
};

const STAR_PLAYERS = [
  "sinner",
  "alcaraz",
  "djokovic",
  "swiatek",
  "sabalenka",
  "gauff",
  "rybakina",
  "medvedev",
  "zverev",
  "osaka",
  "andreeva",
  "paolini",
];

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

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function lastName(value?: string) {
  const parts = normalize(String(value || "")).split(" ").filter(Boolean);
  return parts[parts.length - 1] || "";
}

function readFollowedPlayers(): FollowedPlayer[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatTime(value?: string) {
  if (!value) return "Time TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time TBA";

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function scoreMatch(match: Match, followedPlayers: FollowedPlayer[]): WatchlistMatch {
  const status = String(match.status || "").toUpperCase();
  const text = normalize(`${match.player1} ${match.player2}`);
  const tournament = normalize(match.tournament || "");
  const round = normalize(match.round || "");
  const category = String(match.category || "").toUpperCase();
  const followed = followedPlayers.find((player) => {
    const playerLastName = lastName(player.name || player.slug);
    return Boolean(playerLastName && text.includes(playerLastName));
  });

  let watchScore = 35;
  const reasons: string[] = [];

  if (followed) {
    watchScore += 35;
    reasons.push(`saved player: ${followed.name || followed.slug}`);
  }

  if (status === "LIVE") {
    watchScore += 30;
    reasons.push("live now");
  } else if (["UPCOMING", "SCHEDULED"].includes(status)) {
    watchScore += 14;
    reasons.push("coming up");
  }

  if (category === "ATP" || category === "WTA") {
    watchScore += 8;
    reasons.push(category);
  }

  if (["french open", "roland garros", "wimbledon", "us open", "australian open"].some((name) => tournament.includes(name))) {
    watchScore += 16;
    reasons.push("Grand Slam");
  }

  if (round.includes("final") || round.includes("semi") || round.includes("quarter")) {
    watchScore += 12;
    reasons.push(match.round || "late round");
  }

  if (STAR_PLAYERS.some((player) => text.includes(player))) {
    watchScore += 12;
    reasons.push("star player");
  }

  return {
    ...match,
    watchScore: Math.min(99, watchScore),
    reason: reasons.slice(0, 3).join(" · ") || "good schedule pick",
    followedName: followed?.name || followed?.slug,
  };
}

export default function TennisWatchlistHub({ matches }: { matches: Match[] }) {
  const [followedPlayers, setFollowedPlayers] = useState<FollowedPlayer[]>([]);

  useEffect(() => {
    function syncPlayers() {
      setFollowedPlayers(readFollowedPlayers());
    }

    syncPlayers();
    window.addEventListener("watch-tennis-followed-players-changed", syncPlayers);
    window.addEventListener("storage", syncPlayers);

    return () => {
      window.removeEventListener("watch-tennis-followed-players-changed", syncPlayers);
      window.removeEventListener("storage", syncPlayers);
    };
  }, []);

  const watchlistMatches = useMemo(() => {
    return matches
      .map((match) => scoreMatch(match, followedPlayers))
      .filter((match) => match.status !== "CANCELLED" && match.status !== "EXPIRED")
      .sort((left, right) => {
        const scoreDiff = right.watchScore - left.watchScore;
        if (scoreDiff !== 0) return scoreDiff;
        return new Date(left.startTime || 0).getTime() - new Date(right.startTime || 0).getTime();
      })
      .slice(0, 5);
  }, [matches, followedPlayers]);

  if (matches.length === 0) return null;

  const hasSavedPlayers = followedPlayers.length > 0;

  return (
    <section className="mb-12 rounded-[2.5rem] border border-emerald-400/50 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-black p-8 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-black">
          ⭐ Tennis Watchlist
        </span>
        <span className="text-sm text-zinc-400">
          Smart picks from live matches, saved players and big tournaments
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <h2 className="mb-3 text-4xl font-black text-white">
            What should I watch today?
          </h2>
          <p className="mb-6 max-w-3xl leading-7 text-zinc-300">
            A quick ranked list for fans who do not want to scan every match. Save players once, then this block becomes more personal every time you return.
          </p>

          <div className="grid gap-4">
            {watchlistMatches.map((match) => (
              <Link
                key={`${match.id}-${match.watchScore}`}
                href={`/watch/${matchSlug(match)}`}
                className="group rounded-3xl border border-zinc-800 bg-black/40 p-5 hover:border-emerald-400 hover:bg-emerald-950/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-300">
                        Watch score {match.watchScore}
                      </span>
                      <span className={String(match.status).toUpperCase() === "LIVE" ? "rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white" : "rounded-full bg-zinc-800 px-3 py-1 text-xs font-black text-zinc-200"}>
                        {match.status || "Scheduled"}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-white group-hover:text-emerald-200">
                      {match.player1} vs {match.player2}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {match.tournament} · {match.category || "Tennis"} · {formatTime(match.startTime)}
                    </p>
                    <p className="mt-2 text-sm font-bold text-emerald-200">
                      Why: {match.reason}
                    </p>
                  </div>

                  <span className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-black">
                    Open →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-zinc-800 bg-black/50 p-5">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-emerald-300">
            Personalize it
          </p>
          <h3 className="mb-3 text-2xl font-black text-white">
            {hasSavedPlayers ? `${followedPlayers.length} saved player${followedPlayers.length === 1 ? "" : "s"}` : "No saved players yet"}
          </h3>
          <p className="mb-5 text-sm leading-6 text-zinc-400">
            Saved players boost this list, My Tournament and My Players on this device.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/my-tournament" className="rounded-2xl bg-emerald-400 px-5 py-3 text-center font-black text-black hover:bg-emerald-300">
              Open My Tournament →
            </Link>
            <Link href="/players" className="rounded-2xl border border-zinc-700 px-5 py-3 text-center font-black text-zinc-200 hover:border-emerald-400 hover:text-white">
              Choose players →
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
