"use client";

import { useMemo, useState } from "react";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  round?: string;
  score?: string;
  startTime: string | null;
};

function normalizeStatus(status?: string) {
  return String(status || "").toUpperCase();
}

export default function MatchDashboard({ matches }: { matches: Match[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return matches.filter((match) => {
      const text = `${match.player1} ${match.player2} ${match.tournament}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());

      if (filter === "ALL") return matchesQuery;

      return normalizeStatus(match.status) === filter && matchesQuery;
    });
  }, [matches, query, filter]);

  return (
    <section className="mb-8">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-sky-700">
            Real tennis data
          </p>
          <h2 className="text-3xl font-black text-neutral-950">
            Today’s matches
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {["ALL", "LIVE", "UPCOMING", "SUSPENDED"].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-2 text-sm font-black transition ${
                filter === value
                  ? "bg-neutral-950 text-white"
                  : "border bg-white text-neutral-800"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search player or tournament"
        className="mb-5 w-full rounded-2xl border bg-white px-5 py-4 text-sm font-medium outline-none focus:border-sky-400"
      />

      {filtered.length === 0 ? (
        <div className="rounded-3xl border bg-neutral-50 p-8 text-center">
          <h3 className="mb-2 text-xl font-black text-neutral-950">
            No matches found
          </h3>
          <p className="text-neutral-600">
            Try another player, tournament or status filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.slice(0, 20).map((match) => (
            <article
              key={match.id}
              className="rounded-3xl border bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-black text-sky-700">
                  {match.status || "TBD"}
                </span>

                <span className="text-xs font-bold text-neutral-500">
                  {match.category}
                </span>
              </div>

              <h3 className="mb-2 text-2xl font-black text-neutral-950">
                {match.player1} vs {match.player2}
              </h3>

              <p className="mb-3 text-sm font-bold text-neutral-500">
                {match.tournament}
              </p>

              {match.score ? (
                <p className="mb-3 text-lg font-black text-neutral-900">
                  {match.score}
                </p>
              ) : null}

              {match.round ? (
                <p className="mb-3 text-sm text-neutral-600">
                  Round: {match.round}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <a
                  href="/live-tennis"
                  className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-black text-white"
                >
                  Watch info
                </a>

                <a
                  href="/watch-tennis-live-today"
                  className="rounded-full border px-4 py-2 text-sm font-black"
                >
                  TV & streaming
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
