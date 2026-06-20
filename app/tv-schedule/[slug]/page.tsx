import { headers } from "next/headers";
import Link from "next/link";
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
      title: "TV Schedule Not Found",
    };
  }

  return {
    title: `${player.name} TV Schedule | Watch Tennis Today`,
    description: `Find ${player.name} TV schedule, live stream information, match times and official tennis broadcasters.`,
    robots: {
  index: false,
  follow: true,
},
  };
}

export default async function TvSchedulePage({
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

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="text-zinc-400 hover:text-white"
        >
          ← Back
        </Link>

        <h1 className="text-5xl font-black mt-8 mb-6">
          📺 {player.name} TV Schedule
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
          Find {player.name} TV schedule, match times,
          live streams and official tennis broadcasters.
        </p>

        {playerMatches.length > 0 ? (
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
            <h2 className="text-3xl font-black mb-5">
              Upcoming Matches
            </h2>

            <div className="space-y-4">
              {playerMatches.slice(0, 10).map((match) => (
                <div
                  key={match.id}
                  className="bg-black border border-zinc-800 rounded-2xl p-5"
                >
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-black">
                      {match.status}
                    </span>

                    <span className="text-zinc-400">
                      {match.category}
                    </span>

                    <span className="text-zinc-500">
                      •
                    </span>

                    <span className="text-zinc-400">
                      {match.tournament}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black mb-3">
                    {match.player1}
                    <br />
                    vs
                    <br />
                    {match.player2}
                  </h3>

                  <p className="text-zinc-400">
                    {formatDateTime(match.startTime)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-8">
  <h2 className="text-3xl font-black mb-4">
    No scheduled matches are currently available
  </h2>

  <p className="text-zinc-400 leading-8 mb-6">
    Match schedules for {player.name} may change depending on tournament
    updates, qualification rounds, broadcaster availability and official
    tennis data feeds.
  </p>

  <p className="text-zinc-400 leading-8 mb-6">
    Please check back later for updated TV schedules, live tennis coverage
    and upcoming match information.
  </p>

  <div className="flex flex-wrap gap-4">
    <a
      href="/live-tennis"
      className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all"
    >
      Live Tennis Today
    </a>

    <Link
      href="/tournament"
      className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all"
    >
      Tennis Tournaments
    </Link>
  </div>
</section>
        )}

        <VpnPromo
          title={`Watching ${player.name} from another country?`}
          text={`Tennis broadcasters and streaming availability may vary depending on tournament rights and your current location.`}
        />

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-5">
            More Player Pages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href={`/watch-player-live/${slug}`}
              className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500"
            >
              <h3 className="text-xl font-black">
                Watch {player.name} Live
              </h3>
            </a>

            <a
              href={`/next-match/${slug}`}
              className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500"
            >
              <h3 className="text-xl font-black">
                {player.name} Next Match
              </h3>
            </a>
          </div>
        </section>

        <StreamingLinksGrid />
      </div>
    </main>
  );
}
