import Link from "next/link";
import { canonicalUrl, robotsFor } from "@/app/lib/technicalSeo";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import LocalTournamentFollowButton from "@/app/components/LocalTournamentFollowButton";
import { EnrichmentLinkGrid, EnrichmentQuickFacts, EnrichmentWatchSummary } from "@/app/components/EnrichmentPanels";
import { getTournamentEditorialProfile } from "@/data/tennisEditorial";
import { getTournamentCalendarEntry, type TournamentCalendarEntry } from "@/app/lib/tournamentCalendar";
import { getApiTennisTournamentFixtureDateRange, type TournamentDateRange } from "@/app/lib/tournamentDateRange";
import { shouldIndexTournamentPage } from "@/app/lib/adsenseIndexing";
import { getStableTournamentHub } from "@/data/tournamentHubs";
import { safePlayerUrl } from "@/data/playerSlugs";
import { getServerMatchesWindow, type ServerMatch } from "@/app/lib/serverMatches";
import {
  getRelatedBroadcasters,
  getRelatedCountries,
  getRelatedPlayers,
  getRelatedStreamingServices,
  getRelatedTournaments,
  getTournamentNetwork,
} from "@/src/lib/intelligence/queries";
import { getTournamentEnrichment } from "@/src/lib/enrichment";

export const dynamic = "force-dynamic";

const CURRENT_SEASON = new Date().getFullYear();

const INDEXABLE_TOURNAMENT_SLUGS = new Set([
  "grand-slam-tournaments",
  "australian-open",
  "roland-garros",
  "french-open",
  "wimbledon",
  "us-open",
  "indian-wells",
  "miami",
  "madrid",
  "rome",
  "monte-carlo",
  "cincinnati",
  "canada",
  "paris",
  "atp-finals",
  "wta-finals",
]);

function buildTournamentSeoTitle(tournamentName: string) {
  return `${tournamentName} ${CURRENT_SEASON}: Live Stream, Schedule, Results & TV`;
}

function buildTournamentSeoDescription(tournamentName: string) {
  return `How to watch ${tournamentName} ${CURRENT_SEASON}: live stream and TV schedule guidance, matches today, upcoming matches, completed results and draw context.`;
}

type Match = Pick<ServerMatch, "id" | "player1" | "player2" | "tournament" | "category" | "status" | "score" | "startTime">;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getMatches(): Promise<Match[]> {
  return getServerMatchesWindow({
    includeFinished: true,
    daysBack: 7,
    daysForward: 14,
    noStore: true,
  });
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function tournamentMatchesSlug(matchTournament: string, slug: string) {
  const normalizedTournament = slugify(matchTournament || "");

  const aliases: Record<string, string[]> = {
    "roland-garros": [
      "roland-garros",
      "french-open",
      "atp-french-open",
      "wta-french-open",
      "french-open-men-singles",
      "french-open-women-singles",
      "roland-garros-men-singles",
      "roland-garros-women-singles",
    ],
    // add other tournaments aliases here if needed
  };

  const acceptedSlugs = aliases[slug] || [slug];

  return acceptedSlugs.some(
    (acceptedSlug) =>
      normalizedTournament.includes(acceptedSlug) ||
      acceptedSlug.includes(normalizedTournament)
  );
}

function unslugify(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function matchSlug(match: Match) {
  return slugify(`${match.player1}-vs-${match.player2}`);
}


function getTournamentDateWindow(matches: Match[]) {
  const dates = matches
    .map((match) => match.startTime ? new Date(match.startTime) : null)
    .filter((date): date is Date => date instanceof Date && !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) return null;

  return {
    start: dates[0],
    end: dates[dates.length - 1],
  };
}

function formatTournamentDate(date: Date | string) {
  const parsedDate = typeof date === "string" ? new Date(`${date}T00:00:00Z`) : date;

  if (Number.isNaN(parsedDate.getTime())) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function formatTournamentDateRange(dateWindow: ReturnType<typeof getTournamentDateWindow>) {
  if (!dateWindow) return null;

  const start = formatTournamentDate(dateWindow.start);
  const end = formatTournamentDate(dateWindow.end);

  if (!start || !end) return null;
  if (start === end) return start;

  return `${start} – ${end}`;
}

function formatCalendarDateRange(calendarEntry: TournamentCalendarEntry | null) {
  if (!calendarEntry?.startDate || !calendarEntry.endDate) return null;

  const start = formatTournamentDate(calendarEntry.startDate);
  const end = formatTournamentDate(calendarEntry.endDate);

  if (!start || !end) return null;
  if (start === end) return start;

  return `${start} – ${end}`;
}

function formatApiTournamentDateRange(apiRange: TournamentDateRange | null) {
  if (!apiRange?.startDate || !apiRange.endDate) return null;

  const start = formatTournamentDate(apiRange.startDate);
  const end = formatTournamentDate(apiRange.endDate);

  if (!start || !end) return null;
  if (start === end) return start;

  return `${start} – ${end}`;
}

function getItfEstimatedTournamentWeek(slug: string, dateWindow: ReturnType<typeof getTournamentDateWindow>) {
  if (!dateWindow || !/^[wm]\d+(-|$)/i.test(slug)) return null;

  const anchorDate = new Date(dateWindow.start);
  if (Number.isNaN(anchorDate.getTime())) return null;

  const day = anchorDate.getUTCDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  const start = new Date(Date.UTC(
    anchorDate.getUTCFullYear(),
    anchorDate.getUTCMonth(),
    anchorDate.getUTCDate() - daysSinceMonday
  ));
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + 6);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

function formatEstimatedTournamentWeek(estimatedWeek: ReturnType<typeof getItfEstimatedTournamentWeek>) {
  if (!estimatedWeek) return null;

  const start = formatTournamentDate(estimatedWeek.startDate);
  const end = formatTournamentDate(estimatedWeek.endDate);

  if (!start || !end) return null;
  if (start === end) return start;

  return `${start} – ${end}`;
}

function parseMatchTime(value?: string | null) {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getLocalDateKey(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function isTodayMatch(match: Match, now: Date) {
  const startTime = parseMatchTime(match.startTime);
  return startTime ? getLocalDateKey(startTime) === getLocalDateKey(now) : false;
}

function isLiveMatch(match: Match) {
  return match.status?.toUpperCase() === "LIVE";
}

function isCompletedMatch(match: Match) {
  const normalized = match.status?.toUpperCase() || "";
  return ["FINISHED", "COMPLETED", "ENDED", "FINAL", "RETIRED", "WALKOVER"].includes(normalized);
}

function isCancelledMatch(match: Match) {
  const normalized = match.status?.toUpperCase() || "";
  return ["CANCELLED", "CANCELED"].includes(normalized);
}

function isScheduledMatch(match: Match) {
  return !isLiveMatch(match) && !isCompletedMatch(match) && !isCancelledMatch(match);
}

function getMatchTimestamp(match: Match) {
  const startTime = parseMatchTime(match.startTime);
  return startTime ? startTime.getTime() : Number.MAX_SAFE_INTEGER;
}

function sortUpcomingMatches(a: Match, b: Match) {
  if (isLiveMatch(a) && !isLiveMatch(b)) return -1;
  if (!isLiveMatch(a) && isLiveMatch(b)) return 1;

  return getMatchTimestamp(a) - getMatchTimestamp(b);
}

function sortCompletedMatches(a: Match, b: Match) {
  return getMatchTimestamp(b) - getMatchTimestamp(a);
}

function formatMatchDateTime(value?: string | null) {
  const parsed = parseMatchTime(value);
  if (!parsed) return "Time to be announced";

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(parsed);
}

function getTournamentUrl(tournament: string) {
  const slug = slugify(tournament || "");
  return slug ? `/tournament/${slug}` : "/tournament";
}

function getMatchStatusBadge(match: Match) {
  if (isLiveMatch(match)) return { label: "Live", className: "bg-red-500 text-white" };
  if (isCompletedMatch(match)) return { label: "Completed", className: "bg-zinc-700 text-white" };
  if (match.status === "SUSPENDED") return { label: "Suspended", className: "bg-yellow-500 text-black" };
  if (match.status === "POSTPONED") return { label: "Postponed", className: "bg-yellow-500 text-black" };
  if (isCancelledMatch(match)) return { label: "Cancelled", className: "bg-zinc-600 text-white" };
  return { label: "Scheduled", className: "bg-green-400 text-black" };
}

function PlayerLink({ name }: { name: string }) {
  const href = safePlayerUrl(name);

  if (!href) return <span>{name}</span>;

  return (
    <Link href={href} className="hover:text-green-300">
      {name}
    </Link>
  );
}

function TournamentMatchCard({ match }: { match: Match }) {
  const badge = getMatchStatusBadge(match);

  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-green-500">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${badge.className}`}>
          {badge.label}
        </span>
        <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-zinc-300">
          {match.category}
        </span>
      </div>

      <h3 className="text-2xl font-black leading-tight">
        <PlayerLink name={match.player1} />
        <span className="mx-2 text-zinc-500">vs</span>
        <PlayerLink name={match.player2} />
      </h3>

      <p className="mt-3 text-sm text-zinc-400">{formatMatchDateTime(match.startTime)}</p>
      {match.score ? <p className="mt-2 text-sm font-bold text-zinc-200">Score: {match.score}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/match/${matchSlug(match)}`} className="rounded-xl bg-green-500 px-3 py-2 text-sm font-black text-black hover:bg-green-400">
          {isLiveMatch(match) ? "Follow live" : isCompletedMatch(match) ? "Open result" : "Open match"}
        </Link>
        <Link href={getTournamentUrl(match.tournament)} className="rounded-xl border border-zinc-700 px-3 py-2 text-sm font-black text-white hover:border-green-400">
          Tournament
        </Link>
      </div>
    </article>
  );
}

function EmptyTournamentState({
  tournamentName,
  kind,
}: {
  tournamentName: string;
  kind: "today" | "upcoming" | "completed";
}) {
  const copy =
    kind === "today"
      ? `No ${tournamentName} matches are listed for today in the current feed.`
      : kind === "upcoming"
        ? `No future ${tournamentName} matches are listed in the current feed.`
        : `No completed ${tournamentName} results are available in this feed yet.`;

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 text-zinc-300">
      <p className="font-bold text-white">{copy}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-400">
        Use the live tennis hub, today&apos;s schedule and official tournament pages for updated order-of-play details.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link href="/live-tennis" className="rounded-xl bg-green-500 px-3 py-2 text-sm font-black text-black">Live tennis</Link>
        <Link href="/today" className="rounded-xl border border-zinc-700 px-3 py-2 text-sm font-black text-white">Matches today</Link>
        <Link href="/tennis-on-tv-today" className="rounded-xl border border-zinc-700 px-3 py-2 text-sm font-black text-white">TV schedule</Link>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const stableHub = getStableTournamentHub(slug);
  const tournamentName = stableHub?.name || unslugify(slug);
  const enrichment = getTournamentEnrichment({
    slug,
    name: tournamentName,
    level: stableHub?.level,
    surface: stableHub?.surface,
    location: stableHub?.location,
    seasonWindow: stableHub?.seasonWindow,
  });
  const calendarEntry = await getTournamentCalendarEntry(slug);
  const indexable = shouldIndexTournamentPage({
    slug,
    name: tournamentName,
    hasCalendarEntry: Boolean(calendarEntry),
    hasEditorialProfile: INDEXABLE_TOURNAMENT_SLUGS.has(slug) || Boolean(stableHub),
  });

  return {
    title: enrichment.seo.title || buildTournamentSeoTitle(tournamentName),
    description: enrichment.seo.description || buildTournamentSeoDescription(tournamentName),
    keywords: enrichment.seo.keywords,
    // AdSense quality: unknown tournament pages can be empty when the live API has
    // no matches, so only stable editorial/calendar-backed tournaments can index.
    robots: robotsFor({ index: indexable }),
    alternates: {
      canonical: canonicalUrl(`/tournament/${slug}`),
    },
    openGraph: {
      title: enrichment.seo.title || buildTournamentSeoTitle(tournamentName),
      description: enrichment.seo.description || buildTournamentSeoDescription(tournamentName),
      url: canonicalUrl(`/tournament/${slug}`),
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: enrichment.seo.title || buildTournamentSeoTitle(tournamentName),
      description: enrichment.seo.description || buildTournamentSeoDescription(tournamentName),
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const matches = await getMatches();

  const tournamentMatches = matches.filter((match) =>
    tournamentMatchesSlug(match.tournament || "", slug)
  );

  // readable name fallback for specific slugs
  const readableTournamentName =
    slug === "roland-garros"
      ? "Roland Garros"
      : slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

  const stableHub = getStableTournamentHub(slug);
  const stableHubName = stableHub?.name;
  const stableHubRelatedLinks = stableHub?.relatedLinks || [];
  const tournamentName = tournamentMatches[0]?.tournament || stableHub?.name || unslugify(slug);
  const tournamentNetwork = getTournamentNetwork(slug, { matches: tournamentMatches });
  const relatedPlayerLinks = getRelatedPlayers(tournamentNetwork, 8);
  const relatedTournamentLinks = getRelatedTournaments(tournamentNetwork, 6);
  const relatedCountryLinks = getRelatedCountries(tournamentNetwork, 8);
  const relatedBroadcasterLinks = getRelatedBroadcasters(tournamentNetwork, 8);
  const relatedStreamingLinks = getRelatedStreamingServices(tournamentNetwork, 6);
  const enrichment = getTournamentEnrichment({
    slug,
    name: tournamentName,
    level: stableHub?.level,
    surface: stableHub?.surface,
    location: stableHub?.location,
    seasonWindow: stableHub?.seasonWindow,
  }, { matches: tournamentMatches as any });

  const liveCount = tournamentMatches.filter(isLiveMatch).length;

  const tournamentProfile = getTournamentEditorialProfile(slug, tournamentName);
  const tournamentDateWindow = getTournamentDateWindow(tournamentMatches);
  const calendarEntry = await getTournamentCalendarEntry(slug);
  const apiTournamentDateRange = calendarEntry
    ? null
    : await getApiTennisTournamentFixtureDateRange(slug, tournamentName);
  const matchFeedDateRange = formatTournamentDateRange(tournamentDateWindow);
  const calendarDateRange = formatCalendarDateRange(calendarEntry);
  const apiFixtureDateRange = formatApiTournamentDateRange(apiTournamentDateRange);
  const estimatedItfWeek = getItfEstimatedTournamentWeek(slug, tournamentDateWindow);
  const estimatedItfWeekRange = formatEstimatedTournamentWeek(estimatedItfWeek);
  const isApiFixtureRange = apiTournamentDateRange?.confidence === "fixture-range";
  const verifiedTournamentDateRange = calendarDateRange;
  const matchCoverageDateRange = matchFeedDateRange || (isApiFixtureRange ? apiFixtureDateRange : null);
  const visibleTournamentDateRange = verifiedTournamentDateRange || estimatedItfWeekRange;
  const tournamentDateConfidence = calendarDateRange
    ? "official"
    : estimatedItfWeekRange
        ? "estimated-itf-week"
        : "unknown";
  const hasAuthoritativeTournamentDates = tournamentDateConfidence === "official";
  const tournamentDateLabel = hasAuthoritativeTournamentDates
    ? "Tournament dates"
    : tournamentDateConfidence === "estimated-itf-week"
      ? "Estimated ITF tournament week"
      : "Tournament dates";
  const tournamentDateNote = hasAuthoritativeTournamentDates
    ? "These dates come from a verified tournament calendar. Match times and court assignments can still change during the event."
    : tournamentDateConfidence === "estimated-itf-week"
      ? "This week is calculated from the first published ITF fixture date for this tournament slug. Confirm the official tournament dates with ITF before relying on them."
      : "Tournament dates are not verified in the local calendar yet.";

  const suspendedCount = tournamentMatches.filter(
    (match) => match.status === "SUSPENDED"
  ).length;
  const now = new Date();
  const todayMatches = tournamentMatches
    .filter((match) => isTodayMatch(match, now) && !isCompletedMatch(match))
    .sort(sortUpcomingMatches);
  const upcomingMatches = tournamentMatches
    .filter((match) => isScheduledMatch(match) && !isTodayMatch(match, now))
    .sort(sortUpcomingMatches);
  const completedMatches = tournamentMatches
    .filter(isCompletedMatch)
    .sort(sortCompletedMatches);
  const cancelledMatches = tournamentMatches.filter(isCancelledMatch).length;
  const featuredPlayers = Array.from(
    new Set(
      tournamentMatches
        .flatMap((match) => [match.player1, match.player2])
        .filter((name) => safePlayerUrl(name))
    )
  ).slice(0, 8);
  const knownInfoItems = [
    {
      label: "Current feed matches",
      value: tournamentMatches.length ? `${tournamentMatches.length} match entries` : "No current feed entries",
      note: tournamentMatches.length
        ? "Split below into today, upcoming and completed matches."
        : "This page stays useful with stable context while the live feed has no matching entries.",
    },
    {
      label: "Event window",
      value: visibleTournamentDateRange || stableHub?.seasonWindow || "Needs calendar verification",
      note: visibleTournamentDateRange
        ? tournamentDateNote
        : "Best source: official tournament calendar, then ATP/WTA/ITF calendar data.",
    },
    {
      label: "Location",
      value: stableHub?.location || "Event-specific location needed",
      note: stableHub?.location
        ? "Stable tournament-hub data."
        : "Best source: official tournament profile or tour calendar entry.",
    },
    {
      label: "Viewing route",
      value: "Country and tournament specific",
      note: "Best source: official tournament broadcaster page, local TV listings and licensed streaming providers.",
    },
  ];
  const missingDataSources = [
    {
      label: "Exact dates",
      source: "Official tournament calendars, ATP/WTA event pages and the stored local calendar.",
    },
    {
      label: "Draws and rounds",
      source: "Official draw PDFs/pages from the tournament, ATP, WTA or ITF.",
    },
    {
      label: "Court assignments",
      source: "Daily order of play from the tournament website, then match-feed updates close to start time.",
    },
    {
      label: "TV and streaming",
      source: "Official broadcaster lists, local TV schedules and provider event pages by country.",
    },
  ];

  const sportsEventSchema = verifiedTournamentDateRange
    ? {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: tournamentName,
        sport: "Tennis",
        startDate: calendarEntry?.startDate || apiTournamentDateRange?.startDate,
        endDate: calendarEntry?.endDate || apiTournamentDateRange?.endDate,
        url: canonicalUrl(`/tournament/${slug}`),
        description: buildTournamentSeoDescription(tournamentName),
        organizer: { "@type": "Organization", name: "Official tournament organizer" },
      }
    : null;
  const tournamentEventSchema = verifiedTournamentDateRange
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: tournamentName,
        startDate: calendarEntry?.startDate || apiTournamentDateRange?.startDate,
        endDate: calendarEntry?.endDate || apiTournamentDateRange?.endDate,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        location: stableHub?.location ? { "@type": "Place", name: stableHub.location } : undefined,
        url: canonicalUrl(`/tournament/${slug}`),
        description: buildTournamentSeoDescription(tournamentName),
      }
    : null;
  const matchSportsEventSchema = tournamentMatches.filter((match) => match.startTime).slice(0, 8).map((match) => ({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${match.player1} vs ${match.player2}`,
    sport: "Tennis",
    startDate: match.startTime || undefined,
    eventStatus: isCompletedMatch(match)
      ? "https://schema.org/EventCompleted"
      : isLiveMatch(match)
        ? "https://schema.org/EventInProgress"
        : "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: tournamentName },
    competitor: [
      { "@type": "Person", name: match.player1 },
      { "@type": "Person", name: match.player2 },
    ],
    url: `https://watchtennistoday.com/match/${matchSlug(match)}`,
  }));
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <nav className="text-sm text-zinc-400 mb-6 flex flex-wrap gap-2">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link href="/tournament" className="hover:text-white">
            Tournaments
          </Link>
          <span>/</span>
          <span className="text-white">{tournamentName}</span>
        </nav>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-green-400">
            Tournament hub
          </p>
          <h1 className="text-5xl font-black leading-tight md:text-7xl">
            {tournamentName}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Follow {tournamentName} matches today, upcoming schedule, completed results, draw context and legal TV or streaming guidance.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {stableHub?.location ? (
              <div className="rounded-2xl border border-zinc-800 bg-black p-4">
                <p className="text-xs font-black uppercase text-zinc-500">Location</p>
                <p className="mt-1 font-black text-white">{stableHub.location}</p>
              </div>
            ) : null}
            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              <p className="text-xs font-black uppercase text-zinc-500">Tour / level</p>
              <p className="mt-1 font-black text-white">{stableHub?.level || tournamentProfile.level}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              <p className="text-xs font-black uppercase text-zinc-500">Surface</p>
              <p className="mt-1 font-black text-white">{stableHub?.surface || tournamentProfile.surface}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              <p className="text-xs font-black uppercase text-zinc-500">Dates</p>
              <p className="mt-1 font-black text-white">{visibleTournamentDateRange || stableHub?.seasonWindow || "Tournament dates not verified"}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="#todays-matches" className="rounded-full bg-green-500 px-4 py-2 text-sm font-black text-black hover:bg-green-400">Today&apos;s matches</Link>
            <Link href="#upcoming-matches" className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black text-white hover:border-green-400">Upcoming</Link>
            <Link href="#completed-matches" className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black text-white hover:border-green-400">Results</Link>
            <Link href="#how-to-watch" className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black text-white hover:border-green-400">How to watch</Link>
            <Link href={`/can-i-watch/${slug}/poland`} className="rounded-full border border-emerald-500 px-4 py-2 text-sm font-black text-emerald-300 hover:bg-emerald-500 hover:text-black">Can I watch?</Link>
            <Link href="/live-tennis" className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black text-white hover:border-green-400">Live tennis</Link>
            <Link href="/today" className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black text-white hover:border-green-400">Matches today</Link>
          </div>
        </section>

        <div className="sr-only">
          🎾 {tournamentName} Live Matches
        </div>

        <p className="hidden text-zinc-300 text-lg leading-8 mb-5">
          Watch {tournamentName} tennis matches live today with match schedules,
          TV channels, streaming information, live scores and tournament updates.
        </p>

        {visibleTournamentDateRange ? (
          <p className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-zinc-300">
            <span className="font-black text-white">
              {tournamentDateLabel}:
            </span>{" "}
            {visibleTournamentDateRange}. {tournamentDateNote}
            {matchCoverageDateRange && !verifiedTournamentDateRange ? (
              <>
                {" "}Current match-feed coverage: {matchCoverageDateRange}.
              </>
            ) : null}
          </p>
        ) : matchCoverageDateRange ? (
          <p className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-zinc-300">
            <span className="font-black text-white">
              Match-feed coverage:
            </span>{" "}
            {matchCoverageDateRange}. The full tournament dates are not verified in the local calendar yet, so this page does not label the feed window as official event dates.
          </p>
        ) : (
          <p className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-zinc-400">
            Tournament dates are not available from the current match feed or
            tournament calendar yet. This page will show dates automatically
            once scheduled matches or verified calendar data are available.
          </p>
        )}

        <div className="mb-8 grid gap-6">
          <EnrichmentQuickFacts
            dark
            title={`${tournamentName} enriched quick facts`}
            facts={[
              { label: "Tour", value: enrichment.tour || "Needs verification" },
              { label: "Surface", value: enrichment.surface || stableHub?.surface || tournamentProfile.surface },
              { label: "Country", value: enrichment.country || stableHub?.location || "Needs verification" },
              { label: "Season", value: enrichment.season || visibleTournamentDateRange || "Needs calendar verification" },
              { label: "Grand Slam", value: enrichment.isGrandSlam ? "Yes" : "No" },
              { label: "Live matches", value: enrichment.hasLiveMatches ? "Yes" : "No" },
              { label: "Broadcast countries", value: enrichment.broadcastCountries.length },
              { label: "Streaming providers", value: enrichment.streamingProviders.length },
            ]}
          />
          <EnrichmentWatchSummary
            dark
            title={`${tournamentName} coverage summary`}
            availability={{
              countries: enrichment.broadcastCountries,
              broadcasters: [],
              streamingServices: enrichment.streamingProviders,
              hasFreeOption: false,
              requiresSubscription: enrichment.streamingProviders.length > 0,
            }}
            summary={enrichment.coverageSummary}
          />
          <EnrichmentLinkGrid
            dark
            title={`${tournamentName} related tennis pages`}
            groups={[
              { title: "Featured players", links: enrichment.featuredPlayers },
              { title: "Related tournaments", links: enrichment.relatedTournaments },
              { title: "Countries", links: relatedCountryLinks },
              { title: "Broadcasters and streaming", links: [...relatedBroadcasterLinks, ...relatedStreamingLinks] },
            ]}
          />
        </div>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-green-400">Tournament guide</p>
          <h2 className="mb-4 text-3xl font-black">{tournamentName} tournament context</h2>
          <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4 text-zinc-300 leading-8">
              {stableHub ? (
                <>
                  <p>{stableHub.summary}</p>
                  <p>{stableHub.whyItMatters}</p>
                  <p>{stableHub.watchNote}</p>
                </>
              ) : (
                <>
                  <p>{tournamentProfile.history}</p>
                  <p>{tournamentProfile.format}</p>
                  <p>{tournamentProfile.viewingContext}</p>
                </>
              )}
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <div className="grid gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Dates</p>
                  <p className="mt-1 font-black text-white">{visibleTournamentDateRange || stableHub?.seasonWindow || "Tournament dates not verified"}</p>
                  {tournamentDateConfidence === "estimated-itf-week" ? (
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Estimated from the published ITF fixture week
                    </p>
                  ) : matchCoverageDateRange && !verifiedTournamentDateRange ? (
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Current feed coverage: {matchCoverageDateRange}
                    </p>
                  ) : !hasAuthoritativeTournamentDates && verifiedTournamentDateRange ? (
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Inferred from fixture range
                    </p>
                  ) : null}
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Level</p>
                  <p className="mt-1 font-black text-white">{stableHub?.level || tournamentProfile.level}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Surface / conditions</p>
                  <p className="mt-1 font-black text-white">{stableHub?.surface || tournamentProfile.surface}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Fan checklist</p>
                  <ul className="mt-2 space-y-2 text-sm text-zinc-300">
                    {tournamentProfile.fanChecklist.map((item) => (
                      <li key={item}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">Known data</p>
              <h2 className="mt-2 text-3xl font-black">What we know about {tournamentName}</h2>
            </div>
            <Link href="/how-we-source-data" className="text-sm font-black text-green-400 hover:text-green-300">
              Data sourcing
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {knownInfoItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="text-xs font-black uppercase tracking-wide text-zinc-500">{item.label}</p>
                <p className="mt-2 text-xl font-black text-white">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-zinc-800 bg-black p-5">
            <h3 className="text-xl font-black">Where to get missing details</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {missingDataSources.map((item) => (
                <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="font-black text-white">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{item.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mb-8">
          <LocalTournamentFollowButton slug={slug} name={tournamentName} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link
            href="/live-tennis"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-red-500 hover:text-red-400 transition-all"
          >
            🔴 Live Tennis
          </Link>

          <Link
            href="/tv-schedule"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 hover:text-green-400 transition-all"
          >
            📺 TV Schedule
          </Link>

          <Link
            href="/best-ways-to-watch-tennis-online"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-yellow-500 hover:text-yellow-400 transition-all"
          >
            🌍 Watch Online
          </Link>
        </div>
        <section className="mb-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-3xl font-black">Popular Tournament Pages</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="/french-open"
              className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
            >
              <h3 className="text-xl font-black mb-2">French Open Live</h3>
              <p className="text-zinc-400">
                Live matches, scores and streaming information.
              </p>
            </a>

            <a
              href="/french-open-results"
              className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
            >
              <h3 className="text-xl font-black mb-2">French Open Results</h3>
              <p className="text-zinc-400">
                Latest Roland Garros match results and updates.
              </p>
            </a>

            <a
              href="/where-to-watch-french-open"
              className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
            >
              <h3 className="text-xl font-black mb-2">French Open TV Schedule</h3>
              <p className="text-zinc-400">
                TV channels, broadcast times and official coverage.
              </p>
            </a>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-500 text-sm mb-2">{visibleTournamentDateRange ? "Tournament dates" : "Feed coverage"}</p>
            <p className="text-2xl font-black">{visibleTournamentDateRange || matchCoverageDateRange || "TBA"}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-500 text-sm mb-2">Tournament matches</p>
            <p className="text-4xl font-black">{tournamentMatches.length}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-500 text-sm mb-2">Live now</p>
            <p className="text-4xl font-black text-red-400">{liveCount}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-500 text-sm mb-2">Suspended</p>
            <p className="text-4xl font-black text-yellow-400">
              {suspendedCount}
            </p>
          </div>
        </section>

        {cancelledMatches > 0 ? (
          <p className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-sm text-zinc-400">
            {cancelledMatches} cancelled match{cancelledMatches === 1 ? "" : "es"} in the feed are excluded from the schedule sections below.
          </p>
        ) : null}

        <section id="todays-matches" className="mb-12 scroll-mt-24">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">Matches today</p>
              <h2 className="mt-2 text-3xl font-black">Today&apos;s Matches</h2>
            </div>
            <Link href="/today" className="text-sm font-black text-green-400 hover:text-green-300">
              Full tennis schedule today
            </Link>
          </div>
          {todayMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {todayMatches.map((match) => (
                <TournamentMatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyTournamentState tournamentName={tournamentName} kind="today" />
          )}
        </section>

        <section id="upcoming-matches" className="mb-12 scroll-mt-24">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">Schedule</p>
              <h2 className="mt-2 text-3xl font-black">Upcoming Matches</h2>
            </div>
            <Link href="/live-tennis" className="text-sm font-black text-green-400 hover:text-green-300">
              Live tennis hub
            </Link>
          </div>
          {upcomingMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingMatches.map((match) => (
                <TournamentMatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyTournamentState tournamentName={tournamentName} kind="upcoming" />
          )}
        </section>

        <section id="completed-matches" className="mb-12 scroll-mt-24">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">Results</p>
              <h2 className="mt-2 text-3xl font-black">Completed Matches</h2>
            </div>
            <Link href="/tennis-results-today" className="text-sm font-black text-green-400 hover:text-green-300">
              Tennis results today
            </Link>
          </div>
          {completedMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {completedMatches.map((match) => (
                <TournamentMatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <EmptyTournamentState tournamentName={tournamentName} kind="completed" />
          )}
        </section>

        <section id="featured-players" className="mb-12 scroll-mt-24 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-3xl font-black">Featured Players</h2>
          {featuredPlayers.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {featuredPlayers.map((player) => {
                const href = safePlayerUrl(player);
                if (!href) return null;

                return (
                  <Link key={player} href={href} className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black text-white hover:border-green-400">
                    {player}
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="leading-8 text-zinc-300">
              Player links will appear here when the current tournament feed includes players with available profile pages.
            </p>
          )}
        </section>

        <section id="tournament-schedule" className="mb-12 scroll-mt-24 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-3xl font-black">{tournamentName} Schedule</h2>
          <p className="max-w-3xl leading-8 text-zinc-300">
            Tennis schedules can change when earlier matches run long, weather interrupts play or courts are reassigned. Use the links below to cross-check current match windows and TV listings.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/today" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black hover:border-green-400">Matches today</Link>
            <Link href="/tennis-order-of-play-today" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black hover:border-green-400">Order of play</Link>
            <Link href="/tennis-on-tv-today" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black hover:border-green-400">Tennis on TV today</Link>
            <Link href="/tv-schedule" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black hover:border-green-400">TV schedule</Link>
            <Link href="/tennis-time-zone-converter" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black hover:border-green-400">Time zone converter</Link>
            <Link href="/official-tennis-broadcasters-guide" className="rounded-2xl border border-zinc-800 bg-black p-4 font-black hover:border-green-400">Official broadcaster guide</Link>
          </div>
        </section>

        {false ? (
        <section className="hidden">
          {tournamentMatches.length > 0 ? (
            tournamentMatches.map((match) => (
              <a
                key={match.id}
                href={`/match/${matchSlug(match)}`}
                className="block bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
              >
                <div className="flex justify-between gap-4 mb-4">
                  {match.status === "LIVE" ? (
                    <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                      🔴 LIVE NOW
                    </span>
                  ) : match.status === "SUSPENDED" ? (
                    <span className="bg-yellow-500 text-black text-xs font-black px-3 py-1 rounded-full">
                      ⏸ SUSPENDED
                    </span>
                  ) : (
                    <span className="bg-zinc-700 text-white text-xs font-black px-3 py-1 rounded-full">
                      {match.status}
                    </span>
                  )}

                  <span className="text-zinc-400">{match.category}</span>
                </div>

                <h2 className="text-3xl font-black mb-3">
                  {match.player1}
                  <br />
                  vs
                  <br />
                  {match.player2}
                </h2>

                <p className="text-zinc-400 mb-3">{match.tournament}</p>

                <p className="text-zinc-300 mb-3">
                  Score: <span className="font-bold">{match.score || "-"}</span>
                </p>

                {match.startTime ? (
                  <p className="text-zinc-400">
                    Start time: {new Date(match.startTime).toLocaleString()}
                  </p>
                ) : (
                  <p className="text-zinc-500">Start time not available yet</p>
                )}
              </a>
            ))
          ) : (
            slug === "roland-garros" ? (
              <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                <h2 className="mb-4 text-3xl font-black">Roland Garros hub</h2>
                <p className="mb-6 text-zinc-300 max-w-3xl">
                  Roland Garros matches may not be available in the current live
                  schedule. Use the pages below for French Open live coverage,
                  results, TV schedule and country-by-country streaming options.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <a
                    href="/french-open"
                    className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
                  >
                    <h3 className="text-xl font-black">French Open Live</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      Roland Garros live coverage, match links and updates.
                    </p>
                  </a>

                  <a
                    href="/french-open-results"
                    className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
                  >
                    <h3 className="text-xl font-black">French Open Results</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      Latest match results and completed scores.
                    </p>
                  </a>

                  <a
                    href="/where-to-watch-french-open"
                    className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
                  >
                    <h3 className="text-xl font-black">French Open TV Schedule</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      TV channels, broadcast times and official coverage.
                    </p>
                  </a>

                  <a
                    href="/french-open-order-of-play"
                    className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
                  >
                    <h3 className="text-xl font-black">Order of Play</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      Today&apos;s Roland Garros schedule and court assignments.
                    </p>
                  </a>

                  <a
                    href="/where-to-watch-french-open"
                    className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
                  >
                    <h3 className="text-xl font-black">Where to Watch</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      Country-by-country Roland Garros TV and streaming guide.
                    </p>
                  </a>

                  <a
                    href="/watch-french-open-online"
                    className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
                  >
                    <h3 className="text-xl font-black">Watch Online</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      Streaming options and official Roland Garros partners.
                    </p>
                  </a>
                </div>
              </section>
            ) : stableHubName ? (
              <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                <h2 className="mb-4 text-3xl font-black">{stableHubName} hub</h2>
                <p className="mb-5 max-w-3xl leading-8 text-zinc-300">
                  No live match-feed entries are available for this tournament right now. This page still gives stable tournament context so readers are not left on a thin empty page while the event is outside the current schedule window.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stableHubRelatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
                    >
                      <h3 className="text-xl font-black">{link.label}</h3>
                      <p className="mt-3 text-sm leading-6 text-zinc-400">
                        Continue with a related guide, schedule page or official-viewing context.
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
                No matches found for this tournament right now. Check back soon
                for schedule updates.
              </div>
            )
          )}
        </section>
        ) : null}

        <section id="how-to-watch" className="mt-12 scroll-mt-24 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">
            📺 Where to Watch {tournamentName}
          </h2>

          <p className="text-zinc-300 leading-8 mb-5">
            {(stableHub?.name || tournamentName)} matches may be available on official broadcasters,
            streaming services and sports TV platforms depending on your country.
            Always check official tennis streaming sources and local TV schedules
            for exact coverage.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/best-ways-to-watch-tennis-online"
              className="inline-block bg-green-500 text-black font-black px-5 py-3 rounded-2xl hover:bg-green-400 transition-all"
            >
              Best ways to watch tennis online
            </Link>
            <Link
              href="/tennis-on-tv-today"
              className="inline-block border border-zinc-700 px-5 py-3 rounded-2xl font-black hover:border-green-500 hover:text-green-400 transition-all"
            >
              Tennis on TV today
            </Link>
            <Link
              href="/watch-tennis-in"
              className="inline-block border border-zinc-700 px-5 py-3 rounded-2xl font-black hover:border-green-500 hover:text-green-400 transition-all"
            >
              Country watch guides
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm font-black">
            <Link href="/watch-tennis-in/usa" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-green-400">USA</Link>
            <Link href="/watch-tennis-in/uk" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-green-400">UK</Link>
            <Link href="/watch-tennis-in/canada" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-green-400">Canada</Link>
            <Link href="/watch-tennis-in/australia" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-green-400">Australia</Link>
          </div>
        </section>

        {relatedPlayerLinks.length || relatedCountryLinks.length || relatedBroadcasterLinks.length || relatedStreamingLinks.length || relatedTournamentLinks.length ? (
          <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-400">
              Tennis intelligence graph
            </p>
            <h2 className="text-3xl font-black">Related content for {tournamentName}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                { title: "Top players", links: relatedPlayerLinks },
                { title: "Countries broadcasting", links: relatedCountryLinks },
                { title: "Related events", links: relatedTournamentLinks },
                { title: "Streaming services", links: [...relatedBroadcasterLinks, ...relatedStreamingLinks] },
              ].map((group) => (
                <div key={group.title} className="rounded-2xl border border-zinc-800 bg-black p-4">
                  <h3 className="font-black text-white">{group.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.links.slice(0, 8).map((link) => (
                      <Link key={link.id} href={link.href} className="rounded-full border border-zinc-700 px-3 py-2 text-xs font-black text-zinc-200 hover:border-green-400">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
</div>
      {sportsEventSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEventSchema) }}
        />
      ) : null}
      {tournamentEventSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tournamentEventSchema) }}
        />
      ) : null}
      {matchSportsEventSchema.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(matchSportsEventSchema) }}
        />
      ) : null}
      <BreadcrumbSchema
  items={[
    {
      name: "Home",
      url: "https://watchtennistoday.com",
    },
    {
      name: "Tournaments",
      url: "https://watchtennistoday.com/tournament",
    },
    {
      name: typeof readableTournamentName !== "undefined" ? readableTournamentName : tournamentName,
      url: canonicalUrl(`/tournament/${slug}`),
    },
  ]}
/>
    </main>
  );
}
