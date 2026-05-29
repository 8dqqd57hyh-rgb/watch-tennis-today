import { NextRequest, NextResponse } from "next/server";
import { getCanonicalPlayerSlug, looksLikeClearlyInvalidPlayerSlug } from "./data/playerSlugs";

export function middleware(request: NextRequest) {
  const playerPathMatch = request.nextUrl.pathname.match(/^\/player\/(.+)$/);
  const watchPlayerLiveMatch = request.nextUrl.pathname.match(/^\/watch-player-live\/(.+)$/);

  if (playerPathMatch) {
    const requestedSlug = decodeURIComponent(playerPathMatch[1] || "")
      .split("/")
      .filter(Boolean)
      .join("-")
      .replace(/-+/g, "-")
      .replace(/^[-.]+|[-.]+$/g, "");

    const url = request.nextUrl.clone();

    // Repair nested old/bad player links created from doubles names like
    // /player/matushkina/-uchijima.
    if (playerPathMatch[1].includes("/") && requestedSlug) {
      url.pathname = `/player/${requestedSlug}`;
      return NextResponse.redirect(url, 308);
    }

    const canonicalPlayerSlug = getCanonicalPlayerSlug(requestedSlug);
    if (canonicalPlayerSlug && canonicalPlayerSlug !== requestedSlug) {
      url.pathname = `/player/${canonicalPlayerSlug}`;
      return NextResponse.redirect(url, 308);
    }

    // Safety net: redirect only clearly bad player URLs, not every unknown player.
    // This preserves real players that are not yet in the canonical list, e.g.
    // /player/ngounoue, while still cleaning doubles-team and abbreviated slugs
    // like /player/detiuc-khromacheva or /player/m.-cecchinato.
    // Do not redirect unknown/invalid player slugs to /players.
    // Let /player/[slug] return a proper 404/noindex instead, so bots do not
    // see misleading permanent redirects for possible real players or bad feed fragments.
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
  const range = requestHeaders.get("range");

  // Some bots send malformed Range headers.
  // Range requests are not needed for HTML pages, so we safely remove invalid ones.
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
    /*
     * Apply only to normal pages, not static files, images, API routes,
     * Next internals or favicon.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};