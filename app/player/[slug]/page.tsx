import type { Metadata } from "next";
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

function formatPlayerName(slug?: string) {
  if (!slug) {
    return "Tennis Player";
  }

  return slug
    .split("-")
    .reverse()
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const playerName = formatPlayerName(slug);

  return {
    title: `${playerName} Live Stream & Matches Today | Watch Tennis Today`,
    description: `Watch ${playerName} live today. Find tennis match schedule, live streams, TV channels and tournament information.`,
    openGraph: {
      title: `${playerName} Live Stream & Matches Today`,
      description: `Watch ${playerName} live today.`,
      url: `https://watchtennistoday.com/player/${slug}`,
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${playerName} Live Stream & Matches Today`,
      description: `Watch ${playerName} live today.`,
    },
  };
}

async function getBaseUrl() {
  const headersList = await headers();

  const host = headersList.get("host");

  if (!host) {
    return "http://localhost:3000";
  }

  const protocol = host.includes(
    "localhost"
  )
    ? "http"
    : "https";

  return `${protocol}://${host}`;
}

async function getMatches(): Promise<
  Match[]
> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(
    `${baseUrl}/api/matches`,
    {
      cache: "no-store",
    }
  );

  return response.json();
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const playerName = formatPlayerName(slug);

  const matches = await getMatches();

  const playerMatches = matches.filter(
    (match) =>
      match.player1
        .toLowerCase()
        .includes(
          playerName
            .split(" ")
            .reverse()
            .join(" ")
            .toLowerCase()
        ) ||
      match.player2
        .toLowerCase()
        .includes(
          playerName
            .split(" ")
            .reverse()
            .join(" ")
            .toLowerCase()
        )
  );

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {playerName} Live Matches &
        Streaming
      </h1>

      <section className="mb-10 rounded-xl border p-5">
  <h2 className="text-2xl font-semibold mb-3">
    {playerName} Next Match
  </h2>

  {playerMatches.length > 0 ? (
    <div className="space-y-3">
      {playerMatches.map((match) => (
        <div key={match.id}>
          <p className="font-semibold">
            {match.player1} vs {match.player2}
          </p>
          <p>{match.tournament}</p>
          <p>{match.status}</p>
        </div>
      ))}
    </div>
  ) : (
    <p>
      No upcoming matches found for {playerName} right now.
      Check back later for live tennis updates and streaming information.
    </p>
  )}
</section>

<section className="mb-10 rounded-xl border p-5 bg-gray-50">
  <h2 className="text-2xl font-semibold mb-3">
    Get notified when {playerName} plays
  </h2>

  <p className="mb-4">
    Leave your email and get updates about {playerName} live matches,
    schedule changes and streaming information.
  </p>

  <form
    action="https://formspree.io/f/xeenwwbk"
    method="POST"
    className="flex gap-3"
  >
    <input
      type="email"
      name="email"
      required
      placeholder="Your email"
      className="flex-1 rounded-lg border px-4 py-2"
    />

    <input
      type="hidden"
      name="player"
      value={playerName}
    />

    <input
      type="hidden"
      name="source"
      value="player-page"
    />

    <button
      type="submit"
      className="rounded-lg bg-black px-5 py-2 text-white"
    >
      Notify me
    </button>
  </form>
</section>

<section className="mb-10">
  <h2 className="text-2xl font-semibold mb-4">
    Other popular tennis players
  </h2>

  <div className="grid grid-cols-2 gap-3">
    {[
      ["Jannik Sinner", "sinner-jannik"],
      ["Carlos Alcaraz", "alcaraz-carlos"],
      ["Novak Djokovic", "djokovic-novak"],
      ["Iga Swiatek", "swiatek-iga"],
      ["Aryna Sabalenka", "sabalenka-aryna"],
      ["Coco Gauff", "gauff-coco"],
    ]
      .filter(([, playerSlug]) => playerSlug !== slug)
      .map(([name, playerSlug]) => (
        <a
          key={playerSlug}
          href={`/player/${playerSlug}`}
          className="rounded-lg border p-4 hover:bg-gray-50"
        >
          {name} live matches
        </a>
      ))}
  </div>
</section>

      <div className="space-y-4 mb-10">
        {playerMatches.map((match) => (
          <div
            key={match.id}
            className="border rounded-xl p-4"
          >
            <div className="font-semibold">
              {match.player1} vs{" "}
              {match.player2}
            </div>

            <div>
              {match.tournament}
            </div>

            <div>{match.status}</div>
          </div>
        ))}
      </div>

      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-2xl font-semibold">
          Watch {playerName} Live
        </h2>

        <p>
          Watch {playerName} live
          today including ATP and
          Grand Slam tennis matches.
        </p>

        <p>
          Find live streams, match
          schedules, TV channels and
          tournament information for{" "}
          {playerName}.
        </p>

        <p>
          Follow upcoming matches and
          watch tennis online on Watch
          Tennis Today.
        </p>
      </section>
    </main>
  );
}