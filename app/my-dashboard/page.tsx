import type { Metadata } from "next";
import Link from "next/link";
import MyDashboardClient from "./MyDashboardClient";

export const metadata: Metadata = {
  title: "My Tennis Dashboard: Follow Players, Matches & Results | Watch Tennis Today",
  description:
    "Create a private tennis dashboard with followed players, live matches, next fixtures, recent results and quick links to legal tennis viewing guides.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://watchtennistoday.com/my-dashboard" },
};

export default function MyDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-6 flex flex-wrap gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <span className="font-bold text-zinc-900">My Tennis Dashboard</span>
      </nav>

      <section className="mb-8 overflow-hidden rounded-3xl bg-zinc-950 p-8 text-white shadow-sm">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Retention feature</p>
        <h1 className="mb-4 text-4xl font-black tracking-tight md:text-6xl">My Tennis Dashboard</h1>
        <p className="max-w-3xl text-lg leading-8 text-zinc-300">
          Follow your favorite tennis players and come back to one private page for live matches, next fixtures and recent results. No account required.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/my-players" className="rounded-2xl bg-white px-5 py-3 font-black text-black hover:bg-zinc-100">Manage My Players →</Link>
          <Link href="/tennis-watchlist-today" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-300">Open Watchlist →</Link>
        </div>
      </section>

      <MyDashboardClient />
    </main>
  );
}
