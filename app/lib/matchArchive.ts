import archive from "@/data/matchArchive.json";
import { supabaseAdmin as supabase } from "@/app/lib/supabaseAdmin";

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

type ArchivedMatchRow = {
  id?: string | number | null;
  player1?: string | null;
  player2?: string | null;
  tournament?: string | null;
  category?: string | null;
  status?: string | null;
  score?: string | null;
  start_time?: string | null;
  watch_providers?: ArchivedMatch["watchProviders"] | null;
};

export async function getArchivedMatchFromDatabase(matchId: string | null) {
  if (!matchId) return null;

  try {
    const { data, error } = await supabase
      .from("match_archive")
      .select("id, player1, player2, tournament, category, status, score, start_time, watch_providers")
      .eq("id", matchId)
      .maybeSingle<ArchivedMatchRow>();

    if (error || !data) {
      if (error) console.warn("match_archive watch lookup unavailable:", error.message);
      return null;
    }

    return {
      id: String(data.id || matchId),
      player1: data.player1 || "Unknown player",
      player2: data.player2 || "Unknown player",
      tournament: data.tournament || "Unknown tournament",
      category: data.category || "Tennis",
      status: data.status || "Completed",
      score: data.score || "",
      startTime: data.start_time || null,
      watchProviders: data.watch_providers || [],
    } satisfies ArchivedMatch;
  } catch (error) {
    console.warn("match_archive watch lookup skipped:", error);
    return null;
  }
}
