import type { Metadata } from "next";
import { headers } from "next/headers";
import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import { players } from "@/data/players";
import { matchContainsExactPlayer } from "@/data/playerSlugs";
import PlayerSubscribeBox from "@/app/components/PlayerSubscribeBox";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";

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
  if (!slug) return "Tennis Player";

  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
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
    title: `${playerName} Matches Today & TV Schedule | Watch Tennis Today`,
   description: `Follow ${playerName} matches today with live tennis schedules, official broadcaster information, tournament coverage and TV viewing details.`,
    openGraph: {
      title: `${playerName} Matches Today & TV Schedule`,
      description: `Follow ${playerName} matches, tournament coverage and official tennis viewing information.`,
      url: `https://watchtennistoday.com/player/${slug}`,
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${playerName} Matches Today & TV Schedule`,
      description: `Follow ${playerName} matches, tournament coverage and official tennis viewing information.`,
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

  const playerName = formatPlayerName(slug);

  const allMatches = await getMatches();



const playerMatches = allMatches.filter((match) =>
  matchContainsExactPlayer(match, slug)
);

  const relatedPlayers = PLAYERS
    .filter((playerSlug) => playerSlug !== slug)
    .slice(0, 6);

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
        {playerName} Tennis Matches & TV Schedule
      </h1>

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
          <a
            key={match.id}
            href={`/watch/${getMatchSlug(match)}`}
            className="rounded-2xl bg-red-500 px-5 py-3 font-black text-white hover:bg-red-400 transition-all"
          >
            Open Match Page →
          </a>
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
            {playerMatches.map((match) => (
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

    <ContentQualityNotice pageType="player page" />

    <PlayerSubscribeBox
  playerName={playerName}
  playerSlug={slug}
/>

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
                {name} match schedule
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
          <a
            href="/watch"
            className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400 transition-all"
          >
            View Tennis Schedule
          </a>

          <a
            href="/live-tennis"
            className="rounded-2xl bg-zinc-800 px-5 py-3 font-black text-white hover:bg-zinc-700 transition-all"
          >
            Live Tennis Schedule
          </a>
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