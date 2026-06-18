import { cache } from "react";
import { fetchApiTennisArray, type ApiTennisFetchMeta } from "@/app/lib/apiTennisClient";

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

type TournamentFixtureSegment = {
  key: "recent-completed" | "current" | "upcoming" | "expanded-from-fixtures";
  label: string;
  date_start: string;
  date_stop: string;
};

const TOURNAMENT_FIXTURE_CACHE_SECONDS = 60 * 60 * 6;
const RECENT_COMPLETED_DAYS = 7;
const UPCOMING_DAYS = 7;
const TOURNAMENT_EXPANSION_DAYS = 21;

function shiftDate(date: Date, days: number) {
  const shifted = new Date(date);
  shifted.setDate(date.getDate() + days);
  return shifted;
}

function parseDateOnly(value: string) {
  return new Date(`${value}T00:00:00Z`);
}

function getTournamentLookupSegments(): TournamentFixtureSegment[] {
  const today = new Date();

  return [
    {
      key: "recent-completed",
      label: `recent completed matches, ${RECENT_COMPLETED_DAYS}-day window`,
      date_start: formatDate(shiftDate(today, -RECENT_COMPLETED_DAYS)),
      date_stop: formatDate(shiftDate(today, -1)),
    },
    {
      key: "current",
      label: "current matches, 1-day window",
      date_start: formatDate(today),
      date_stop: formatDate(today),
    },
    {
      key: "upcoming",
      label: `upcoming matches, ${UPCOMING_DAYS}-day window`,
      date_start: formatDate(shiftDate(today, 1)),
      date_stop: formatDate(shiftDate(today, UPCOMING_DAYS)),
    },
  ];
}

function getExpandedTournamentLookupSegment(range: TournamentDateRange): TournamentFixtureSegment | null {
  if (!dateOnly(range.startDate) || !dateOnly(range.endDate)) return null;

  const startDate = parseDateOnly(range.startDate);
  const endDate = parseDateOnly(range.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;

  return {
    key: "expanded-from-fixtures",
    label: `${TOURNAMENT_EXPANSION_DAYS}-day expanded tournament window from discovered fixtures`,
    date_start: formatDate(shiftDate(startDate, -TOURNAMENT_EXPANSION_DAYS)),
    date_stop: formatDate(shiftDate(endDate, TOURNAMENT_EXPANSION_DAYS)),
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
    confidence: daySpan >= 4 && uniqueDates.length >= 4 ? "fixture-range" : "partial",
    matchCount: matchingFixtures.length,
    tournamentKey,
  };
}

function combineFixtureRanges(ranges: TournamentDateRange[]) {
  if (ranges.length === 0) return null;

  const sortedByDate = [...ranges].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const startDate = sortedByDate[0].startDate;
  const endDate = sortedByDate
    .map((range) => range.endDate)
    .sort()
    .at(-1) || sortedByDate[0].endDate;
  const totalMatches = ranges.reduce((sum, range) => sum + (range.matchCount || 0), 0);
  const tournamentKey = ranges.find((range) => range.tournamentKey)?.tournamentKey;
  const sourceNames = Array.from(new Set(ranges.map((range) => range.sourceName)));
  const daySpan = Math.round(
    (new Date(`${endDate}T00:00:00Z`).getTime() - new Date(`${startDate}T00:00:00Z`).getTime()) /
      86_400_000
  ) + 1;

  return {
    startDate,
    endDate,
    source: "api-tennis-fixtures" as const,
    sourceName: sourceNames.join("; "),
    confidence: daySpan >= 4 ? ("fixture-range" as const) : ("partial" as const),
    matchCount: totalMatches,
    tournamentKey,
  };
}

function pickBestFixtureRange(ranges: TournamentDateRange[]) {
  const combined = combineFixtureRanges(ranges);
  if (combined) return combined;

  return null;
}

function shouldLogTournamentFixtureMeta(meta: ApiTennisFetchMeta) {
  return meta.cacheStatus !== "eligible" || process.env.LOG_TOURNAMENT_FIXTURES === "1";
}

function logTournamentFixtureMeta(meta: ApiTennisFetchMeta) {
  if (!shouldLogTournamentFixtureMeta(meta)) return;

  console.info("[TOURNAMENT-FIXTURE-CACHE]", {
    label: meta.label,
    payloadSizeBytes: meta.payloadSizeBytes,
    payloadSizeKb: Math.round(meta.payloadSizeBytes / 1024),
    matchCount: meta.resultCount,
    cacheMode: meta.cacheMode,
    cacheSeconds: meta.cacheSeconds,
    cacheStatus: meta.cacheStatus,
    durationMs: meta.durationMs,
  });
}

async function fetchFixturesWithParams(params: Record<string, string | number | null | undefined>, label: string) {
  return fetchApiTennisArray<ApiFixture>(
    "get_fixtures",
    {
      ...params,
      timezone: "Europe/Warsaw",
    },
    {
      cacheSeconds: TOURNAMENT_FIXTURE_CACHE_SECONDS,
      timeoutMs: 8000,
      logLabel: label,
      onMeta: logTournamentFixtureMeta,
    }
  );
}

export const getApiTennisTournamentFixtureDateRange = cache(
  async (slug: string, name?: string | null, season = getCurrentSeason()) => {
    void season;
    const candidates = await resolveApiTennisTournamentCandidates(slug, name);

    if (candidates.length === 0) return null;

    const lookupSegments = getTournamentLookupSegments();
    const ranges: TournamentDateRange[] = [];

    for (const candidate of candidates) {
      const baseAttempts = candidate.eventTypeKey
        ? [
            {
              label: "API-Tennis fixtures by event_type_key + tournament_key",
              params: {
                event_type_key: candidate.eventTypeKey,
                tournament_key: candidate.tournamentKey,
              },
            },
          ]
        : [
            {
              label: "API-Tennis fixtures by tournament_key",
              params: {
                tournament_key: candidate.tournamentKey,
              },
            },
          ];

      for (const baseAttempt of baseAttempts) {
        for (const segment of lookupSegments) {
          const params = {
            ...baseAttempt.params,
            date_start: segment.date_start,
            date_stop: segment.date_stop,
          };
          const label = `${baseAttempt.label}, ${segment.label}`;
          const fixtures = await fetchFixturesWithParams(params, label);
          const range = buildFixtureDateRange(fixtures, candidate.tournamentKey, label);

          if (range) ranges.push(range);
        }
      }

      const discoveredRange = pickBestFixtureRange(ranges);
      const expandedSegment = discoveredRange ? getExpandedTournamentLookupSegment(discoveredRange) : null;

      if (expandedSegment) {
        for (const baseAttempt of baseAttempts) {
          const params = {
            ...baseAttempt.params,
            date_start: expandedSegment.date_start,
            date_stop: expandedSegment.date_stop,
          };
          const label = `${baseAttempt.label}, ${expandedSegment.label}`;
          const fixtures = await fetchFixturesWithParams(params, label);
          const range = buildFixtureDateRange(fixtures, candidate.tournamentKey, label);

          if (range) ranges.push(range);
        }
      }

      if (ranges.length === 0 && candidate.eventTypeKey) {
        for (const segment of lookupSegments) {
          const params = {
            tournament_key: candidate.tournamentKey,
            date_start: segment.date_start,
            date_stop: segment.date_stop,
          };
          const label = `API-Tennis fixtures by tournament_key fallback, ${segment.label}`;
          const fixtures = await fetchFixturesWithParams(params, label);
          const range = buildFixtureDateRange(fixtures, candidate.tournamentKey, label);

          if (range) ranges.push(range);
        }

        const fallbackDiscoveredRange = pickBestFixtureRange(ranges);
        const fallbackExpandedSegment = fallbackDiscoveredRange
          ? getExpandedTournamentLookupSegment(fallbackDiscoveredRange)
          : null;

        if (fallbackExpandedSegment) {
          const params = {
            tournament_key: candidate.tournamentKey,
            date_start: fallbackExpandedSegment.date_start,
            date_stop: fallbackExpandedSegment.date_stop,
          };
          const label = `API-Tennis fixtures by tournament_key fallback, ${fallbackExpandedSegment.label}`;
          const fixtures = await fetchFixturesWithParams(params, label);
          const range = buildFixtureDateRange(fixtures, candidate.tournamentKey, label);

          if (range) ranges.push(range);
        }
      }

      if (ranges.length > 0) {
        break;
      }
    }

    return pickBestFixtureRange(ranges);
  }
);
