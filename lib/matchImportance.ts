import { players } from "@/data/players";
import { getCanonicalPlayerSlug } from "@/data/playerSlugs";
import { getRivalryForMatch } from "@/data/rivalries";

type MatchImportanceProvider = {
  name?: string | null;
  url?: string | null;
  verificationStatus?: string | null;
};

export type MatchImportanceMatch = {
  player1?: string | null;
  player2?: string | null;
  tournament?: string | null;
  category?: string | null;
  status?: string | null;
  startTime?: string | null;
  round?: string | null;
  watchProviders?: MatchImportanceProvider[] | null;
  h2h?: unknown;
  headToHead?: unknown;
};

export type MatchImportanceOptions = {
  now?: Date | string | number;
  popularPlayers?: readonly string[];
  tournamentImportance?: Record<string, number>;
};

const GRAND_SLAM_PATTERNS = [
  /australian open/i,
  /roland[-\s]?garros/i,
  /french open/i,
  /wimbledon/i,
  /us open/i,
  /u\.s\. open/i,
];

const DEFAULT_POPULAR_PLAYERS = Object.values(players).map((player) => player.name);

function normalizeText(value?: string | null) {
  return String(value || "").trim().toLowerCase();
}

function clampScore(score: number) {
  return Math.min(5, Math.max(1, score));
}

function getNow(options?: MatchImportanceOptions) {
  if (options?.now === undefined) return Date.now();

  const timestamp = new Date(options.now).getTime();
  return Number.isNaN(timestamp) ? Date.now() : timestamp;
}

function isGrandSlam(match: MatchImportanceMatch) {
  const text = `${match.tournament || ""} ${match.category || ""}`;
  return GRAND_SLAM_PATTERNS.some((pattern) => pattern.test(text));
}

function getRoundWeight(match: MatchImportanceMatch) {
  const round = normalizeText(match.round);

  if (!round) return { weight: 0, reason: null };
  if (/\bsemi[-\s]?finals?\b/.test(round)) return { weight: 1, reason: "Semifinal round" };
  if (/\bquarter[-\s]?finals?\b/.test(round)) return { weight: 0.7, reason: "Quarterfinal round" };
  if (/\bfinals?\b/.test(round) && !/\bsemi|quarter\b/.test(round)) return { weight: 1.4, reason: "Final round" };

  return { weight: 0, reason: null };
}

function isLive(match: MatchImportanceMatch) {
  return normalizeText(match.status) === "live";
}

function startsSoon(match: MatchImportanceMatch, options?: MatchImportanceOptions) {
  if (!match.startTime) return false;

  const startTimestamp = new Date(match.startTime).getTime();
  if (Number.isNaN(startTimestamp)) return false;

  const diffMs = startTimestamp - getNow(options);
  return diffMs >= 0 && diffMs <= 2 * 60 * 60 * 1000;
}

function getKnownPlayerCount(match: MatchImportanceMatch, options?: MatchImportanceOptions) {
  const popularPlayers = options?.popularPlayers ?? DEFAULT_POPULAR_PLAYERS;
  const popularSlugs = new Set(popularPlayers.map((name) => getCanonicalPlayerSlug(name)).filter(Boolean));

  return [match.player1, match.player2].filter((playerName) => {
    if (!playerName) return false;

    const slug = getCanonicalPlayerSlug(playerName);
    return Boolean(slug && popularSlugs.has(slug));
  }).length;
}

function getTournamentImportanceWeight(match: MatchImportanceMatch, options?: MatchImportanceOptions) {
  const tournament = normalizeText(match.tournament);
  const category = normalizeText(match.category);
  const combined = `${tournament} ${category}`;

  if (options?.tournamentImportance) {
    const configured = Object.entries(options.tournamentImportance).find(([name]) =>
      combined.includes(normalizeText(name))
    );

    if (configured) return Math.min(1, Math.max(0, configured[1]));
  }

  if (/atp finals|wta finals|tour finals|davis cup|billie jean king cup/.test(combined)) return 0.8;
  if (/masters 1000|wta 1000|atp 1000/.test(combined)) return 0.6;
  if (/atp 500|wta 500/.test(combined)) return 0.3;

  return 0;
}

function hasOfficialWatchInfo(match: MatchImportanceMatch) {
  return Boolean(match.watchProviders?.some((provider) => {
    const name = normalizeText(provider.name);
    const verificationStatus = normalizeText(provider.verificationStatus);

    return Boolean(
      provider.url &&
      (verificationStatus.includes("verified") ||
        name.includes("official") ||
        name.includes("tournament") ||
        name.includes("atp") ||
        name.includes("wta"))
    );
  }));
}

function hasExistingH2HData(match: MatchImportanceMatch) {
  const value = match.h2h ?? match.headToHead;

  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;

  return false;
}

function hasRivalryContext(match: MatchImportanceMatch) {
  if (!match.player1 || !match.player2) return false;

  return Boolean(getRivalryForMatch(match.player1, match.player2) || hasExistingH2HData(match));
}

function importanceSignals(match: MatchImportanceMatch, options?: MatchImportanceOptions) {
  const roundSignal = getRoundWeight(match);
  const knownPlayerCount = getKnownPlayerCount(match, options);

  return [
    { active: isGrandSlam(match), weight: 1.2, reason: "Grand Slam match" },
    { active: roundSignal.weight > 0, weight: roundSignal.weight, reason: roundSignal.reason },
    { active: isLive(match), weight: 1, reason: "Live now" },
    { active: startsSoon(match, options), weight: 0.7, reason: "Starts soon" },
    { active: knownPlayerCount === 1, weight: 0.6, reason: "Features a popular player" },
    { active: knownPlayerCount >= 2, weight: 1.1, reason: "Features two well-known players" },
    { active: getTournamentImportanceWeight(match, options) > 0, weight: getTournamentImportanceWeight(match, options), reason: "Important tournament" },
    { active: hasOfficialWatchInfo(match), weight: 0.4, reason: "Official watch info available" },
    { active: hasRivalryContext(match), weight: 0.6, reason: "Rivalry context available" },
  ].filter((signal): signal is { active: true; weight: number; reason: string } =>
    signal.active && Boolean(signal.reason)
  );
}

export function calculateMatchImportance(
  match: MatchImportanceMatch,
  options?: MatchImportanceOptions
) {
  const total = importanceSignals(match, options).reduce((score, signal) => score + signal.weight, 1);

  return clampScore(Math.round(total));
}

export function getMatchImportanceReasons(
  match: MatchImportanceMatch,
  options?: MatchImportanceOptions
) {
  return importanceSignals(match, options).map((signal) => signal.reason);
}

export function getWhyWatchText(
  match: MatchImportanceMatch,
  options?: MatchImportanceOptions
) {
  const reasons = getMatchImportanceReasons(match, options).slice(0, 2);
  const reasonPhrases: Record<string, string> = {
    "Grand Slam match": "it is a Grand Slam match",
    "Final round": "it is in the final round",
    "Semifinal round": "it is in the semifinal round",
    "Quarterfinal round": "it is in the quarterfinal round",
    "Live now": "it is live now",
    "Starts soon": "it starts soon",
    "Features a popular player": "it features a popular player",
    "Features two well-known players": "it features two well-known players",
    "Important tournament": "it is at an important tournament",
    "Official watch info available": "official watch info is available",
    "Rivalry context available": "rivalry context is available",
  };

  if (reasons.length === 0) {
    return "This match is worth checking for its tournament context and current schedule details.";
  }

  const phrases = reasons.map((reason) => reasonPhrases[reason] || reason.toLowerCase());
  const reasonText = phrases.length === 1 ? phrases[0] : `${phrases[0]} and ${phrases[1]}`;

  return `This is one of today's most interesting matches because ${reasonText}.`;
}
