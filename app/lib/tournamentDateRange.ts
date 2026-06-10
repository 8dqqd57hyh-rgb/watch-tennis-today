import { cache } from "react";
import { fetchApiTennisArray } from "@/app/lib/apiTennisClient";

export type TournamentDateRangeSource =
  | "supabase-calendar"
  | "api-tennis-fixtures"
  | "local-match-feed"
  | "unknown";

export type TournamentDateRange = {
  startDate: string;
  endDate: string;
  source: TournamentDateRangeSource;
  sourceName: string;
  confidence: "official" | "fixture-range" | "partial";
  matchCount?: number;
  tournamentKey?: string;
};

type ApiTournament = {
  tournament_key?: string | number | null;
  tournament_name?: string | null;
  event_type_key?: string | number | null;
  event_type_type?: string | null;
};

type ApiFixture = {
  event_date?: string | null;
  tournament_key?: string | number | null;
  tournament_name?: string | null;
  tournament_season?: string | number | null;
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugToSearchName(slug: string) {
  return normalizeText(slug.replace(/-/g, " "));
}

function getCurrentSeason() {
  return String(new Date().getFullYear());
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getTournamentLookupWindow() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 30);

  const stop = new Date(today);
  stop.setDate(today.getDate() + 30);

  return {
    date_start: formatDate(start),
    date_stop: formatDate(stop),
  };
}

function scoreTournamentCandidate(candidate: ApiTournament, slug: string, name?: string | null) {
  const candidateName = normalizeText(candidate.tournament_name || "");
  const slugName = slugToSearchName(slug);
  const readableName = normalizeText(name || "");

  if (!candidateName) return 0;

  let score = 0;

  if (candidateName === slugName) score += 100;
  if (readableName && candidateName === readableName) score += 100;
  if (candidateName.includes(slugName) || slugName.includes(candidateName)) score += 45;
  if (readableName && (candidateName.includes(readableName) || readableName.includes(candidateName))) score += 45;

  const slugTokens = new Set(slugName.split(" ").filter(Boolean));
  const readableTokens = new Set(readableName.split(" ").filter(Boolean));
  const candidateTokens = candidateName.split(" ").filter(Boolean);

  for (const token of candidateTokens) {
    if (slugTokens.has(token)) score += token.length > 2 ? 8 : 2;
    if (readableTokens.has(token)) score += token.length > 2 ? 8 : 2;
  }

  const type = normalizeText(candidate.event_type_type || "");
  if (/^w\d+/.test(slug) && type.includes("itf") && (type.includes("women") || type.includes("womens"))) {
    score += 20;
  }
  if (/^m\d+/.test(slug) && type.includes("itf") && type.includes("men")) {
    score += 20;
  }

  return score;
}

const getApiTennisTournaments = cache(async () => {
  return fetchApiTennisArray<ApiTournament>("get_tournaments", {}, { cacheSeconds: 60 * 60 * 24 });
});

type TournamentCandidate = {
  tournamentKey: string;
  eventTypeKey?: string;
  name?: string | null;
  eventType?: string | null;
  score: number;
};

export const resolveApiTennisTournamentCandidates = cache(async (slug: string, name?: string | null) => {
  const tournaments = await getApiTennisTournaments();

  const seen = new Set<string>();

  return tournaments
    .map((tournament) => ({
      tournament,
      score: scoreTournamentCandidate(tournament, slug, name),
    }))
    .filter(({ tournament, score }) => score > 0 && tournament.tournament_key)
    .sort((a, b) => b.score - a.score)
    .flatMap(({ tournament, score }): TournamentCandidate[] => {
      const tournamentKey = String(tournament.tournament_key);
      if (seen.has(tournamentKey)) return [];
      seen.add(tournamentKey);

      return [{
        tournamentKey,
        eventTypeKey: tournament.event_type_key ? String(tournament.event_type_key) : undefined,
        name: tournament.tournament_name || null,
        eventType: tournament.event_type_type || null,
        score,
      }];
    })
    .filter((candidate) => candidate.score >= 35)
    .slice(0, 4);
});

export const resolveApiTennisTournamentKey = cache(async (slug: string, name?: string | null) => {
  const [bestMatch] = await resolveApiTennisTournamentCandidates(slug, name);
  return bestMatch?.tournamentKey || null;
});

function dateOnly(value?: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return value;
}

function buildFixtureDateRange(
  fixtures: ApiFixture[],
  tournamentKey: string,
  sourceName = "API-Tennis fixtures by tournament_key"
): TournamentDateRange | null {
  const matchingFixtures = fixtures.filter((fixture) => String(fixture.tournament_key || "") === tournamentKey);
  const dates = matchingFixtures
    .map((fixture) => dateOnly(fixture.event_date))
    .filter((date): date is string => Boolean(date))
    .sort();

  if (dates.length === 0) return null;

  const uniqueDates = Array.from(new Set(dates));
  const startDate = uniqueDates[0];
  const endDate = uniqueDates[uniqueDates.length - 1];
  const daySpan = Math.round(
    (new Date(`${endDate}T00:00:00Z`).getTime() - new Date(`${startDate}T00:00:00Z`).getTime()) /
      86_400_000
  ) + 1;

  return {
    startDate,
    endDate,
    source: "api-tennis-fixtures",
    sourceName,
    confidence: daySpan >= 4 || uniqueDates.length >= 4 ? "fixture-range" : "partial",
    matchCount: matchingFixtures.length,
    tournamentKey,
  };
}

function pickBestFixtureRange(ranges: TournamentDateRange[]) {
  return ranges.sort((a, b) => {
    const aSpan = new Date(`${a.endDate}T00:00:00Z`).getTime() - new Date(`${a.startDate}T00:00:00Z`).getTime();
    const bSpan = new Date(`${b.endDate}T00:00:00Z`).getTime() - new Date(`${b.startDate}T00:00:00Z`).getTime();

    if (bSpan !== aSpan) return bSpan - aSpan;
    return (b.matchCount || 0) - (a.matchCount || 0);
  })[0] || null;
}

async function fetchFixturesWithParams(params: Record<string, string | number | null | undefined>) {
  return fetchApiTennisArray<ApiFixture>(
    "get_fixtures",
    {
      ...params,
      timezone: "Europe/Warsaw",
    },
    { cacheSeconds: 60 * 60 * 6, timeoutMs: 8000 }
  );
}

export const getApiTennisTournamentFixtureDateRange = cache(
  async (slug: string, name?: string | null, season = getCurrentSeason()) => {
    void season;
    const candidates = await resolveApiTennisTournamentCandidates(slug, name);

    if (candidates.length === 0) return null;

    const lookupWindow = getTournamentLookupWindow();
    const ranges: TournamentDateRange[] = [];

    for (const candidate of candidates) {
      const attempts = [
        {
          label: "API-Tennis fixtures by tournament_key, rolling 60-day window",
          params: {
            tournament_key: candidate.tournamentKey,
            date_start: lookupWindow.date_start,
            date_stop: lookupWindow.date_stop,
          },
        },
        candidate.eventTypeKey
          ? {
              label: "API-Tennis fixtures by event_type_key + tournament_key",
              params: {
                event_type_key: candidate.eventTypeKey,
                tournament_key: candidate.tournamentKey,
                date_start: lookupWindow.date_start,
                date_stop: lookupWindow.date_stop,
              },
            }
          : null,
      ].filter((attempt): attempt is { label: string; params: Record<string, string | number | null | undefined> } =>
        Boolean(attempt)
      );

      for (const attempt of attempts) {
        const fixtures = await fetchFixturesWithParams(attempt.params);
        const range = buildFixtureDateRange(fixtures, candidate.tournamentKey, attempt.label);

        if (range) ranges.push(range);
      }
    }

    return pickBestFixtureRange(ranges);
  }
);
