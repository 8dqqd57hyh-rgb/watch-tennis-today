import { normalizeMatchStatus } from "./matchStatus";

type PlayerMatch = { status: string; startTime: string; tournament: string; player1: string; player2: string };

// Match start time is not a feed freshness timestamp. Use the same generous
// stale windows as /api/matches, allowing ordinary same-day schedule delays.
const LIVE_WINDOW = 8 * 60 * 60 * 1000;
const SCHEDULE_WINDOW = 12 * 60 * 60 * 1000;

export function isCurrentPlayerMatch(match: PlayerMatch, kind: "LIVE" | "UPCOMING", now = Date.now()) {
  if (normalizeMatchStatus(match.status) !== kind) return false;
  const start = Date.parse(match.startTime);
  if (!Number.isFinite(start)) return false;
  return kind === "LIVE"
    ? start <= now && start >= now - LIVE_WINDOW
    : start >= now - SCHEDULE_WINDOW;
}

export function getPlayerPageSummary<T extends PlayerMatch>(
  playerName: string,
  playerMatches: T[],
  isFinished: (match: T) => boolean,
  now = Date.now(),
) {
  const ascending = (a: T, b: T) => Date.parse(a.startTime) - Date.parse(b.startTime);
  const finishedMatches = playerMatches.filter(isFinished).sort((a, b) =>
    (Date.parse(b.startTime) || 0) - (Date.parse(a.startTime) || 0));
  const candidates = playerMatches.filter((match) => !isFinished(match));
  const liveMatches = candidates.filter((match) => isCurrentPlayerMatch(match, "LIVE", now)).sort(ascending);
  const upcomingMatches = candidates.filter((match) => isCurrentPlayerMatch(match, "UPCOMING", now)).sort(ascending);
  const nextMatch = liveMatches[0] ?? upcomingMatches[0];
  const tournaments = Array.from(new Set([...liveMatches, ...upcomingMatches]
    .map((match) => match.tournament).filter(Boolean))).slice(0, 3);
  const nextMatchAnswer = nextMatch
    ? `${playerName}'s ${liveMatches.length ? "current live" : "next listed"} match on this page is ${nextMatch.player1} vs ${nextMatch.player2} at ${nextMatch.tournament}. Start times can change during tournaments, so fans should confirm the official order of play before the match.`
    : `No upcoming match is currently listed for ${playerName}. Tennis schedules can change quickly because of draws, weather delays and withdrawals.`;

  return { liveMatches, upcomingMatches, finishedMatches, nextMatch, tournaments, nextMatchAnswer };
}
