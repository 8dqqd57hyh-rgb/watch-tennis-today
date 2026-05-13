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

  const protocol = host.includes("localhost")
    ? "http"
    : "https";

  return `${protocol}://${host}`;
}

async function getMatches(): Promise<Match[]> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(
    `${baseUrl}/api/matches`,
    {
      cache: "no-store",
    }
  );

  return response.json();
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function readableTournament(slug: string) {
  return slug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tournament =
    readableTournament(slug);

  return {
    title: `${tournament} Live Stream & TV Schedule | Watch Tennis Today`,
    description: `Watch ${tournament} live tennis matches, TV channels, streams and tournament schedule.`,
  };
}

export default async function TournamentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tournamentName =
    readableTournament(slug);

  const matches = await getMatches();

  const tournamentMatches = matches.filter(
    (match) =>
      slugify(match.tournament) === slug
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a
          href="/"
          className="text-zinc-400 hover:text-white"
        >
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-4">
          🏆 {tournamentName}
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Watch {tournamentName} live tennis
          matches, TV schedule and streaming
          options.
        </p>

        <div className="space-y-6">
          {tournamentMatches.map((match) => (
            <div
              key={match.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
            >
              <div className="flex justify-between mb-4">
                <span className="font-bold">
                  {match.status}
                </span>

                <span className="text-zinc-400">
                  {match.category}
                </span>
              </div>

              <h2 className="text-3xl font-black mb-3">
                {match.player1}
                <br />
                vs
                <br />
                {match.player2}
              </h2>

              <p className="mb-3">
                {new Date(
                  match.startTime
                ).toLocaleString()}
              </p>

              <a
                href={`/watch/${encodeURIComponent(
                  match.id
                )}`}
                className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
              >
                Watch Match
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}