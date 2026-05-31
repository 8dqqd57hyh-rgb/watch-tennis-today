import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import { players, type PlayerSlug } from "@/data/players";
import { getCanonicalPlayerSlug, matchContainsExactPlayer, normalizePlayerName, playerNameFromSlug } from "@/data/playerSlugs";
import PlayerSubscribeBox from "@/app/components/PlayerSubscribeBox";
import LocalPlayerFollowButton from "@/app/components/LocalPlayerFollowButton";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";

export const dynamic = "force-dynamic";

const PLAYERS = Object.keys(players) as PlayerSlug[];
const CURRENT_SEASON = new Date().getFullYear();

function buildPlayerSeoTitle(playerName: string) {
  return `${playerName} Schedule, Results & Live Matches (${CURRENT_SEASON})`;
}

function buildPlayerSeoDescription(playerName: string) {
  return `Follow ${playerName} live matches, upcoming schedule, recent results, tournament updates and legal tennis TV information for ${CURRENT_SEASON}.`;
}

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


const PRIORITY_PLAYERS: PlayerSlug[] = [
  "jannik-sinner",
  "carlos-alcaraz",
  "novak-djokovic",
  "daniil-medvedev",
  "alexander-zverev",
  "holger-rune",
  "taylor-fritz",
  "iga-swiatek",
  "aryna-sabalenka",
  "coco-gauff",
  "elena-rybakina",
  "jessica-pegula",
  "naomi-osaka",
  "mirra-andreeva",
];

function getStatusPriority(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "LIVE") return 0;
  if (normalized === "SUSPENDED") return 1;
  if (normalized === "UPCOMING") return 2;

  return 3;
}

function getMatchTime(match: Match) {
  const timestamp = new Date(match.startTime || "").getTime();

  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}

function sortMatchesByUserIntent(a: Match, b: Match) {
  const statusDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
  if (statusDiff !== 0) return statusDiff;

  return getMatchTime(a) - getMatchTime(b);
}

function getPlayerSlugByName(name: string) {
  const normalizedName = normalizePlayerName(name);

  return PLAYERS.find((playerSlug) =>
    normalizePlayerName(players[playerSlug].name) === normalizedName
  );
}

function uniquePlayerSlugs(slugs: (PlayerSlug | undefined | null)[]) {
  const seen = new Set<PlayerSlug>();

  return slugs.filter((slug): slug is PlayerSlug => {
    if (!slug || seen.has(slug)) return false;

    seen.add(slug);
    return true;
  });
}

function getRelatedPlayers(
  currentSlug: PlayerSlug | null,
  playerMatches: Match[]
) {
  const currentTour = currentSlug ? players[currentSlug].tour : null;

  const opponentsFromMatches = playerMatches.flatMap((match) => [
    getPlayerSlugByName(match.player1),
    getPlayerSlugByName(match.player2),
  ]);

  const sameTourPriority = PRIORITY_PLAYERS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    (!currentTour || players[playerSlug].tour === currentTour)
  );

  const sameTourFallback = PLAYERS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    (!currentTour || players[playerSlug].tour === currentTour)
  );

  const otherPopularPlayers = PRIORITY_PLAYERS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    Boolean(currentTour && players[playerSlug].tour !== currentTour)
  );

  return uniquePlayerSlugs([
    ...opponentsFromMatches,
    ...sameTourPriority,
    ...sameTourFallback,
    ...otherPopularPlayers,
  ]).slice(0, 8);
}

function formatPlayerName(slug?: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug || "");
  return canonicalSlug ? players[canonicalSlug].name : playerNameFromSlug(slug || "");
}

function isIndexablePlayerSlug(slug: string) {
  return Boolean(getCanonicalPlayerSlug(slug));
}

function getPlayerDisplay(slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);
  const safeSlug = slugify(slug || "tennis-player") || "tennis-player";

  return {
    canonicalSlug,
    pageSlug: canonicalSlug || safeSlug,
    playerName: canonicalSlug ? players[canonicalSlug].name : playerNameFromSlug(safeSlug),
    isVerifiedPlayer: Boolean(canonicalSlug),
  };
}

function matchContainsPlayerText(match: Match, slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);

  if (canonicalSlug) {
    return matchContainsExactPlayer(match, canonicalSlug);
  }

  const target = normalizePlayerName(slug.replace(/-/g, " "));
  if (!target) return false;

  const fields = [match.player1, match.player2];

  return fields.some((value) => {
    const normalized = normalizePlayerName(value || "");
    return normalized === target || normalized.split(" ").includes(target);
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { playerName, pageSlug } = getPlayerDisplay(slug);
  const indexable = isIndexablePlayerSlug(slug);

  return {
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    title: buildPlayerSeoTitle(playerName),
    description: buildPlayerSeoDescription(playerName),
    alternates: {
      canonical: `https://watchtennistoday.com/player/${pageSlug}`,
    },
    openGraph: {
      title: buildPlayerSeoTitle(playerName),
      description: buildPlayerSeoDescription(playerName),
      url: `https://watchtennistoday.com/player/${pageSlug}`,
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: buildPlayerSeoTitle(playerName),
      description: buildPlayerSeoDescription(playerName),
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

  if (!response.ok) {
    console.error("/api/matches failed:", response.status);
    return [];
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();
    console.error("/api/matches returned non-JSON:", text.slice(0, 300));
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
  const { canonicalSlug, pageSlug, playerName, isVerifiedPlayer } = getPlayerDisplay(slug);

  const allMatches = await getMatches();



const playerMatches = allMatches
  .filter((match) => matchContainsPlayerText(match, pageSlug))
  .sort(sortMatchesByUserIntent);

  const relatedPlayers = getRelatedPlayers(canonicalSlug, playerMatches);
  const sameTourLabel = canonicalSlug ? players[canonicalSlug].tour : "tennis";
  const nextMatch = playerMatches[0];

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: playerName,
    url: `https://watchtennistoday.com/player/${pageSlug}`,
    sameAs: [],
    description: `${playerName} tennis match schedule, official viewing information and related player coverage on Watch Tennis Today.`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `When is ${playerName} playing next?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: nextMatch
            ? `${playerName}'s next listed match on this page is ${nextMatch.player1} vs ${nextMatch.player2} at ${nextMatch.tournament}. Start times can change during tournaments, so fans should confirm the official order of play before the match.`
            : `No upcoming match is currently listed for ${playerName}. Tennis schedules can change quickly because of draws, weather delays and withdrawals.`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I watch ${playerName} live?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Legal viewing options for ${playerName} depend on the tournament and your country. Use official broadcasters, licensed streaming platforms and country viewing guides before using any stream.`,
        },
      },
      {
        "@type": "Question",
        name: `Which players are similar to ${playerName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `This page links to related ${sameTourLabel} player schedules and popular tennis profiles so fans can continue browsing match pages without duplicate content.`,
        },
      },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
        <nav className="text-sm text-zinc-400 mb-6 flex flex-wrap gap-2">
  <Link href="/" className="hover:text-white">
    Home
  </Link>

  <span>/</span>

  <a
    href="/players"
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
        {playerName} Tennis Matches & TV Schedule
      </h1>

      {!isVerifiedPlayer ? (
  <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-sm leading-7 text-zinc-300">
    <p>
      This is a fallback tennis player schedule page created from a live-data slug.
      The player name has not been manually verified yet, so the page is kept out
      of search indexing while still giving crawlers and visitors a useful landing
      page instead of a 404.
    </p>
  </section>
) : null}

      <LocalPlayerFollowButton
        playerName={playerName}
        playerSlug={pageSlug}
      />

      {playerMatches.some(
  (match) => match.status === "LIVE"
) ? (
  <section className="mb-8 rounded-2xl border border-red-500 bg-red-500/10 p-6">
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <span className="bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full animate-pulse">
        🔴 LIVE NOW
      </span>

      <span className="text-red-300 font-bold">
        {playerName} is currently playing live
      </span>
    </div>

    <p className="text-zinc-300 mb-5 leading-8">
      Follow the live match, score updates, official viewing information and current
      tournament coverage for {playerName}.
    </p>

    <div className="flex flex-wrap gap-3">
      {playerMatches
        .filter((match) => match.status === "LIVE")
        .slice(0, 2)
        .map((match) => (
          <Link
            key={match.id}
            href={`/watch/${getMatchSlug(match)}`}
            className="rounded-2xl bg-red-500 px-5 py-3 font-black text-white hover:bg-red-400 transition-all"
          >
            Open Match Page →
          </Link>
        ))}
    </div>
  </section>
) : null}

      <section className="mb-10 rounded-xl border p-5">
        <h2 className="text-2xl font-semibold mb-3">
          {playerName} Next Match
        </h2>

        {playerMatches.length > 0 ? (
          <div className="space-y-3">
            {playerMatches.slice(0, 8).map((match) => (
            <div
  key={match.id}
  className="rounded-2xl border border-zinc-200 p-4"
>
  <div className="flex items-start justify-between gap-3 mb-3">
    <div>
      <p className="font-bold text-lg">
        {match.player1} vs {match.player2}
      </p>

      <a
        href={`/tournament/${slugify(match.tournament)}`}
        className="text-zinc-600 hover:text-green-500 transition-colors"
      >
        {match.tournament}
      </a>
    </div>

    <span className="text-xs font-bold text-zinc-500">
      {match.category}
    </span>
  </div>

  <div className="flex flex-wrap items-center gap-3 mb-4">
    {match.status === "LIVE" ? (
      <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
        LIVE NOW
      </span>
    ) : (
      <span className="bg-zinc-700 text-white text-xs font-bold px-3 py-1 rounded-full">
        {match.status}
      </span>
    )}

   <span className="text-sm text-zinc-600">
  {match.startTime
    ? new Date(match.startTime).toLocaleString()
    : "Time to be announced"}
</span>
  </div>

  <a
    href={`/watch/${getMatchSlug(match)}`}
    className="inline-flex items-center rounded-xl bg-black px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 transition-all"
  >
    Open Match →
  </a>
</div>
            ))}
          </div>
        ) : (
          <>
  <p className="text-zinc-600 leading-7">
    No upcoming matches are currently listed for {playerName}. Tennis schedules can
    change quickly because of tournament draws, weather delays, withdrawals and TV
    scheduling updates.
  </p>

  <p className="mt-3 text-zinc-600 leading-7">
    You can still explore live tennis schedules, tournament pages and official
    broadcaster information to check where future {playerName} matches may be
    available legally.
  </p>
</>
        )}
      </section>


      <RevenueConversionPanel context="player" playerName={playerName} />

      <section className="mb-10 rounded-2xl border border-zinc-200 p-6">
        <h2 className="mb-4 text-2xl font-semibold">High-interest matchups</h2>
        <p className="mb-5 text-sm leading-7 text-zinc-600">
          These head-to-head pages help fans compare popular matchups, find schedule
          context and continue to official viewing guides instead of leaving after one page.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["Alcaraz vs Sinner", "/vs/alcaraz-vs-sinner"],
            ["Djokovic vs Alcaraz", "/vs/djokovic-vs-alcaraz"],
            ["Sinner vs Djokovic", "/vs/sinner-vs-djokovic"],
            ["Swiatek vs Sabalenka", "/vs/swiatek-vs-sabalenka"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-2xl border border-zinc-200 p-4 font-bold hover:border-green-500 hover:bg-green-50"
            >
              {label} →
            </a>
          ))}
        </div>
      </section>

    <ContentQualityNotice pageType="player page" />

    <PlayerSubscribeBox
  playerName={playerName}
  playerSlug={pageSlug}
/>

      <section className="mb-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Keep watching
            </p>
            <h2 className="text-2xl font-semibold">
              Related tennis players
            </h2>
          </div>
          <a href="/players" className="text-sm font-bold text-green-600 hover:text-green-500">
            All players →
          </a>
        </div>

        <p className="mb-5 text-sm leading-7 text-zinc-600">
          Similar player pages help fans continue from one schedule page to another without adding duplicate content or interrupting the reading experience.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {relatedPlayers.map((playerSlug) => {
            const player = players[playerSlug];
            const isSameTour = canonicalSlug
              ? player.tour === players[canonicalSlug].tour
              : false;

            return (
              <a
                key={playerSlug}
                href={`/player/${playerSlug}`}
                className="rounded-2xl border border-zinc-200 p-4 transition hover:border-green-500 hover:bg-green-50"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-bold">{player.name}</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-600">
                    {player.tour}
                  </span>
                </div>
                <p className="text-sm leading-6 text-zinc-600">
                  {isSameTour ? "Same tour schedule and live match coverage" : "Popular player schedule and TV coverage"}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
        <h2 className="text-3xl font-black mb-5">
          📺 Where to Watch {playerName} Live
        </h2>

        <div className="space-y-5 text-zinc-300 leading-8">
          <p>
  Tennis fans can watch {playerName} live through official sports broadcasters,
  licensed streaming platforms and tournament TV partners, depending on country
  and tournament rights.
</p>

          <p>
            Coverage may include ATP Tour events, WTA tournaments, Grand Slams,
            Masters events and international competitions featuring {playerName}.
          </p>

          <p>
            Watch Tennis Today helps fans find match schedules, live tennis coverage,
            official viewing options and TV channels for upcoming {playerName} matches.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/watch"
            className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400 transition-all"
          >
            View Tennis Schedule
          </Link>

          <Link
            href="/live-tennis"
            className="rounded-2xl bg-zinc-800 px-5 py-3 font-black text-white hover:bg-zinc-700 transition-all"
          >
            Live Tennis Schedule
          </Link>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
  <h2 className="text-xl font-bold mb-3">
    Legal Tennis Viewing Information
  </h2>

  <p className="text-sm leading-7 text-zinc-700">
    Watch Tennis Today is an informational tennis guide. We do not stream matches,
    embed live video or bypass broadcaster restrictions. Our player pages are built
    to help fans compare legal viewing options, understand tournament coverage and
    find official match information.
  </p>
</section>

     <section className="mb-10 rounded-2xl border border-zinc-200 p-6 space-y-4 text-sm leading-7">
  <h2 className="text-2xl font-semibold">
    About {playerName} Matches and Coverage
  </h2>

  <p>
    This page is designed to help tennis fans follow {playerName} in a legal and
    practical way. Instead of hosting streams, Watch Tennis Today focuses on match
    schedules, tournament context, official broadcaster information and country-based
    viewing guidance.
  </p>

  <p>
    Tennis TV rights can change depending on the tournament, location and broadcast
    partner. For that reason, availability for {playerName} matches may differ between
    ATP, WTA, Grand Slam and other professional tennis events.
  </p>

  <p>
    When no upcoming match is listed, fans can still use this page to explore related
    tournament coverage, live tennis schedules and official viewing options for future
    {playerName} matches.
  </p>

  <p>
    Watch Tennis Today does not host live tennis streams and does not provide
    unauthorized access to copyrighted broadcasts. The goal of this page is to make it
    easier to find reliable tennis viewing information from legitimate sources.
  </p>
</section>
     
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
/>

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
/>

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
          item: "https://watchtennistoday.com/players",
        },

        {
          "@type": "ListItem",
          position: 3,
          name: playerName,
          item: `https://watchtennistoday.com/player/${pageSlug}`,
        },
      ],
    }),
  }}
/>
    </main>
  );
}