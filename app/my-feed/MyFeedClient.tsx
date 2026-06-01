"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { players } from "@/data/players";
import { getCanonicalPlayerSlug, normalizePlayerName } from "@/data/playerSlugs";

const PLAYERS_KEY = "watchTennisToday.followedPlayers";
const MATCHES_KEY = "watchTennisToday.followedMatches";
const TOURNAMENTS_KEY = "watchTennisToday.followedTournaments";

type FollowedPlayer = { slug: string; name: string; addedAt?: string };
type FollowedMatch = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category?: string;
  status?: string;
  score?: string;
  startTime?: string | null;
  slug: string;
  addedAt?: string;
};
type FollowedTournament = { slug: string; name: string; addedAt?: string };
type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category?: string;
  status?: string;
  score?: string;
  startTime?: string | null;
  round?: string;
  court?: string;
  winner?: string;
};
type FeedMatch = Match & { reason: string; slug: string; priority: number };

const STATUS_PRIORITY: Record<string, number> = {
  LIVE: 0,
  SUSPENDED: 1,
  UPCOMING: 2,
  SCHEDULED: 2,
  FINISHED: 3,
  COMPLETED: 3,
  RETIRED: 4,
};


const STAR_PLAYERS = [
  "Jannik Sinner",
  "Carlos Alcaraz",
  "Novak Djokovic",
  "Alexander Zverev",
  "Aryna Sabalenka",
  "Iga Swiatek",
  "Coco Gauff",
  "Naomi Osaka",
  "Elena Rybakina",
  "Mirra Andreeva",
  "Daniil Medvedev",
  "Ons Jabeur",
];

function starPower(name: string) {
  const parts = getNameParts(name);
  const index = STAR_PLAYERS.findIndex((player) => {
    const star = getNameParts(player);
    return star.normalized === parts.normalized || (star.last && star.last === parts.last);
  });

  return index >= 0 ? 100 - index * 4 : 0;
}

function matchStarPower(match: Match) {
  return Math.max(starPower(match.player1), starPower(match.player2));
}

function getStatusValue(match: Match | FollowedMatch) {
  return String(match.status || "").toUpperCase();
}

function isLiveStatus(match: Match | FollowedMatch) {
  return ["LIVE", "SUSPENDED"].includes(getStatusValue(match));
}

function isUpcomingStatus(match: Match | FollowedMatch) {
  return ["UPCOMING", "SCHEDULED"].includes(getStatusValue(match));
}

function isResultStatus(match: Match | FollowedMatch) {
  return ["FINISHED", "COMPLETED", "RETIRED"].includes(getStatusValue(match));
}

function formatShortMatch(match: Match) {
  return `${match.player1} vs ${match.player2}`;
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

function matchSlug(match: Match | FollowedMatch) {
  if ("slug" in match && match.slug) return match.slug;
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = String(match.id || "").split(":").pop();
  return `${readablePart}-${numericId}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "null");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function readFollowedPlayers(): FollowedPlayer[] {
  const parsed = readJson<unknown[]>(PLAYERS_KEY, []);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((player) => {
      const raw = player as Partial<FollowedPlayer>;
      const slug = getCanonicalPlayerSlug(String(raw.slug || raw.name || ""));
      if (!slug) return null;
      return { slug, name: players[slug].name, addedAt: raw.addedAt };
    })
    .filter(Boolean) as FollowedPlayer[];
}

function readFollowedMatches(): FollowedMatch[] {
  const parsed = readJson<unknown[]>(MATCHES_KEY, []);
  return Array.isArray(parsed) ? parsed.filter((match) => (match as FollowedMatch)?.id && (match as FollowedMatch)?.slug) as FollowedMatch[] : [];
}

function readFollowedTournaments(): FollowedTournament[] {
  const parsed = readJson<unknown[]>(TOURNAMENTS_KEY, []);
  return Array.isArray(parsed) ? parsed.filter((item) => (item as FollowedTournament)?.slug && (item as FollowedTournament)?.name) as FollowedTournament[] : [];
}

function normalize(value: string) {
  return normalizePlayerName(value || "");
}

function getNameParts(value: string) {
  const parts = normalize(value).split(" ").filter(Boolean);
  return { normalized: normalize(value), first: parts[0] || "", last: parts[parts.length - 1] || "" };
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

function matchContainsPlayer(match: Match, player: FollowedPlayer) {
  return [match.player1, match.player2].some((side) => playerNameMatchesSide(player.name, side));
}

function matchTournamentSlug(match: Match) {
  return slugify(match.tournament || "");
}

function tournamentMatches(match: Match, tournament: FollowedTournament) {
  const matchSlugValue = matchTournamentSlug(match);
  return matchSlugValue.includes(tournament.slug) || tournament.slug.includes(matchSlugValue);
}

function statusLabel(status?: string) {
  const normalized = String(status || "").toUpperCase();
  if (normalized === "LIVE") return "LIVE";
  if (normalized === "SUSPENDED") return "SUSPENDED";
  if (["UPCOMING", "SCHEDULED"].includes(normalized)) return "NEXT";
  if (["FINISHED", "COMPLETED", "RETIRED"].includes(normalized)) return "RESULT";
  return normalized || "MATCH";
}

function statusClass(status?: string) {
  const label = statusLabel(status);
  if (label === "LIVE") return "bg-red-600 text-white";
  if (label === "NEXT") return "bg-emerald-500 text-black";
  if (label === "SUSPENDED") return "bg-amber-400 text-black";
  return "bg-zinc-900 text-white";
}

function formatTime(value?: string | null) {
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

function getTime(match: Match) {
  const value = new Date(match.startTime || "").getTime();
  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
}

function getMatchAgeMs(match: Match | FollowedMatch) {
  const value = new Date(match.startTime || "").getTime();
  if (Number.isNaN(value)) return 0;
  return Date.now() - value;
}

function isStaleLiveMatch(match: Match | FollowedMatch) {
  const normalized = String(match.status || "").toUpperCase();
  if (normalized !== "LIVE") return false;

  // API-Tennis and saved localStorage rows can keep yesterday's matches marked
  // as LIVE. A stale LIVE card is worse than a missing one because it makes the
  // personal feed look fake. After a generous tennis window, demote it.
  const staleAfterMs = 8 * 60 * 60 * 1000;
  return getMatchAgeMs(match) > staleAfterMs;
}

function normalizeFeedStatus(match: Match | FollowedMatch) {
  const normalized = String(match.status || "").toUpperCase();
  if (isStaleLiveMatch(match)) {
    return match.score ? "FINISHED" : "EXPIRED";
  }
  return normalized || "MATCH";
}

function withSafeFeedStatus<T extends Match | FollowedMatch>(match: T): T {
  const safeStatus = normalizeFeedStatus(match);
  return safeStatus === String(match.status || "").toUpperCase() ? match : { ...match, status: safeStatus };
}

function removeFromStorage(key: string, predicate: (item: unknown) => boolean) {
  const parsed = readJson<unknown[]>(key, []);
  if (!Array.isArray(parsed)) return;
  window.localStorage.setItem(key, JSON.stringify(parsed.filter((item) => !predicate(item))));
}

function FeedMatchCard({ match }: { match: FeedMatch }) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50/50">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{match.reason}</p>
          <h3 className="mt-1 text-2xl font-black text-zinc-950">{match.player1} vs {match.player2}</h3>
          <p className="mt-1 text-sm font-semibold text-zinc-600">{match.tournament} · {match.category || "Tennis"}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(match.status)}`}>{statusLabel(match.status)}</span>
      </div>

      <div className="rounded-2xl bg-zinc-50 p-4 text-sm font-bold text-zinc-700">
        {match.score ? `Score: ${match.score}` : formatTime(match.startTime)}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/watch/${match.slug}`} className="rounded-xl bg-black px-4 py-2 text-sm font-black text-white hover:bg-zinc-800">Open match →</Link>
        <Link href={`/tournament/${slugify(match.tournament)}`} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-black hover:border-emerald-400">Tournament →</Link>
      </div>
    </article>
  );
}


type InsightCard = {
  eyebrow: string;
  title: string;
  detail: string;
  href: string;
  cta: string;
};

function InsightCardView({ item }: { item: InsightCard }) {
  return (
    <Link href={item.href} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50/60">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{item.eyebrow}</p>
      <h3 className="text-xl font-black text-zinc-950">{item.title}</h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">{item.detail}</p>
      <p className="mt-4 text-sm font-black text-emerald-700">{item.cta}</p>
    </Link>
  );
}

function MiniMatchRow({ match }: { match: Match }) {
  return (
    <Link href={`/watch/${matchSlug(match)}`} className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-emerald-400 hover:bg-emerald-50/60">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-zinc-500">{statusLabel(match.status)} · {match.tournament}</p>
        <p className="mt-1 font-black text-zinc-950">{formatShortMatch(match)}</p>
        <p className="mt-1 text-sm font-semibold text-zinc-600">{match.score || formatTime(match.startTime)}</p>
      </div>
      <span className="text-sm font-black text-emerald-700">Open →</span>
    </Link>
  );
}

export default function MyFeedClient() {
  const [followedPlayers, setFollowedPlayers] = useState<FollowedPlayer[]>([]);
  const [followedMatches, setFollowedMatches] = useState<FollowedMatch[]>([]);
  const [followedTournaments, setFollowedTournaments] = useState<FollowedTournament[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function syncSavedItems() {
      setFollowedPlayers(readFollowedPlayers());
      setFollowedMatches(readFollowedMatches());
      setFollowedTournaments(readFollowedTournaments());
    }

    syncSavedItems();
    window.addEventListener("watch-tennis-followed-players-changed", syncSavedItems);
    window.addEventListener("watch-tennis-followed-matches-changed", syncSavedItems);
    window.addEventListener("watch-tennis-followed-tournaments-changed", syncSavedItems);
    window.addEventListener("storage", syncSavedItems);

    return () => {
      window.removeEventListener("watch-tennis-followed-players-changed", syncSavedItems);
      window.removeEventListener("watch-tennis-followed-matches-changed", syncSavedItems);
      window.removeEventListener("watch-tennis-followed-tournaments-changed", syncSavedItems);
      window.removeEventListener("storage", syncSavedItems);
    };
  }, []);

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const response = await fetch("/api/matches?includeFinished=1&daysBack=7&daysForward=30", { cache: "no-store" });
        const data = await response.json();
        const nextMatches = Array.isArray(data) ? data : data.matches;
        setMatches(Array.isArray(nextMatches) ? nextMatches : []);
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
  }, []);

  const feedMatches = useMemo(() => {
    const savedMatchIds = new Set(followedMatches.map((match) => String(match.id)));
    const liveMap = new Map(matches.map((match) => [String(match.id), match]));
    const items = new Map<string, FeedMatch>();

    followedMatches.forEach((savedMatch) => {
      const liveVersion = liveMap.get(String(savedMatch.id));
      const match = withSafeFeedStatus(liveVersion || savedMatch);
      items.set(String(match.id), {
        ...match,
        slug: matchSlug(match),
        reason: "Saved match",
        priority: 0,
      });
    });

    matches.forEach((match) => {
      const player = followedPlayers.find((item) => matchContainsPlayer(match, item));
      const tournament = followedTournaments.find((item) => tournamentMatches(match, item));
      if (!player && !tournament && !savedMatchIds.has(String(match.id))) return;

      const reason = player ? `Saved player: ${player.name}` : tournament ? `Saved tournament: ${tournament.name}` : "Saved match";
      const priority = player ? 1 : tournament ? 2 : 3;
      const safeMatch = withSafeFeedStatus(match);
      if (safeMatch.status === "EXPIRED") return;
      items.set(String(safeMatch.id), { ...safeMatch, slug: matchSlug(safeMatch), reason, priority });
    });

    return Array.from(items.values()).sort((left, right) => {
      const statusDiff = (STATUS_PRIORITY[String(left.status || "").toUpperCase()] ?? 5) - (STATUS_PRIORITY[String(right.status || "").toUpperCase()] ?? 5);
      if (statusDiff !== 0) return statusDiff;
      if (left.priority !== right.priority) return left.priority - right.priority;
      return getTime(left) - getTime(right);
    });
  }, [followedMatches, followedPlayers, followedTournaments, matches]);

  const live = feedMatches.filter(isLiveStatus);
  const next = feedMatches.filter(isUpcomingStatus);
  const results = feedMatches.filter(isResultStatus);
  const empty = followedPlayers.length === 0 && followedMatches.length === 0 && followedTournaments.length === 0;

  const savedPlayerNames = useMemo(() => new Set(followedPlayers.map((player) => normalize(player.name))), [followedPlayers]);
  const feedMatchIds = useMemo(() => new Set(feedMatches.map((match) => String(match.id))), [feedMatches]);

  const followedPlayerStatus = useMemo(() => {
    return followedPlayers.map((player) => {
      const playerMatches = feedMatches.filter((match) => matchContainsPlayer(match, player));
      const liveMatch = playerMatches.find(isLiveStatus);
      const nextMatch = playerMatches.find(isUpcomingStatus);
      const resultMatch = playerMatches.find(isResultStatus);
      const bestMatch = liveMatch || nextMatch || resultMatch;

      return {
        player,
        match: bestMatch,
        label: liveMatch ? "Live now" : nextMatch ? "Next up" : resultMatch ? "Result in" : "Quiet today",
      };
    });
  }, [feedMatches, followedPlayers]);

  const discoveryMatches = useMemo(() => {
    return matches
      .map(withSafeFeedStatus)
      .filter((match) => match.status !== "EXPIRED")
      .filter((match) => !feedMatchIds.has(String(match.id)))
      .filter((match) => matchStarPower(match) > 0)
      .sort((left, right) => {
        const statusDiff = (STATUS_PRIORITY[getStatusValue(left)] ?? 5) - (STATUS_PRIORITY[getStatusValue(right)] ?? 5);
        if (statusDiff !== 0) return statusDiff;
        const starDiff = matchStarPower(right) - matchStarPower(left);
        if (starDiff !== 0) return starDiff;
        return getTime(left) - getTime(right);
      })
      .slice(0, 4);
  }, [feedMatchIds, matches]);

  const insightCards = useMemo<InsightCard[]>(() => {
    const cards: InsightCard[] = [];
    const followedPlayerLive = live.find((match) => [match.player1, match.player2].some((name) => savedPlayerNames.has(normalize(name))));
    const followedPlayerNext = next.find((match) => [match.player1, match.player2].some((name) => savedPlayerNames.has(normalize(name))));
    const followedPlayerResult = results.find((match) => [match.player1, match.player2].some((name) => savedPlayerNames.has(normalize(name))));
    const bigName = discoveryMatches[0];

    if (followedPlayerLive) {
      cards.push({
        eyebrow: "Your player live",
        title: formatShortMatch(followedPlayerLive),
        detail: followedPlayerLive.score ? `Current score: ${followedPlayerLive.score}` : "Open now before the match ends.",
        href: `/watch/${followedPlayerLive.slug}`,
        cta: "Watch match →",
      });
    }

    if (followedPlayerNext) {
      cards.push({
        eyebrow: "Your next match",
        title: formatShortMatch(followedPlayerNext),
        detail: `${followedPlayerNext.tournament} · ${formatTime(followedPlayerNext.startTime)}`,
        href: `/watch/${followedPlayerNext.slug}`,
        cta: "Set up before start →",
      });
    }

    if (followedPlayerResult) {
      cards.push({
        eyebrow: "Result to check",
        title: formatShortMatch(followedPlayerResult),
        detail: followedPlayerResult.score ? `Final score: ${followedPlayerResult.score}` : `${followedPlayerResult.tournament} finished recently.`,
        href: `/watch/${followedPlayerResult.slug}`,
        cta: "Open result →",
      });
    }

    if (bigName) {
      cards.push({
        eyebrow: "Big name outside your feed",
        title: formatShortMatch(bigName),
        detail: `${bigName.tournament} · ${bigName.score || formatTime(bigName.startTime)}`,
        href: `/watch/${matchSlug(bigName)}`,
        cta: "Discover match →",
      });
    }

    return cards.slice(0, 3);
  }, [discoveryMatches, live, next, results, savedPlayerNames]);

  function clearMatch(id: string) {
    removeFromStorage(MATCHES_KEY, (item) => String((item as Partial<FollowedMatch>)?.id) === String(id));
    window.dispatchEvent(new Event("watch-tennis-followed-matches-changed"));
  }

  function clearTournament(slug: string) {
    removeFromStorage(TOURNAMENTS_KEY, (item) => (item as Partial<FollowedTournament>)?.slug === slug);
    window.dispatchEvent(new Event("watch-tennis-followed-tournaments-changed"));
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"><p className="text-4xl font-black text-zinc-950">{followedPlayers.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Players</p></div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"><p className="text-4xl font-black text-zinc-950">{followedMatches.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Saved matches</p></div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"><p className="text-4xl font-black text-zinc-950">{followedTournaments.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Tournaments</p></div>
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm"><p className="text-4xl font-black text-emerald-700">{live.length + next.length}</p><p className="text-xs font-bold uppercase text-zinc-500">Need attention</p></div>
      </section>

      {empty ? (
        <section className="rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-3xl font-black">Start building your feed</h2>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-zinc-600">
            Follow a player, match or tournament and this page becomes a personal tennis homepage. This is designed to bring fans back daily instead of using the site once.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/players" className="rounded-2xl bg-black px-5 py-3 font-black text-white hover:bg-zinc-800">Find players →</Link>
            <Link href="/live-tennis" className="rounded-2xl border border-zinc-200 px-5 py-3 font-black hover:border-emerald-400">Find matches →</Link>
          </div>
        </section>
      ) : null}

      {loading ? <div className="rounded-3xl border border-zinc-200 bg-white p-6 font-bold text-zinc-600 shadow-sm">Loading your feed...</div> : null}

      {insightCards.length > 0 ? (
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Personal feed briefing</p>
              <h2 className="text-2xl font-black text-zinc-950">What deserves attention right now</h2>
              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-zinc-600">
                This replaces the generic tournament pulse: it prioritizes your saved players and only adds a big outside match when your feed is quiet.
              </p>
            </div>
            <Link href="/tennis-watchlist-today" className="rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-black hover:border-emerald-500">Watchlist tools →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {insightCards.map((item) => <InsightCardView key={`${item.eyebrow}-${item.title}`} item={item} />)}
          </div>
        </section>
      ) : null}

      {followedPlayerStatus.length > 0 ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Your players</p>
              <h2 className="text-2xl font-black text-zinc-950">Player status board</h2>
            </div>
            <Link href="/players" className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-black hover:border-emerald-400">Add more players →</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {followedPlayerStatus.map(({ player, match, label }) => (
              <div key={player.slug} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{label}</p>
                    <Link href={`/player/${player.slug}`} className="mt-1 block text-lg font-black text-zinc-950 hover:text-emerald-700">{player.name}</Link>
                  </div>
                  {match ? <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClass(match.status)}`}>{statusLabel(match.status)}</span> : null}
                </div>
                {match ? (
                  <Link href={`/watch/${match.slug}`} className="mt-3 block text-sm font-bold leading-6 text-zinc-600 hover:text-emerald-700">
                    {formatShortMatch(match)} · {match.score || formatTime(match.startTime)} →
                  </Link>
                ) : (
                  <p className="mt-3 text-sm font-semibold leading-6 text-zinc-600">No live, upcoming or recent result found in the current feed window.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {discoveryMatches.length > 0 ? (
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Outside your feed</p>
              <h2 className="text-2xl font-black text-zinc-950">Big names playing today</h2>
              <p className="mt-2 text-sm font-semibold text-zinc-600">A small discovery lane keeps the page useful even when saved players are not active.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {discoveryMatches.map((match) => <MiniMatchRow key={`discover-${match.id}`} match={match} />)}
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.14em] text-emerald-700">Open first</p>
            <h2 className="text-2xl font-black text-zinc-950">Your highest-priority tennis updates</h2>
          </div>
          <Link href="/my-dashboard" className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-black hover:border-emerald-400">Player dashboard →</Link>
        </div>
        {feedMatches.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {[...live, ...next, ...results].slice(0, 8).map((match) => <FeedMatchCard key={`priority-${match.id}`} match={match} />)}
          </div>
        ) : (
          <p className="rounded-2xl bg-zinc-50 p-5 font-bold text-zinc-600">No active updates found for your saved items yet.</p>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Live now</h2>
          <div className="mt-4 grid gap-3">{live.slice(0, 4).map((match) => <FeedMatchCard key={`live-${match.id}`} match={match} />)}{live.length === 0 ? <p className="rounded-2xl bg-zinc-50 p-4 text-sm font-bold text-zinc-600">Nothing live for your feed right now.</p> : null}</div>
        </section>
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Next matches</h2>
          <div className="mt-4 grid gap-3">{next.slice(0, 4).map((match) => <FeedMatchCard key={`next-${match.id}`} match={match} />)}{next.length === 0 ? <p className="rounded-2xl bg-zinc-50 p-4 text-sm font-bold text-zinc-600">No upcoming saved match found yet.</p> : null}</div>
        </section>
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Recent results</h2>
          <div className="mt-4 grid gap-3">{results.slice(0, 4).map((match) => <FeedMatchCard key={`result-${match.id}`} match={match} />)}{results.length === 0 ? <p className="rounded-2xl bg-zinc-50 p-4 text-sm font-bold text-zinc-600">No recent saved results yet.</p> : null}</div>
        </section>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Saved tournaments</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {followedTournaments.map((item) => (
              <span key={item.slug} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2">
                <Link href={`/tournament/${item.slug}`} className="font-bold hover:text-emerald-700">{item.name}</Link>
                <button type="button" onClick={() => clearTournament(item.slug)} className="font-black text-zinc-400 hover:text-red-600" aria-label={`Remove ${item.name}`}>×</button>
              </span>
            ))}
            {followedTournaments.length === 0 ? <p className="text-sm font-bold text-zinc-600">Follow tournaments from tournament pages.</p> : null}
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Saved matches</h2>
          <div className="mt-4 grid gap-2">
            {followedMatches.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                <Link href={`/watch/${item.slug}`} className="font-bold hover:text-emerald-700">{item.player1} vs {item.player2}</Link>
                <button type="button" onClick={() => clearMatch(item.id)} className="font-black text-zinc-400 hover:text-red-600" aria-label={`Remove ${item.player1} vs ${item.player2}`}>×</button>
              </div>
            ))}
            {followedMatches.length === 0 ? <p className="text-sm font-bold text-zinc-600">Follow matches from match pages.</p> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
