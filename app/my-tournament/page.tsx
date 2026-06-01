import type { Metadata } from "next";
import Link from "next/link";
import MyTournamentClient from "./MyTournamentClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "My Tournament: Personal Tennis Dashboard | Watch Tennis Today",
  description:
    "Build a private tennis tournament dashboard with your favorite players, live matches, next matches and recent results.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://watchtennistoday.com/my-tournament" },
};

export default function MyTournamentPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 flex flex-wrap gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <span className="font-bold text-zinc-900">My Tournament</span>
      </nav>

      <section className="mb-8 rounded-3xl bg-zinc-950 p-8 text-white shadow-sm">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Personal tennis hub</p>
        <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">My Tournament</h1>
        <p className="max-w-3xl text-lg leading-8 text-zinc-300">
          Save favorite players and turn Watch Tennis Today into your own tournament dashboard: live now, next matches and recent results in one place.
        </p>
      </section>

      <MyTournamentClient />
    </main>
  );
}
