import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ApiTennisEvent = {
  event_date?: string;
  event_time?: string;
  tournament_name?: string;
};

const GRAND_SLAMS = [
  "Australian Open",
  "French Open",
  "Roland Garros",
  "Wimbledon",
  "US Open",
];

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function normalizeGrandSlam(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("wimbledon")) {
    return "Wimbledon";
  }

  if (lower.includes("australian")) {
    return "Australian Open";
  }

  if (
    lower.includes("roland garros") ||
    lower.includes("french open")
  ) {
    return "French Open";
  }

  if (lower.includes("us open")) {
    return "US Open";
  }

  return name;
}

function isGrandSlam(name?: string) {
  if (!name) return false;

  const lower = name.toLowerCase();

  return GRAND_SLAMS.some((slam) =>
    lower.includes(slam.toLowerCase())
  );
}

async function fetchFixtures(
  apiKey: string,
  dateStart: string,
  dateStop: string
) {
  const url =
    `https://api.api-tennis.com/tennis/?method=get_fixtures` +
    `&APIkey=${apiKey}` +
    `&date_start=${dateStart}` +
    `&date_stop=${dateStop}` +
    `&timezone=Europe/Warsaw`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch fixtures");
  }

  const data = await response.json();

  if (data.success !== 1 || !Array.isArray(data.result)) {
    return [];
  }

  return data.result as ApiTennisEvent[];
}

export async function GET() {
  const apiKey = process.env.API_TENNIS_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing API_TENNIS_KEY" },
      { status: 500 }
    );
  }

  try {
    const today = new Date();

    const future = new Date();
    future.setDate(today.getDate() + 365);

    const fixtures = await fetchFixtures(
      apiKey,
      formatDate(today),
      formatDate(future)
    );

    const grandSlamMatches = fixtures.filter((event) =>
      isGrandSlam(event.tournament_name)
    );

    if (grandSlamMatches.length === 0) {
      return NextResponse.json({
        name: "Grand Slam",
        startDate: null,
        endDate: null,
      });
    }

    grandSlamMatches.sort((a, b) => {
      const aDate = new Date(
        `${a.event_date}T${a.event_time || "00:00"}`
      );

      const bDate = new Date(
        `${b.event_date}T${b.event_time || "00:00"}`
      );

      return aDate.getTime() - bDate.getTime();
    });

    const firstMatch = grandSlamMatches[0];

    const slamName = normalizeGrandSlam(
      firstMatch.tournament_name || "Grand Slam"
    );

    const sameTournamentMatches = grandSlamMatches.filter(
      (event) =>
        normalizeGrandSlam(
          event.tournament_name || ""
        ) === slamName
    );

    const dates = sameTournamentMatches
      .map((event) => event.event_date)
      .filter(Boolean)
      .sort() as string[];

    const startDate = dates[0] || null;
    const endDate = dates[dates.length - 1] || null;

    return NextResponse.json({
      name: slamName,

      startDate,
      endDate,

      menSeason: true,
      womenSeason: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch next Grand Slam" },
      { status: 500 }
    );
  }
}