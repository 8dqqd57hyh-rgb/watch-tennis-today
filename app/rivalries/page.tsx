import Link from "next/link";
import type { Metadata } from "next";
import { rivalries } from "@/data/rivalries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis Rivalries & H2H Matchup Guides | Watch Tennis Today",
  description:
    "Explore the biggest ATP and WTA rivalry pages with live match links, TV schedule context, player pages and matchup storylines.",
  alternates: {
    canonical: "https://watchtennistoday.com/rivalries",
  },
};

export default function RivalriesPage() {
  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back home
        </Link>

        <section className="mt-8 mb-8 rounded-3xl border border-orange-500/40 bg-zinc-950 p-6 md:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-orange-400">
            Rivalry hub
          </p>
          <h1 className="mb-5 text-4xl font-black md:text-6xl">
            Tennis rivalry pages
          </h1>
          <p className="max-w-4xl text-lg leading-8 text-zinc-300">
            Find the biggest ATP and WTA matchup pages in one place: live match
            links, TV schedule context, player pages and quick storylines before
            the next blockbuster match.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rivalries.map((rivalry) => (
            <Link
              key={rivalry.slug}
              href={`/rivalries/${rivalry.slug}`}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-orange-500"
            >
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                Featured matchup
              </p>
              <h2 className="mb-4 text-2xl font-black">{rivalry.title}</h2>
              <p className="mb-5 leading-7 text-zinc-400">{rivalry.angle}</p>
              <span className="font-black text-orange-400">Open guide →</span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
