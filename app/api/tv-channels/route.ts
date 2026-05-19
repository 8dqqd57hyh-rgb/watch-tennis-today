import { NextResponse } from "next/server";
import { tvChannels } from "@/data/tvChannels";

export async function GET() {
  return NextResponse.json(tvChannels);
}
