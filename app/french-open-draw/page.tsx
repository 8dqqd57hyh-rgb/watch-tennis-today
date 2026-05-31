import Link from "next/link";
import FrenchOpenDrawTracker from "@/app/components/FrenchOpenDrawTracker";
import FrenchOpenNextMatchesStrip from "@/app/components/FrenchOpenNextMatchesStrip";
import JsonLd from "@/app/components/JsonLd";
import FrenchOpenStreamingDecision from "@/app/components/FrenchOpenStreamingDecision";
import FrenchOpenWatchIntent from "@/app/components/FrenchOpenWatchIntent";

export const metadata = {
  title: "French Open Draw Tracker 2026 | Roland Garros Player Paths",
  description:
    "Track the French Open draw by player. Follow Roland Garros bracket paths, who advanced, who was eliminated, next opponents, possible matchups, live matches and results.",
  alternates: { canonical: "https://watchtennistoday.com/french-open-draw" },
};

const drawLinks = [
  ["French Open Live", "/french-open-live"],
  ["French Open Today", "/french-open-today"],
  ["Order of Play", "/french-open-order-of-play"],
  ["French Open Results", "/french-open-results"],
  ["TV Schedule", "/french-open-tv-schedule"],
  ["Where to Watch", "/where-to-watch-french-open"],
];

const trackerFeatures = [
  {
    title: "Follow one player’s path",
    text: "Instead of reading a full bracket, users can pick only players who are still alive in the draw and follow that exact route.",
  },
  {
    title: "See next and potential opponents",
    text: "The tracker separates completed, upcoming and potential matchups so fans quickly understand what matters next.",
  },
  {
    title: "Move users into money pages",
    text: "Each path links to live pages, tomorrow’s schedule, results and where-to-watch pages where affiliate blocks can convert.",
  },
];

export default function FrenchOpenDrawPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "French Open Draw Tracker 2026",
      description:
        "Roland Garros draw tracker for player paths, next opponents, possible matchups, results and streaming guide links.",
      url: "https://watchtennistoday.com/french-open-draw",
      hasPart: drawLinks.map(([label, href]) => ({
        "@type": "WebPage",
        name: label,
        url: `https://watchtennistoday.com${href}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the French Open draw tracker?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It is a player-focused Roland Garros draw page that helps fans follow completed rounds, next opponents and potential future matchups.",
          },
        },
        {
          "@type": "Question",
          name: "Can I follow a specific player through the Roland Garros draw?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The tracker is built around active player paths, so fans can follow top ATP and WTA players who are still in the tournament without reading the full bracket.",
          },
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <JsonLd data={jsonLd} />

      <div className="mx-auto max-w-7xl">
        <section className="mb-12 rounded-[2.5rem] border border-orange-500 bg-gradient-to-br from-orange-950/40 to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            🧩 DRAW TRACKER
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            French Open Draw Tracker:
            <br />
            Follow Player Paths
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            Track Roland Garros by player: who advanced, who was eliminated,
            next opponent slots, possible late-round matchups, results and live
            viewing links.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/french-open-live"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black transition-all hover:bg-orange-400"
            >
              Live Matches →
            </Link>

            <Link
              href="/french-open-results"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition-all hover:border-orange-500"
            >
              Results
            </Link>

            <Link
              href="/french-open-order-of-play"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition-all hover:border-orange-500"
            >
              Order of Play
            </Link>
          </div>
        </section>

        <FrenchOpenNextMatchesStrip />
        <FrenchOpenWatchIntent compact />
        <FrenchOpenDrawTracker />

        <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="mb-6 text-4xl font-black">
            🎾 Why this draw tracker helps fans
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {trackerFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-3xl border border-zinc-800 bg-black p-5"
              >
                <h3 className="mb-3 text-xl font-black">{feature.title}</h3>
                <p className="leading-7 text-zinc-400">{feature.text}</p>
              </div>
            ))}
          </div>
        </section>

        <FrenchOpenStreamingDecision compact />

        <section className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {drawLinks.map(([title, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-orange-500"
            >
              <h3 className="mb-3 text-xl font-black">{title}</h3>

              <p className="text-sm text-zinc-400">
                Roland Garros draw, matches, schedules and streaming guides.
              </p>
            </Link>
          ))}
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <h2 className="mb-5 text-3xl font-black">
            About the French Open draw tracker
          </h2>

          <div className="max-w-4xl space-y-5 text-zinc-300 leading-8">
            <p>
              The French Open draw shows the Roland Garros tournament path,
              including completed matches, possible matchups and upcoming rounds.
            </p>

            <p>
              Watch Tennis Today turns the draw into a player-focused tracker so
              fans can follow their favorite players without scanning the full
              bracket every day.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
