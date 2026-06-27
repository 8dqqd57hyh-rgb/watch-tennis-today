import type { Metadata } from "next";
import Link from "next/link";
import { canonicalUrl } from "@/app/lib/technicalSeo";
import { getServerMatchesWindow } from "@/app/lib/serverMatches";
import { buildTodayCoverageGraph, getCoverageGraphStats } from "@/src/data/coverageGraph";
import { formatBroadcastPrice } from "@/src/data/tennisBroadcasts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Today's Tennis TV Schedule | Matches, Channels & Streaming Routes",
  description:
    "See today&apos;s tennis matches with country-aware broadcaster and streaming route checks powered by the Watch Tennis Today coverage graph.",
  alternates: { canonical: canonicalUrl("/tennis-tv-schedule-today") },
  openGraph: {
    title: "Today&apos;s Tennis TV Schedule",
    description: "Daily tennis TV coverage with matches, broadcasters, streaming services and verification notes.",
    url: canonicalUrl("/tennis-tv-schedule-today"),
    type: "website",
  },
};

function formatTime(value: Date | null) {
  if (!value) return "TBC";
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(value);
}

export default async function TodaysTennisTvSchedulePage() {
  const matches = await getServerMatchesWindow({
    includeFinished: false,
    daysBack: 0,
    daysForward: 1,
    noStore: true,
    timeoutMs: 7000,
  });
  const nodes = buildTodayCoverageGraph(matches, "USA").slice(0, 40);
  const stats = getCoverageGraphStats(nodes);

  const faq = [
    {
      question: "Does Watch Tennis Today stream live tennis?",
      answer: "No. Watch Tennis Today does not host streams. It helps users find official broadcaster and streaming routes.",
    },
    {
      question: "Why can coverage vary by country?",
      answer: "Tennis broadcast rights are sold by territory, tournament and sometimes court/session. Always confirm the exact match on the provider site before paying.",
    },
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Today's Tennis TV Schedule",
      url: canonicalUrl("/tennis-tv-schedule-today"),
      description: metadata.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Live coverage engine</p>
        <h1 className="mt-3 text-4xl font-black md:text-6xl">Today&apos;s Tennis TV Schedule</h1>
        <p className="mt-4 max-w-3xl text-lg text-zinc-300">
          A match-first TV schedule that connects today&apos;s tennis to broadcaster intelligence, streaming services, price notes and verification caveats.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"><p className="text-xs uppercase text-zinc-500">Matches</p><p className="mt-2 text-3xl font-black">{stats.matchCount}</p></div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"><p className="text-xs uppercase text-zinc-500">With route</p><p className="mt-2 text-3xl font-black">{stats.matchedRouteCount}</p></div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"><p className="text-xs uppercase text-zinc-500">Verified rows</p><p className="mt-2 text-3xl font-black">{stats.verifiedRouteCount}</p></div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"><p className="text-xs uppercase text-zinc-500">Broadcasters</p><p className="mt-2 text-3xl font-black">{stats.broadcasterCount}</p></div>
        </div>

        <div className="mt-8 rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-100">
          Country default is USA for this MVP. The graph layer already supports country input, so the next iteration can add a country switcher and personalized defaults.
        </div>

        <div className="mt-8 space-y-4">
          {nodes.length === 0 ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-zinc-300">
              No scheduled matches were returned by the live match API for this window. Use <Link className="text-emerald-300 underline" href="/can-i-watch">Can I Watch?</Link> to check tournament coverage manually.
            </div>
          ) : nodes.map((node) => (
            <article key={node.match.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">{node.tournamentLabel}</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{node.matchLabel}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{formatTime(node.startsAt)} · {node.startsInLabel}{node.match.court ? ` · ${node.match.court}` : ""}{node.match.surface ? ` · ${node.match.surface}` : ""}</p>
                </div>
                <Link href={`/can-i-watch/${node.query}/usa`} className="rounded-full border border-emerald-400 px-4 py-2 text-sm font-black text-emerald-300">
                  Coverage page
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Broadcasters</p>
                  <p className="mt-2 text-zinc-200">{node.primaryBroadcasters.length ? node.primaryBroadcasters.join(", ") : "No stored broadcaster route yet"}</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Streaming</p>
                  <p className="mt-2 text-zinc-200">{node.primaryStreams.length ? node.primaryStreams.join(", ") : "Check tournament source"}</p>
                </div>
              </div>

              {node.entries.length > 0 && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {node.entries.slice(0, 4).map((entry) => (
                    <div key={`${entry.countryCode}-${entry.tournamentId}-${entry.broadcasterName}-${entry.streamingServiceName}`} className="rounded-2xl border border-zinc-800 bg-black p-4">
                      <div className="flex items-center justify-between gap-3">
                        <strong>{entry.streamingServiceName}</strong>
                        <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-zinc-300">{entry.confidenceLevel}</span>
                      </div>
                      <p className="mt-2 text-sm text-zinc-400">{formatBroadcastPrice(entry.price)} · {entry.requiresSubscription ? "Subscription likely" : "May be free"}</p>
                      <a className="mt-3 inline-block text-sm font-bold text-emerald-300 underline" href={entry.officialWebsiteUrl} rel="nofollow noopener noreferrer" target="_blank">
                        Official source
                      </a>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 text-sm text-zinc-500">{node.caveat}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
