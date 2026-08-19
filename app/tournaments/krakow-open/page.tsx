import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import JsonLd from "@/app/components/JsonLd";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import EmailSignup from "@/app/components/EmailSignup";
import AdSlot from "@/app/components/AdSlot";
import { getServerMatchesWindow, type ServerMatch } from "@/app/lib/serverMatches";
import { findCourtForMatch, getKrakowOpenCourts } from "@/data/krakowOpenCourts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kraków Open 2026 – Today's Matches, Order of Play & Courts",
  description:
    "Kraków Open 2026 schedule, today's matches, start times, court numbers, players and venue information at KS Olsza Krakow.",
  alternates: {
    canonical: "https://watchtennistoday.com/tournaments/krakow-open",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://watchtennistoday.com/tournaments/krakow-open",
    siteName: "Watch Tennis Today",
    title: "Kraków Open 2026 – Today's Matches, Order of Play & Courts",
    description:
      "Kraków Open 2026 schedule, today's matches, start times, court numbers, players and venue information at KS Olsza Krakow.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kraków Open 2026 – Today's Matches, Order of Play & Courts",
    description:
      "Kraków Open 2026 schedule, today's matches, start times, court numbers, players and venue information at KS Olsza Krakow.",
  },
};

// Tournament configuration
const tournamentConfig = {
  name: "Kraków Open",
  year: 2026,
  category: "ITF Men's World Tennis Tour M15",
  startDate: "2026-08-17",
  endDate: "2026-08-23",
  surface: "Clay",
  venue: "KS Olsza Krakow",
  address: "ul. Siedleckiego 7, 31-538 Krakow, Poland",
  country: "Poland",
  coordinates: {
    latitude: 50.0516,
    longitude: 19.9372,
  },
};

type Match = Pick<
  ServerMatch,
  "id" | "player1" | "player2" | "tournament" | "category" | "status" | "score" | "startTime" | "court" | "round"
>;

async function getMatches(): Promise<Match[]> {
  return getServerMatchesWindow({
    revalidateSeconds: 60,
    includeFinished: true,
    daysBack: 7,
    daysForward: 14,
    timeoutMs: 8000,
  });
}

function isKrakowOpenMatch(match: Match): boolean {
  const tournamentName = (match.tournament || "").toLowerCase();
  const keywords = ["krakow", "kraków", "krakow open", "kraków open"];
  return keywords.some((keyword) => tournamentName.includes(keyword));
}

function formatMatchDate(dateString: string | null | undefined): string {
  if (!dateString) return "TBD";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

function formatMatchTime(dateString: string | null | undefined): string {
  if (!dateString) return "TBD";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return "TBD";
  }
}

function getLocalDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function isTodayMatch(match: Match, now: Date): boolean {
  if (!match.startTime) return false;
  try {
    const matchDate = new Date(match.startTime);
    return getLocalDateKey(matchDate) === getLocalDateKey(now);
  } catch {
    return false;
  }
}

function getMatchStatusClass(status?: string): string {
  const normalized = status?.toUpperCase() || "";
  if (["LIVE", "SUSPENDED", "IN_PLAY"].includes(normalized)) {
    return "border-l-4 border-l-red-500 bg-red-950/30";
  }
  if (["FINISHED", "COMPLETED", "ENDED", "FINAL", "RETIRED", "WALKOVER"].includes(normalized)) {
    return "border-l-4 border-l-green-600 bg-green-950/20";
  }
  if (["CANCELLED", "CANCELED", "POSTPONED"].includes(normalized)) {
    return "border-l-4 border-l-yellow-600 bg-yellow-950/20";
  }
  return "border-l-4 border-l-blue-500 bg-blue-950/20";
}

function getMatchStatusLabel(status?: string): string {
  const normalized = status?.toUpperCase() || "";
  if (["LIVE", "IN_PLAY"].includes(normalized)) return "LIVE";
  if (normalized === "SUSPENDED") return "SUSPENDED";
  if (["FINISHED", "COMPLETED", "ENDED", "FINAL"].includes(normalized)) return "FINISHED";
  if (["RETIRED", "WALKOVER"].includes(normalized)) return `${normalized}`;
  if (["CANCELLED", "CANCELED"].includes(normalized)) return "CANCELLED";
  if (["POSTPONED"].includes(normalized)) return "POSTPONED";
  return "UPCOMING";
}

function sortMatchesByTime(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => {
    const aTime = a.startTime ? new Date(a.startTime).getTime() : Number.MAX_SAFE_INTEGER;
    const bTime = b.startTime ? new Date(b.startTime).getTime() : Number.MAX_SAFE_INTEGER;
    return aTime - bTime;
  });
}

function groupMatchesByDate(matches: Match[]): Map<string, Match[]> {
  const grouped = new Map<string, Match[]>();

  matches.forEach((match) => {
    const dateKey = match.startTime ? formatMatchDate(match.startTime) : "TBD";
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(match);
  });

  return grouped;
}

function getUniqueCourts(matches: Match[]): string[] {
  // Get courts from both mapped data and from matches themselves
  const courts = new Set<string>();

  // Add courts from krakowOpenCourts mappings
  getKrakowOpenCourts().forEach((court) => {
    courts.add(court.courtNumber);
  });

  // Add courts from API if available
  matches.forEach((match) => {
    if (match.court) {
      courts.add(match.court);
    }
  });

  return Array.from(courts).sort((a, b) => {
    const numA = Number(a);
    const numB = Number(b);
    return Number.isFinite(numA) && Number.isFinite(numB) ? numA - numB : a.localeCompare(b);
  });
}

export default async function KrakowOpenPage() {
  const matches = await getMatches();
  const krakowMatches = matches.filter(isKrakowOpenMatch);
  const sortedMatches = sortMatchesByTime(krakowMatches);

  const now = new Date();
  const todayMatches = sortedMatches.filter((m) => isTodayMatch(m, now));
  const upcomingMatches = sortedMatches.filter((m) => !isTodayMatch(m, now));
  const uniqueCourts = getUniqueCourts(sortedMatches);
  const groupedMatches = groupMatchesByDate(sortedMatches);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: `${tournamentConfig.name} ${tournamentConfig.year}`,
      description: `${tournamentConfig.name} ${tournamentConfig.year} tennis tournament`,
      startDate: tournamentConfig.startDate,
      endDate: tournamentConfig.endDate,
      eventStatus: "EventScheduled",
      location: {
        "@type": "Place",
        name: tournamentConfig.venue,
        address: {
          "@type": "PostalAddress",
          streetAddress: tournamentConfig.address.split(",")[0],
          addressLocality: "Kraków",
          addressRegion: "PL",
          addressCountry: "PL",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: tournamentConfig.coordinates.latitude,
          longitude: tournamentConfig.coordinates.longitude,
        },
      },
      organizer: {
        "@type": "Organization",
        name: "ITF",
        url: "https://itftennis.com",
      },
      url: "https://watchtennistoday.com/tournaments/krakow-open",
    },
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: `${tournamentConfig.name} ${tournamentConfig.year} - Today's Matches`,
      url: "https://watchtennistoday.com/tournaments/krakow-open",
      location: {
        "@type": "Place",
        name: tournamentConfig.venue,
        address: {
          "@type": "PostalAddress",
          streetAddress: tournamentConfig.address.split(",")[0],
          addressLocality: "Kraków",
          addressCountry: "PL",
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is the Kraków Open 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Kraków Open 2026 is an ITF Men's World Tennis Tour M15 tournament held from August 17-23, 2026 at KS Olsza Krakow on clay courts.",
          },
        },
        {
          "@type": "Question",
          name: "Where is the Kraków Open 2026 held?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `The tournament is held at ${tournamentConfig.venue}, located at ${tournamentConfig.address}.`,
          },
        },
        {
          "@type": "Question",
          name: "When does the Kraków Open 2026 take place?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Kraków Open 2026 runs from August 17-23, 2026.",
          },
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <JsonLd data={jsonLd} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Tennis tournaments", url: "https://watchtennistoday.com/tennis-tournaments" },
          { name: "Kraków Open", url: "https://watchtennistoday.com/tournaments/krakow-open" },
        ]}
      />

      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <section className="mb-12 rounded-2xl border border-blue-500/50 bg-gradient-to-br from-blue-950/60 via-black to-black p-8 md:p-12">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-bold text-white">
            <span>🏆</span>
            <span>{tournamentConfig.category}</span>
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            {tournamentConfig.name}
            <br />
            {tournamentConfig.year}
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            Today's order of play, match times & courts. Find the schedule, court assignments and player information
            for the {tournamentConfig.name} at {tournamentConfig.venue}.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#matches"
              className="rounded-2xl bg-blue-500 px-6 py-4 text-lg font-black text-white transition hover:bg-blue-400"
            >
              View Today's Matches →
            </a>
            <a
              href="#venue"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-blue-500 hover:text-white"
            >
              Venue & Directions
            </a>
            <a
              href="/live-tennis"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-blue-500 hover:text-white"
            >
              Live Matches
            </a>
          </div>

          {/* Tournament Info */}
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-white/5 p-4">
              <div className="text-sm font-bold text-zinc-400">Dates</div>
              <div className="mt-1 text-base font-black">Aug 17-23</div>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="text-sm font-bold text-zinc-400">Surface</div>
              <div className="mt-1 text-base font-black">{tournamentConfig.surface}</div>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="text-sm font-bold text-zinc-400">Level</div>
              <div className="mt-1 text-base font-black">ITF M15</div>
            </div>
            <div className="rounded-lg bg-white/5 p-4">
              <div className="text-sm font-bold text-zinc-400">Location</div>
              <div className="mt-1 text-base font-black">Kraków 🇵🇱</div>
            </div>
          </div>
        </section>

        <AdSlot slot="tournament-hero" />

        {/* Today's Matches Section */}
        <section id="matches" className="mb-12">
          <div className="mb-8">
            <h2 className="mb-2 text-4xl font-black">
              {todayMatches.length > 0
                ? `Today's Matches (${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })})`
                : "No Matches Today"}
            </h2>
            <p className="text-zinc-400">
              {todayMatches.length > 0
                ? `${todayMatches.length} match${todayMatches.length !== 1 ? "es" : ""} scheduled for today`
                : "Check back tomorrow or select another date to view the tournament schedule."}
            </p>
          </div>

          {todayMatches.length > 0 ? (
            <div className="space-y-4">
              {/* Court Filter */}
              {uniqueCourts.length > 1 && (
                <div className="flex flex-wrap gap-2 rounded-lg bg-zinc-900 p-4">
                  <button className="rounded-lg bg-blue-500 px-4 py-2 font-bold text-white">All Courts</button>
                  {uniqueCourts.map((court) => (
                    <button
                      key={court}
                      className="rounded-lg border border-zinc-700 px-4 py-2 font-bold transition hover:border-blue-500 hover:bg-blue-500/10"
                    >
                      {court}
                    </button>
                  ))}
                </div>
              )}

              {/* Match List */}
              <div className="space-y-3">
                {todayMatches.map((match) => {
                  // Try to find court from our mappings
                  const mappedCourt = findCourtForMatch(match.player1, match.player2, match.startTime || "");
                  const courtDisplay = match.court || mappedCourt?.courtNumber;
                  const courtName = mappedCourt?.courtName;

                  return (
                    <div key={match.id} className={`rounded-lg border border-zinc-800 p-6 transition hover:border-blue-500/50 ${getMatchStatusClass(match.status)}`}>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center">
                        {/* Time & Court */}
                        <div className="md:col-span-2">
                          <div className="text-2xl font-black text-blue-400">{formatMatchTime(match.startTime)}</div>
                          {courtDisplay && (
                            <div className="mt-1">
                              <div className="text-sm font-bold text-zinc-400">Court {courtDisplay}</div>
                              {courtName && <div className="text-xs text-zinc-500">{courtName}</div>}
                            </div>
                          )}
                        </div>

                        {/* Players */}
                        <div className="md:col-span-7">
                          <div className="space-y-2">
                            <div className="text-base font-bold md:text-lg">{match.player1}</div>
                            <div className="text-sm text-zinc-400">vs</div>
                            <div className="text-base font-bold md:text-lg">{match.player2}</div>
                          </div>
                        </div>

                        {/* Details & Status */}
                        <div className="md:col-span-3 text-right">
                          <div className="space-y-2">
                            {match.round && (
                              <div>
                                <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
                                  {match.round}
                                </span>
                              </div>
                            )}
                            <div className="text-sm font-bold">
                              <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-blue-300">
                                {getMatchStatusLabel(match.status)}
                              </span>
                            </div>
                            {match.score && match.status?.toUpperCase() !== "UPCOMING" && (
                              <div className="text-sm text-zinc-400">{match.score}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg border border-blue-500/30 bg-blue-950/20 p-4 text-sm text-zinc-300">
                <strong>Note:</strong> Order of play may change due to weather, match duration or tournament decisions. Check
                back for updates throughout the day.
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 text-center">
              <p className="mb-6 text-zinc-400">There are no matches scheduled for today at the Kraków Open.</p>
              {upcomingMatches.length > 0 && (
                <div>
                  <p className="mb-4 text-sm text-zinc-500">
                    The next scheduled match is on{" "}
                    <strong className="text-white">{formatMatchDate(upcomingMatches[0].startTime)}</strong>.
                  </p>
                  <Link
                    href="#upcoming"
                    className="inline-block rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition hover:bg-blue-400"
                  >
                    View Upcoming Matches
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Upcoming Matches Section */}
        {upcomingMatches.length > 0 && (
          <section id="upcoming" className="mb-12">
            <h2 className="mb-6 text-3xl font-black">Upcoming Matches</h2>
            <div className="space-y-4">
              {Array.from(groupedMatches.entries())
                .filter(([date]) => date !== formatMatchDate(new Date().toISOString()))
                .map(([date, dateMatches]) => (
                  <div key={date} className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-6">
                    <h3 className="mb-4 text-xl font-bold text-blue-400">{date}</h3>
                    <div className="space-y-3">
                      {dateMatches.map((match) => (
                        <div key={match.id} className="border-l-4 border-l-zinc-700 pl-4">
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-4 md:items-center">
                            <div className="font-bold text-blue-400">{formatMatchTime(match.startTime)}</div>
                            <div className="font-bold md:col-span-2">
                              {match.player1} <span className="text-zinc-400">vs</span> {match.player2}
                            </div>
                            <div className="text-right">
                              {match.round && (
                                <span className="text-xs font-bold text-zinc-400">{match.round}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        <AdSlot slot="tournament-mid" />

        {/* Venue Section */}
        <section id="venue" className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8">
            <h2 className="mb-6 text-3xl font-black">Tournament Venue</h2>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-bold">{tournamentConfig.venue}</h3>
                <p className="text-zinc-400">{tournamentConfig.address}</p>
              </div>

              <div>
                <h3 className="mb-2 font-bold text-zinc-300">Court Surface</h3>
                <p className="text-base text-zinc-300">{tournamentConfig.surface} courts</p>
              </div>

              <div>
                <h3 className="mb-2 font-bold text-zinc-300">Getting There</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li>• Located in Kraków, Poland</li>
                  <li>• Accessible by public transport</li>
                  <li>• Parking facilities available</li>
                  <li>• Near Kraków city center</li>
                </ul>
              </div>

              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(tournamentConfig.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-blue-500 px-6 py-3 font-bold text-white transition hover:bg-blue-400"
              >
                📍 Get Directions on Google Maps
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-8">
            <h2 className="mb-6 text-3xl font-black">About the Tournament</h2>

            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-bold text-zinc-300">Tournament Level</h3>
                <p className="text-base text-zinc-300">{tournamentConfig.category}</p>
              </div>

              <div>
                <h3 className="mb-2 font-bold text-zinc-300">Tournament Dates</h3>
                <p className="text-base text-zinc-300">August 17–23, 2026</p>
              </div>

              <div>
                <h3 className="mb-2 font-bold text-zinc-300">Tournament Format</h3>
                <p className="text-base text-zinc-300">Singles and doubles matches</p>
              </div>

              <div>
                <h3 className="mb-2 font-bold text-zinc-300">Prize Money & Rankings</h3>
                <p className="text-sm text-zinc-400">ITF World Tennis Tour points and prize money available for qualified players</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-black">Kraków Open 2026 Today</h2>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8">
            <div className="space-y-4 text-base leading-7 text-zinc-300">
              <p>
                The Kraków Open 2026 is an ITF Men's World Tennis Tour M15 tournament held at KS Olsza Krakow from
                August 17-23, 2026. The tournament features competitive men's tennis matches on clay courts in Poland's
                vibrant city.
              </p>

              {todayMatches.length > 0 && (
                <p>
                  Today's schedule includes {todayMatches.length} match{todayMatches.length !== 1 ? "es" : ""} across
                  {uniqueCourts.length > 0 ? ` ${uniqueCourts.length} court${uniqueCourts.length !== 1 ? "s" : ""}` : ""}.
                  The first match begins at {formatMatchTime(sortedMatches[0].startTime)}.
                </p>
              )}

              <p>
                Located at {tournamentConfig.venue} ({tournamentConfig.address}), the venue offers excellent facilities for both
                players and spectators. The tournament attracts rising talent and provides valuable ranking points on
                the ITF World Tennis Tour.
              </p>

              <p>
                <strong>Important:</strong> Tournament order of play may change during the day due to weather conditions,
                match duration, or tournament decisions. Always verify the current schedule on this page before making
                travel arrangements to attend matches in person.
              </p>

              <p>
                For more information about today's matches, player details, and court assignments, explore the sections
                above. Follow Watch Tennis Today for live match updates and comprehensive tennis coverage.
              </p>
            </div>
          </div>
        </section>

        <AdSlot slot="tournament-bottom" />

        {/* Related Links Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-3xl font-black">Related Pages</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/live-tennis"
              className="rounded-lg border border-zinc-700 p-6 transition hover:border-blue-500 hover:bg-blue-500/5"
            >
              <h3 className="mb-2 font-bold">Live Tennis Today</h3>
              <p className="text-sm text-zinc-400">Watch live matches from around the world</p>
            </Link>

            <Link
              href="/tennis-schedule-today"
              className="rounded-lg border border-zinc-700 p-6 transition hover:border-blue-500 hover:bg-blue-500/5"
            >
              <h3 className="mb-2 font-bold">Today's Tennis Schedule</h3>
              <p className="text-sm text-zinc-400">Complete tennis schedule for today</p>
            </Link>

            <Link
              href="/tennis-tournaments"
              className="rounded-lg border border-zinc-700 p-6 transition hover:border-blue-500 hover:bg-blue-500/5"
            >
              <h3 className="mb-2 font-bold">Tennis Tournaments</h3>
              <p className="text-sm text-zinc-400">Browse all tennis tournaments</p>
            </Link>

            <Link
              href="/watch-tennis-in/poland"
              className="rounded-lg border border-zinc-700 p-6 transition hover:border-blue-500 hover:bg-blue-500/5"
            >
              <h3 className="mb-2 font-bold">Watch Tennis in Poland</h3>
              <p className="text-sm text-zinc-400">How to watch tennis in Poland</p>
            </Link>

            <Link
              href="/tennis-tv-broadcast-finder"
              className="rounded-lg border border-zinc-700 p-6 transition hover:border-blue-500 hover:bg-blue-500/5"
            >
              <h3 className="mb-2 font-bold">TV Broadcast Finder</h3>
              <p className="text-sm text-zinc-400">Find where to watch tennis in your country</p>
            </Link>

            <Link
              href="/best-vpn-for-tennis-streaming"
              className="rounded-lg border border-zinc-700 p-6 transition hover:border-blue-500 hover:bg-blue-500/5"
            >
              <h3 className="mb-2 font-bold">Best VPN for Tennis</h3>
              <p className="text-sm text-zinc-400">Watch tennis safely from anywhere</p>
            </Link>
          </div>
        </section>

        {/* Email Signup */}
        <EmailSignup source="krakow-open-tournament" context="Tournament" />

        <RevenueConversionPanel context="article" tournament="Kraków Open 2026" />
      </div>
    </main>
  );
}
