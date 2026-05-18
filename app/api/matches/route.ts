import { NextResponse } from "next/server";

export const revalidate = 60;

type ApiTennisMatch = {
  event_key: string;
  event_date: string;
  event_time: string;
  event_first_player: string;
  event_second_player: string;
  event_final_result: string;
  event_game_result: string;
  event_status: string;
  event_type_type: string;
  tournament_name: string;
  event_live: string;
  scores?: {
    score_first: string;
    score_second: string;
    score_set: string;
  }[];
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function normalizeCategory(eventType?: string) {
  const value = (eventType || "").toLowerCase();

  if (value.includes("challenger")) return "CHALLENGER";
  if (value.includes("atp")) return "ATP";
  if (value.includes("wta")) return "WTA";
  if (value.includes("itf")) return "ITF";

  return "UNKNOWN";
}

function normalizeStatus(match: ApiTennisMatch) {
  const status = (match.event_status || "").toLowerCase();

  const hasScore =
    (match.scores && match.scores.length > 0) ||
    (match.event_final_result &&
      match.event_final_result !== "-") ||
    (match.event_game_result &&
      match.event_game_result !== "-");

  // suspended / interrupted / delayed
  if (
    status.includes("suspended") ||
    status.includes("interrupted") ||
    status.includes("delay") ||
    status.includes("postponed")
  ) {
    return "SUSPENDED";
  }

  // live
  if (
    match.event_live === "1" ||
    status.includes("live") ||
    status.includes("in progress") ||
    status.includes("progress")
  ) {
    return "LIVE";
  }

  // finished
  if (status.includes("finished")) {
    return "FINISHED";
  }

  // cancelled
  if (status.includes("cancel")) {
    return "CANCELLED";
  }

  // retired
  if (status.includes("retired")) {
    return "RETIRED";
  }

  // important fallback:
  // if score already exists but match isn't finished,
  // it's probably suspended/live — not upcoming
  if (hasScore) {
    return "SUSPENDED";
  }

  return "UPCOMING";
}

function formatScore(match: ApiTennisMatch) {
  if (match.scores && match.scores.length > 0) {
    return match.scores
      .map((set) => `${set.score_first}-${set.score_second}`)
      .join(", ");
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

function getWatchProviders(category: string, tournament: string) {
  const tournamentLower = tournament.toLowerCase();

  if (category === "ATP" && !tournamentLower.includes("challenger")) {
    return [
      {
        name: "Tennis TV",
        url: "https://www.tennistv.com/live-schedule",
        accessType: "PAID",
        verificationStatus: "TOUR_VERIFIED",
        note: "Official ATP streaming schedule. Exact match should be checked on Tennis TV.",
      },
      {
        name: "ATP TV Schedule",
        url: "https://www.atptour.com/en/tournaments/tv-schedule",
        accessType: "REGION_DEPENDENT",
        verificationStatus: "TOUR_VERIFIED",
        note: "Official ATP broadcaster schedule by region.",
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
    throw new Error(`API-Tennis request failed: ${method}`);
  }

  const data = await response.json();

  if (data.success !== 1) {
    return [];
  }

  return Array.isArray(data.result) ? data.result : [];
}

export async function GET() {
  const apiKey = process.env.API_TENNIS_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing API_TENNIS_KEY in .env.local" },
      { status: 500 }
    );
  }

  const today = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(today.getDate() + 1);

  const dateStart = formatDate(today);
  const dateStop = formatDate(tomorrow);

  try {
    const [liveMatches, fixtureMatches] = await Promise.all([
      fetchApiTennis("get_livescore", apiKey),
      fetchApiTennis(
        "get_fixtures",
        apiKey,
        `&date_start=${dateStart}&date_stop=${dateStop}&timezone=Europe/Warsaw`
      ),
    ]);

    const allMatches: ApiTennisMatch[] = [...liveMatches, ...fixtureMatches];

    const uniqueMatches = Array.from(
      new Map(allMatches.map((match) => [match.event_key, match])).values()
    );

    const matches = uniqueMatches
      .map((match) => {
        const category = normalizeCategory(match.event_type_type);
        const tournament = match.tournament_name || "Unknown tournament";

        return {
          id: String(match.event_key),
          player1: match.event_first_player || "Unknown player",
          player2: match.event_second_player || "Unknown player",
          tournament,
          category,
          status: normalizeStatus(match),
          score: formatScore(match),
          startTime: getStartTime(match),
          watchProviders: getWatchProviders(category, tournament),
        };
      })
      .filter(
        (match) =>
          match.status !== "FINISHED" &&
          match.status !== "CANCELLED" &&
          match.status !== "RETIRED"
      )
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

    return NextResponse.json(matches);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch matches from API-Tennis" },
      { status: 500 }
    );
  }
}