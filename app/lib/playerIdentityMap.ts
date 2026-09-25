type ProviderIdentityMap = Record<string, string | number | { playerId?: string | number; playerKey?: string | number }>;

function configuredMap(): ProviderIdentityMap {
  const raw = process.env.PLAYER_PROVIDER_ID_MAP;
  if (!raw) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed as ProviderIdentityMap
      : {};
  } catch {
    console.warn("PLAYER_PROVIDER_ID_MAP is not valid JSON");
    return {};
  }
}

export function getConfiguredProviderPlayerId(slug?: string | null, playerName?: string | null) {
  const map = configuredMap();
  const keys = [slug, playerName?.toLowerCase().replace(/[^a-z0-9]+/g, "-")].filter(Boolean) as string[];

  for (const key of keys) {
    const value = map[key];
    const providerId = typeof value === "object" ? value.playerId ?? value.playerKey : value;
    if (typeof providerId === "string" || typeof providerId === "number") {
      const normalized = String(providerId).trim();
      if (normalized) return normalized;
    }
  }

  return null;
}
