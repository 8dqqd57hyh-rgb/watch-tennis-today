import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { players } from "@/data/players";
import VpnPromo from "@/app/components/VpnPromo";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";

export const dynamic = "force-dynamic";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  startTime?: string | null;
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) return "http://localhost:3000";

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

  if (!response.ok) return [];

  const data = await response.json();

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.matches)) return data.matches;

  return [];
}

function formatDateTime(value?: string | null) {
  if (!value) return "Time to be confirmed";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const player = players[slug as keyof typeof players];

  if (!player) {
    return {
      title: "Player Not Found",
    };
  }

  return {
    title: `${player.name} Next Match | Watch Tennis Today`,
    description: `Find ${player.name}'s next tennis match, tournament schedule, live stream information and TV coverage.`,
  };
}

export default async function NextMatchPage({
  params,
}: Props) {
  const { slug } = await params;

  const player = players[slug as keyof typeof players];

  if (!player) {
    notFound();
  }

  const matches = await getMatches();

  const playerMatches = matches.filter((match) => {
    const text =
      `${match.player1} ${match.player2}`.toLowerCase();

    const lastName =
      player.name.toLowerCase().split(" ").pop() || "";

    return text.includes(lastName);
  });

  const nextMatch = playerMatches[0];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a
          href="/"
          className="text-zinc-400 hover:text-white"
        >
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-6">
          🎾 {player.name} Next Match
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
          Find {player.name}'s next tennis match, live stream,
          tournament schedule and TV coverage.
        </p>

        {nextMatch ? (
          <section className="bg-zinc-900 border border-green-500 rounded-3xl p-6 mb-8">
            <div className="flex flex-wrap gap-3 mb-5">
              <span className="bg-green-500 text-black px-4 py-2 rounded-full text-sm font-black">
                {nextMatch.status}
              </span>

              <span className="text-zinc-400">
                {nextMatch.category}
              </span>

              <span className="text-zinc-500">
                •
              </span>

              <span className="text-zinc-400">
                {nextMatch.tournament}
              </span>
            </div>

            <h2 className="text-4xl font-black mb-5">
              {nextMatch.player1}
              <br />
              vs
              <br />
              {nextMatch.player2}
            </h2>

            <div className="mb-6">
              <p className="text-zinc-500 text-sm mb-1">
                Match Time
              </p>

              <p className="font-black text-xl">
                {formatDateTime(nextMatch.startTime)}
              </p>
            </div>

            <a
              href={`/watch-player-live/${slug}`}
              className="inline-block bg-green-500 text-black px-6 py-4 rounded-2xl font-black hover:bg-green-400"
            >
              Watch {player.name} Live →
            </a>
          </section>
        ) : (
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
            <h2 className="text-3xl font-black mb-4">
              No scheduled match found
            </h2>

            <p className="text-zinc-400 leading-8">
              No upcoming match currently available for {player.name}.
              Check back later for updated ATP and WTA schedules.
            </p>
          </section>
        )}

        <VpnPromo
          title={`Watching ${player.name} while traveling?`}
          text={`Some tennis broadcasts may be unavailable depending on your country and streaming rights.`}
        />
<section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
  <h2 className="text-3xl font-black mb-5">
    Other Popular Next Matches
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Object.entries(players)
      .filter(([playerSlug]) => playerSlug !== slug)
      .slice(0, 8)
      .map(([playerSlug, popularPlayer]) => (
        <a
          key={playerSlug}
          href={`/next-match/${playerSlug}`}
          className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 transition-all"
        >
          <h3 className="text-xl font-black">
            {popularPlayer.name} Next Match
          </h3>
        </a>
      ))}
  </div>
</section>
        <StreamingLinksGrid />
      </div>
    </main>
  );
}