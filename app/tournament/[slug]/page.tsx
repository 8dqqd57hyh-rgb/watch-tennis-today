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

function matchSlug(match: Match) {
  const readablePart = slugify(
    `${match.player1}-vs-${match.player2}`
  );

  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
}

export async function generateMetadata() {
  return {
    title:
      "ATP Live Today | ATP Tennis Matches & Streaming",

    description:
      "Watch ATP tennis live today. Find ATP match schedules, streaming information, TV channels and live tennis coverage.",
  };
}

export default async function Page() {
  const matches = await getMatches();

  const atpMatches = matches.filter(
    (match) =>
      match.category === "ATP"
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        <nav className="text-sm text-zinc-400 mb-6 flex flex-wrap gap-2">
          <a href="/" className="hover:text-white">
            Home
          </a>

          <span>/</span>

          <span className="text-white">
            ATP Live Today
          </span>
        </nav>

        <h1 className="text-5xl font-black mb-6">
          🎾 ATP Live Today
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
          Watch ATP tennis matches live today including schedules,
          TV channels, streaming information and live scores.
        </p>

        <section className="space-y-5">
          {atpMatches.map((match) => (
            <a
              key={match.id}
              href={`/watch/${matchSlug(match)}`}
              className="block bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
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
                  ATP
                </span>
              </div>

              <h2 className="text-3xl font-black mb-3">
                {match.player1}
                <br />
                vs
                <br />
                {match.player2}
              </h2>

              <p className="text-zinc-400 mb-3">
                {match.tournament}
              </p>

              <p>
                {new Date(
                  match.startTime
                ).toLocaleString()}
              </p>
            </a>
          ))}
        </section>

        <section className="mt-12 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">
            📺 Where to Watch ATP Tennis
          </h2>

          <p className="text-zinc-300 leading-8">
            ATP tennis matches may be available on official broadcasters,
            streaming services and sports TV platforms depending on your country.
          </p>
        </section>
      </div>
    </main>
  );
}