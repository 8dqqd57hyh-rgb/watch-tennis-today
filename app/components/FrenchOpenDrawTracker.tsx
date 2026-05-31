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
  seed: string;
  section: string;
  tour: "ATP" | "WTA";
  currentStatus: "Active";
  summary: string;
  matches: DrawMatch[];
};

type DrawTrackerResponse = {
  success?: boolean;
  activePlayers?: PlayerPath[];
  activeCount?: number;
  eliminatedCount?: number;
  sourceMatchCount?: number;
  dateStart?: string;
  dateStop?: string;
  error?: string;
};

const fallbackPlayerPaths: PlayerPath[] = [
  {
    id: "aryna-sabalenka",
    player: "Aryna Sabalenka",
    seed: "Fallback active player",
    section: "Women’s singles",
    tour: "WTA",
    currentStatus: "Active",
    summary:
      "Fallback data is shown only when live draw tracker fixtures are temporarily unavailable.",
    matches: [
      {
        round: "Next",
        player: "Aryna Sabalenka",
        opponent: "Next confirmed opponent",
        status: "upcoming",
        note: "The live API will replace this fallback when fixtures load.",
        watchHref: "/french-open-today",
      },
    ],
  },
];

const statusStyles: Record<DrawStatus, string> = {
  advanced: "border-emerald-500/40 bg-emerald-950/25 text-emerald-200",
  eliminated: "border-red-500/40 bg-red-950/25 text-red-200",
  live: "border-orange-500/50 bg-orange-950/30 text-orange-200",
  upcoming: "border-sky-500/40 bg-sky-950/25 text-sky-200",
  potential: "border-zinc-700 bg-zinc-900 text-zinc-300",
};

function labelForStatus(status: DrawStatus) {
  switch (status) {
    case "advanced":
      return "Advanced";
    case "eliminated":
      return "Eliminated";
    case "live":
      return "Live now";
    case "upcoming":
      return "Next / upcoming";
    case "potential":
      return "Potential matchup";
  }
}

function getFallbackPlayerId(players: PlayerPath[], tour: "All" | "ATP" | "WTA") {
  return players.find((path) => tour === "All" || path.tour === tour)?.id ?? players[0]?.id ?? "";
}

export default function FrenchOpenDrawTracker({ compact = false }: { compact?: boolean }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [tour, setTour] = useState<"All" | "ATP" | "WTA">("All");
  const [trackerData, setTrackerData] = useState<DrawTrackerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadDrawTracker() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/french-open-draw-tracker", { cache: "no-store" });
        const data: DrawTrackerResponse = await response.json();

        if (!ignore) {
          setTrackerData(data);
        }
      } catch (error) {
        console.error("Draw tracker load failed:", error);

        if (!ignore) {
          setTrackerData({ error: "Unable to load live draw tracker data." });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadDrawTracker();

    return () => {
      ignore = true;
    };
  }, []);

  const activePlayerPaths = useMemo(() => {
    const apiPlayers = trackerData?.activePlayers || [];

    return apiPlayers.length > 0 ? apiPlayers : fallbackPlayerPaths;
  }, [trackerData]);

  const visiblePlayers = useMemo(() => {
    return activePlayerPaths.filter((path) => tour === "All" || path.tour === tour);
  }, [activePlayerPaths, tour]);

  const selectedPlayer =
    visiblePlayers.find((path) => path.id === selectedPlayerId) ??
    activePlayerPaths.find((path) => path.id === selectedPlayerId) ??
    visiblePlayers[0] ??
    activePlayerPaths[0];

  function handleTourChange(nextTour: "All" | "ATP" | "WTA") {
    setTour(nextTour);
    const selectedPlayerStillVisible = activePlayerPaths.some(
      (path) => path.id === selectedPlayerId && (nextTour === "All" || path.tour === nextTour),
    );

    if (!selectedPlayerStillVisible) {
      setSelectedPlayerId(getFallbackPlayerId(activePlayerPaths, nextTour));
    }
  }

  const eliminatedCount = trackerData?.eliminatedCount ?? 0;
  const sourceMatchCount = trackerData?.sourceMatchCount ?? 0;
  const isUsingFallback = (trackerData?.activePlayers || []).length === 0;

  return (
    <section className="mb-12 rounded-[2rem] border border-orange-500/40 bg-gradient-to-br from-zinc-950 via-black to-orange-950/20 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-orange-300">
            Draw tracker
          </p>
          <h2 className="text-3xl font-black md:text-5xl">
            Follow active Roland Garros players from real fixtures
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-400">
            The picker is now built from live and upcoming French Open matches. Players disappear from the active list when they no longer appear in remaining fixtures.
          </p>
          {trackerData?.dateStart && trackerData?.dateStop ? (
            <p className="mt-2 text-sm font-bold text-zinc-500">
              Data window: {trackerData.dateStart} → {trackerData.dateStop}
            </p>
          ) : null}
        </div>

        <div className="flex rounded-2xl border border-zinc-800 bg-black p-1">
          {(["All", "ATP", "WTA"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleTourChange(option)}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                tour === option
                  ? "bg-orange-500 text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {isUsingFallback && !isLoading ? (
        <div className="mb-5 rounded-2xl border border-yellow-500/30 bg-yellow-950/20 p-4 text-sm font-bold text-yellow-100">
          Live fixture data is unavailable or empty, so the tracker is showing a small fallback. Check API_TENNIS_KEY and the French Open fixture feed if this stays visible in production.
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="rounded-3xl border border-zinc-800 bg-black/80 p-4">
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-zinc-500">
            Choose active player
          </p>
          <div className="space-y-2">
            {visiblePlayers.map((path) => (
              <button
                key={path.id}
                type="button"
                onClick={() => setSelectedPlayerId(path.id)}
                className={`w-full rounded-2xl border p-4 text-left transition ${
                  selectedPlayer?.id === path.id
                    ? "border-orange-500 bg-orange-950/30"
                    : "border-zinc-800 bg-zinc-950 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black text-white">{path.player}</h3>
                  <span className="rounded-full bg-zinc-900 px-2 py-1 text-xs font-black text-zinc-400">
                    {path.tour}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500">{path.seed}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-widest text-emerald-300">
                  Still in draw
                </p>
              </button>
            ))}
          </div>
          {visiblePlayers.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-950/20 p-4 text-sm font-bold text-red-200">
              No active players are currently available for this tour filter.
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 md:p-6">
          {selectedPlayer ? (
            <>
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-black p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Player</p>
                  <p className="mt-2 text-2xl font-black">{selectedPlayer.player}</p>
                </div>
                <div className="rounded-2xl bg-black p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Section</p>
                  <p className="mt-2 text-2xl font-black">{selectedPlayer.section}</p>
                </div>
                <div className="rounded-2xl bg-black p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Active filter</p>
                  <p className="mt-2 text-2xl font-black">{visiblePlayers.length} left</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {eliminatedCount} eliminated hidden · {sourceMatchCount} source matches checked
                  </p>
                </div>
              </div>

              <p className="mb-6 leading-8 text-zinc-300">{selectedPlayer.summary}</p>

              <div className="space-y-3">
                {selectedPlayer.matches.map((match) => (
                  <div
                    key={`${selectedPlayer.id}-${match.round}-${match.opponent}`}
                    className="rounded-3xl border border-zinc-800 bg-black p-4 md:p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-black uppercase tracking-widest text-zinc-400">
                            {match.round}
                          </span>
                          <span className={`rounded-full border px-3 py-1 text-xs font-black ${statusStyles[match.status]}`}>
                            {labelForStatus(match.status)}
                          </span>
                        </div>

                        <h4 className="text-xl font-black md:text-2xl">
                          {match.player} <span className="text-zinc-500">vs</span> {match.opponent}
                        </h4>

                        {match.result ? (
                          <p className="mt-2 text-sm font-bold text-emerald-300">{match.result}</p>
                        ) : null}

                        {match.note ? (
                          <p className="mt-3 max-w-2xl leading-7 text-zinc-500">{match.note}</p>
                        ) : null}
                      </div>

                      {match.watchHref ? (
                        <Link
                          href={match.watchHref}
                          className="inline-flex shrink-0 rounded-2xl border border-orange-500/50 px-4 py-3 text-sm font-black text-orange-200 transition hover:bg-orange-500 hover:text-black"
                        >
                          Follow match →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-black p-5 text-zinc-300">
              {isLoading ? "Loading active draw players…" : "No active French Open players found in the fixture feed."}
            </div>
          )}

          {!compact ? (
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <Link href="/french-open-results" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black transition hover:border-orange-500">
                Completed results →
              </Link>
              <Link href="/tomorrow" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black transition hover:border-orange-500">
                Tomorrow schedule →
              </Link>
              <Link href="/where-to-watch-french-open" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black transition hover:border-orange-500">
                Where to watch →
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
