export type ClientMatch = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score?: string;
  startTime?: string;
  [key: string]: unknown;
};

type CacheEntry = {
  expiresAt: number;
  promise: Promise<ClientMatch[]>;
};

const DEFAULT_TTL_MS = 60_000;
const cache = new Map<string, CacheEntry>();

function normalizeMatches(data: unknown): ClientMatch[] {
  if (Array.isArray(data)) return data as ClientMatch[];

  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { matches?: unknown }).matches)
  ) {
    return (data as { matches: ClientMatch[] }).matches;
  }

  return [];
}

function withTimeout(signal: AbortSignal | undefined, timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  if (signal) {
    if (signal.aborted) controller.abort();
    signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  return { signal: controller.signal, clear: () => window.clearTimeout(timeoutId) };
}

export async function fetchClientMatches(
  url = "/api/matches",
  options: { ttlMs?: number; timeoutMs?: number; signal?: AbortSignal } = {}
) {
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const cacheKey = url;
  const now = Date.now();
  const cached = cache.get(cacheKey);

  if (cached && cached.expiresAt > now) {
    return cached.promise;
  }

  const timeout = withTimeout(options.signal, options.timeoutMs ?? 6000);

  const promise = fetch(url, { signal: timeout.signal })
    .then(async (response) => {
      if (!response.ok) return [];
      return normalizeMatches(await response.json());
    })
    .catch((error) => {
      cache.delete(cacheKey);
      throw error;
    })
    .finally(timeout.clear);

  cache.set(cacheKey, {
    expiresAt: now + ttlMs,
    promise,
  });

  return promise;
}
