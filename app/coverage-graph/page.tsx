import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/app/lib/technicalSeo";

export const metadata: Metadata = {
  title: "Tennis Coverage Graph | Watch Tennis Today",
  description:
    "How Watch Tennis Today connects matches, tournaments, countries and broadcasters into one reusable viewing engine.",
  alternates: { canonical: canonicalUrl("/coverage-graph") },
};

const graphItems = [
  ["Match", "Players, start time, court, round, surface and live status."],
  ["Tournament", "The rights container used to map the match to a coverage query."],
  ["Country", "The viewer context that decides which broadcaster rows matter."],
  ["Broadcaster", "Official TV or streaming service rows with price, confidence and source links."],
  ["Reminder", "Future retention layer for player alerts, calendars and daily email."],
];

export default function CoverageGraphPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Tennis Coverage Graph",
    url: canonicalUrl("/coverage-graph"),
    description:
      "A product explanation page for the Watch Tennis Today coverage graph: match, tournament, country, broadcaster and reminder nodes.",
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="mx-auto max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Product engine</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Tennis Coverage Graph</h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-300">
          Watch Tennis Today now uses one viewing model to connect a match to its tournament, country-specific broadcaster rows, streaming notes and future reminder flows.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {graphItems.map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-zinc-800 bg-black p-4">
              <h2 className="font-black text-white">{title}</h2>
              <p className="mt-2 text-sm text-zinc-400">{body}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/tennis-tv-schedule-today" className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-black text-black">
            Open today&apos;s TV coverage
          </Link>
          <Link href="/can-i-watch" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black text-white">
            Use Can I Watch?
          </Link>
          <Link href="/broadcasters" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black text-white">
            Browse broadcasters
          </Link>
        </div>
      </section>
    </main>
  );
}
