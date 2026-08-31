"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { fetchClientMatches } from "@/app/lib/clientMatchFetch";
import TennisTimeZonePlanner from "@/app/components/TennisTimeZonePlanner";
import SpoilerFreeScoreToggle, {
  SpoilerSafeScore,
  useSpoilerFreeScores,
} from "@/app/components/SpoilerFreeScoreToggle";
import { safePlayerUrl } from "@/data/playerSlugs";
import { getMatchLocalDateKey } from "@/app/lib/matchNormalization";
import {
  calculateMatchImportance,
  getMatchImportanceReasons,
} from "@/lib/matchImportance";
import { getMatchStatusPresentation, groupMatchesByStatus, isFinishedMatch, isLiveMatch, isRetiredMatch, isSuspendedMatch } from "@/app/lib/matchStatus";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string | null;
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

type TourFilter = "ALL" | "ATP" | "WTA";
type StatusFilter = "ALL" | "LIVE" | "SUSPENDED" | "UPCOMING" | "RESULTS";

function formatTime(value: string | null) {
  if (!value) return "Time TBC";

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function isCompletedStatus(status: string) {
  return isFinishedMatch(status) || isRetiredMatch(status);
}

function isTodayMatch(match: Match) {
  return getMatchLocalDateKey(match.startTime) === getMatchLocalDateKey(new Date().toISOString());
}

function isMainTourMatch(match: Match) {
  return match.category === "ATP" || match.category === "WTA";
}

function timeValue(match: Match) {
  if (!match.startTime) return Number.MAX_SAFE_INTEGER;
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
  const live = isLiveMatch(match.status);
  const suspended = isSuspendedMatch(match.status);
  const presentation = getMatchStatusPresentation(match.status);
  const importance = calculateMatchImportance(match);
  const reasons = getMatchImportanceReasons(match).slice(0, 2);

  return (
    <article
      className={`rounded-3xl border p-5 transition-colors ${
        live
          ? "border-red-500/70 bg-red-950/20"
          : suspended
            ? "border-amber-400/60 bg-amber-950/20"
          : "border-zinc-800 bg-zinc-900 hover:border-green-500"
      }`}
    >
      <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-wide">
        <span
          className={`rounded-full px-3 py-1 ${
            live
              ? "bg-red-500 text-white"
              : suspended
                ? "bg-amber-400 text-black"
              : isCompletedStatus(match.status)
                ? "bg-zinc-200 text-zinc-950"
                : "bg-zinc-700 text-zinc-100"
          }`}
        >
          {presentation.badge}
        </span>
        <span className="text-zinc-400">{match.category}</span>
      </div>

      <p className={`mt-3 text-sm font-bold ${suspended ? "text-amber-300" : live ? "text-red-300" : "text-zinc-300"}`}>
        {presentation.supportingText}
      </p>

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
        <time dateTime={match.startTime || undefined}>{formatTime(match.startTime)}</time>
      </div>

      {reasons.length > 0 && importance > 1 ? (
        <p className="mt-3 text-sm text-green-300">
          {importance}/5 importance · {reasons.join(" · ")}
        </p>
      ) : null}

      {(live || suspended || isCompletedStatus(match.status)) && match.score ? (
        <p className="mt-3 text-sm font-bold text-zinc-200">
          Score: <SpoilerSafeScore score={match.score} hidden={spoilerFree} />
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/match/${matchSlug(match)}`}
          data-track-event="match_opened"
          data-track-area="today_match_card"
          className="inline-flex rounded-xl bg-green-500 px-4 py-2 font-black text-black hover:bg-green-400"
        >
          Match details
        </Link>
        <Link
          href={`/watch/${encodeURIComponent(match.id)}`}
          data-track-event="watch_options_opened"
          data-track-area="today_match_card"
          className="inline-flex rounded-xl border border-zinc-700 px-4 py-2 font-bold text-white hover:border-green-400"
        >
          Watch options
        </Link>
      </div>
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
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} spoilerFree={spoilerFree} />
        ))}
      </div>
    </section>
  );
}

function trackFilter(filterType: "tour" | "status", value: string) {
  const payload = { filter_type: filterType, filter_value: value, from_path: "/today" };
  track("schedule_filter_used", payload);
  window.gtag?.("event", "schedule_filter_used", payload);
}

export default function TodayClient({ initialMatches }: { initialMatches: Match[] }) {
  const [matches, setMatches] = useState<Match[]>(() =>
    initialMatches.filter((match) => isTodayMatch(match) && isMainTourMatch(match)),
  );
  const [tourFilter, setTourFilter] = useState<TourFilter>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [spoilerFree, setSpoilerFree] = useSpoilerFreeScores();

  useEffect(() => {
    let active = true;
    async function refreshMatches() {
      try {
        const safeMatches = await fetchClientMatches(TODAY_MATCHES_URL, {
          ttlMs: 0,
          timeoutMs: 8000,
        });
        if (active) setMatches((safeMatches as Match[]).filter(
          (match) => isTodayMatch(match) && isMainTourMatch(match)
        ));
      } catch {
        // Preserve the server-rendered schedule if the live refresh fails.
      }
    }

    void refreshMatches();
    const intervalId = window.setInterval(refreshMatches, 30_000);
    return () => { active = false; window.clearInterval(intervalId); };
  }, []);

  const groupedMatches = useMemo(() => {
    const tourMatches = matches.filter(
      (match) => tourFilter === "ALL" || match.category === tourFilter,
    );
    const grouped = groupMatchesByStatus(tourMatches);
    const live = sortByImportance(grouped.live);
    const upcoming = sortByImportance(grouped.upcoming);
    const completed = [...grouped.finished].sort((left, right) => timeValue(right) - timeValue(left));
    const suspended = sortByImportance(grouped.suspended);

    return { live, upcoming, completed, suspended };
  }, [matches, tourFilter]);
  const atpCount = matches.filter((match) => match.category === "ATP").length;
  const wtaCount = matches.filter((match) => match.category === "WTA").length;

  return (
    <div className="rounded-[2rem] bg-black px-4 py-6 text-white md:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-sm font-bold">
          <span className="rounded-full bg-red-500/20 px-3 py-2 text-red-300">
            {groupedMatches.live.length} live
          </span>
          <span className="rounded-full bg-amber-400/20 px-3 py-2 text-amber-300">
            {groupedMatches.suspended.length} suspended
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

      <div className="mb-8 grid gap-4 border-t border-zinc-800 pt-5 md:grid-cols-2">
        <fieldset>
          <legend className="mb-2 text-xs font-black uppercase tracking-wide text-zinc-400">Tour</legend>
          <div className="flex flex-wrap gap-2">
            {(["ALL", "ATP", "WTA"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={tourFilter === value}
                onClick={() => { setTourFilter(value); trackFilter("tour", value); }}
                className={`rounded-full px-4 py-2 text-sm font-black ${tourFilter === value ? "bg-green-500 text-black" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"}`}
              >
                {value === "ALL" ? "ATP + WTA" : value}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-xs font-black uppercase tracking-wide text-zinc-400">Show</legend>
          <div className="flex flex-wrap gap-2">
            {(["ALL", "LIVE", "SUSPENDED", "UPCOMING", "RESULTS"] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={statusFilter === value}
                onClick={() => { setStatusFilter(value); trackFilter("status", value); }}
                className={`rounded-full px-4 py-2 text-sm font-black ${statusFilter === value ? "bg-white text-black" : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"}`}
              >
                {value === "ALL" ? "All matches" : value === "RESULTS" ? "Results" : value === "UPCOMING" ? "Upcoming" : value === "SUSPENDED" ? "Suspended" : "Live"}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {matches.length === 0 ? (
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
          {statusFilter === "ALL" || statusFilter === "LIVE" ? <MatchSection title="Live now" count={groupedMatches.live.length} matches={groupedMatches.live} spoilerFree={spoilerFree} /> : null}
          {statusFilter === "ALL" || statusFilter === "UPCOMING" ? <MatchSection title="Coming up today" count={groupedMatches.upcoming.length} matches={groupedMatches.upcoming} spoilerFree={spoilerFree} /> : null}
          {statusFilter === "ALL" || statusFilter === "RESULTS" ? <MatchSection title="Latest results" count={groupedMatches.completed.length} matches={groupedMatches.completed} spoilerFree={spoilerFree} /> : null}
          {statusFilter === "ALL" || statusFilter === "SUSPENDED" ? <MatchSection title="Suspended" count={groupedMatches.suspended.length} matches={groupedMatches.suspended} spoilerFree={spoilerFree} /> : null}
          {((statusFilter === "LIVE" && !groupedMatches.live.length) ||
            (statusFilter === "UPCOMING" && !groupedMatches.upcoming.length) ||
            (statusFilter === "SUSPENDED" && !groupedMatches.suspended.length) ||
            (statusFilter === "RESULTS" && !groupedMatches.completed.length)) ? (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
              No matches fit these filters. Try another status or tour.
            </div>
          ) : null}
        </>
      )}

      {matches.length > 0 ? (
        <details
          className="mt-4 rounded-3xl border border-zinc-800 bg-zinc-950 p-5"
          onToggle={(event) => {
            if (event.currentTarget.open) {
              const payload = { from_path: "/today", match_count: matches.length };
              track("timezone_planner_opened", payload);
              window.gtag?.("event", "timezone_planner_opened", payload);
            }
          }}
        >
          <summary className="cursor-pointer text-lg font-black">Plan times in your timezone</summary>
          <div className="mt-5">
            <TennisTimeZonePlanner
              matches={matches.map((match) => ({
                ...match,
                startTime: match.startTime || undefined,
              }))}
            />
          </div>
        </details>
      ) : null}
    </div>
  );
}
