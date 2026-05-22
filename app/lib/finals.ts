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

      const isFinalRound =
        round.includes("final") &&
        !round.includes("semi") &&
        !round.includes("quarter");

      const isGrandSlam =
        tournament.includes("french open") ||
        tournament.includes("roland garros") ||
        tournament.includes("wimbledon") ||
        tournament.includes("us open") ||
        tournament.includes("australian open");

      return (
        isAllowedCategory &&
        isFinalRound &&
        !isGrandSlam &&
        match.startTime &&
        match.status !== "FINISHED" &&
        match.status !== "CANCELLED"
      );
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() -
        new Date(b.startTime).getTime()
    );
}