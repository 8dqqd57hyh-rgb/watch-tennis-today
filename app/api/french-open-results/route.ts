import { NextResponse } from "next/server";

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
  scores?: ApiTennisScore[];
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getDateDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDate(date);
}

function getDateDaysAhead(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
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

function isFinishedMatch(match: ApiTennisFixture) {
  const status = `${match.event_status || ""}`.toLowerCase();

  return (
    status === "finished" ||
    status === "completed" ||
    status === "ended" ||
    status === "final"
  );
}

function buildSetScore(scores?: ApiTennisScore[]) {
  if (!scores || scores.length === 0) {
    return "";
  }

  return scores
    .map((set) => `${set.score_first}-${set.score_second}`)
    .join(", ");
}

export async function GET() {
  try {
    const apiKey = process.env.API_TENNIS_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Missing API_TENNIS_KEY environment variable",
        },
        { status: 500 }
      );
    }

    const dateStart = getDateDaysAgo(7);
    const dateStop = getDateDaysAhead(1);

    const url = new URL("https://api.api-tennis.com/tennis/");
    url.searchParams.set("method", "get_fixtures");
    url.searchParams.set("APIkey", apiKey);
    url.searchParams.set("date_start", dateStart);
    url.searchParams.set("date_stop", dateStop);
    url.searchParams.set("timezone", "Europe/Paris");

    const response = await fetch(url.toString(), {
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch French Open results",
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const fixtures: ApiTennisFixture[] = Array.isArray(data?.result)
      ? data.result
      : [];

    const results = fixtures
      .filter(isFrenchOpenMatch)
      .filter(isFinishedMatch)
      .map((match) => ({
        id: String(match.event_key || ""),
        tournament: match.tournament_name || "French Open",
        tournamentKey: match.tournament_key || "",
        round: match.tournament_round || "",
        season: match.tournament_season || "",
        category: match.event_type_type || "",
        player1: match.event_first_player || "TBD",
        player2: match.event_second_player || "TBD",
        status: match.event_status || "Finished",
        score: match.event_final_result || buildSetScore(match.scores) || "-",
        setScore: buildSetScore(match.scores),
        winner: match.event_winner || "",
        date: match.event_date || "",
        time: match.event_time || "",
        startTime:
          match.event_date && match.event_time
            ? `${match.event_date}T${match.event_time}:00`
            : "",
        qualification: match.event_qualification || "",
        scores: match.scores || [],
      }))
      .sort((a, b) => {
        const aTime = `${a.date} ${a.time}`;
        const bTime = `${b.date} ${b.time}`;

        return bTime.localeCompare(aTime);
      });

    return NextResponse.json({
      success: true,
      dateStart,
      dateStop,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("French Open results API error:", error);

    return NextResponse.json(
      {
        error: "Unexpected error while loading French Open results",
      },
      { status: 500 }
    );
  }
}