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
  event_status?: string;
  event_type_type?: string;
  tournament_name?: string;
  tournament_key?: string;
  tournament_round?: string;
  event_winner?: string | null;
  event_live?: string;
  event_qualification?: string;
  scores?: ApiTennisScore[];
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getTodayParisDate() {
  return formatDate(new Date());
}

function getTomorrowParisDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
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

function isFinishedStatus(status: string) {
  const value = status.toLowerCase();

  return (
    value.includes("finished") ||
    value.includes("completed") ||
    value.includes("ended") ||
    value.includes("final") ||
    value.includes("retired") ||
    value.includes("walkover")
  );
}

function isLiveStatus(match: ApiTennisFixture) {
  const status = `${match.event_status || ""}`.toLowerCase();

  return (
    match.event_live === "1" ||
    status.includes("live") ||
    status.includes("set") ||
    status.includes("game")
  );
}

function normalizeStatus(match: ApiTennisFixture) {
  const rawStatus = `${match.event_status || ""}`.trim();

  if (isLiveStatus(match)) return "LIVE";
  if (isFinishedStatus(rawStatus)) return "Finished";

  return "Scheduled";
}

function buildSetScore(scores?: ApiTennisScore[]) {
  if (!scores || scores.length === 0) return "";

  return scores
    .map((set) => `${set.score_first}-${set.score_second}`)
    .join(", ");
}

export async function GET() {
  try {
    const apiKey = process.env.API_TENNIS_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API_TENNIS_KEY environment variable" },
        { status: 500 }
      );
    }

    const dateStart = getTodayParisDate();
    const dateStop = getTomorrowParisDate();

    const url = new URL("https://api.api-tennis.com/tennis/");
    url.searchParams.set("method", "get_fixtures");
    url.searchParams.set("APIkey", apiKey);
    url.searchParams.set("date_start", dateStart);
    url.searchParams.set("date_stop", dateStop);
    url.searchParams.set("timezone", "Europe/Paris");

    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch French Open today matches",
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const fixtures: ApiTennisFixture[] = Array.isArray(data?.result)
      ? data.result
      : [];

    const matches = fixtures
      .filter(isFrenchOpenMatch)
      .map((match) => {
        const status = normalizeStatus(match);
        const score = match.event_final_result || buildSetScore(match.scores);

        return {
          id: String(match.event_key || ""),
          tournament: match.tournament_name || "French Open",
          tournamentKey: match.tournament_key || "",
          round: match.tournament_round || "",
          category: match.event_type_type || "",
          player1: match.event_first_player || "TBD",
          player2: match.event_second_player || "TBD",
          status,
          rawStatus: match.event_status || "",
          score: score || "",
          winner: match.event_winner || "",
          date: match.event_date || "",
          time: match.event_time || "",
          startTime:
            match.event_date && match.event_time
              ? `${match.event_date}T${match.event_time}:00`
              : "",
          qualification: match.event_qualification || "",
          scores: match.scores || [],
        };
      })
      .sort((a, b) => {
        const aTime = `${a.date} ${a.time}`;
        const bTime = `${b.date} ${b.time}`;

        return aTime.localeCompare(bTime);
      });

    return NextResponse.json({
      success: true,
      dateStart,
      dateStop,
      count: matches.length,
      matches,
    });
  } catch (error) {
    console.error("French Open today API error:", error);

    return NextResponse.json(
      { error: "Unexpected error while loading French Open today matches" },
      { status: 500 }
    );
  }
}