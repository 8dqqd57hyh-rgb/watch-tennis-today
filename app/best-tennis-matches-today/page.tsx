import type { Metadata } from "next";
import Link from "next/link";
import BestMatchesTodayEngine from "@/app/components/BestMatchesTodayEngine";
import MustWatchMatchesToday from "@/app/components/MustWatchMatchesToday";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";
import { getServerMatches } from "@/app/lib/serverMatches";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Best Tennis Matches Today | Live ATP, WTA & Grand Slam Picks",
  description:
    "See the best tennis matches to watch today, including live ATP, WTA and Grand Slam matches, star players, H2H pages and legal streaming guides.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://watchtennistoday.com/best-tennis-matches-today",
  },
};

type WatchProvider = {
  name: string;
  url: string;
  accessType?: string;
  verificationStatus?: string;
  note?: string;
};

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score?: string;
  startTime?: string;
  watchProviders?: WatchProvider[];
  round?: string;
};

async function getMatches(): Promise<Match[]> {
  return (await getServerMatches(60)) as Match[];
}

export default async function BestTennisMatchesTodayPage() {
  const matches = await getMatches();

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm font-bold text-zinc-400 hover:text-white">
          ← Back to home
        </Link>

        <section className="my-10 rounded-[2.5rem] border border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/40 to-black p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-fuchsia-300">
            Daily tennis discovery
          </p>
          <h1 className="mb-5 text-5xl font-black leading-tight md:text-7xl">
            Best Tennis Matches Today
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            A daily ranked guide to the most useful tennis matches to open first:
            live matches, star players, ATP/WTA action, Grand Slam context,
            H2H pages and safe legal viewing routes.
          </p>
        </section>

        <MustWatchMatchesToday matches={matches} />

        <BestMatchesTodayEngine matches={matches} />

        <RevenueConversionPanel context="homepage" />

        <StreamingLinksGrid />

        <section className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-3xl font-black">How we rank today’s matches</h2>
          <div className="space-y-4 leading-8 text-zinc-300">
            <p>
              The page prioritizes matches that are live, involve highly followed ATP or WTA players,
              belong to Grand Slam tournaments, or are scheduled for important rounds such as finals
              and semifinals.
            </p>
            <p>
              Watch Tennis Today does not stream matches. The goal is to help fans discover which match
              to follow first and then check official broadcasters, tournament pages or legal streaming services.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
