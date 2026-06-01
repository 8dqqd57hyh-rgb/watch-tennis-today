"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { players } from "@/data/players";
import { getCanonicalPlayerSlug, normalizePlayerName } from "@/data/playerSlugs";
import { startSmartMatchPolling } from "@/app/lib/smartMatchPolling";
import { fetchClientMatches } from "@/app/lib/clientMatchFetch";

const STORAGE_KEY = "watchTennisToday.followedPlayers";

const STARTER_PLAYERS = [
  "jannik-sinner",
  "carlos-alcaraz",
  "aryna-sabalenka",
  "coco-gauff",
  "iga-swiatek",
  "novak-djokovic",
  "alexander-zverev",
  "daniil-medvedev",
] as const;

type FollowedPlayer = { slug: string; name: string; addedAt?: string };
type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category?: string;
  status: string;
  score?: string;
  startTime?: string;
};
type PersonalMatch = Match & { followedPlayer: FollowedPlayer; opponent: string };

const STATUS_WEIGHT: Record<string, number> = {
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

    return parsed
      .map((player) => {
        const slug = getCanonicalPlayerSlug(String(player.slug || player.name || ""));
        if (!slug) return null;
        return { slug, name: players[slug].name, addedAt: String(player.addedAt || "") };
      })
      .filter(Boolean) as FollowedPlayer[];
  } catch {
    return [];
  }
}

function saveFollowedPlayers(nextPlayers: FollowedPlayer[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPlayers));
  window.dispatchEvent(new Event("watch-tennis-followed-players-changed"));
}

function getNameParts(value: string) {
  const normalized = normalizePlayerName(value);
  const parts = normalized.split(" ").filter(Boolean);
  return { normalized, first: parts[0] || "", last: parts[parts.length - 1] || "" };
}

function playerNameMatchesSide(playerName: string, sideName: string) {
  const target = getNameParts(playerName);
  const side = getNameParts(sideName);

  if (!target.normalized || !side.normalized) return false;
  if (target.normalized === side.normalized) return true;

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
  return [match.player1, match.player2].some((side) => playerNameMatchesSide(targetName, side));
}

function getOpponent(match: Match, playerSlug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(playerSlug);
  if (!canonicalSlug) return "Opponent TBA";
  const targetName = players[canonicalSlug].name;
  if (playerNameMatchesSide(targetName, match.player1)) return match.player2;
  if (playerNameMatchesSide(targetName, match.player2)) return match.player1;
  return `${match.player1} / ${match.player2}`;
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

function getMatchTime(match: Match) {
  const timestamp = new Date(match.startTime || "").getTime();
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}

function formatTime(value?: string) {
  if (!value) return "Time TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time TBA";

  return date.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadgeClass(status: string) {
  const normalized = status.toUpperCase();
  if (normalized === "LIVE") return "bg-red-600 text-white";
  if (normalized === "UPCOMING") return "bg-emerald-600 text-white";
  if (normalized === "SUSPENDED") return "bg-amber-500 text-black";
  return "bg-zinc-900 text-white";
}

function MiniMatchCard({ match }: { match: PersonalMatch }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
            {match.followedPlayer.name} vs {match.opponent}
          </p>
          <h3 className="mt-1 text-lg font-black text-zinc-950">{match.player1} vs {match.player2}</h3>
          <p className="mt-1 text-sm font-semibold text-zinc-600">
            {match.tournament} · {match.category || "Tennis"}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${statusBadgeClass(match.status)}`}>{match.status}</span>
      </div>

      <div className="mt-3 rounded-xl bg-zinc-50 p-3 text-sm font-bold text-zinc-700">
        {match.score ? <span>Score: {match.score}</span> : <span>{formatTime(match.startTime)}</span>}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/watch/${getMatchSlug(match)}`} className="rounded-xl bg-black px-4 py-2 text-sm font-black text-white hover:bg-zinc-800">
          Match page →
        </Link>
        <Link href={`/player/${match.followedPlayer.slug}`} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-black hover:border-emerald-400">
          Player →
        </Link>
      </div>
    </article>
  );
}

export default function MyDashboardClient() {
  const [followedPlayers, setFollowedPlayers] = useState<FollowedPlayer[]>(() => readFollowedPlayers());
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadMatches() {
      if (followedPlayers.length === 0) {
        setMatches([]);
        setLoading(false);
        return [];
      }

      setLoading(true);
      try {
        const results = await Promise.all(
          followedPlayers.map(async (player) => {
            const params = new URLSearchParams({
              playerName: player.name,
              includeFinished: "1",
              daysBack: "7",
              daysForward: "30",
            });
            return fetchClientMatches(`/api/matches?${params.toString()}`, {
              ttlMs: 60_000,
            });
          })
        );

        const uniqueMatches = Array.from(new Map(results.flat().map((match) => [String(match.id), match])).values()) as Match[];
        setMatches(uniqueMatches);
        return uniqueMatches;
      } catch (error) {
        console.error(error);
        setMatches([]);
        return [];
      } finally {
        setLoading(false);
      }
    }

    return startSmartMatchPolling({ load: loadMatches });
  }, [followedPlayers]);

  function addPlayer(playerSlug: string) {
    const slug = getCanonicalPlayerSlug(playerSlug);
    if (!slug || followedPlayers.some((player) => player.slug === slug)) return;
    const nextPlayers = [...followedPlayers, { slug, name: players[slug].name, addedAt: new Date().toISOString() }].slice(-40);
    saveFollowedPlayers(nextPlayers);
    setFollowedPlayers(nextPlayers);
  }

  function removePlayer(playerSlug: string) {
    const nextPlayers = followedPlayers.filter((player) => player.slug !== playerSlug);
    saveFollowedPlayers(nextPlayers);
    setFollowedPlayers(nextPlayers);
  }

  const personalMatches = useMemo(() => {
    return followedPlayers
      .flatMap((player) =>
        matches
          .filter((match) => matchContainsPlayer(match, player.slug))
          .map((match) => ({ ...match, followedPlayer: player, opponent: getOpponent(match, player.slug) }))
      )
      .sort((left, right) => {
        const statusDiff = (STATUS_WEIGHT[left.status?.toUpperCase()] ?? 3) - (STATUS_WEIGHT[right.status?.toUpperCase()] ?? 3);
        if (statusDiff !== 0) return statusDiff;
        return getMatchTime(left) - getMatchTime(right);
      });
  }, [followedPlayers, matches]);

  const liveMatches = personalMatches.filter((match) => ["LIVE", "SUSPENDED"].includes(match.status?.toUpperCase()));
  const nextMatches = personalMatches.filter((match) => match.status?.toUpperCase() === "UPCOMING");
  const recentResults = personalMatches.filter((match) => ["FINISHED", "RETIRED"].includes(match.status?.toUpperCase()));
  const attentionMatches = [...liveMatches, ...nextMatches.slice(0, 3), ...recentResults.slice(0, 2)].slice(0, 6);

  const playerOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return Object.entries(players)
      .filter(([slug, player]) => !followedPlayers.some((followedPlayer) => followedPlayer.slug === slug) && (!normalizedSearch || player.name.toLowerCase().includes(normalizedSearch)))
      .slice(0, normalizedSearch ? 8 : 0);
  }, [followedPlayers, search]);

  const emptyDashboard = followedPlayers.length === 0;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Private fan dashboard</p>
            <h2 className="text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">Your tennis day, personalized</h2>
            <p className="mt-3 max-w-3xl leading-7 text-zinc-600">
              Save ATP and WTA players once. This page becomes a daily command center with live alerts, upcoming matches, recent results and fast links to player pages.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-red-200 bg-white p-4"><p className="text-3xl font-black text-red-600">{liveMatches.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Live</p></div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-4"><p className="text-3xl font-black text-zinc-950">{nextMatches.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Next</p></div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4"><p className="text-3xl font-black text-zinc-950">{recentResults.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Results</p></div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.14em] text-zinc-500">Saved players</p>
            {followedPlayers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {followedPlayers.map((player) => (
                  <span key={player.slug} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2">
                    <Link href={`/player/${player.slug}`} className="font-bold text-zinc-900 hover:text-emerald-700">{player.name}</Link>
                    <button type="button" onClick={() => removePlayer(player.slug)} className="font-black text-zinc-400 hover:text-red-600" aria-label={`Remove ${player.name}`}>×</button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-zinc-600">Add a few players to unlock your personal board.</p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <label htmlFor="dashboard-player-search" className="mb-3 block text-sm font-black uppercase tracking-[0.14em] text-zinc-500">Quick add player</label>
            <input
              id="dashboard-player-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Sinner, Sabalenka, Gauff..."
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-semibold outline-none focus:border-emerald-500"
            />
            {playerOptions.length > 0 ? (
              <div className="mt-3 grid gap-2">
                {playerOptions.map(([slug, player]) => (
                  <button key={slug} type="button" onClick={() => { addPlayer(slug); setSearch(""); }} className="rounded-xl border border-zinc-200 px-4 py-2 text-left text-sm font-black hover:border-emerald-400 hover:bg-emerald-50">
                    + {player.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {emptyDashboard ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STARTER_PLAYERS.map((slug) => (
              <button key={slug} type="button" onClick={() => addPlayer(slug)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-left transition hover:border-emerald-400 hover:bg-emerald-50">
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Add starter</span>
                <span className="mt-1 block text-lg font-black text-zinc-950">{players[slug].name}</span>
              </button>
            ))}
          </div>
        ) : null}
      </section>

      {loading ? <div className="rounded-3xl border border-zinc-200 bg-white p-6 font-bold text-zinc-600 shadow-sm">Loading your tennis dashboard...</div> : null}

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Check first</p>
            <h2 className="text-2xl font-black text-zinc-950">Needs your attention</h2>
          </div>
          <Link href="/my-tournament" className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-black hover:border-emerald-400">Classic tournament view →</Link>
        </div>

        {attentionMatches.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {attentionMatches.map((match) => <MiniMatchCard key={`${match.followedPlayer.slug}-${match.id}-attention`} match={match} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 font-bold text-zinc-600">
            {emptyDashboard ? "Add players above and this area will show the matches that matter first." : "No urgent live or upcoming matches found for your saved players right now."}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-zinc-950">Live now</h2>
          <p className="mt-1 text-sm text-zinc-500">Saved players currently playing.</p>
          <div className="mt-4 grid gap-3">
            {liveMatches.slice(0, 4).map((match) => <MiniMatchCard key={`${match.followedPlayer.slug}-${match.id}-live`} match={match} />)}
            {liveMatches.length === 0 ? <p className="rounded-2xl bg-zinc-50 p-4 text-sm font-bold text-zinc-600">No saved player is live right now.</p> : null}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-zinc-950">Next matches</h2>
          <p className="mt-1 text-sm text-zinc-500">Upcoming fixtures to plan around.</p>
          <div className="mt-4 grid gap-3">
            {nextMatches.slice(0, 4).map((match) => <MiniMatchCard key={`${match.followedPlayer.slug}-${match.id}-next`} match={match} />)}
            {nextMatches.length === 0 ? <p className="rounded-2xl bg-zinc-50 p-4 text-sm font-bold text-zinc-600">No upcoming matches found yet.</p> : null}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-zinc-950">Recent results</h2>
          <p className="mt-1 text-sm text-zinc-500">What happened while you were away.</p>
          <div className="mt-4 grid gap-3">
            {recentResults.slice(0, 4).map((match) => <MiniMatchCard key={`${match.followedPlayer.slug}-${match.id}-result`} match={match} />)}
            {recentResults.length === 0 ? <p className="rounded-2xl bg-zinc-50 p-4 text-sm font-bold text-zinc-600">No recent results found yet.</p> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
