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

  console.log("PLAYER SEARCH QUERY:", lastName);
  console.log("PLAYER SEARCH RESULTS:", players.slice(0, 10));

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

  console.log("RESOLVED PLAYER:", player);

  return player?.player_key ? String(player.player_key) : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const playerKeyFromQuery = searchParams.get("playerKey");
  const playerName = searchParams.get("playerName");

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

const dateStartDate = new Date();
dateStartDate.setDate(today.getDate() - 3);

const dateStopDate = new Date();
dateStopDate.setDate(today.getDate() + 30);

const dateStart = formatDate(dateStartDate);
const dateStop = formatDate(dateStopDate);

  try {
    const [liveMatches, fixtureMatches] = await Promise.all([
  fetchApiTennis(
    "get_livescore",
    apiKey,
    resolvedPlayerKey
      ? `&player_key=${resolvedPlayerKey}&timezone=Europe/Warsaw`
      : `&timezone=Europe/Warsaw`
  ),
  fetchApiTennis(
    "get_fixtures",
    apiKey,
    `&date_start=${dateStart}&date_stop=${dateStop}&timezone=Europe/Warsaw${
      resolvedPlayerKey ? `&player_key=${resolvedPlayerKey}` : ""
    }`
  ),
]);

console.log("FIXTURES COUNT:", fixtureMatches.length);

console.log(
  "RYBAKINA BY FULL RESPONSE",
  fixtureMatches.filter((match: ApiTennisMatch) =>
    JSON.stringify(match).toLowerCase().includes("rybakina")
  )
);

    const allMatches: ApiTennisMatch[] = [...liveMatches, ...fixtureMatches];
    if (allMatches.length === 0) {
 
}

    const uniqueMatches = Array.from(
      new Map(allMatches.map((match) => [match.event_key, match])).values()
    );

    const filteredMatches = playerName
  ? uniqueMatches.filter((match) => {
      const fullText = `${match.event_first_player} ${match.event_second_player}`.toLowerCase();
      const parts = playerName.toLowerCase().split(/\s+/);

      return parts.some((part) => fullText.includes(part));
    })
  : uniqueMatches;

    const mappedMatches = filteredMatches.map((match) => {
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
    });

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

    const matches = mappedMatches
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
