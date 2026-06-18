import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

type ApiTennisMatch = {
  event_key: string;
  event_date: string;
  event_time: string;
  event_first_player: string;
  event_second_player: string;
  first_player_key?: string | number | null;
  second_player_key?: string | number | null;
  event_final_result: string;
  event_game_result?: string;
  event_current_result?: string;
  event_point_result?: string;
  event_live_score?: string;
  event_status: string;
  event_type_type: string;
  event_winner?: string | null;
  event_winner_player?: string | null;
  tournament_name: string;
  event_live: string;
  tournament_round?: string;
  scores?: {
    score_first: string;
    score_second: string;
    score_set: string;
    score_game?: string;
  }[];
  pointbypoint?: {
    set_number?: string;
    number_game?: string;
    player_served?: string | null;
    serve_winner?: string | null;
    serve_lost?: string | null;
    score?: string;
    points?: {
      number_point?: string;
      score?: string;
      break_point?: string | null;
      set_point?: string | null;
      match_point?: string | null;
    }[];
  }[];
};

type ApiTennisPlayer = {
  player_key?: string | number | null;
  player_name?: string | null;
};

type WatchProvider = {
  name: string;
  url: string;
  accessType?: string;
  verificationStatus?: string;
  note?: string;
};

type MappedMatch = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  round?: string;
  isFinal?: boolean;
  score: string;
  pointScore: string | null;
  startTime: string | null;
  winner: string | null;
  winnerId: string | null;
  watchProviders: WatchProvider[];
};

type ArchivedMatchRow = {
  id?: string | number | null;
  player1?: string | null;
  player2?: string | null;
  tournament?: string | null;
  category?: string | null;
  status?: string | null;
  score?: string | null;
  start_time?: string | null;
  watch_providers?: WatchProvider[] | null;
};


function getMatchesCacheHeaders(matches: { status?: string | null }[], options: { realtime?: boolean } = {}) {
  if (options.realtime || matches.some((match) => String(match.status || "").toUpperCase() === "LIVE")) {
    return {
      "Cache-Control": "public, s-maxage=25, stale-while-revalidate=25",
      "CDN-Cache-Control": "public, s-maxage=25, stale-while-revalidate=25",
      "Vercel-CDN-Cache-Control": "public, s-maxage=25, stale-while-revalidate=25",
    };
  }

  return {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    "CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    "Vercel-CDN-Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
  };
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shouldLogApiTennis() {
  return process.env.LOG_API_TENNIS === "1" || process.env.DEBUG_API_TENNIS === "1";
}

function shouldLogMatchFilters(searchParams: URLSearchParams) {
  return searchParams.get("debug") === "1" || process.env.DEBUG_MATCH_FILTERS === "1";
}

function matchDebugLabel(match: Partial<ApiTennisMatch> & {
  id?: string;
  player1?: string;
  player2?: string;
  tournament?: string;
  status?: string;
  startTime?: string | null;
}) {
  const id = match.event_key || match.id || "unknown-id";
  const player1 = match.event_first_player || match.player1 || "TBD";
  const player2 = match.event_second_player || match.player2 || "TBD";
  const tournament = match.tournament_name || match.tournament || "Unknown tournament";
  const status = match.event_status || match.status || "unknown-status";
  const startTime =
    match.event_date || match.event_time
      ? `${match.event_date || "unknown-date"} ${match.event_time || "unknown-time"}`
      : match.startTime || "unknown-time";

  return `${id}: ${player1} vs ${player2} | ${tournament} | ${status} | ${startTime}`;
}

function logMatchFilters(enabled: boolean, label: string, payload: unknown) {
  if (!enabled) return;
  console.info(`[MATCH-FILTERS] ${label} ${JSON.stringify(payload)}`);
}

function getPayloadSizeBytes(text: string) {
  return new TextEncoder().encode(text).length;
}

function logApiTennisRequest(method: string, payloadSize: number, duration: number) {
  if (!shouldLogApiTennis()) return;
  console.log("[API-TENNIS]", method, payloadSize, duration);
}


function isDateInRecentArchiveWindow(value?: string | null) {
  if (!value) return false;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;

  const today = new Date();
  const windowStart = new Date(today);
  windowStart.setHours(0, 0, 0, 0);
  windowStart.setDate(windowStart.getDate() - 1);

  const windowStop = new Date(today);
  windowStop.setHours(23, 59, 59, 999);
  windowStop.setDate(windowStop.getDate() + 1);

  return parsed >= windowStart && parsed <= windowStop;
}

function buildDateWindows(dateStartDate: Date, dateStopDate: Date, chunkDays = 28) {
  const windows: { start: string; stop: string }[] = [];
  const cursor = new Date(dateStartDate);

  while (cursor <= dateStopDate) {
    const windowStart = new Date(cursor);
    const windowStop = new Date(cursor);
    windowStop.setDate(windowStop.getDate() + chunkDays - 1);

    if (windowStop > dateStopDate) {
      windowStop.setTime(dateStopDate.getTime());
    }

    windows.push({
      start: formatDate(windowStart),
      stop: formatDate(windowStop),
    });

    cursor.setDate(cursor.getDate() + chunkDays);
  }

  return windows;
}

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  limit = 3
) {
  const results: T[] = [];
  let cursor = 0;

  async function worker() {
    while (cursor < tasks.length) {
      const currentIndex = cursor;
      cursor += 1;

      try {
        results[currentIndex] = await tasks[currentIndex]();
      } catch {
        results[currentIndex] = [] as T;
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, tasks.length) }, () => worker())
  );

  return results;
}

async function fetchFixtureWindows(
  apiKey: string,
  dateStartDate: Date,
  dateStopDate: Date,
  resolvedPlayerKey: string | null,
  options: { formHistory?: boolean; playerName?: string | null } = {}
) {
  const windows = buildDateWindows(
    dateStartDate,
    dateStopDate,
    options.formHistory && resolvedPlayerKey ? 30 : options.formHistory ? 21 : 28
  );

  // Keep the public /api/matches endpoint fast and resilient. API-Tennis can
  // return intermittent 500s on get_fixtures, especially for long player-form
  // ranges. Limit concurrency so one player page cannot fan out into dozens of
  // simultaneous external calls and flood Vercel with warnings.
  const fixtureResponses = await runWithConcurrency(
    windows.map((window) => () =>
      fetchApiTennis(
        "get_fixtures",
        apiKey,
        `&date_start=${window.start}&date_stop=${window.stop}&timezone=Europe/Warsaw${
          resolvedPlayerKey ? `&player_key=${resolvedPlayerKey}` : ""
        }`,
        options.formHistory ? 6500 : 4500
      )
    ),
    options.formHistory ? 2 : 4
  );

  return fixtureResponses.flatMap((response) => response);
}

function getOpponentKeysForPlayerForm(
  matches: ApiTennisMatch[],
  resolvedPlayerKey: string | null,
  playerName: string | null,
  limit = 4
) {
  if (!resolvedPlayerKey && !playerName) return [];

  const sortedMatches = [...matches].sort((a, b) => {
    const left = new Date(getStartTime(a) || "").getTime();
    const right = new Date(getStartTime(b) || "").getTime();

    return (Number.isFinite(right) ? right : 0) - (Number.isFinite(left) ? left : 0);
  });

  const opponentKeys: string[] = [];

  const addOpponentKey = (key?: string | number | null) => {
    const normalizedKey = key ? String(key) : null;
    if (!normalizedKey || normalizedKey === resolvedPlayerKey || opponentKeys.includes(normalizedKey)) return;
    opponentKeys.push(normalizedKey);
  };

  for (const match of sortedMatches) {
    if (opponentKeys.length >= limit) break;

    const firstKey = match.first_player_key ? String(match.first_player_key) : null;
    const secondKey = match.second_player_key ? String(match.second_player_key) : null;
    const firstName = match.event_first_player || "";
    const secondName = match.event_second_player || "";

    if (resolvedPlayerKey && firstKey === resolvedPlayerKey) {
      addOpponentKey(secondKey);
      continue;
    }

    if (resolvedPlayerKey && secondKey === resolvedPlayerKey) {
      addOpponentKey(firstKey);
      continue;
    }

    if (playerName && apiNameMatchesPlayer(playerName, firstName)) {
      addOpponentKey(secondKey);
      continue;
    }

    if (playerName && apiNameMatchesPlayer(playerName, secondName)) {
      addOpponentKey(firstKey);
    }
  }

  return opponentKeys;
}

async function fetchPlayerRecentResultsFromH2H(
  apiKey: string,
  resolvedPlayerKey: string | null,
  playerName: string | null,
  seedMatches: ApiTennisMatch[]
) {
  if (!resolvedPlayerKey || !playerName) return [];

  const opponentKeys = getOpponentKeysForPlayerForm(seedMatches, resolvedPlayerKey, playerName);
  if (!opponentKeys.length) return [];

  // API-Tennis get_fixtures can be sparse for broad historical player windows.
  // get_H2H explicitly returns recent games for each submitted player. Query a few
  // known opponents instead of a single seed opponent because the API may return
  // richer recent-player payloads depending on the pair.
  const h2hResponses = await Promise.allSettled(
    opponentKeys.map((opponentKey) =>
      fetchApiTennisResult(
        "get_H2H",
        apiKey,
        `&first_player_key=${encodeURIComponent(resolvedPlayerKey)}&second_player_key=${encodeURIComponent(opponentKey)}`,
        12000
      )
    )
  );

  const recentMatches: ApiTennisMatch[] = [];

  for (const response of h2hResponses) {
    if (response.status !== "fulfilled") continue;

    const result = response.value;
    if (!result || typeof result !== "object" || Array.isArray(result)) continue;

    const payload = result as {
      firstPlayerResults?: unknown;
      secondPlayerResults?: unknown;
      H2H?: unknown;
    };

    const candidateGroups = [
      payload.firstPlayerResults,
      payload.secondPlayerResults,
      payload.H2H,
    ];

    for (const group of candidateGroups) {
      if (!Array.isArray(group)) continue;

      for (const match of group as ApiTennisMatch[]) {
        if (
          String(match.first_player_key || "") === resolvedPlayerKey ||
          String(match.second_player_key || "") === resolvedPlayerKey ||
          apiNameMatchesPlayer(playerName, match.event_first_player || "") ||
          apiNameMatchesPlayer(playerName, match.event_second_player || "")
        ) {
          recentMatches.push(match);
        }
      }
    }
  }

  return Array.from(
    new Map(recentMatches.map((match) => [String(match.event_key), match])).values()
  );
}

function normalizeCategory(eventType?: string, tournamentName?: string) {
  const value = `${eventType || ""} ${tournamentName || ""}`.toLowerCase();

  if (value.includes("challenger")) return "CHALLENGER";
  if (value.includes("itf")) return "ITF";
  if (value.includes("wta")) return "WTA";
  if (value.includes("atp")) return "ATP";

  // Grand Slam feeds often come from API-Tennis as "Men Singles" / "Women Singles"
  // instead of ATP/WTA. Classify those so ATP/WTA landing pages do not miss
  // Roland Garros, Wimbledon, Australian Open or US Open matches.
  if (/(women|woman|womens|women's|ladies)/.test(value)) return "WTA";
  if (/(men|man|mens|men's|gentlemen)/.test(value)) return "ATP";

  return "UNKNOWN";
}


function normalizeSearchName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isInitialToken(value: string) {
  return /^[a-z]$/.test(value.replace(/\./g, ""));
}

function apiDoublesSideIncludesPlayer(playerName: string, sideName: string) {
  if (!/[\/&+]/.test(sideName)) return false;

  const targetParts = normalizeSearchName(playerName).split(/\s+/).filter(Boolean);
  const targetLast = targetParts[targetParts.length - 1] || "";
  if (!targetLast) return false;

  return sideName
    .split(/[\/&+]/)
    .map((part) => normalizeSearchName(part))
    .filter(Boolean)
    .some((part) => {
      const partTokens = part.split(/\s+/).filter(Boolean);

      if (partTokens.length === 1) {
        return partTokens[0] === targetLast;
      }

      return apiNameMatchesPlayer(playerName, part);
    });
}

function apiSinglesNameMatchesPlayer(playerName: string, sideName: string) {
  const targetParts = normalizeSearchName(playerName).split(/\s+/).filter(Boolean);
  const sideParts = normalizeSearchName(sideName).split(/\s+/).filter(Boolean);

  const targetFirst = targetParts[0] || "";
  const targetLast = targetParts[targetParts.length - 1] || "";
  const sideFirst = sideParts[0] || "";
  const sideLast = sideParts[sideParts.length - 1] || "";

  if (!targetLast || !sideParts.length) return false;
  if (targetParts.join(" ") === sideParts.join(" ")) return true;

  // Common API-Tennis formats for the same player include:
  // - "Alexander Zverev"
  // - "A. Zverev" / "A Zverev"
  // - "Zverev A." / "Zverev A"
  // Treat all of these as the same player. Without the reversed surname+initial
  // branch, get_H2H recent rows are filtered out before they can reach the form
  // tracker, which makes pages like /player/alexander-zverev miss Rome/Madrid/etc.
  if (targetLast === sideLast) {
    return !targetFirst || !sideFirst || targetFirst[0] === sideFirst[0];
  }

  if (sideFirst === targetLast && sideLast && targetFirst) {
    return sideLast === targetFirst || (isInitialToken(sideLast) && sideLast[0] === targetFirst[0]);
  }

  return false;
}

function apiNameMatchesPlayer(playerName: string, sideName: string) {
  return (
    apiSinglesNameMatchesPlayer(playerName, sideName) ||
    apiDoublesSideIncludesPlayer(playerName, sideName)
  );
}

function apiMatchHasPlayerBySinglesName(playerName: string, match: ApiTennisMatch) {
  return [match.event_first_player, match.event_second_player].some((sideName) =>
    apiSinglesNameMatchesPlayer(playerName, sideName || "")
  );
}

function apiMatchHasPlayerByContextualDoublesName(
  playerName: string,
  match: ApiTennisMatch,
  exactPlayerTournaments: Set<string>
) {
  const tournament = String(match.tournament_name || "").trim();
  if (!tournament || !exactPlayerTournaments.has(tournament)) return false;

  return [match.event_first_player, match.event_second_player].some((sideName) =>
    apiDoublesSideIncludesPlayer(playerName, sideName || "")
  );
}

function normalizeApiStatusText(value?: string | null) {
  return String(value || "").toLowerCase().trim();
}

function compactApiStatus(value?: string | null) {
  return normalizeApiStatusText(value).replace(/[\s_-]+/g, "");
}

function isApiScheduledStatus(value?: string | null) {
  const status = normalizeApiStatusText(value);
  const compact = compactApiStatus(value);

  return (
    compact === "notstarted" ||
    compact === "scheduled" ||
    compact === "fixture" ||
    compact === "upcoming" ||
    status.includes("not started")
  );
}

function isApiFinishedStatus(value?: string | null) {
  const compact = compactApiStatus(value);

  return (
    compact.includes("finished") ||
    compact.includes("completed") ||
    compact.includes("complete") ||
    compact.includes("ended") ||
    compact.includes("final")
  );
}

function isApiCancelledStatus(value?: string | null) {
  const compact = compactApiStatus(value);
  return compact.includes("cancelled") || compact.includes("canceled");
}

function isApiPostponedStatus(value?: string | null) {
  const compact = compactApiStatus(value);
  return compact.includes("postponed");
}

function isApiLiveStatus(value?: string | null) {
  const status = normalizeApiStatusText(value);
  const compact = compactApiStatus(value);

  if (
    isApiScheduledStatus(value) ||
    isApiFinishedStatus(value) ||
    isApiCancelledStatus(value) ||
    isApiPostponedStatus(value)
  ) {
    return false;
  }

  return compact === "live" || compact === "inprogress" || status.includes("in progress");
}

function normalizeStatus(match: ApiTennisMatch) {
  const status = normalizeApiStatusText(match.event_status);
  const startTime = getStartTime(match);
  const startsInFuture = startTime ? new Date(startTime) > new Date() : false;

  const hasSetScore =
  match.scores?.some((set) => {
    const first = String(set.score_first ?? "").trim();
    const second = String(set.score_second ?? "").trim();

    return first !== "" && second !== "" && `${first}-${second}` !== "0-0";
  }) ?? false;

const hasScore = Boolean(
  hasSetScore ||
    (
      match.event_final_result &&
      match.event_final_result !== "-" &&
      match.event_final_result !== "0-0"
    ) ||
    (
      match.event_game_result &&
      match.event_game_result !== "-" &&
      match.event_game_result !== "0-0"
    )
);

  if (isPastUnplayedFixture(match, hasScore)) {
    return "EXPIRED";
  }

  if (isApiCancelledStatus(status)) {
    return "CANCELLED";
  }

  if (isApiFinishedStatus(status)) {
    return "FINISHED";
  }

  if (status.includes("retired") || status.includes("walkover")) {
    return "RETIRED";
  }

  if (isApiScheduledStatus(status) && !hasScore) {
    return "UPCOMING";
  }

  if (isApiPostponedStatus(status)) {
    return startsInFuture && !hasScore ? "UPCOMING" : "SUSPENDED";
  }

  if (
    startsInFuture &&
    !hasScore &&
    (
      status.includes("suspended") ||
      status.includes("interrupted") ||
      status.includes("delay") ||
      status.includes("postponed")
    )
  ) {
    return "UPCOMING";
  }

  if (
    status.includes("suspended") ||
    status.includes("interrupted") ||
    status.includes("delay") ||
    status.includes("postponed")
  ) {
    return "SUSPENDED";
  }

  if (isStaleLiveFixture(match)) {
    return hasScore ? "FINISHED" : "EXPIRED";
  }

  if (
    match.event_live === "1" ||
    isApiLiveStatus(status)
  ) {
    return "LIVE";
  }

  // API-Tennis fixtures often return past completed matches with a score but
  // without a reliable `event_status`. Treat scored past fixtures as finished
  // so player form / recent results pages do not look empty for active players.
  if (hasScore) {
    return startsInFuture ? "SUSPENDED" : "FINISHED";
  }

// fixtures without official time yet
if (
  !status ||
  isApiScheduledStatus(status)
) {
  return "UPCOMING";
}

return "UPCOMING";
}

function normalizePointToken(value: string) {
  const token = value.trim().toUpperCase().replace(/\.$/, "");

  if (!token) return null;
  if (["0", "00", "LOVE"].includes(token)) return "0";
  if (["15", "30", "40"].includes(token)) return token;
  if (["A", "AD", "ADV", "ADVANTAGE"].includes(token)) return "ADV";

  return null;
}

function normalizePointScoreValue(value?: string | null) {
  const raw = String(value || "").trim();
  if (!raw || raw === "-" || raw === "0-0" || raw === "0 - 0") return null;

  if (/^deuce$/i.test(raw)) return "Deuce";

  const parts = raw.split(/\s*[-:]\s*/);
  if (parts.length !== 2) return null;

  const first = normalizePointToken(parts[0]);
  const second = normalizePointToken(parts[1]);

  if (!first || !second) return null;
  if (first === "40" && second === "40") return "Deuce";

  return `${first}-${second}`;
}

function isCompletedPointByPointGame(game: NonNullable<ApiTennisMatch["pointbypoint"]>[number]) {
  return Boolean(
    String(game.serve_winner || "").trim() ||
      String(game.serve_lost || "").trim()
  );
}

function parseScoreNumber(value?: string | null) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);

  return Number.isFinite(parsed) ? parsed : null;
}

function getCurrentSetScore(match: ApiTennisMatch) {
  const sets = match.scores || [];

  for (let index = sets.length - 1; index >= 0; index -= 1) {
    const first = parseScoreNumber(sets[index]?.score_first);
    const second = parseScoreNumber(sets[index]?.score_second);
    const setNumber = parseScoreNumber(sets[index]?.score_set) ?? index + 1;

    if (first === null || second === null) continue;

    return { first, second, setNumber };
  }

  return null;
}

function getExpectedCurrentGame(match: ApiTennisMatch) {
  const currentSet = getCurrentSetScore(match);

  if (!currentSet) return null;

  return {
    setNumber: currentSet.setNumber,
    gameNumber: currentSet.first + currentSet.second + 1,
  };
}

function getPointScoreFromGame(
  game: NonNullable<ApiTennisMatch["pointbypoint"]>[number]
) {
  const points = game.points || [];

  for (let pointIndex = points.length - 1; pointIndex >= 0; pointIndex -= 1) {
    const pointScore = normalizePointScoreValue(points[pointIndex]?.score);
    if (pointScore) return pointScore;
  }

  return normalizePointScoreValue(game.score);
}

function getLatestLivePointByPointScore(match: ApiTennisMatch) {
  const games = match.pointbypoint || [];
  const expectedCurrentGame = getExpectedCurrentGame(match);

  if (!games.length) return null;

  const sortedGames = [...games].sort((left, right) => {
    const leftSet = parseScoreNumber(left.set_number) ?? 0;
    const rightSet = parseScoreNumber(right.set_number) ?? 0;
    const leftGame = parseScoreNumber(left.number_game) ?? 0;
    const rightGame = parseScoreNumber(right.number_game) ?? 0;

    if (leftSet !== rightSet) return rightSet - leftSet;
    return rightGame - leftGame;
  });

  const openGames = sortedGames.filter((game) => !isCompletedPointByPointGame(game));

  // Best case: API exposes an unfinished point-by-point item for the current game.
  // API-Tennis can number the active game as either current games sum or sum + 1,
  // depending on the endpoint/update phase, so accept a small window instead of
  // cutting points completely.
  if (expectedCurrentGame) {
    const candidate = openGames.find((game) => {
      const setNumber = parseScoreNumber(game.set_number);
      const gameNumber = parseScoreNumber(game.number_game);

      return (
        setNumber === expectedCurrentGame.setNumber &&
        gameNumber !== null &&
        Math.abs(gameNumber - expectedCurrentGame.gameNumber) <= 1
      );
    });

    const candidateScore = candidate ? getPointScoreFromGame(candidate) : null;
    if (candidateScore) return candidateScore;
  }

  // Fallback: use the latest unfinished live game. This keeps points enabled when
  // the REST payload does not include enough set/game metadata to match exactly,
  // while still avoiding clearly completed stale games.
  for (const game of openGames) {
    const pointScore = getPointScoreFromGame(game);
    if (pointScore) return pointScore;
  }

  return null;
}

function getDirectLivePointScore(match: ApiTennisMatch) {
  const possibleValues = [
    // API-Tennis commonly exposes the active 15/30/40 score here.
    // Do not use this field as the match/set score when `scores` exists;
    // for live matches it is the current game point score.
    match.event_game_result,
    match.event_point_result,
    match.event_current_result,
    match.event_live_score,
  ];

  for (const value of possibleValues) {
    const pointScore = normalizePointScoreValue(value);
    if (pointScore) return pointScore;
  }

  return null;
}

function formatPointScore(match: ApiTennisMatch) {
  if (normalizeStatus(match) !== "LIVE") return null;

  const directLivePointScore = getDirectLivePointScore(match);
  if (directLivePointScore) return directLivePointScore;

  const livePointByPointScore = getLatestLivePointByPointScore(match);
  if (livePointByPointScore) return livePointByPointScore;

  return null;
}


function formatSetScorePart(value?: string | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return { games: "", tiebreak: "" };

  const [games, tiebreak] = raw.split(".");

  return {
    games: games || raw,
    tiebreak: tiebreak || "",
  };
}

function formatSetScore(firstValue?: string | null, secondValue?: string | null) {
  const first = formatSetScorePart(firstValue);
  const second = formatSetScorePart(secondValue);

  if (!first.games || !second.games) return null;

  const baseScore = `${first.games}-${second.games}`;

  if (first.tiebreak || second.tiebreak) {
    return `${baseScore} (${first.tiebreak || "0"}-${second.tiebreak || "0"})`;
  }

  return baseScore;
}

function formatScore(match: ApiTennisMatch) {
  if (match.scores && match.scores.length > 0) {
    const setScores = match.scores
      .map((set) => formatSetScore(set.score_first, set.score_second))
      .filter(Boolean);

    if (setScores.length > 0) {
      return setScores.join(", ");
    }
  }

  if (match.event_final_result && match.event_final_result !== "-") {
    return match.event_final_result;
  }

  if (match.event_game_result && match.event_game_result !== "-") {
    return match.event_game_result;
  }

  return "-";
}

function getStartTime(match: ApiTennisMatch) {
  if (!match.event_date || !match.event_time) return null;

  return `${match.event_date}T${match.event_time}:00`;
}

function normalizeParticipantName(value?: string | null) {
  const name = String(value || "").trim();
  const normalized = normalizeSearchName(name);

  if (
    !normalized ||
    normalized === "tbd" ||
    normalized === "tba" ||
    normalized === "unknown player" ||
    normalized === "opponent to be confirmed"
  ) {
    return "Opponent to be confirmed";
  }

  return name;
}

function getFixtureAgeMs(match: ApiTennisMatch) {
  const startTime = getStartTime(match);
  if (!startTime) return 0;

  const startDate = new Date(startTime);
  if (Number.isNaN(startDate.getTime())) return 0;

  return Date.now() - startDate.getTime();
}

function isPastUnplayedFixture(match: ApiTennisMatch, hasScore: boolean) {
  if (hasScore || match.event_live === "1") return false;

  // API-Tennis sometimes keeps old fixtures as Scheduled/Upcoming even after the
  // match has finished or disappeared from the live feed. Hide those stale rows
  // instead of showing dead tournament cards. Tennis delays can be long, so this
  // window is intentionally generous.
  const staleAfterMs = 12 * 60 * 60 * 1000;

  return getFixtureAgeMs(match) > staleAfterMs;
}

function isStaleLiveFixture(match: ApiTennisMatch) {
  const status = normalizeApiStatusText(match.event_status);
  const looksLive =
    match.event_live === "1" ||
    isApiLiveStatus(status);

  if (!looksLive) return false;

  // Defensive guard for API-Tennis/live endpoint stale rows. If a fixture started
  // many hours ago, do not let it keep poisoning retention pages as LIVE.
  const staleAfterMs = 8 * 60 * 60 * 1000;
  return getFixtureAgeMs(match) > staleAfterMs;
}

function isGrandSlamTournament(tournament: string) {
  const name = tournament.toLowerCase();

  return (
    name.includes("roland") ||
    name.includes("french open") ||
    name.includes("wimbledon") ||
    name.includes("us open") ||
    name.includes("australian open")
  );
}

function getGrandSlamWatchProviders(tournament: string) {
  const name = tournament.toLowerCase();

  if (name.includes("roland") || name.includes("french open")) {
    return [
      {
        name: "Roland-Garros official site",
        url: "https://www.rolandgarros.com/en-us/broadcasters",
        accessType: "REGION_DEPENDENT",
        verificationStatus: "TOURNAMENT_VERIFIED",
        note: "Grand Slam rights are separate from Tennis TV. Check the official Roland-Garros broadcaster list for your country.",
      },
      {
        name: "France TV / Eurosport where available",
        url: "https://www.rolandgarros.com/en-us/broadcasters",
        accessType: "REGION_DEPENDENT",
        verificationStatus: "TOURNAMENT_VERIFIED",
        note: "French Open coverage depends on your location and local broadcaster rights.",
      },
    ];
  }

  if (name.includes("wimbledon")) {
    return [
      {
        name: "Wimbledon official broadcasters",
        url: "https://www.wimbledon.com/en_GB/atoz/tv_schedules.html",
        accessType: "REGION_DEPENDENT",
        verificationStatus: "TOURNAMENT_VERIFIED",
        note: "Wimbledon is a Grand Slam and is not included with Tennis TV. Check official broadcaster availability by region.",
      },
    ];
  }

  return [
    {
      name: "Official Grand Slam broadcaster list",
      url: "https://www.itftennis.com/en/about-us/organisation/about-the-itf/grand-slams/",
      accessType: "REGION_DEPENDENT",
      verificationStatus: "TOURNAMENT_VERIFIED",
      note: "Grand Slam streaming rights are sold separately from Tennis TV and vary by country.",
    },
  ];
}

function getWatchProviders(category: string, tournament: string) {
  const tournamentLower = tournament.toLowerCase();

  if (isGrandSlamTournament(tournament)) {
    return getGrandSlamWatchProviders(tournament);
  }

  if (category === "ATP" && !tournamentLower.includes("challenger")) {
    return [
      {
        name: "Tennis TV",
        url: "https://www.tennistv.com/live-schedule",
        accessType: "PAID",
        verificationStatus: "TOUR_VERIFIED",
        note: "Official ATP Tour streaming schedule. Grand Slam matches are not included.",
      },
      {
        name: "ATP TV Schedule",
        url: "https://www.atptour.com/en/tournaments/tv-schedule",
        accessType: "REGION_DEPENDENT",
        verificationStatus: "TOUR_VERIFIED",
        note: "Official ATP broadcaster schedule for ATP Tour events, excluding Grand Slams.",
      },
    ];
  }

  if (category === "CHALLENGER") {
    return [
      {
        name: "ATP Challenger TV",
        url: "https://www.atptour.com/en/atp-challenger-tour/challenger-tv",
        accessType: "FREE_OR_SIGNUP",
        verificationStatus: "TOUR_VERIFIED",
        note: "Official ATP Challenger streaming source.",
      },
    ];
  }

  if (category === "ITF") {
    return [
      {
        name: "ITF World Tennis Tour Live",
        url: "https://www.itftennis.com/en/world-tennis-tour-live/",
        accessType: "FREE_OR_SIGNUP",
        verificationStatus: "TOUR_VERIFIED",
        note: "Official ITF World Tennis Tour live scores and streams.",
      },
    ];
  }

  if (category === "WTA") {
    return [
      {
        name: "WTA Where to Watch",
        url: "https://www.wtatennis.com/where-to-watch-tennis",
        accessType: "REGION_DEPENDENT",
        verificationStatus: "TOUR_VERIFIED",
        note: "Official WTA broadcaster directory. Exact match should be checked by region.",
      },
    ];
  }

  return [];
}

async function fetchApiTennisResult(method: string, apiKey: string, params = "", timeoutMs = 4500) {
  const url = `https://api.api-tennis.com/tennis/?method=${method}&APIkey=${apiKey}${params}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    });

    const text = await response.text();
    const payloadSize = getPayloadSizeBytes(text);
    logApiTennisRequest(method, payloadSize, Date.now() - startedAt);

    if (!response.ok) {
      // API-Tennis intermittently returns 5xx for valid fixture queries. The
      // route still returns a healthy 200 with cached/archive fallbacks, so do
      // not turn expected provider outages into noisy Vercel warnings.
      if (process.env.DEBUG_API_TENNIS === "1") {
        console.info(`API-Tennis ${method} unavailable (${response.status})`);
      }
      return null;
    }

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.warn("API-Tennis returned invalid JSON");
      return null;
    }

    if (data.success !== 1) {
      return null;
    }

    return data.result ?? null;
  } catch (error) {
    const message = error instanceof Error ? error.name : "unknown";

    // AbortError is our own timeout guard, not a broken deployment. Keep it
    // silent so normal 200 responses do not flood Vercel warnings.
    if (message !== "AbortError") {
      console.warn(`API-Tennis ${method} fetch skipped (${message})`);
    }

    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchApiTennis(method: string, apiKey: string, params = "", timeoutMs = 4500) {
  const result = await fetchApiTennisResult(method, apiKey, params, timeoutMs);

  return Array.isArray(result) ? result : [];
}

function getPlayerNameScore(apiNameRaw: string, targetNameRaw: string) {
  const apiParts = normalizeSearchName(apiNameRaw).split(/\s+/).filter(Boolean);
  const targetParts = normalizeSearchName(targetNameRaw).split(/\s+/).filter(Boolean);

  if (!apiParts.length || !targetParts.length) return 0;

  const apiName = apiParts.join(" ");
  const targetName = targetParts.join(" ");
  const apiFirst = apiParts[0] || "";
  const apiLast = apiParts.at(-1) || "";
  const targetFirst = targetParts[0] || "";
  const targetLast = targetParts.at(-1) || "";

  if (apiName === targetName) return 100;
  if (apiName.includes(targetName) || targetName.includes(apiName)) return 90;

  // API-Tennis player search commonly returns abbreviated or reversed display
  // names, for example "Zverev A." or "Zverev Alexander" for
  // "Alexander Zverev". The old scorer rejected those because the last token was
  // "a" / "alexander" instead of "zverev", so player_key stayed null and the
  // form tracker could only scan a thin global fixture slice. Resolve those keys.
  const apiLooksReversed = apiFirst === targetLast;
  if (apiLooksReversed) {
    if (apiLast === targetFirst) return 95;
    if (apiLast && targetFirst && isInitialToken(apiLast) && apiLast[0] === targetFirst[0]) return 92;
    return 60;
  }

  if (apiLast !== targetLast) return 0;

  if (apiFirst && targetFirst && apiFirst === targetFirst) return 85;
  if (apiFirst && targetFirst && apiFirst[0] === targetFirst[0]) return 75;

  // Last-name-only is weak. Use it only if the API gives no stronger option.
  return 30;
}

async function getPlayerKeyByName(apiKey: string, playerName: string) {
  const parts = playerName.trim().split(/\s+/).filter(Boolean);
  const lastName = parts[parts.length - 1] || playerName;

  const queryResults = await Promise.allSettled([
    fetchApiTennis(
      "get_players",
      apiKey,
      `&player_name=${encodeURIComponent(playerName)}`,
      9000
    ),
    fetchApiTennis(
      "get_players",
      apiKey,
      `&player_name=${encodeURIComponent(lastName)}`,
      9000
    ),
  ]);

  const players = queryResults.flatMap((result) =>
    result.status === "fulfilled" ? result.value : []
  );

  const scoredPlayers = players
    .map((player: ApiTennisPlayer) => ({
      player,
      score: getPlayerNameScore(String(player.player_name || ""), playerName),
    }))
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score);

  const best = scoredPlayers[0]?.player;

  return best?.player_key ? String(best.player_key) : null;
}

async function getArchivedMatches(dateStart: string, limit = 2500) {
  try {
    const { data, error } = await supabase
      .from("match_archive")
      .select("id, player1, player2, tournament, category, status, score, start_time, watch_providers")
      .gte("start_time", `${dateStart}T00:00:00.000Z`)
      .order("start_time", { ascending: false })
      .limit(limit);

    if (error || !Array.isArray(data)) {
      if (error) console.warn("match_archive fallback unavailable:", error.message);
      return [];
    }

    return (data as ArchivedMatchRow[]).map((match) => ({
      id: String(match.id),
      player1: match.player1 || "Unknown player",
      player2: match.player2 || "Unknown player",
      tournament: match.tournament || "Unknown tournament",
      category: match.category || "UNKNOWN",
      status: match.status || "FINISHED",
      score: match.score || "",
      pointScore: "",
      startTime: match.start_time || "",
      winner: null,
      winnerId: null,
      watchProviders: match.watch_providers || [],
    }));
  } catch (error) {
    console.warn("match_archive fallback skipped:", error);
    return [];
  }
}

async function getArchivedMatchesForPlayer(playerName: string, dateStart: string) {
  try {
    const { data, error } = await supabase
      .from("match_archive")
      .select("id, player1, player2, tournament, category, status, score, start_time, watch_providers")
      .gte("start_time", `${dateStart}T00:00:00.000Z`)
      .order("start_time", { ascending: false })
      .limit(5000);

    if (error || !Array.isArray(data)) {
      if (error) console.warn("match_archive lookup failed:", error.message);
      return [];
    }

    return (data as ArchivedMatchRow[])
      .filter((match) =>
        [match.player1, match.player2].some((sideName) =>
          apiSinglesNameMatchesPlayer(playerName, String(sideName || ""))
        )
      )
      .map((match) => ({
        id: String(match.id),
        player1: match.player1 || "Unknown player",
        player2: match.player2 || "Unknown player",
        tournament: match.tournament || "Unknown tournament",
        category: match.category || "UNKNOWN",
        status: match.status || "FINISHED",
        score: match.score || "",
        pointScore: "",
        startTime: match.start_time || "",
        winner: null,
        winnerId: null,
        watchProviders: match.watch_providers || [],
      }));
  } catch (error) {
    console.warn("match_archive lookup skipped:", error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const playerKeyFromQuery = searchParams.get("playerKey");
  const playerName = searchParams.get("playerName");
  const matchId = searchParams.get("matchId");
  const includeFinished = searchParams.get("includeFinished") === "1";
  const formHistory = searchParams.get("formHistory") === "1";
  const daysBack = Number.parseInt(searchParams.get("daysBack") || "3", 10);
  const daysForward = Number.parseInt(searchParams.get("daysForward") || "30", 10);
  const logFilters = shouldLogMatchFilters(searchParams);

  const apiKey = process.env.API_TENNIS_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { matches: [], error: "API key is missing" },
      { status: 200 }
    );
  }

  const resolvedPlayerKey =
    playerKeyFromQuery ||
    (playerName ? await getPlayerKeyByName(apiKey, playerName) : null);

const today = new Date();

const maxDaysBack = matchId ? 7 : playerName || resolvedPlayerKey || formHistory ? 30 : 3;
const maxDaysForward = matchId ? 7 : playerName || resolvedPlayerKey || formHistory ? 30 : 3;
const defaultDaysBack = matchId ? 1 : 3;
const defaultDaysForward = matchId ? 7 : playerName || resolvedPlayerKey || formHistory ? 30 : 3;
const safeDaysBack = Number.isFinite(daysBack) ? Math.min(Math.max(daysBack, 0), maxDaysBack) : defaultDaysBack;
const safeDaysForward = Number.isFinite(daysForward) ? Math.min(Math.max(daysForward, 1), maxDaysForward) : defaultDaysForward;

const dateStartDate = new Date();
dateStartDate.setDate(today.getDate() - safeDaysBack);

const dateStopDate = new Date();
dateStopDate.setDate(today.getDate() + safeDaysForward);

const dateStart = formatDate(dateStartDate);
const dateStop = formatDate(dateStopDate);

  logMatchFilters(logFilters, "request", {
    playerName,
    playerKeyFromQuery,
    resolvedPlayerKey,
    matchId,
    includeFinished,
    formHistory,
    requestedDaysBack: daysBack,
    requestedDaysForward: daysForward,
    safeDaysBack,
    safeDaysForward,
    dateStart,
    dateStop,
  });

  try {
    const cacheBust = `&_=${Date.now()}`;

    const [liveMatches, fixtureMatches] = await Promise.all([
  fetchApiTennis(
    "get_livescore",
    apiKey,
    matchId
      ? `&match_key=${encodeURIComponent(matchId)}&timezone=Europe/Warsaw${cacheBust}`
      : resolvedPlayerKey
        ? `&player_key=${resolvedPlayerKey}&timezone=Europe/Warsaw${cacheBust}`
        : `&timezone=Europe/Warsaw${cacheBust}`
  ),
  // API-Tennis can silently return a very small slice when the fixture date range
  // is too wide. Player Form needs a real history window, so split the requested
  // range into smaller chunks and merge them. This is especially important for
  // pages like Andrey Rublev where the latest Match Center row exists but earlier
  // wins disappear from a single broad request.
  fetchFixtureWindows(apiKey, dateStartDate, dateStopDate, resolvedPlayerKey, { formHistory, playerName }),
]);

    const h2hRecentMatches = formHistory && playerName && resolvedPlayerKey
      ? await fetchPlayerRecentResultsFromH2H(apiKey, resolvedPlayerKey, playerName, [...fixtureMatches, ...liveMatches])
      : [];

    // Important: the live endpoint contains the freshest point-by-point payload.
    // Fixtures can contain the same event_key with older/limited data, so merge historical/H2H
    // rows first and live matches last. That lets the live match object win in the Map below.
    const allMatches: ApiTennisMatch[] = [...h2hRecentMatches, ...fixtureMatches, ...liveMatches];
    logMatchFilters(logFilters, "api-returned", {
      liveMatches: liveMatches.length,
      fixtureMatches: fixtureMatches.length,
      h2hRecentMatches: h2hRecentMatches.length,
      totalBeforeDedupe: allMatches.length,
      samples: allMatches.slice(0, 20).map((match) => matchDebugLabel(match)),
    });

    const uniqueMatches = Array.from(
      new Map(allMatches.map((match) => [String(match.event_key), match])).values()
    );
    logMatchFilters(logFilters, "after-dedupe", {
      count: uniqueMatches.length,
      removed: allMatches.length - uniqueMatches.length,
    });

    const exactPlayerMatches = playerName
      ? uniqueMatches.filter((match) => apiMatchHasPlayerBySinglesName(playerName, match))
      : [];
    const exactPlayerTournaments = new Set(
      exactPlayerMatches
        .map((match) => String(match.tournament_name || "").trim())
        .filter(Boolean)
    );
    const filteredMatches = playerName
      ? uniqueMatches.filter((match) =>
          apiMatchHasPlayerBySinglesName(playerName, match) ||
          apiMatchHasPlayerByContextualDoublesName(playerName, match, exactPlayerTournaments)
        )
      : uniqueMatches;
    logMatchFilters(logFilters, "after-player-filter", {
      count: filteredMatches.length,
      removed: uniqueMatches.length - filteredMatches.length,
    });
    if (logFilters && playerName) {
      uniqueMatches
        .filter((match) => !filteredMatches.includes(match))
        .forEach((match) => {
          logMatchFilters(logFilters, "excluded-by-player-filter", {
            reason: "player-name-mismatch",
            match: matchDebugLabel(match),
            target: playerName,
            player1Matches: apiNameMatchesPlayer(playerName, match.event_first_player || ""),
            player2Matches: apiNameMatchesPlayer(playerName, match.event_second_player || ""),
          });
        });
    }

    let mappedMatches: MappedMatch[] = filteredMatches.map((match) => {
      const tournament = match.tournament_name || "Unknown tournament";
      const category = normalizeCategory(match.event_type_type, tournament);

      return {
        id: String(match.event_key),
        player1: normalizeParticipantName(match.event_first_player),
        player2: normalizeParticipantName(match.event_second_player),
        tournament,
        category,
        status: normalizeStatus(match),
        round: match.tournament_round || "",
        isFinal:
          (match.tournament_round || "").toLowerCase().includes("final") &&
          !(match.tournament_round || "").toLowerCase().includes("semi") &&
          Boolean(match.event_date),
        score: formatScore(match),
        pointScore: formatPointScore(match),
        startTime: getStartTime(match),
        winner: match.event_winner || match.event_winner_player || null,
        winnerId: null,
        watchProviders: getWatchProviders(category, tournament),
      };
    });
    logMatchFilters(logFilters, "after-map", {
      count: mappedMatches.length,
      samples: mappedMatches.slice(0, 20).map((match) => matchDebugLabel(match)),
    });

    if (includeFinished && playerName) {
      const beforeArchiveMerge = mappedMatches.length;
      const archivedMatches = await getArchivedMatchesForPlayer(playerName, dateStart);
      mappedMatches = Array.from(
        new Map([...mappedMatches, ...archivedMatches].map((match) => [String(match.id), match])).values()
      );
      logMatchFilters(logFilters, "after-player-archive-merge", {
        before: beforeArchiveMerge,
        archived: archivedMatches.length,
        after: mappedMatches.length,
      });
    }

    if (includeFinished && formHistory && !playerName && !resolvedPlayerKey) {
      // Player pages can request a broad history scan and then filter locally by
      // normalized player name. Merge the archive even when the live API returns
      // rows, otherwise form widgets can stay stuck at a single current-tournament
      // match for players with known archived results.
      const beforeArchiveMerge = mappedMatches.length;
      const archivedMatches = await getArchivedMatches(dateStart, 5000);
      mappedMatches = Array.from(
        new Map([...mappedMatches, ...archivedMatches].map((match) => [String(match.id), match])).values()
      );
      logMatchFilters(logFilters, "after-form-archive-merge", {
        before: beforeArchiveMerge,
        archived: archivedMatches.length,
        after: mappedMatches.length,
      });
    }

    // Only fall back to the general archive for the global matches feed.
    // For player-specific requests, returning all archived matches can create
    // wrong player alerts, e.g. a Jannik Sinner email for an unrelated match.
    if (mappedMatches.length === 0 && !playerName && !resolvedPlayerKey) {
      mappedMatches = await getArchivedMatches(dateStart);
      logMatchFilters(logFilters, "after-global-archive-fallback", {
        count: mappedMatches.length,
      });
    }

    if (mappedMatches.length > 0 && !matchId) {
      if (safeDaysBack > 7) {
        console.warn(
          `match_archive upsert skipped: daysBack=${safeDaysBack} is too large for normal /api/matches requests`
        );
      } else {
        const recentArchiveMatches = mappedMatches.filter((match) =>
          isDateInRecentArchiveWindow(match.startTime)
        );

        if (recentArchiveMatches.length > 0) {
          const { error: archiveUpsertError } = await supabase.from("match_archive").upsert(
            recentArchiveMatches.map((match) => ({
              id: String(match.id),
              player1: match.player1,
              player2: match.player2,
              tournament: match.tournament,
              category: match.category,
              status: match.status,
              score: match.score || null,
              start_time: match.startTime || null,
              watch_providers: match.watchProviders || [],
              updated_at: new Date().toISOString(),
            })),
            {
              onConflict: "id",
            }
          );

          if (archiveUpsertError) {
            console.warn("match_archive upsert skipped:", archiveUpsertError.message);
          }
        }
      }
    }

    if (matchId) {
      return NextResponse.json(
        mappedMatches.filter((match) => String(match.id) === String(matchId)),
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            "CDN-Cache-Control": "no-store",
            "Vercel-CDN-Cache-Control": "no-store",
          },
        }
      );
    }

    const matches = mappedMatches
      .filter((match) => {
        let exclusionReason: string | null = null;

        if (match.status === "CANCELLED" || match.status === "EXPIRED") {
          exclusionReason = `status:${match.status}`;
        } else if (!includeFinished && (match.status === "FINISHED" || match.status === "RETIRED")) {
          exclusionReason = `status:${match.status}:includeFinished=false`;
        }

        if (exclusionReason) {
          logMatchFilters(logFilters, "excluded-by-final-status-filter", {
            reason: exclusionReason,
            match: matchDebugLabel(match),
          });
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.status === "LIVE" && b.status !== "LIVE") return -1;
        if (a.status !== "LIVE" && b.status === "LIVE") return 1;

        if (!a.startTime) return 1;
        if (!b.startTime) return -1;

        return (
          new Date(a.startTime).getTime() -
          new Date(b.startTime).getTime()
        );
      });
    logMatchFilters(logFilters, "after-final-status-filter", {
      before: mappedMatches.length,
      after: matches.length,
      removed: mappedMatches.length - matches.length,
      samples: matches.slice(0, 20).map((match) => matchDebugLabel(match)),
    });

    return NextResponse.json(matches, {
      headers: getMatchesCacheHeaders(matches, { realtime: Boolean(playerName || resolvedPlayerKey || includeFinished || formHistory) }),
    });
  } catch (error) {
  console.warn("Failed to fetch tennis matches:", error);

  return NextResponse.json(
    {
      matches: [],
      error: "External tennis API temporarily unavailable",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        "CDN-Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
        "Vercel-CDN-Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    }
  );
}
}
