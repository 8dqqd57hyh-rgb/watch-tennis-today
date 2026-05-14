import { NextResponse } from "next/server";

function getCleanGrandSlamName(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("wimbledon")) return "Wimbledon";
  if (lower.includes("australian open")) return "Australian Open";

  if (
    lower.includes("french open") ||
    lower.includes("roland garros")
  ) {
    return "French Open";
  }

  if (
    lower.includes("us open") ||
    lower.includes("u.s. open")
  ) {
    return "US Open";
  }

  return name;
}

function isGrandSlamSeason(name: string) {
  const lower = name.toLowerCase();

  return (
    lower.includes("wimbledon") ||
    lower.includes("australian open") ||
    lower.includes("french open") ||
    lower.includes("roland garros") ||
    lower.includes("us open") ||
    lower.includes("u.s. open")
  );
}

function isSinglesSeason(name: string) {
  const lower = name.toLowerCase();

  return (
    lower.includes("men singles") ||
    lower.includes("women singles") ||
    lower.includes("mens singles") ||
    lower.includes("womens singles") ||
    lower.includes("men's singles") ||
    lower.includes("women's singles")
  );
}

function isValidDate(value?: string) {
  if (!value) return false;

  return Number.isFinite(new Date(value).getTime());
}

export async function GET() {
  const apiKey = process.env.SPORTRADAR_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing API key" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.sportradar.com/tennis/trial/v3/en/seasons.json?api_key=${apiKey}`,
      { next: { revalidate: 86400  } }
    );

    if (!response.ok) {
  const errorText = await response.text();

  if (response.status === 429) {
  return NextResponse.json({
    name: "French Open",
    year: 2026,
    startDate: "2026-05-24",
    endDate: "2026-06-07",
    menSeason: true,
    womenSeason: true,
    source: "fallback-limit",
  });
}

if (process.env.NODE_ENV === "development") {
  return NextResponse.json({
    name: "French Open",
    year: 2026,
    startDate: "2026-05-24",
    endDate: "2026-06-07",
    menSeason: true,
    womenSeason: true,
    source: "dev-static",
  });
}

  return NextResponse.json(
    {
      error: "Failed to fetch seasons from Sportradar",
      status: response.status,
      statusText: response.statusText,
      details: errorText,
    },
    { status: response.status }
  );
}

    const data = await response.json();
    const possibleSlams = data.seasons.filter((season: any) => {
  const name = (season.name || "").toLowerCase();

  return (
    name.includes("roland") ||
    name.includes("french") ||
    name.includes("wimbledon") ||
    name.includes("australian") ||
    name.includes("us open")
  );
});

console.log(
  possibleSlams.map((season: any) => ({
    name: season.name,
    start: season.start_date,
    end: season.end_date,
  }))
);
    const today = new Date();

    const slamSingles = data.seasons
      .filter((season: any) => {
        const name = season.name || "";

        return (
          isGrandSlamSeason(name) &&
          isSinglesSeason(name) &&
          isValidDate(season.start_date) &&
          isValidDate(season.end_date)
        );
      })
      .filter(
        (season: any) =>
          new Date(season.end_date).getTime() >= today.getTime()
      );

    const grouped = new Map();

    slamSingles.forEach((season: any) => {
      const cleanName = getCleanGrandSlamName(season.name || "");
      const key = `${cleanName}-${season.year}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          name: cleanName,
          year: season.year,
          startDate: season.start_date,
          endDate: season.end_date,
          menSeason: null,
          womenSeason: null,
        });
      }

      const item = grouped.get(key);

      if (
        new Date(season.start_date).getTime() <
        new Date(item.startDate).getTime()
      ) {
        item.startDate = season.start_date;
      }

      if (
        new Date(season.end_date).getTime() >
        new Date(item.endDate).getTime()
      ) {
        item.endDate = season.end_date;
      }

      const lowerName = (season.name || "").toLowerCase();

      if (
        lowerName.includes("men singles") ||
        lowerName.includes("mens singles") ||
        lowerName.includes("men's singles")
      ) {
        item.menSeason = season;
      }

      if (
        lowerName.includes("women singles") ||
        lowerName.includes("womens singles") ||
        lowerName.includes("women's singles")
      ) {
        item.womenSeason = season;
      }
    });

    const tournaments = Array.from(grouped.values()).sort(
      (a: any, b: any) =>
        new Date(a.startDate).getTime() -
        new Date(b.startDate).getTime()
    );

    return NextResponse.json(tournaments[0] || null);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch grand slam" },
      { status: 500 }
    );
  }
}