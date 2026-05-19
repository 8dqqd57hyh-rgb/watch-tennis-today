export function withTracking(url: string, source: string) {
  try {
    const parsed = new URL(url);

    parsed.searchParams.set("utm_source", "watchtennistoday");
    parsed.searchParams.set("utm_medium", "affiliate");
    parsed.searchParams.set("utm_campaign", source);

    return parsed.toString();
  } catch {
    return url;
  }
}
