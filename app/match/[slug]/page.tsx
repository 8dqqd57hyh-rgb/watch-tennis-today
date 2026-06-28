import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canonicalUrl, robotsFor } from "@/app/lib/technicalSeo";
import {
  buildMatchSchemas,
  fallbackMatchFromSlug,
  findMatchBySlug,
  getMatchCountryTimeDisplays,
  getMatchCoverageSummary,
  getMatchFaq,
  getMatchOfficialLinks,
  getMatchPaths,
  getMatchSeoDescription,
  getMatchSeoTitle,
  getMatchSlug,
  getMatchWatchOptions,
  getPlayerRecentForm,
  isMatchPageIndexable,
  parseMatchSlug,
  type MatchCenterMatch,
} from "@/src/lib/matchCenter";
import { getCanonicalPlayerSlug } from "@/data/playerSlugs";

export const dynamic = "force-dynamic";
export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function formatDateTime(value?: string | null) {
  if (!value) return "Time to be confirmed";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time to be confirmed";

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function statusLabel(match: MatchCenterMatch) {
  return match.status || "Status to be confirmed";
}

function displayText(value: unknown) {
  return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
}

function getStatusClass(status?: string | null) {
  const value = String(status || "").toLowerCase();
  if (value.includes("live")) return "bg-red-500 text-white";
  if (value.includes("finished") || value.includes("completed")) return "bg-zinc-700 text-white";
  if (value.includes("postponed") || value.includes("suspended")) return "bg-yellow-400 text-black";
  return "bg-green-400 text-black";
}

async function resolveMatch(slug: string) {
  return (await findMatchBySlug(slug)) || fallbackMatchFromSlug(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = await resolveMatch(slug);

  if (!match) {
    return {
      title: "Match Not Found",
      robots: robotsFor({ index: false }),
    };
  }

  const title = getMatchSeoTitle(match);
  const description = getMatchSeoDescription(match);
  const url = canonicalUrl(`/match/${getMatchSlug(match) || slug}`);
  const indexable = isMatchPageIndexable(match);

  return {
    title,
    description,
    robots: robotsFor({ index: indexable }),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function PlayerLink({ href, name }: { href: string | null; name: string }) {
  if (!href) return <span>{name}</span>;

  return (
    <Link href={href} className="hover:text-green-300">
      {name}
    </Link>
  );
}

function Fact({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-black text-white">{value || "To be confirmed"}</p>
    </div>
  );
}

function RecentForm({ playerSlugValue }: { playerSlugValue: string }) {
  const form = getPlayerRecentForm(playerSlugValue);

  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <h3 className="text-xl font-black">{form.playerName}</h3>
      <p className="mt-3 leading-7 text-zinc-300">{form.summary}</p>
      <ul className="mt-4 space-y-2 text-sm text-zinc-400">
        {form.signals.slice(0, 4).map((signal) => (
          <li key={signal}>- {signal}</li>
        ))}
      </ul>
    </article>
  );
}

function WatchOptions({ match }: { match: MatchCenterMatch }) {
  const options = getMatchWatchOptions(match);

  if (!options.length) {
    return (
      <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-3xl font-black">How to watch</h2>
        <p className="mt-4 leading-8 text-zinc-300">
          No broadcaster row matched this exact event from the current source-backed dataset. Check the official tournament order of play and your local rights holder before relying on any stream claim.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/watch-tennis-in" className="rounded-2xl border border-zinc-700 px-4 py-3 font-black hover:border-green-400">
            Country guides
          </Link>
          <Link href="/tennis-tv-broadcast-finder" className="rounded-2xl border border-zinc-700 px-4 py-3 font-black hover:border-green-400">
            Broadcast finder
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">Source-backed viewing</p>
          <h2 className="mt-2 text-3xl font-black">Broadcasters by country</h2>
        </div>
        <Link href="/watch-tennis-in" className="text-sm font-black text-green-400 hover:text-green-300">
          All country guides
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {options.map((option) => (
          <article key={`${option.countrySlug}-${option.broadcasterName}-${option.streamingService}`} className="rounded-2xl border border-zinc-800 bg-black p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <Link href={`/watch-tennis-in/${option.countrySlug}`} className="font-black text-white hover:text-green-300">
                {option.countryName}
              </Link>
              <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-300">{option.confidence}</span>
            </div>
            <h3 className="text-xl font-black">{option.broadcasterName}</h3>
            <p className="mt-2 text-sm text-zinc-400">{option.streamingService}</p>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{option.notes}</p>
            <div className="mt-4 grid gap-2 text-sm text-zinc-400 sm:grid-cols-2">
              <p>Free route: <strong className="text-white">{option.free ? "Possible" : "Not marked free"}</strong></p>
              <p>Subscription: <strong className="text-white">{option.subscriptionRequired ? "Usually required" : "Not marked required"}</strong></p>
              <p>Price: <strong className="text-white">{option.priceNote}</strong></p>
              <p>Verified: <strong className="text-white">{option.lastVerified}</strong></p>
            </div>
            <a href={option.officialUrl} className="mt-4 inline-flex rounded-xl bg-green-500 px-4 py-2 text-sm font-black text-black hover:bg-green-400">
              Official broadcaster
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function MatchPage({ params }: PageProps) {
  const { slug } = await params;
  const match = await resolveMatch(slug);

  if (!match) notFound();

  const parsed = parseMatchSlug(slug);
  const paths = getMatchPaths(match);
  const summary = getMatchCoverageSummary(match);
  const faq = getMatchFaq(match);
  const schemas = buildMatchSchemas(match);
  const officialLinks = getMatchOfficialLinks(match);
  const timeDisplays = getMatchCountryTimeDisplays(match);
  const playerOneSlug = getCanonicalPlayerSlug(match.player1) || parsed?.playerOneSlug || "";
  const playerTwoSlug = getCanonicalPlayerSlug(match.player2) || parsed?.playerTwoSlug || "";
  const indexable = isMatchPageIndexable(match);

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
      ))}

      <div className="mx-auto max-w-6xl">
        <Link href="/today" className="text-zinc-400 hover:text-white">
          Back to today&apos;s matches
        </Link>

        <section className="mt-8 mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-4 py-2 text-xs font-black uppercase ${getStatusClass(match.status)}`}>
              {statusLabel(match)}
            </span>
            <span className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300">{match.category || "Tennis"}</span>
            {indexable ? (
              <span className="rounded-full bg-green-500/15 px-4 py-2 text-xs font-bold text-green-300">Indexable match center</span>
            ) : (
              <span className="rounded-full bg-zinc-800 px-4 py-2 text-xs font-bold text-zinc-300">Noindex until more data is available</span>
            )}
          </div>

          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            <PlayerLink href={paths.playerOneUrl} name={match.player1} /> vs <PlayerLink href={paths.playerTwoUrl} name={match.player2} />
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Match time, tournament context, player links and official broadcaster checks for {match.player1} vs {match.player2}. Watch Tennis Today does not host or restream live tennis.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={paths.tournamentUrl} className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400">
              Tournament page
            </Link>
            <Link href="/tennis-on-tv-today" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black hover:border-green-400">
              TV schedule
            </Link>
            <Link href="/tennis-live-alerts" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black hover:border-green-400">
              Match alerts
            </Link>
          </div>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <Fact label="Tournament" value={match.tournament} />
          <Fact label="Round" value={match.round} />
          <Fact label="Date and time" value={formatDateTime(match.startTime)} />
          <Fact label="Court" value={displayText(match.court) || displayText(match.location)} />
        </section>

        {timeDisplays.length ? (
          <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-3xl font-black">Country and timezone display</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-5">
              {timeDisplays.map((item) => (
                <Link key={item.countrySlug} href={`/watch-tennis-in/${item.countrySlug}`} className="rounded-2xl border border-zinc-800 bg-black p-4 hover:border-green-400">
                  <p className="text-sm font-black text-white">{item.countryName}</p>
                  <p className="mt-2 text-sm text-zinc-400">{item.label}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-2xl font-black">Head-to-head</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              Verified head-to-head records are not stored in this release of the match center. Use this section as a reminder to check official ATP, WTA or tournament records before citing numbers.
            </p>
          </article>
          <article className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-2xl font-black">Surface and context</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              {match.surface ? `${match.surface} surface is listed for this match.` : "Surface is not confirmed in the current feed."} Round, court assignment and tournament level can affect start-time reliability and broadcast placement.
            </p>
          </article>
          <article className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-2xl font-black">Coverage confidence</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              {summary.confidenceLabel}. Last verified: {summary.lastVerified || "not matched to broadcaster data"}. Re-check official sources close to match time.
            </p>
          </article>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-3xl font-black">Recent form</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <RecentForm playerSlugValue={playerOneSlug || match.player1} />
            <RecentForm playerSlugValue={playerTwoSlug || match.player2} />
          </div>
        </section>

        <WatchOptions match={match} />

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-3xl font-black">Free vs paid viewing notes</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <Fact label="Countries matched" value={String(summary.countryCount)} />
            <Fact label="Free rows" value={String(summary.freeRouteCount)} />
            <Fact label="Subscription rows" value={String(summary.subscriptionRouteCount)} />
          </div>
          <p className="mt-5 leading-8 text-zinc-300">
            A free row means the dataset marks at least one legal free route for that country or tournament group. It does not guarantee this exact court is free. Subscription rows usually require checking the provider plan, device support and match-week schedule.
          </p>
        </section>

        {officialLinks.length ? (
          <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-3xl font-black">Official links</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {officialLinks.map((link) => (
                <a key={link.url} href={link.url} className="rounded-2xl border border-zinc-800 bg-black p-4 font-black text-white hover:border-green-400">
                  {link.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-5 space-y-5">
            {faq.map((item) => (
              <article key={item.question}>
                <h3 className="text-xl font-black">{item.question}</h3>
                <p className="mt-2 leading-7 text-zinc-300">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
