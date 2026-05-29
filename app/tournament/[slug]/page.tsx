import { headers } from "next/headers";
import AuthorBox from "@/app/components/AuthorBox";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const dynamic = "force-dynamic";

const CURRENT_SEASON = new Date().getFullYear();

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
  startTime: string;
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

  const response = await fetch(`${baseUrl}/api/matches`, {
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

function statusPriority(status: string) {
  if (status === "LIVE") return 1;
  if (status === "SUSPENDED") return 2;
  if (status === "UPCOMING") return 3;
  return 4;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tournamentName = unslugify(slug);

  return {
    title: buildTournamentSeoTitle(tournamentName),
    description: buildTournamentSeoDescription(tournamentName),
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

  const tournamentName = tournamentMatches[0]?.tournament || unslugify(slug);

  const liveCount = tournamentMatches.filter(
    (match) => match.status === "LIVE"
  ).length;

  const suspendedCount = tournamentMatches.filter(
    (match) => match.status === "SUSPENDED"
  ).length;

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <nav className="text-sm text-zinc-400 mb-6 flex flex-wrap gap-2">
          <a href="/" className="hover:text-white">
            Home
          </a>
          <span>/</span>
          <a href="/tournament" className="hover:text-white">
            Tournaments
          </a>
          <span>/</span>
          <span className="text-white">{tournamentName}</span>
        </nav>

        <h1 className="text-5xl md:text-7xl font-black mb-6">
          🎾 {tournamentName} Live Matches
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-8">
          Watch {tournamentName} tennis matches live today with match schedules,
          TV channels, streaming information, live scores and tournament updates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <a
            href="/live-tennis"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-red-500 hover:text-red-400 transition-all"
          >
            🔴 Live Tennis
          </a>

          <a
            href="/tv-schedule"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 hover:text-green-400 transition-all"
          >
            📺 TV Schedule
          </a>

          <a
            href="/best-ways-to-watch-tennis-online"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-yellow-500 hover:text-yellow-400 transition-all"
          >
            🌍 Watch Online
          </a>
        </div>
        <section className="mb-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-3xl font-black">Popular Tournament Pages</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="/french-open-live"
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
              href="/french-open-tv-schedule"
              className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
            >
              <h3 className="text-xl font-black mb-2">French Open TV Schedule</h3>
              <p className="text-zinc-400">
                TV channels, broadcast times and official coverage.
              </p>
            </a>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
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
                    href="/french-open-live"
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
                    href="/french-open-tv-schedule"
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
                      Today's Roland Garros schedule and court assignments.
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
            ) : (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
                No matches found for this tournament right now. Check back soon
                for schedule updates.
              </div>
            )
          )}
        </section>

        <section className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">
            📺 Where to Watch {tournamentName}
          </h2>

          <p className="text-zinc-300 leading-8 mb-5">
            {tournamentName} matches may be available on official broadcasters,
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
        <AuthorBox />
        
      </div>
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