import { NextResponse } from "next/server";
import { getWimbledonQualifyingMatches } from "@/app/lib/wimbledonQualifyingMatches";

export const revalidate = 60;

export async function GET() {
  const matches = await getWimbledonQualifyingMatches();

  return NextResponse.json(
    {
      matches,
      count: matches.length,
      live: matches.filter((match) => match.status === "LIVE").length,
      results: matches.filter((match) => ["FINISHED", "COMPLETED", "RETIRED", "WALKOVER"].includes(match.status)).length,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
