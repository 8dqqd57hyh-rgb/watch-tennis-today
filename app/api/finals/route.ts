import { NextResponse } from "next/server";
import { getUpcomingFinals } from "@/app/lib/finals";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://watchtennistoday.com";

  const response = await fetch(`${baseUrl}/api/matches`, {
    cache: "no-store",
  });

  const data = await response.json();

  const matches = Array.isArray(data)
    ? data
    : Array.isArray(data.matches)
      ? data.matches
      : [];

  const finals = getUpcomingFinals(matches);

  return NextResponse.json({
    ok: true,
    finals,
  });
}