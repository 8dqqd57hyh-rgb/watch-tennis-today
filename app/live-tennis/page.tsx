import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import { getServerMatches } from "@/app/lib/serverMatches";
import Link from "next/link";

export const revalidate = 60;

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

async function getMatches(): Promise<Match[]> {
  return (await getServerMatches(60)) as Match[];
}

function matchSlug(match: Match) {
  const readablePart = `${match.player1}-vs-${match.player2}`
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const numericId = String(match.id).split(":").pop();

  return `${readablePart}-${numericId}`;
}

export const metadata = {
  title:
    "Tennis Match Schedule Today | Watch Tennis Today",

  description:
    "Follow ATP, WTA, Challenger and ITF tennis schedules, live scores, tournament coverage and official viewing information.",
};

export default async function LiveTennisPage() {
  const matches = await getMatches();

  function isLiveStatus(status: string) {
  const normalizedStatus = status.toLowerCase().trim();

  return [
    "live",
    "in progress",
    "1st set",
    "2nd set",
    "3rd set",
    "4th set",
    "5th set",
    "set 1",
    "set 2",
    "set 3",
    "set 4",
    "set 5",
    "after delay",
    "suspended",
    "interrupted",
  ].some((liveStatus) => normalizedStatus.includes(liveStatus));
}

const liveMatches = matches.filter((match) =>
  isLiveStatus(match.status)
);
const fallbackMatches = matches
  .filter((match) => match.status !== "FINISHED" && match.status !== "CANCELLED")
  .slice(0, 12);

const matchesToShow =
  liveMatches.length > 0 ? liveMatches : fallbackMatches;

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="text-zinc-400 hover:text-white"
        >
          ← Back
        </Link>

        <h1 className="text-5xl font-black mt-8 mb-4">
          🔴 Tennis Match Schedule
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Follow ATP, WTA, Challenger and ITF tennis schedules, live scores,
          tournament coverage and official viewing information.
        </p>
<p className="text-zinc-400 mt-4 max-w-3xl">
  Watch Tennis Today does not host, embed or restream tennis broadcasts.
  We provide tennis schedules, match information and links to official
  broadcaster resources only.
</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {matchesToShow.map((match) => (
            <div
              key={match.id}
              className="bg-zinc-900 border border-red-500 rounded-3xl p-6"
            >
              <div className="flex justify-between mb-4">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-black">
                  LIVE
                </span>

                <span className="text-zinc-400">
                  {match.category}
                </span>
              </div>

              <h2 className="text-3xl font-black mb-4">
                {match.player1}
                <br />
                vs
                <br />
                {match.player2}
              </h2>

              <p className="text-zinc-400 mb-3">
                {match.tournament}
              </p>

              <p className="text-xl font-bold mb-6">
                {match.score}
              </p>

              <a
                href={`/watch/${matchSlug(
                  match
                )}`}
                className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
              >
                View Match Info
              </a>
            </div>
          ))}
        </div>

        <VpnPromo />

        <RelatedMoneyLinks />
      </div>
    </main>
  );
}
