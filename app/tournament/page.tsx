import { getServerMatches } from "@/app/lib/serverMatches";
import Link from "next/link";
import { getTournamentCalendarEntries, getTournamentCalendarSlugs } from "@/app/lib/tournamentCalendar";
import { stableTournamentHubs } from "@/data/tournamentHubs";

export const revalidate = 60;

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

async function getMatches(): Promise<Match[]> {
  return (await getServerMatches(60)) as Match[];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}


function formatDateRange(startDate: string | null, endDate: string | null) {
  if (!startDate || !endDate) return null;

  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  const formattedStart = formatter.format(start);
  const formattedEnd = formatter.format(end);

  return formattedStart === formattedEnd ? formattedStart : `${formattedStart} – ${formattedEnd}`;
}

function getTournamentDateRange(matches: Match[]) {
  const dates = matches
    .map((match) => match.startTime ? new Date(match.startTime) : null)
    .filter((date): date is Date => date instanceof Date && !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) return null;

  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const start = formatter.format(dates[0]);
  const end = formatter.format(dates[dates.length - 1]);

  return start === end ? start : `${start} – ${end}`;
}

export const metadata = {
  title: "Tennis Tournaments & Live Streams | Watch Tennis Today",
  description:
    "Browse ATP, WTA, Challenger and Grand Slam tennis tournaments, live streams and TV schedule information.",
};

export default async function TournamentsPage() {
  const [matches, calendarEntries] = await Promise.all([
    getMatches(),
    getTournamentCalendarEntries(),
  ]);

  const tournamentGroups = new Map<string, Match[]>();
  const calendarEntryBySlug = new Map(
    calendarEntries.flatMap((entry) =>
      getTournamentCalendarSlugs(entry.slug).map((slug) => [slug, entry] as const)
    )
  );

  matches.forEach((match) => {
    const slug = slugify(match.tournament);
    if (!slug) return;

    tournamentGroups.set(slug, [...(tournamentGroups.get(slug) || []), match]);
  });

  const tournamentsFromMatches = Array.from(tournamentGroups.entries()).map(([slug, tournamentMatches]) => {
    const firstMatch = tournamentMatches[0];
    const calendarEntry = calendarEntryBySlug.get(slug);
    const calendarDateRange = calendarEntry ? formatDateRange(calendarEntry.startDate, calendarEntry.endDate) : null;
    const matchFeedDateRange = getTournamentDateRange(tournamentMatches);

    return {
      name: firstMatch.tournament,
      slug,
      category: firstMatch.category,
      dateRange: calendarDateRange || matchFeedDateRange,
      dateLabel: calendarDateRange ? "Dates" : "Feed coverage",
      dateSource: calendarEntry?.sourceName || "match feed",
      summary: null as string | null,
      surface: null as string | null,
      location: null as string | null,
    };
  });

  const tournamentSlugs = new Set(tournamentsFromMatches.map((tournament) => tournament.slug));
  const calendarTournaments = calendarEntries
    .filter((entry) => !tournamentSlugs.has(entry.slug))
    .map((entry) => ({
      name: entry.name,
      slug: entry.slug,
      category: "Grand Slam",
      dateRange: formatDateRange(entry.startDate, entry.endDate),
      dateLabel: "Dates",
      dateSource: entry.sourceName || "tournament calendar",
      summary: null as string | null,
      surface: null as string | null,
      location: null as string | null,
    }));

  const existingSlugs = new Set([
    ...tournamentsFromMatches.map((tournament) => tournament.slug),
    ...calendarTournaments.map((tournament) => tournament.slug),
  ]);

  const stableTournaments = stableTournamentHubs
    .filter((hub) => !existingSlugs.has(hub.slug))
    .map((hub) => ({
      name: hub.name,
      slug: hub.slug,
      category: hub.level,
      dateRange: hub.seasonWindow,
      dateLabel: "Season window",
      dateSource: "editorial tournament hub",
      summary: hub.summary,
      surface: hub.surface,
      location: hub.location,
    }));

  const tournaments = [...tournamentsFromMatches, ...calendarTournaments, ...stableTournaments].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-5xl font-black mt-8 mb-5">
          🎾 Tennis Tournaments
        </h1>

        <p className="text-zinc-400 text-lg mb-6">
          Browse major ATP, WTA and Grand Slam tournament hubs with schedule context,
          surface notes, legal viewing guidance and links to related tennis guides.
        </p>

        <section className="mb-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
            Monetization-safe tournament hub
          </p>
          <h2 className="text-3xl font-black">Stable tournament pages, not empty feed pages</h2>
          <p className="mt-3 max-w-3xl leading-8 text-zinc-300">
            This directory now mixes live feed tournaments with manually reviewed evergreen tournament hubs. That keeps the page useful even when the tennis API has no matches for a major event and avoids creating thin, empty pages for AdSense review.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="font-black text-white">{stableTournamentHubs.length} stable hubs</p>
              <p className="mt-1 text-sm text-zinc-400">Grand Slams, 1000s and Finals</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="font-black text-white">Surface context</p>
              <p className="mt-1 text-sm text-zinc-400">Clay, grass, hard and indoor</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="font-black text-white">Legal viewing notes</p>
              <p className="mt-1 text-sm text-zinc-400">No fake free-stream claims</p>
            </div>
          </div>
        </section>

        <div className="mb-8">
          <a
            href="/french-open"
            className="block bg-gradient-to-br from-orange-500 to-red-500 text-black rounded-3xl p-6 hover:scale-[1.01] transition-all"
          >
            <p className="uppercase text-sm font-black tracking-widest opacity-70 mb-2">
              Featured Grand Slam
            </p>

            <h2 className="text-3xl font-black mb-2">
              French Open Live Stream
            </h2>

            <p className="font-semibold">
              Find where to watch Roland Garros live online, TV channels and
              official streaming options.
            </p>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tournaments.map((tournament) => (
            <a
              key={tournament.slug}
              href={`/tournament/${tournament.slug}`}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
            >
              <div className="flex justify-between gap-4 mb-3">
                <h2 className="text-2xl font-black">
                  {tournament.name}
                </h2>

                <span className="text-sm text-zinc-400">
                  {tournament.category}
                </span>
              </div>

              {tournament.dateRange ? (
                <p className="mb-3 text-sm font-bold text-green-400">
                  {tournament.dateLabel}: {tournament.dateRange}
                </p>
              ) : (
                <p className="mb-3 text-sm font-bold text-zinc-500">
                  Dates: TBA from tournament calendar
                </p>
              )}

              {tournament.summary ? (
                <p className="text-zinc-400">{tournament.summary}</p>
              ) : (
                <p className="text-zinc-400">
                  View live matches, streaming information and TV schedule.
                </p>
              )}

              {tournament.surface ? (
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-zinc-500">
                  {tournament.surface} · {tournament.location || "Tournament hub"}
                </p>
              ) : null}

              {tournament.dateRange && (
                <p className="mt-3 text-xs text-zinc-500">
                  Source: {tournament.dateSource}
                </p>
              )}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
