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
  tournament_key?: string;
  tournament_round?: string;
  tournament_season?: string;
  event_live?: string;
  event_qualification?: string;
  event_court?: string;
  scores?: ApiTennisScore[];
};

type RecapMatch = {
  id: string;
  tournament: string;
  tournamentKey: string;
  round: string;
  season: string;
  category: string;
  player1: string;
  player2: string;
  status: string;
  rawStatus: string;
  score: string;
  setScore: string;
  winner: string;
  date: string;
  time: string;
  startTime: string;
  qualification: string;
  court: string;
  scores: ApiTennisScore[];
  setCount: number;
  isLongMatch: boolean;
  isRetirementOrWalkover: boolean;
};

type AdvancementSummary = {
  id: string;
  category: string;
  round: string;
  winner: string;
  eliminated: string;
  score: string;
  nextOpponent: string;
  nextMatchRound: string;
  nextMatchDate: string;
};

function getParisDateDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addDaysToDate(value: string, days: number) {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
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

function isRetirementOrWalkover(status?: string) {
  const value = `${status || ""}`.toLowerCase();

  return (
    value.includes("retired") ||
    value.includes("walkover") ||
    value.includes("wo") ||
    value.includes("ret.")
  );
}

function buildSetScore(scores?: ApiTennisScore[]) {
  if (!scores || scores.length === 0) return "";

  return scores
    .filter((set) => set.score_first || set.score_second)
    .map((set) => `${set.score_first || "0"}-${set.score_second || "0"}`)
    .join(", ");
}

function normalizeMatch(match: ApiTennisFixture): RecapMatch {
  const scores = Array.isArray(match.scores) ? match.scores : [];
  const setScore = buildSetScore(scores);
  const rawStatus = match.event_status || "";
  const category = match.event_type_type || "";
  const setCount = scores.length;
  const isBestOfFive = category.toUpperCase().includes("ATP");
  const isLongMatch = isBestOfFive ? setCount >= 5 : setCount >= 3;

  return {
    id: String(match.event_key || ""),
    tournament: match.tournament_name || "French Open",
    tournamentKey: match.tournament_key || "",
    round: match.tournament_round || "",
    season: match.tournament_season || "",
    category,
    player1: match.event_first_player || "TBD",
    player2: match.event_second_player || "TBD",
    status: isFinishedStatus(rawStatus) ? "Finished" : rawStatus || "Completed",
    rawStatus,
    score:
      match.event_final_result ||
      setScore ||
      match.event_game_result ||
      "Score not available",
    setScore,
    winner: match.event_winner || "",
    date: match.event_date || "",
    time: match.event_time || "",
    startTime:
      match.event_date && match.event_time
        ? `${match.event_date}T${match.event_time}:00`
        : "",
    qualification: match.event_qualification || "",
    court: match.event_court || "",
    scores,
    setCount,
    isLongMatch,
    isRetirementOrWalkover: isRetirementOrWalkover(rawStatus),
  };
}

function buildStorylines(matches: RecapMatch[]) {
  const completedCount = matches.length;
  const menCount = matches.filter((match) =>
    match.category.toUpperCase().includes("ATP"),
  ).length;
  const womenCount = matches.filter((match) =>
    match.category.toUpperCase().includes("WTA"),
  ).length;
  const longMatches = matches.filter((match) => match.isLongMatch);
  const retirements = matches.filter((match) => match.isRetirementOrWalkover);

  const storylines = [
    completedCount > 0
      ? `${completedCount} completed Roland Garros matches were found for the previous tournament day.`
      : "No completed Roland Garros matches were found for the previous tournament day.",
    menCount || womenCount
      ? `${menCount} men’s matches and ${womenCount} women’s matches are listed in the available data.`
      : "The available data does not split matches clearly by men’s and women’s draw.",
  ];

  if (longMatches.length > 0) {
    storylines.push(
      `${longMatches.length} match${longMatches.length === 1 ? "" : "es"} went the distance based on the set scores.`,
    );
  }

  if (retirements.length > 0) {
    storylines.push(
      `${retirements.length} match${retirements.length === 1 ? "" : "es"} ended by retirement or walkover.`,
    );
  }

  return storylines;
}

function getWinningSide(match: RecapMatch) {
  const value = `${match.winner || ""}`.toLowerCase();

  if (
    value.includes("first") ||
    value === "1" ||
    value === match.player1.toLowerCase()
  ) {
    return "first";
  }

  if (
    value.includes("second") ||
    value === "2" ||
    value === match.player2.toLowerCase()
  ) {
    return "second";
  }

  const [firstScore, secondScore] = match.score
    .split("-")
    .map((part) => Number(part.trim()));

  if (Number.isFinite(firstScore) && Number.isFinite(secondScore)) {
    return firstScore > secondScore ? "first" : "second";
  }

  return null;
}

function normalizeParticipantName(name: string) {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

function findNextMatchForPlayer(player: string, upcomingMatches: RecapMatch[]) {
  const normalizedPlayer = normalizeParticipantName(player);

  return upcomingMatches.find((match) => {
    const first = normalizeParticipantName(match.player1);
    const second = normalizeParticipantName(match.player2);

    return first === normalizedPlayer || second === normalizedPlayer;
  });
}

function getOpponentForPlayer(player: string, match: RecapMatch) {
  const normalizedPlayer = normalizeParticipantName(player);

  if (normalizeParticipantName(match.player1) === normalizedPlayer)
    return match.player2;
  if (normalizeParticipantName(match.player2) === normalizedPlayer)
    return match.player1;

  return "TBD";
}

function buildAdvancementSummaries(
  matches: RecapMatch[],
  upcomingMatches: RecapMatch[],
) {
  return matches
    .map((match): AdvancementSummary | null => {
      const winningSide = getWinningSide(match);

      if (!winningSide) return null;

      const winner = winningSide === "first" ? match.player1 : match.player2;
      const eliminated =
        winningSide === "first" ? match.player2 : match.player1;
      const nextMatch = findNextMatchForPlayer(winner, upcomingMatches);

      return {
        id: match.id,
        category: match.category,
        round: match.round,
        winner,
        eliminated,
        score: match.setScore || match.score,
        nextOpponent: nextMatch
          ? getOpponentForPlayer(winner, nextMatch)
          : "TBD",
        nextMatchRound: nextMatch?.round || "Next round",
        nextMatchDate: [nextMatch?.date, nextMatch?.time]
          .filter(Boolean)
          .join(" · "),
      };
    })
    .filter((item): item is AdvancementSummary => Boolean(item))
    .slice(0, 18);
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

    const recapDate = getParisDateDaysAgo(1);
    const nextDateStart = addDaysToDate(recapDate, 1);
    const nextDateStop = addDaysToDate(recapDate, 7);

    const url = new URL("https://api.api-tennis.com/tennis/");
    url.searchParams.set("method", "get_fixtures");
    url.searchParams.set("APIkey", apiKey);
    url.searchParams.set("date_start", recapDate);
    url.searchParams.set("date_stop", recapDate);
    url.searchParams.set("timezone", "Europe/Paris");

    const response = await fetch(url.toString(), { cache: "no-store" });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch Roland Garros recap data",
          status: response.status,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    const fixtures: ApiTennisFixture[] = Array.isArray(data?.result)
      ? data.result
      : [];

    const matches = fixtures
      .filter(isFrenchOpenMatch)
      .filter((match) => isFinishedStatus(match.event_status))
      .map(normalizeMatch)
      .sort((a, b) =>
        `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
      );

    const upcomingUrl = new URL("https://api.api-tennis.com/tennis/");
    upcomingUrl.searchParams.set("method", "get_fixtures");
    upcomingUrl.searchParams.set("APIkey", apiKey);
    upcomingUrl.searchParams.set("date_start", nextDateStart);
    upcomingUrl.searchParams.set("date_stop", nextDateStop);
    upcomingUrl.searchParams.set("timezone", "Europe/Paris");

    let upcomingMatches: RecapMatch[] = [];

    try {
      const upcomingResponse = await fetch(upcomingUrl.toString(), {
        cache: "no-store",
      });

      if (upcomingResponse.ok) {
        const upcomingData = await upcomingResponse.json();
        const upcomingFixtures: ApiTennisFixture[] = Array.isArray(
          upcomingData?.result,
        )
          ? upcomingData.result
          : [];

        upcomingMatches = upcomingFixtures
          .filter(isFrenchOpenMatch)
          .map(normalizeMatch)
          .sort((a, b) =>
            `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`),
          );
      }
    } catch (error) {
      console.error("Roland Garros upcoming opponent lookup failed:", error);
    }

    const advancementSummaries = buildAdvancementSummaries(
      matches,
      upcomingMatches,
    );

    const menMatches = matches.filter((match) =>
      match.category.toUpperCase().includes("ATP"),
    );
    const womenMatches = matches.filter((match) =>
      match.category.toUpperCase().includes("WTA"),
    );
    const longMatches = matches.filter((match) => match.isLongMatch);
    const retirements = matches.filter((match) => match.isRetirementOrWalkover);

    return NextResponse.json({
      success: true,
      recapDate,
      timezone: "Europe/Paris",
      count: matches.length,
      storylines: buildStorylines(matches),
      advancementSummaries,
      topResults: matches.slice(0, 12),
      menMatches,
      womenMatches,
      longMatches,
      retirements,
      matches,
    });
  } catch (error) {
    console.error("Roland Garros recap API error:", error);

    return NextResponse.json(
      { error: "Unexpected error while loading Roland Garros recap" },
      { status: 500 },
    );
  }
}
