"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchClientMatches } from "@/app/lib/clientMatchFetch";
import TennisTimeZonePlanner from "@/app/components/TennisTimeZonePlanner";
import SpoilerFreeScoreToggle, {
  SpoilerSafeScore,
  useSpoilerFreeScores,
} from "@/app/components/SpoilerFreeScoreToggle";
import { safePlayerUrl } from "@/data/playerSlugs";
import {
  calculateMatchImportance,
  getMatchImportanceReasons,
} from "@/lib/matchImportance";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string;
  round?: string;
};

const TODAY_MATCHES_URL = "/api/matches?includeFinished=1&daysBack=0&daysForward=1";

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
  return slugify(`${match.player1}-vs-${match.player2}`);
}

function formatTime(value: string) {
  if (!value) return "Time TBC";

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function isLiveStatus(status: string) {
  return status.toUpperCase() === "LIVE";
}

function isCompletedStatus(status: string) {
  return ["FINISHED", "COMPLETED", "FT", "ENDED"].includes(status.toUpperCase());
}

function isUpcomingStatus(status: string) {
  const normalized = status.toUpperCase();
  return (
    ["UPCOMING", "SCHEDULED", "NOT STARTED"].includes(normalized) ||
    (!isLiveStatus(status) && !isCompletedStatus(status))
  );
}

function localDateKey(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-CA");
}

function isTodayMatch(match: Match) {
  return localDateKey(match.startTime) === localDateKey(new Date().toISOString());
}

function isMainTourMatch(match: Match) {
  return match.category === "ATP" || match.category === "WTA";
}

function timeValue(match: Match) {
  const value = new Date(match.startTime).getTime();
  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
}

function sortByImportance(matches: Match[]) {
  const now = new Date();

  return [...matches].sort((left, right) => {
    const scoreDifference =
      calculateMatchImportance(right, { now }) - calculateMatchImportance(left, { now });
    return scoreDifference || timeValue(left) - timeValue(right);
  });
}

function PlayerLink({ name }: { name: string }) {
  const href = safePlayerUrl(name);
  return href ? <Link href={href}>{name}</Link> : <>{name}</>;
}

function MatchCard({
  match,
  spoilerFree,
}: {
  match: Match;
  spoilerFree: boolean;
}) {
  const live = isLiveStatus(match.status);
  const importance = calculateMatchImportance(match);
  const reasons = getMatchImportanceReasons(match).slice(0, 2);

  return (
    <article
      className={`rounded-3xl border p-5 transition-colors ${
        live
          ? "border-red-500/70 bg-red-950/20"
          : "border-zinc-800 bg-zinc-900 hover:border-green-500"
      }`}
    >
      <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wide">
        <span
          className={`rounded-full px-3 py-1 ${
            live
              ? "bg-red-500 text-white"
              : isCompletedStatus(match.status)
                ? "bg-zinc-200 text-zinc-950"
                : "bg-zinc-700 text-zinc-100"
          }`}
        >
          {live ? "Live now" : match.status || "Scheduled"}
        </span>
        <span className="text-zinc-400">{match.category}</span>
      </div>

      <h3 className="mt-5 text-2xl font-black leading-tight">
        <PlayerLink name={match.player1} />
        <span className="my-1 block text-base font-medium text-zinc-500">vs</span>
        <PlayerLink name={match.player2} />
      </h3>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
        <Link href={`/tournament/${slugify(match.tournament)}`} className="hover:text-green-400">
          {match.tournament}
        </Link>
        <span aria-hidden="true">•</span>
        <time dateTime={match.startTime}>{formatTime(match.startTime)}</time>
      </div>

      {reasons.length > 0 && importance > 1 ? (
        <p className="mt-3 text-sm text-green-300">
          {importance}/5 importance · {reasons.join(" · ")}
        </p>
      ) : null}

      {(live || isCompletedStatus(match.status)) && match.score ? (
        <p className="mt-3 text-sm font-bold text-zinc-200">
          Score: <SpoilerSafeScore score={match.score} hidden={spoilerFree} />
        </p>
      ) : null}

      <Link
        href={`/match/${matchSlug(match)}`}
        className="mt-5 inline-flex rounded-xl bg-green-500 px-4 py-2 font-black text-black hover:bg-green-400"
      >
        Match details
      </Link>
    </article>
  );
}

function MatchSection({
  title,
  count,
  matches,
  spoilerFree,
}: {
  title: string;
  count: number;
  matches: Match[];
  spoilerFree: boolean;
}) {
  if (!matches.length) return null;

  return (
    <section className="mb-12" aria-labelledby={`${slugify(title)}-heading`}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 id={`${slugify(title)}-heading`} className="text-3xl font-black">
          {title}
        </h2>
        <span className="text-sm text-zinc-400">{count} matches</span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matches.slice(0, 12).map((match) => (
          <MatchCard key={match.id} match={match} spoilerFree={spoilerFree} />
        ))}
      </div>
    </section>
  );
}

export default function TodayClient() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [spoilerFree, setSpoilerFree] = useSpoilerFreeScores();

  useEffect(() => {
    async function loadMatches() {
      try {
        const safeMatches = await fetchClientMatches(TODAY_MATCHES_URL, {
          ttlMs: 30_000,
          timeoutMs: 8000,
        });
        setMatches((safeMatches as Match[]).filter(
          (match) => isTodayMatch(match) && isMainTourMatch(match)
        ));
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  const groupedMatches = useMemo(() => {
    const live = sortByImportance(matches.filter((match) => isLiveStatus(match.status)));
    const upcoming = sortByImportance(matches.filter((match) => isUpcomingStatus(match.status)));
    const completed = [...matches]
      .filter((match) => isCompletedStatus(match.status))
      .sort((left, right) => timeValue(right) - timeValue(left));

    return { live, upcoming, completed };
  }, [matches]);
  const atpCount = matches.filter((match) => match.category === "ATP").length;
  const wtaCount = matches.filter((match) => match.category === "WTA").length;

  return (
    <div className="rounded-[2rem] bg-black px-4 py-6 text-white md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-full bg-red-500/20 px-3 py-2 text-red-300">
            {groupedMatches.live.length} live
          </span>
          <span className="rounded-full bg-zinc-800 px-3 py-2 text-zinc-200">
            {groupedMatches.upcoming.length} upcoming
          </span>
          <span className="rounded-full bg-zinc-800 px-3 py-2 text-zinc-200">
            {groupedMatches.completed.length} finished
          </span>
          <span className="rounded-full bg-blue-500/20 px-3 py-2 text-blue-200">
            ATP {atpCount}
          </span>
          <span className="rounded-full bg-purple-500/20 px-3 py-2 text-purple-200">
            WTA {wtaCount}
          </span>
        </div>
        <SpoilerFreeScoreToggle enabled={spoilerFree} onChange={setSpoilerFree} />
      </div>

      {loading ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-lg font-bold">Loading today&apos;s matches…</p>
          <p className="mt-2 text-zinc-400">Live and important matches will appear first.</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="text-2xl font-black">No ATP or WTA matches are listed for today yet</h2>
          <p className="mt-3 max-w-2xl text-zinc-300">
            The feed can update when official ATP and WTA orders of play are published or courts change.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/live-tennis" className="rounded-xl bg-green-500 px-4 py-3 font-black text-black">
              Check live tennis
            </Link>
            <Link href="/atp-live-today" className="rounded-xl border border-zinc-700 px-4 py-3 font-bold">
              ATP matches
            </Link>
            <Link href="/wta-live-today" className="rounded-xl border border-zinc-700 px-4 py-3 font-bold">
              WTA matches
            </Link>
            <Link href="/tomorrow" className="rounded-xl border border-zinc-700 px-4 py-3 font-bold">
              Tomorrow&apos;s schedule
            </Link>
            <Link href="/tv-schedule" className="rounded-xl border border-zinc-700 px-4 py-3 font-bold">
              TV schedule
            </Link>
          </div>
        </div>
      ) : (
        <>
          <MatchSection
            title="Live now"
            count={groupedMatches.live.length}
            matches={groupedMatches.live}
            spoilerFree={spoilerFree}
          />
          <MatchSection
            title="Coming up today"
            count={groupedMatches.upcoming.length}
            matches={groupedMatches.upcoming}
            spoilerFree={spoilerFree}
          />
          <MatchSection
            title="Latest results"
            count={groupedMatches.completed.length}
            matches={groupedMatches.completed}
            spoilerFree={spoilerFree}
          />
        </>
      )}

      {matches.length > 0 ? (
        <details className="mt-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
          <summary className="cursor-pointer text-lg font-black">Plan times in your timezone</summary>
          <div className="mt-5">
            <TennisTimeZonePlanner matches={matches} />
          </div>
        </details>
      ) : null}
    </div>
  );
}
