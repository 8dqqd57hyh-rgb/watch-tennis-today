"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { players } from "@/data/players";
import { getCanonicalPlayerSlug, normalizePlayerName } from "@/data/playerSlugs";

const STORAGE_KEY = "watchTennisToday.followedPlayers";

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

const STARTER_PLAYERS = [
  "jannik-sinner",
  "carlos-alcaraz",
  "aryna-sabalenka",
  "coco-gauff",
  "iga-swiatek",
  "novak-djokovic",
] as const;

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
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Section({ title, subtitle, matches, emptyText }: { title: string; subtitle: string; matches: PersonalMatch[]; emptyText: string }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-zinc-950">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      {matches.length > 0 ? (
        <div className="grid gap-4">
          {matches.slice(0, 8).map((match) => (
            <article key={`${title}-${match.followedPlayer.slug}-${match.id}`} className="rounded-2xl border border-zinc-200 p-5 hover:border-emerald-400 hover:bg-emerald-50/50">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="mb-1 text-sm font-black uppercase tracking-[0.14em] text-emerald-700">
                    {match.followedPlayer.name} vs {match.opponent}
                  </p>
                  <h3 className="text-xl font-black text-zinc-950">{match.player1} vs {match.player2}</h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    {match.tournament} · {match.category || "Tennis"} · {formatTime(match.startTime)}
                  </p>
                  {match.score ? <p className="mt-2 font-black text-zinc-900">Score: {match.score}</p> : null}
                </div>
                <span className={match.status === "LIVE" ? "rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white" : "rounded-full bg-zinc-900 px-3 py-1 text-xs font-black text-white"}>
                  {match.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link href={`/watch/${getMatchSlug(match)}`} className="rounded-xl bg-black px-4 py-2 text-sm font-black text-white hover:bg-zinc-800">Open match →</Link>
                <Link href={`/player/${match.followedPlayer.slug}`} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-black hover:border-emerald-400 hover:bg-white">Player page →</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 font-bold text-zinc-600">{emptyText}</div>
      )}
    </section>
  );
}

export default function MyTournamentClient() {
  const [followedPlayers, setFollowedPlayers] = useState<FollowedPlayer[]>(() => readFollowedPlayers());
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

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
              daysBack: "3",
              daysForward: "21",
            });
            const response = await fetch(`/api/matches?${params.toString()}`, { cache: "no-store" });
            const data = await response.json();
            const nextMatches = Array.isArray(data) ? data : data.matches;
            return Array.isArray(nextMatches) ? nextMatches : [];
          })
        );

        setMatches(Array.from(new Map(results.flat().map((match) => [String(match.id), match])).values()) as Match[]);
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

  function addPlayer(playerSlug: string) {
    const slug = getCanonicalPlayerSlug(playerSlug);
    if (!slug || followedPlayers.some((player) => player.slug === slug)) return;
    const nextPlayers = [...followedPlayers, { slug, name: players[slug].name, addedAt: new Date().toISOString() }].slice(-30);
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

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Private tournament dashboard</p>
            <h2 className="text-3xl font-black text-zinc-950">Your tournament in one screen</h2>
            <p className="mt-2 max-w-2xl leading-7 text-zinc-600">
              Pick players once, then come back here for their live matches, next fixtures and latest results. It uses the same saved players as My Players.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-emerald-200 bg-white p-4"><p className="text-3xl font-black text-red-600">{liveMatches.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Live</p></div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-4"><p className="text-3xl font-black text-zinc-950">{nextMatches.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Next</p></div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-4"><p className="text-3xl font-black text-zinc-950">{recentResults.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Results</p></div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {followedPlayers.map((player) => (
            <span key={player.slug} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2">
              <Link href={`/player/${player.slug}`} className="font-bold text-zinc-900 hover:text-emerald-700">{player.name}</Link>
              <button type="button" onClick={() => removePlayer(player.slug)} className="font-black text-zinc-400 hover:text-red-600" aria-label={`Remove ${player.name}`}>×</button>
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STARTER_PLAYERS.filter((slug) => !followedPlayers.some((player) => player.slug === slug)).slice(0, 6).map((slug) => (
            <button key={slug} type="button" onClick={() => addPlayer(slug)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-left hover:border-emerald-400 hover:bg-emerald-50">
              <span className="block text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Add to My Tournament</span>
              <span className="mt-1 block text-lg font-black text-zinc-950">{players[slug].name}</span>
            </button>
          ))}
        </div>
      </section>

      {loading ? <div className="rounded-3xl border border-zinc-200 bg-white p-6 font-bold text-zinc-600 shadow-sm">Loading your tournament board...</div> : null}

      <Section title="Live now" subtitle="Matches involving your saved players that are live or suspended." matches={liveMatches} emptyText="No saved player is live right now." />
      <Section title="Next matches" subtitle="Upcoming fixtures for your saved players." matches={nextMatches} emptyText="No upcoming matches found for your saved players yet." />
      <Section title="Recent results" subtitle="Latest completed matches for your saved players." matches={recentResults} emptyText="No recent results found yet." />
    </div>
  );
}
