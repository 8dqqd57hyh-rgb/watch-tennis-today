"use client";

import { useEffect, useState } from "react";
import AdSlot from "@/app/components/AdSlot";
import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";

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

const trendingPlayers = [
  "Jannik Sinner",
  "Carlos Alcaraz",
  "Novak Djokovic",
  "Aryna Sabalenka",
  "Iga Swiatek",
  "Coco Gauff",
];

const countries = [
  "usa",
  "uk",
  "poland",
  "germany",
  "france",
  "italy",
  "spain",
  "canada",
  "australia",
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

function readableCountry(country: string) {
  return country
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function LiveMatchesNowPage() {
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

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Hero / intro block */}
        <a
          href="/"
          className="text-zinc-400 hover:text-white"
        >
          ← Back
        </a>

        <section className="mt-8 mb-12">
          <div className="inline-flex items-center rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold text-red-400 mb-5">
            🔴 LIVE NOW
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Live Tennis Matches Now
          </h1>

          <p className="text-zinc-400 text-lg leading-8 max-w-3xl">
            Follow live ATP, WTA, Challenger and Grand Slam tennis matches
            happening right now with live scores, schedules and streaming coverage.
          </p>
        </section>

        <AdSlot label="Advertisement" />

        {/* rest of the page */}
        {loading ? (
          <p className="text-zinc-500 text-xl">
            Loading live tennis matches now...
          </p>
        ) : liveMatches.length === 0 ? (
          <p className="text-zinc-500 text-xl">
            No live tennis matches right now.
          </p>
        ) : (
          <section className="mb-16">
            <h2 className="text-4xl font-black mb-6">
              🔥 Trending Live Matches
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {liveMatches.slice(0, 12).map((match) => (
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

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-400">
                      {match.score || "Live"}
                    </span>

                    <span className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black">
                      Open Match →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-3xl font-black mb-6">
            ⭐ Trending Tennis Players
          </h2>

          <div className="flex flex-wrap gap-3">
            {trendingPlayers.map((player) => (
              <a
                key={player}
                href={`/watch-player-live/${playerSlug(player)}`}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-yellow-500 hover:text-yellow-400 transition-all"
              >
                ⭐ {player}
              </a>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-black mb-6">
            🌍 Watch Tennis by Country
          </h2>

          <div className="flex flex-wrap gap-3">
            {countries.map((country) => (
              <a
                key={country}
                href={`/watch-tennis-in/${country}`}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all"
              >
                {readableCountry(country)}
              </a>
            ))}
          </div>
        </section>

    

        {/* Hero / intro block */}
        <a
          href="/"
          className="text-zinc-400 hover:text-white"
        >
          ← Back
        </a>

        <section className="mt-8 mb-12">
          <div className="inline-flex items-center rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold text-red-400 mb-5">
            🔴 LIVE NOW
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Live Tennis Matches Now
          </h1>

          <p className="text-zinc-400 text-lg leading-8 max-w-3xl">
            Follow live ATP, WTA, Challenger and Grand Slam tennis matches
            happening right now with live scores, schedules and streaming coverage.
          </p>
        </section>

        <AdSlot label="Advertisement" />

        {/* rest of the page */}
        {loading ? (
          <p className="text-zinc-500 text-xl">
            Loading live tennis matches now...
          </p>
        ) : liveMatches.length === 0 ? (
          <p className="text-zinc-500 text-xl">
            No live tennis matches right now.
          </p>
        ) : (
          <section className="mb-16">
            <h2 className="text-4xl font-black mb-6">
              🔥 Trending Live Matches
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {liveMatches.slice(0, 12).map((match) => (
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

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-400">
                      {match.score || "Live"}
                    </span>

                    <span className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black">
                      Open Match →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-3xl font-black mb-6">
            ⭐ Trending Tennis Players
          </h2>

          <div className="flex flex-wrap gap-3">
            {trendingPlayers.map((player) => (
              <a
                key={player}
                href={`/watch-player-live/${playerSlug(player)}`}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-yellow-500 hover:text-yellow-400 transition-all"
              >
                ⭐ {player}
              </a>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-black mb-6">
            🌍 Watch Tennis by Country
          </h2>

          <div className="flex flex-wrap gap-3">
            {countries.map((country) => (
              <a
                key={country}
                href={`/watch-tennis-in/${country}`}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all"
              >
                {readableCountry(country)}
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400 mb-5">
              🌍 Tennis streaming tip
            </div>

            <h2 className="text-4xl font-black leading-tight mb-5">
              Watching tennis while traveling?
            </h2>

            <p className="text-zinc-300 text-lg leading-8 mb-8">
              Some ATP, WTA and Grand Slam streams may be unavailable depending
              on your country. VPN services are commonly used for more secure
              access to streaming platforms while abroad.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/best-vpn-for-tennis-streaming"
                className="inline-flex items-center rounded-2xl bg-green-500 px-6 py-4 text-lg font-black text-black hover:bg-green-400 transition-all"
              >
                Best VPN for Tennis Streaming
              </a>

              <a
                href="/how-to-watch-tennis-safely-abroad"
                className="inline-flex items-center rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-zinc-500 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        <RelatedMoneyLinks />
      </div>
    </main>
  );
}