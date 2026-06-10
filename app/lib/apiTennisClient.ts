type ApiTennisOptions = {
  timeoutMs?: number;
  cacheSeconds?: number;
  logLabel?: string;
  onMeta?: (meta: ApiTennisFetchMeta) => void;
};

export type ApiTennisFetchMeta = {
  method: string;
  label?: string;
  payloadSizeBytes: number;
  resultCount: number | null;
  durationMs: number;
  cacheMode: "next-revalidate" | "no-store";
  cacheSeconds?: number;
  cacheStatus: "eligible" | "near-limit" | "too-large";
};

function shouldLogApiTennis() {
  return process.env.LOG_API_TENNIS === "1" || process.env.DEBUG_API_TENNIS === "1";
}

function getPayloadSizeBytes(text: string) {
  return new TextEncoder().encode(text).length;
}

function getCacheStatus(payloadSizeBytes: number): ApiTennisFetchMeta["cacheStatus"] {
  if (payloadSizeBytes >= 1_900_000) return "too-large";
  if (payloadSizeBytes >= 1_000_000) return "near-limit";
  return "eligible";
}

function logApiTennisRequest(meta: ApiTennisFetchMeta) {
  if (!shouldLogApiTennis()) return;
  console.log("[API-TENNIS]", {
    method: meta.method,
    label: meta.label,
    payloadSizeBytes: meta.payloadSizeBytes,
    resultCount: meta.resultCount,
    durationMs: meta.durationMs,
    cacheMode: meta.cacheMode,
    cacheSeconds: meta.cacheSeconds,
    cacheStatus: meta.cacheStatus,
  });
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

    if (!response.ok) return null;

    let payload: { success?: number; result?: unknown } | null = null;

    try {
      payload = text ? JSON.parse(text) : null;
    } catch {
      return null;
    }

    if (!payload || payload.success !== 1) return null;

    const result = payload.result ?? null;
    const resultCount = Array.isArray(result) ? result.length : null;
    const meta: ApiTennisFetchMeta = {
      method,
      label: options.logLabel,
      payloadSizeBytes: payloadSize,
      resultCount,
      durationMs: Date.now() - startedAt,
      cacheMode: options.cacheSeconds ? "next-revalidate" : "no-store",
      cacheSeconds: options.cacheSeconds,
      cacheStatus: getCacheStatus(payloadSize),
    };

    logApiTennisRequest(meta);
    options.onMeta?.(meta);

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
