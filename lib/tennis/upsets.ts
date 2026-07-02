import { safePlayerUrl } from "@/data/playerSlugs";
import { getMatchSlug } from "@/src/lib/matchCenter";

export type UpsetType = "live" | "completed";

export type UpsetScoreBreakdown = {
  rankingGap: number;
  rankingGapPoints: number;
  favoriteRankBonus: number;
  roundBonus: number;
  underdogResultBonus: number;
  underdogSetLeadBonus: number;
  reasons: string[];
};

export type UpsetPlayer = {
  name: string;
  rank: number;
  url: string | null;
};

export type UpsetCandidate = {
  id: string;
  type: UpsetType;
  badgeLabel?: string;
  badgeTone?: "live" | "completed" | "scare" | "potential";
  tournamentName: string;
  round: string | null;
  surface: string | null;
  startTime: string | null;
  favorite: UpsetPlayer;
  underdog: UpsetPlayer;
  favoriteRank: number;
  underdogRank: number;
  rankingGap: number;
  currentScore: string | null;
  upsetScore: number;
  scoreBreakdown: UpsetScoreBreakdown;
  scoreExplanation: string;
  matchStatus: string;
  matchUrl: string | null;
  watchUrl: string | null;
  playerUrls: {
    favorite: string | null;
    underdog: string | null;
  };
  source?: {
    label: string;
    url: string;
    secondaryLabel?: string;
    secondaryUrl?: string;
    checkedAt?: string;
  };
};

export type UpsetMatch = {
  id?: string | number | null;
  player1?: string | null;
  player2?: string | null;
  tournament?: string | null;
  category?: string | null;
  status?: string | null;
  score?: string | null;
  pointScore?: string | null;
  startTime?: string | null;
  round?: string | null;
  surface?: string | null;
  winner?: unknown;
  winnerName?: unknown;
  event_winner?: unknown;
  event_winner_player?: unknown;
  watchUrl?: unknown;
  watchHref?: unknown;
  matchUrl?: unknown;
  matchHref?: unknown;
  [key: string]: unknown;
};

const PLAYER_ONE_RANK_FIELDS = [
  "ranking1",
  "rank1",
  "player1Ranking",
  "player1Rank",
  "firstPlayerRanking",
  "firstPlayerRank",
  "event_first_player_ranking",
  "event_first_player_rank",
];

const PLAYER_TWO_RANK_FIELDS = [
  "ranking2",
  "rank2",
  "player2Ranking",
  "player2Rank",
  "secondPlayerRanking",
  "secondPlayerRank",
  "event_second_player_ranking",
  "event_second_player_rank",
];

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeStatus(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

function compactStatus(value?: string | null) {
  return normalizeStatus(value).replace(/[\s_-]+/g, "");
}

export function isCompletedMatchStatus(status?: string | null) {
  const normalized = normalizeStatus(status);
  const compact = compactStatus(status);

  return (
    compact.includes("finished") ||
    compact.includes("completed") ||
    compact.includes("complete") ||
    compact.includes("ended") ||
    compact.includes("final") ||
    compact.includes("retired") ||
    compact.includes("walkover") ||
    normalized.includes("walk over")
  );
}

export function isLiveMatchStatus(status?: string | null) {
  const normalized = normalizeStatus(status);
  const compact = compactStatus(status);

  if (!normalized || isCompletedMatchStatus(status)) return false;
  if (compact.includes("cancel") || compact.includes("postponed") || compact.includes("suspended")) return false;
  if (compact === "upcoming" || compact === "scheduled" || compact === "notstarted" || normalized.includes("not started")) {
    return false;
  }

  return (
    compact === "live" ||
    compact === "inprogress" ||
    normalized.includes("in progress") ||
    /^(\d)(st|nd|rd|th)? set$/.test(normalized) ||
    /^set [1-5]$/.test(normalized)
  );
}

function parseRank(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.round(value);

  const match = String(value ?? "").match(/\d+/);
  if (!match) return null;

  const rank = Number.parseInt(match[0], 10);
  return Number.isFinite(rank) && rank > 0 ? rank : null;
}

function rankFromFields(match: UpsetMatch, fields: string[]) {
  for (const field of fields) {
    const rank = parseRank(match[field]);
    if (rank) return rank;
  }

  return null;
}

function namesLikelyMatch(left: string, right: string) {
  const normalize = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const normalizedLeft = normalize(left);
  const normalizedRight = normalize(right);

  return Boolean(
    normalizedLeft &&
      normalizedRight &&
      (normalizedLeft === normalizedRight ||
        normalizedLeft.includes(normalizedRight) ||
        normalizedRight.includes(normalizedLeft))
  );
}

function getExplicitWinner(match: UpsetMatch) {
  const rawWinner = stringValue(match.winner) || stringValue(match.winnerName) || stringValue(match.event_winner) || stringValue(match.event_winner_player);
  if (!rawWinner) return null;

  if (namesLikelyMatch(match.player1 || "", rawWinner) || rawWinner === "1" || rawWinner.toLowerCase().includes("first")) {
    return "player1" as const;
  }

  if (namesLikelyMatch(match.player2 || "", rawWinner) || rawWinner === "2" || rawWinner.toLowerCase().includes("second")) {
    return "player2" as const;
  }

  return null;
}

export function getSetScoreLeader(score?: string | null) {
  const raw = String(score || "").trim();
  if (!raw || raw === "-" || raw === "0-0") return null;

  const compact = raw.replace(/\s+/g, "");
  const finalResult = compact.match(/^(\d+)[-:](\d+)$/);
  if (finalResult) {
    const player1Sets = Number(finalResult[1]);
    const player2Sets = Number(finalResult[2]);

    if (Number.isFinite(player1Sets) && Number.isFinite(player2Sets) && player1Sets !== player2Sets) {
      return player1Sets > player2Sets ? "player1" : "player2";
    }
  }

  let player1SetsWon = 0;
  let player2SetsWon = 0;
  const setMatches = [...raw.matchAll(/(\d{1,2})\s*[-:]\s*(\d{1,2})(?:\s*\([^)]*\))?/g)];

  for (const set of setMatches) {
    const first = Number(set[1]);
    const second = Number(set[2]);

    if (!Number.isFinite(first) || !Number.isFinite(second) || first === second) continue;
    if (first > second) player1SetsWon += 1;
    if (second > first) player2SetsWon += 1;
  }

  if (player1SetsWon === player2SetsWon) return null;

  return player1SetsWon > player2SetsWon ? "player1" : "player2";
}

function getSetWinCounts(score?: string | null) {
  const raw = String(score || "").trim();
  let player1SetsWon = 0;
  let player2SetsWon = 0;
  const sets = [...raw.matchAll(/(\d{1,2})\s*[-:]\s*(\d{1,2})(?:\s*\([^)]*\))?/g)]
    .map((set) => {
      const first = Number(set[1]);
      const second = Number(set[2]);

      if (!Number.isFinite(first) || !Number.isFinite(second) || first === second) return null;
      if (first > second) player1SetsWon += 1;
      if (second > first) player2SetsWon += 1;

      return { first, second };
    })
    .filter((set): set is { first: number; second: number } => Boolean(set));

  return {
    player1SetsWon,
    player2SetsWon,
    sets,
  };
}

function hasDecidingSetTiebreak(score?: string | null) {
  const { sets } = getSetWinCounts(score);
  const decidingSet = sets[sets.length - 1];

  return Boolean(decidingSet && decidingSet.first >= 6 && decidingSet.second >= 6);
}

function getRoundBonus(round?: string | null) {
  const normalized = normalizeStatus(round);

  if (!normalized) return { value: 0, reason: null };
  if (/\bsemi[-\s]?finals?\b/.test(normalized)) return { value: 10, reason: "semifinal round" };
  if (/\bquarter[-\s]?finals?\b/.test(normalized)) return { value: 5, reason: "quarterfinal round" };
  if (/\bfinals?\b/.test(normalized) && !/\bsemi|quarter\b/.test(normalized)) return { value: 10, reason: "final round" };

  return { value: 0, reason: null };
}

function getFavoriteRankBonus(rank: number) {
  if (rank <= 10) return { value: 30, reason: "favorite is Top 10" };
  if (rank <= 20) return { value: 20, reason: "favorite is Top 20" };
  if (rank <= 50) return { value: 10, reason: "favorite is Top 50" };

  return { value: 0, reason: null };
}

function getRankingGapPoints(rankingGap: number) {
  return Math.min(60, Math.max(1, Math.round(rankingGap / 2)));
}

function getStringLink(match: UpsetMatch, fields: string[]) {
  for (const field of fields) {
    const value = stringValue(match[field]);
    if (value && value.startsWith("/")) return value;
  }

  return null;
}

function getMatchUrl(match: UpsetMatch) {
  const explicitUrl = getStringLink(match, ["matchUrl", "matchHref"]);
  if (explicitUrl) return explicitUrl;

  const slug = getMatchSlug({
    player1: String(match.player1 || ""),
    player2: String(match.player2 || ""),
  });

  return slug ? `/match/${slug}` : null;
}

function getWatchUrl(match: UpsetMatch) {
  return getStringLink(match, ["watchUrl", "watchHref"]);
}

function buildExplanation({
  underdogRank,
  favoriteRank,
  type,
  isSetLead,
}: {
  underdogRank: number;
  favoriteRank: number;
  type: UpsetType;
  isSetLead: boolean;
}) {
  if (type === "completed") {
    return `World No. ${underdogRank} beat World No. ${favoriteRank}.`;
  }

  if (isSetLead) {
    return `World No. ${underdogRank} is leading World No. ${favoriteRank}.`;
  }

  return `World No. ${underdogRank} is challenging World No. ${favoriteRank}.`;
}

export function calculateUpsetCandidate(match: UpsetMatch): UpsetCandidate | null {
  const player1 = String(match.player1 || "").trim();
  const player2 = String(match.player2 || "").trim();
  if (!player1 || !player2) return null;

  const player1Rank = rankFromFields(match, PLAYER_ONE_RANK_FIELDS);
  const player2Rank = rankFromFields(match, PLAYER_TWO_RANK_FIELDS);
  if (!player1Rank || !player2Rank || player1Rank === player2Rank) return null;

  const favoriteSide = player1Rank < player2Rank ? "player1" : "player2";
  const underdogSide = favoriteSide === "player1" ? "player2" : "player1";
  const favoriteRank = favoriteSide === "player1" ? player1Rank : player2Rank;
  const underdogRank = underdogSide === "player1" ? player1Rank : player2Rank;
  const favoriteName = favoriteSide === "player1" ? player1 : player2;
  const underdogName = underdogSide === "player1" ? player1 : player2;
  const rankingGap = underdogRank - favoriteRank;

  if (rankingGap <= 0) return null;

  const status = String(match.status || "");
  const score = String(match.score || match.pointScore || "").trim();
  const setLeader = getSetScoreLeader(score);
  const explicitWinner = getExplicitWinner(match);
  const winner = explicitWinner || (isCompletedMatchStatus(status) ? setLeader : null);
  const underdogSideWon = winner === underdogSide;
  const underdogSideLeading = setLeader === underdogSide;
  const type: UpsetType | null = isCompletedMatchStatus(status)
    ? underdogSideWon
      ? "completed"
      : null
    : isLiveMatchStatus(status) && underdogSideLeading
      ? "live"
      : null;

  if (!type) return null;

  const favoriteBonus = getFavoriteRankBonus(favoriteRank);
  const roundBonus = getRoundBonus(match.round);
  const rankingGapPoints = getRankingGapPoints(rankingGap);
  const underdogResultBonus = type === "completed" ? 15 : 0;
  const underdogSetLeadBonus = type === "live" && underdogSideLeading ? 10 : 0;
  const reasons = [
    `${rankingGap}-place ranking gap`,
    favoriteBonus.reason,
    roundBonus.reason,
    underdogResultBonus ? "underdog has already won" : null,
    underdogSetLeadBonus ? "underdog is leading by at least one set" : null,
  ].filter((reason): reason is string => Boolean(reason));

  const upsetScore = rankingGapPoints + favoriteBonus.value + roundBonus.value + underdogResultBonus + underdogSetLeadBonus;
  const favoriteUrl = safePlayerUrl(favoriteName);
  const underdogUrl = safePlayerUrl(underdogName);
  const isSetLead = type === "live" && underdogSideLeading;

  return {
    id: String(match.id || `${player1}-${player2}-${match.startTime || ""}`),
    type,
    tournamentName: String(match.tournament || "Tennis match"),
    round: match.round ? String(match.round) : null,
    surface: match.surface ? String(match.surface) : null,
    startTime: match.startTime ? String(match.startTime) : null,
    favorite: {
      name: favoriteName,
      rank: favoriteRank,
      url: favoriteUrl,
    },
    underdog: {
      name: underdogName,
      rank: underdogRank,
      url: underdogUrl,
    },
    favoriteRank,
    underdogRank,
    rankingGap,
    currentScore: score || null,
    upsetScore,
    scoreBreakdown: {
      rankingGap,
      rankingGapPoints,
      favoriteRankBonus: favoriteBonus.value,
      roundBonus: roundBonus.value,
      underdogResultBonus,
      underdogSetLeadBonus,
      reasons,
    },
    scoreExplanation: buildExplanation({ underdogRank, favoriteRank, type, isSetLead }),
    matchStatus: status || (type === "completed" ? "Completed" : "Live"),
    matchUrl: getMatchUrl(match),
    watchUrl: getWatchUrl(match),
    playerUrls: {
      favorite: favoriteUrl,
      underdog: underdogUrl,
    },
  };
}

export function calculateUpsetScareCandidate(match: UpsetMatch): UpsetCandidate | null {
  const player1 = String(match.player1 || "").trim();
  const player2 = String(match.player2 || "").trim();
  if (!player1 || !player2) return null;

  const player1Rank = rankFromFields(match, PLAYER_ONE_RANK_FIELDS);
  const player2Rank = rankFromFields(match, PLAYER_TWO_RANK_FIELDS);
  if (!player1Rank || !player2Rank || player1Rank === player2Rank) return null;

  const favoriteSide = player1Rank < player2Rank ? "player1" : "player2";
  const underdogSide = favoriteSide === "player1" ? "player2" : "player1";
  const favoriteRank = favoriteSide === "player1" ? player1Rank : player2Rank;
  const underdogRank = underdogSide === "player1" ? player1Rank : player2Rank;
  const favoriteName = favoriteSide === "player1" ? player1 : player2;
  const underdogName = underdogSide === "player1" ? player1 : player2;
  const rankingGap = underdogRank - favoriteRank;

  if (rankingGap <= 0 || !isCompletedMatchStatus(match.status)) return null;

  const score = String(match.score || match.pointScore || "").trim();
  const setLeader = getSetScoreLeader(score);
  const explicitWinner = getExplicitWinner(match);
  const winner = explicitWinner || setLeader;
  if (winner !== favoriteSide) return null;

  const setCounts = getSetWinCounts(score);
  const underdogSetsWon = underdogSide === "player1" ? setCounts.player1SetsWon : setCounts.player2SetsWon;
  const pushedDecidingTiebreak = hasDecidingSetTiebreak(score);
  if (underdogSetsWon === 0 && !pushedDecidingTiebreak) return null;

  const favoriteBonus = getFavoriteRankBonus(favoriteRank);
  const roundBonus = getRoundBonus(match.round);
  const rankingGapPoints = getRankingGapPoints(rankingGap);
  const scareBonus = pushedDecidingTiebreak ? 15 : 8;
  const upsetScore = rankingGapPoints + favoriteBonus.value + roundBonus.value + scareBonus;
  const favoriteUrl = safePlayerUrl(favoriteName);
  const underdogUrl = safePlayerUrl(underdogName);

  return {
    id: String(match.id || `${player1}-${player2}-${match.startTime || ""}`),
    type: "completed",
    badgeLabel: "Upset Scare",
    badgeTone: "scare",
    tournamentName: String(match.tournament || "Tennis match"),
    round: match.round ? String(match.round) : null,
    surface: match.surface ? String(match.surface) : null,
    startTime: match.startTime ? String(match.startTime) : null,
    favorite: {
      name: favoriteName,
      rank: favoriteRank,
      url: favoriteUrl,
    },
    underdog: {
      name: underdogName,
      rank: underdogRank,
      url: underdogUrl,
    },
    favoriteRank,
    underdogRank,
    rankingGap,
    currentScore: score || null,
    upsetScore,
    scoreBreakdown: {
      rankingGap,
      rankingGapPoints,
      favoriteRankBonus: favoriteBonus.value,
      roundBonus: roundBonus.value,
      underdogResultBonus: 0,
      underdogSetLeadBonus: 0,
      reasons: [
        `${rankingGap}-place ranking gap`,
        favoriteBonus.reason,
        roundBonus.reason,
        underdogSetsWon > 0 ? "underdog won at least one set" : null,
        pushedDecidingTiebreak ? "favorite survived a deciding-set tiebreak" : null,
      ].filter((reason): reason is string => Boolean(reason)),
    },
    scoreExplanation: `World No. ${underdogRank} pushed World No. ${favoriteRank} before the favorite survived.`,
    matchStatus: String(match.status || "Completed"),
    matchUrl: getMatchUrl(match),
    watchUrl: getWatchUrl(match),
    playerUrls: {
      favorite: favoriteUrl,
      underdog: underdogUrl,
    },
  };
}

export function getUpsetCandidates(matches: UpsetMatch[]) {
  return matches
    .map(calculateUpsetCandidate)
    .filter((candidate): candidate is UpsetCandidate => Boolean(candidate))
    .sort((left, right) => right.upsetScore - left.upsetScore);
}

export function splitUpsetCandidates(matches: UpsetMatch[]) {
  const candidates = getUpsetCandidates(matches);
  const candidateIds = new Set(candidates.map((candidate) => candidate.id));
  const scares = matches
    .map(calculateUpsetScareCandidate)
    .filter((candidate): candidate is UpsetCandidate => Boolean(candidate))
    .filter((candidate) => !candidateIds.has(candidate.id))
    .sort((left, right) => right.upsetScore - left.upsetScore);

  return {
    live: candidates.filter((candidate) => candidate.type === "live"),
    completed: candidates.filter((candidate) => candidate.type === "completed"),
    scares,
    all: candidates,
  };
}
