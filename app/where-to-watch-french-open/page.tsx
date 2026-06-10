import FrenchOpenCountryGuides, { frenchOpenCountries } from "@/app/components/FrenchOpenCountryGuides";
import FrenchOpenConversionCluster from "@/app/components/FrenchOpenConversionCluster";
import JsonLd from "@/app/components/JsonLd";
import Link from "next/link";
import FrenchOpenStreamingDecision from "@/app/components/FrenchOpenStreamingDecision";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Where to Watch French Open 2026 by Country | Roland Garros TV & Streaming",
  description:
    "Find where to watch the French Open by country, including Roland Garros TV channels, streaming services, legal viewing notes and daily schedule links.",
  alternates: { canonical: "https://watchtennistoday.com/where-to-watch-french-open" },
};

const relatedLinks = [
  ["French Open live", "/french-open"],
  ["Watch online", "/watch-french-open-online"],
  ["TV schedule", "/where-to-watch-french-open"],
  ["French Open today", "/french-open"],
  ["Order of play", "/french-open-order-of-play"],
  ["Results", "/french-open-results"],
];

export default function WhereToWatchFrenchOpenPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Where to Watch French Open by Country",
      description:
        "Country-by-country Roland Garros viewing guide with official broadcasters and streaming options.",
      url: "https://watchtennistoday.com/where-to-watch-french-open",
      hasPart: frenchOpenCountries.map((item) => ({
        "@type": "WebPage",
        name: `How to watch French Open in ${item.country}`,
        url: `https://watchtennistoday.com${item.guideHref}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "French Open country broadcasters",
      itemListElement: frenchOpenCountries.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${item.country}: ${item.channels}`,
        url: `https://watchtennistoday.com/where-to-watch-french-open#${item.id}`,
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2.5rem] border border-orange-500/50 bg-gradient-to-br from-orange-950/50 to-black p-8">
          <p className="mb-4 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            Where to watch
          </p>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Where to Watch French Open by Country
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            Find legal Roland Garros broadcasters by country, then jump to today’s matches,
            tomorrow’s schedule and the French Open TV guide before the session starts.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#countries"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black transition hover:bg-orange-400"
            >
              View countries →
            </a>
            <Link
              href="/where-to-watch-french-open"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-orange-500"
            >
              TV schedule
            </Link>
            <Link
              href="/best-vpn-for-roland-garros"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-orange-500"
            >
              VPN guide
            </Link>
          </div>
        </section>

        <FrenchOpenStreamingDecision />
        <FrenchOpenCountryGuides />
        <FrenchOpenConversionCluster compact title="Keep following Roland Garros" />

        <section className="mb-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {relatedLinks.map(([title, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-orange-500"
            >
              <h3 className="mb-3 text-xl font-black">{title}</h3>
              <p className="text-sm text-zinc-400">
                Roland Garros schedules, streams and match updates.
              </p>
            </Link>
          ))}
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <h2 className="mb-5 text-3xl font-black">About French Open streaming by country</h2>
          <div className="max-w-4xl space-y-5 leading-8 text-zinc-300">
            <p>
              French Open streaming availability depends on official broadcast rights in each country.
              Tennis fans should check local TV channels and licensed streaming services for Roland Garros coverage.
            </p>
            <p>
              Watch Tennis Today does not host or link to unauthorized streams. The goal is to help fans
              find official broadcasters, daily schedules and practical viewing notes faster.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
