import Link from "next/link";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { safePlayerUrl } from "@/data/playerSlugs";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import MatchEdgePredictor from "@/app/components/MatchEdgePredictor";
import PathToTitle from "@/app/components/PathToTitle";
import { getRivalry, getRivalryForMatch } from "@/data/rivalries";
import { getServerMatches } from "@/app/lib/serverMatches";

export const revalidate = 60;

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

function formatNameFromSlug(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseVsSlug(slug: string) {
  const parts = slug.split("-vs-");

  if (parts.length !== 2) {
    return null;
  }

  return {
    playerA: formatNameFromSlug(parts[0]),
    playerB: formatNameFromSlug(parts[1]),
  };
}

function getKnownRivalrySlug(slug: string) {
  const direct = getRivalry(slug);
  if (direct) return direct.slug;

  const parsed = parseVsSlug(slug);
  if (!parsed) return null;

  return getRivalryForMatch(parsed.playerA, parsed.playerB)?.slug ?? null;
}

function matchContainsPlayer(match: Match, playerName: string) {
  const lastName = playerName.toLowerCase().split(" ").pop() || playerName;

  const text = `${match.player1} ${match.player2}`.toLowerCase();

  return text.includes(lastName);
}

function isLive(match: Match) {
  return match.status.toUpperCase() === "LIVE";
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
  const knownRivalrySlug = getKnownRivalrySlug(slug);

  if (knownRivalrySlug) {
    const rivalry = getRivalry(knownRivalrySlug);

    return {
      title: `${rivalry?.title ?? "Tennis Rivalry"} moved | Watch Tennis Today`,
      robots: { index: false, follow: true },
      alternates: {
        canonical: `https://watchtennistoday.com/rivalries/${knownRivalrySlug}`,
      },
    };
  }

  const parsed = parseVsSlug(slug);

  if (!parsed) {
    return {
      title: "Tennis Match Not Found | Watch Tennis Today",
      robots: { index: false, follow: true },
    };
  }

  const title = `${parsed.playerA} vs ${parsed.playerB}`;

  return {
    title: `${title} Live Stream & TV Schedule | Watch Tennis Today`,
    description: `Watch ${title} live today. Find tennis live streams, TV schedule, match time, score updates and official broadcaster information.`,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `https://watchtennistoday.com/rivalries`,
    },
  };
}

export default async function VsPage({ params }: Props) {
  const { slug } = await params;
  const knownRivalrySlug = getKnownRivalrySlug(slug);

  if (knownRivalrySlug) {
    redirect(`/rivalries/${knownRivalrySlug}`);
  }

  const parsed = parseVsSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { playerA, playerB } = parsed;

  const matches = await getServerMatches(60);

  const directMatches = matches
    .filter(
      (match) =>
        matchContainsPlayer(match, playerA) &&
        matchContainsPlayer(match, playerB)
    )
    .sort((a, b) => {
      if (isLive(a) && !isLive(b)) return -1;
      if (!isLive(a) && isLive(b)) return 1;
      return 0;
    });

  const mainMatch = directMatches[0];

  const relatedMatches = matches
    .filter(
      (match) =>
        !mainMatch || match.id !== mainMatch.id
    )
    .filter(
      (match) =>
        matchContainsPlayer(match, playerA) ||
        matchContainsPlayer(match, playerB)
    )
    .slice(0, 6);

  const title = `${playerA} vs ${playerB}`;

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-5xl font-black mt-8 mb-6">
          🎾 {title} Live Stream & TV Schedule
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
          Follow {title} live today with match time, tournament details, score
          updates, official broadcasters and tennis streaming information.
        </p>

        {mainMatch ? (
          <section className="bg-zinc-900 border border-red-500 rounded-3xl p-6 mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span
                className={`text-sm font-black px-4 py-2 rounded-full ${
                  isLive(mainMatch)
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-green-500 text-black"
                }`}
              >
                {mainMatch.status}
              </span>

              <span className="text-zinc-400">
                {mainMatch.category}
              </span>

              <span className="text-zinc-500">•</span>

              <span className="text-zinc-400">
                {mainMatch.tournament}
              </span>
            </div>

            <h2 className="text-4xl font-black mb-5">
              {mainMatch.player1}
              <br />
              vs
              <br />
              {mainMatch.player2}
            </h2>

            <MatchEdgePredictor match={mainMatch} matches={matches} />

            <PathToTitle match={mainMatch} matches={matches} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div>
                <p className="text-zinc-500 text-sm mb-1">Tournament</p>
                <p className="font-black">{mainMatch.tournament}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm mb-1">Score</p>
                <p className="font-black">{mainMatch.score || "-"}</p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm mb-1">Start Time</p>
                <p className="font-black">
                  {formatDateTime(mainMatch.startTime)}
                </p>
              </div>
            </div>

            <Link
              href={`/watch/${getMatchSlug(mainMatch)}`}
              className="inline-block bg-green-500 text-black px-6 py-4 rounded-2xl font-black hover:bg-green-400 transition-all"
            >
              Open Match Page →
            </Link>
          </section>
        ) : (
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
            <h2 className="text-3xl font-black mb-4">
              No live match found right now
            </h2>

            <p className="text-zinc-400 leading-8">
              No active or upcoming match found for {title} right now. Check
              back later for updated tennis schedule and streaming information.
            </p>
          </section>
        )}

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-5">
            Player Pages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={safePlayerUrl(playerA) || "/players"}
              className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 transition-all"
            >
              <h3 className="text-2xl font-black mb-2">{playerA}</h3>
              <p className="text-zinc-400">
                Live matches, schedule and streaming information.
              </p>
            </Link>

            <Link
              href={safePlayerUrl(playerB) || "/players"}
              className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 transition-all"
            >
              <h3 className="text-2xl font-black mb-2">{playerB}</h3>
              <p className="text-zinc-400">
                Live matches, schedule and streaming information.
              </p>
            </Link>
          </div>
        </section>

    

        {relatedMatches.length > 0 ? (
          <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
            <h2 className="text-3xl font-black mb-5">
              More matches with {playerA} or {playerB}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedMatches.map((match) => (
                <Link
                  key={match.id}
                  href={`/watch/${getMatchSlug(match)}`}
                  className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 transition-all"
                >
                  <div className="flex justify-between gap-3 mb-3">
                    <span className="text-zinc-400">
                      {match.category}
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
                    {match.tournament}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <RevenueConversionPanel
          context="matchup"
          playerName={playerA}
          opponentName={playerB}
        />

        <StreamingLinksGrid />

        <RelatedMoneyLinks />

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-5">FAQ</h2>

          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Where can I watch {title} live?
              </h3>

              <p className="text-zinc-400">
                You can check official broadcasters, tournament partners and
                legal streaming services depending on your country.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">
                What time does {title} start?
              </h3>

              <p className="text-zinc-400">
                Match time depends on tournament scheduling and may change
                during the day.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">
                Does Watch Tennis Today stream matches?
              </h3>

              <p className="text-zinc-400">
                No. Watch Tennis Today does not host or stream tennis matches.
                The site helps fans find schedules and official viewing options.
              </p>
            </div>

            <div>
  <h3 className="text-xl font-bold mb-2">
    Can I watch {title} live online?
  </h3>

  <p className="text-zinc-400">
    Yes, if the match is covered by an official broadcaster or legal streaming
    service in your country. Availability depends on tournament rights and your
    location.
  </p>
</div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
  {
    "@type": "Question",
    name: `Where can I watch ${title} live?`,
    acceptedAnswer: {
      "@type": "Answer",
      text:
        "You can check official broadcasters, tournament partners and legal streaming services depending on your country.",
    },
  },
  {
    "@type": "Question",
    name: `What time does ${title} start?`,
    acceptedAnswer: {
      "@type": "Answer",
      text:
        "Match time depends on tournament scheduling and may change during the day.",
    },
  },
  {
    "@type": "Question",
    name: `Can I watch ${title} live online?`,
    acceptedAnswer: {
      "@type": "Answer",
      text:
        "Yes, if the match is covered by an official broadcaster or legal streaming service in your country. Availability depends on tournament rights and your location.",
    },
  },
  {
    "@type": "Question",
    name: "Does Watch Tennis Today stream matches?",
    acceptedAnswer: {
      "@type": "Answer",
      text:
        "No. Watch Tennis Today does not host or stream tennis matches. The site helps fans find schedules and official viewing options.",
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