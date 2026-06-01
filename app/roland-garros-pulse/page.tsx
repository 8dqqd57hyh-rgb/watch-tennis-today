import Link from "next/link";
import RolandGarrosTournamentPulse from "@/app/components/RolandGarrosTournamentPulse";
import RolandGarrosPickemChallenge from "@/app/components/RolandGarrosPickemChallenge";
import FrenchOpenConversionCluster from "@/app/components/FrenchOpenConversionCluster";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Roland Garros Pulse Today | French Open Trending Players",
  description:
    "See the Roland Garros pulse today: live players, winners, upcoming French Open storylines and quick links to picks, results and order of play.",
};

export default function RolandGarrosPulsePage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2.5rem] border border-orange-500/50 bg-gradient-to-br from-orange-950/50 to-black p-8">
          <p className="mb-4 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            Daily French Open snapshot
          </p>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Roland Garros Pulse Today
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            Quickly catch up on the players to follow today: who is live, who advanced, and which French Open matches are coming next.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/french-open-today" className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black transition hover:bg-orange-400">
              See matches today →
            </Link>
            <Link href="/roland-garros-predictions" className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-orange-500">
              Make Pick’em picks
            </Link>
          </div>
        </section>

        <RolandGarrosTournamentPulse />
        <RolandGarrosPickemChallenge compact />
        <FrenchOpenConversionCluster compact title="More Roland Garros coverage" />
      </div>
    </main>
  );
}
