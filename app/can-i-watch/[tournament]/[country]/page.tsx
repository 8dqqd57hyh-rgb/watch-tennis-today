import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { canonicalUrl, robotsFor } from "@/app/lib/technicalSeo";
import {
  findBroadcasts,
  formatBroadcastPrice,
  getBroadcastCountryBySlug,
  getBroadcastCountryOptions,
  getBroadcasterSlug,
  getCanIWatchQueryOptions,
  getCoverageSummary,
  type TennisBroadcastEntry,
} from "@/src/data/tennisBroadcasts";

const confidenceLabels: Record<TennisBroadcastEntry["confidenceLevel"], string> = {
  confirmed: "Confirmed from reviewed source",
  partial: "Partially confirmed; verify details",
  needs_check: "Needs match-week verification",
};

function titleize(slug: string) {
  const known = getCanIWatchQueryOptions().find((option) => option.slug === slug);
  if (known) return known.label;

  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function resultKey(entry: TennisBroadcastEntry) {
  return `${entry.countryCode}-${entry.tournamentId}-${entry.broadcasterName}-${entry.streamingServiceName}`;
}

export function generateStaticParams() {
  const options = getCanIWatchQueryOptions().filter((option) => option.type === "tournament");
  const countries = getBroadcastCountryOptions();

  return options.flatMap((option) =>
    countries.map((country) => ({ tournament: option.slug, country: country.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ tournament: string; country: string }> }): Promise<Metadata> {
  const { tournament, country } = await params;
  const broadcastCountry = getBroadcastCountryBySlug(country);
  const queryName = titleize(tournament);

  if (!broadcastCountry) {
    return { title: "Can I Watch Tennis? | Watch Tennis Today", robots: robotsFor({ index: false }) };
  }

  const title = `Can I Watch ${queryName} in ${broadcastCountry.country}? | Tennis Broadcasters`;
  const description = `Find official tennis broadcasters and streaming services for ${queryName} in ${broadcastCountry.country}, including free/paid notes, confidence level and source links.`;

  return {
    title,
    description,
    robots: robotsFor({ index: true }),
    alternates: { canonical: canonicalUrl(`/can-i-watch/${tournament}/${country}`) },
    openGraph: {
      title,
      description,
      url: canonicalUrl(`/can-i-watch/${tournament}/${country}`),
      type: "article",
    },
  };
}

export default async function CanIWatchDetailPage({ params }: { params: Promise<{ tournament: string; country: string }> }) {
  const { tournament, country } = await params;
  const broadcastCountry = getBroadcastCountryBySlug(country);
  if (!broadcastCountry) notFound();

  const queryName = titleize(tournament);
  const countryKey = broadcastCountry.countryCode;
  const summary = getCoverageSummary(countryKey, tournament);
  const entries = findBroadcasts(countryKey, tournament).filter((entry, index, all) => all.findIndex((item) => resultKey(item) === resultKey(entry)) === index);
  const pageUrl = canonicalUrl(`/can-i-watch/${tournament}/${country}`);
  const faqItems = [
    {
      question: `Can I watch ${queryName} in ${broadcastCountry.country}?`,
      answer: entries.length
        ? `This database lists ${summary.broadcasterCount} broadcaster or streaming route(s) for ${queryName} in ${broadcastCountry.country}. Verify the exact match and package on official sources before paying.`
        : `No verified route is stored yet for ${queryName} in ${broadcastCountry.country}. Check the tournament official broadcaster page and ATP/WTA directories.`,
    },
    {
      question: "Does Watch Tennis Today stream the match?",
      answer: "No. Watch Tennis Today does not stream matches, host illegal feeds or claim official partnership. It links to official sources for verification.",
    },
  ];
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
      <BreadcrumbSchema items={[{ name: "Home", url: canonicalUrl("/") }, { name: "Can I Watch?", url: canonicalUrl("/can-i-watch") }, { name: `${queryName} in ${broadcastCountry.country}`, url: pageUrl }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-7xl">
        <Link href="/can-i-watch" className="text-sm font-bold text-zinc-400 hover:text-white">← Can I Watch? finder</Link>
        <section className="mt-8 rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-black p-8 md:p-10">
          <p className="mb-4 inline-flex rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Country viewing page</p>
          <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">Can I watch {queryName} in {broadcastCountry.country}?</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Official broadcaster and streaming research for {queryName} in {broadcastCountry.country}. Always verify court coverage and subscription details before paying.
          </p>
        </section>

        <section className="mt-8 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Broadcasters</p><p className="mt-1 text-2xl font-black">{summary.broadcasterCount}</p></div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Free routes</p><p className="mt-1 text-2xl font-black">{summary.freeRouteCount}</p></div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Paid routes</p><p className="mt-1 text-2xl font-black">{summary.subscriptionRouteCount}</p></div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-zinc-500">Last verified</p><p className="mt-1 text-lg font-black">{summary.lastVerified ?? "No route"}</p></div>
        </section>

        {summary.warning ? <section className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-950/20 p-5 leading-7 text-amber-100">{summary.warning}</section> : null}

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          {entries.length > 0 ? entries.map((entry) => (
            <article key={resultKey(entry)} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">{entry.tournamentName}</p>
                  <h2 className="mt-2 text-2xl font-black">{entry.broadcasterName}</h2>
                  <p className="mt-1 text-zinc-400">Streaming route: {entry.streamingServiceName}</p>
                </div>
                <span className="rounded-full bg-black px-3 py-2 text-xs font-black text-zinc-300">{confidenceLabels[entry.confidenceLevel]}</span>
              </div>
              <dl className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
                <div><dt className="font-black text-zinc-500">Price</dt><dd>{entry.isFree ? "Free route listed" : formatBroadcastPrice(entry.price)}</dd></div>
                <div><dt className="font-black text-zinc-500">Subscription</dt><dd>{entry.requiresSubscription ? "Usually required" : "Not usually required"}</dd></div>
              </dl>
              <p className="mt-4 leading-7 text-zinc-400">{entry.coverageNotes}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/broadcaster/${getBroadcasterSlug(entry.broadcasterName)}`} className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-black text-white hover:border-emerald-400">Broadcaster profile</Link>
                {entry.officialLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="nofollow noopener noreferrer" className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-300 hover:border-emerald-400">{link.label}</a>)}
              </div>
            </article>
          )) : (
            <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 lg:col-span-2">
              <h2 className="text-2xl font-black">No verified route in this database yet</h2>
              <p className="mt-3 leading-7 text-zinc-400">Check official tournament broadcaster pages, ATP/WTA directories and local provider schedules before subscribing.</p>
            </article>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Related tools</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/can-i-watch" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black hover:border-emerald-400">Can I Watch? finder</Link>
            <Link href={`/watch-tennis-in/${broadcastCountry.slug}`} className="rounded-2xl border border-zinc-700 px-5 py-3 font-black hover:border-emerald-400">Watch tennis in {broadcastCountry.country}</Link>
            <Link href="/tennis-streaming-service-picker" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black hover:border-emerald-400">Streaming service picker</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
