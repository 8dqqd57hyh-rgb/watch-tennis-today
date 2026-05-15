"use client";

import { useEffect, useState } from "react";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string;
};

const priorityPlayers = [
  "Jannik Sinner",
  "Carlos Alcaraz",
  "Novak Djokovic",
  "Daniil Medvedev",
  "Alexander Zverev",
  "Iga Swiatek",
  "Aryna Sabalenka",
  "Coco Gauff",
];

function playerSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function splitPlayers(name: string) {
  return name
    .split("/")
    .map((player) => player.trim())
    .filter(Boolean);
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

export const metadata = {
  title: "Live Tennis Players Now | ATP & WTA Live Matches",
  description:
    "Players currently competing in live ATP, WTA, Challenger and Grand Slam tennis matches.",
};

export default function LiveNowPlayersPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const response = await fetch("/api/matches");

        if (!response.ok) {
          setMatches([]);
          return;
        }

        const data = await response.json();

        const safeMatches = Array.isArray(data)
          ? data
          : Array.isArray(data.matches)
          ? data.matches
          : [];

        setMatches(safeMatches);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  const liveMatches = matches.filter(
    (match) => match.status.toUpperCase() === "LIVE"
  );

  const livePlayers = [
    ...new Set(
      liveMatches.flatMap((match) => [
        ...splitPlayers(match.player1),
        ...splitPlayers(match.player2),
      ])
    ),
  ].sort((a, b) => {
    const aPriority = priorityPlayers.includes(a);
    const bPriority = priorityPlayers.includes(b);

    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;

    return a.localeCompare(b);
  });

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <a
          href="/"
          className="text-zinc-400 hover:text-white"
        >
          ← Back
        </a>

        <section className="mt-8 mb-10">
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            🔴 Live Tennis Players Now
          </h1>

          <p className="text-zinc-400 text-lg leading-8 max-w-3xl mb-6">
            Players currently competing in live ATP, WTA, Challenger and Grand Slam tennis matches.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold text-red-400">
              🔴 Live updates
            </div>

            <p className="text-zinc-500 text-sm">
              Last updated:{" "}
              {new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </section>

        {loading ? (
          <p className="text-zinc-500 text-xl">
            Loading live players...
          </p>
        ) : livePlayers.length === 0 ? (
          <p className="text-zinc-500 text-xl">
            No live players right now.
          </p>
        ) : (
          <>
            <section className="mb-14">
              <h2 className="text-3xl font-black mb-6">
                🎾 Players Live Right Now
              </h2>

              <div className="flex flex-wrap gap-3">
                {livePlayers.map((player) => (
                  <a
                    key={player}
                    href={`/player/${playerSlug(player)}`}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 font-bold hover:border-red-500 hover:text-red-400 transition-all"
                  >
                    🔴 {player}
                  </a>
                ))}
              </div>
            </section>

            <section className="mb-14">
              <h2 className="text-3xl font-black mb-6">
                🔥 Live Tennis Matches
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {liveMatches.slice(0, 10).map((match) => (
                  <a
                    key={match.id}
                    href={`/watch/${matchSlug(match)}`}
                    className="block rounded-[2rem] border border-red-500 bg-zinc-900 p-6 hover:scale-[1.01] transition-all"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                        LIVE NOW
                      </span>

                      <span className="text-zinc-400">
                        {match.category}
                      </span>
                    </div>

                    <h3 className="text-3xl font-black leading-tight mb-4">
                      {match.player1}
                      <br />
                      vs
                      <br />
                      {match.player2}
                    </h3>

                    <p className="text-zinc-400 mb-4">
                      {match.tournament}
                    </p>

                    <div className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black">
                      Open Match →
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section className="bg-zinc-950 border border-zinc-800 rounded-[2rem] p-8">
              <div className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400 mb-5">
                🌍 Tennis streaming tip
              </div>

              <h2 className="text-3xl font-black mb-5">
                Watching tennis while traveling?
              </h2>

              <p className="text-zinc-300 leading-8 mb-6">
                Tennis streaming availability may vary depending on your country.
                NordVPN can help keep your connection private while following live
                ATP, WTA and Grand Slam tennis matches abroad.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="/best-vpn-for-tennis-streaming"
                  className="inline-block rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400 transition-all"
                >
                  Best VPN for Tennis Streaming
                </a>

                <a
                  href="/how-to-watch-tennis-safely-abroad"
                  className="inline-block rounded-2xl border border-zinc-700 px-6 py-4 font-bold hover:border-green-500 hover:text-green-400 transition-all"
                >
                  Tennis Streaming Safety Guide
                </a>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}