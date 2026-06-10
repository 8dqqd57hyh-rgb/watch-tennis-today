type ApiTennisOptions = {
  timeoutMs?: number;
  cacheSeconds?: number;
};

export async function fetchApiTennisResult<T>(
  method: string,
  params: Record<string, string | number | null | undefined> = {},
  options: ApiTennisOptions = {}
): Promise<T | null> {
  const apiKey = process.env.API_TENNIS_KEY;

  if (!apiKey) return null;

  const url = new URL("https://api.api-tennis.com/tennis/");
  url.searchParams.set("method", method);
  url.searchParams.set("APIkey", apiKey);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs || 6500);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: options.cacheSeconds ? { revalidate: options.cacheSeconds } : undefined,
      cache: options.cacheSeconds ? undefined : "no-store",
    });

    if (!response.ok) return null;

    const payload = await response.json().catch(() => null);

    if (!payload || payload.success !== 1) return null;

    return (payload.result ?? null) as T | null;
  } catch (error) {
    const message = error instanceof Error ? error.name : "unknown";

    if (message !== "AbortError" && process.env.DEBUG_API_TENNIS === "1") {
      console.info(`API-Tennis ${method} skipped (${message})`);
    }

    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchApiTennisArray<T>(
  method: string,
  params: Record<string, string | number | null | undefined> = {},
  options: ApiTennisOptions = {}
): Promise<T[]> {
  const result = await fetchApiTennisResult<T[]>(method, params, options);

  return Array.isArray(result) ? result : [];
}
