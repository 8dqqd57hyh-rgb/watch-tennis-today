import { players, type PlayerSlug } from "./players";
export { players };

export function normalizePlayerName(name: string) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function playerSlug(name: string) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/,/g, "")
    .replace(/\//g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function playerLookupAliases(name: string, slug: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const aliases = new Set<string>([
    normalizePlayerName(name),
    normalizePlayerName(parts.slice().reverse().join(" ")),
    normalizePlayerName(slug.replace(/-/g, " ")),
  ]);

  // API feeds often use abbreviated names such as "J. de Jong" or slugs
  // like "j-de-jong". Map those to the canonical player when that player
  // is already in our database, instead of emitting /player/j-de-jong.
  if (parts.length >= 2) {
    const initial = parts[0]?.charAt(0) || "";
    const surnamePart = parts.slice(1).join(" ");

    if (initial && surnamePart) {
      aliases.add(normalizePlayerName(`${initial}. ${surnamePart}`));
      aliases.add(normalizePlayerName(`${initial} ${surnamePart}`));
      aliases.add(normalizePlayerName(`${initial}-${surnamePart.replace(/\s+/g, "-")}`));
    }
  }

  return Array.from(aliases);
}

const legacyPlayerSlugAliases: Record<string, PlayerSlug> = {
  "h alexandrova": "ekaterina-alexandrova",
  "h e lee": "ha-eum-lee",
  "h. e. lee": "ha-eum-lee",
  "h-e-lee": "ha-eum-lee",
};

const canonicalNameToSlug = new Map<string, PlayerSlug>(
  [
    ...Object.entries(players).flatMap(([slug, player]) => {
      const canonicalSlug = slug as PlayerSlug;

      return playerLookupAliases(player.name, slug).map((alias) => [
        alias,
        canonicalSlug,
      ] as const);
    }),
    ...Object.entries(legacyPlayerSlugAliases).map(([alias, canonicalSlug]) => [
      normalizePlayerName(alias),
      canonicalSlug,
    ] as const),
  ]
);

export function hasInitialOnlyName(nameOrSlug: string) {
  return /(^|\s|-)\p{L}\.(?=\s|-|$)/u.test(String(nameOrSlug || ""));
}

export function isDoublesTeam(name?: string | null) {
  return /\s*[/&+]\s*/.test(String(name || ""));
}

export function looksLikeUnverifiedDoublesSlug(nameOrSlug: string) {
  const raw = String(nameOrSlug || "").trim();
  const slug = playerSlug(raw);

  if (!slug || slug in players) return false;
  if (isDoublesTeam(raw)) return true;

  // Bad production links are usually doubles-team surname chains, for example:
  // shimizu-watanabe, kostyuk-ruse, muhammad-stollar, bennani-lopez-morillo.
  // Keep real one-word unknown players like ngounoue available, but do not let
  // non-canonical hyphenated chains enter the player-link pipeline.
  const parts = slug.split("-").filter(Boolean);
  return parts.length >= 2;
}

export function isSafePlayerCandidate(nameOrSlug: string) {
  const raw = String(nameOrSlug || "").trim();
  if (!raw) return false;
  if (isDoublesTeam(raw)) return false;
  if (hasInitialOnlyName(raw)) return false;

  return true;
}

export function getCanonicalPlayerSlug(nameOrSlug: string): PlayerSlug | null {
  const raw = String(nameOrSlug || "").trim();
  if (!raw) return null;

  if (raw in players) return raw as PlayerSlug;

  // Try the canonical alias map first. This intentionally supports common
  // feed formats such as "J. Fonseca" and "j-fonseca" when the player is
  // already verified in data/players.ts.
  const normalized = normalizePlayerName(raw.replace(/-/g, " "));
  const aliasMatch = canonicalNameToSlug.get(normalized);
  if (aliasMatch) return aliasMatch;

  // If the alias was not verified, keep the strict safety rules so random
  // initials, doubles teams and feed fragments do not become player links.
  if (!isSafePlayerCandidate(raw)) return null;

  return null;
}

export function looksLikeClearlyInvalidPlayerSlug(nameOrSlug: string) {
  const raw = String(nameOrSlug || "").trim();
  const slug = playerSlug(raw);

  if (!slug) return true;
  if (isDoublesTeam(raw)) return true;
  if (hasInitialOnlyName(raw) || /(^|-)[a-z]\.-/.test(raw.toLowerCase())) return true;

  if (!getCanonicalPlayerSlug(raw) && looksLikeUnverifiedDoublesSlug(raw)) {
    return true;
  }

  return false;
}

export function shouldShowAsPlayerLink(nameOrSlug: string) {
  return Boolean(getCanonicalPlayerSlug(nameOrSlug));
}

export function playerNameFromSlug(slug: string) {
  const raw = String(slug || "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!raw) return "Tennis Player";

  return raw
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isKnownPlayerSlug(slug: string) {
  return Boolean(getCanonicalPlayerSlug(slug));
}


export function normalizeMatchParticipantName(name?: string | null) {
  const raw = String(name || "")
    .replace(/ /g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!raw) return null;
  if (isDoublesTeam(raw)) return null;

  const cleaned = raw
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(?:ATP|WTA|ITF|Challenger|Added|Unknown|TBD|Bye)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;
  if (hasInitialOnlyName(cleaned)) return null;
  if (/^[a-z]{1,4}\.?$/i.test(cleaned)) return null;
  if (!/[a-z]/i.test(cleaned)) return null;

  return cleaned;
}


export function displayPlayerName(nameOrSlug?: string | null) {
  const raw = String(nameOrSlug || "").trim();
  if (!raw) return "Tennis Player";

  const canonicalSlug = getCanonicalPlayerSlug(raw);
  if (canonicalSlug) return players[canonicalSlug].name;

  return raw;
}

export function verifiedPlayerNameForLink(nameOrSlug?: string | null) {
  const cleaned = normalizeMatchParticipantName(nameOrSlug);
  if (!cleaned) return null;

  const canonicalSlug = getCanonicalPlayerSlug(cleaned);
  if (!canonicalSlug) return null;

  return players[canonicalSlug].name;
}

export function verifiedPlayerUrl(nameOrSlug?: string | null) {
  const cleaned = normalizeMatchParticipantName(nameOrSlug);
  if (!cleaned) return null;

  return safePlayerUrl(cleaned);
}

export function verifiedPlayersFromMatchSide(name?: string | null) {
  const raw = String(name || "").trim();
  if (!raw || isDoublesTeam(raw)) return [];

  const verifiedName = verifiedPlayerNameForLink(raw);
  return verifiedName ? [verifiedName] : [];
}

export function safePlayerUrl(nameOrSlug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(nameOrSlug);
  return canonicalSlug ? `/player/${canonicalSlug}` : null;
}

// Use this only for generic fallbacks. UI that labels a specific player should
// prefer safePlayerUrl() and render plain text when it returns null.
export function playerUrl(name: string) {
  return safePlayerUrl(name) || "/players";
}

export function safeWatchPlayerLiveUrl(nameOrSlug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(nameOrSlug);
  return canonicalSlug ? `/watch-player-live/${canonicalSlug}` : null;
}

export function watchPlayerLiveUrl(nameOrSlug: string) {
  return safeWatchPlayerLiveUrl(nameOrSlug) || "/players/live-now";
}

export function slugToPlayerName(slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);
  if (canonicalSlug) return players[canonicalSlug].name;

  return String(slug || "").replace(/-/g, " ");
}

export function playerNameMatchesSlug(playerName: string, slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);

  if (!canonicalSlug) return false;

  return getCanonicalPlayerSlug(playerName) === canonicalSlug;
}

type MatchParticipantFields = {
  event_first_player?: unknown;
  event_second_player?: unknown;
  firstPlayer?: unknown;
  secondPlayer?: unknown;
  player1?: unknown;
  player2?: unknown;
};

export function matchContainsExactPlayer(match: MatchParticipantFields | null | undefined, slug: string) {
  if (!match || !slug) return false;

  const canonicalSlug = getCanonicalPlayerSlug(slug);
  if (!canonicalSlug) return false;

  const canonicalPlayer = players[canonicalSlug];
  const aliases = [
    canonicalPlayer.name,
    canonicalPlayer.name
      .split(" ")
      .map((part, index) => (index === 0 ? `${part.charAt(0)}.` : part))
      .join(" "),
  ].map(normalizePlayerName);

  const fields: (keyof MatchParticipantFields)[] = [
    "event_first_player",
    "event_second_player",
    "firstPlayer",
    "secondPlayer",
    "player1",
    "player2",
  ];

  return fields.some((field) => {
    const value = match[field];
    if (typeof value !== "string") return false;

    const normalized = normalizePlayerName(value);
    return aliases.includes(normalized);
  });
}
