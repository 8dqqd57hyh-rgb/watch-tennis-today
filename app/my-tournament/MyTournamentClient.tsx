"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { startSmartMatchPolling } from "@/app/lib/smartMatchPolling";
import { fetchClientMatches } from "@/app/lib/clientMatchFetch";

const STORAGE_KEY = "watchTennisToday.followedTournaments";

type FollowedTournament = { slug: string; name: string; addedAt?: string };
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

type TournamentMatch = Match & { followedTournament: FollowedTournament };

const STARTER_TOURNAMENTS: FollowedTournament[] = [
  { slug: "french-open", name: "French Open" },
  { slug: "roland-garros", name: "Roland Garros" },
  { slug: "wimbledon", name: "Wimbledon" },
  { slug: "us-open", name: "US Open" },
  { slug: "australian-open", name: "Australian Open" },
  { slug: "atp-finals", name: "ATP Finals" },
];

const STATUS_WEIGHT: Record<string, number> = {
  LIVE: 0,
  SUSPENDED: 1,
  UPCOMING: 2,
  FINISHED: 3,
  RETIRED: 4,
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

function readFollowedTournaments(): FollowedTournament[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        const name = String(item?.name || "").trim();
        const slug = slugify(String(item?.slug || name));
        if (!name || !slug) return null;
        return { slug, name, addedAt: String(item?.addedAt || "") };
      })
      .filter(Boolean) as FollowedTournament[];
  } catch {
    return [];
  }
}

function saveFollowedTournaments(tournaments: FollowedTournament[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tournaments));
  window.dispatchEvent(new Event("watch-tennis-followed-tournaments-changed"));
}

function tournamentMatches(matchTournament: string, tournament: FollowedTournament) {
  const matchSlug = slugify(matchTournament);
  const followedSlug = slugify(tournament.slug || tournament.name);
  const followedNameSlug = slugify(tournament.name);

  if (!matchSlug || !followedSlug) return false;
  return (
    matchSlug.includes(followedSlug) ||
    followedSlug.includes(matchSlug) ||
    matchSlug.includes(followedNameSlug) ||
    followedNameSlug.includes(matchSlug)
  );
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

function getMatchSlug(match: Match) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = String(match.id || "").split(":").pop();
  return `${readablePart}-${numericId}`;
}

function Section({ title, subtitle, matches, emptyText }: { title: string; subtitle: string; matches: TournamentMatch[]; emptyText: string }) {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-2xl font-black text-zinc-950">{title}</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      {matches.length > 0 ? (
        <div className="grid gap-4">
          {matches.slice(0, 10).map((match) => (
            <article key={`${title}-${match.followedTournament.slug}-${match.id}`} className="rounded-2xl border border-zinc-200 p-5 hover:border-emerald-400 hover:bg-emerald-50/50">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="mb-1 text-sm font-black uppercase tracking-[0.14em] text-emerald-700">
                    {match.followedTournament.name}
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
                <Link href={`/tournament/${match.followedTournament.slug}`} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-black hover:border-emerald-400 hover:bg-white">Tournament page →</Link>
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
  const [followedTournaments, setFollowedTournaments] = useState<FollowedTournament[]>(() => readFollowedTournaments());
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function sync() {
      setFollowedTournaments(readFollowedTournaments());
    }

    window.addEventListener("watch-tennis-followed-tournaments-changed", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("watch-tennis-followed-tournaments-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ includeFinished: "1", daysBack: "7", daysForward: "14" });
        const safeMatches = await fetchClientMatches(`/api/matches?${params.toString()}`, {
          ttlMs: 60_000,
        });
        setMatches(safeMatches);
        return safeMatches;
      } catch (error) {
        console.error(error);
        setMatches([]);
        return [];
      } finally {
        setLoading(false);
      }
    }

    return startSmartMatchPolling({ load: loadMatches });
  }, []);

  function addTournament(tournament: FollowedTournament) {
    if (followedTournaments.some((item) => item.slug === tournament.slug)) return;
    const nextTournaments = [
      { ...tournament, addedAt: new Date().toISOString() },
      ...followedTournaments.filter((item) => item.slug !== tournament.slug),
    ].slice(0, 20);
    saveFollowedTournaments(nextTournaments);
    setFollowedTournaments(nextTournaments);
  }

  function removeTournament(slug: string) {
    const nextTournaments = followedTournaments.filter((tournament) => tournament.slug !== slug);
    saveFollowedTournaments(nextTournaments);
    setFollowedTournaments(nextTournaments);
  }

  const tournamentMatchesList = useMemo(() => {
    return followedTournaments
      .flatMap((tournament) =>
        matches
          .filter((match) => tournamentMatches(match.tournament, tournament))
          .map((match) => ({ ...match, followedTournament: tournament }))
      )
      .sort((left, right) => {
        const statusDiff = (STATUS_WEIGHT[left.status?.toUpperCase()] ?? 3) - (STATUS_WEIGHT[right.status?.toUpperCase()] ?? 3);
        if (statusDiff !== 0) return statusDiff;
        return getMatchTime(left) - getMatchTime(right);
      });
  }, [followedTournaments, matches]);

  const liveMatches = tournamentMatchesList.filter((match) => ["LIVE", "SUSPENDED"].includes(match.status?.toUpperCase()));
  const nextMatches = tournamentMatchesList.filter((match) => match.status?.toUpperCase() === "UPCOMING");
  const recentResults = tournamentMatchesList.filter((match) => ["FINISHED", "RETIRED"].includes(match.status?.toUpperCase()));

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Private tournament dashboard</p>
            <h2 className="text-3xl font-black text-zinc-950">Follow tournaments, not only players</h2>
            <p className="mt-2 max-w-2xl leading-7 text-zinc-600">
              Save a tournament once, then return here for its live matches, upcoming fixtures and recent results. This now uses the same tournament follow button shown across the site.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-emerald-200 bg-white p-4"><p className="text-3xl font-black text-red-600">{liveMatches.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Live</p></div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-4"><p className="text-3xl font-black text-zinc-950">{nextMatches.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Next</p></div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-4"><p className="text-3xl font-black text-zinc-950">{recentResults.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Results</p></div>
          </div>
        </div>

        {followedTournaments.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {followedTournaments.map((tournament) => (
              <span key={tournament.slug} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2">
                <Link href={`/tournament/${tournament.slug}`} className="font-bold text-zinc-900 hover:text-emerald-700">{tournament.name}</Link>
                <button type="button" onClick={() => removeTournament(tournament.slug)} className="font-black text-zinc-400 hover:text-red-600" aria-label={`Remove ${tournament.name}`}>×</button>
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STARTER_TOURNAMENTS.filter((tournament) => !followedTournaments.some((item) => item.slug === tournament.slug)).slice(0, 6).map((tournament) => (
            <button key={tournament.slug} type="button" onClick={() => addTournament(tournament)} className="rounded-2xl border border-zinc-200 bg-white p-4 text-left hover:border-emerald-400 hover:bg-emerald-50">
              <span className="block text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Add to My Tournament</span>
              <span className="mt-1 block text-lg font-black text-zinc-950">{tournament.name}</span>
            </button>
          ))}
        </div>
      </section>

      {loading ? <div className="rounded-3xl border border-zinc-200 bg-white p-6 font-bold text-zinc-600 shadow-sm">Loading your tournament board...</div> : null}

      <Section title="Live now" subtitle="Live or suspended matches from your saved tournaments." matches={liveMatches} emptyText="No saved tournament is live right now." />
      <Section title="Next matches" subtitle="Upcoming fixtures from your saved tournaments." matches={nextMatches} emptyText="No upcoming matches found for your saved tournaments yet." />
      <Section title="Recent results" subtitle="Latest completed matches from your saved tournaments." matches={recentResults} emptyText="No recent results found yet." />
    </div>
  );
}
