export type QualifyingMatchLike = {
  tournament?: string | null;
  event?: string | null;
  eventName?: string | null;
  competition?: string | null;
  category?: string | null;
  status?: string | null;
  round?: string | null;
  stage?: string | null;
  phase?: string | null;
  draw?: string | null;
  name?: string | null;
  startTime?: string | null;
  date?: string | null;
  [key: string]: unknown;
};

type GrandSlamConfig = {
  label: string;
  tournamentPatterns: RegExp[];
};

const GRAND_SLAMS: Record<string, GrandSlamConfig> = {
  wimbledon: {
    label: "Wimbledon",
    tournamentPatterns: [/wimbledon/i],
  },
  "australian-open": {
    label: "Australian Open",
    tournamentPatterns: [/australian\s+open/i],
  },
  "roland-garros": {
    label: "Roland Garros",
    tournamentPatterns: [/roland[-\s]?garros/i, /french\s+open/i],
  },
  "us-open": {
    label: "US Open",
    tournamentPatterns: [/us\s+open/i, /u\.s\.\s+open/i],
  },
};

const QUALIFYING_PATTERNS = [
  /\bqualif(?:y|ying|ication|ier|iers|iers'|iers)\b/i,
  /\bqual\b/i,
  /\bq[1-3]\b/i,
  /\bround\s+[1-3]\s+qualif/i,
  /\bqualif(?:ying|ication)?\s+round\s+[1-3]\b/i,
  /\bfinal\s+qualif/i,
];

function compactText(value: string) {
  return value.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

export function getQualifyingText(match: QualifyingMatchLike) {
  return compactText(
    [
      match.tournament,
      match.event,
      match.eventName,
      match.competition,
      match.category,
      match.status,
      match.round,
      match.stage,
      match.phase,
      match.draw,
      match.name,
      typeof match["roundName"] === "string" ? match["roundName"] : null,
      typeof match["eventType"] === "string" ? match["eventType"] : null,
      typeof match["tournamentName"] === "string" ? match["tournamentName"] : null,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

export function isGrandSlamQualifyingMatch(match: QualifyingMatchLike, slamSlug?: keyof typeof GRAND_SLAMS) {
  const text = getQualifyingText(match);
  const slams = slamSlug ? [[slamSlug, GRAND_SLAMS[slamSlug]] as const] : Object.entries(GRAND_SLAMS);
  const hasQualifyingMarker = QUALIFYING_PATTERNS.some((pattern) => pattern.test(text));

  if (!hasQualifyingMarker) return false;

  return slams.some(([, config]) => config.tournamentPatterns.some((pattern) => pattern.test(text)));
}

export function isWimbledonQualifyingMatch(match: QualifyingMatchLike) {
  return isGrandSlamQualifyingMatch(match, "wimbledon");
}

export function getGrandSlamQualifyingBadge(match: QualifyingMatchLike) {
  if (!isGrandSlamQualifyingMatch(match)) return null;
  if (isWimbledonQualifyingMatch(match)) return "Wimbledon Qualifying";
  return "Grand Slam Qualifying";
}

function getDateKeyInZone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function isDuringWimbledonQualifyingWindow(date = new Date()) {
  const key = getDateKeyInZone(date, "Europe/London");
  return key >= "2026-06-22" && key <= "2026-06-25";
}

function getMatchDateKey(match: QualifyingMatchLike) {
  const rawDate = String(match.date || "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) return rawDate;

  const rawStartTime = String(match.startTime || "");
  const dateOnly = rawStartTime.match(/^(\d{4}-\d{2}-\d{2})/);
  if (dateOnly) return dateOnly[1];

  return null;
}

export function isWimbledonQualifyingWindowMatch(match: QualifyingMatchLike) {
  const text = getQualifyingText(match);
  const dateKey = getMatchDateKey(match);
  const isWimbledon = GRAND_SLAMS.wimbledon.tournamentPatterns.some((pattern) => pattern.test(text));

  return Boolean(isWimbledon && dateKey && dateKey >= "2026-06-22" && dateKey <= "2026-06-25");
}

export function wimbledonQualifyingWindowLabel() {
  return "June 22-25, 2026";
}
