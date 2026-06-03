import type { Metadata } from "next";
import MyFeedClient from "./MyFeedClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "My Tennis Feed: Follow Matches, Players & Tournaments | Watch Tennis Today",
  description:
    "Build a private tennis feed with followed matches, saved players and tournaments. Track live matches, upcoming fixtures and recent tennis results in one place.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://watchtennistoday.com/my-feed" },
};

export default function MyFeedPage() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 text-zinc-950">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-[2rem] bg-black p-8 text-white shadow-sm">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Private retention hub</p>
          <h1 className="text-4xl font-black tracking-tight md:text-6xl">My Tennis Feed</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
            Save matches, players and tournaments once. Come back here for the tennis updates that matter first — live now, next matches and recent results.
          </p>
        </section>

        <MyFeedClient />
      </div>
    </main>
  );
}
