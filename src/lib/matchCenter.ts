import { canonicalUrl } from "@/app/lib/technicalSeo";
import {
  getCanonicalPlayerSlug,
  playerNameFromSlug,
  playerSlug,
  safePlayerUrl,
} from "@/data/playerSlugs";
import { players } from "@/data/players";
import {
  getBroadcastCountryOptions,
  normalizeTournament,
  tennisBroadcasts,
  type TennisBroadcastEntry,
  type TennisBroadcastConfidence,
} from "@/src/data/tennisBroadcasts";

export type MatchCenterMatch = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  pointScore?: string | null;
  startTime: string | null;
  round?: string | null;
  court?: string | null;
  surface?: string | null;
  watchProviders: {
    name: string;
    url: string;
    accessType?: string;
    verificationStatus?: string;
    note?: string;
  }[];
  location?: string | null;
  [key: string]: unknown;
};

export type ParsedMatchSlug = {
  playerOneSlug: string;
  playerTwoSlug: string;
  playerOneName: string;
  playerTwoName: string;
};

export type MatchWatchOption = {
  countryName: string;
  countrySlug: string;
  broadcasterName: string;
  streamingService: string;
  officialUrl: string;
  free: boolean;
  subscriptionRequired: boolean;
  confidence: TennisBroadcastConfidence;
  lastVerified: string;
  notes?: string;
  tournamentName: string;
  officialSourceUrls: string[];
  priceNote: string;
};

const DEFAULT_WATCH_COUNTRIES = ["usa", "uk", "poland", "germany", "france", "spain", "italy", "canada", "australia"];
const INDEXABLE_PLAYER_SLUGS = new Set([
  "jannik-sinner",
  "carlos-alcaraz",
  "novak-djokovic",
  "daniil-medvedev",
  "alexander-zverev",
  "taylor-fritz",
  "iga-swiatek",
  "aryna-sabalenka",
  "coco-gauff",
  "elena-rybakina",
  "jessica-pegula",
  "naomi-osaka",
  "mirra-andreeva",
  "jasmine-paolini",
]);

function slugify(value: string) {
  return playerSlug(value)
    .replace(/-vs-/g, "-versus-")
    .replace(/^-|-$/g, "");
}

function compact(value?: string | null) {
  return String(value || "").trim();
}

function validDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeStatus(status?: string | null) {
  return compact(status).toLowerCase().replace(/[\s_-]+/g, "");
}

function isFinishedStatus(status?: string | null) {
  const normalized = normalizeStatus(status);
  return ["finished", "completed", "ended", "final", "retired", "walkover"].some((item) =>
    normalized.includes(item)
  );
}

function isCancelledStatus(status?: string | null) {
  const normalized = normalizeStatus(status);
  return normalized.includes("cancelled") || normalized.includes("canceled") || normalized.includes("postponed");
}

function countrySlugToName(slug: string) {
  const option = getBroadcastCountryOptions().find((country) => country.slug === slug);
  return option?.countryName || slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function tournamentSlug(value?: string | null) {
  return playerSlug(compact(value));
}

function getTournamentBroadcastIds(match: MatchCenterMatch) {
  const tournamentId = normalizeTournament(match.tournament || "");
  if (tournamentId) return [tournamentId];

  const category = compact(match.category).toUpperCase();
  if (category.includes("WTA")) return ["wta-tour" as const];
  if (category.includes("ATP")) return ["atp-tour" as const];

  return [];
}

function entriesForMatch(match: MatchCenterMatch) {
  const ids = getTournamentBroadcastIds(match);
  if (!ids.length) return [];

  return tennisBroadcasts.filter((entry) => ids.includes(entry.tournamentId));
}

function dedupeWatchOptions(entries: TennisBroadcastEntry[]) {
  const seen = new Set<string>();
  const result: MatchWatchOption[] = [];

  for (const entry of entries) {
    const key = `${entry.countrySlug}:${entry.broadcasterName}:${entry.streamingService}:${entry.tournamentId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({
      countryName: entry.countryName,
      countrySlug: entry.countrySlug,
      broadcasterName: entry.broadcasterName,
      streamingService: entry.streamingService,
      officialUrl: entry.officialUrl,
      free: entry.free,
      subscriptionRequired: entry.subscriptionRequired,
      confidence: entry.confidence,
      lastVerified: entry.lastVerified,
      notes: entry.notes,
      tournamentName: entry.tournamentName,
      officialSourceUrls: entry.officialSourceUrls,
      priceNote: entry.priceNote,
    });
  }

  return result;
}

export function getMatchSlug(match: Pick<MatchCenterMatch, "player1" | "player2">) {
  const left = slugify(match.player1);
  const right = slugify(match.player2);

  return left && right ? `${left}-vs-${right}` : "";
}

export function parseMatchSlug(slug: string): ParsedMatchSlug | null {
  const [left, right] = compact(slug).toLowerCase().split("-vs-");
  if (!left || !right) return null;

  const leftCanonical = getCanonicalPlayerSlug(left);
  const rightCanonical = getCanonicalPlayerSlug(right);

  return {
    playerOneSlug: leftCanonical || left,
    playerTwoSlug: rightCanonical || right,
    playerOneName: leftCanonical ? players[leftCanonical].name : playerNameFromSlug(left),
    playerTwoName: rightCanonical ? players[rightCanonical].name : playerNameFromSlug(right),
  };
}

export async function findMatchBySlug(slug: string, matches?: MatchCenterMatch[]) {
  const parsed = parseMatchSlug(slug);
  if (!parsed) return null;

  const source: MatchCenterMatch[] =
    matches ??
    (await (await import("@/app/lib/serverMatches")).getServerMatchesWindow({
      includeFinished: true,
      daysBack: 3,
      daysForward: 14,
      revalidateSeconds: 60,
      timeoutMs: 12000,
    }) as MatchCenterMatch[]);

  const expected = new Set([parsed.playerOneSlug, parsed.playerTwoSlug]);

  return (
    source.find((match) => {
      const slugs = [getCanonicalPlayerSlug(match.player1) || playerSlug(match.player1), getCanonicalPlayerSlug(match.player2) || playerSlug(match.player2)];
      return slugs.every((item) => expected.has(item));
    }) || null
  );
}

export function fallbackMatchFromSlug(slug: string): MatchCenterMatch | null {
  const parsed = parseMatchSlug(slug);
  if (!parsed) return null;

  return {
    id: `slug:${slug}`,
    player1: parsed.playerOneName,
    player2: parsed.playerTwoName,
    tournament: "",
    category: "Tennis",
    status: "Not currently listed",
    score: "",
    startTime: null,
    watchProviders: [],
  };
}

export function getMatchWatchOptions(match: MatchCenterMatch, countries = DEFAULT_WATCH_COUNTRIES) {
  const countrySet = new Set(countries);
  const entries = entriesForMatch(match).filter((entry) => countrySet.has(entry.countrySlug));

  return dedupeWatchOptions(entries).slice(0, 18);
}

export function getMatchCoverageSummary(match: MatchCenterMatch) {
  const options = getMatchWatchOptions(match);
  const countries = Array.from(new Set(options.map((option) => option.countryName)));
  const broadcasters = Array.from(new Set(options.map((option) => option.broadcasterName)));
  const confidenceLevels = Array.from(new Set(options.map((option) => option.confidence)));
  const lastVerified = options.reduce<string | undefined>((latest, option) => {
    if (!latest) return option.lastVerified;
    return option.lastVerified > latest ? option.lastVerified : latest;
  }, undefined);

  return {
    options,
    countryCount: countries.length,
    broadcasterCount: broadcasters.length,
    countries,
    broadcasters,
    freeRouteCount: options.filter((option) => option.free).length,
    subscriptionRouteCount: options.filter((option) => option.subscriptionRequired).length,
    confidenceLevels,
    confidenceLabel: confidenceLevels.includes("needs_check")
      ? "Needs match-week verification"
      : confidenceLevels.includes("partial")
        ? "Partial"
        : options.length
          ? "Source-backed"
          : "No broadcaster rows matched",
    lastVerified,
  };
}

export function getPlayerRecentForm(playerSlugValue: string) {
  const canonicalSlug = getCanonicalPlayerSlug(playerSlugValue);
  if (!canonicalSlug) {
    return {
      playerName: playerNameFromSlug(playerSlugValue),
      summary: "Recent form data is not available from the current verified player dataset.",
      signals: ["Check the official draw and recent results before relying on form."],
    };
  }

  const player = players[canonicalSlug];
  const optionalProfile = player as {
    playStyle?: string;
    surfaceStrength?: string;
    watchReasons?: readonly string[];
  };

  return {
    playerName: player.name,
    summary:
      "Verified match-by-match form is not stored for this player here yet, so this section uses stable profile context instead of invented win-loss records.",
    signals: [
      optionalProfile.playStyle,
      optionalProfile.surfaceStrength ? `Surface note: ${optionalProfile.surfaceStrength}` : undefined,
      ...(optionalProfile.watchReasons || []),
    ].filter((item): item is string => Boolean(item)),
  };
}

export function getMatchSeoTitle(match: Pick<MatchCenterMatch, "player1" | "player2">) {
  return `${compact(match.player1)} vs ${compact(match.player2)}: Time, TV Channel, Live Stream & How to Watch`;
}

export function getMatchSeoDescription(match: Pick<MatchCenterMatch, "player1" | "player2" | "tournament" | "startTime">) {
  const date = validDate(match.startTime);
  const dateText = date
    ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(date)
    : "time TBC";
  const tournament = compact(match.tournament) || "the current tennis schedule";

  return `Follow ${compact(match.player1)} vs ${compact(match.player2)} at ${tournament}: match time (${dateText}), tournament context, official broadcaster checks and legal viewing notes.`;
}

export function getMatchFaq(match: MatchCenterMatch) {
  const summary = getMatchCoverageSummary(match);
  const tournament = compact(match.tournament) || "this event";
  const startDate = validDate(match.startTime);
  const startText = startDate
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }).format(startDate)
    : null;

  return [
    {
      question: `When is ${match.player1} vs ${match.player2}?`,
      answer: startText
        ? `${match.player1} vs ${match.player2} is listed for ${startText}. Tennis start times can move when earlier matches run long.`
        : "The current feed does not provide a confirmed start time. Check the official tournament order of play before making viewing plans.",
    },
    {
      question: `Where can I watch ${match.player1} vs ${match.player2}?`,
      answer: summary.options.length
        ? `Viewing depends on your country and the rights holder for ${tournament}. This page lists source-backed broadcaster rows and links to official pages so you can verify the exact match before paying.`
        : `Watch availability for ${tournament} is country-specific. Use the official tournament page and your local broadcaster guide before relying on any stream claim.`,
    },
    {
      question: "Does Watch Tennis Today stream the match?",
      answer: "No. Watch Tennis Today does not host, embed or restream tennis matches. It helps fans find schedules, context and official viewing routes.",
    },
    {
      question: "Why can broadcaster or start-time information change?",
      answer: "Tennis matches can move because of weather, previous matches, court assignments, withdrawals and broadcaster schedule changes. Re-check official sources close to match time.",
    },
  ];
}

export function isMatchPageIndexable(match: MatchCenterMatch) {
  const hasPlayers = Boolean(compact(match.player1) && compact(match.player2));
  const hasEvent = Boolean(compact(match.tournament));
  const hasDate = Boolean(validDate(match.startTime));
  const hasUsefulContext = getMatchWatchOptions(match).length > 0 || Boolean(match.round || match.court || match.surface);
  const isStale = validDate(match.startTime)
    ? Date.now() - (validDate(match.startTime) as Date).getTime() > 7 * 24 * 60 * 60 * 1000
    : false;
  const hasIndexablePlayer = [match.player1, match.player2].some((name) => {
    const canonicalSlug = getCanonicalPlayerSlug(name) || playerSlug(name);
    return INDEXABLE_PLAYER_SLUGS.has(canonicalSlug);
  });

  return hasPlayers && hasEvent && hasDate && hasUsefulContext && !isCancelledStatus(match.status) && !isStale && hasIndexablePlayer;
}

export function shouldIncludeMatchInSitemap(match: MatchCenterMatch) {
  return isMatchPageIndexable(match) && !isFinishedStatus(match.status);
}

export function getMatchCountryTimeDisplays(match: MatchCenterMatch) {
  const date = validDate(match.startTime);
  if (!date) return [];

  return DEFAULT_WATCH_COUNTRIES.slice(0, 5).map((countrySlug) => ({
    countrySlug,
    countryName: countrySlugToName(countrySlug),
    label: new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
      timeZone: countrySlug === "uk" ? "Europe/London" : countrySlug === "usa" || countrySlug === "canada" ? "America/New_York" : countrySlug === "australia" ? "Australia/Sydney" : "Europe/Warsaw",
    }).format(date),
  }));
}

export function getMatchOfficialLinks(match: MatchCenterMatch) {
  const optionLinks = getMatchWatchOptions(match).flatMap((option) => [
    { label: option.broadcasterName, url: option.officialUrl },
    ...option.officialSourceUrls.map((url) => ({ label: "Official rights source", url })),
  ]);
  const safeLinks = optionLinks.filter((link) => /^https?:\/\//.test(link.url));
  const seen = new Set<string>();

  return safeLinks.filter((link) => {
    if (seen.has(link.url)) return false;
    seen.add(link.url);
    return true;
  }).slice(0, 8);
}

export function getMatchPaths(match: MatchCenterMatch) {
  const playerOneUrl = safePlayerUrl(match.player1);
  const playerTwoUrl = safePlayerUrl(match.player2);
  const tournament = tournamentSlug(match.tournament);

  return {
    canonical: `/match/${getMatchSlug(match)}`,
    playerOneUrl,
    playerTwoUrl,
    tournamentUrl: tournament ? `/tournament/${tournament}` : "/tournament",
  };
}

export function buildMatchSchemas(match: MatchCenterMatch) {
  const url = canonicalUrl(`/match/${getMatchSlug(match)}`);
  const faq = getMatchFaq(match);
  const startDate = validDate(match.startTime)?.toISOString();
  const location = compact(match.court || match.location);
  const sportsEvent: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${match.player1} vs ${match.player2}`,
    url,
    sport: "Tennis",
    eventStatus: isFinishedStatus(match.status) ? "https://schema.org/EventCompleted" : "https://schema.org/EventScheduled",
    competitor: [
      { "@type": "Person", name: match.player1 },
      { "@type": "Person", name: match.player2 },
    ],
    organizer: compact(match.tournament) ? { "@type": "SportsOrganization", name: match.tournament } : undefined,
    startDate,
    location: location ? { "@type": "Place", name: location } : undefined,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Matches", item: canonicalUrl("/today") },
      { "@type": "ListItem", position: 3, name: `${match.player1} vs ${match.player2}`, item: url },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return [sportsEvent, breadcrumb, faqPage].map((schema) =>
    JSON.parse(JSON.stringify(schema, (_key, value) => (value === undefined ? undefined : value)))
  );
}
