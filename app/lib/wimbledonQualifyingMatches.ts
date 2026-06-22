import { fetchApiTennisArray } from "@/app/lib/apiTennisClient";
import { resolveApiTennisTournamentCandidates } from "@/app/lib/tournamentDateRange";
import type { ServerMatch } from "@/app/lib/serverMatches";
import {
  isWimbledonQualifyingMatch,
  isWimbledonQualifyingWindowMatch,
} from "@/app/lib/grandSlamQualifying";

type ApiTennisMatch = {
  event_key?: string | number | null;
  event_date?: string | null;
  event_time?: string | null;
  event_first_player?: string | null;
  event_second_player?: string | null;
  event_final_result?: string | null;
  event_game_result?: string | null;
  event_status?: string | null;
  event_type_type?: string | null;
  event_live?: string | null;
  tournament_name?: string | null;
  tournament_round?: string | null;
  scores?: {
    score_first?: string | null;
    score_second?: string | null;
  }[];
};

function formatSetScore(firstValue?: string | null, secondValue?: string | null) {
  const first = String(firstValue || "").trim();
  const second = String(secondValue || "").trim();

  if (!first || !second) return null;
  if (first === "0" && second === "0") return null;
  return `${first}-${second}`;
}

function formatScore(match: ApiTennisMatch) {
  const setScores = Array.isArray(match.scores)
    ? match.scores
        .map((set) => formatSetScore(set.score_first, set.score_second))
        .filter(Boolean)
    : [];

  if (setScores.length > 0) return setScores.join(", ");
  if (match.event_final_result && !["-", "0-0"].includes(match.event_final_result)) return match.event_final_result;
  if (match.event_game_result && !["-", "0-0"].includes(match.event_game_result)) return match.event_game_result;
  return "";
}

function getStartTime(match: ApiTennisMatch) {
  if (!match.event_date || !match.event_time) return null;
  return `${match.event_date}T${match.event_time}:00`;
}

function normalizeStatus(match: ApiTennisMatch) {
  const status = String(match.event_status || "").trim();
  const hasScore = Boolean(formatScore(match));

  if (match.event_live === "1") return "LIVE";
  if (status) return status.toUpperCase();
  if (hasScore) return "FINISHED";
  return "UPCOMING";
}

function normalizeCategory(eventType?: string | null) {
  const value = String(eventType || "").toLowerCase();

  if (value.includes("wta") || value.includes("women") || value.includes("ladies")) return "WTA";
  if (value.includes("atp") || value.includes("men") || value.includes("gentlemen")) return "ATP";
  return "UNKNOWN";
}

function mapApiMatch(match: ApiTennisMatch): ServerMatch {
  const tournament = match.tournament_name || "Wimbledon";

  return {
    id: String(match.event_key || `${match.event_date}-${match.event_time}-${match.event_first_player}-${match.event_second_player}`),
    player1: String(match.event_first_player || "Opponent to be confirmed"),
    player2: String(match.event_second_player || "Opponent to be confirmed"),
    tournament,
    category: normalizeCategory(match.event_type_type),
    status: normalizeStatus(match),
    score: formatScore(match),
    startTime: getStartTime(match),
    round: "Wimbledon qualifying",
    watchProviders: [
      {
        name: "Wimbledon official broadcasters",
        url: "https://www.wimbledon.com/en_GB/atoz/tv_schedules.html",
        accessType: "REGION_DEPENDENT",
        verificationStatus: "TOURNAMENT_VERIFIED",
        note: "Wimbledon qualifying coverage depends on country and court availability.",
      },
    ],
  };
}

export async function getWimbledonQualifyingMatches() {
  const candidates = await resolveApiTennisTournamentCandidates("wimbledon", "Wimbledon");
  const singlesCandidates = candidates.filter((candidate) => {
    const type = String(candidate.eventType || "").toLowerCase();
    return type.includes("singles") || type.includes("atp") || type.includes("wta");
  });

  const fixtureGroups = await Promise.all(
    singlesCandidates.map((candidate) =>
      fetchApiTennisArray<ApiTennisMatch>(
        "get_fixtures",
        {
          tournament_key: candidate.tournamentKey,
          event_type_key: candidate.eventTypeKey,
          date_start: "2026-06-22",
          date_stop: "2026-06-25",
          timezone: "Europe/Warsaw",
        },
        {
          cacheSeconds: 60,
          timeoutMs: 8000,
          logLabel: "wimbledon-qualifying-fixtures",
        }
      )
    )
  );

  const matches = fixtureGroups
    .flat()
    .map(mapApiMatch)
    .filter((match) => isWimbledonQualifyingMatch(match) || isWimbledonQualifyingWindowMatch(match));

  return Array.from(new Map(matches.map((match) => [match.id, match])).values());
}
