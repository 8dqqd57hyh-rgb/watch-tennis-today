import { NextRequest, NextResponse } from "next/server";
import { getCanonicalPlayerSlug, looksLikeClearlyInvalidPlayerSlug } from "./data/playerSlugs";

export function middleware(request: NextRequest) {
  const playerPathMatch = request.nextUrl.pathname.match(/^\/player\/(.+)$/);
  const pluralPlayerPathMatch = request.nextUrl.pathname.match(/^\/players\/(.+)$/);
  const watchPlayerLiveMatch = request.nextUrl.pathname.match(/^\/watch-player-live\/(.+)$/);

  if (pluralPlayerPathMatch) {
    const firstSegment = pluralPlayerPathMatch[1].split("/").filter(Boolean)[0];

    if (!["atp", "wta", "live-now"].includes(firstSegment || "")) {
      const requestedSlug = decodeURIComponent(pluralPlayerPathMatch[1] || "")
        .split("/")
        .filter(Boolean)
        .join("-")
        .replace(/-+/g, "-")
        .replace(/^[-.]+|[-.]+$/g, "");

      if (requestedSlug) {
        const canonicalPlayerSlug = getCanonicalPlayerSlug(requestedSlug);
        if (canonicalPlayerSlug) {
          const url = request.nextUrl.clone();
          url.pathname = `/player/${canonicalPlayerSlug}`;
          return NextResponse.redirect(url, 308);
        }

        return NextResponse.next();
      }
    }
  }

  if (playerPathMatch) {
    const requestedSlug = decodeURIComponent(playerPathMatch[1] || "")
      .split("/")
      .filter(Boolean)
      .join("-")
      .replace(/-+/g, "-")
      .replace(/^[-.]+|[-.]+$/g, "");

    const url = request.nextUrl.clone();

    if (playerPathMatch[1].includes("/") && requestedSlug) {
      url.pathname = `/player/${requestedSlug}`;
      return NextResponse.redirect(url, 308);
    }

    const canonicalPlayerSlug = getCanonicalPlayerSlug(requestedSlug);
    if (canonicalPlayerSlug && canonicalPlayerSlug !== requestedSlug) {
      url.pathname = `/player/${canonicalPlayerSlug}`;
      return NextResponse.redirect(url, 308);
    }

    if (looksLikeClearlyInvalidPlayerSlug(requestedSlug)) {
      return NextResponse.next();
    }
  }

  if (watchPlayerLiveMatch) {
    const requestedSlug = decodeURIComponent(watchPlayerLiveMatch[1] || "")
      .split("/")
      .filter(Boolean)
      .join("-")
      .replace(/-+/g, "-")
      .replace(/^[-.]+|[-.]+$/g, "");

    const url = request.nextUrl.clone();

    if (watchPlayerLiveMatch[1].includes("/") && requestedSlug) {
      url.pathname = `/watch-player-live/${requestedSlug}`;
      return NextResponse.redirect(url, 308);
    }

    const canonicalPlayerSlug = getCanonicalPlayerSlug(requestedSlug);
    if (canonicalPlayerSlug && canonicalPlayerSlug !== requestedSlug) {
      url.pathname = `/watch-player-live/${canonicalPlayerSlug}`;
      return NextResponse.redirect(url, 308);
    }

    if (looksLikeClearlyInvalidPlayerSlug(requestedSlug)) {
      url.pathname = "/players/live-now";
      return NextResponse.redirect(url, 308);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  const range = requestHeaders.get("range");

  if (range && !range.toLowerCase().startsWith("bytes=")) {
    requestHeaders.delete("range");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
