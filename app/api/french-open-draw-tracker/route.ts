import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ApiTennisScore = {
  score_first?: string;
  score_second?: string;
  score_set?: string;
};

type ApiTennisFixture = {
  event_key?: string;
  event_date?: string;
  event_time?: string;
  event_first_player?: string;
  event_second_player?: string;
  event_final_result?: string;
  event_game_result?: string;
  event_winner?: string | null;
  event_status?: string;
  event_type_type?: string;
  tournament_name?: string;
  tournament_round?: string;
  event_live?: string;
  event_court?: string;
  scores?: ApiTennisScore[];
};

type NormalizedMatch = {
  id: string;
  tournament: string;
  round: string;
  category: string;
  player1: string;
  player2: string;
  status: "LIVE" | "Scheduled" | "Finished";
  rawStatus: string;
  score: string;
  winner: string;
  date: string;
  time: string;
  court: string;
};

type DrawTrackerMatch = {
  round: string;
  player: string;
  opponent: string;
  status: "advanced" | "live" | "upcoming" | "potential";
  result?: string;
  note?: string;
  watchHref?: string;
};

type PlayerPath = {
  id: string;
  player: string;
  seed: string;
  section: string;
  tour: "ATP" | "WTA";
  currentStatus: "Active";
  nextMatchDate?: string;
  nextMatchTime?: string;
  nextMatchStatus?: "LIVE" | "Scheduled";
  nextOpponent?: string;
  summary: string;
  matches: DrawTrackerMatch[];
};

function formatParisDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getParisDateDaysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return formatParisDate(date);
}

function getParisNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }));
}

function parseParisMatchDateTime(date?: string, time?: string) {
  if (!date) return null;

  const safeTime = time && /^\d{1,2}:\d{2}/.test(time) ? time : "23:59";
  const parsed = new Date(`${date}T${safeTime.slice(0, 5)}:00`);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isPastScheduledMatch(match: ApiTennisFixture) {
  const matchDate = parseParisMatchDateTime(match.event_date, match.event_time);

  if (!matchDate) return false;

  return matchDate.getTime() < getParisNow().getTime();
}

function normalizeName(name?: string) {
  return `${name || ""}`.replace(/\s+/g, " ").trim();
}

function playerKey(name: string) {
  return normalizeName(name).toLowerCase();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isRealPlayer(name?: string) {
  const value = normalizeName(name).toLowerCase();

  return Boolean(value) && value !== "tbd" && value !== "bye" && !value.includes("qualifier");
}

function isFrenchOpenMatch(match: ApiTennisFixture) {
  const tournament = `${match.tournament_name || ""}`.toLowerCase();

  return (
    tournament.includes("french open") ||
    tournament.includes("roland garros") ||
    tournament.includes("roland-garros") ||
    tournament.includes("roland garos") ||
    tournament.includes("garros")
  );
}

function isMainSinglesFixture(match: ApiTennisFixture) {
  const tournament = `${match.tournament_name || ""}`.toLowerCase();
  const category = `${match.event_type_type || ""}`.toLowerCase();
  const round = `${match.tournament_round || ""}`.toLowerCase();
  const combined = `${tournament} ${category} ${round}`;

  if (combined.includes("boys") || combined.includes("girls") || combined.includes("junior")) return false;
  if (combined.includes("doubles") || combined.includes("mixed")) return false;
  if (combined.includes("qualifying") || combined.includes("qualification")) return false;

  return true;
}

function getTour(category?: string): "ATP" | "WTA" {
  const value = `${category || ""}`.toUpperCase();

  return value.includes("WTA") || value.includes("WOMEN") ? "WTA" : "ATP";
}

function isFinishedStatus(status?: string) {
  const value = `${status || ""}`.toLowerCase();

  return (
    value.includes("finished") ||
    value.includes("completed") ||
    value.includes("ended") ||
    value.includes("final") ||
    value.includes("retired") ||
    value.includes("walkover") ||
    value.includes("wo")
  );
}

function isLiveStatus(match: ApiTennisFixture) {
  const status = `${match.event_status || ""}`.toLowerCase();

  return (
    match.event_live === "1" ||
    status.includes("live") ||
    status.includes("set") ||
    status.includes("game") ||
    status.includes("suspended")
  );
}

function normalizeStatus(match: ApiTennisFixture): NormalizedMatch["status"] {
  if (isLiveStatus(match)) return "LIVE";
  if (isFinishedStatus(match.event_status)) return "Finished";

  // API-Tennis can keep old fixtures without a final status. Do not treat past fixtures as upcoming.
  if (isPastScheduledMatch(match)) return "Finished";

  return "Scheduled";
}

function buildSetScore(scores?: ApiTennisScore[]) {
  if (!scores || scores.length === 0) return "";

  return scores
    .filter((set) => set.score_first || set.score_second)
    .map((set) => `${set.score_first || "0"}-${set.score_second || "0"}`)
    .join(", ");
}

function normalizeMatch(match: ApiTennisFixture): NormalizedMatch {
  return {
    id: String(match.event_key || ""),
    tournament: match.tournament_name || "French Open",
    round: match.tournament_round || "Round",
    category: [match.tournament_name, match.event_type_type].filter(Boolean).join(" "),
    player1: normalizeName(match.event_first_player) || "TBD",
    player2: normalizeName(match.event_second_player) || "TBD",
    status: normalizeStatus(match),
    rawStatus: match.event_status || "",
    score: match.event_final_result || buildSetScore(match.scores) || match.event_game_result || "",
    winner: normalizeName(match.event_winner || ""),
    date: match.event_date || "",
    time: match.event_time || "",
    court: match.event_court || "",
  };
}

function getWinningPlayer(match: NormalizedMatch) {
  const winner = playerKey(match.winner);

  if (winner && winner === playerKey(match.player1)) return match.player1;
  if (winner && winner === playerKey(match.player2)) return match.player2;
  if (winner.includes("first") || winner === "1") return match.player1;
  if (winner.includes("second") || winner === "2") return match.player2;

  const scoreNumbers = match.score.match(/\d+/g)?.map(Number) || [];

  if (scoreNumbers.length >= 2 && scoreNumbers[0] !== scoreNumbers[1]) {
    return scoreNumbers[0] > scoreNumbers[1] ? match.player1 : match.player2;
  }

  return "";
}

function getOpponent(player: string, match: NormalizedMatch) {
  return playerKey(match.player1) === playerKey(player) ? match.player2 : match.player1;
}

function matchHasPlayer(match: NormalizedMatch, player: string) {
  const key = playerKey(player);

  return playerKey(match.player1) === key || playerKey(match.player2) === key;
}

function getMatchSortTime(match?: NormalizedMatch) {
  if (!match) return Number.MAX_SAFE_INTEGER;
  if (match.status === "LIVE") return 0;

  const parsed = parseParisMatchDateTime(match.date, match.time);

  return parsed?.getTime() ?? Number.MAX_SAFE_INTEGER;
}

function buildPlayerPath(player: string, matches: NormalizedMatch[]): PlayerPath {
  const playerMatches = matches
    .filter((match) => matchHasPlayer(match, player))
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const nextMatch =
    playerMatches.find((match) => match.status === "LIVE") ||
    playerMatches.find((match) => match.status === "Scheduled");
  const previousWins = playerMatches
    .filter((match) => match.status === "Finished" && playerKey(getWinningPlayer(match)) === playerKey(player))
    .slice(-2);
  const latestTour = getTour(nextMatch?.category || playerMatches[0]?.category);
  const trackerMatches: DrawTrackerMatch[] = [
    ...previousWins.map((match) => ({
      round: match.round || "Completed",
      player,
      opponent: getOpponent(player, match),
      status: "advanced" as const,
      result: match.score || "Completed",
      note: [match.date, match.court].filter(Boolean).join(" · ") || "Completed French Open match.",
      watchHref: "/french-open-results",
    })),
  ];

  if (nextMatch) {
    trackerMatches.push({
      round: nextMatch.round || "Next",
      player,
      opponent: getOpponent(player, nextMatch),
      status: nextMatch.status === "LIVE" ? "live" : "upcoming",
      result: nextMatch.status === "LIVE" ? "Live now" : [nextMatch.date, nextMatch.time].filter(Boolean).join(" · "),
      note: nextMatch.court ? `Court: ${nextMatch.court}` : "Pulled from active Roland Garros fixtures.",
      watchHref: "/french-open",
    });
  }

  trackerMatches.push({
    round: "Path",
    player,
    opponent: "Next bracket slot after this match",
    status: "potential",
    note: "The next opponent updates when the tournament feed publishes the following round.",
    watchHref: "/french-open-order-of-play",
  });

  return {
    id: slugify(player),
    player,
    seed: nextMatch?.round || "Active player",
    section: latestTour === "WTA" ? "Women’s singles" : "Men’s singles",
    tour: latestTour,
    currentStatus: "Active",
    nextMatchDate: nextMatch?.date,
    nextMatchTime: nextMatch?.time,
    nextMatchStatus: nextMatch?.status === "LIVE" || nextMatch?.status === "Scheduled" ? nextMatch.status : undefined,
    nextOpponent: nextMatch ? getOpponent(player, nextMatch) : undefined,
    summary: `${player} is active because the fixture feed still has a live or future main-draw Roland Garros match for this player. The selector is sorted by next match urgency, not alphabetically.`,
    matches: trackerMatches,
  };
}

export async function GET() {
  try {
    const apiKey = process.env.API_TENNIS_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API_TENNIS_KEY environment variable" },
        { status: 500 },
      );
    }

    const dateStart = getParisDateDaysFromNow(-14);
    const dateStop = getParisDateDaysFromNow(14);
    const url = new URL("https://api.api-tennis.com/tennis/");
    url.searchParams.set("method", "get_fixtures");
    url.searchParams.set("APIkey", apiKey);
    url.searchParams.set("date_start", dateStart);
    url.searchParams.set("date_stop", dateStop);
    url.searchParams.set("timezone", "Europe/Paris");

    const response = await fetch(url.toString(), { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch French Open draw tracker data", status: response.status },
        { status: response.status },
      );
    }

    const data = await response.json();
    const fixtures: ApiTennisFixture[] = Array.isArray(data?.result) ? data.result : [];
    const matches = fixtures.filter((fixture) => isFrenchOpenMatch(fixture) && isMainSinglesFixture(fixture)).map(normalizeMatch);
    const activeMatches = matches.filter((match) => match.status === "LIVE" || match.status === "Scheduled");
    const activeNames = Array.from(
      new Set(
        activeMatches.flatMap((match) => [match.player1, match.player2]).filter(isRealPlayer).map(normalizeName),
      ),
    ).sort((a, b) => a.localeCompare(b));

    const activePlayers = activeNames
      .map((player) => buildPlayerPath(player, matches))
      .sort((a, b) => {
        if (a.nextMatchStatus === "LIVE" && b.nextMatchStatus !== "LIVE") return -1;
        if (b.nextMatchStatus === "LIVE" && a.nextMatchStatus !== "LIVE") return 1;

        const aNextMatch = matches.find((match) => matchHasPlayer(match, a.player) && (match.status === "LIVE" || match.status === "Scheduled"));
        const bNextMatch = matches.find((match) => matchHasPlayer(match, b.player) && (match.status === "LIVE" || match.status === "Scheduled"));

        return getMatchSortTime(aNextMatch) - getMatchSortTime(bNextMatch) || a.player.localeCompare(b.player);
      });
    const eliminatedNames = new Set<string>();

    matches
      .filter((match) => match.status === "Finished")
      .forEach((match) => {
        const winner = getWinningPlayer(match);
        const loser = winner ? getOpponent(winner, match) : "";

        if (isRealPlayer(loser) && !activeNames.some((active) => playerKey(active) === playerKey(loser))) {
          eliminatedNames.add(normalizeName(loser));
        }
      });

    return NextResponse.json({
      success: true,
      dateStart,
      dateStop,
      activeCount: activePlayers.length,
      eliminatedCount: eliminatedNames.size,
      sourceMatchCount: matches.length,
      activePlayers,
    });
  } catch (error) {
    console.error("French Open draw tracker API error:", error);

    return NextResponse.json(
      { error: "Unexpected error while loading French Open draw tracker" },
      { status: 500 },
    );
  }
}
