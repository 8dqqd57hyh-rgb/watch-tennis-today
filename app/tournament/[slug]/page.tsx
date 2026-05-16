import { headers } from "next/headers";

export const dynamic = "force-dynamic";

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
    title: `${tournamentName} Live Matches | Tennis Schedule & Streaming`,
    description: `Watch ${tournamentName} tennis matches live. Find match schedules, streaming options, TV channels, live scores and tournament updates.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  const matches = await getMatches();

  const tournamentMatches = matches
    .filter((match) => slugify(match.tournament) === slug)
    .sort((a, b) => {
      const statusDiff = statusPriority(a.status) - statusPriority(b.status);

      if (statusDiff !== 0) return statusDiff;

      if (!a.startTime) return 1;
      if (!b.startTime) return -1;

      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

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
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h2 className="text-3xl font-black mb-4">
                No {tournamentName} matches found right now
              </h2>

              <p className="text-zinc-300 leading-8 mb-6">
                There may be no matches from this tournament in the current
                schedule. Check live tennis, TV schedule or other tournaments.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="/live-tennis"
                  className="bg-red-500 text-white px-5 py-3 rounded-2xl font-black hover:bg-red-400 transition-all"
                >
                  Check Live Tennis
                </a>

                <a
                  href="/tournament"
                  className="bg-zinc-800 text-white px-5 py-3 rounded-2xl font-black hover:bg-zinc-700 transition-all"
                >
                  View Tournaments
                </a>
              </div>
            </div>
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

        <section className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-6">{tournamentName} FAQ</h2>

          <div className="space-y-6 text-zinc-300 leading-8">
            <div>
              <h3 className="text-xl text-white font-black mb-2">
                Where can I watch {tournamentName} live?
              </h3>
              <p>
                {tournamentName} matches may be shown by official broadcasters,
                sports TV channels and streaming platforms depending on your
                location.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-white font-black mb-2">
                Does this page show live {tournamentName} matches?
              </h3>
              <p>
                Yes. This page lists matches from {tournamentName} when they are
                available in the current schedule, including live, suspended and
                upcoming matches.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-white font-black mb-2">
                Why can tennis streaming options differ by country?
              </h3>
              <p>
                Tennis broadcasting rights are usually sold by region, so TV
                channels and streaming platforms may differ from country to
                country.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}