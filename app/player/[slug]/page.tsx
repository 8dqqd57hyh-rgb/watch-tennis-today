import type { Metadata } from "next";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

const PLAYERS = [
  "sinner-jannik",
  "alcaraz-carlos",
  "djokovic-novak",
  "swiatek-iga",
  "sabalenka-aryna",
  "gauff-coco",
  "zverev-alexander",
  "medvedev-daniil",

  "rune-holger",
  "fritz-taylor",
  "rublev-andrey",
  "ruud-casper",
  "tsitsipas-stefanos",
  "de-minaur-alex",
  "musetti-lorenzo",
  "paul-tommy",
  "shelton-ben",
  "tiafoe-frances",
  "humbert-ugo",
  "dimitrov-grigor",

  "pegula-jessica",
  "rybakina-elena",
  "ostapenko-jelena",
  "kasatkina-daria",
  "navarro-emma",
  "paolini-jasmine",
  "zheng-qinwen",
  "vondrousova-marketa",
  "sakkari-maria",
  "jabeur-ons",
];

export async function generateStaticParams() {
  return PLAYERS.map((slug) => ({
    slug,
  }));
}

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
}): Promise<Metadata> {
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

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.matches)) {
    return data.matches;
  }

  return [];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMatchSlug(match: Match) {
  const readablePart = slugify(
    `${match.player1}-vs-${match.player2}`
  );

  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
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

  const relatedPlayers = PLAYERS
    .filter((playerSlug) => playerSlug !== slug)
    .slice(0, 12);

  return (
    <main className="max-w-4xl mx-auto p-4">
        <nav className="text-sm text-zinc-400 mb-6 flex flex-wrap gap-2">
  <a href="/" className="hover:text-white">
    Home
  </a>

  <span>/</span>

  <a
    href="/live-tennis"
    className="hover:text-white"
  >
    Players
  </a>

  <span>/</span>

  <span className="text-white">
    {playerName}
  </span>
</nav>
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

                <div className="flex items-center gap-2 mt-2">
                  {match.status === "LIVE" ? (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      LIVE NOW
                    </span>
                  ) : (
                    <span className="bg-zinc-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {match.status}
                    </span>
                  )}
                </div>
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
          {relatedPlayers.map((playerSlug) => {
            const name = formatPlayerName(playerSlug);

            return (
              <a
                key={playerSlug}
                href={`/player/${playerSlug}`}
                className="rounded-lg border p-4 hover:bg-gray-50 transition"
              >
                {name} live matches
              </a>
            );
          })}
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold">
          FAQ about {playerName}
        </h2>

        <div>
          <h3 className="font-semibold">
            Where can I watch {playerName} live?
          </h3>

          <p>
            You can watch {playerName} live on official tennis broadcasters,
            streaming platforms and sports TV channels depending on your country.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            When is the next {playerName} match?
          </h3>

          <p>
            Upcoming match information for {playerName} is updated regularly on Watch Tennis Today.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">
            Does Watch Tennis Today stream matches?
          </h3>

          <p>
            Watch Tennis Today helps fans find where to watch tennis matches online and on TV.
          </p>
        </div>
      </section>

      <div className="space-y-4 mb-10 mt-10">
        {playerMatches.map((match) => (
          <a
            key={match.id}
            href={`/watch/${getMatchSlug(match)}`}
            className="block border rounded-xl p-4 hover:bg-gray-50 transition"
          >
            <div className="font-semibold">
              {match.player1} vs {match.player2}
            </div>

            <div>{match.tournament}</div>

            <div className="mt-2">
              {match.status === "LIVE" ? (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  LIVE NOW
                </span>
              ) : (
                <span className="bg-zinc-700 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {match.status}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>

      <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
        <h2 className="text-3xl font-black mb-5">
          📺 Where to Watch {playerName} Live
        </h2>

        <div className="space-y-5 text-zinc-300 leading-8">
          <p>
            Tennis fans can watch {playerName} live on official sports broadcasters,
            streaming platforms and tennis TV services depending on country and
            tournament rights.
          </p>

          <p>
            Coverage may include ATP Tour events, WTA tournaments, Grand Slams,
            Masters events and international competitions featuring {playerName}.
          </p>

          <p>
            Watch Tennis Today helps fans find match schedules, live tennis coverage,
            streaming options and TV channels for upcoming {playerName} matches.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/watch"
            className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400 transition-all"
          >
            Watch Tennis Live
          </a>

          <a
            href="/live-tennis"
            className="rounded-2xl bg-zinc-800 px-5 py-3 font-black text-white hover:bg-zinc-700 transition-all"
          >
            Live Tennis Schedule
          </a>
        </div>
      </section>

      <section className="space-y-4 text-sm leading-7">
        <h2 className="text-2xl font-semibold">
          Watch {playerName} Live
        </h2>

        <p>
          Watch {playerName} live today including ATP and Grand Slam tennis matches.
        </p>

        <p>
          Find live streams, match schedules, TV channels and tournament information for{" "}
          {playerName}.
        </p>

        <p>
          Follow upcoming matches and watch tennis online on Watch Tennis Today.
        </p>
      </section>
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
          name: "Players",
          item: "https://watchtennistoday.com/live-tennis",
        },

        {
          "@type": "ListItem",
          position: 3,
          name: playerName,
          item: `https://watchtennistoday.com/player/${slug}`,
        },
      ],
    }),
  }}
/>
    </main>
  );
}