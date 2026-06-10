type ApiTennisOptions = {
  timeoutMs?: number;
  cacheSeconds?: number;
};

function shouldLogApiTennis() {
  return process.env.LOG_API_TENNIS === "1" || process.env.DEBUG_API_TENNIS === "1";
}

function getPayloadSizeBytes(text: string) {
  return new TextEncoder().encode(text).length;
}

function logApiTennisRequest(method: string, payloadSize: number, duration: number) {
  if (!shouldLogApiTennis()) return;
  console.log("[API-TENNIS]", method, payloadSize, duration);
}

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
  const startedAt = Date.now();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: options.cacheSeconds ? { revalidate: options.cacheSeconds } : undefined,
      cache: options.cacheSeconds ? undefined : "no-store",
    });

    const text = await response.text().catch(() => "");
    const payloadSize = getPayloadSizeBytes(text);
    logApiTennisRequest(method, payloadSize, Date.now() - startedAt);

    if (!response.ok) return null;

    let payload: { success?: number; result?: unknown } | null = null;

    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      return null;
    }

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
