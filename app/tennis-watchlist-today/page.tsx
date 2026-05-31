import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tennis Watchlist Today: What Matches Should I Watch? | Watch Tennis Today",
  description:
    "Use a personal tennis watchlist to find the most important live and upcoming tennis matches today, including saved players and big tournament picks.",
  alternates: { canonical: "https://watchtennistoday.com/tennis-watchlist-today" },
  robots: { index: true, follow: true },
};

export default function TennisWatchlistTodayPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6 flex flex-wrap gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <span className="font-bold text-zinc-900">Tennis Watchlist Today</span>
      </nav>

      <section className="rounded-3xl bg-zinc-950 p-8 text-white shadow-sm">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Smart tennis picks</p>
        <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">Tennis Watchlist Today</h1>
        <p className="max-w-3xl text-lg leading-8 text-zinc-300">
          The tennis calendar can be noisy. The watchlist helps fans quickly choose what to watch by prioritizing live matches, saved players, Grand Slam matches, ATP/WTA matches and late-round fixtures.
        </p>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-black text-zinc-950">1. Save players</h2>
          <p className="leading-7 text-zinc-600">Follow players from their player pages or from My Tournament. Saved players stay private in your browser.</p>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-black text-zinc-950">2. Check the homepage</h2>
          <p className="leading-7 text-zinc-600">The Tennis Watchlist block ranks today’s matches so you do not need to scan every court manually.</p>
        </div>
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-2xl font-black text-zinc-950">3. Open My Tournament</h2>
          <p className="leading-7 text-zinc-600">Use My Tournament for a focused dashboard with only your saved players’ live matches, next matches and recent results.</p>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="mb-3 text-2xl font-black text-zinc-950">Best next step</h2>
        <p className="mb-5 max-w-3xl leading-7 text-zinc-700">
          Start with a few players you actually care about. The more precise your saved list is, the more useful the watchlist becomes during busy tennis days.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/my-tournament" className="rounded-2xl bg-black px-5 py-3 font-black text-white hover:bg-zinc-800">Open My Tournament →</Link>
          <Link href="/players" className="rounded-2xl border border-zinc-300 bg-white px-5 py-3 font-black text-zinc-900 hover:border-emerald-400">Choose players →</Link>
        </div>
      </section>
    </main>
  );
}
