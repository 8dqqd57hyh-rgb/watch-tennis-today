import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRivalry, rivalries } from "@/data/rivalries";
import { safePlayerUrl } from "@/data/playerSlugs";
import MatchEdgePredictor from "@/app/components/MatchEdgePredictor";
import PathToTitle from "@/app/components/PathToTitle";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
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
  round?: string;
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
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
}

function matchContainsPlayer(match: Match, playerName: string) {
  const lastName = playerName.toLowerCase().split(" ").pop() || playerName;
  const text = `${match.player1} ${match.player2}`.toLowerCase();

  return text.includes(lastName);
}

function isLive(match: Match) {
  return match.status.toUpperCase() === "LIVE";
}

function isUpcoming(match: Match) {
  const status = match.status.toUpperCase();
  return status === "UPCOMING" || status === "SCHEDULED" || status === "NOT_STARTED";
}

function statusRank(match: Match) {
  if (isLive(match)) return 0;
  if (isUpcoming(match)) return 1;
  return 2;
}

function formatDateTime(value?: string | null) {
  if (!value) return "Time to be confirmed";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rivalry = getRivalry(slug);

  if (!rivalry) {
    return {
      title: "Tennis Rivalry Not Found | Watch Tennis Today",
    };
  }

  return {
    title: `${rivalry.title} H2H, Live Stream & TV Schedule | Watch Tennis Today`,
    description: rivalry.description,
    alternates: {
      canonical: `https://watchtennistoday.com/rivalries/${rivalry.slug}`,
    },
    openGraph: {
      title: `${rivalry.title} rivalry guide`,
      description: rivalry.description,
      url: `https://watchtennistoday.com/rivalries/${rivalry.slug}`,
      siteName: "Watch Tennis Today",
      type: "website",
    },
  };
}

export default async function RivalryPage({ params }: Props) {
  const { slug } = await params;
  const rivalry = getRivalry(slug);

  if (!rivalry) notFound();

  const matches = await getMatches();
  const directMatches = matches
    .filter(
      (match) =>
        matchContainsPlayer(match, rivalry.playerA) &&
        matchContainsPlayer(match, rivalry.playerB)
    )
    .sort((a, b) => statusRank(a) - statusRank(b));

  const mainMatch = directMatches[0];

  const relatedMatches = matches
    .filter((match) => !mainMatch || match.id !== mainMatch.id)
    .filter(
      (match) =>
        matchContainsPlayer(match, rivalry.playerA) ||
        matchContainsPlayer(match, rivalry.playerB)
    )
    .sort((a, b) => statusRank(a) - statusRank(b))
    .slice(0, 6);

  const relatedRivalries = rivalry.related
    .map(getRivalry)
    .filter(Boolean);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where can I watch ${rivalry.title} live?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Watch Tennis Today does not stream matches directly. Use the match page, official broadcaster links and local TV schedule information to find legal viewing options in your country.",
        },
      },
      {
        "@type": "Question",
        name: `Is ${rivalry.title} playing today?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The page checks today's match feed and highlights a live or upcoming match when the matchup is listed.",
        },
      },
      {
        "@type": "Question",
        name: `Why is ${rivalry.title} a big rivalry?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: rivalry.angle,
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-6xl">
        <Link href="/rivalries" className="text-zinc-400 hover:text-white">
          ← Back to rivalries
        </Link>

        <section className="mt-8 mb-8 rounded-3xl border border-orange-500/40 bg-zinc-950 p-6 md:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-orange-400">
            Rivalry guide
          </p>
          <h1 className="mb-5 text-4xl font-black md:text-6xl">
            {rivalry.title}: H2H, live stream and TV schedule
          </h1>
          <p className="max-w-4xl text-lg leading-8 text-zinc-300">
            {rivalry.description}
          </p>
        </section>

        {mainMatch ? (
          <section className="mb-8 rounded-3xl border border-red-500/50 bg-zinc-900 p-6">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-4 py-2 text-sm font-black ${
                  isLive(mainMatch)
                    ? "bg-red-500 text-white"
                    : "bg-orange-500 text-black"
                }`}
              >
                {mainMatch.status}
              </span>
              <span className="text-zinc-400">{mainMatch.tournament}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">{mainMatch.round || mainMatch.category}</span>
            </div>

            <h2 className="mb-5 text-3xl font-black md:text-4xl">
              {mainMatch.player1} vs {mainMatch.player2}
            </h2>

            <MatchEdgePredictor match={mainMatch} matches={matches} />
            <PathToTitle match={mainMatch} matches={matches} />

            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="mb-1 text-sm text-zinc-500">Start time</p>
                <p className="font-black">{formatDateTime(mainMatch.startTime)}</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="mb-1 text-sm text-zinc-500">Score</p>
                <p className="font-black">{mainMatch.score || "Not started"}</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="mb-1 text-sm text-zinc-500">Category</p>
                <p className="font-black">{mainMatch.category}</p>
              </div>
            </div>

            <Link
              href={`/watch/${getMatchSlug(mainMatch)}`}
              className="mt-6 inline-flex rounded-2xl bg-orange-500 px-6 py-4 font-black text-black hover:bg-orange-400"
            >
              Open match page →
            </Link>
          </section>
        ) : (
          <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-3 text-3xl font-black">No direct match listed right now</h2>
            <p className="leading-7 text-zinc-400">
              We could not find a live or upcoming {rivalry.title} match in the
              current feed. Use the player links below to track both players and
              check back when the next tournament schedule updates.
            </p>
          </section>
        )}

        <section className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:col-span-2">
            <h2 className="mb-4 text-3xl font-black">Why this matchup matters</h2>
            <p className="mb-5 leading-8 text-zinc-300">{rivalry.angle}</p>
            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
                Surface note
              </p>
              <p className="leading-7 text-zinc-300">{rivalry.surfaceNote}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-500/30 bg-orange-950/20 p-6">
            <h2 className="mb-4 text-2xl font-black">Watch intent</h2>
            <p className="leading-7 text-zinc-300">{rivalry.watchIntent}</p>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-3xl font-black">Key storylines</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {rivalry.storylines.map((storyline) => (
              <div key={storyline} className="rounded-2xl border border-zinc-800 bg-black p-5">
                <p className="leading-7 text-zinc-300">{storyline}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-3xl font-black">Player pages</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[rivalry.playerA, rivalry.playerB].map((player) => (
              <Link
                key={player}
                href={safePlayerUrl(player) || "/players"}
                className="rounded-2xl border border-zinc-800 bg-black p-5 transition hover:border-orange-500"
              >
                <h3 className="mb-2 text-2xl font-black">{player}</h3>
                <p className="text-zinc-400">Live matches, schedule, player hub and streaming information.</p>
              </Link>
            ))}
          </div>
        </section>

        {relatedMatches.length > 0 ? (
          <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-5 text-3xl font-black">More matches involving these players</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedMatches.map((match) => (
                <Link
                  key={match.id}
                  href={`/watch/${getMatchSlug(match)}`}
                  className="rounded-2xl border border-zinc-800 bg-black p-5 transition hover:border-orange-500"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-zinc-400">{match.tournament}</span>
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-black">
                      {match.status}
                    </span>
                  </div>
                  <h3 className="mb-2 text-2xl font-black">
                    {match.player1} vs {match.player2}
                  </h3>
                  <p className="text-zinc-500">{formatDateTime(match.startTime)}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-3xl font-black">Related rivalries</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {relatedRivalries.map((item) =>
              item ? (
                <Link
                  key={item.slug}
                  href={`/rivalries/${item.slug}`}
                  className="rounded-2xl border border-zinc-800 bg-black p-5 transition hover:border-orange-500"
                >
                  <h3 className="mb-2 text-xl font-black">{item.title}</h3>
                  <p className="text-sm leading-6 text-zinc-400">{item.angle}</p>
                </Link>
              ) : null
            )}
          </div>
        </section>

        <RevenueConversionPanel
          context="matchup"
          playerName={rivalry.playerA}
          opponentName={rivalry.playerB}
        />
        <StreamingLinksGrid />
        <RelatedMoneyLinks />
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return rivalries.map((rivalry) => ({ slug: rivalry.slug }));
}
