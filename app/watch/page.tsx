"use client";

import { useEffect, useMemo, useState } from "react";

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

type WatchDirectoryItem = {
  name: string;
  url: string;
  coverage: string[];
  type: string;
  region: string;
  verification: string;
};

type TvProgramItem = {
  channel: string;
  platform: string;
  title: string;
  time: string;
  sourceName: string;
  sourceUrl: string;
  verificationStatus: string;
};

export default function WatchPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [directory, setDirectory] = useState<WatchDirectoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tvProgram, setTvProgram] = useState<TvProgramItem[]>([]);

  useEffect(() => {
    async function loadMatches() {
      const response = await fetch("/api/matches");
      const data = await response.json();

      setMatches(data);
      const directoryResponse = await fetch("/api/watch-directory");
const directoryData = await directoryResponse.json();

setDirectory(directoryData);
const tvProgramResponse = await fetch(
  "/api/tv-program"
);

const tvProgramData =
  await tvProgramResponse.json();

setTvProgram(tvProgramData);
      setLoading(false);
    }

    loadMatches();
  }, []);

  const groupedByProvider = useMemo(() => {
    const groups = new Map<string, {
      provider: WatchProvider;
      matches: Match[];
    }>();

    matches.forEach((match) => {
      match.watchProviders.forEach((provider) => {
        if (!groups.has(provider.name)) {
          groups.set(provider.name, {
            provider,
            matches: [],
          });
        }

        groups.get(provider.name)?.matches.push(match);
      });
    });

    return Array.from(groups.values());
  }, [matches]);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <a
          href="/"
          className="inline-block mb-8 text-zinc-400 hover:text-white"
        >
          ← Back to matches
        </a>

        <h1 className="text-5xl font-black mb-3">
          📺 Where to Watch Tennis
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Official and trusted tennis watching sources, grouped by platform.
        </p>

<section className="mb-10">
  <h2 className="text-3xl font-black mb-4">
    📺 Tennis TV Program
  </h2>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {tvProgram.map((item, index) => (
      <div
        key={`${item.channel}-${index}`}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 hover:border-green-500 transition-all"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-2xl font-black">
              {item.channel}
            </h3>

            <p className="text-zinc-400 text-sm">
              {item.platform}
            </p>
          </div>

          <span className="bg-green-500 text-black text-xs font-black rounded-full px-3 py-1">
            VERIFIED
          </span>
        </div>

        <p className="text-3xl font-black mb-3">
          {item.time}
        </p>

        <p className="text-zinc-200 mb-4 leading-relaxed">
          {item.title}
        </p>

        <a
          href={item.sourceUrl}
          target="_blank"
          className="text-green-400 text-sm font-bold hover:text-green-300"
        >
          Source: {item.sourceName}
        </a>
      </div>
    ))}
  </div>
</section>

<section className="mb-10">
  <h2 className="text-3xl font-black mb-4">
    Trusted watch directory
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {directory.map((item) => (
      <a
        key={item.name}
        href={item.url}
        target="_blank"
        className="block bg-zinc-900 border border-zinc-800 rounded-3xl p-5 hover:border-green-500 transition-all"
      >
        <h3 className="text-xl font-black mb-2">
          {item.name}
        </h3>

        <p className="text-sm text-zinc-400 mb-3">
          {item.type}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          {item.coverage.map((coverage) => (
            <span
              key={coverage}
              className="bg-zinc-800 rounded-full px-3 py-1 text-xs font-bold"
            >
              {coverage}
            </span>
          ))}
        </div>

        <p className="text-sm text-zinc-500">
          Region: {item.region}
        </p>

        <p className="text-sm text-green-400 mt-1">
          {item.verification}
        </p>
      </a>
    ))}
  </div>
</section>

        {loading ? (
          <p className="text-zinc-400 text-xl">
            Loading watch sources...
          </p>
        ) : groupedByProvider.length === 0 ? (
          <p className="text-zinc-400 text-xl">
            No trusted watch sources found for current matches.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groupedByProvider.map(({ provider, matches }) => {
              const liveMatches = matches.filter(
                (match) => match.status === "LIVE"
              );

              const upcomingMatches = matches.filter(
                (match) => match.status === "UPCOMING"
              );

              return (
                <section
                  key={provider.name}
                  className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-3xl font-black">
                        {provider.name}
                      </h2>

                      <p className="text-zinc-400 mt-2">
                        {provider.accessType} · {provider.verificationStatus}
                      </p>
                    </div>

                    <a
                      href={provider.url}
                      target="_blank"
                      className="bg-green-500 text-black font-bold rounded-2xl px-4 py-3 hover:bg-green-400 transition-all"
                    >
                      Open
                    </a>
                  </div>

                  <p className="text-sm text-zinc-400 mb-6">
                    {provider.note}
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-red-400 font-bold mb-3">
                        LIVE now
                      </h3>

                      {liveMatches.length > 0 ? (
                        <div className="space-y-3">
                          {liveMatches.map((match) => (
                            <div
                              key={match.id}
                              className="bg-black/40 rounded-2xl p-4"
                            >
                              <p className="font-bold">
                                {match.player1} vs {match.player2}
                              </p>

                              <p className="text-sm text-zinc-400">
                                {match.tournament}
                              </p>

                              <p className="text-sm text-zinc-300 mt-1">
                                Score: {match.score}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-500">
                          No live matches linked to this source right now.
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-blue-400 font-bold mb-3">
                        Upcoming
                      </h3>

                      {upcomingMatches.length > 0 ? (
                        <div className="space-y-3">
                          {upcomingMatches.slice(0, 6).map((match) => (
                            <div
                              key={match.id}
                              className="bg-black/40 rounded-2xl p-4"
                            >
                              <p className="font-bold">
                                {match.player1} vs {match.player2}
                              </p>

                              <p className="text-sm text-zinc-400">
                                {match.tournament}
                              </p>

                              <p className="text-sm text-zinc-300 mt-1">
                                {new Date(match.startTime).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-zinc-500">
                          No upcoming matches linked to this source.
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}