import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { canonicalUrl } from "@/app/lib/technicalSeo";
import { broadcastCountries } from "@/data/broadcastFinder";
import {
  formatBroadcastPrice,
  getBroadcasterBySlug,
  getCountriesForBroadcaster,
  getTournamentGroupsForBroadcaster,
  getUniqueBroadcasters,
  type TennisBroadcastEntry,
} from "@/src/data/tennisBroadcasts";
import {
  getBroadcasterNetwork,
  getRelatedCountries,
  getRelatedPlayers,
  getRelatedStreamingServices,
  getRelatedTournaments,
} from "@/src/lib/intelligence/queries";

const confidenceLabels: Record<TennisBroadcastEntry["confidenceLevel"], string> = {
  confirmed: "Confirmed from reviewed source",
  partial: "Partially confirmed; verify details",
  needs_check: "Needs match-week verification",
};

function countrySlug(countryName: string) {
  return broadcastCountries.find((country) => country.country === countryName)?.slug;
}

function yesNoUnknown(value: boolean | "unknown") {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "Verify with provider";
}

function uniqueEntries(entries: TennisBroadcastEntry[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    const key = `${entry.countryCode}-${entry.tournamentId}-${entry.broadcasterName}-${entry.streamingServiceName}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function generateStaticParams() {
  return getUniqueBroadcasters().map((broadcaster) => ({ slug: broadcaster.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const broadcaster = getBroadcasterBySlug(slug);

  if (!broadcaster) {
    return {
      title: "Tennis Broadcaster | Watch Tennis Today",
      robots: { index: false, follow: true },
    };
  }

  const title = `${broadcaster.name} Tennis Coverage | Countries, Tournaments & Streaming Notes`;
  const description = `Check ${broadcaster.name} tennis coverage by country and tournament, including free/paid status, official links, confidence level and last verified dates.`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl(`/broadcaster/${broadcaster.slug}`),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl(`/broadcaster/${broadcaster.slug}`),
      siteName: "Watch Tennis Today",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BroadcasterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const broadcaster = getBroadcasterBySlug(slug);

  if (!broadcaster) notFound();

  const entries = uniqueEntries(broadcaster.entries);
  const countries = getCountriesForBroadcaster(slug);
  const tournaments = getTournamentGroupsForBroadcaster(slug);
  const pageUrl = canonicalUrl(`/broadcaster/${broadcaster.slug}`);
  const needsVerification = broadcaster.confidenceLevels.includes("needs_check") || broadcaster.confidenceLevels.includes("partial");
  const broadcasterNetwork = getBroadcasterNetwork(slug);
  const relatedCountryLinks = getRelatedCountries(broadcasterNetwork, 8);
  const relatedTournamentLinks = getRelatedTournaments(broadcasterNetwork, 8);
  const relatedPlayerLinks = getRelatedPlayers(broadcasterNetwork, 6);
  const relatedStreamingLinks = getRelatedStreamingServices(broadcasterNetwork, 8);

  const faqItems = [
    {
      question: `Does ${broadcaster.name} show every tennis match?`,
      answer: `No single broadcaster should be assumed to show every tennis match. ${broadcaster.name} appears in this database for selected countries and tournament groups only. Verify the exact match, court feed and subscription tier on official sources before paying.`,
    },
    {
      question: `Is ${broadcaster.name} free for tennis?`,
      answer: broadcaster.isFree
        ? `${broadcaster.name} has at least one free route listed in this database, but free access can depend on territory, event and local rules.`
        : `${broadcaster.name} is not stored as a free route in the reviewed rows on this page. Check the official site for current packages and trials.`,
    },
    {
      question: "Does Watch Tennis Today stream matches from this broadcaster?",
      answer: "No. Watch Tennis Today does not host live streams, bypass paywalls or claim official partnership. It provides viewing research and links to official broadcaster or tournament sources.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${broadcaster.name} tennis coverage research`,
    url: pageUrl,
    provider: {
      "@type": "Organization",
      name: "Watch Tennis Today",
      url: canonicalUrl("/"),
    },
    areaServed: countries.map((country) => ({ "@type": "Country", name: country })),
    description: `Source-backed tennis viewing notes for ${broadcaster.name}. Watch Tennis Today does not stream matches or claim official partnership.`,
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: canonicalUrl("/") },
          { name: "Broadcasters", url: canonicalUrl("/broadcasters") },
          { name: broadcaster.name, url: pageUrl },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <div className="mx-auto max-w-7xl">
        <Link href="/broadcasters" className="text-sm font-bold text-zinc-400 hover:text-white">
          ← All tennis broadcasters
        </Link>
        <Link href="/can-i-watch" className="ml-4 text-sm font-bold text-emerald-300 hover:text-emerald-200">
          Can I watch? finder →
        </Link>

        <section className="mt-8 rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-black p-8 md:p-10">
          <p className="mb-4 inline-flex rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Broadcaster profile
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">{broadcaster.name} tennis coverage</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Countries, tournament groups, source links and subscription notes for {broadcaster.name}. This page is a viewing guide, not a streaming service or official partnership page.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-400">
            <span>{countries.length} countries</span>
            <span>{tournaments.length} tournament groups</span>
            <span>Last verified: {broadcaster.lastVerified}</span>
          </div>
        </section>

        {needsVerification ? (
          <section className="mt-8 rounded-3xl border border-amber-400/40 bg-amber-950/20 p-6">
            <h2 className="text-2xl font-black text-amber-200">Verify before subscribing</h2>
            <p className="mt-3 max-w-4xl leading-7 text-zinc-300">
              Some rows for {broadcaster.name} are marked partial or needs-check. Rights can change by year, territory, court and package, so verify on official broadcaster or tournament pages before paying.
            </p>
          </section>
        ) : null}

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Price status</p>
            <h2 className="mt-2 text-xl font-black">{broadcaster.priceSummary}</h2>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Subscription</p>
            <h2 className="mt-2 text-xl font-black">{broadcaster.requiresSubscription ? "Usually required" : "Not always required"}</h2>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Countries</p>
            <h2 className="mt-2 text-xl font-black">{countries.length}</h2>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Tournament groups</p>
            <h2 className="mt-2 text-xl font-black">{tournaments.length}</h2>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Countries served in this database</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {countries.map((country) => {
                const slug = countrySlug(country);
                return slug ? (
                  <Link key={country} href={`/watch-tennis-in/${slug}`} className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black text-zinc-200 hover:border-emerald-400 hover:text-emerald-300">
                    {country}
                  </Link>
                ) : (
                  <span key={country} className="rounded-full border border-zinc-800 px-4 py-2 text-sm font-black text-zinc-400">{country}</span>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Tournament groups covered</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {tournaments.map((tournament) => (
                <span key={tournament} className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black text-zinc-200">
                  {tournament}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Stored coverage rows</h2>
          <div className="mt-6 grid gap-4">
            {entries.map((entry) => (
              <article key={`${entry.countryCode}-${entry.tournamentId}-${entry.broadcasterName}-${entry.streamingServiceName}`} className="rounded-2xl border border-zinc-800 bg-black p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">{entry.countryName} · {entry.tournamentName}</p>
                    <h3 className="mt-2 text-2xl font-black text-white">{entry.streamingServiceName}</h3>
                    <p className="mt-1 text-sm font-bold text-zinc-400">Broadcaster: {entry.broadcasterName}</p>
                  </div>
                  <span className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-black text-zinc-300">{confidenceLabels[entry.confidenceLevel]}</span>
                </div>

                <dl className="mt-5 grid gap-4 text-sm text-zinc-300 md:grid-cols-3">
                  <div>
                    <dt className="font-black text-zinc-500">Price</dt>
                    <dd className="mt-1 font-bold text-white">{formatBroadcastPrice(entry.price)}</dd>
                    <dd className="mt-1 text-xs text-zinc-500">{entry.priceNote}</dd>
                  </div>
                  <div>
                    <dt className="font-black text-zinc-500">Free / subscription</dt>
                    <dd className="mt-1">{entry.isFree ? "Free route listed" : "Not listed as free"}; {entry.requiresSubscription ? "subscription usually required" : "subscription not usually required"}</dd>
                  </div>
                  <div>
                    <dt className="font-black text-zinc-500">Replays / commentary</dt>
                    <dd className="mt-1">Replays: {yesNoUnknown(entry.replaysAvailable)} · English: {yesNoUnknown(entry.englishCommentary)}</dd>
                  </div>
                </dl>

                <p className="mt-5 leading-7 text-zinc-400">{entry.coverageNotes}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {entry.supportedDevices.map((device) => (
                    <span key={device} className="rounded-full border border-zinc-800 px-3 py-2 text-xs font-black text-zinc-400">{device}</span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {entry.officialLinks.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="nofollow noopener noreferrer" className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-300 hover:border-emerald-400 hover:text-emerald-300">
                      {link.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {relatedCountryLinks.length || relatedTournamentLinks.length || relatedPlayerLinks.length || relatedStreamingLinks.length ? (
          <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              Tennis intelligence graph
            </p>
            <h2 className="text-3xl font-black">Related coverage for {broadcaster.name}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                { title: "Countries", links: relatedCountryLinks },
                { title: "Tournaments", links: relatedTournamentLinks },
                { title: "Players", links: relatedPlayerLinks },
                { title: "Streaming services", links: relatedStreamingLinks },
              ].map((group) => (
                <div key={group.title} className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <h3 className="font-black text-white">{group.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.links.map((link) => (
                      <Link key={link.id} href={link.href} className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-200 hover:border-emerald-400">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <Link href="/tennis-streaming-service-picker" className="rounded-3xl border border-emerald-500/40 bg-emerald-950/30 p-6 hover:border-emerald-300">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Tool</p>
            <h2 className="mt-3 text-3xl font-black">Streaming service picker</h2>
            <p className="mt-3 leading-7 text-zinc-300">Compare tennis services by viewing need and region.</p>
          </Link>
          <Link href="/tennis-streaming-cost-calculator" className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 hover:border-emerald-400">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Tool</p>
            <h2 className="mt-3 text-3xl font-black">Streaming cost calculator</h2>
            <p className="mt-3 leading-7 text-zinc-300">Estimate monthly tennis streaming costs where known prices are stored.</p>
          </Link>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-5 grid gap-4">
            {faqItems.map((item) => (
              <details key={item.question} className="rounded-2xl border border-zinc-800 bg-black p-5">
                <summary className="cursor-pointer text-lg font-black text-white">{item.question}</summary>
                <p className="mt-3 leading-7 text-zinc-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
