import { NextResponse } from "next/server";
import { getStreamingOffers } from "@/app/lib/streamingOffers";
import { validateStreamingOfferQuery } from "@/src/data/streamingOffers";

export async function GET(request: Request) {
  const query = validateStreamingOfferQuery(new URL(request.url));
  if (!query.ok) return NextResponse.json({ error: "Invalid query", details: query.errors }, { status: 400 });
  return NextResponse.json(await getStreamingOffers(query));
}
