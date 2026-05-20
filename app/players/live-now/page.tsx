"use client";

import { headers } from "next/headers";

type Match = {
  id?: string;
  player1?: string;
  player2?: string;
  status?: string;
  tournament?: string;
};

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");
  if (!host) return "http://localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

async function getMatches(): Promise<Match[]> {
  const baseUrl = await getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/matches`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.matches)) return data.matches;
  } catch {}
  return [];
}

function splitPlayers(name?: string) {
  if (!name) return [];
  return name
    .split(/vs\.?|v\.?|\/|,| - /i)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function LiveNowPlayersPage() {
  const matches = await getMatches();

  const liveMatches = matches.filter(
    (m) => (m.status || "").toUpperCase() === "LIVE"
  );

  const livePlayers = [
    ...new Set(
      liveMatches.flatMap((match) => [
        ...splitPlayers(match.player1),
        ...splitPlayers(match.player2),
      ])
    ),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
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

        {livePlayers.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-zinc-300">
            No players are currently live. Check back for updates or visit the live matches page.
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {livePlayers.map((player) => (
              <a
                key={player}
                href={`/player/${player.toLowerCase().replace(/\s+/g, "-")}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-green-500 transition-all"
              >
                <h3 className="text-lg font-black">{player}</h3>
                <p className="text-sm text-zinc-400 mt-2">
                  See live scores, schedule and streaming options.
                </p>
              </a>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
