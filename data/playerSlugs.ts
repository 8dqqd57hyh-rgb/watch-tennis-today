import { players, type PlayerSlug } from "./players";

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

export function getCanonicalPlayerSlug(nameOrSlug: string): PlayerSlug | null {
  const raw = String(nameOrSlug || "").trim();
  if (!raw) return null;

  if (raw in players) return raw as PlayerSlug;

  const normalized = normalizePlayerName(raw.replace(/-/g, " "));
  return canonicalNameToSlug.get(normalized) ?? null;
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
