import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { canonicalUrl } from "@/app/lib/technicalSeo";
import {
  TENNIS_BROADCAST_LAST_VERIFIED,
  getUniqueBroadcasters,
} from "@/src/data/tennisBroadcasts";

export const metadata: Metadata = {
  title: "Tennis Broadcasters | Official TV & Streaming Services by Country",
  description:
    "Browse tennis broadcasters and streaming services by country, tournament coverage, free or paid status, source confidence and last verified date.",
  alternates: {
    canonical: canonicalUrl("/broadcasters"),
  },
  openGraph: {
    title: "Tennis Broadcasters",
    description:
      "A source-backed directory of tennis broadcasters and streaming services for ATP, WTA and Grand Slam coverage.",
    url: canonicalUrl("/broadcasters"),
    siteName: "Watch Tennis Today",
    type: "website",
  },
};

function confidenceLabel(levels: string[]) {
  if (levels.includes("needs_check")) return "Needs checks";
  if (levels.includes("partial")) return "Partial";
  return "Confirmed rows";
}

export default function BroadcastersPage() {
  const broadcasters = getUniqueBroadcasters();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does Watch Tennis Today stream tennis matches?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Watch Tennis Today does not host or stream tennis matches. It points fans to official broadcaster and tournament sources so they can verify legal viewing options.",
        },
      },
      {
        "@type": "Question",
        name: "Can one broadcaster show every tennis match?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Usually no. Grand Slams, ATP Tour, WTA Tour and team competitions can have separate broadcast rights by country and event.",
        },
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tennis Broadcasters",
    url: canonicalUrl("/broadcasters"),
    description: "Directory of tennis broadcasters and streaming services by country and tournament coverage.",
    isPartOf: {
      "@type": "WebSite",
      name: "Watch Tennis Today",
      url: canonicalUrl("/"),
    },
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Broadcasters", url: canonicalUrl("/broadcasters") },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="mx-auto max-w-7xl">
        <Link href="/tennis-tv-broadcast-finder" className="text-sm font-bold text-zinc-400 hover:text-white">
          ← Back to Broadcast Finder
        </Link>

        <section className="mt-8 rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-black p-8 md:p-10">
          <p className="mb-4 inline-flex rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Broadcaster intelligence
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">Tennis Broadcasters</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Browse official tennis broadcaster routes by service, country and tournament. Use these pages as a starting point, then verify match-week availability with the linked official source before paying.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-400">
            <span>{broadcasters.length} broadcaster/service pages</span>
            <span>Database last verified: {TENNIS_BROADCAST_LAST_VERIFIED}</span>
            <span>Watch Tennis Today does not stream matches.</span>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Coverage map</p>
            <h2 className="mt-2 text-2xl font-black">Countries + tournaments</h2>
            <p className="mt-3 leading-7 text-zinc-400">Each broadcaster page groups the countries and tournament categories stored in the database.</p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Commercial checks</p>
            <h2 className="mt-2 text-2xl font-black">Free or paid</h2>
            <p className="mt-3 leading-7 text-zinc-400">Price rows are shown only when stored; otherwise the page tells users to check official checkout pages.</p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Editorial safety</p>
            <h2 className="mt-2 text-2xl font-black">No fake claims</h2>
            <p className="mt-3 leading-7 text-zinc-400">Uncertain rows are labelled partial or needs-check instead of pretending coverage is guaranteed.</p>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {broadcasters.map((broadcaster) => (
            <Link
              key={broadcaster.slug}
              href={`/broadcaster/${broadcaster.slug}`}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-emerald-400 hover:bg-zinc-900"
            >
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
                {confidenceLabel(broadcaster.confidenceLevels)}
              </p>
              <h2 className="text-2xl font-black text-white">{broadcaster.name}</h2>
              <dl className="mt-5 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
                <div>
                  <dt className="font-black text-zinc-500">Countries</dt>
                  <dd className="mt-1 font-bold text-white">{broadcaster.countryNames.length}</dd>
                </div>
                <div>
                  <dt className="font-black text-zinc-500">Tournaments</dt>
                  <dd className="mt-1 font-bold text-white">{broadcaster.tournamentNames.length}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-black text-zinc-500">Price status</dt>
                  <dd className="mt-1">{broadcaster.priceSummary}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-black text-zinc-500">Last verified</dt>
                  <dd className="mt-1">{broadcaster.lastVerified}</dd>
                </div>
              </dl>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
