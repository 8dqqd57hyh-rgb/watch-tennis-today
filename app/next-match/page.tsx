import type { Metadata } from "next";
import Link from "next/link";
import { players } from "@/data/players";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import VpnPromo from "@/app/components/VpnPromo";
import AdSlot from "@/app/components/AdSlot";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tennis Next Matches Today | ATP & WTA Schedule",
  description:
    "Find upcoming ATP and WTA tennis matches, player schedules, live stream information and today's next tennis matches.",
  alternates: {
    canonical: "https://watchtennistoday.com/next-match",
  },
  openGraph: {
    title: "Tennis Next Matches Today",
    description:
      "Upcoming ATP and WTA tennis matches, schedules and streaming information.",
    url: "https://watchtennistoday.com/next-match",
    siteName: "Watch Tennis Today",
    type: "website",
  },
};

const featuredPlayers = [
  "jannik-sinner",
  "carlos-alcaraz",
  "novak-djokovic",
  "alexander-zverev",
  "daniil-medvedev",
  "holger-rune",
  "iga-swiatek",
  "aryna-sabalenka",
  "coco-gauff",
  "elena-rybakina",
];

export default function NextMatchHubPage() {
  const popularPlayers = featuredPlayers
    .map((slug) => ({
      slug,
      player: players[slug as keyof typeof players],
    }))
    .filter((item) => item.player);

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-green-400">
            ATP & WTA schedule
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-7xl">
            Tennis Next Matches Today
          </h1>

          <p className="max-w-4xl text-lg leading-8 text-zinc-300">
            Find upcoming ATP and WTA tennis matches, next match schedules,
            tournament information, live streaming details and player updates
            for today&apos;s biggest tennis events.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/atp-live-today"
              className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400"
            >
              ATP Live Today
            </Link>

            <Link
              href="/wta-live-today"
              className="rounded-2xl border border-zinc-700 px-6 py-4 font-black text-white hover:border-green-500"
            >
              WTA Live Today
            </Link>

            <Link
              href="/live-tennis"
              className="rounded-2xl border border-zinc-700 px-6 py-4 font-black text-white hover:border-green-500"
            >
              Live Tennis Scores
            </Link>
          </div>
        </section>

        <AdSlot label="Advertisement" />

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-green-400">
                Popular players
              </p>

              <h2 className="text-3xl font-black md:text-4xl">
                Upcoming Tennis Matches
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularPlayers.map(({ slug, player }) => (
              <Link
                key={slug}
                href={`/next-match/${slug}`}
                className="group rounded-3xl border border-zinc-800 bg-black p-6 transition hover:border-green-500"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {player.tour}
                  </span>

                  <span className="text-sm text-green-400">Next Match →</span>
                </div>

                <h3 className="text-2xl font-black transition group-hover:text-green-400">
                  {player.name}
                </h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  Schedule, opponent, live streaming information and tournament
                  updates.
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <h2 className="mb-5 text-3xl font-black">Where to Watch Tennis Next Matches</h2>

          <p className="mb-6 max-w-4xl leading-8 text-zinc-300">
            ATP and WTA broadcasting rights depend on your location and the
            tournament. Official tennis streams may be available through sports
            broadcasters, streaming platforms and tournament partners in your
            country.
          </p>

          <StreamingLinksGrid />
        </section>

        <VpnPromo
          title="Watching tennis while traveling?"
          text="Some ATP and WTA broadcasts are geo-restricted. A VPN may help you safely access your legal streaming subscriptions while abroad."
        />

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <h2 className="mb-6 text-3xl font-black">More Tennis Pages</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/french-open-results"
              className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
            >
              <h3 className="text-xl font-black">French Open Results</h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Latest Roland Garros scores, match results and updates.
              </p>
            </Link>

            <Link
              href="/french-open-order-of-play"
              className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
            >
              <h3 className="text-xl font-black">French Open Order of Play</h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Match schedule, court assignments and session times.
              </p>
            </Link>

            <Link
              href="/watch-tennis-live-today"
              className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
            >
              <h3 className="text-xl font-black">Watch Tennis Live Today</h3>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                ATP and WTA live streams, schedules and TV coverage.
              </p>
            </Link>
          </div>
        </section>

        <RelatedMoneyLinks />

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <h2 className="mb-6 text-3xl font-black">Tennis Next Matches FAQ</h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-xl font-black">Where can I find upcoming tennis matches?</h3>

              <p className="leading-7 text-zinc-400">
                You can find ATP and WTA upcoming matches through tournament
                schedules, official tours, live score platforms and player next
                match pages.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-black">How often are tennis schedules updated?</h3>

              <p className="leading-7 text-zinc-400">
                Tennis schedules can change throughout the day because of rain,
                delayed matches, withdrawals and tournament decisions.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-black">Where can I watch ATP and WTA matches live?</h3>

              <p className="leading-7 text-zinc-400">
                Official ATP and WTA streams are available through broadcasters
                and streaming providers depending on your country.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
