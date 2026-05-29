import { NextRequest, NextResponse } from "next/server";
import { isKnownPlayerSlug } from "./data/playerSlugs";

export function middleware(request: NextRequest) {
  const playerPathMatch = request.nextUrl.pathname.match(/^\/player\/(.+)$/);

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

    // Hard safety net: only canonical player pages should resolve. This prevents
    // generated singles-looking doubles teams and abbreviated API names like
    // /player/m.-cecchinato from becoming SEO-quality 404 noise.
    if (!isKnownPlayerSlug(requestedSlug)) {
      url.pathname = "/players";
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