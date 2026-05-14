export function withTracking(url: string, source: string) {
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}utm_source=watchtennistoday&utm_medium=referral&utm_campaign=${source}`;
}