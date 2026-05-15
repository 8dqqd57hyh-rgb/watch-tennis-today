"use client";

import { useEffect, useState } from "react";
import { withTracking } from "@/app/lib/tracking";
import { affiliateLinks } from "@/lib/affiliate";

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
};

const countries = [
  "poland",
  "uk",
  "usa",
  "germany",
  "france",
  "spain",
  "italy",
  "canada",
  "australia",
  "india",
];

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

function readableCountry(country: string) {
  return country
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

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

function splitPlayers(name: string) {
  return name
    .split("/")
    .map((player) => player.trim())
    .filter(Boolean);
}

function hasPriorityPlayer(match: Match) {
  const text = `${match.player1} ${match.player2}`.toLowerCase();

  return priorityPlayers.some((player) =>
    text.includes(player.toLowerCase().split(" ").pop() || "")
  );
}

function uniquePlayers(matches: Match[]) {
  const players = matches.flatMap((match) => [
    ...splitPlayers(match.player1),
    ...splitPlayers(match.player2),
  ]);

  return [...new Set(players)]
    .filter(Boolean)
    .sort((a, b) => {
      const aPriority = priorityPlayers.some(
        (player) => player.toLowerCase() === a.toLowerCase()
      );

      const bPriority = priorityPlayers.some(
        (player) => player.toLowerCase() === b.toLowerCase()
      );

      if (aPriority && !bPriority) return -1;
      if (!aPriority && bPriority) return 1;

      return a.localeCompare(b);
    })
    .slice(0, 40);
}

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadMatches() {
      try {
        const matchesResponse = await fetch("/api/matches");

        if (!matchesResponse.ok) {
          setMatches([]);
          return;
        }

        const matchesData = await matchesResponse.json();

        const safeMatches = Array.isArray(matchesData)
          ? matchesData
          : Array.isArray(matchesData.matches)
            ? matchesData.matches
            : [];

        setMatches(safeMatches);
      } catch (error) {
        console.error("Failed to load matches");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  const seoPlayers = uniquePlayers(matches);

  const filteredMatches = matches.filter((match) => {
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

  const livePlayers = [
    ...new Set(
      matches
        .filter((match) => match.status === "LIVE")
        .flatMap((match) => [
          ...splitPlayers(match.player1),
          ...splitPlayers(match.player2),
        ])
        .map((player) => player.trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => {
    const aPriority = priorityPlayers.some(
      (player) => player.toLowerCase() === a.toLowerCase()
    );

    const bPriority = priorityPlayers.some(
      (player) => player.toLowerCase() === b.toLowerCase()
    );

    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;

    return a.localeCompare(b);
  });

  const topLiveMatches = matches
    .filter((match) => match.status === "LIVE" && hasPriorityPlayer(match))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-10">
          <div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Watch Tennis Today: Live Tennis Matches, TV Channels & Streaming Schedule
            </h1>

            <p className="text-zinc-300 text-lg leading-8 max-w-3xl mb-10">
              Find live tennis matches today, official TV broadcasters, streaming platforms,
              ATP and WTA schedules, Grand Slam coverage and country-based tennis viewing
              options.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <a
                href="/live-tennis"
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 transition-all"
              >
                Live Tennis Today
              </a>

              <a
                href="/tournament"
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 transition-all"
              >
                Tennis Tournaments
              </a>

              <a
                href="/best-ways-to-watch-tennis-online"
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 transition-all"
              >
                Best Ways to Watch Tennis Online
              </a>
            </div>

            <a
              href="/watch"
              className="inline-block mt-5 bg-green-500 text-black font-bold px-5 py-3 rounded-2xl hover:bg-green-400 transition-all"
            >
              📺 Where to watch
            </a>

            <a
              href="/tv-schedule"
              className="inline-block mt-5 ml-3 bg-zinc-800 text-white font-bold px-5 py-3 rounded-2xl hover:bg-zinc-700 transition-all"
            >
              📺 TV Schedule
            </a>

            <a
              href="/live-tennis"
              className="inline-block mt-5 ml-3 bg-red-500 text-white font-bold px-5 py-3 rounded-2xl hover:bg-red-400 transition-all"
            >
              🔴 Live Tennis
            </a>

            <div className="mb-12 mt-10">
              <h2 className="text-3xl font-black mb-5">
                🌍 Watch Tennis by Country
              </h2>

              <p className="text-zinc-400 mb-6 max-w-3xl">
                Find official tennis broadcasters, TV channels and streaming
                options by country. Check where to watch ATP, WTA and Grand Slam
                tennis legally.
              </p>

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
            </div>

            {livePlayers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-black mb-5">
                  🔴 Live Players Now
                </h2>

                <p className="text-zinc-400 mb-6 max-w-3xl">
                  Players currently competing in live tennis matches.
                  Follow their match pages, schedules and streaming information.
                </p>

                <div className="flex flex-wrap gap-3">
                  {livePlayers.map((player) => (
                    <a
                      key={player}
                      href={`/player/${playerSlug(player)}`}
                      className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-red-500 hover:text-red-400 transition-all"
                    >
                      🔴 {player}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {topLiveMatches.length > 0 && (
              <section className="mb-12">
                <h2 className="text-4xl font-black mb-6">
                  🔴 Top LIVE Tennis Matches
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {topLiveMatches.map((match) => (
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

                      <p className="text-zinc-400 mb-4">{match.tournament}</p>

                      <div className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black">
                        Watch Live →
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {matches.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-black mb-5">
                  🔥 Trending Tennis Matches
                </h2>

                <p className="text-zinc-400 mb-6 max-w-3xl">
                  Popular live and upcoming tennis matches with official streaming options.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {matches
                    .filter(
                      (match) =>
                        match.status === "LIVE" ||
                        match.category === "ATP" ||
                        match.category === "WTA"
                    )
                    .slice(0, 6)
                    .map((match) => (
                      <a
                        key={match.id}
                        href={`/watch/${matchSlug(match)}`}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 hover:border-red-500 transition-all"
                      >
                        <div className="flex justify-between mb-3">
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
              </div>
            )}

            {seoPlayers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-black mb-5">
                  ⭐ Popular Tennis Players
                </h2>

                <p className="text-zinc-400 mb-6 max-w-3xl">
                  Follow tennis players, live matches, schedules and streaming information.
                </p>

                <div className="flex flex-wrap gap-3">
                  {seoPlayers.map((player) => (
                    <a
                      key={player}
                      href={`/player/${playerSlug(player)}`}
                      className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all"
                    >
                      {player} live matches
                    </a>
                  ))}
                </div>
              </div>
            )}

            <p className="text-zinc-400 mt-3 text-lg">
              Live and upcoming tennis matches
            </p>

            <div className="mb-12 mt-10 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
              <h2 className="text-3xl font-black mb-4">
                🔔 Get Tennis Match Alerts
              </h2>

              <p className="text-zinc-400 mb-6 max-w-2xl">
                Get notified about live tennis matches, Grand Slams, ATP and WTA schedules,
                streaming updates and featured matches.
              </p>

              <form
                action="https://formspree.io/f/xeenwwbk"
                method="POST"
                className="flex flex-col md:flex-row gap-4"
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your email address"
                  className="flex-1 bg-black border border-zinc-700 rounded-2xl px-5 py-4 text-white"
                />

                <input
                  type="hidden"
                  name="source"
                  value="homepage-email-signup"
                />

                <button
                  type="submit"
                  className="bg-green-500 text-black px-6 py-4 rounded-2xl font-black hover:bg-green-400 transition-all"
                >
                  Notify Me
                </button>
              </form>
            </div>
          </div>

          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search player or tournament..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-green-500"
          />

          <div className="flex flex-wrap gap-3">
            {["ALL", "LIVE", "ATP", "WTA", "CHALLENGER", "ITF"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-3 rounded-2xl font-semibold transition-all ${
                  selectedFilter === filter
                    ? "bg-green-500 text-black"
                    : "bg-zinc-900 hover:bg-zinc-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 text-xl">Loading matches...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      match.status === "LIVE"
                        ? "bg-red-500 text-white"
                        : "bg-zinc-700 text-zinc-200"
                    }`}
                  >
                    {match.status}
                  </span>

                  <span className="text-sm text-zinc-500">{match.category}</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {splitPlayers(match.player1).map((player, index) => (
                      <span key={player} className="text-2xl font-bold">
                        <a
                          href={`/player/${playerSlug(player)}`}
                          className="hover:text-green-400 transition-colors"
                        >
                          {player}
                        </a>

                        {index < splitPlayers(match.player1).length - 1 && (
                          <span className="text-zinc-500"> /</span>
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="text-zinc-500 font-semibold">VS</div>

                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {splitPlayers(match.player2).map((player, index) => (
                      <span key={player} className="text-2xl font-bold">
                        <a
                          href={`/player/${playerSlug(player)}`}
                          className="hover:text-green-400 transition-colors"
                        >
                          {player}
                        </a>

                        {index < splitPlayers(match.player2).length - 1 && (
                          <span className="text-zinc-500"> /</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-zinc-500 text-sm">Tournament</p>

                    <a
                      href={`/tournament/${match.tournament
                        .toLowerCase()
                        .replace(/,/g, "")
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-|-$/g, "")}`}
                      className="font-semibold hover:text-green-400 transition-colors"
                    >
                      {match.tournament}
                    </a>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">Score</p>
                    <p className="font-semibold text-lg">{match.score}</p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">Start Time</p>
                    <p className="font-semibold">
                      {new Date(match.startTime).toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-zinc-500 text-sm mb-3">Where to watch</p>

                    {match.watchProviders.length > 0 ? (
                      <div className="space-y-3">
                        {match.watchProviders.map((provider) => (
                          <a
                            key={provider.name}
                            href={withTracking(provider.url, "homepage_match_card")}
                            target="_blank"
                            className="block rounded-2xl bg-green-500 text-black px-4 py-3 font-bold hover:bg-green-400 transition-all"
                          >
                            {provider.name}

                            <span className="block text-xs font-normal mt-1">
                              {provider.accessType} · {provider.verificationStatus}
                            </span>

                            <span className="block text-xs font-normal mt-1 opacity-80">
                              {provider.note}
                            </span>
                          </a>
                        ))}

                        <a
                          href={`/watch/${matchSlug(match)}`}
                          className="block mt-6 bg-white text-black text-center font-black px-5 py-4 rounded-2xl hover:bg-zinc-200 transition-all"
                        >
                          Open Match Page
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500">
                        No trusted official source found yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <section className="mt-16 rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
  <div className="max-w-3xl">
    <div className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400 mb-5">
      🌍 Tennis streaming tip
    </div>

    <h2 className="text-4xl font-black leading-tight mb-5">
      Watching tennis while traveling?
    </h2>

    <p className="text-zinc-300 text-lg leading-8 mb-8">
      Some ATP, WTA and Grand Slam streams may be unavailable depending on your
      country. A VPN can help you access your usual tennis streaming services
      more securely while abroad.
    </p>

    <div className="flex flex-wrap gap-4">
      <a
        href={affiliateLinks.nordvpn}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="inline-flex items-center rounded-2xl bg-green-500 px-6 py-4 text-lg font-black text-black hover:bg-green-400 transition-all"
      >
        Try NordVPN
      </a>

      <a
        href="/best-ways-to-watch-tennis-online"
        className="inline-flex items-center rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-zinc-500 transition-all"
      >
        Learn more
      </a>
    </div>

    <p className="mt-5 text-sm text-zinc-500">
      Affiliate disclosure: we may earn a commission if you purchase through
      links on this page.
    </p>
  </div>
</section>

        <section className="mt-16 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <h2 className="text-3xl font-black mb-5">
            Watch Tennis Today — Live Tennis Matches, Scores and TV Schedule
          </h2>

          <div className="text-zinc-300 space-y-5 leading-8">
            <p>
              Watch Tennis Today helps tennis fans find live tennis matches, official
              streaming options, TV channels and daily tennis schedules in one place.
              The site covers ATP, WTA, Grand Slam, Challenger and ITF matches with
              match status, start times, scores and tournament information.
            </p>

            <p>
              You can use Watch Tennis Today to check which tennis matches are live now,
              where to watch upcoming matches, and which broadcasters or streaming
              platforms may show tennis in your country. Coverage includes popular
              players, major tournaments, live match pages and country-based tennis
              viewing guides.
            </p>

            <p>
              The goal is to make tennis easier to follow by combining live match data,
              tournament schedules, player pages and official watch information for fans
              around the world.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}