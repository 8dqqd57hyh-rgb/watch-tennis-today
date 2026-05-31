import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Spoiler-Free Tennis Scores | Check Matches Without Results",
  description:
    "Use Watch Tennis Today's spoiler-free tennis mode to check match times, players and official viewing options without seeing scores first.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-spoiler-free-scores",
  },
};

export default function SpoilerFreeScoresPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link href="/today" className="text-zinc-400 hover:text-white">
          ← Tennis today
        </Link>

        <section className="mt-10 rounded-[2.5rem] border border-yellow-500/30 bg-gradient-to-br from-yellow-950/20 via-black to-zinc-950 p-8 md:p-10">
          <p className="mb-4 inline-flex rounded-full bg-yellow-300 px-4 py-2 text-sm font-black text-black">
            Spoiler-free tennis
          </p>
          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Check tennis matches without seeing the score first
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            Missed a match but still want to watch it later? Spoiler-free mode hides scores on the daily tennis page, so you can check start times, players and official watch links without accidentally seeing the result.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/today" className="rounded-2xl bg-yellow-300 px-6 py-4 font-black text-black hover:bg-yellow-200">
              Open tennis today →
            </Link>
            <Link href="/tennis-results-today" className="rounded-2xl border border-zinc-700 px-6 py-4 font-bold hover:border-yellow-300 hover:text-yellow-200">
              See results instead →
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["1", "Open the Tennis Today page"],
            ["2", "Turn on Spoiler-free mode"],
            ["3", "Choose a match without seeing the score"],
          ].map(([number, text]) => (
            <div key={number} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-300 text-xl font-black text-black">
                {number}
              </div>
              <h2 className="text-2xl font-black">{text}</h2>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="mb-4 text-3xl font-black">Why this helps tennis fans</h2>
          <p className="leading-8 text-zinc-300">
            Tennis fans often follow matches across different time zones. A spoiler-free schedule is useful when you want to watch a replay, follow a favorite player later, or check official streaming options without learning the final result too early.
          </p>
        </section>
      </div>
    </main>
  );
}
