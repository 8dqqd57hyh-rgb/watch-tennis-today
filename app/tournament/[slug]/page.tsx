import Link from "next/link";
import { headers } from "next/headers";
import AuthorBox from "@/app/components/AuthorBox";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import LocalTournamentFollowButton from "@/app/components/LocalTournamentFollowButton";
import EmailCapture from "@/components/EmailCapture";
import { getTournamentEditorialProfile } from "@/data/tennisEditorial";
import { getTournamentCalendarEntry, type TournamentCalendarEntry } from "@/app/lib/tournamentCalendar";
import { getApiTennisTournamentFixtureDateRange, type TournamentDateRange } from "@/app/lib/tournamentDateRange";
import { shouldIndexTournamentPage } from "@/app/lib/adsenseIndexing";
import { getStableTournamentHub } from "@/data/tournamentHubs";

export const dynamic = "force-dynamic";

const CURRENT_SEASON = new Date().getFullYear();

const INDEXABLE_TOURNAMENT_SLUGS = new Set([
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
  return `${tournamentName} ${CURRENT_SEASON}: Schedule, Results, Draw & Live Coverage`;
}

function buildTournamentSeoDescription(tournamentName: string) {
  return `Follow ${tournamentName} ${CURRENT_SEASON} with today's schedule, live match updates, results, draw information and legal TV or streaming options.`;
}

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string | null;
};

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) return "http://localhost:3000";

  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

async function getMatches(): Promise<Match[]> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/matches?daysBack=3&daysForward=3`, {
    cache: "no-store",
  });

  if (!response.ok) return [];

  return response.json();
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
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
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

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const stableHub = getStableTournamentHub(slug);
  const tournamentName = stableHub?.name || unslugify(slug);
  const calendarEntry = await getTournamentCalendarEntry(slug);
  const indexable = shouldIndexTournamentPage({
    slug,
    name: tournamentName,
    hasCalendarEntry: Boolean(calendarEntry),
    hasEditorialProfile: INDEXABLE_TOURNAMENT_SLUGS.has(slug) || Boolean(stableHub),
  });

  return {
    title: buildTournamentSeoTitle(tournamentName),
    description: buildTournamentSeoDescription(tournamentName),
    // AdSense quality: unknown tournament pages can be empty when the live API has
    // no matches, so only stable editorial/calendar-backed tournaments can index.
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    alternates: {
      canonical: `https://watchtennistoday.com/tournament/${slug}`,
    },
    openGraph: {
      title: buildTournamentSeoTitle(tournamentName),
      description: buildTournamentSeoDescription(tournamentName),
      url: `https://watchtennistoday.com/tournament/${slug}`,
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: buildTournamentSeoTitle(tournamentName),
      description: buildTournamentSeoDescription(tournamentName),
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
  const tournamentName = tournamentMatches[0]?.tournament || stableHub?.name || unslugify(slug);

  const liveCount = tournamentMatches.filter(
    (match) => match.status === "LIVE"
  ).length;

  const tournamentProfile = getTournamentEditorialProfile(slug, tournamentName);
  const tournamentDateWindow = getTournamentDateWindow(tournamentMatches);
  const calendarEntry = await getTournamentCalendarEntry(slug);
  const apiTournamentDateRange = calendarEntry
    ? null
    : await getApiTennisTournamentFixtureDateRange(slug, tournamentName);
  const matchFeedDateRange = formatTournamentDateRange(tournamentDateWindow);
  const calendarDateRange = formatCalendarDateRange(calendarEntry);
  const apiFixtureDateRange = formatApiTournamentDateRange(apiTournamentDateRange);
  const tournamentDateRange = calendarDateRange || apiFixtureDateRange || matchFeedDateRange;
  const tournamentDateConfidence = calendarDateRange
    ? "official"
    : apiTournamentDateRange?.confidence || (matchFeedDateRange ? "partial" : "unknown");
  const hasAuthoritativeTournamentDates = tournamentDateConfidence === "official";
  const tournamentDateLabel = hasAuthoritativeTournamentDates
    ? "Tournament dates"
    : "Published match dates";
  const tournamentDateNote = hasAuthoritativeTournamentDates
    ? "These dates come from a verified tournament calendar. Match times and court assignments can still change during the event."
    : "These dates come from currently published matches and may not include the full event yet. Check the official tournament schedule for final dates.";

  const suspendedCount = tournamentMatches.filter(
    (match) => match.status === "SUSPENDED"
  ).length;

  const sportsEventSchema = tournamentDateRange
    ? {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: tournamentName,
        sport: "Tennis",
        startDate: calendarEntry?.startDate || apiTournamentDateRange?.startDate || tournamentDateWindow?.start.toISOString(),
        endDate: calendarEntry?.endDate || apiTournamentDateRange?.endDate || tournamentDateWindow?.end.toISOString(),
        url: `https://watchtennistoday.com/tournament/${slug}`,
        description: buildTournamentSeoDescription(tournamentName),
        organizer: { "@type": "Organization", name: "Official tournament organizer" },
      }
    : null;

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

        <h1 className="text-5xl md:text-7xl font-black mb-6">
          🎾 {tournamentName} Live Matches
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-5">
          Watch {tournamentName} tennis matches live today with match schedules,
          TV channels, streaming information, live scores and tournament updates.
        </p>

        {tournamentDateRange ? (
          <p className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-zinc-300">
            <span className="font-black text-white">
              {tournamentDateLabel}:
            </span>{" "}
            {tournamentDateRange}. {tournamentDateNote}
          </p>
        ) : (
          <p className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-zinc-400">
            Tournament dates are not available from the current match feed or
            tournament calendar yet. This page will show dates automatically
            once scheduled matches or verified calendar data are available.
          </p>
        )}

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
                  <p className="mt-1 font-black text-white">{tournamentDateRange || stableHub?.seasonWindow || "Not published yet"}</p>
                  {!hasAuthoritativeTournamentDates && tournamentDateRange ? (
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Published match dates only
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
            <p className="text-zinc-500 text-sm mb-2">Tournament dates</p>
            <p className="text-2xl font-black">{tournamentDateRange || "TBA"}</p>
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

        <section className="space-y-5">
          {tournamentMatches.length > 0 ? (
            tournamentMatches.map((match) => (
              <a
                key={match.id}
                href={`/watch/${matchSlug(match)}`}
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
            ) : stableHub ? (
              <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                <h2 className="mb-4 text-3xl font-black">{stableHub.name} hub</h2>
                <p className="mb-5 max-w-3xl leading-8 text-zinc-300">
                  No live match-feed entries are available for this tournament right now. This page still gives stable tournament context so readers are not left on a thin empty page while the event is outside the current schedule window.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stableHub.relatedLinks.map((link) => (
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

        <div className="mt-12">
          <EmailCapture
            title={`Get ${tournamentName} schedule and viewing updates`}
            description="Get tournament schedule and viewing updates without relying on unsafe stream pages or noisy notifications."
            placeholder="Email for tournament alerts"
            buttonText="Get tournament updates"
            contextType="tournament"
            contextValue={tournamentName}
            dark
          />
        </div>

        <section className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">
            📺 Where to Watch {tournamentName}
          </h2>

          <p className="text-zinc-300 leading-8 mb-5">
            {(stableHub?.name || tournamentName)} matches may be available on official broadcasters,
            streaming services and sports TV platforms depending on your country.
            Always check official tennis streaming sources and local TV schedules
            for exact coverage.
          </p>

          <a
            href="/best-ways-to-watch-tennis-online"
            className="inline-block bg-green-500 text-black font-black px-6 py-4 rounded-2xl hover:bg-green-400 transition-all"
          >
            Best Ways to Watch Tennis Online
          </a>
        </section>

        <section className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">
            🌍 Watching {tournamentName} abroad?
          </h2>

          <p className="text-zinc-300 leading-8 mb-5">
            If you are traveling, your usual tennis streaming service may not
            work the same way abroad. Check official streaming options and learn
            how to watch tennis safely while traveling.
          </p>

          <a
            href="/how-to-watch-tennis-safely-abroad"
            className="inline-block border border-zinc-700 px-6 py-4 rounded-2xl font-black hover:border-green-500 hover:text-green-400 transition-all"
          >
            How to Watch Tennis Safely Abroad
          </a>
        </section>

        <section className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-3xl font-black">Sources for {tournamentName}</h2>
          <p className="leading-8 text-zinc-300">
            Tournament pages combine available match-feed data, stored calendar entries and editorial context. Match times, court assignments, withdrawals and broadcaster rights can change, so fans should confirm final details with official tournament and broadcaster sources.
          </p>
          <ul className="mt-5 grid gap-3 text-sm text-zinc-300 md:grid-cols-2">
            <li className="rounded-2xl border border-zinc-800 bg-black p-4">Official tournament website and order of play</li>
            <li className="rounded-2xl border border-zinc-800 bg-black p-4">ATP Tour and WTA official tournament information</li>
            <li className="rounded-2xl border border-zinc-800 bg-black p-4">ITF rules and event-format references where relevant</li>
            <li className="rounded-2xl border border-zinc-800 bg-black p-4">Licensed broadcaster and streaming provider pages</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-black">
            <Link href="/how-we-source-data" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-green-400">How we source data</Link>
            <Link href="/how-we-verify-streams" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-green-400">How we verify streams</Link>
            <Link href="/tennis-guides" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-green-400">Tennis guides hub</Link>
          </div>
        </section>

        <AuthorBox />
        
      </div>
      {sportsEventSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEventSchema) }}
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
      url: `https://watchtennistoday.com/tournament/${slug}`,
    },
  ]}
/>
    </main>
  );
}
