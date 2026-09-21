import { normalizeMatchStatus } from "./matchStatus";

type PlayerScoreMatch = { status: string; score: string; tournament?: string; category?: string };

function parseSetScore(setScore: string) {
  const cleaned = setScore
    .replace(/\([^)]*\)/g, "")
    .replace(/[–—]/g, "-")
    .trim();

  const match = cleaned.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;

  const first = Number.parseInt(match[1], 10);
  const second = Number.parseInt(match[2], 10);

  if (!Number.isFinite(first) || !Number.isFinite(second) || first === second) {
    return null;
  }

  return { first, second };
}

function isCompletedTennisSet(first: number, second: number) {
  const high = Math.max(first, second);
  const low = Math.min(first, second);

  if (high >= 6 && high - low >= 2) return true;
  if (high === 7 && low === 6) return true;

  return false;
}

export function inferMatchWinnerSideFromScore(match: PlayerScoreMatch) {
  if (!match.score || match.score === "-") return null;

  const sets = match.score.split(/[,;]/).map(parseSetScore);

  if (!sets.length) return null;

  let player1Sets = 0;
  let player2Sets = 0;
  let incompleteSets = 0;

  for (const set of sets) {
    if (!set) return null;
    if (!isCompletedTennisSet(set.first, set.second)) {
      incompleteSets += 1;
      continue;
    }

    if (set.first > set.second) {
      player1Sets += 1;
    } else {
      player2Sets += 1;
    }
  }

  if (incompleteSets > 0) return null;
  if (player1Sets === player2Sets) return null;

  const context = `${match.category || ""} ${match.tournament || ""}`;
  const mensMajor = /\bATP\b/i.test(context)
    && /wimbledon|us open|australian open|french open|roland garros/i.test(context)
    && !/qualif|doubles|mixed|junior/i.test(context);
  const requiredSets = mensMajor || sets.length >= 4 ? 3 : 2;

  if (player1Sets >= requiredSets && player1Sets > player2Sets) return "player1";
  if (player2Sets >= requiredSets && player2Sets > player1Sets) return "player2";

  return null;
}

export function isFinishedMatch(match: PlayerScoreMatch) {
  const normalized = normalizeMatchStatus(match.status);
  if (["CANCELLED", "SUSPENDED", "EXPIRED", "UNKNOWN"].includes(normalized)) return false;
  if (["FINISHED", "RETIRED"].includes(normalized)) {
    return true;
  }

  // Some live feeds keep a match marked LIVE after the score is already complete.
  // A clearly completed tennis score must be treated as FINAL everywhere.
  return Boolean(inferMatchWinnerSideFromScore(match));
}
