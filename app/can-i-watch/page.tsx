import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { canonicalUrl } from "@/app/lib/technicalSeo";
import { getBroadcastCountryOptions } from "@/src/data/tennisBroadcasts";
import CanIWatchClient from "./CanIWatchClient";

export const metadata: Metadata = {
  title: "Can I Watch This Tennis Match? | Country & Broadcaster Finder",
  description: "Choose a country and player or tournament to find official tennis broadcasters, streaming services, free/paid notes and verification links.",
  alternates: { canonical: canonicalUrl("/can-i-watch") },
  openGraph: {
    title: "Can I Watch This Tennis Match?",
    description: "Find tennis viewing options by country, player and tournament.",
    url: canonicalUrl("/can-i-watch"),
    type: "website",
  },
};

const faqItems = [
  {
    question: "Does Watch Tennis Today stream tennis matches?",
    answer: "No. Watch Tennis Today does not host live streams or bypass paywalls. It helps fans find official broadcaster and tournament sources.",
  },
  {
    question: "Why should I verify before subscribing?",
    answer: "Tennis rights can vary by country, year, court, tournament and package. Always check the official broadcaster or tournament page before paying.",
  },
  {
    question: "Can I search by player?",
    answer: "Yes. For major ATP and WTA players, the finder maps the player to the relevant tour coverage and shows official viewing routes stored for your country.",
  },
];

export default function CanIWatchPage() {
  const pageUrl = canonicalUrl("/can-i-watch");
  const countries = getBroadcastCountryOptions();
  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Watch Tennis Today",
    url: canonicalUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${pageUrl}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <BreadcrumbSchema items={[{ name: "Home", url: canonicalUrl("/") }, { name: "Can I Watch?", url: pageUrl }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-7xl">
        <section className="rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-950/50 to-black p-8 md:p-10">
          <p className="mb-4 inline-flex rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Can I Watch? Engine
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">Can I watch this tennis match?</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Select your country and a tournament or player to find official tennis broadcasters, streaming services, free/paid notes, confidence level and source links.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/broadcasters" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">Browse broadcasters</Link>
            <Link href="/tennis-streaming-service-picker" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">Streaming picker</Link>
          </div>
        </section>

        <div className="mt-8">
          <CanIWatchClient countries={countries} />
        </div>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">How to use this finder</h2>
          <p className="mt-4 max-w-4xl leading-7 text-zinc-300">
            Start with the tournament because rights are usually event-based. Player searches are useful for quick checks, but exact availability can still depend on the tournament, court feed and local provider package.
          </p>
        </section>
      </div>
    </main>
  );
}
