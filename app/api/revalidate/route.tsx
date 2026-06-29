import { NextResponse } from "next/server";

function hasValidSecret(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");
  const authorization = request.headers.get("authorization");
  const bearerSecret = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : null;

  return querySecret === cronSecret || bearerSecret === cronSecret;
}

export async function GET(request: Request) {
  if (!hasValidSecret(request)) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

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
