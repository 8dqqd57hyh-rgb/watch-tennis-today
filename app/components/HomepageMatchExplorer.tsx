"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { withTracking } from "@/app/lib/tracking";
import { fetchClientMatches } from "@/app/lib/clientMatchFetch";
import { getGrandSlamQualifyingBadge } from "@/app/lib/grandSlamQualifying";
import { displayPlayerName, safePlayerUrl, verifiedPlayersFromMatchSide } from "@/data/playerSlugs";

type WatchProvider = {
  name: string;
  url: string;
  accessType: string;
  verificationStatus: string;
  note: string;
};

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string;
  watchProviders: WatchProvider[];
  round?: string;
  isFinal?: boolean;
};

const MAX_HOME_MATCHES = 60;
const MAX_MATCH_CARDS = 24;

function capHomepageMatches(matches: Match[]) {
  return matches.slice(0, MAX_HOME_MATCHES);
}

function isGrandSlamTournament(tournament: string) {
  const name = tournament.toLowerCase();

  return (
    name.includes("roland") ||
    name.includes("french open") ||
    name.includes("wimbledon") ||
    name.includes("us open") ||
    name.includes("australian open")
  );
}

function getSafeWatchProviders(match: Match) {
  if (!isGrandSlamTournament(match.tournament)) {
    return match.watchProviders;
  }

  const filtered = match.watchProviders.filter((provider) => {
    const name = provider.name.toLowerCase();
    return !name.includes("tennis tv") && !name.includes("atp tv");
  });

  if (filtered.length > 0) return filtered;

  if (match.tournament.toLowerCase().includes("french open") || match.tournament.toLowerCase().includes("roland")) {
    return [
      {
        name: "Roland-Garros official broadcasters",
        url: "https://www.rolandgarros.com/en-us/broadcasters",
        accessType: "REGION_DEPENDENT",
        verificationStatus: "TOURNAMENT_VERIFIED",
        note: "French Open rights are separate from Tennis TV. Check the official broadcaster list for your country.",
      },
    ];
  }

  return [
    {
      name: "Official Grand Slam broadcasters",
      url: "/watch-tennis-in/usa",
      accessType: "REGION_DEPENDENT",
      verificationStatus: "TOURNAMENT_VERIFIED",
      note: "Grand Slam streaming rights are separate from Tennis TV and vary by country.",
    },
  ];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function playerUrl(name: string) {
  return safePlayerUrl(name);
}
function matchSlug(match: Match) {
  const readablePart = `${match.player1}-vs-${match.player2}`
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
}

function isRealPlayerSide(value?: string) {
  const name = String(value || "").trim();

  if (!name) return false;

  const normalized = name.toLowerCase();

  const blockedValues = [
    "unknown player",
    "unknown",
    "tbd",
    "bye",
    "vs",
    "-",
    "—",
  ];

  if (blockedValues.includes(normalized)) return false;

  // API-Tennis sometimes returns placeholder-like sides made only of separators.
  return /[a-z]/i.test(name);
}

function splitPlayers(name: string) {
  return verifiedPlayersFromMatchSide(name);
}

function displayablePlayers(name?: string) {
  const rawName = String(name || "").trim();

  if (!isRealPlayerSide(rawName)) return [];

  const verifiedPlayers = splitPlayers(rawName)
    .map((player) => player.trim())
    .filter(isRealPlayerSide);

  if (verifiedPlayers.length > 0) {
    return verifiedPlayers;
  }

  const fallbackName = displayPlayerName(rawName).trim();

  return isRealPlayerSide(fallbackName) ? [fallbackName] : [];
}

function hasRenderablePlayers(match: Match) {
  return (
    displayablePlayers(match.player1).length > 0 &&
    displayablePlayers(match.player2).length > 0
  );
}

function getHomepageMatches(matches: Match[]) {
  const filtered = matches.filter(hasRenderablePlayers);
  if (filtered.length > 0) {
    return filtered;
  }

  return matches.filter(
    (match) =>
      String(match.player1 || "").trim().length > 0 &&
      String(match.player2 || "").trim().length > 0
  );
}

function MatchLoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading match cards" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" data-testid="match-loading-skeleton">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-800" />
            <div className="h-4 w-12 animate-pulse rounded bg-zinc-800" />
          </div>
          <div className="space-y-3">
            <div className="h-7 w-4/5 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-10 animate-pulse rounded bg-zinc-900" />
            <div className="h-7 w-3/5 animate-pulse rounded bg-zinc-800" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="h-16 animate-pulse rounded-2xl bg-black" />
            <div className="h-16 animate-pulse rounded-2xl bg-black" />
          </div>
          <div className="mt-5 h-12 animate-pulse rounded-2xl bg-green-500/30" />
        </div>
      ))}
    </div>
  );
}

export default function HomepageMatchExplorer() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadMatches() {
      // Try up to 2 times for transient API slowness
      const attempts = 2;
      let lastError: unknown = null;

      for (let attempt = 1; attempt <= attempts; attempt++) {
        const controller = new AbortController();
        const timeoutMs = 8000;
        const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

        try {
          const safeMatches = await fetchClientMatches("/api/matches", {
            signal: controller.signal,
            ttlMs: 25_000,
            timeoutMs,
          });

          if (!isMounted) return;
          setMatches(capHomepageMatches(safeMatches as Match[]));
          setLoadError(false);
          lastError = null;
          break;
        } catch (err) {
          lastError = err;
          console.warn(`loadMatches attempt ${attempt} failed:`, err);
          // small backoff before retry
          if (attempt < attempts) await new Promise((r) => setTimeout(r, 350));
        } finally {
          window.clearTimeout(timeoutId);
        }
      }

      if (lastError) {
        console.warn("Failed to load matches after retries:", lastError);
        if (!isMounted) return;
        setMatches([]);
        setLoadError(true);
      }

      if (isMounted) {
        setLoading(false);
      }
    }

    loadMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  const homepageMatches = getHomepageMatches(matches);

  const filteredMatches = homepageMatches.filter((match) => {
    const matchesFilter =
      selectedFilter === "ALL" ||
      match.category === selectedFilter ||
      (selectedFilter === "LIVE" && match.status === "LIVE");

    const search = searchQuery.toLowerCase();

    const matchesSearch =
      match.player1.toLowerCase().includes(search) ||
      match.player2.toLowerCase().includes(search) ||
      match.tournament.toLowerCase().includes(search);

    return matchesFilter && matchesSearch;
  });

  const visibleFilteredMatches = filteredMatches.slice(0, MAX_MATCH_CARDS);

  return (
    <>
        <section className="z-20 mb-6 rounded-3xl border border-zinc-800 bg-zinc-950/95 p-4 shadow-2xl shadow-black/30 backdrop-blur md:sticky md:top-20 md:p-5">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-black text-white">Find a match</h2>
            <p className="text-sm font-bold text-zinc-500" suppressHydrationWarning>
              Updated {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search player or tournament..."
            aria-label="Search by player or tournament"
            className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-4 text-base outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/40"
          />

          <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter matches">
            {["ALL", "LIVE", "ATP", "WTA", "CHALLENGER", "ITF"].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                aria-pressed={selectedFilter === filter}
                className={`rounded-full px-4 py-2 text-sm font-black transition ${
                  selectedFilter === filter
                    ? "bg-green-500 text-black"
                    : "border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-green-500 hover:text-white focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-zinc-400" role="status" aria-live="polite">
            <span>{filteredMatches.length} matches found</span>
            <span>{homepageMatches.filter((match) => match.status === "LIVE").length} live now</span>
            <Link href="/live-tennis" className="text-green-400 hover:text-green-300" data-testid="guide-streaming-link">Live page</Link>
            <Link href="/tennis-on-tv-today" className="text-green-400 hover:text-green-300" data-testid="guide-streaming-link">TV schedule</Link>
          </div>
        </section>

        {loading ? (
          <MatchLoadingSkeleton />
        ) : loadError ? (
          <div className="rounded-3xl border border-amber-500/40 bg-zinc-950 p-8" data-testid="empty-state">
            <p className="text-xl font-black text-white">Match feed is temporarily unavailable.</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              You can still use the live page, TV schedule and tournament pages while the live feed recovers.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/live-tennis" className="rounded-2xl bg-green-500 px-4 py-3 text-sm font-black text-black hover:bg-green-400" data-testid="guide-streaming-link">
                Open live tennis
              </Link>
              <Link href="/tennis-on-tv-today" className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm font-black text-zinc-200 hover:border-green-500" data-testid="guide-streaming-link">
                Check TV schedule
              </Link>
            </div>
          </div>
        ) : visibleFilteredMatches.length === 0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8" data-testid="empty-state">
            <p className="text-xl font-black text-white">No matches found.</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Try a different player, tournament or tour filter. If you are looking for a daily overview, the schedule pages are often faster.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {(searchQuery || selectedFilter !== "ALL") ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilter("ALL");
                  }}
                  className="rounded-2xl bg-green-500 px-4 py-3 text-sm font-black text-black hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                >
                  Clear filters
                </button>
              ) : null}
              <Link href="/today" className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm font-black text-zinc-200 hover:border-green-500" data-testid="guide-streaming-link">
                Today schedule
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleFilteredMatches.map((match) => {
              const providers = getSafeWatchProviders(match);
              const primaryProvider = providers[0];
              const player1 = displayablePlayers(match.player1);
              const player2 = displayablePlayers(match.player2);
              const qualifyingBadge = getGrandSlamQualifyingBadge(match);

              return (
                <article key={match.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-green-500" data-testid="match-card">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${match.status === "LIVE" ? "bg-red-500 text-white" : "bg-zinc-800 text-zinc-200"}`}>
                      {match.status}
                    </span>
                    <span className="text-xs font-black uppercase text-zinc-500">{match.category}</span>
                  </div>

                  {qualifyingBadge ? (
                    <div className="mb-3 inline-flex rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-green-300">
                      {qualifyingBadge}
                    </div>
                  ) : null}

                  <h2 className="text-2xl font-black leading-tight">
                    {player1.map((player, index) => {
                      const href = playerUrl(player);
                      return (
                        <span key={`${match.id}-p1-${player}`}>
                          {href ? <Link href={href} className="hover:text-green-400" data-testid="player-link">{player}</Link> : player}
                          {index < player1.length - 1 ? <span className="text-zinc-500"> / </span> : null}
                        </span>
                      );
                    })}
                    <span className="block py-1 text-base font-black text-zinc-600">vs</span>
                    {player2.map((player, index) => {
                      const href = playerUrl(player);
                      return (
                        <span key={`${match.id}-p2-${player}`}>
                          {href ? <Link href={href} className="hover:text-green-400" data-testid="player-link">{player}</Link> : player}
                          {index < player2.length - 1 ? <span className="text-zinc-500"> / </span> : null}
                        </span>
                      );
                    })}
                  </h2>

                  <Link href={`/tournament/${slugify(match.tournament)}`} className="mt-4 block text-sm font-bold text-zinc-400 hover:text-green-400">
                    {match.tournament}
                  </Link>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-zinc-800 bg-black p-3">
                      <p className="text-zinc-500">Score</p>
                      <p className="mt-1 font-black text-white">{match.score || "-"}</p>
                    </div>
                    <div className="rounded-2xl border border-zinc-800 bg-black p-3">
                      <p className="text-zinc-500">Start</p>
                      <p className="mt-1 font-black text-white">
                        {match.startTime ? new Date(match.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBC"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-2">
                    <Link href={`/watch/${matchSlug(match)}`} className="rounded-2xl bg-green-500 px-4 py-3 text-center font-black text-black hover:bg-green-400" data-testid="guide-streaming-link">
                      Match details
                    </Link>
                    {primaryProvider ? (
                      <a
                        href={withTracking(primaryProvider.url, "homepage_match_card")}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        className="rounded-2xl border border-zinc-800 px-4 py-3 text-center text-sm font-black text-zinc-200 hover:border-green-500"
                        data-testid="guide-streaming-link"
                      >
                        {primaryProvider.name}
                      </a>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
    </>
  );
}
