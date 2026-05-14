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

  const response = await fetch(`${baseUrl}/api/matches`, {
    cache: "no-store",
  });

  return response.json();
}

function formatName(slug: string) {
  return slug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const playerName = slug
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");

  return {
    title: `${playerName} Live Matches, Streams & Schedule | Watch Tennis Today`,

    description: `Watch ${playerName} live tennis matches, TV channels, streams, tournament schedule and latest results.`,

    alternates: {
      canonical: `https://watchtennistoday.com/player/${slug}`,
    },
  };
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const playerName = formatName(slug);

  const matches = await getMatches();

 function normalizePlayerName(name: string) {
  return name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const normalizedPlayer = normalizePlayerName(playerName);

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

const playerMatches = matches.filter((match) => {
  const players = [
    ...match.player1.split("/"),
    ...match.player2.split("/"),
  ].map((player) => normalizePlayerName(player));

  return players.some((player) =>
    player.includes(normalizedPlayer)
  );
});

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
          🎾 {playerName}
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Watch {playerName} live tennis matches,
          streams, TV schedule and tournament info.
        </p>

        <div className="bg-gradient-to-br from-green-500 to-lime-400 text-black rounded-3xl p-6 mb-10">
  <h2 className="text-3xl font-black mb-3">
    📺 Where to Watch {playerName} Live
  </h2>

  <p className="font-semibold mb-5">
    Check official broadcasters and live tennis schedules before the match starts.
    Streaming availability may depend on your country and tournament rights.
  </p>

  <div className="flex flex-wrap gap-3">
    <a
      href="/live-tennis"
      className="bg-black text-white px-5 py-3 rounded-2xl font-black"
    >
      View Live Matches
    </a>

    <a
      href="/watch-tennis-in/poland"
      className="bg-white text-black px-5 py-3 rounded-2xl font-black"
    >
      Watch by Country
    </a>
  </div>
</div>

        <div className="space-y-6">
            {playerMatches.length === 0 && (
  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
    <h2 className="text-2xl font-black mb-3">
      No live matches found for {playerName}
    </h2>

    <p className="text-zinc-400 mb-5">
      There are no current matches listed for {playerName}. Check the live tennis
      schedule for today&apos;s ATP, WTA and Challenger matches.
    </p>

    <a
      href="/live-tennis"
      className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
    >
      View Live Tennis
    </a>
  </div>
)}
          {playerMatches.map((match) => (
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

              <p className="text-zinc-400 mb-2">
                {match.tournament}
              </p>

              <p className="mb-6">
                {new Date(
                  match.startTime
                ).toLocaleString()}
              </p>

              <a
                href={`/watch/${matchSlug(match)}`}
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