"use client";

import React, { useEffect, useState } from "react";

function playerUrl(name?: string) {
  if (!name) return "/";
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove punctuation
    .replace(/\s+/g, "-"); // spaces to dashes
  return `/players/${encodeURIComponent(slug)}`;
}

type Match = {
  id?: string;
  player1?: string;
  player2?: string;
  status?: string;
  tournament?: string;
};

function splitPlayers(name?: string) {
  if (!name) return [];
  return name
    .split(/vs\.?|v\.?|\/|,| - /i)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function LiveNowPlayersPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/api/matches");
        if (!res.ok) {
          setMatches([]);
          return;
        }
        const data = await res.json();
        const list: Match[] = Array.isArray(data)
          ? data
          : Array.isArray(data.matches)
          ? data.matches
          : [];
        if (mounted) setMatches(list);
      } catch {
        if (mounted) setMatches([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

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
            Players currently competing in live ATP, WTA, Challenger and Grand
            Slam tennis matches.
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
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-zinc-300">
            Loading...
          </div>
        ) : livePlayers.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-zinc-300">
            No players are currently live. Check back for updates or visit the
            live matches page.
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {livePlayers.map((player) => (
              <a
                key={player}
                href={playerUrl(player)}
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
