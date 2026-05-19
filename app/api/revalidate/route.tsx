import { NextResponse } from "next/server";

export async function GET() {
  try {
    await fetch(
      "https://www.google.com/ping?sitemap=https://watchtennistoday.com/sitemap.xml"
    );

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json({
      success: false,
    });
  }
}
