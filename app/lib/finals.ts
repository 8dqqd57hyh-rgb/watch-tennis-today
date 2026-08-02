export type Match = {
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

const FEATURED_FINALISTS = ["pegula", "jodar", "jódar"];

function isFinalRound(round: string) {
  return /(^|\s-\s)finals?$/.test(round.trim().toLowerCase());
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
        match.startTime &&
        !["finished", "completed", "cancelled", "canceled"].includes(
          (match.status || "").toLowerCase()
        )
      );
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() -
        new Date(b.startTime).getTime()
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
        Boolean(match.startTime) &&
        isFeaturedWashingtonFinal(match)
      );
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
}
