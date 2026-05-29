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

const canonicalNameToSlug = new Map<string, PlayerSlug>(
  Object.entries(players).flatMap(([slug, player]) => {
    const canonicalSlug = slug as PlayerSlug;
    const normalizedName = normalizePlayerName(player.name);
    const reversedName = normalizePlayerName(player.name.split(" ").reverse().join(" "));

    return [
      [normalizedName, canonicalSlug],
      [reversedName, canonicalSlug],
      [normalizePlayerName(slug.replace(/-/g, " ")), canonicalSlug],
    ];
  })
);

export function hasInitialOnlyName(nameOrSlug: string) {
  return /(^|\s|-)\p{L}\.(?=\s|-|$)/u.test(String(nameOrSlug || ""));
}

export function looksLikeUnverifiedDoublesSlug(nameOrSlug: string) {
  const raw = String(nameOrSlug || "").trim();
  const slug = playerSlug(raw);

  // API feeds sometimes expose doubles teams or match fragments as hyphenated
  // surname chains: "detiuc-khromacheva", "moutet-van-assche",
  // "bennani-lopez-morillo". If such slug is not canonical, do not let it
  // enter the player page pipeline.
  return slug.includes("-");
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
  if (!isSafePlayerCandidate(raw)) return null;

  const normalized = normalizePlayerName(raw.replace(/-/g, " "));
  return canonicalNameToSlug.get(normalized) ?? null;
}


export function looksLikeClearlyInvalidPlayerSlug(nameOrSlug: string) {
  const raw = String(nameOrSlug || "").trim();
  const slug = playerSlug(raw);

  if (!slug) return true;
  if (isDoublesTeam(raw)) return true;
  if (hasInitialOnlyName(raw) || /(^|-)[a-z]\.-/.test(raw.toLowerCase())) return true;

  // Common bad links generated from doubles teams or match fragments are
  // non-canonical hyphenated slugs. Examples seen in production logs:
  // /player/berkieta-nagoudi, /player/moutet-van-assche,
  // /player/bennani-lopez-morillo. Canonical players such as jannik-sinner
  // are protected by getCanonicalPlayerSlug(raw).
  if (!getCanonicalPlayerSlug(raw) && looksLikeUnverifiedDoublesSlug(raw)) {
    return true;
  }

  return false;
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

export function isDoublesTeam(name?: string | null) {
  return /\s*[/&+]\s*/.test(String(name || ""));
}

export function safePlayerUrl(nameOrSlug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(nameOrSlug);
  return canonicalSlug ? `/player/${canonicalSlug}` : null;
}

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

export function matchContainsExactPlayer(match: any, slug: string) {
  if (!match || !slug) return false;

  const canonicalSlug = getCanonicalPlayerSlug(slug);
  if (!canonicalSlug) return false;

  const canonicalPlayer = players[canonicalSlug];
  const aliases = [
    canonicalPlayer.name,
    canonicalPlayer.name
      .split(" ")
      .map((part, index, arr) => (index === 0 ? `${part.charAt(0)}.` : part))
      .join(" "),
  ].map(normalizePlayerName);

  const fields = [
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
    return aliases.some((alias) => normalized === alias || normalized.includes(alias));
  });
}
