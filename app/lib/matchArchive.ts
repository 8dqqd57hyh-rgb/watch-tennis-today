import archive from "@/data/matchArchive.json";

export type ArchivedMatch = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category?: string;
  status?: string;
  score?: string;
  startTime?: string | null;
  watchProviders?: {
    name: string;
    url: string;
    accessType?: string;
    verificationStatus?: string;
    note?: string;
  }[];
};

const matchArchive = archive as Record<string, ArchivedMatch>;

export function getArchivedMatch(matchId: string | null) {
  if (!matchId) return null;

  return matchArchive[matchId] || null;
}