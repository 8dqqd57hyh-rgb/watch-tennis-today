export type Match = {
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

const FEATURED_FINALISTS = ["pegula", "jodar", "jódar"];

function isFinalRound(round: string) {
  const normalizedRound = round.trim().toLowerCase();

  return (
    /\bfinals?$/.test(normalizedRound) &&
    !/(?:\b(?:semi|quarter|qualif(?:ying|ication))|\b\d+\/\d+)[\s-]*finals?$/.test(normalizedRound)
  );
}

function getStartTimestamp(startTime: string | null) {
  if (!startTime) return null;

  const timestamp = new Date(startTime).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function isFeaturedWashingtonFinal(match: Match) {
  const players = `${match.player1 || ""} ${match.player2 || ""}`.toLowerCase();
  const tournament = (match.tournament || "").toLowerCase();

  return (
    (tournament.includes("washington") || tournament.includes("mubadala") || tournament.includes("dc open")) &&
    FEATURED_FINALISTS.some((name) => players.includes(name))
  );
}

export function getUpcomingFinals(matches: Match[]) {
  return matches
    .filter((match) => {
      const category = (match.category || "").toLowerCase();

      const round = (match.round || "").toLowerCase();

      const tournament = (
        match.tournament || ""
      ).toLowerCase();

      const isAllowedCategory =
        category === "atp" ||
        category === "wta";

      const isFinal = isFinalRound(round);

      const isGrandSlam =
        tournament.includes("french open") ||
        tournament.includes("roland garros") ||
        tournament.includes("wimbledon") ||
        tournament.includes("us open") ||
        tournament.includes("australian open");

      return (
        isAllowedCategory &&
        isFinal &&
        !isGrandSlam &&
        getStartTimestamp(match.startTime) !== null &&
        !["finished", "completed", "cancelled", "canceled"].includes(
          (match.status || "").toLowerCase()
        )
      );
    })
    .sort(
      (a, b) =>
        (getStartTimestamp(a.startTime) ?? Number.MAX_SAFE_INTEGER) -
        (getStartTimestamp(b.startTime) ?? Number.MAX_SAFE_INTEGER)
    );
}

export function getFeaturedWashingtonFinals(matches: Match[]) {
  return matches
    .filter((match) => {
      const round = (match.round || "").toLowerCase();
      const category = (match.category || "").toLowerCase();
      const status = (match.status || "").toLowerCase();

      return (
        ["atp", "wta"].includes(category) &&
        isFinalRound(round) &&
        !["cancelled", "canceled"].includes(status) &&
        getStartTimestamp(match.startTime) !== null &&
        isFeaturedWashingtonFinal(match)
      );
    })
    .sort(
      (a, b) =>
        (getStartTimestamp(a.startTime) ?? Number.MAX_SAFE_INTEGER) -
        (getStartTimestamp(b.startTime) ?? Number.MAX_SAFE_INTEGER)
    );
}
