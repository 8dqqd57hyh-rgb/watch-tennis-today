export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { affiliateLinks } from "@/app/lib/affiliateLinks";
import { canonicalUrl, robotsFor } from "@/app/lib/technicalSeo";
import AuthorBox from "@/app/components/AuthorBox";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";
import EmailSignup from "@/app/components/EmailSignup";
import {
  broadcastCountries,
  getBroadcastCountry,
  shouldIndexBroadcastCountry,
} from "@/data/broadcastFinder";
import { buildArticleAuthorSchema, buildOrganizationSchema } from "@/data/authorProfile";
import {
  TENNIS_BROADCAST_LAST_VERIFIED,
  formatBroadcastPrice,
  getBroadcasterSlug,
  getCountryBroadcastEntries,
  type TennisBroadcastEntry,
  type TennisTournamentId,
} from "@/src/data/tennisBroadcasts";

const grandSlamIds: TennisTournamentId[] = [
  "australian-open",
  "roland-garros",
  "wimbledon",
  "us-open",
];

const tourIds: TennisTournamentId[] = ["atp-tour", "wta-tour"];

const confidenceLabels: Record<TennisBroadcastEntry["confidenceLevel"], string> = {
  confirmed: "Confirmed from reviewed source",
  partial: "Partially confirmed; verify details",
  needs_check: "Needs match-week verification",
};

export function generateStaticParams() {
  return broadcastCountries.map((country) => ({ country: country.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const broadcastCountry = getBroadcastCountry(country);

  if (!broadcastCountry) {
    return {
      title: "Tennis TV Channels by Country | Watch Tennis Today",
      robots: robotsFor({ index: false }),
    };
  }

  const indexable = shouldIndexBroadcastCountry(broadcastCountry.slug);
  const title = `Where to Watch Tennis in ${broadcastCountry.country} | Official ATP, WTA & Grand Slam TV`;
  const description = `Official tennis broadcaster guide for ${broadcastCountry.country}: Grand Slam channels, ATP and WTA streaming options, source links and legal viewing checks.`;

  return {
    title,
    description,
    robots: robotsFor({ index: indexable }),
    alternates: {
      canonical: canonicalUrl(`/watch-tennis-in/${broadcastCountry.slug}`),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl(`/watch-tennis-in/${broadcastCountry.slug}`),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function getEntries(countryCode: string | undefined, tournamentIds: TennisTournamentId[]) {
  if (!countryCode) return [];

  return getCountryBroadcastEntries(countryCode, tournamentIds);
}

function SourceLinks({ entry }: { entry: TennisBroadcastEntry }) {
  return (
    <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Sources used for this row</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {entry.officialLinks.map((link) => (
          <span
            key={link.url}
            className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-300"
          >
            {link.label}
          </span>
        ))}
      </div>
      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-black uppercase tracking-[0.14em] text-emerald-300">
          Reference links
        </summary>
        <div className="mt-3 flex flex-wrap gap-2">
          {entry.officialLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-300 hover:border-emerald-400 hover:text-emerald-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </details>
    </div>
  );
}

function BroadcastEntryCard({ entry }: { entry: TennisBroadcastEntry }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-black p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            {entry.tournamentName}
          </p>
          <h3 className="mt-2 text-xl font-black text-white">{entry.broadcasterName}</h3>
        </div>
        <span className="rounded-full bg-zinc-900 px-3 py-2 text-xs font-black text-zinc-300">
          {confidenceLabels[entry.confidenceLevel]}
        </span>
      </div>
      <dl className="mt-4 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
        <div>
          <dt className="font-black text-zinc-500">Streaming route</dt>
          <dd className="mt-1">{entry.streamingServiceName}</dd>
        </div>
        <div>
          <dt className="font-black text-zinc-500">Price/month</dt>
          <dd className="mt-1">
            <span className="font-black text-white">{formatBroadcastPrice(entry.price)}</span>
            <span className="mt-1 block text-xs text-zinc-500">{entry.priceNote}</span>
          </dd>
        </div>
        <div>
          <dt className="font-black text-zinc-500">Subscription</dt>
          <dd className="mt-1">{entry.requiresSubscription ? "Usually required" : "Not usually required"}</dd>
        </div>
        <div>
          <dt className="font-black text-zinc-500">Replays</dt>
          <dd className="mt-1">{entry.replaysAvailable === true ? "Listed as available" : "Verify with provider"}</dd>
        </div>
      </dl>
      <p className="mt-4 leading-7 text-zinc-400">{entry.coverageNotes}</p>
      <Link
        href={`/broadcaster/${getBroadcasterSlug(entry.broadcasterName)}`}
        className="mt-4 inline-flex rounded-2xl border border-zinc-700 px-4 py-2 text-sm font-black text-white hover:border-emerald-400 hover:text-emerald-300"
      >
        View broadcaster profile
      </Link>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">
        Last verified: {entry.lastVerified}
      </p>
      <SourceLinks entry={entry} />
    </article>
  );
}

function FallbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-black p-5">
      <h3 className="text-xl font-black text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-zinc-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2 w-2 flex-none rounded-full bg-emerald-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const broadcastCountry = getBroadcastCountry(country);

  if (!broadcastCountry) notFound();

  const countryPath = `/watch-tennis-in/${broadcastCountry.slug}`;
  const pageUrl = canonicalUrl(countryPath);
  const grandSlamEntries = getEntries(broadcastCountry.countryCode, grandSlamIds);
  const tourEntries = getEntries(broadcastCountry.countryCode, tourIds);
  const atpEntry = tourEntries.find((entry) => entry.tournamentId === "atp-tour");
  const wtaEntry = tourEntries.find((entry) => entry.tournamentId === "wta-tour");
  const hasStructuredBroadcastRows = grandSlamEntries.length > 0 || tourEntries.length > 0;
  const slamSummary = grandSlamEntries
    .map((entry) => `${entry.tournamentName}: ${entry.broadcasterName}`)
    .join("; ");

  const faqItems = [
    {
      question: `Where can I watch ATP tennis in ${broadcastCountry.country}?`,
      answer: hasStructuredBroadcastRows
        ? `${atpEntry?.broadcasterName ?? "Check the ATP TV schedule"} is the ATP route stored for ${broadcastCountry.country}. Confirm the selected tournament with the ATP TV schedule and the linked provider before paying.`
        : `Use the official ATP, WTA and tournament broadcaster directories linked on this page. This country needs more reviewed broadcaster rows before it should be treated as a complete guide.`,
    },
    {
      question: `Where can I watch WTA tennis in ${broadcastCountry.country}?`,
      answer: hasStructuredBroadcastRows
        ? `${wtaEntry?.broadcasterName ?? "Check the WTA where-to-watch directory"} is the WTA route stored for ${broadcastCountry.country}. WTA rights are separate from ATP and Grand Slams, so verify the tournament week.`
        : `Use the WTA where-to-watch directory and local broadcaster schedules before subscribing in ${broadcastCountry.country}.`,
    },
    {
      question: `Who shows the Grand Slams in ${broadcastCountry.country}?`,
      answer: slamSummary
        ? `${slamSummary}. These are stored as separate event rows because Australian Open, Roland Garros, Wimbledon and US Open rights do not automatically match ATP or WTA tour rights.`
        : `Use the four official Grand Slam broadcaster directories for ${broadcastCountry.country}; this page does not yet have enough reviewed Slam rows.`,
    },
    {
      question: `Does one service show every tennis match in ${broadcastCountry.country}?`,
      answer:
        "Usually no. Grand Slams, ATP Tour, WTA Tour, Davis Cup, Billie Jean King Cup and Challenger events can have separate rights.",
    },
    {
      question: `Can I watch while traveling outside ${broadcastCountry.country}?`,
      answer:
        "Check whether your existing broadcaster allows temporary access abroad and follow its terms. Watch Tennis Today does not host streams or bypass paywalls.",
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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Where to Watch Tennis in ${broadcastCountry.country}`,
    description: `Official tennis broadcaster guide for ATP, WTA and Grand Slam coverage in ${broadcastCountry.country}.`,
    mainEntityOfPage: pageUrl,
    dateModified: TENNIS_BROADCAST_LAST_VERIFIED,
    author: buildArticleAuthorSchema(),
    publisher: buildOrganizationSchema(),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Where to Watch Tennis in ${broadcastCountry.country}`,
    description: `Legal broadcaster and streaming checks for tennis fans in ${broadcastCountry.country}.`,
    url: pageUrl,
    about: [
      { "@type": "SportsOrganization", name: "ATP Tour" },
      { "@type": "SportsOrganization", name: "WTA Tour" },
      { "@type": "SportsEvent", name: "Australian Open" },
      { "@type": "SportsEvent", name: "Roland Garros" },
      { "@type": "SportsEvent", name: "Wimbledon" },
      { "@type": "SportsEvent", name: "US Open" },
    ],
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
          { name: "Watch Tennis In", url: canonicalUrl("/watch-tennis-in") },
          { name: broadcastCountry.country, url: pageUrl },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />

      <div className="mx-auto max-w-6xl">
        <Link href="/tennis-tv-broadcast-finder" className="text-sm font-bold text-zinc-400 hover:text-white">
          Back to Broadcast Finder
        </Link>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-4 inline-flex rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            Country streaming guide
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Where to watch tennis in {broadcastCountry.country}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Use this guide to separate Grand Slam, ATP Tour and WTA Tour rights in {broadcastCountry.country}, then verify the match on official broadcaster sources before subscribing.
          </p>
          {broadcastCountry.seoIntro ? (
            <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-400">
              {broadcastCountry.seoIntro}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-400">
            <span>Broadcast rows verified: {TENNIS_BROADCAST_LAST_VERIFIED}</span>
            <span>Rights may change by event, court and territory.</span>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Quick answer</p>
            <h2 className="mt-2 text-xl font-black text-white">Check the event first</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              A player name is not enough. The tournament decides whether you need a Grand Slam broadcaster, ATP option or WTA option.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Official sources</p>
            <h2 className="mt-2 text-xl font-black text-white">{broadcastCountry.officialDirectories.length} directories</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Use the linked ATP, WTA and tournament directories as the final check before paying for coverage.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Spoilers</p>
            <h2 className="mt-2 text-xl font-black text-white">Plan replays carefully</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              If you cannot watch live, open provider replay pages directly and avoid score feeds until you are ready.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Data note</p>
            <h2 className="mt-2 text-xl font-black text-white">Reviewed rows only</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              This page uses stored broadcaster rows and official links; missing rows are shown as checks, not invented claims.
            </p>
          </div>
        </section>

        {!hasStructuredBroadcastRows ? (
          <section className="mt-8 rounded-3xl border border-amber-400/40 bg-amber-950/20 p-6">
            <h2 className="text-2xl font-black text-amber-200">Needs manual broadcaster verification</h2>
            <p className="mt-3 max-w-4xl leading-7 text-zinc-300">
              This country page is available for users, but it is kept out of search indexing until reviewed, source-backed broadcaster rows are added for Grand Slams, ATP and WTA.
            </p>
          </section>
        ) : null}

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Grand Slams</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
            Australian Open, Roland Garros, Wimbledon and US Open rights are sold separately from normal tour coverage. Verify the tournament source for the current year.
          </p>
          <div className="mt-6 grid gap-4">
            {grandSlamEntries.length ? (
              grandSlamEntries.map((entry) => <BroadcastEntryCard key={entry.tournamentId} entry={entry} />)
            ) : (
              <FallbackList title="Grand Slam coverage checks" items={broadcastCountry.grandSlamBroadcasters} />
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">ATP Tour</h2>
            <p className="mt-3 leading-7 text-zinc-400">
              ATP Tour coverage is separate from Grand Slams and WTA. Tennis TV is the official ATP streaming service, but local rights and blackouts can still apply.
            </p>
            <div className="mt-5">
              {atpEntry ? <BroadcastEntryCard entry={atpEntry} /> : <FallbackList title="ATP viewing options" items={broadcastCountry.atpOptions} />}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">WTA Tour</h2>
            <p className="mt-3 leading-7 text-zinc-400">
              WTA Tour coverage uses its own rights path. Use the WTA where-to-watch directory and provider schedule for the tournament week.
            </p>
            <div className="mt-5">
              {wtaEntry ? <BroadcastEntryCard entry={wtaEntry} /> : <FallbackList title="WTA viewing options" items={broadcastCountry.wtaOptions} />}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Davis Cup and Billie Jean King Cup</h2>
          <p className="mt-3 max-w-4xl leading-7 text-zinc-400">
            No reviewed country-specific Davis Cup or Billie Jean King Cup broadcaster row is stored for {broadcastCountry.country} yet. Treat team competitions as separate rights and verify them from the competition or local broadcaster site before match time.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">How to avoid spoilers in {broadcastCountry.country}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl bg-black p-4">
              <h3 className="font-black text-white">Before the match</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Save the provider app or official match page before play starts so you do not need to search through score-heavy pages later.
              </p>
            </article>
            <article className="rounded-2xl bg-black p-4">
              <h3 className="font-black text-white">During live play</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Use <Link href="/tennis-spoiler-free-scores" className="font-bold text-emerald-300">spoiler-free scores</Link> if you need status without seeing the result.
              </p>
            </article>
            <article className="rounded-2xl bg-black p-4">
              <h3 className="font-black text-white">After the match</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Check replay availability inside the licensed service. Some providers keep full replays, while others only show highlights or limited court archives.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Official directories</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
            Use these source links as the final check before paying for a package or relying on an app for a specific match.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {broadcastCountry.officialDirectories.map((source) => (
              <a
                key={source.label}
                href={source.url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="rounded-2xl border border-zinc-800 bg-black p-5 font-black text-white transition hover:border-emerald-400 hover:text-emerald-300"
              >
                {source.label}
              </a>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Match-day checklist</h2>
            <ol className="mt-5 space-y-4 text-zinc-300">
              <li><strong className="text-white">1.</strong> Identify whether the match is Grand Slam, ATP Tour, WTA Tour or a team event.</li>
              <li><strong className="text-white">2.</strong> Open the official source link for that competition.</li>
              <li><strong className="text-white">3.</strong> Confirm the broadcaster, court feed, app access and replay availability in {broadcastCountry.country}.</li>
              <li><strong className="text-white">4.</strong> Re-check close to start time because court moves and overflow feeds can change the viewing route.</li>
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/live-tennis" className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black">Live tennis today</Link>
              <Link href="/tennis-tv-broadcast-finder" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">Broadcast finder</Link>
              <Link href="/tennis-streaming-services" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">Streaming services</Link>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/30 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Travel viewing</p>
            <h2 className="mt-3 text-3xl font-black">Watching outside {broadcastCountry.country}?</h2>
            <p className="mt-4 leading-7 text-zinc-300">{broadcastCountry.travelTip}</p>
            <p className="mt-4 leading-7 text-zinc-400">
              Use privacy tools only within broadcaster terms and local law. This site does not bypass paywalls or host streams.
            </p>
            <div className="mt-6 grid gap-3">
              <Link href="/watch-tennis-abroad" className="rounded-2xl bg-white px-5 py-3 text-center font-black text-black">Watch tennis abroad guide</Link>
              <Link href="/best-vpn-for-tennis-streaming" className="rounded-2xl border border-emerald-400/40 px-5 py-3 text-center font-black text-white hover:border-emerald-300">Best VPN for tennis</Link>
              <a href={affiliateLinks.nordvpn} target="_blank" rel="nofollow sponsored noopener noreferrer" className="rounded-2xl border border-zinc-700 px-5 py-3 text-center font-black text-white hover:border-emerald-300">View VPN deal</a>
            </div>
            <p className="mt-4 text-xs text-zinc-500">Affiliate disclosure: we may earn a commission from qualifying purchases.</p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              Local broadcast context
            </p>
            <h2 className="mt-3 text-3xl font-black">
              How tennis coverage usually works in {broadcastCountry.country}
            </h2>
            <p className="mt-4 leading-8 text-zinc-300">{broadcastCountry.localContext}</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-black p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
              Before you subscribe
            </p>
            <h2 className="mt-3 text-3xl font-black">
              Verify official availability
            </h2>
            <p className="mt-4 leading-8 text-zinc-300">{broadcastCountry.verificationAdvice}</p>
            <p className="mt-4 leading-8 text-zinc-400">
              Rights can change by event, court, session and territory. Confirm availability with official broadcasters before paying for, renewing or relying on a streaming service.
            </p>
          </div>
        </section>

        {broadcastCountry.localViewingTips?.length || broadcastCountry.majorEventNotes?.length ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            {broadcastCountry.localViewingTips?.length ? (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
                  Local viewing workflow
                </p>
                <h2 className="mt-3 text-3xl font-black">
                  How to check tennis TV in {broadcastCountry.country}
                </h2>
                <ul className="mt-5 space-y-3 text-zinc-300">
                  {broadcastCountry.localViewingTips.map((tip) => (
                    <li key={tip} className="flex gap-3 leading-7">
                      <span className="mt-3 h-2 w-2 flex-none rounded-full bg-emerald-400" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {broadcastCountry.majorEventNotes?.length ? (
              <div className="rounded-3xl border border-zinc-800 bg-black p-6">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
                  Event-specific notes
                </p>
                <h2 className="mt-3 text-3xl font-black">
                  Tournaments to verify separately
                </h2>
                <ul className="mt-5 space-y-3 text-zinc-300">
                  {broadcastCountry.majorEventNotes.map((note) => (
                    <li key={note} className="flex gap-3 leading-7">
                      <span className="mt-3 h-2 w-2 flex-none rounded-full bg-emerald-400" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Related pages for {broadcastCountry.country} tennis fans</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/today" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">Today&apos;s tennis hub</Link>
            <Link href="/tennis-schedule-today" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">Today&apos;s schedule</Link>
            <Link href="/live-tennis" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">Live tennis</Link>
            <Link href="/tennis-on-tv-today" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">Tennis on TV today</Link>
            <Link href="/official-tennis-broadcasters-guide" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">Official broadcasters guide</Link>
            <Link href="/players" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">Player pages</Link>
            <Link href="/grand-slam-live" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">Grand Slam live</Link>
            <Link href="/watch-tennis-in" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">All country guides</Link>
            <Link href="/wimbledon" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">Wimbledon hub</Link>
            <Link href="/french-open" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">French Open hub</Link>
            <Link href="/australian-open" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">Australian Open hub</Link>
            <Link href="/us-open" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-emerald-400">US Open hub</Link>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-6 space-y-6">
            {faqItems.map((item) => (
              <article key={item.question}>
                <h3 className="text-xl font-black">{item.question}</h3>
                <p className="mt-2 text-zinc-400">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <ContentQualityNotice pageType={`country broadcaster guide for ${broadcastCountry.country}`} />
        <AuthorBox />
        <EmailSignup />
      </div>
    </main>
  );
}
