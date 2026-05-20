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

  const fields = [
    "event_first_player",
    "event_second_player",
    "firstPlayer",
    "secondPlayer",
    "player1",
    "player2",
  ];

  for (const field of fields) {
    const val = match[field];
    if (typeof val === "string" && playerNameMatchesSlug(val, slug)) {
      return true;
    }
  }

  return false;
}