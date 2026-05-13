import { NextResponse } from "next/server";

type SportradarCompetitor = {
  name?: string;
};

type SportradarSportEvent = {
  id: string;
  start_time?: string;
  competitors?: SportradarCompetitor[];
  tournament?: {
    name?: string;
  };
  sport_event_context?: {
    category?: {
      name?: string;
    };
    competition?: {
      name?: string;
    };
  };
};

type SportradarSummary = {
  sport_event: SportradarSportEvent;
  sport_event_status?: {
    status?: string;
    home_score?: number;
    away_score?: number;
    period_scores?: {
      home_score?: number;
      away_score?: number;
      number?: number;
      type?: string;
    }[];
  };
};

function normalizeStatus(status?: string) {
  if (status === "live" || status === "started") return "LIVE";
  if (status === "not_started" || status === "match_about_to_start") return "UPCOMING";
  if (status === "closed" || status === "ended") return "FINISHED";
  if (status === "cancelled") return "CANCELLED";
  if (status === "delayed") return "DELAYED";
  if (status === "suspended") return "SUSPENDED";

  return "UPCOMING";
}

function normalizeCategory(categoryName?: string, tournamentName?: string) {
  const value = `${categoryName || ""} ${tournamentName || ""}`.toLowerCase();

  if (value.includes("atp challenger")) return "CHALLENGER";
  if (value.includes("atp")) return "ATP";
  if (value.includes("wta")) return "WTA";
  if (value.includes("itf")) return "ITF";
  if (value.includes("utr")) return "UTR";

  return "UNKNOWN";
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatScore(status?: SportradarSummary["sport_event_status"]) {
  if (!status) return "-";

  if (status.period_scores && status.period_scores.length > 0) {
    return status.period_scores
      .map((set) => `${set.home_score ?? 0}-${set.away_score ?? 0}`)
      .join(", ");
  }

  if (
    status.home_score !== undefined &&
    status.away_score !== undefined
  ) {
    return `${status.home_score}-${status.away_score}`;
  }

  return "-";
}

async function fetchDailyMatches(date: string, apiKey: string) {
  const url = `https://api.sportradar.com/tennis/trial/v3/en/schedules/${date}/summaries.json?api_key=${apiKey}`;

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch matches for ${date}`);
  }

  const data = await response.json();

  return data.summaries || [];
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

export async function GET() {
  const apiKey = process.env.SPORTRADAR_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing SPORTRADAR_API_KEY in .env.local" },
      { status: 500 }
    );
  }

  const today = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(today.getDate() + 1);

  const dates = [formatDate(today), formatDate(tomorrow)];

  try {
    const results = await Promise.all(
      dates.map((date) => fetchDailyMatches(date, apiKey))
    );

    const summaries: SportradarSummary[] = results.flat();

    const matches = summaries.map((summary) => {
      const event = summary.sport_event;
      const status = summary.sport_event_status;

      const tournament =
        event.sport_event_context?.competition?.name ||
        event.tournament?.name ||
        "Unknown tournament";

      const category = normalizeCategory(
        event.sport_event_context?.category?.name,
        tournament
      );

      return {
        id: event.id,
        player1: event.competitors?.[0]?.name || "Unknown player",
        player2: event.competitors?.[1]?.name || "Unknown player",
        tournament,
        category,
        status: normalizeStatus(status?.status),
        score: formatScore(status),
        startTime: event.start_time || null,
        watchProviders: getWatchProviders(category, tournament),
      };
    });

    const usefulMatches = matches.filter(
      (match) => match.status !== "FINISHED" && match.status !== "CANCELLED"
    );

    usefulMatches.sort((a, b) => {
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;

      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    return NextResponse.json(usefulMatches);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch daily matches from Sportradar" },
      { status: 500 }
    );
  }
}