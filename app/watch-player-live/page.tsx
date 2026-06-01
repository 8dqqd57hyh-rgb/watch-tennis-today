import type { Metadata } from "next";
import Link from "next/link";
import { players } from "@/data/players";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Watch Tennis Players Live | ATP & WTA Live Streams",
  description:
    "Watch ATP and WTA tennis players live today with streaming information, schedules and live tennis coverage.",
};

export default function WatchPlayerLiveHubPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-green-400">
            ATP & WTA Live
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-7xl">
            Watch Tennis Players Live
          </h1>

          <p className="max-w-4xl text-lg leading-8 text-zinc-300">
            Find live ATP and WTA tennis player streams, schedules, next matches
            and official broadcast information for the biggest tennis stars.
          </p>
        </section>

        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(players).map(([slug, player]) => (
              <Link
                key={slug}
                href={`/watch-player-live/${slug}`}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-green-500"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {player.tour}
                  </span>

                  <span className="text-green-400 text-sm">
                    Watch Live →
                  </span>
                </div>

                <h2 className="text-2xl font-black">
                  {player.name}
                </h2>

                <p className="mt-4 leading-7 text-zinc-400">
                  Live tennis streams, schedules, TV coverage and next match
                  information.
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
