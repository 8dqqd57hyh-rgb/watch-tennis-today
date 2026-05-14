"use client";

import { useEffect, useState } from "react";
import { withTracking } from "@/app/lib/tracking";

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\s+/g, "-");
}

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

function readableCountry(country: string) {
  return country
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
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

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [nextGrandSlam, setNextGrandSlam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadMatches() {
      try {
        const matchesResponse = await fetch("/api/matches");
        const matchesData = await matchesResponse.json();

        setMatches(matchesData);

        const slamResponse = await fetch(
          "/api/next-grand-slam"
        );

        const slamData = await slamResponse.json();

        setNextGrandSlam(slamData);
      } catch (error) {
        console.error("Failed to load matches");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

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
  ].slice(0, 8);

  const startDate = nextGrandSlam?.startDate
  ? new Date(nextGrandSlam.startDate)
  : null;

const endDate = nextGrandSlam?.endDate
  ? new Date(nextGrandSlam.endDate)
  : null;

const daysUntilGrandSlam =
  startDate &&
  Number.isFinite(startDate.getTime())
    ? Math.ceil(
        (startDate.getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {nextGrandSlam && (
          <div className="mb-10 rounded-[2rem] bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 text-black shadow-2xl">
            <p className="uppercase text-sm font-black tracking-widest opacity-70 mb-3">
              Next Grand Slam
            </p>

           <h2 className="text-5xl font-black mb-4">
  <a
    href="/french-open-live-stream"
    className="hover:underline"
  >
    🏆 {nextGrandSlam.name}
  </a>
</h2>

            <div className="flex flex-wrap gap-3 mb-5">
              {nextGrandSlam.menSeason && (
                <div className="bg-black/10 rounded-full px-4 py-2 font-bold">
                  Men Singles
                </div>
              )}

              {nextGrandSlam.womenSeason && (
                <div className="bg-black/10 rounded-full px-4 py-2 font-bold">
                  Women Singles
                </div>
              )}
            </div>

            <p className="text-xl font-semibold mb-2">
  {startDate
    ? startDate.toLocaleDateString()
    : "Date coming soon"}

  {" — "}

  {endDate
    ? endDate.toLocaleDateString()
    : "Date coming soon"}
</p>

<p className="text-lg font-bold mb-6">
  {daysUntilGrandSlam !== null
    ? `Starts in ${daysUntilGrandSlam} days`
    : "Schedule update coming soon"}
</p>

            <div className="space-y-3">
              <a
                href="https://www.tennischannel.com/"
                target="_blank"
                className="block rounded-2xl bg-black text-white px-5 py-4 font-bold hover:scale-[1.02] transition-all"
              >
                Tennis Channel

                <span className="block text-sm opacity-70 mt-1">
                  Official Grand Slam broadcaster (region dependent)
                </span>
              </a>

              <a
                href="https://www.eurosport.com/tennis/"
                target="_blank"
                className="block rounded-2xl bg-black text-white px-5 py-4 font-bold hover:scale-[1.02] transition-all"
              >
                Eurosport

                <span className="block text-sm opacity-70 mt-1">
                  Official broadcaster in many European regions
                </span>
              </a>

              <a
                href="https://www.atptour.com/"
                target="_blank"
                className="block rounded-2xl bg-black text-white px-5 py-4 font-bold hover:scale-[1.02] transition-all"
              >
                Official Tournament Sources

                <span className="block text-sm opacity-70 mt-1">
                  Verify exact broadcaster by region
                </span>
              </a>
            </div>
          </div>
        )}

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

            <div className="mb-12">
  <h2 className="text-3xl font-black mb-5">
    ⭐ Popular Tennis Players
  </h2>

  <p className="text-zinc-400 mb-6 max-w-3xl">
    Follow popular tennis players, upcoming matches, live scores and official streaming information.
  </p>

  <div className="flex flex-wrap gap-3">
    {[
      ["Jannik Sinner", "sinner-jannik"],
      ["Carlos Alcaraz", "alcaraz-carlos"],
      ["Novak Djokovic", "djokovic-novak"],
      ["Iga Swiatek", "swiatek-iga"],
      ["Aryna Sabalenka", "sabalenka-aryna"],
      ["Coco Gauff", "gauff-coco"],
      ["Alexander Zverev", "zverev-alexander"],
      ["Daniil Medvedev", "medvedev-daniil"],
    ].map(([name, slug]) => (
      <a
        key={slug}
        href={`/player/${slug}`}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all"
      >
        {name} matches
      </a>
    ))}
  </div>
</div>

            <p className="text-zinc-400 mt-3 text-lg">
              Live and upcoming tennis matches
            </p>
          </div>

          <input
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Search player or tournament..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-green-500"
          />

          <div className="flex flex-wrap gap-3">
            {[
              "ALL",
              "LIVE",
              "ATP",
              "WTA",
              "CHALLENGER",
              "ITF",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() =>
                  setSelectedFilter(filter)
                }
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
          <div className="text-zinc-400 text-xl">
            Loading matches...
          </div>
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

                  <span className="text-sm text-zinc-500">
                    {match.category}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {splitPlayers(match.player1).map((player, index) => (
                        <span key={player} className="text-2xl font-bold">
                          <a
                            href={`/player/${playerSlug(player)}`}
                            className="hover:text-green-400 transition-colors"
                          >
                            {player}
                          </a>

                          {index <
                            splitPlayers(match.player1).length - 1 && (
                            <span className="text-zinc-500"> /</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-zinc-500 font-semibold">
                    VS
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1">
                      {splitPlayers(match.player2).map((player, index) => (
                        <span key={player} className="text-2xl font-bold">
                          <a
                            href={`/player/${playerSlug(player)}`}
                            className="hover:text-green-400 transition-colors"
                          >
                            {player}
                          </a>

                          {index <
                            splitPlayers(match.player2).length - 1 && (
                            <span className="text-zinc-500"> /</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-zinc-500 text-sm">
                      Tournament
                    </p>

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
                    <p className="text-zinc-500 text-sm">
                      Score
                    </p>

                    <p className="font-semibold text-lg">
                      {match.score}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">
                      Start Time
                    </p>

                    <p className="font-semibold">
                      {new Date(
                        match.startTime
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-zinc-500 text-sm mb-3">
                      Where to watch
                    </p>

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
                              {provider.accessType} ·{" "}
                              {provider.verificationStatus}
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
      </div>
    </main>
  );
}