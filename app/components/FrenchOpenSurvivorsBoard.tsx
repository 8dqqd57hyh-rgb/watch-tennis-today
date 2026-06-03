"use client";

import { useEffect, useMemo, useState } from "react";
import { safePlayerUrl } from "@/data/playerSlugs";

type PlayerPath = {
  id: string;
  player: string;
  seed?: string;
  section?: string;
  tour: "ATP" | "WTA";
  currentStatus?: "Active";
  nextMatchDate?: string;
  nextMatchTime?: string;
  nextMatchStatus?: "LIVE" | "Scheduled";
  nextOpponent?: string;
  summary?: string;
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

function formatNextMatch(player: PlayerPath) {
  if (player.nextMatchStatus === "LIVE") return "Live now";

  return [player.nextMatchDate, player.nextMatchTime].filter(Boolean).join(" · ") || "Next time TBC";
}

function getUrgencyRank(player: PlayerPath) {
  if (player.nextMatchStatus === "LIVE") return 0;
  if (player.nextMatchStatus === "Scheduled") return 1;
  return 2;
}

export default function FrenchOpenSurvivorsBoard({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<DrawTrackerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tour, setTour] = useState<"All" | "ATP" | "WTA">("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/french-open-schedule-tracker", { cache: "no-store" });
        const result = await response.json();

        if (!ignore) setData(result);
      } catch (error) {
        console.error("French Open survivors board failed:", error);
        if (!ignore) setData({ error: "Unable to load French Open survivor data." });
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  const activePlayers = data?.activePlayers || [];

  const visiblePlayers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return activePlayers
      .filter((player) => tour === "All" || player.tour === tour)
      .filter((player) => {
        if (!normalizedQuery) return true;

        return (
          player.player.toLowerCase().includes(normalizedQuery) ||
          player.nextOpponent?.toLowerCase().includes(normalizedQuery) ||
          player.section?.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((a, b) => {
        const urgencyDiff = getUrgencyRank(a) - getUrgencyRank(b);
        if (urgencyDiff !== 0) return urgencyDiff;

        const aDate = `${a.nextMatchDate || "9999-99-99"} ${a.nextMatchTime || "99:99"}`;
        const bDate = `${b.nextMatchDate || "9999-99-99"} ${b.nextMatchTime || "99:99"}`;

        return aDate.localeCompare(bDate) || a.player.localeCompare(b.player);
      });
  }, [activePlayers, query, tour]);

  const atpCount = activePlayers.filter((player) => player.tour === "ATP").length;
  const wtaCount = activePlayers.filter((player) => player.tour === "WTA").length;
  const liveCount = activePlayers.filter((player) => player.nextMatchStatus === "LIVE").length;
  const scheduledCount = activePlayers.filter((player) => player.nextMatchStatus === "Scheduled").length;
  const nextOnCourt = visiblePlayers.slice(0, compact ? 6 : 12);
  const isFallbackOrEmpty = !isLoading && activePlayers.length === 0;

  return (
    <section className="mb-12 rounded-[2.5rem] border border-emerald-500/40 bg-gradient-to-br from-emerald-950/35 via-black to-zinc-950 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-emerald-300">
            French Open survivor tracker
          </p>
          <h2 className={compact ? "text-3xl font-black md:text-4xl" : "text-4xl font-black md:text-6xl"}>
            Who is still in Roland Garros?
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-300">
            A fast active-player board for fans who missed matches and want to know who is still alive, who plays next and which draw is moving right now.
          </p>
          {data?.dateStart && data?.dateStop ? (
            <p className="mt-2 text-sm font-bold text-zinc-500">
              Fixture window: {data.dateStart} → {data.dateStop}
            </p>
          ) : null}
        </div>

        <a
          href="/french-open-schedule"
          className="inline-flex rounded-2xl border border-emerald-500/50 px-5 py-3 font-black text-emerald-100 transition hover:border-emerald-300 hover:text-white"
        >
          Open full draw tracker →
        </a>
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-4">
        <div className="rounded-3xl border border-zinc-800 bg-black/50 p-5">
          <p className="text-sm font-bold text-zinc-500">Still active</p>
          <p className="mt-2 text-4xl font-black text-emerald-300">{data?.activeCount ?? activePlayers.length}</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-black/50 p-5">
          <p className="text-sm font-bold text-zinc-500">Men / ATP</p>
          <p className="mt-2 text-4xl font-black">{atpCount}</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-black/50 p-5">
          <p className="text-sm font-bold text-zinc-500">Women / WTA</p>
          <p className="mt-2 text-4xl font-black">{wtaCount}</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-black/50 p-5">
          <p className="text-sm font-bold text-zinc-500">Live / scheduled</p>
          <p className="mt-2 text-4xl font-black text-orange-300">{liveCount}/{scheduledCount}</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex rounded-2xl border border-zinc-800 bg-black p-1">
          {(["All", "ATP", "WTA"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTour(option)}
              className={`rounded-xl px-4 py-2 text-sm font-black transition ${
                tour === option ? "bg-emerald-400 text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search player or opponent..."
          className="w-full rounded-2xl border border-zinc-800 bg-black px-5 py-3 font-bold text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 md:max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-zinc-800 bg-black/50 p-6 text-zinc-400">
          Loading active Roland Garros players...
        </div>
      ) : isFallbackOrEmpty ? (
        <div className="rounded-3xl border border-yellow-500/30 bg-yellow-950/20 p-6 text-yellow-100">
          Active-player data is not available right now. Check the API_TENNIS_KEY value and the French Open fixture feed if this remains empty in production.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {nextOnCourt.map((player) => (
            <a
              key={`${player.id}-${player.nextOpponent || "next"}`}
              href={safePlayerUrl(player.player) || "/players"}
              className="group rounded-3xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-emerald-400 hover:bg-zinc-900"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-black ${
                  player.nextMatchStatus === "LIVE"
                    ? "bg-red-500 text-white"
                    : "bg-emerald-400/15 text-emerald-200"
                }`}>
                  {player.nextMatchStatus === "LIVE" ? "LIVE NOW" : player.tour}
                </span>
                <span className="text-xs font-bold text-zinc-500">{player.section || "Singles"}</span>
              </div>

              <h3 className="mb-3 text-2xl font-black leading-tight group-hover:text-emerald-200">
                {player.player}
              </h3>

              <p className="mb-3 text-sm leading-6 text-zinc-400">
                Next: {player.nextOpponent ? `vs ${player.nextOpponent}` : "opponent TBC"}
              </p>

              <p className="text-sm font-black text-zinc-200">{formatNextMatch(player)}</p>
            </a>
          ))}
        </div>
      )}

      {!compact && data?.eliminatedCount ? (
        <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-950/10 p-5 text-sm leading-7 text-zinc-300">
          The tracker has identified approximately <strong className="text-red-200">{data.eliminatedCount}</strong> eliminated players from completed main-draw fixtures in the current data window. Active status is based on remaining live or scheduled fixtures, so it updates as the tournament feed changes.
        </div>
      ) : null}
    </section>
  );
}
