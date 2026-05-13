import { NextResponse } from "next/server";

function getCleanGrandSlamName(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("wimbledon")) return "Wimbledon";
  if (lower.includes("australian open")) return "Australian Open";
  if (lower.includes("french open")) return "French Open";
  if (lower.includes("us open")) return "US Open";

  return name;
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
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch seasons from Sportradar" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const today = new Date();

    const slamSingles = data.seasons
      .filter((season: any) => {
        const name = season.name.toLowerCase();

        const isGrandSlam =
          name.includes("wimbledon") ||
          name.includes("australian open") ||
          name.includes("french open") ||
          name.includes("us open");

        const isSingles =
          name.includes("men singles") ||
          name.includes("women singles");

        return isGrandSlam && isSingles;
      })
      .filter((season: any) => new Date(season.end_date) >= today);

    const grouped = new Map();

    slamSingles.forEach((season: any) => {
      const cleanName = getCleanGrandSlamName(season.name);
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

      if (new Date(season.start_date) < new Date(item.startDate)) {
        item.startDate = season.start_date;
      }

      if (new Date(season.end_date) > new Date(item.endDate)) {
        item.endDate = season.end_date;
      }

      const lowerName = season.name.toLowerCase();

      if (lowerName.includes("men singles")) {
        item.menSeason = season;
      }

      if (lowerName.includes("women singles")) {
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