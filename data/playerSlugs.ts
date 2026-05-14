export function playerSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function playerUrl(name: string) {
  return `/player/${playerSlug(name)}`;
}