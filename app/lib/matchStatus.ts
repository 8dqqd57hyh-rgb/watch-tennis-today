export type CanonicalMatchStatus = "LIVE" | "UPCOMING" | "FINISHED" | "RETIRED" | "SUSPENDED" | "CANCELLED" | "EXPIRED" | "UNKNOWN";

function text(value?: string | null) { return String(value || "").trim().toUpperCase(); }
function compact(value?: string | null) { return text(value).replace(/[\s_-]+/g, ""); }

export function normalizeMatchStatus(value?: string | null): CanonicalMatchStatus {
  const valueText = text(value);
  const valueCompact = compact(value);
  if (valueCompact.includes("RETIRED") || valueCompact.includes("WALKOVER")) return "RETIRED";
  // A provider can return composite values such as "Live - Suspended". The
  // suspension token is the more specific current state and must win.
  if (["SUSPENDED", "INTERRUPTED", "DELAYED", "DELAY", "POSTPONED"].some((item) => valueCompact.includes(item))) return "SUSPENDED";
  if (valueCompact.includes("CANCELLED") || valueCompact.includes("CANCELED")) return "CANCELLED";
  if (["FINISHED", "COMPLETED", "COMPLETE", "ENDED", "FINAL", "FT"].some((item) => valueCompact === item || valueCompact.includes(item))) return "FINISHED";
  if (valueCompact === "LIVE" || valueCompact === "INPROGRESS" || valueText.includes("IN PROGRESS")) return "LIVE";
  if (["UPCOMING", "SCHEDULED", "FIXTURE", "NOTSTARTED", "NS", "TBD", "PENDING"].includes(valueCompact)) return "UPCOMING";
  if (valueCompact === "EXPIRED") return "EXPIRED";
  return "UNKNOWN";
}

export function resolveProviderMatchStatus(input: {
  providerStatus?: string | null; providerLive?: boolean; hasScore?: boolean;
  providerScheduled?: boolean; startsInFuture?: boolean; staleLive?: boolean; pastUnplayed?: boolean;
}): CanonicalMatchStatus {
  const explicit = normalizeMatchStatus(input.providerStatus);
  if (explicit !== "UNKNOWN" && explicit !== "LIVE") return explicit;
  // API-Tennis uses blank event_status + event_live "0" on get_fixtures rows.
  // That provider combination is scheduled state, not an ambiguous status.
  if (input.providerScheduled) return "UPCOMING";
  if (input.pastUnplayed) return "EXPIRED";
  if (input.staleLive) return input.hasScore ? "FINISHED" : "EXPIRED";
  if (explicit === "LIVE" || input.providerLive) return "LIVE";
  if (input.hasScore) return input.startsInFuture ? "SUSPENDED" : "FINISHED";
  return "UNKNOWN";
}

export const isLiveMatch = (status?: string | null) => normalizeMatchStatus(status) === "LIVE";
export const isUpcomingMatch = (status?: string | null) => normalizeMatchStatus(status) === "UPCOMING";
export const isFinishedMatch = (status?: string | null) => normalizeMatchStatus(status) === "FINISHED";
export const isRetiredMatch = (status?: string | null) => normalizeMatchStatus(status) === "RETIRED";
export const isSuspendedMatch = (status?: string | null) => normalizeMatchStatus(status) === "SUSPENDED";

export function getMatchStatusPresentation(status?: string | null) {
  const normalized = normalizeMatchStatus(status);
  if (normalized === "LIVE") return { status: normalized, badge: "LIVE NOW", supportingText: "Live now", tone: "live" as const };
  if (normalized === "SUSPENDED") return { status: normalized, badge: "SUSPENDED", supportingText: "Match suspended", tone: "suspended" as const };
  if (normalized === "UNKNOWN") return { status: normalized, badge: "STATUS UNKNOWN", supportingText: "Status unknown", tone: "neutral" as const };
  return { status: normalized, badge: normalized, supportingText: normalized === "UPCOMING" ? "Match scheduled" : normalized === "FINISHED" ? "Match finished" : normalized === "RETIRED" ? "Match retired" : normalized.toLowerCase(), tone: "neutral" as const };
}

export function groupMatchesByStatus<T extends { status?: string | null }>(matches: T[]) {
  return {
    live: matches.filter((match) => isLiveMatch(match.status)),
    suspended: matches.filter((match) => isSuspendedMatch(match.status)),
    upcoming: matches.filter((match) => isUpcomingMatch(match.status)),
    finished: matches.filter((match) => isFinishedMatch(match.status) || isRetiredMatch(match.status)),
  };
}
