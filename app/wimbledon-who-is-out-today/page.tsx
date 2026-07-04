import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import JsonLd from "@/app/components/JsonLd";
import RelatedWimbledonGuides from "@/app/components/RelatedWimbledonGuides";
import {
  getServerMatchesWindow,
  type ServerMatch,
} from "@/app/lib/serverMatches";
import { safePlayerUrl } from "@/data/playerSlugs";
import { calculateMatchImportance } from "@/lib/matchImportance";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const pageUrl = "https://watchtennistoday.com/wimbledon-who-is-out-today";
const pageTitle = "Who Is Out of Wimbledon Today? | Completed Results";
const pageDescription =
  "See Wimbledon players who went out today from completed match data, with winners, scores, rounds and links back to Wimbledon schedule and results pages.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: "Watch Tennis Today",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
};

type Elimination = {
  id: string;
  loser: string;
  winner: string;
  match: ServerMatch;
  importance: number;
};

function normalizeText(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

function isWimbledonMatch(match: ServerMatch) {
  return normalizeText(match.tournament).includes("wimbledon");
}

function isFinished(match: ServerMatch) {
  const status = normalizeText(match.status).replace(/[\s_-]+/g, "");

  return (
    status.includes("finished") ||
    status.includes("completed") ||
    status.includes("retired") ||
    status.includes("walkover")
  );
}

function dateKey(value: Date, timeZone = "Europe/London") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function matchDateKey(match: ServerMatch) {
  if (!match.startTime) return null;

  const parsed = new Date(match.startTime);
  if (Number.isNaN(parsed.getTime())) return null;

  return dateKey(parsed);
}

function isTodayAtWimbledon(match: ServerMatch, now = new Date()) {
  return matchDateKey(match) === dateKey(now);
}

function winnerName(match: ServerMatch) {
  const winner = String(match.winner || "").trim();

  if (!winner) return null;
  if (normalizeText(winner) === normalizeText(match.player1)) return match.player1;
  if (normalizeText(winner) === normalizeText(match.player2)) return match.player2;

  return null;
}

function buildElimination(match: ServerMatch, now: Date): Elimination | null {
  const winner = winnerName(match);
  if (!winner) return null;

  const loser =
    normalizeText(winner) === normalizeText(match.player1)
      ? match.player2
      : match.player1;

  if (!loser || normalizeText(loser).includes("opponent to be confirmed")) {
    return null;
  }

  return {
    id: match.id,
    loser,
    winner,
    match,
    importance: calculateMatchImportance(match, { now }),
  };
}

function formatMatchTime(match: ServerMatch) {
  if (!match.startTime) return "Time not available";

  const parsed = new Date(match.startTime);
  if (Number.isNaN(parsed.getTime())) return "Time not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Europe/London",
    timeZoneName: "short",
  }).format(parsed);
}

function PlayerLink({ name }: { name: string }) {
  const href = safePlayerUrl(name);

  if (!href) return <span>{name}</span>;

  return (
    <Link href={href} className="font-black text-emerald-700 underline-offset-4 hover:underline">
      {name}
    </Link>
  );
}

function EliminationCard({ item }: { item: Elimination }) {
  const { match } = item;

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-[0.14em]">
        <span className="rounded-full bg-red-50 px-3 py-1 text-red-700">Out today</span>
        {match.category ? (
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-600">{match.category}</span>
        ) : null}
        {match.round ? (
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-zinc-600">{match.round}</span>
        ) : null}
      </div>

      <h2 className="text-2xl font-black leading-snug text-zinc-950">
        <PlayerLink name={item.loser} />
      </h2>
      <p className="mt-2 text-sm leading-6 text-zinc-700">
        Lost to <PlayerLink name={item.winner} /> at Wimbledon today.
      </p>

      <dl className="mt-4 grid gap-3 text-sm text-zinc-700 sm:grid-cols-2">
        {match.score ? (
          <div className="rounded-2xl bg-zinc-50 p-3">
            <dt className="font-black text-zinc-950">Score</dt>
            <dd className="mt-1">{match.score}</dd>
          </div>
        ) : null}
        <div className="rounded-2xl bg-zinc-50 p-3">
          <dt className="font-black text-zinc-950">Completed</dt>
          <dd className="mt-1">{formatMatchTime(match)}</dd>
        </div>
        {match.court ? (
          <div className="rounded-2xl bg-zinc-50 p-3">
            <dt className="font-black text-zinc-950">Court</dt>
            <dd className="mt-1">{match.court}</dd>
          </div>
        ) : null}
        <div className="rounded-2xl bg-zinc-50 p-3">
          <dt className="font-black text-zinc-950">Match priority</dt>
          <dd className="mt-1">{item.importance}/5</dd>
        </div>
      </dl>
    </article>
  );
}

function EmptyState() {
  return (
    <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
      <h2 className="text-2xl font-black text-zinc-950">
        No confirmed Wimbledon exits in today&apos;s feed yet
      </h2>
      <p className="mt-3 max-w-3xl leading-7 text-zinc-700">
        This page only lists players after the match feed shows a completed
        Wimbledon result and identifies the winner. It does not guess from the
        draw or publish placeholder eliminations.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/wimbledon-results" className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-black text-white hover:bg-emerald-800">
          Wimbledon results
        </Link>
        <Link href="/wimbledon-order-of-play" className="rounded-full border border-emerald-700 px-5 py-3 text-sm font-black text-emerald-800 hover:bg-white">
          Order of play
        </Link>
      </div>
    </section>
  );
}

export default async function WimbledonWhoIsOutTodayPage() {
  const now = new Date();
  const matches = await getServerMatchesWindow({
    includeFinished: true,
    daysBack: 1,
    daysForward: 1,
    revalidateSeconds: 60,
    timeoutMs: 15000,
  });

  const eliminations = matches
    .filter((match) => isWimbledonMatch(match) && isFinished(match) && isTodayAtWimbledon(match, now))
    .map((match) => buildElimination(match, now))
    .filter((item): item is Elimination => Boolean(item))
    .sort((left, right) => {
      if (left.importance !== right.importance) return right.importance - left.importance;

      const leftTime = left.match.startTime ? new Date(left.match.startTime).getTime() : 0;
      const rightTime = right.match.startTime ? new Date(right.match.startTime).getTime() : 0;

      return rightTime - leftTime;
    });

  const updatedAt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Europe/London",
    timeZoneName: "short",
  }).format(now);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
    dateModified: now.toISOString(),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-zinc-900">
      <nav className="mb-6 flex flex-wrap gap-2 text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <Link href="/grand-slams" className="hover:text-emerald-700">Grand Slams</Link>
        <span>/</span>
        <Link href="/wimbledon" className="hover:text-emerald-700">Wimbledon</Link>
        <span>/</span>
        <span>Who is out today</span>
      </nav>

      <section className="rounded-3xl bg-zinc-950 p-6 text-white md:p-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
          Wimbledon results tracker
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black md:text-5xl">
          Who Is Out of Wimbledon Today?
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">
          A live-results page for confirmed Wimbledon exits from today&apos;s
          completed match feed. Last checked: {updatedAt}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/wimbledon-results" className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black hover:bg-emerald-300">
            Results
          </Link>
          <Link href="/wimbledon-live" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">
            Live hub
          </Link>
          <Link href="/wimbledon-draw" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">
            Draw guide
          </Link>
        </div>
      </section>

      <section className="mt-8">
        {eliminations.length > 0 ? (
          <>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-3xl font-black text-zinc-950">Confirmed exits today</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-700">
                  Sorted by match importance first, then most recent completed
                  matches. Only completed Wimbledon matches with a known winner
                  are included.
                </p>
              </div>
              <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-black text-zinc-700">
                {eliminations.length} players
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {eliminations.map((item) => (
                <EliminationCard key={item.id} item={item} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </section>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-zinc-950">How this page decides who is out</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-700">
          The page checks today&apos;s Wimbledon results in the match feed,
          requires a finished or retired status, and only lists an exit when the
          feed identifies the winner. If a match is still live, suspended,
          scheduled or missing winner data, it stays off this list.
        </p>
      </section>

      <div className="mt-8">
        <RelatedWimbledonGuides currentPath="/wimbledon-who-is-out-today" />
      </div>

      <JsonLd data={webPageSchema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Grand Slams", url: "https://watchtennistoday.com/grand-slams" },
          { name: "Wimbledon", url: "https://watchtennistoday.com/wimbledon" },
          { name: "Who Is Out of Wimbledon Today", url: pageUrl },
        ]}
      />
    </main>
  );
}
