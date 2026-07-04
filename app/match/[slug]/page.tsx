import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { canonicalUrl, robotsFor } from "@/app/lib/technicalSeo";
import { EnrichmentLinkGrid, EnrichmentQuickFacts } from "@/app/components/EnrichmentPanels";
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
import { players, type PlayerSlug } from "@/data/players";
import { getRivalryForMatch } from "@/data/rivalries";
import { getMatchEnrichment } from "@/src/lib/enrichment";

export const dynamic = "force-dynamic";
export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function formatDateTime(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

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
  if (typeof value !== "string" && typeof value !== "number") return undefined;

  const text = String(value).trim();
  if (!text || text === "-" || text.toLowerCase() === "not matched") return undefined;

  return text;
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

  const enrichment = getMatchEnrichment(match);
  const title = enrichment.seo.title || getMatchSeoTitle(match);
  const description = enrichment.seo.description || getMatchSeoDescription(match);
  const url = canonicalUrl(`/match/${getMatchSlug(match) || slug}`);
  const indexable = isMatchPageIndexable(match);

  return {
    title,
    description,
    keywords: enrichment.seo.keywords,
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
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function RecentForm({ playerSlugValue }: { playerSlugValue: string }) {
  const form = getPlayerRecentForm(playerSlugValue);
  const visibleSignals = form.signals.filter((signal) => !signal.toLowerCase().includes("check the official draw"));

  if (!visibleSignals.length) return null;

  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <h3 className="text-xl font-black">{form.playerName}</h3>
      <p className="mt-3 leading-7 text-zinc-300">{form.summary}</p>
      <ul className="mt-4 space-y-2 text-sm text-zinc-400">
        {visibleSignals.slice(0, 4).map((signal) => (
          <li key={signal}>- {signal}</li>
        ))}
      </ul>
    </article>
  );
}

function WatchOptions({ match }: { match: MatchCenterMatch }) {
  const options = getMatchWatchOptions(match);

  if (!options.length) {
    return null;
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

function getNumberText(match: MatchCenterMatch, keys: string[]) {
  for (const key of keys) {
    const value = match[key];
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return null;
}

function getWinner(match: MatchCenterMatch) {
  const winner = displayText(match.winner) || displayText(match.winnerName) || displayText(match.eventWinner);

  if (!winner) return null;
  if (winner.toLowerCase() === match.player1.toLowerCase()) return match.player1;
  if (winner.toLowerCase() === match.player2.toLowerCase()) return match.player2;

  return winner;
}

function getPlayerProfile(playerSlugValue: string) {
  const canonicalSlug = getCanonicalPlayerSlug(playerSlugValue);
  if (!canonicalSlug) return null;

  const player = players[canonicalSlug as PlayerSlug];
  if (!player) return null;

  const profile = player as {
    name: string;
    tour?: string;
    bio?: string;
    playStyle?: string;
    surfaceStrength?: string;
    watchReasons?: readonly string[];
    tournaments?: readonly string[];
  };

  const details = [
    profile.tour ? `${profile.tour} player` : null,
    profile.surfaceStrength ? `Surface strength: ${profile.surfaceStrength}` : null,
    profile.tournaments?.length ? `Common events: ${profile.tournaments.slice(0, 3).join(", ")}` : null,
  ].filter((item): item is string => Boolean(item));
  const signals = [
    profile.bio,
    profile.playStyle,
    ...(profile.watchReasons || []),
  ].filter((item): item is string => Boolean(item));

  if (!details.length && !signals.length) return null;

  return {
    name: profile.name,
    details,
    signals,
  };
}

function PlayerProfileCard({ playerSlugValue }: { playerSlugValue: string }) {
  const profile = getPlayerProfile(playerSlugValue);

  if (!profile) return null;

  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <h3 className="text-xl font-black">{profile.name}</h3>
      {profile.details.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {profile.details.map((detail) => (
            <span key={detail} className="rounded-full border border-zinc-800 bg-black px-3 py-1 text-xs font-bold text-zinc-300">
              {detail}
            </span>
          ))}
        </div>
      ) : null}
      {profile.signals.length ? (
        <ul className="mt-4 space-y-2 text-sm leading-6 text-zinc-300">
          {profile.signals.slice(0, 4).map((signal) => (
            <li key={signal}>- {signal}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function MatchDataSections({
  match,
  playerOneSlug,
  playerTwoSlug,
}: {
  match: MatchCenterMatch;
  playerOneSlug: string;
  playerTwoSlug: string;
}) {
  const winner = getWinner(match);
  const player1Ranking = getNumberText(match, ["ranking1", "player1Ranking", "firstPlayerRanking", "player1Rank"]);
  const player2Ranking = getNumberText(match, ["ranking2", "player2Ranking", "secondPlayerRanking", "player2Rank"]);
  const rankingSource = displayText(match.rankingSource);
  const scoreFacts = [
    { label: "Score", value: displayText(match.score) },
    { label: "Point score", value: displayText(match.pointScore) },
    { label: "Winner", value: winner },
    { label: `${match.player1} ranking`, value: player1Ranking ? `#${player1Ranking}` : null },
    { label: `${match.player2} ranking`, value: player2Ranking ? `#${player2Ranking}` : null },
    { label: "Ranking source", value: rankingSource },
  ].filter((item) => item.value);
  const profiles = [getPlayerProfile(playerOneSlug || match.player1), getPlayerProfile(playerTwoSlug || match.player2)].filter(Boolean);
  const formOne = getPlayerRecentForm(playerOneSlug || match.player1);
  const formTwo = getPlayerRecentForm(playerTwoSlug || match.player2);
  const hasForm = [formOne, formTwo].some((form) =>
    form.signals.some((signal) => !signal.toLowerCase().includes("check the official draw"))
  );
  const rivalry = getRivalryForMatch(match.player1, match.player2);

  return (
    <>
      {scoreFacts.length ? (
        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-3xl font-black">Match data from the feed</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {scoreFacts.map((item) => (
              <Fact key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </section>
      ) : null}

      {profiles.length ? (
        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-3xl font-black">Player context</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <PlayerProfileCard playerSlugValue={playerOneSlug || match.player1} />
            <PlayerProfileCard playerSlugValue={playerTwoSlug || match.player2} />
          </div>
        </section>
      ) : null}

      {rivalry ? (
        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">Rivalry context</p>
          <h2 className="mt-2 text-3xl font-black">{rivalry.title}</h2>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-300">{rivalry.angle}</p>
          <p className="mt-3 max-w-3xl leading-8 text-zinc-300">{rivalry.surfaceNote}</p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {rivalry.storylines.slice(0, 3).map((storyline) => (
              <div key={storyline} className="rounded-2xl border border-zinc-800 bg-black p-4 text-sm leading-6 text-zinc-300">
                {storyline}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {hasForm ? (
        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-3xl font-black">Recent form and stable signals</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <RecentForm playerSlugValue={playerOneSlug || match.player1} />
            <RecentForm playerSlugValue={playerTwoSlug || match.player2} />
          </div>
        </section>
      ) : null}
    </>
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
  const enrichment = getMatchEnrichment(match);
  const headlineFacts = [
    { label: "Tournament", value: displayText(match.tournament) },
    { label: "Round", value: displayText(match.round) },
    { label: "Date and time", value: formatDateTime(match.startTime) },
    { label: "Court", value: displayText(match.court) || displayText(match.location) },
    { label: "Surface", value: displayText(match.surface) },
    { label: "Status", value: displayText(match.status) },
  ].filter((item) => item.value);
  const enrichmentFacts = [
    { label: "Importance score", value: enrichment.importanceScore },
    { label: "Today", value: enrichment.isToday ? "Yes" : null },
    { label: "Live", value: enrichment.isLive ? "Yes" : null },
    { label: "Upcoming", value: enrichment.isUpcoming ? "Yes" : null },
    { label: "Watch countries", value: enrichment.watchCountries.length || null },
    { label: "Streaming services", value: enrichment.streamingServices.length || null },
    { label: "Top broadcaster", value: enrichment.featuredBroadcasters[0] || null },
    { label: "Context", value: displayText(enrichment.matchContext) },
  ].filter((item) => item.value);
  const hasRecommendedViewing = Boolean(enrichment.streamingServices.length && displayText(enrichment.recommendedViewing));
  const hasCoverageSummary = summary.options.length > 0;

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

        {headlineFacts.length ? (
          <section className="mb-8 grid gap-4 md:grid-cols-3">
            {headlineFacts.map((item) => (
              <Fact key={item.label} label={item.label} value={item.value} />
            ))}
          </section>
        ) : null}

        <MatchDataSections match={match} playerOneSlug={playerOneSlug} playerTwoSlug={playerTwoSlug} />

        <div className="mb-8 grid gap-6">
          {enrichmentFacts.length ? (
            <EnrichmentQuickFacts
              dark
              title={`${enrichment.name} enriched match facts`}
              facts={enrichmentFacts}
            />
          ) : null}
          {hasRecommendedViewing ? (
            <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-400">Recommended viewing</p>
              <h2 className="text-2xl font-black">Best next step before match time</h2>
              <p className="mt-3 leading-7 text-zinc-300">{enrichment.recommendedViewing}</p>
            </section>
          ) : null}
          <EnrichmentLinkGrid
            dark
            title="Related match-center pages"
            groups={[
              { title: "Related matches", links: enrichment.relatedMatches },
              { title: "Related guides", links: enrichment.relatedArticles },
            ]}
          />
        </div>

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

        <WatchOptions match={match} />

        {hasCoverageSummary ? (
          <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-3xl font-black">Free vs paid viewing notes</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <Fact label="Countries matched" value={String(summary.countryCount)} />
              {summary.freeRouteCount ? <Fact label="Free rows" value={String(summary.freeRouteCount)} /> : null}
              {summary.subscriptionRouteCount ? <Fact label="Subscription rows" value={String(summary.subscriptionRouteCount)} /> : null}
            </div>
            <p className="mt-5 leading-8 text-zinc-300">
              A free row means the dataset marks at least one legal free route for that country or tournament group. It does not guarantee this exact court is free. Subscription rows usually require checking the provider plan, device support and match-week schedule.
            </p>
          </section>
        ) : null}

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
