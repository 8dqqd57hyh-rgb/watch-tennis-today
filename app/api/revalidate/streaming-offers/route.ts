import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { STREAMING_OFFERS_CACHE_TAG } from "@/app/lib/streamingOffers";

export async function POST(request: Request) {
  const expected = process.env.CRON_SECRET;
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expected || supplied !== expected) return NextResponse.json({ ok: false }, { status: 401 });
  revalidateTag(STREAMING_OFFERS_CACHE_TAG, "max");
  return NextResponse.json({ ok: true, revalidatedTag: STREAMING_OFFERS_CACHE_TAG });
}
