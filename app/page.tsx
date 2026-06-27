import type { Metadata } from "next";
import Link from "next/link";
import HomepageMatchExplorer from "@/app/components/HomepageMatchExplorer";
import HomepageWimbledonBanner from "@/app/components/HomepageWimbledonBanner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis Matches Today | Live Scores, Schedule and Where to Watch",
  description:
    "Find today's live and upcoming tennis matches, scores, start times, tournament context and official viewing links for ATP, WTA, Challenger, ITF and Grand Slam tennis.",
  alternates: {
    canonical: "https://watchtennistoday.com",
  },
  openGraph: {
    title: "Tennis Matches Today | Watch Tennis Today",
    description:
      "Search live and upcoming ATP, WTA, Challenger, ITF and Grand Slam matches with scores, times and legal viewing routes.",
    url: "https://watchtennistoday.com",
    type: "website",
  },
};

const quickLinks = [
  { href: "/today", label: "Today schedule" },
  { href: "/tomorrow", label: "Tomorrow" },
  { href: "/players", label: "Players" },
  { href: "/tournament", label: "Tournaments" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black p-4 text-white md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
              Watch Tennis Today
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
              Tennis matches today
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
              Search live and upcoming ATP, WTA, Challenger and ITF matches.
              Open a match for score, time and official viewing info.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            <Link href="/live-tennis" className="rounded-full bg-green-500 px-4 py-2 text-black hover:bg-green-400">
              Live tennis
            </Link>
            <Link href="/tennis-on-tv-today" className="rounded-full border border-zinc-800 px-4 py-2 text-zinc-200 hover:border-green-500">
              TV schedule
            </Link>
          </div>
        </header>

        <HomepageWimbledonBanner />

        <HomepageMatchExplorer />

        <section aria-label="Popular tennis planning pages" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-black hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
            >
              {link.label}
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
