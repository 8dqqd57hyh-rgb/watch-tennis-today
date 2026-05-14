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

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.matches)) {
    return data.matches;
  }

  return [];
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const metadata = {
  title: "Tennis Tournaments & Live Streams | Watch Tennis Today",
  description:
    "Browse ATP, WTA, Challenger and Grand Slam tennis tournaments, live streams and TV schedule information.",
};

export default async function TournamentsPage() {
  const matches = await getMatches();

  const tournaments = [
    ...new Map(
      matches.map((match) => [
        slugify(match.tournament),
        {
          name: match.tournament,
          slug: slugify(match.tournament),
          category: match.category,
        },
      ])
    ).values(),
  ];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

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

              <p className="text-zinc-400">
                View live matches, streaming information and TV schedule.
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}