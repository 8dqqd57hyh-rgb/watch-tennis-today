export function normalizePlayerName(name: string) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^\w\s.-]/g, " ") // replace punctuation with space
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

export function playerUrl(name: string) {
  return `/player/${playerSlug(name)}`;
}

export function slugToPlayerName(slug: string) {
  return String(slug || "").replace(/-/g, " ");
}

export function playerNameMatchesSlug(playerName: string, slug: string) {
  return (
    normalizePlayerName(playerName) ===
    normalizePlayerName(slugToPlayerName(slug))
  );
}

export function matchContainsExactPlayer(match: any, slug: string) {
  if (!match || !slug) return false;

  const parts = slug.toLowerCase().split("-").filter(Boolean);

  const firstName = parts[0];
  const lastName = parts[1];

  if (!firstName || !lastName) return false;

  const firstInitial = firstName.charAt(0);

  const fields = [
    "event_first_player",
    "event_second_player",
    "firstPlayer",
    "secondPlayer",
    "player1",
    "player2",
  ];

  const exactPlayerRegex = new RegExp(
    `(^|[^a-z])(${firstInitial}\\.?\\s*${lastName}|${firstName}\\s+${lastName}|${lastName}\\s+${firstInitial}\\.?|${lastName}\\s+${firstName})([^a-z]|$)`,
    "i"
  );

  return fields.some((field) => {
    const value = match[field];

    if (typeof value !== "string") return false;

    const normalized = normalizePlayerName(value);

    return exactPlayerRegex.test(normalized);
  });
}