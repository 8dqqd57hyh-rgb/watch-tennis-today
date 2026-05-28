import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const playerPathMatch = request.nextUrl.pathname.match(/^\/player\/(.+)$/);

  // Repair old/bad player links created from doubles names like
  // /player/matushkina/-uchijima. They should not become nested routes.
  if (playerPathMatch && playerPathMatch[1].includes("/")) {
    const normalizedSlug = playerPathMatch[1]
      .split("/")
      .filter(Boolean)
      .join("-")
      .replace(/-+/g, "-");

    const url = request.nextUrl.clone();
    url.pathname = `/player/${normalizedSlug}`;
    return NextResponse.redirect(url, 308);
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