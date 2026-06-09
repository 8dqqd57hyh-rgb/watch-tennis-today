import { getServerMatches } from "@/app/lib/serverMatches";
import Link from "next/link";
import { getTournamentCalendarEntries } from "@/app/lib/tournamentCalendar";

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

  matches.forEach((match) => {
    const slug = slugify(match.tournament);
    if (!slug) return;

    tournamentGroups.set(slug, [...(tournamentGroups.get(slug) || []), match]);
  });

  const tournamentsFromMatches = Array.from(tournamentGroups.entries()).map(([slug, tournamentMatches]) => {
    const firstMatch = tournamentMatches[0];

    return {
      name: firstMatch.tournament,
      slug,
      category: firstMatch.category,
      dateRange: getTournamentDateRange(tournamentMatches),
      dateSource: "match feed",
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
      dateSource: entry.sourceName || "tournament calendar",
    }));

  const tournaments = [...tournamentsFromMatches, ...calendarTournaments].sort((a, b) =>
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

        <p className="text-zinc-400 text-lg mb-10">
          Browse ATP, WTA, Challenger and Grand Slam tennis tournaments,
          live streams and TV schedule information.
        </p>

        <div className="mb-8">
          <a
            href="/french-open-live-stream"
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
                  Dates: {tournament.dateRange}
                </p>
              ) : (
                <p className="mb-3 text-sm font-bold text-zinc-500">
                  Dates: TBA from match feed
                </p>
              )}

              <p className="text-zinc-400">
                View live matches, streaming information and TV schedule.
              </p>

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
