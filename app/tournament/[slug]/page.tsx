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

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    return "http://localhost:3000";
  }

  const protocol = host.includes("localhost") ? "http" : "https";

  return `${protocol}://${host}`;
}

async function getMatches(): Promise<Match[]> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/matches`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

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

function readableTournament(slug: string) {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tournament = readableTournament(slug);

  return {
    title: `${tournament} Live Stream & TV Schedule | Watch Tennis Today`,
    description: `Watch ${tournament} live tennis matches, TV channels, streams and tournament schedule.`,
    alternates: {
      canonical: `https://watchtennistoday.com/tournament/${slug}`,
    },
  };
}

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tournamentName = readableTournament(slug);

  const matches = await getMatches();

  const relatedTournaments = [
    {
      name: "French Open",
      slug: "french-open",
    },

    {
      name: "Wimbledon",
      slug: "wimbledon",
    },

    {
      name: "US Open",
      slug: "us-open",
    },

    {
      name: "Australian Open",
      slug: "australian-open",
    },

    {
      name: "Madrid Open",
      slug: "madrid",
    },

    {
      name: "Monte Carlo Masters",
      slug: "monte-carlo",
    },
  ].filter((tournament) => tournament.slug !== slug);

  const tournamentMatches = matches.filter((match) => {
    const matchTournamentSlug = slugify(match.tournament);

    const cleanPageSlug = slug
      .replace("-women-doubles", "")
      .replace("-men-doubles", "")
      .replace("-women-singles", "")
      .replace("-men-singles", "")
      .replace("-doubles", "")
      .replace("-singles", "");

    const pageWords = cleanPageSlug
      .split("-")
      .filter((word) => word.length > 2);

    const matchedWords = pageWords.filter((word) =>
      matchTournamentSlug.includes(word)
    );

    return (
      matchTournamentSlug === slug ||
      matchTournamentSlug.includes(cleanPageSlug) ||
      cleanPageSlug.includes(matchTournamentSlug) ||
      matchedWords.length >= 2
    );
  });

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        <nav className="text-sm text-zinc-400 mb-6 flex flex-wrap gap-2">
          <a href="/" className="hover:text-white">
            Home
          </a>

          <span>/</span>

          <a
            href="/tournament"
            className="hover:text-white"
          >
            Tournament
          </a>

          <span>/</span>

          <span className="text-white">
            {tournamentName}
          </span>
        </nav>

        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-4">
          🏆 {tournamentName}
        </h1>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-3xl font-black mb-5">
            📺 Watch {tournamentName} Live
          </h2>

          <div className="space-y-5 text-zinc-300 leading-8">
            <p>
              Follow live tennis matches, streaming information and TV coverage for{" "}
              {tournamentName}. Watch Tennis Today helps fans find ATP, WTA and Grand
              Slam coverage in one place.
            </p>

            <p>
              Check tournament schedules, featured players, live scores and official
              streaming options for {tournamentName}.
            </p>

            <p>
              Coverage availability may vary depending on country, broadcaster rights
              and tournament distribution agreements.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/live-tennis"
              className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400 transition-all"
            >
              Live Tennis Schedule
            </a>

            <a
              href="/watch"
              className="rounded-2xl bg-zinc-800 px-5 py-3 font-black text-white hover:bg-zinc-700 transition-all"
            >
              Watch Tennis
            </a>
          </div>
        </section>

        <p className="text-zinc-400 text-lg mb-10">
          Watch {tournamentName} live tennis matches, TV schedule and streaming
          options. Find ATP, WTA and Grand Slam match coverage, start times and
          official viewing sources.
        </p>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            📺 Where to Watch {tournamentName}
          </h2>

          <p className="text-zinc-400 leading-relaxed">
            Streaming availability for {tournamentName} depends on your country,
            tournament rights and broadcaster subscriptions. Check official TV
            channels and legal streaming platforms before the match starts.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="/live-tennis"
              className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
            >
              View Live Tennis
            </a>

            <a
              href="/watch-tennis-in/usa"
              className="bg-black border border-zinc-700 text-white px-5 py-3 rounded-2xl font-black hover:border-green-500"
            >
              Watch Tennis by Country
            </a>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            🔔 Get notified about {tournamentName}
          </h2>

          <p className="text-zinc-400 mb-6">
            Get live tennis updates, match schedules and streaming information for {tournamentName}.
          </p>

          <form
            action="https://formspree.io/f/xeenwwbk"
            method="POST"
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="flex-1 bg-black border border-zinc-700 rounded-2xl px-5 py-4 text-white"
            />

            <input
              type="hidden"
              name="tournament"
              value={tournamentName}
            />

            <input
              type="hidden"
              name="source"
              value="tournament-page"
            />

            <button
              type="submit"
              className="bg-green-500 text-black px-6 py-4 rounded-2xl font-black"
            >
              Notify Me
            </button>
          </form>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-black">
            {tournamentName} Matches
          </h2>

          {tournamentMatches.length === 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-2xl font-black mb-3">
                No current matches found
              </h3>

              <p className="text-zinc-400 mb-5">
                There are no current matches listed for {tournamentName}. Check
                the live tennis schedule for today&apos;s ATP, WTA and Challenger matches.
              </p>

              <a
                href="/live-tennis"
                className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
              >
                View Live Tennis
              </a>
            </div>
          )}

          {tournamentMatches.map((match) => (
            <a
              key={match.id}
              href={`/watch/${matchSlug(match)}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 hover:scale-[1.01] transition-all"
            >
              <div className="flex justify-between mb-4">
                {match.status === "LIVE" ? (
                  <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                    🔴 LIVE NOW
                  </span>
                ) : (
                  <span className="bg-zinc-700 text-white text-xs font-black px-3 py-1 rounded-full">
                    {match.status}
                  </span>
                )}

                <span className="text-zinc-400">
                  {match.category}
                </span>
              </div>

              <h3 className="text-3xl font-black mb-3">
                {match.player1}
                <br />
                vs
                <br />
                {match.player2}
              </h3>

              <p className="text-zinc-400 mb-3">
                {match.tournament}
              </p>

              <p className="mb-6">
                {new Date(match.startTime).toLocaleString()}
              </p>
            </a>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-black mb-5">
            🏆 Related Tennis Tournaments
          </h2>

          <p className="text-zinc-400 mb-6 max-w-3xl">
            Explore more ATP, WTA and Grand Slam tennis tournaments,
            live schedules and streaming coverage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {relatedTournaments.map((tournament) => (
              <a
                key={tournament.slug}
                href={`/tournament/${tournament.slug}`}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 hover:border-green-500 transition-all"
              >
                <h3 className="text-2xl font-black mb-3">
                  {tournament.name}
                </h3>

                <p className="text-zinc-400">
                  Live matches, TV schedule and streaming information.
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">
            More Tennis Coverage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/live-tennis"
              className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
            >
              Live Tennis Today
            </a>

            <a
              href="/best-ways-to-watch-tennis-online"
              className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
            >
              Best Ways to Watch Tennis Online
            </a>

            <a
              href="/watch-tennis-in/usa"
              className="bg-black border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
            >
              Watch Tennis in USA
            </a>
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",

            "@type": "SportsEvent",

            name: tournamentName,

            sport: "Tennis",

            url: `https://watchtennistoday.com/tournament/${slug}`,

            eventAttendanceMode:
              "https://schema.org/OnlineEventAttendanceMode",

            description:
              `Watch ${tournamentName} live tennis matches, streaming options and TV schedule.`,

            organizer: {
              "@type": "Organization",
              name: "Watch Tennis Today",
            },

            subEvent: tournamentMatches.slice(0, 10).map((match) => ({
              "@type": "SportsEvent",

              name: `${match.player1} vs ${match.player2}`,

              startDate: match.startTime,

              sport: "Tennis",

              competitor: [
                {
                  "@type": "Person",
                  name: match.player1,
                },
                {
                  "@type": "Person",
                  name: match.player2,
                },
              ],
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",

            "@type": "BreadcrumbList",

            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://watchtennistoday.com",
              },

              {
                "@type": "ListItem",
                position: 2,
                name: "Tournament",
                item: "https://watchtennistoday.com/tournament",
              },

              {
                "@type": "ListItem",
                position: 3,
                name: tournamentName,
                item: `https://watchtennistoday.com/tournament/${slug}`,
              },
            ],
          }),
        }}
      />
    </main>
  );
}