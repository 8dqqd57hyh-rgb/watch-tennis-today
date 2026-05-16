export function playerSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function playerUrl(name: string) {
  return `/player/${playerSlug(name)}`;
}

export function watchPlayerLiveUrl(name: string) {
  return `/watch-player-live/${playerSlug(name)}`;
}