import { headers } from "next/headers";
import AdSlot from "@/app/components/AdSlot";
import { playerUrl } from "@/data/playerSlugs";

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
  watchProviders: {
    name: string;
    url: string;
  }[];
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

function getMatchIdFromSlug(slug: string) {
  const oldFormatMatch = slug.match(/^sr:sport_event:\d+/);

  if (oldFormatMatch) {
    return oldFormatMatch[0];
  }

  const numericId = slug.match(/\d+$/)?.[0];

  if (numericId) {
    return `sr:sport_event:${numericId}`;
  }

  return null;
}

function getReadableTitleFromSlug(slug: string) {
  return slug
    .replace(/^sr:sport_event:\d+--/, "")
    .replace(/-\d+$/, "")
    .replace(/-/g, " ");
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const readableTitle = getReadableTitleFromSlug(decodedSlug);

  return {
    title: `${
      readableTitle || "Tennis Match"
    } Live Stream & TV Schedule | Watch Tennis Today`,

    description:
      "Watch live tennis streams, TV broadcasters, schedules and official streaming platforms for ATP, WTA and Grand Slam matches.",

    alternates: {
      canonical: `https://watchtennistoday.com/watch/${slug}`,
    },
  };
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const matches = await getMatches();
  console.log("WATCH PAGE MATCHES DEBUG", {
  isArray: Array.isArray(matches),
  count: matches.length,
  firstMatch: matches[0],
});

const numericIdFromSlug = decodedSlug.match(/(\d+)$/)?.[1];

const match = matches.find((item) => {
  const itemNumericId = item.id?.split(":").pop();

  return itemNumericId === numericIdFromSlug;
});
console.log("MATCH DEBUG", {
  decodedSlug,
  numericIdFromSlug,
  foundMatch: match?.id,
  firstIds: matches.slice(0, 5).map((item) => item.id),
});

  if (!match) {
    return (
      <main className="min-h-screen bg-black text-white p-10">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-4xl font-black mt-8">Match not found</h1>

        <p className="text-zinc-400 mt-3">
          This match may have finished or is no longer available in the current
          schedule.
        </p>
      </main>
    );
  }

  const tournamentSlug = match.tournament
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-zinc-400 mb-8">
          <a href="/" className="hover:text-white">
            Home
          </a>{" "}
          /{" "}
          <a href="/tournament" className="hover:text-white">
            Tournaments
          </a>{" "}
          /{" "}
          <a
            href={`/tournament/${tournamentSlug}`}
            className="hover:text-white"
          >
            {match.tournament}
          </a>
        </nav>

        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-green-500 text-black font-black px-4 py-2 rounded-full text-sm">
              {match.status}
            </span>

            <span className="text-zinc-400">{match.category}</span>
          </div>

          <h1 className="text-5xl font-black leading-tight mb-6">
  <a
    href={playerUrl(match.player1)}
    className="hover:text-green-400 transition-colors"
  >
    {match.player1}
  </a>
  <br />
  vs
  <br />
  <a
    href={playerUrl(match.player2)}
    className="hover:text-green-400 transition-colors"
  >
    {match.player2}
  </a>
</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <p className="text-zinc-500 text-sm mb-2">Tournament</p>
              <p className="text-2xl font-bold">{match.tournament}</p>
            </div>

            <div>
              <p className="text-zinc-500 text-sm mb-2">Score</p>
              <p className="text-2xl font-bold">{match.score}</p>
            </div>

            <div>
              <p className="text-zinc-500 text-sm mb-2">Start Time</p>
              <p className="text-xl font-semibold">
                {new Date(match.startTime).toLocaleString()}
              </p>
            </div>
          </div>

          <section className="mt-16 text-zinc-300 space-y-6">
            <h2 className="text-3xl font-black">
              Watch {match.player1} vs {match.player2} Live
            </h2>

            <p>
              Watch {match.player1} vs {match.player2} live from{" "}
              {match.tournament}. Find official TV broadcasters, streaming
              platforms, match schedule and live tennis coverage.
            </p>

            <p>
              This {match.category} tennis match starts on{" "}
              {new Date(match.startTime).toLocaleString()}.
            </p>

            <p>
              Watch Tennis Today provides updated ATP, WTA and Grand Slam
              streaming information for tennis fans worldwide.
            </p>
          </section>
          <AdSlot />
<section className="mt-16 bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
  <h2 className="text-3xl font-black mb-4">
    🔔 Get Match Alerts
  </h2>

  <p className="text-zinc-400 mb-6">
    Get notified before {match.player1} vs {match.player2} starts,
    including live stream updates and tennis schedule alerts.
  </p>

  <form
    action="https://formspree.io/f/xeenwwbk"
    method="POST"
    className="flex flex-col md:flex-row gap-4"
  >
    <input
      type="email"
      name="email"
      required
      placeholder="Your email"
      className="flex-1 bg-black border border-zinc-700 rounded-2xl px-5 py-4 text-white"
    />

    <input
      type="hidden"
      name="match"
      value={`${match.player1} vs ${match.player2}`}
    />

    <input
      type="hidden"
      name="source"
      value="match-page"
    />

    <button
      type="submit"
      className="bg-green-500 text-black px-6 py-4 rounded-2xl font-black hover:bg-green-400 transition-all"
    >
      Notify Me
    </button>
  </form>
</section>
          <div className="mt-16">
            <h2 className="text-3xl font-black mb-5">📺 Where to Watch</h2>

            {match.watchProviders.length > 0 ? (
              <div className="space-y-4">
                {match.watchProviders.map((provider) => (
                  <a
                    key={provider.name}
                    href={provider.url}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="block bg-green-500 text-black rounded-2xl px-5 py-4 font-black hover:bg-green-400 transition-all"
                  >
                    {provider.name}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400">No trusted watch source found yet.</p>
            )}
          </div>
<section className="mt-16">
  <h2 className="text-3xl font-black mb-6">
    🎾 More Live Tennis Matches
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {matches
      .filter(
        (item) =>
          item.id !== match.id &&
          item.status !== "finished"
      )
      .slice(0, 6)
      .map((item) => {
        const relatedMatchSlug = `${item.player1
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}-vs-${item.player2
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}-${
          item.id.split(":").pop()
        }`;

        return (
          <a
            key={item.id}
            href={`/watch/${relatedMatchSlug}`}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 hover:border-green-500 transition-all"
          >
            <div className="flex justify-between mb-3">
              <span className="font-black">
                {item.status}
              </span>

              <span className="text-zinc-500">
                {item.category}
              </span>
            </div>

            <h3 className="text-2xl font-black mb-2">
              {item.player1}
              <br />
              vs
              <br />
              {item.player2}
            </h3>

            <p className="text-zinc-400">
              {item.tournament}
            </p>
          </a>
        );
      })}
  </div>
</section>
          <section className="mt-16 border-t border-zinc-800 pt-8">
            <h2 className="text-2xl font-black mb-5">
              More Tennis Coverage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/live-tennis"
                className="bg-zinc-800 rounded-2xl p-5 font-bold hover:bg-zinc-700"
              >
                Live Tennis Today
              </a>

              <a
                href={`/tournament/${tournamentSlug}`}
                className="bg-zinc-800 rounded-2xl p-5 font-bold hover:bg-zinc-700"
              >
                More from {match.tournament}
              </a>

              <a
                href="/best-ways-to-watch-tennis-online"
                className="bg-zinc-800 rounded-2xl p-5 font-bold hover:bg-zinc-700"
              >
                Best Ways to Watch Tennis Online
              </a>
            </div>
          </section>
        </div>
      </div>
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SportsEvent",

      name: `${match.player1} vs ${match.player2}`,

      sport: "Tennis",

      startDate: match.startTime,

      eventStatus:
        match.status === "live"
          ? "https://schema.org/EventInProgress"
          : "https://schema.org/EventScheduled",

      competitor: [
        {
          "@type": "SportsTeam",
          name: match.player1,
        },
        {
          "@type": "SportsTeam",
          name: match.player2,
        },
      ],

      location: {
        "@type": "Place",
        name: match.tournament,
      },

      url: `https://watchtennistoday.com/watch/${slug}`,
    }),
  }}
/>
    </main>
  );
}