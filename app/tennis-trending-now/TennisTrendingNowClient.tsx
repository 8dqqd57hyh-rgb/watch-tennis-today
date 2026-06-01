"use client";

import { useEffect, useState } from "react";
import { fetchClientMatches } from "@/app/lib/clientMatchFetch";
import { affiliateLinks } from "@/app/lib/affiliateLinks";
import { safePlayerUrl } from "@/data/playerSlugs";

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
  "Daniil Medvedev",
  "Alexander Zverev",
  "Iga Swiatek",
  "Aryna Sabalenka",
  "Coco Gauff",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}


function matchSlug(match: Match) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
}

function isTrendingMatch(match: Match) {
  const text = `${match.player1} ${match.player2} ${match.tournament}`.toLowerCase();

  return (
    match.status === "LIVE" ||
    match.category === "ATP" ||
    match.category === "WTA" ||
    trendingPlayers.some((player) =>
      text.includes(player.toLowerCase().split(" ").pop() || "")
    )
  );
}

export default function TennisTrendingNowPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const safeMatches = await fetchClientMatches();
        setMatches(safeMatches as Match[]);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  const trendingMatches = matches.filter(isTrendingMatch).slice(0, 12);
  const liveMatches = matches.filter((match) => match.status === "LIVE").slice(0, 6);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <section className="mt-8 mb-12">
          <div className="inline-flex items-center rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold text-red-400 mb-5">
            🔥 Trending tennis hub
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Tennis Trending Now
          </h1>

          <p className="text-zinc-400 text-lg leading-8 max-w-3xl mb-6">
            Follow trending tennis matches, live ATP and WTA action, featured
            players, tournament updates and streaming guides in one place.
          </p>

          <p className="text-zinc-500 text-sm">
            Last updated:{" "}
            {new Date().toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </section>

        {loading ? (
          <p className="text-zinc-500 text-xl">Loading trending tennis...</p>
        ) : (
          <>
            {liveMatches.length > 0 && (
              <section className="mb-14">
                <h2 className="text-4xl font-black mb-6">
                  🔴 Live Tennis Right Now
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {liveMatches.map((match) => (
                    <a
                      key={match.id}
                      href={`/watch/${matchSlug(match)}`}
                      className="block rounded-[2rem] border border-red-500 bg-zinc-900 p-6 hover:scale-[1.01] transition-all"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                          LIVE NOW
                        </span>

                        <span className="text-zinc-400">{match.category}</span>
                      </div>

                      <h3 className="text-3xl font-black leading-tight mb-4">
                        {match.player1}
                        <br />
                        vs
                        <br />
                        {match.player2}
                      </h3>

                      <p className="text-zinc-400">{match.tournament}</p>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-14">
              <h2 className="text-4xl font-black mb-6">
                🔥 Trending Tennis Matches
              </h2>

              {trendingMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {trendingMatches.map((match) => (
                    <a
                      key={match.id}
                      href={`/watch/${matchSlug(match)}`}
                      className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 hover:border-green-500 transition-all"
                    >
                      <div className="flex justify-between mb-4">
                        <span className="font-black text-red-400">
                          {match.status}
                        </span>

                        <span className="text-zinc-500">{match.category}</span>
                      </div>

                      <h3 className="text-2xl font-black mb-3">
                        {match.player1}
                        <br />
                        vs
                        <br />
                        {match.player2}
                      </h3>

                      <p className="text-zinc-400">{match.tournament}</p>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500">
                  No trending tennis matches found right now. Check live tennis
                  updates again soon.
                </p>
              )}
            </section>

            <section className="mb-14">
              <h2 className="text-4xl font-black mb-6">
                ⭐ Trending Tennis Players
              </h2>

              <div className="flex flex-wrap gap-3">
                {trendingPlayers.map((player) => {
                  const href = safePlayerUrl(player);
                  if (!href) return null;

                  return (
                  <a
                    key={player}
                    href={href}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 font-bold hover:border-yellow-500 hover:text-yellow-400 transition-all"
                  >
                    ⭐ {player}
                  </a>
                  );
                })}
              </div>
            </section>

            <section className="mb-14 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
              <div className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400 mb-5">
                🌍 Tennis streaming tip
              </div>

              <h2 className="text-3xl font-black mb-5">
                Watching trending tennis while traveling?
              </h2>

              <p className="text-zinc-300 leading-8 mb-6">
                Tennis streaming availability may differ by country. NordVPN can
                help keep your connection private while following ATP, WTA and
                Grand Slam matches on hotel, airport or public Wi-Fi.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href={affiliateLinks.nordvpn}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400 transition-all"
                >
                  Try NordVPN
                </a>

                <a
                  href="/best-vpn-for-tennis-streaming"
                  className="rounded-2xl border border-zinc-700 px-6 py-4 font-bold hover:border-green-500 hover:text-green-400 transition-all"
                >
                  Best VPN for Tennis Streaming
                </a>
              </div>

              <p className="mt-5 text-sm text-zinc-500">
                Affiliate disclosure: we may earn a commission if you purchase
                through links on this page.
              </p>
            </section>

            <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
              <h2 className="text-3xl font-black mb-6">
                More Tennis Guides
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/live-tennis"
                  className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
                >
                  Live Tennis Today
                </a>

                <a
                  href="/players/live-now"
                  className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
                >
                  Live Players Now
                </a>

                <a
                  href="/how-to-watch-tennis-safely-abroad"
                  className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
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
