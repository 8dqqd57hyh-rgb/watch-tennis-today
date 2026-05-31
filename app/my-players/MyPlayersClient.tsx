"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { players } from "@/data/players";
import { getCanonicalPlayerSlug, normalizePlayerName } from "@/data/playerSlugs";

const STORAGE_KEY = "watchTennisToday.followedPlayers";

type FollowedPlayer = {
  slug: string;
  name: string;
  addedAt?: string;
};

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score?: string;
  startTime?: string;
};

const STATUS_PRIORITY: Record<string, number> = {
  LIVE: 0,
  SUSPENDED: 1,
  UPCOMING: 2,
  FINISHED: 3,
  RETIRED: 4,
};

function readFollowedPlayers(): FollowedPlayer[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];

    const followedPlayers: FollowedPlayer[] = [];

    parsed.forEach((player) => {
      const slug = getCanonicalPlayerSlug(String(player.slug || player.name || ""));
      if (!slug) return;

      followedPlayers.push({
        slug,
        name: players[slug].name,
        addedAt: String(player.addedAt || ""),
      });
    });

    return followedPlayers;
  } catch {
    return [];
  }
}

function saveFollowedPlayers(followedPlayers: FollowedPlayer[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(followedPlayers));
  window.dispatchEvent(new Event("watch-tennis-followed-players-changed"));
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMatchSlug(match: Match) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = String(match.id || "").split(":").pop();

  return `${readablePart}-${numericId}`;
}

function getNameParts(value: string) {
  const normalized = normalizePlayerName(value);
  const parts = normalized.split(" ").filter(Boolean);

  return {
    normalized,
    parts,
    first: parts[0] || "",
    last: parts[parts.length - 1] || "",
  };
}

function playerNameMatchesSide(playerName: string, sideName: string) {
  const target = getNameParts(playerName);
  const side = getNameParts(sideName);

  if (!target.normalized || !side.normalized) return false;
  if (target.normalized === side.normalized) return true;

  // API-Tennis often returns shortened names like "A. Rublev" or "A Rublev"
  // while our player directory stores "Andrey Rublev". Match by surname + initial
  // so My Players does not look empty when names are abbreviated.
  if (target.last && side.last && target.last === side.last) {
    if (!target.first || !side.first) return true;
    return target.first[0] === side.first[0];
  }

  return false;
}

function matchContainsPlayer(match: Match, playerSlug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(playerSlug);
  if (!canonicalSlug) return false;

  const targetName = players[canonicalSlug].name;

  return [match.player1, match.player2].some((side) =>
    playerNameMatchesSide(targetName, side)
  );
}

function getOpponent(match: Match, playerSlug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(playerSlug);
  if (!canonicalSlug) return "Opponent TBA";

  const targetName = players[canonicalSlug].name;

  if (playerNameMatchesSide(targetName, match.player1)) return match.player2;
  if (playerNameMatchesSide(targetName, match.player2)) return match.player1;

  return `${match.player1} / ${match.player2}`;
}

function getStatusPriority(status: string) {
  return STATUS_PRIORITY[status.toUpperCase()] ?? 3;
}

function getMatchTime(match: Match) {
  const timestamp = new Date(match.startTime || "").getTime();
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
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

export default function MyPlayersClient() {
  const [followedPlayers, setFollowedPlayers] = useState<FollowedPlayer[]>(() => readFollowedPlayers());
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function loadMatches() {
      if (followedPlayers.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const results = await Promise.all(
          followedPlayers.map(async (player) => {
            const params = new URLSearchParams({
              playerName: player.name,
              includeFinished: "1",
              daysBack: "14",
              daysForward: "60",
            });

            const response = await fetch(`/api/matches?${params.toString()}`, {
              cache: "no-store",
            });
            const data = await response.json();
            const nextMatches = Array.isArray(data) ? data : data.matches;

            return Array.isArray(nextMatches) ? nextMatches : [];
          })
        );

        const uniqueMatches = Array.from(
          new Map(results.flat().map((match) => [String(match.id), match])).values()
        ) as Match[];

        setMatches(uniqueMatches);
      } catch (error) {
        console.error(error);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
    const interval = window.setInterval(loadMatches, 60_000);

    return () => window.clearInterval(interval);
  }, [followedPlayers]);

  function removePlayer(playerSlug: string) {
    const nextPlayers = followedPlayers.filter((player) => player.slug !== playerSlug);
    saveFollowedPlayers(nextPlayers);
    setFollowedPlayers(nextPlayers);
  }

  function clearPlayers() {
    saveFollowedPlayers([]);
    setFollowedPlayers([]);
  }

  const followedMatches = useMemo(() => {
    const queryText = query.trim().toLowerCase();

    return followedPlayers
      .flatMap((player) =>
        matches
          .filter((match) => matchContainsPlayer(match, player.slug))
          .map((match) => ({
            ...match,
            followedPlayer: player,
            opponent: getOpponent(match, player.slug),
          }))
      )
      .filter((match) => {
        if (!queryText) return true;

        return [
          match.followedPlayer.name,
          match.opponent,
          match.tournament,
          match.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(queryText);
      })
      .sort((left, right) => {
        const statusDiff = getStatusPriority(left.status) - getStatusPriority(right.status);
        if (statusDiff !== 0) return statusDiff;

        return getMatchTime(left) - getMatchTime(right);
      });
  }, [followedPlayers, matches, query]);

  const liveCount = followedMatches.filter((match) => match.status === "LIVE").length;
  const upcomingCount = followedMatches.filter((match) => match.status === "UPCOMING").length;
  const resultCount = followedMatches.filter((match) => ["FINISHED", "RETIRED"].includes(match.status)).length;

  if (followedPlayers.length === 0) {
    return (
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-700">
          Empty dashboard
        </p>
        <h2 className="mb-3 text-3xl font-black text-zinc-950">
          Follow players to build your tennis feed
        </h2>
        <p className="mb-6 max-w-2xl leading-7 text-zinc-600">
          Open any player page and tap “Follow player”. Your choices are stored on this device,
          so visitors get a useful dashboard without creating an account.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/players" className="rounded-2xl bg-black px-5 py-3 font-black text-white hover:bg-zinc-800">
            Browse players →
          </Link>
          <Link href="/french-open-draw" className="rounded-2xl border border-zinc-200 px-5 py-3 font-black hover:border-green-400 hover:bg-green-50">
            Open draw tracker →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-700">
              Your tennis dashboard
            </p>
            <h2 className="text-3xl font-black text-zinc-950">
              {followedPlayers.length} followed player{followedPlayers.length === 1 ? "" : "s"}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-zinc-200 p-3">
              <p className="text-2xl font-black text-red-600">{liveCount}</p>
              <p className="text-xs font-bold uppercase text-zinc-500">Live</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-3">
              <p className="text-2xl font-black text-zinc-950">{upcomingCount}</p>
              <p className="text-xs font-bold uppercase text-zinc-500">Next</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-3">
              <p className="text-2xl font-black text-zinc-950">{resultCount}</p>
              <p className="text-xs font-bold uppercase text-zinc-500">Results</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {followedPlayers.map((player) => (
            <div key={player.slug} className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2">
              <Link href={`/player/${player.slug}`} className="font-bold text-zinc-900 hover:text-green-700">
                {player.name}
              </Link>
              <button
                type="button"
                onClick={() => removePlayer(player.slug)}
                className="text-sm font-black text-zinc-400 hover:text-red-600"
                aria-label={`Remove ${player.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search player, opponent, tournament..."
            className="rounded-2xl border border-zinc-300 px-4 py-3 outline-none focus:border-green-500"
          />
          <button
            type="button"
            onClick={clearPlayers}
            className="rounded-2xl border border-zinc-200 px-5 py-3 font-black text-zinc-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
          >
            Clear all
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-zinc-950">Followed players’ matches</h2>
            <p className="text-sm text-zinc-500">
Auto-refreshes every minute. Live and upcoming matches are shown first, with recent results underneath.
            </p>
          </div>
          <Link href="/watch-tennis-live-today" className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-black hover:border-green-400 hover:bg-green-50">
            All live tennis →
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 font-bold text-zinc-600">
            Loading your matches...
          </div>
        ) : followedMatches.length > 0 ? (
          <div className="grid gap-4">
            {followedMatches.slice(0, 30).map((match) => (
              <article key={`${match.followedPlayer.slug}-${match.id}`} className="rounded-2xl border border-zinc-200 p-5 hover:border-green-400 hover:bg-green-50/50">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-sm font-black uppercase tracking-[0.14em] text-green-700">
                      {match.followedPlayer.name} vs {match.opponent}
                    </p>
                    <h3 className="text-xl font-black text-zinc-950">
                      {match.player1} vs {match.player2}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600">
                      {match.tournament} · {match.category} · {formatTime(match.startTime)}
                    </p>
                  </div>

                  <span className={match.status === "LIVE" ? "rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white" : "rounded-full bg-zinc-900 px-3 py-1 text-xs font-black text-white"}>
                    {match.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href={`/watch/${getMatchSlug(match)}`} className="rounded-xl bg-black px-4 py-2 text-sm font-black text-white hover:bg-zinc-800">
                    Open match →
                  </Link>
                  <Link href={`/player/${match.followedPlayer.slug}`} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-black hover:border-green-400 hover:bg-white">
                    Player page →
                  </Link>
                  <Link href="/where-to-watch-french-open" className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-black hover:border-green-400 hover:bg-white">
                    Where to watch →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="font-bold text-zinc-800">
No matches or recent results found for your followed players right now.
            </p>
            <p className="mt-2 leading-7 text-zinc-600">
Keep this page bookmarked. When the tennis API lists one of your followed
              players again, their live match, next fixture or recent result will appear here automatically.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
