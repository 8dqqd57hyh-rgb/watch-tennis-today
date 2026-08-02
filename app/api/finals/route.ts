import { NextResponse } from "next/server";
import { getFeaturedWashingtonFinals } from "@/app/lib/finals";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://watchtennistoday.com";

  const response = await fetch(`${baseUrl}/api/matches?includeFinished=1&daysBack=1&daysForward=2`, {
    cache: "no-store",
  });

  const data = await response.json();

  const matches = Array.isArray(data)
    ? data
    : Array.isArray(data.matches)
      ? data.matches
      : [];

  const finals = getFeaturedWashingtonFinals(matches);

  return NextResponse.json(
    { ok: true, finals, checkedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
