import type { ServerMatch } from "@/app/lib/serverMatches";

export function tennisOnTvMatchHref(match: Pick<ServerMatch, "id">) {
  return `/watch/${encodeURIComponent(String(match.id))}`;
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
