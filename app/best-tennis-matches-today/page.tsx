import type { Metadata } from "next";
import Link from "next/link";
import BestMatchesTodayEngine from "@/app/components/BestMatchesTodayEngine";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";
import { getServerMatchesWindow } from "@/app/lib/serverMatches";
import { hasReliableMatchScore } from "@/app/lib/matchLifecycle";
import { safePlayerUrl } from "@/data/playerSlugs";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Best Tennis Matches Today | Live ATP, WTA & Grand Slam Picks",
  description:
    "See the best tennis matches to watch today, including live ATP, WTA and Grand Slam matches, star players, H2H pages and legal streaming guides.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://watchtennistoday.com/best-tennis-matches-today",
  },
};

type WatchProvider = {
  name: string;
  url: string;
  accessType?: string;
  verificationStatus?: string;
  note?: string;
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
  watchProviders?: WatchProvider[];
  round?: string;
};

const MATCH_DAY_TIME_ZONE = "Europe/Warsaw";
const MATCH_SECTION_DISPLAY_LIMIT = 24;
const RANKED_MATCH_DISPLAY_LIMIT = 36;

async function getMatches(): Promise<Match[]> {
  return (await getServerMatchesWindow({
    revalidateSeconds: 60,
    includeFinished: true,
    daysBack: 0,
    daysForward: 1,
    timeoutMs: 5000,
  })) as Match[];
}

function normalizeStatus(status?: string | null) {
  return String(status || "").trim().toUpperCase();
}

function isLiveStatus(status?: string | null) {
  return normalizeStatus(status) === "LIVE";
}

function isFinishedStatus(status?: string | null) {
  return ["FINISHED", "COMPLETED", "RETIRED", "WALKOVER", "ENDED", "FT"].includes(normalizeStatus(status));
}

function isScheduledStatus(status?: string | null) {
  const normalized = normalizeStatus(status);

  return (
    ["UPCOMING", "SCHEDULED", "NOTSTARTED", "NOT_STARTED", "NOT STARTED"].includes(normalized) ||
    (!isLiveStatus(status) && !isFinishedStatus(status))
  );
}

function isCurrentCandidate(match: Match) {
  const status = String(match.status || "").toUpperCase();

  return Boolean(
    match.player1 &&
      match.player2 &&
      match.tournament &&
      status !== "FINISHED" &&
      status !== "CANCELLED" &&
      status !== "CANCELED"
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchSlug(match: Match) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = String(match.id).split(":").pop();

  return `${readablePart}-${numericId}`;
}

function localDateKey(value: string | Date | null | undefined) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MATCH_DAY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function isTodayMatch(match: Match) {
  if (isLiveStatus(match.status) && !match.startTime) return true;

  const matchDate = localDateKey(match.startTime);
  const today = localDateKey(new Date());

  return Boolean(matchDate && today && matchDate === today);
}

function formatMatchTime(value?: string | null) {
  if (!value) return "Time TBC";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time TBC";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: MATCH_DAY_TIME_ZONE,
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function getTodayMatchCounts(matches: Match[]) {
  return {
    live: matches.filter((match) => isLiveStatus(match.status)).length,
    scheduled: matches.filter((match) => isScheduledStatus(match.status)).length,
    finished: matches.filter((match) => isFinishedStatus(match.status)).length,
    total: matches.length,
  };
}

function PlayerName({ name }: { name: string }) {
  const href = safePlayerUrl(name);

  if (!href) return <>{name}</>;

  return (
    <Link href={href} className="hover:text-green-400" data-testid="player-link">
      {name}
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const className = isLiveStatus(status)
    ? "bg-red-500 text-white"
    : isFinishedStatus(status)
      ? "bg-zinc-700 text-zinc-200"
      : "bg-green-400 text-black";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${className}`}>
      {isLiveStatus(status) ? "Live" : isFinishedStatus(status) ? "Finished" : "Scheduled"}
    </span>
  );
}

function TodayMatchCard({ match }: { match: Match }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-black p-4 transition hover:border-green-400" data-testid="match-card">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <StatusBadge status={match.status} />
        <span className="text-xs font-bold text-zinc-500">{match.category || "Tennis"}</span>
      </div>

      <h3 className="text-xl font-black leading-tight text-white">
        <PlayerName name={match.player1} />
        <span className="block text-zinc-500">vs</span>
        <PlayerName name={match.player2} />
      </h3>

      <div className="mt-4 grid gap-2 text-sm text-zinc-400">
        <Link href={`/tournament/${slugify(match.tournament)}`} className="font-bold text-zinc-300 hover:text-green-400">
          {match.tournament}
        </Link>
        <span>{match.round || match.status || "Round TBC"}</span>
        <span>{formatMatchTime(match.startTime)}</span>
      </div>

      {hasReliableMatchScore(match.score) ? (
        <p className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-black text-white">
          Score: {match.score}
        </p>
      ) : null}

      <Link
        href={`/watch/${matchSlug(match)}`}
        className="mt-4 inline-flex rounded-xl bg-green-500 px-4 py-2 text-sm font-black text-black hover:bg-green-400"
        data-testid="guide-streaming-link"
      >
        Match hub
      </Link>
    </article>
  );
}

function TodayMatchSection({
  title,
  description,
  matches,
}: {
  title: string;
  description: string;
  matches: Match[];
}) {
  return (
    <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-white">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">{description}</p>
        </div>
        <span className="rounded-full border border-zinc-700 bg-black px-4 py-2 text-sm font-black text-zinc-200">
          {matches.length}
        </span>
      </div>

      {matches.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {matches.map((match) => (
            <TodayMatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-black p-5 text-sm leading-6 text-zinc-400" data-testid="empty-state">
          No matches in this group right now.
        </div>
      )}
    </section>
  );
}

function TodayMatchesBoard({ matches }: { matches: Match[] }) {
  const todayMatches = matches
    .filter((match) => match.player1 && match.player2 && match.tournament)
    .filter(isTodayMatch);
  const liveMatches = todayMatches.filter((match) => isLiveStatus(match.status));
  const scheduledMatches = todayMatches.filter((match) => isScheduledStatus(match.status));
  const finishedMatches = todayMatches.filter((match) => isFinishedStatus(match.status));
  const displayedLiveMatches = liveMatches.slice(0, MATCH_SECTION_DISPLAY_LIMIT);
  const displayedScheduledMatches = scheduledMatches.slice(0, MATCH_SECTION_DISPLAY_LIMIT);
  const displayedFinishedMatches = finishedMatches.slice(0, MATCH_SECTION_DISPLAY_LIMIT);
  const counts = getTodayMatchCounts(todayMatches);

  return (
    <section className="mb-10">
      <div className="mb-6 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-5 md:p-7">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-green-400">
            Today&apos;s match center
          </p>
          <h2 className="text-3xl font-black leading-tight text-white md:text-5xl">
            All tennis matches today
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
            Live, scheduled and finished matches for today. This list uses the match feed directly and avoids fake picks when data is missing.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              <p className="text-xs font-black uppercase text-zinc-500">Total</p>
              <p className="mt-1 text-3xl font-black text-white">{counts.total}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              <p className="text-xs font-black uppercase text-zinc-500">Live</p>
              <p className="mt-1 text-3xl font-black text-white">{counts.live}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              <p className="text-xs font-black uppercase text-zinc-500">Scheduled</p>
              <p className="mt-1 text-3xl font-black text-white">{counts.scheduled}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black p-4">
              <p className="text-xs font-black uppercase text-zinc-500">Finished</p>
              <p className="mt-1 text-3xl font-black text-white">{counts.finished}</p>
            </div>
          </div>

          {!todayMatches.length ? (
            <p className="mt-4 rounded-2xl border border-yellow-500/25 bg-yellow-500/10 p-4 text-sm leading-6 text-yellow-100" data-testid="empty-state">
              No matches are available from the feed for today yet. That usually means the external tennis feed is delayed, between sessions, or has not published the current order of play.
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6">
        <TodayMatchSection
          title="Live matches"
          description="Matches currently marked live in the feed. Scores are shown only when the feed provides a reliable score."
          matches={displayedLiveMatches}
        />
        <TodayMatchSection
          title="Scheduled matches"
          description="Matches still to come today. Start times can move when earlier matches run long or courts change."
          matches={displayedScheduledMatches}
        />
        <TodayMatchSection
          title="Finished matches"
          description="Completed matches from today, useful for results, replays and catching up on tournament context."
          matches={displayedFinishedMatches}
        />
      </div>
    </section>
  );
}

export default async function BestTennisMatchesTodayPage() {
  const matches = await getMatches();
  const todayMatches = matches.filter(isTodayMatch);
  const rankedTodayMatches = todayMatches
    .slice(0, RANKED_MATCH_DISPLAY_LIMIT)
    .map((match) => ({
      ...match,
      startTime: match.startTime || undefined,
    }));
  const hasCurrentCandidates = todayMatches.some(isCurrentCandidate);

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm font-bold text-zinc-400 hover:text-white">
          ← Back to home
        </Link>

        <section className="my-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-green-400">
            Daily tennis discovery
          </p>
          <h1 className="mb-5 text-4xl font-black leading-tight md:text-6xl">
            Best Tennis Matches Today
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            A practical match-day hub for live tennis, today&apos;s schedule, order of play, player pages and safe legal viewing routes. If the ranked feed is empty, this page still points you to the useful places to check first.
          </p>
        </section>

        <TodayMatchesBoard matches={matches} />

        {hasCurrentCandidates ? (
          <BestMatchesTodayEngine matches={rankedTodayMatches} />
        ) : null}

        <RevenueConversionPanel context="homepage" />

        <StreamingLinksGrid />

        <section className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-3xl font-black">How we rank today’s matches</h2>
          <div className="space-y-4 leading-8 text-zinc-300">
            <p>
              The page prioritizes matches that are live, involve highly followed ATP or WTA players,
              belong to Grand Slam tournaments, or are scheduled for important rounds such as finals
              and semifinals.
            </p>
            <p>
              Watch Tennis Today does not stream matches. The goal is to help fans discover which match
              to follow first and then check official broadcasters, tournament pages or legal streaming services.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
