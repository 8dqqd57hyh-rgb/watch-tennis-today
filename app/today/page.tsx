"use client";

import { useEffect, useState } from "react";
import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import { matchContainsExactPlayer } from "@/data/playerSlugs";

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

function slugify(text: string) {
  return text
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

function readableCountry(country: string) {
  return country
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatTime(value: string) {
  if (!value) return "Time TBC";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export const metadata = {
  alternates: { canonical: "https://watchtennistoday.com/today" },
};

export default function TodayPage() {
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

  const todayMatches = matches.slice(0, 18);

  const featuredMatch =
    liveMatches[0] ||
    matches.find((match) => match.category === "ATP" || match.category === "WTA") ||
    matches[0];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <section className="mt-8 mb-12">
          <div className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400 mb-5">
            📅 Tennis today
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Tennis Today: Live Matches, Scores & TV Schedule
          </h1>

          <p className="text-zinc-400 text-lg leading-8 max-w-3xl">
            Check tennis matches today, including live ATP, WTA, Challenger and
            Grand Slam coverage, start times, scores, tournaments and official
            streaming options.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
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

        {featuredMatch ? (
          <section className="mb-14 rounded-[2.5rem] border border-green-500 bg-gradient-to-br from-zinc-900 to-black p-8">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full">
                {featuredMatch.status}
              </span>

              <span className="text-zinc-400">
                {featuredMatch.category}
              </span>

              <span className="text-zinc-500">•</span>

              <a
                href={`/tournament/${slugify(featuredMatch.tournament)}`}
                className="text-zinc-400 hover:text-green-400"
              >
                {featuredMatch.tournament}
              </a>
            </div>

            <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              {featuredMatch.player1}
              <br />
              vs
              <br />
              {featuredMatch.player2}
            </h2>

            <div className="flex flex-wrap gap-6 mb-8 text-lg">
              <div>
                <p className="text-zinc-500 text-sm mb-1">Score</p>
                <p className="font-black">{featuredMatch.score || "-"}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm mb-1">Start Time</p>
                <p className="font-black">{formatTime(featuredMatch.startTime)}</p>
              </div>
            </div>

            <a
              href={`/watch/${matchSlug(featuredMatch)}`}
              className="inline-flex items-center rounded-2xl bg-green-500 px-6 py-4 text-lg font-black text-black hover:bg-green-400 transition-all"
            >
              Open Match Page →
            </a>
          </section>
        ) : null}

        {loading ? (
          <p className="text-zinc-500 text-xl">
            Loading today&apos;s tennis matches...
          </p>
        ) : todayMatches.length === 0 ? (
          <p className="text-zinc-500 text-xl">
            No tennis matches found for today.
          </p>
        ) : (
          <section className="mb-16">
            <h2 className="text-4xl font-black mb-6">
              🎾 Tennis Matches Today
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {todayMatches.map((match) => (
                <a
                  key={match.id}
                  href={`/watch/${matchSlug(match)}`}
                  className="block rounded-[2rem] border border-zinc-800 bg-zinc-900 p-6 hover:border-green-500 transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full ${
                        match.status.toUpperCase() === "LIVE"
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-zinc-700 text-zinc-200"
                      }`}
                    >
                      {match.status}
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

                  <p className="text-zinc-400 mb-3">{match.tournament}</p>

                  <p className="text-zinc-500 text-sm mb-5">
                    {formatTime(match.startTime)}
                  </p>

                  <div className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black">
                    Watch Details →
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-3xl font-black mb-6">
            ⭐ Trending Tennis Players Today
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
            🌍 Watch Tennis Today by Country
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

        <section className="mb-16 rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400 mb-5">
              🌍 Tennis streaming tip
            </div>

            <h2 className="text-4xl font-black leading-tight mb-5">
              Watching tennis while traveling today?
            </h2>

            <p className="text-zinc-300 text-lg leading-8 mb-8">
              Tennis streaming availability can vary by country and broadcaster.
              Check official streaming services and regional TV channels before
              today&apos;s match starts.
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

        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-3xl font-black mb-5">
            Tennis Today FAQ
          </h2>

          <div className="space-y-6 text-zinc-300 leading-8">
            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                What tennis matches are on today?
              </h3>
              <p>
                Today&apos;s tennis schedule can include ATP, WTA, Challenger,
                ITF and Grand Slam matches depending on the tournament calendar.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                Where can I watch tennis today?
              </h3>
              <p>
                Tennis matches today may be shown by official broadcasters,
                tournament partners and regional streaming services depending on
                your country.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                Does Watch Tennis Today stream matches?
              </h3>
              <p>
                No. Watch Tennis Today does not host tennis streams. The site
                helps fans find official schedules, TV channels and legal
                viewing options.
              </p>
            </div>
          </div>
        </section>

        <VpnPromo />
        <RelatedMoneyLinks />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What tennis matches are on today?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Today's tennis schedule can include ATP, WTA, Challenger, ITF and Grand Slam matches depending on the tournament calendar.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Where can I watch tennis today?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Tennis matches today may be shown by official broadcasters, tournament partners and regional streaming services depending on your country.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does Watch Tennis Today stream matches?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. Watch Tennis Today does not host tennis streams. The site helps fans find official schedules, TV channels and legal viewing options.",
                  },
                },
              ],
            }),
          }}
        />
      </div>
    </main>
  );

}