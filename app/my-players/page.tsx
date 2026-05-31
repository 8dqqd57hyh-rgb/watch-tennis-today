import type { Metadata } from "next";
import Link from "next/link";
import MyPlayersClient from "./MyPlayersClient";

export const metadata: Metadata = {
  title: "My Players: Follow Tennis Players, Matches & Live Updates | Watch Tennis Today",
  description:
    "Create a private tennis dashboard with your followed ATP and WTA players, live matches, next matches and quick watch links.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://watchtennistoday.com/my-players",
  },
};

export default function MyPlayersPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <nav className="mb-6 flex flex-wrap gap-2 text-sm text-zinc-500">
        <Link href="/" className="hover:text-green-700">Home</Link>
        <span>/</span>
        <span className="font-bold text-zinc-900">My Players</span>
      </nav>

      <section className="mb-8 rounded-3xl bg-zinc-950 p-8 text-white shadow-sm">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-green-300">
          Fan retention feature
        </p>
        <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
          My Players
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-zinc-300">
          Follow your favorite tennis players and get a personalized match board with live
          matches, next fixtures and direct paths to legal viewing guides. No account required.
        </p>
      </section>

      <MyPlayersClient />
    </main>
  );
}
