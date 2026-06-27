import {
  findBroadcasts,
  getCoverageSummary,
  type CanIWatchCoverageSummary,
  type TennisBroadcastEntry,
} from "@/src/data/tennisBroadcasts";

export type CoverageGraphMatch = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score?: string;
  startTime: string | null;
  round?: string;
  court?: string | null;
  surface?: string | null;
};

export type MatchCoverageNode = {
  match: CoverageGraphMatch;
  country: string;
  query: string;
  resultType: CanIWatchCoverageSummary["resultType"];
  entries: TennisBroadcastEntry[];
  summary: CanIWatchCoverageSummary;
  startsAt: Date | null;
  startsInLabel: string;
  matchLabel: string;
  tournamentLabel: string;
  hasVerifiedRoute: boolean;
  primaryBroadcasters: string[];
  primaryStreams: string[];
  caveat: string;
};

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCoverageQueryForTournament(tournament: string, category?: string) {
  const normalized = normalizeText(`${tournament} ${category ?? ""}`);

  if (normalized.includes("wimbledon")) return "wimbledon";
  if (normalized.includes("roland") || normalized.includes("french-open")) return "roland-garros";
  if (normalized.includes("us-open")) return "us-open";
  if (normalized.includes("australian-open")) return "australian-open";
  if (normalized.includes("wta") || normalized.includes("women")) return "wta-tour";
  if (normalized.includes("atp") || normalized.includes("men")) return "atp-tour";

  return tournament || category || "tennis";
}

function formatStartsIn(startTime: string | null) {
  if (!startTime) return "Start time to be confirmed";

  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) return "Start time to be confirmed";

  const diffMs = start.getTime() - Date.now();
  const absMinutes = Math.abs(Math.round(diffMs / 60000));
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;

  if (diffMs < -30 * 60000) return "Started earlier";
  if (diffMs < 0) return "Starting now";
  if (hours === 0) return `Starts in ${minutes}m`;
  return `Starts in ${hours}h ${minutes}m`;
}

function uniqueSorted(items: string[]) {
  return Array.from(new Set(items.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export function buildMatchCoverageNode(match: CoverageGraphMatch, country = "USA"): MatchCoverageNode {
  const query = getCoverageQueryForTournament(match.tournament, match.category);
  const entries = findBroadcasts(country, query);
  const summary = getCoverageSummary(country, query);
  const startsAt = match.startTime ? new Date(match.startTime) : null;
  const safeStartsAt = startsAt && !Number.isNaN(startsAt.getTime()) ? startsAt : null;
  const needsVerification = entries.some(
    (entry) => entry.confidenceLevel === "needs_check" || entry.confidenceLevel === "partial",
  );

  return {
    match,
    country,
    query,
    resultType: summary.resultType,
    entries,
    summary,
    startsAt: safeStartsAt,
    startsInLabel: formatStartsIn(match.startTime),
    matchLabel: `${match.player1} vs ${match.player2}`,
    tournamentLabel: match.tournament || match.category || "Tennis",
    hasVerifiedRoute: entries.length > 0 && !needsVerification,
    primaryBroadcasters: uniqueSorted(entries.map((entry) => entry.broadcasterName)).slice(0, 4),
    primaryStreams: uniqueSorted(entries.map((entry) => entry.streamingServiceName)).slice(0, 4),
    caveat: entries.length === 0
      ? "No country-specific route is stored yet. Check the tournament and broadcaster sites before paying."
      : needsVerification
        ? "Coverage is partial or needs match-week verification. Check provider listings before paying."
        : "Coverage is based on reviewed broadcaster rows, but exact court feeds can still vary by match.",
  };
}

export function buildTodayCoverageGraph(matches: CoverageGraphMatch[], country = "USA") {
  const todayKey = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return matches
    .filter((match) => {
      if (!match.startTime) return true;
      const date = new Date(match.startTime);
      if (Number.isNaN(date.getTime())) return true;
      return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date) === todayKey;
    })
    .map((match) => buildMatchCoverageNode(match, country))
    .sort((a, b) => {
      const aTime = a.startsAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bTime = b.startsAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
}

export function getCoverageGraphStats(nodes: MatchCoverageNode[]) {
  return {
    matchCount: nodes.length,
    matchedRouteCount: nodes.filter((node) => node.entries.length > 0).length,
    verifiedRouteCount: nodes.filter((node) => node.hasVerifiedRoute).length,
    broadcasterCount: new Set(nodes.flatMap((node) => node.primaryBroadcasters)).size,
  };
}
