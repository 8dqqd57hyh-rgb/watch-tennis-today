import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { players } from "@/data/players";
import VpnPromo from "@/app/components/VpnPromo";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";

export const dynamic = "force-dynamic";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score?: string;
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

  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

async function getMatches(): Promise<Match[]> {
  try {
    const baseUrl = await getBaseUrl();

    const response = await fetch(`${baseUrl}/api/matches`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    const data = await response.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.matches)) return data.matches;

    return [];
  } catch {
    return [];
  }
}

function formatDateTime(value?: string | null) {
  if (!value) return "Time to be confirmed";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function playerIsInMatch(playerName: string, match: Match) {
  const playerLastName = playerName.toLowerCase().split(" ").pop() || "";

  const matchText = `${match.player1} ${match.player2}`
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ");

  return matchText.includes(playerLastName);
}

function getOpponent(playerName: string, match: Match) {
  const lastName = playerName.toLowerCase().split(" ").pop() || "";

  if (match.player1.toLowerCase().includes(lastName)) {
    return match.player2;
  }

  if (match.player2.toLowerCase().includes(lastName)) {
    return match.player1;
  }

  return "Opponent to be confirmed";
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const player = players[slug as keyof typeof players];

  if (!player) {
    return {
      title: "Player Next Match | Watch Tennis Today",
      description:
        "Find tennis next match information, schedules and streaming options.",
    };
  }

  return {
    title: `${player.name} Next Match | Schedule, Opponent & Streaming`,
    description: `Find ${player.name}'s next tennis match, opponent, tournament schedule, live stream information and TV coverage.`,
    alternates: {
      canonical: `https://watchtennistoday.com/next-match/${slug}`,
    },
    openGraph: {
      title: `${player.name} Next Match`,
      description: `Find ${player.name}'s next match, schedule, opponent and streaming options.`,
      url: `https://watchtennistoday.com/next-match/${slug}`,
      siteName: "Watch Tennis Today",
      type: "website",
    },
  };
}

export default async function NextMatchPlayerPage({ params }: Props) {
  const { slug } = await params;
  const player = players[slug as keyof typeof players];

  if (!player) notFound();

  const matches = await getMatches();

  const playerMatches = matches.filter((match) =>
    playerIsInMatch(player.name, match)
  );

  const liveMatch = playerMatches.find((match) => match.status === "LIVE");

  const scheduledMatch =
    playerMatches.find((match) =>
      ["NOT_STARTED", "SCHEDULED", "NS"].includes(match.status)
    ) || playerMatches[0];

  const nextMatch = liveMatch || scheduledMatch;
  const opponent = nextMatch ? getOpponent(player.name, nextMatch) : null;

  const otherPlayers = Object.entries(players)
    .filter(([playerSlug]) => playerSlug !== slug)
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-8 flex flex-wrap gap-2 text-sm text-zinc-400">
          <a href="/" className="hover:text-white">
            Home
          </a>
          <span>/</span>
          <a href="/next-match" className="hover:text-white">
            Next Match
          </a>
          <span>/</span>
          <span className="text-white">{player.name}</span>
        </nav>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-green-400">
            Tennis schedule
          </p>

          <h1 className="mb-5 text-4xl font-black md:text-6xl">
            {player.name} Next Match
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            Find {player.name}&apos;s next tennis match, opponent, tournament,
            start time and legal streaming information.
          </p>
        </section>

        {nextMatch ? (
          <section className="mb-8 rounded-3xl border border-green-500 bg-zinc-900 p-6 md:p-8">
            <div className="mb-5 flex flex-wrap gap-3">
              <span className="rounded-full bg-green-500 px-4 py-2 text-sm font-black text-black">
                {nextMatch.status}
              </span>

              <span className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
                {nextMatch.category}
              </span>

              <span className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
                {nextMatch.tournament}
              </span>
            </div>

            <h2 className="mb-6 text-3xl font-black md:text-5xl">
              {player.name} vs {opponent}
            </h2>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="mb-2 text-sm text-zinc-500">Match time</p>
                <p className="text-xl font-black">
                  {formatDateTime(nextMatch.startTime)}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="mb-2 text-sm text-zinc-500">Tournament</p>
                <p className="text-xl font-black">{nextMatch.tournament}</p>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="mb-2 text-sm text-zinc-500">Tour</p>
                <p className="text-xl font-black">{player.tour}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`/watch-player-live/${slug}`}
                className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400"
              >
                Watch {player.name} Live →
              </a>

              <a
                href={`/${player.tour.toLowerCase()}-live-today`}
                className="rounded-2xl border border-zinc-700 px-6 py-4 font-black text-white hover:border-green-500"
              >
                {player.tour} Live Today
              </a>
            </div>
          </section>
        ) : (
          <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
            <h2 className="mb-4 text-3xl font-black">
              No confirmed next match yet
            </h2>

            <p className="leading-8 text-zinc-400">
              There is no confirmed upcoming match for {player.name} in the
              current schedule feed. Check the live tennis schedule and official
              broadcasters for the latest updates.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/live-tennis"
                className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400"
              >
                View Live Tennis →
              </a>

              <a
                href={`/${player.tour.toLowerCase()}-live-today`}
                className="rounded-2xl border border-zinc-700 px-6 py-4 font-black text-white hover:border-green-500"
              >
                {player.tour} Live Today
              </a>
            </div>
          </section>
        )}

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <h2 className="mb-4 text-3xl font-black">
            Where to watch {player.name}&apos;s next match
          </h2>

          <p className="mb-5 leading-8 text-zinc-300">
            Tennis broadcasting rights depend on your country, tournament and
            platform. Check official TV channels and legal streaming services
            before the match starts.
          </p>

          <StreamingLinksGrid />
        </section>

        <VpnPromo
          title={`Watching ${player.name} while traveling?`}
          text="Some tennis streams are region-restricted because of broadcast rights. A VPN can help you safely access your usual streaming accounts while abroad."
        />

        <RelatedMoneyLinks playerName={player.name} />

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <h2 className="mb-5 text-3xl font-black">
            Other Popular Next Match Pages
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {otherPlayers.map(([playerSlug, popularPlayer]) => (
              <a
                key={playerSlug}
                href={`/next-match/${playerSlug}`}
                className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
              >
                <h3 className="text-xl font-black">
                  {popularPlayer.name} Next Match
                </h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Schedule, opponent and streaming info
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <h2 className="mb-5 text-3xl font-black">
            {player.name} Next Match FAQ
          </h2>

          <div className="space-y-5">
            <div>
              <h3 className="mb-2 text-xl font-black">
                When is {player.name}&apos;s next match?
              </h3>
              <p className="text-zinc-400">
                The next match time depends on the tournament schedule and may
                change because of weather, previous matches or organizer
                updates.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-black">
                Where can I watch {player.name} live?
              </h3>
              <p className="text-zinc-400">
                You can watch through official broadcasters and legal streaming
                platforms available in your country.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-black">
                Is {player.name} playing today?
              </h3>
              <p className="text-zinc-400">
                If {player.name} is listed in today&apos;s live schedule, the
                match card above will show the tournament, opponent and match
                status.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}