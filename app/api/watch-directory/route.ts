import { NextResponse } from "next/server";
import { watchDirectory } from "@/data/watchDirectory";

export async function GET() {
  return NextResponse.json(watchDirectory);
}
