import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { players, type PlayerSlug } from "@/data/players";
import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import type { Metadata } from "next";
import { matchContainsExactPlayer } from "@/data/playerSlugs";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

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

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) return "http://localhost:3000";

  const protocol = host.includes("localhost") ? "http" : "https";

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
  return `${slugify(match.player1)}-vs-${slugify(match.player2)}-${match.id}`;
}

function isLive(match: Match) {
  return match.status.toUpperCase() === "LIVE";
}

function hasPlayerField<K extends string>(
  player: (typeof players)[PlayerSlug],
  key: K
): player is (typeof players)[PlayerSlug] & Record<K, string> {
  return key in player && typeof player[key as keyof typeof player] === "string";
}

function getPlayerText(player: (typeof players)[PlayerSlug], key: "bio" | "playStyle" | "surfaceStrength") {
  return hasPlayerField(player, key) ? player[key] : null;
}

function getPlayerLiveEditorial(player: (typeof players)[PlayerSlug], playerMatches: Match[]) {
  const bio = getPlayerText(player, "bio");
  const playStyle = getPlayerText(player, "playStyle");
  const surfaceStrength = getPlayerText(player, "surfaceStrength");
  const activeTournaments = Array.from(new Set(playerMatches.map((match) => match.tournament).filter(Boolean))).slice(0, 3);
  const hasLiveMatch = playerMatches.some(isLive);
  const nextMatch = playerMatches.find((match) => !isLive(match) && new Date(match.startTime || 0) > new Date());

  return {
    overview:
      bio ||
      `${player.name} is listed in the Watch Tennis Today player directory for ${player.tour} schedules, live match checks and official viewing guidance. This page is built for fans who want a practical match-day path rather than an unofficial stream link.`,
    playingStyle:
      playStyle ||
      `${player.name} matches should be read through tournament context, surface speed, opponent style and court assignment. Those details often explain why a match becomes a long baseline contest, a serve-dominant sprint or a tactical grind.`,
    recentForm:
      playerMatches.length > 0
        ? `${player.name} currently has ${playerMatches.length} match listing${playerMatches.length === 1 ? "" : "s"} in the available schedule feed. Treat this as a live schedule snapshot, not a complete season record, because tennis data feeds may omit older matches, doubles entries or lower-level events.`
        : `${player.name} does not have a live or upcoming listing in the current feed. That does not mean the player is inactive; it usually means the next order of play, qualifying draw or tournament schedule has not produced a current match entry yet.`,
    surface:
      surfaceStrength ||
      `Surface preference depends on the tournament week. Check whether ${player.name} is on clay, grass, outdoor hard court or indoor hard court before judging match expectations.`,
    whatToWatch:
      hasLiveMatch
        ? `Because ${player.name} has a live listing, prioritize official scoreboards, court assignment and broadcaster confirmation. Live pages can update faster than editorial notes, so use this page as a routing hub.`
        : nextMatch
          ? `For the next ${player.name} match, watch the start window, court order and local broadcaster listing. If earlier matches run long, the start time can move without changing the original listing immediately.`
          : `For upcoming ${player.name} appearances, watch for draw releases, order-of-play updates and country-specific broadcaster announcements. A player page is most useful when it connects schedule context to legal viewing options.`,
    activeTournaments,
  };
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const player = players[slug as PlayerSlug];

  if (!player) {
    return {
      title: "Player Not Found | Watch Tennis Today",
    };
  }

  return {
    title: `Watch ${player.name} Live Tennis Matches | TV Channels & Streaming`,
    description: `Watch ${player.name} live tennis matches today. Find ${player.tour} schedules, TV broadcasters, streaming platforms and live tennis coverage.`,
    robots: {
  index: false,
  follow: true,
},
    alternates: {
      canonical: `https://watchtennistoday.com/watch-player-live/${slug}`,
    },
  };
}

export default async function WatchPlayerLivePage({ params }: Props) {
  const { slug } = await params;
  const player = players[slug as PlayerSlug];

  if (!player) {
    notFound();
  }

  const matches = await getMatches();

  // use exact matching helper to find matches for this player slug

  // example usage: filter matches for this player slug
  const playerMatches = matches.filter((m) =>
    matchContainsExactPlayer(m, slug)
  );
  const editorial = getPlayerLiveEditorial(player, playerMatches);

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-5xl font-black mt-8 mb-6">
          🎾 Watch {player.name} Live Tennis Matches
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
  Follow {player.name} matches, tournament appearances, live tennis schedules
  and official viewing information for major {player.tour} events and Grand
  Slam tournaments.
</p>
        <section className="mb-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-300 leading-8">
  <h2 className="text-3xl font-black text-white mb-4">
    Why Watch {player.name} Live?
  </h2>

  {"bio" in player ? (
  <p className="mb-4">{player.bio}</p>
) : (
  <p className="mb-4">
    {player.name} is featured on Watch Tennis Today with match schedules,
    tournament information and legal tennis viewing guidance.
  </p>
)}

  {"playStyle" in player ? (
  <p className="mb-4">{player.playStyle}</p>
) : (
  <p className="mb-4">
    This page helps fans track {player.name} matches across {player.tour}
    events, including live matches, upcoming schedules and official viewing
    options.
  </p>
)}

  {"surfaceStrength" in player ? (
  <p className="mb-4">
    <strong className="text-white">Best surfaces:</strong>{" "}
    {player.surfaceStrength}
  </p>
) : (
  <p className="mb-4">
    <strong className="text-white">Coverage focus:</strong>{" "}
    live matches, tournament schedules and legal streaming availability.
  </p>
)}

  {"watchReasons" in player ? (
  <ul className="list-disc pl-6 space-y-2">
    {player.watchReasons.map((reason) => (
      <li key={reason}>{reason}</li>
    ))}
  </ul>
) : (
  <ul className="list-disc pl-6 space-y-2">
    <li>Follow live and upcoming matches</li>
    <li>Check official broadcaster information</li>
    <li>Find tournament and schedule updates</li>
  </ul>
)}
</section>
        <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
  <strong>Legal streaming notice:</strong> Watch Tennis Today does not host or
  embed live streams. We help users find official and legal broadcasters and
  streaming options.
</div>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-green-400">
            Player live guide
          </p>
          <h2 className="text-3xl font-black mb-5">
            What to know before watching {player.name}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <h3 className="mb-2 text-xl font-black">Player overview</h3>
              <p className="leading-8 text-zinc-300">{editorial.overview}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <h3 className="mb-2 text-xl font-black">Playing style</h3>
              <p className="leading-8 text-zinc-300">{editorial.playingStyle}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <h3 className="mb-2 text-xl font-black">Recent form signal</h3>
              <p className="leading-8 text-zinc-300">{editorial.recentForm}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <h3 className="mb-2 text-xl font-black">Surface preference</h3>
              <p className="leading-8 text-zinc-300">{editorial.surface}</p>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-green-500/25 bg-green-500/10 p-5">
            <h3 className="mb-2 text-xl font-black">What to watch in the next match</h3>
            <p className="leading-8 text-zinc-300">{editorial.whatToWatch}</p>
          </div>
        </section>

    
<a
  href={`/next-match/${slug}`}
  className="mb-8 inline-block rounded-2xl border border-green-500 px-6 py-4 font-black text-green-400 hover:bg-green-500 hover:text-black transition-all"
>
  See {player.name} Next Match →
</a>
<a
  href={`/tv-schedule/${slug}`}
  className="mb-8 inline-block rounded-2xl border border-zinc-700 px-6 py-4 font-black text-white hover:border-green-500 hover:text-green-400 transition-all"
>
  See {player.name} TV Schedule →
</a>
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full animate-pulse">
              🔴 LIVE
            </span>

            <h2 className="text-3xl font-black">
              {player.name} Matches Today
            </h2>
          </div>

          {playerMatches.length > 0 ? (
            <div className="grid gap-4">
              {playerMatches.map((match) => (
                <a
                  key={match.id}
                  href={`/watch/${getMatchSlug(match)}`}
                  className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 transition-all"
                >
                  <div className="flex flex-wrap justify-between gap-3 mb-4">
                    <span className="text-zinc-400">
                      {match.tournament}
                    </span>

                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full ${
                        isLive(match)
                          ? "bg-red-500 text-white"
                          : "bg-zinc-700 text-white"
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black mb-2">
                    {match.player1}
                    <br />
                    vs
                    <br />
                    {match.player2}
                  </h3>

                  <p className="text-zinc-500">
                    {match.category}
                    {match.score ? ` · ${match.score}` : ""}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400">
              No live or upcoming matches found for {player.name} right now.
              Check back later for updated tennis schedule and streaming
              information.
            </p>
          )}

          <a
            href="/live-tennis"
            className="inline-block mt-6 bg-green-500 text-black px-5 py-3 rounded-2xl font-black hover:bg-green-400 transition-all"
          >
            View All Live Tennis
          </a>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            Where to Watch {player.name}
          </h2>

          <p className="text-zinc-300 leading-8 mb-6">
  Broadcasting rights for {player.name} matches depend on the tournament,
  country, and tour level. Grand Slam events are usually shown on major
  sports networks such as Eurosport, ESPN, TNT Sports, beIN Sports, and
  Tennis Channel, while ATP and WTA events may vary by region.
</p>
<p className="text-zinc-400 leading-8 mb-8">
  Availability may change depending on your location and subscription
  provider. Always use official broadcasters and licensed streaming
  services in your country.
</p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/watch-tennis-in/usa"
              className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
            >
              Watch in USA
            </Link>

            <Link
              href="/watch-tennis-in/uk"
              className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
            >
              Watch in UK
            </Link>

            <Link
              href="/watch-tennis-in/poland"
              className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
            >
              Watch in Poland
            </Link>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            Tournaments Featuring {player.name}
          </h2>

          <div className="space-y-4 text-zinc-300 leading-8">
            {player.tournaments.map((tournament) => (
              <p key={tournament}>{tournament}</p>
            ))}
          </div>
          {editorial.activeTournaments.length > 0 ? (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-black p-5">
              <h3 className="mb-3 text-xl font-black">Active schedule context</h3>
              <p className="mb-4 leading-7 text-zinc-400">
                These tournament names are currently connected to {player.name}
                in the live match feed. Use them to confirm draw, court and TV
                rights before choosing a viewing option.
              </p>
              <div className="flex flex-wrap gap-3">
                {editorial.activeTournaments.map((tournament) => (
                  <a
                    key={tournament}
                    href={`/tournament/${slugify(tournament)}`}
                    className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-200 hover:border-green-500 hover:text-green-400"
                  >
                    {tournament}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </section>
<RelatedMoneyLinks playerName={player.name} />
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            Live Tennis Coverage
          </h2>

          <p className="text-zinc-400 leading-8 mb-6">
            Check live tennis schedules, {player.tour} match coverage and
            upcoming {player.name} matches through official broadcasters and
            official viewing platforms.
          </p>

          <a
            href="/live-tennis"
            className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
          >
            View Live Tennis
          </a>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-3">
                Where can I watch {player.name} live?
              </h3>

              <p className="text-zinc-400 leading-7">
                {player.name} matches are available through official sports
                broadcasters and tennis streaming services depending on your
                region.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">
                Can I stream {player.tour} tennis online?
              </h3>

              <p className="text-zinc-400 leading-7">
                Yes. {player.tour} tennis is available through legal sports
                streaming services and TV broadcasters in many countries.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">
                Does Watch Tennis Today stream matches?
              </h3>

              <p className="text-zinc-400 leading-7">
                No. Watch Tennis Today does not host or embed live streams. We
                help users find official and legal broadcasters and streaming
                options.
              </p>
            </div>
          </div>
        </section>
        <VpnPromo
  title={`Watching ${player.name} while traveling?`}
  text={`${player.name} matches may have different broadcaster availability depending on your region and travel location. A VPN can help improve privacy and connection security while using public Wi-Fi or accessing your usual sports services abroad.`}
/>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: `Where can I watch ${player.name} live?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${player.name} matches are available through official tennis coverage and regional broadcaster listings`,
                  },
                },
                {
                  "@type": "Question",
                  name: `Can I stream ${player.tour} tennis online?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${player.tour} tennis is available through official sports coverage and regional TV availability`,
                  },
                },
              ],
            }),
          }}
        />
      </div>
    </main>
  );
}
