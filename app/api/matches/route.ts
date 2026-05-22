import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

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
  tournament_round?: string;
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
  const startTime = getStartTime(match);
  const startsInFuture = startTime ? new Date(startTime) > new Date() : false;

  const hasSetScore =
  match.scores?.some((set) => {
    const first = String(set.score_first ?? "").trim();
    const second = String(set.score_second ?? "").trim();

    return first !== "" && second !== "" && `${first}-${second}` !== "0-0";
  }) ?? false;

const hasScore =
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
  );

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

  if (status.includes("finished")) {
    return "FINISHED";
  }

  if (status.includes("cancel")) {
    return "CANCELLED";
  }

  if (status.includes("retired")) {
    return "RETIRED";
  }

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
    if (allMatches.length === 0) {
  console.warn("No tennis matches returned from API-Tennis");
}

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
          round: match.tournament_round || "",
isFinal:
  (match.tournament_round || "").toLowerCase().includes("final") &&
  !(match.tournament_round || "").toLowerCase().includes("semi") &&
  Boolean(match.event_date),
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
await supabase.from("match_archive").upsert(
  matches.map((match) => ({
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
    return NextResponse.json(matches);
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
