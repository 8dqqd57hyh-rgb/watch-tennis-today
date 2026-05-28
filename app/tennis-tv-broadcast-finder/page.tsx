import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import BroadcastFinder from "@/app/components/BroadcastFinder";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";
import { broadcastCountries } from "@/data/broadcastFinder";

export const metadata: Metadata = {
  title: "Tennis TV Broadcast Finder | ATP, WTA & Grand Slam Channels by Country",
  description:
    "Find where to watch tennis by country, including ATP, WTA and Grand Slam broadcaster routes, official TV directories and safe viewing guides for travelers.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-tv-broadcast-finder",
  },
};

const faq = [
  {
    question: "What is the best way to find where tennis is on TV today?",
    answer:
      "Start with your country guide, then verify the match through official ATP, WTA or tournament broadcaster directories because rights vary by event.",
  },
  {
    question: "Does Tennis TV show Grand Slam matches?",
    answer:
      "Grand Slam rights are separate from regular ATP tour coverage. For Roland Garros, Wimbledon, the US Open and Australian Open, check the tournament broadcaster page for your country.",
  },
  {
    question: "Can I watch my usual tennis subscription while traveling?",
    answer:
      "It depends on the broadcaster's terms and regional rights. Check your existing subscription rules before relying on it abroad.",
  },
];

export default function TennisTvBroadcastFinderPage() {
  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <Script
        id="broadcast-finder-faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm font-bold text-zinc-400 hover:text-white">
          ← Back to home
        </Link>

        <section className="my-10 rounded-[2.5rem] border border-sky-500/40 bg-gradient-to-br from-sky-950/40 to-black p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-sky-300">
            Country viewing tool
          </p>
          <h1 className="mb-5 text-5xl font-black leading-tight md:text-7xl">
            Tennis TV Broadcast Finder
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            Find the most useful official routes for watching ATP, WTA and Grand Slam tennis by country. This page is built for fans who search “what channel is tennis on today?” and need a fast answer without illegal streams.
          </p>
        </section>

        <BroadcastFinder />

        <section className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {broadcastCountries.map((country) => (
            <Link
              key={country.slug}
              href={`/watch-tennis-in/${country.slug}`}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 hover:border-sky-400"
            >
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                Country guide
              </p>
              <h2 className="mb-3 text-2xl font-black text-white">{country.country}</h2>
              <p className="text-sm leading-6 text-zinc-400">
                ATP, WTA, Grand Slam and travel viewing notes for {country.country}.
              </p>
            </Link>
          ))}
        </section>

        <RevenueConversionPanel context="homepage" />

        <section className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-3xl font-black">Why broadcast rights are confusing</h2>
          <div className="space-y-4 leading-8 text-zinc-300">
            <p>
              Tennis rights are split between ATP, WTA, Challenger events and Grand Slam tournaments. A platform that shows one tour may not show another tournament.
            </p>
            <p>
              That is why this finder links users to country guides and official broadcaster directories instead of pretending that one streaming service covers everything.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-zinc-800 bg-black/50 p-6">
          <h2 className="mb-5 text-3xl font-black">FAQ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {faq.map((item) => (
              <article key={item.question} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                <h3 className="mb-3 text-xl font-black text-white">{item.question}</h3>
                <p className="text-sm leading-6 text-zinc-400">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <StreamingLinksGrid />
      </div>
    </main>
  );
}
