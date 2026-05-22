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
   robots: {
  index: false,
  follow: true,
},
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

// safer player matching to avoid surname-only false positives
const playerAliases: Record<string, string[]> = {
  "carlos-alcaraz": ["carlos alcaraz", "c. alcaraz", "carlos alcaraz garfia"],
  "jannik-sinner": ["jannik sinner", "j. sinner"],
  "novak-djokovic": ["novak djokovic", "n. djokovic"],
  "iga-swiatek": ["iga swiatek", "i. swiatek", "iga swiatek", "i. swiatek"],
  "aryna-sabalenka": ["aryna sabalenka", "a. sabalenka"],
};

function normalizePlayerName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^\w\s.-]/g, "") // remove punctuation except dots and hyphens
    .replace(/\s+/g, " ")
    .trim();
}

function isPlayerMatch(playerName: string, slug: string) {
  const normalizedName = normalizePlayerName(playerName || "");
  const aliases = playerAliases[slug];

  if (aliases?.length) {
    return aliases.some((alias) => normalizePlayerName(alias) === normalizedName);
  }

  const slugName = slug.replace(/-/g, " ");
  return normalizedName === normalizePlayerName(slugName);
}

export default async function NextMatchPlayerPage({ params }: Props) {
  const { slug } = await params;
  const player = players[slug as keyof typeof players];

  if (!player) notFound();

  const matches = await getMatches();

  // replace any previous loose surname-only matching with strict check:
  const playerMatches = matches.filter((match) => {
    const p1 = match.player1 || "";
    const p2 = match.player2 || "";
    return isPlayerMatch(p1, slug) || isPlayerMatch(p2, slug);
  });

  // readable player name for messages
  const readablePlayer =
    slug
      .split("-")
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(" ");

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
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
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

        {playerMatches.length > 0 ? (
          <section className="space-y-5">
            {playerMatches.map((m) => (
              <a key={m.id} href={`/watch/${""}`} className="...">
                {/* ...existing match card JSX (unchanged) ... */}
              </a>
            ))}
          </section>
        ) : (
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
            <h2 className="text-2xl font-black mb-3">
              No confirmed {readablePlayer} match right now
            </h2>
            <p>
              No confirmed {readablePlayer} match is available in the current
              schedule. Check back later or visit the live and tournament pages
              for more coverage.
            </p>
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