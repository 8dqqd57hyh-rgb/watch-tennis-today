import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

type ApiTennisMatch = {
  event_key: string;
  event_date: string;
  event_time: string;
  event_first_player: string;
  event_second_player: string;
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

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
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

async function fetchFixtureWindows(
  apiKey: string,
  dateStartDate: Date,
  dateStopDate: Date,
  resolvedPlayerKey: string | null
) {
  const windows = buildDateWindows(dateStartDate, dateStopDate);
  const fixtureResponses = await Promise.all(
    windows.map((window) =>
      fetchApiTennis(
        "get_fixtures",
        apiKey,
        `&date_start=${window.start}&date_stop=${window.stop}&timezone=Europe/Warsaw${
          resolvedPlayerKey ? `&player_key=${resolvedPlayerKey}` : ""
        }`
      )
    )
  );

  return fixtureResponses.flat();
}

function normalizeCategory(eventType?: string) {
  const value = (eventType || "").toLowerCase();

  if (value.includes("challenger")) return "CHALLENGER";
  if (value.includes("atp")) return "ATP";
  if (value.includes("wta")) return "WTA";
  if (value.includes("itf")) return "ITF";

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

function apiNameMatchesPlayer(playerName: string, sideName: string) {
  const targetParts = normalizeSearchName(playerName).split(/\s+/).filter(Boolean);
  const sideParts = normalizeSearchName(sideName).split(/\s+/).filter(Boolean);

  const targetFirst = targetParts[0] || "";
  const targetLast = targetParts[targetParts.length - 1] || "";
  const sideFirst = sideParts[0] || "";
  const sideLast = sideParts[sideParts.length - 1] || "";

  if (!targetLast || !sideLast) return false;
  if (targetParts.join(" ") === sideParts.join(" ")) return true;

  return targetLast === sideLast && (!targetFirst || !sideFirst || targetFirst[0] === sideFirst[0]);
}

function normalizeStatus(match: ApiTennisMatch) {
  const status = (match.event_status || "").toLowerCase();
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

  if (
    match.event_live === "1" ||
    status.includes("live") ||
    status.includes("in progress") ||
    status.includes("progress")
  ) {
    return "LIVE";
  }

  if (
    status.includes("finished") ||
    status.includes("ended") ||
    status.includes("complete") ||
    status.includes("final")
  ) {
    return "FINISHED";
  }

  if (status.includes("cancel")) {
    return "CANCELLED";
  }

  if (status.includes("retired") || status.includes("walkover")) {
    return "RETIRED";
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
  status.includes("scheduled") ||
  status.includes("not started")
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

function isPastUnplayedFixture(match: ApiTennisMatch, hasScore: boolean) {
  if (hasScore || match.event_live === "1") return false;

  const startTime = getStartTime(match);
  if (!startTime) return false;

  const startDate = new Date(startTime);
  if (Number.isNaN(startDate.getTime())) return false;

  // API-Tennis sometimes keeps old fixtures as Scheduled/Upcoming even after the
  // match has finished or disappeared from the live feed. Hide those stale rows
  // instead of showing dead tournament cards. Tennis delays can be long, so this
  // window is intentionally generous.
  const staleAfterMs = 12 * 60 * 60 * 1000;

  return Date.now() - startDate.getTime() > staleAfterMs;
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

async function fetchApiTennis(method: string, apiKey: string, params = "") {
  const url = `https://api.api-tennis.com/tennis/?method=${method}&APIkey=${apiKey}${params}`;

const response = await fetch(url, {
  cache: "no-store",
});

  if (!response.ok) {
  console.error(
    `API-Tennis request failed: ${method} (${response.status})`
  );

  return [];
}

  const text = await response.text();

let data;

try {
  data = JSON.parse(text);
} catch (error) {
  console.error("API-Tennis returned invalid JSON:", text.slice(0, 500));
  return [];
}

  if (data.success !== 1) {
    return [];
  }

  return Array.isArray(data.result) ? data.result : [];
}

async function getPlayerKeyByName(apiKey: string, playerName: string) {
  const parts = playerName.trim().split(/\s+/);
  const lastName = parts[parts.length - 1];

  const players = await fetchApiTennis(
    "get_players",
    apiKey,
    `&player_name=${encodeURIComponent(lastName)}`
  );

  const normalizedTarget = playerName.toLowerCase();
  const normalizedLastName = lastName.toLowerCase();

  const player = players?.find((p: any) => {
    const apiName = String(p.player_name || "").toLowerCase();

    return (
      apiName === normalizedTarget ||
      apiName.includes(normalizedTarget) ||
      apiName.includes(normalizedLastName)
    );
  });

  return player?.player_key ? String(player.player_key) : null;
}

async function getArchivedMatchesForPlayer(playerName: string, dateStart: string) {
  try {
    const { data, error } = await supabase
      .from("match_archive")
      .select("id, player1, player2, tournament, category, status, score, start_time, watch_providers")
      .gte("start_time", `${dateStart}T00:00:00.000Z`)
      .order("start_time", { ascending: false })
      .limit(600);

    if (error || !Array.isArray(data)) {
      if (error) console.error("match_archive lookup failed:", error.message);
      return [];
    }

    return data
      .filter((match: any) =>
        [match.player1, match.player2].some((sideName) =>
          apiNameMatchesPlayer(playerName, String(sideName || ""))
        )
      )
      .map((match: any) => ({
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
    console.error("match_archive lookup crashed:", error);
    return [];
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const playerKeyFromQuery = searchParams.get("playerKey");
  const playerName = searchParams.get("playerName");
  const matchId = searchParams.get("matchId");
  const includeFinished = searchParams.get("includeFinished") === "1";
  const daysBack = Number.parseInt(searchParams.get("daysBack") || "3", 10);
  const daysForward = Number.parseInt(searchParams.get("daysForward") || "30", 10);

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

const safeDaysBack = Number.isFinite(daysBack) ? Math.min(Math.max(daysBack, 0), 120) : 3;
const safeDaysForward = Number.isFinite(daysForward) ? Math.min(Math.max(daysForward, 1), 90) : 30;

const dateStartDate = new Date();
dateStartDate.setDate(today.getDate() - safeDaysBack);

const dateStopDate = new Date();
dateStopDate.setDate(today.getDate() + safeDaysForward);

const dateStart = formatDate(dateStartDate);
const dateStop = formatDate(dateStopDate);

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
  // wins disappear from a single 120-day request.
  fetchFixtureWindows(apiKey, dateStartDate, dateStopDate, resolvedPlayerKey),
]);

    // Important: the live endpoint contains the freshest point-by-point payload.
    // Fixtures can contain the same event_key with older/limited data, so merge fixtures first
    // and live matches last. That lets the live match object win in the Map below.
    const allMatches: ApiTennisMatch[] = [...fixtureMatches, ...liveMatches];
    if (allMatches.length === 0) {
 
}

    const uniqueMatches = Array.from(
      new Map(allMatches.map((match) => [String(match.event_key), match])).values()
    );

    const filteredMatches = playerName
      ? uniqueMatches.filter((match) =>
          [match.event_first_player, match.event_second_player].some((sideName) =>
            apiNameMatchesPlayer(playerName, sideName || "")
          )
        )
      : uniqueMatches;

    let mappedMatches: any[] = filteredMatches.map((match) => {
      const category = normalizeCategory(match.event_type_type);
      const tournament = match.tournament_name || "Unknown tournament";

      return {
        id: String(match.event_key),
        player1: match.event_first_player || "Unknown player",
        player2: match.event_second_player || "Unknown player",
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

    if (includeFinished && playerName) {
      const archivedMatches = await getArchivedMatchesForPlayer(playerName, dateStart);
      mappedMatches = Array.from(
        new Map([...mappedMatches, ...archivedMatches].map((match) => [String(match.id), match])).values()
      );
    }

    await supabase.from("match_archive").upsert(
      mappedMatches.map((match) => ({
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
        if (match.status === "CANCELLED" || match.status === "EXPIRED") return false;
        if (includeFinished) return true;

        return match.status !== "FINISHED" && match.status !== "RETIRED";
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

    return NextResponse.json(matches, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    });
  } catch (error) {
  console.error("Failed to fetch tennis matches:", error);

  return NextResponse.json(
    {
      matches: [],
      error: "External tennis API temporarily unavailable",
    },
    { status: 200 }
  );
}
}
