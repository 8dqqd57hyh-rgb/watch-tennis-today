import { SITE_URL } from "@/app/lib/technicalSeo";

export type ServerMatch = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  pointScore?: string | null;
  startTime: string | null;
  round?: string;
  court?: string | null;
  surface?: string | null;
  watchProviders: {
    name: string;
    url: string;
    accessType?: string;
    verificationStatus?: string;
    note?: string;
  }[];
  [key: string]: unknown;
};

export function getBaseUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!configuredUrl) return SITE_URL;

  try {
    const url = new URL(configuredUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return SITE_URL;
    }

    return url.origin;
  } catch {
    return SITE_URL;
  }
}

function normalizeMatch(item: ServerMatch): ServerMatch {
  return {
    ...item,
    score: item.score || "",
    startTime: item.startTime ?? null,
    watchProviders: Array.isArray(item.watchProviders) ? item.watchProviders : [],
  };
}

function normalizeMatches(data: unknown): ServerMatch[] {
  const rawMatches = Array.isArray(data)
    ? data
    : data &&
        typeof data === "object" &&
        Array.isArray((data as { matches?: unknown }).matches)
      ? (data as { matches: unknown[] }).matches
      : [];

  return rawMatches.map((item) => normalizeMatch(item as ServerMatch));
}

async function fetchServerMatches(
  path: string,
  revalidateSeconds = 60,
  options: { timeoutMs?: number; noStore?: boolean } = {}
): Promise<ServerMatch[]> {
  const baseUrl = getBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs ?? 5000);
  const developmentCacheBust =
    process.env.NODE_ENV === "development"
      ? `${path.includes("?") ? "&" : "?"}_=${Date.now()}`
      : "";
  const requestPath = `${path}${developmentCacheBust}`;

  try {
    const response = await fetch(`${baseUrl}${requestPath}`, {
      signal: controller.signal,
      ...(options.noStore ? { cache: "no-store" as const } : { next: { revalidate: revalidateSeconds } }),
    });

    if (!response.ok) return [];

    return normalizeMatches(await response.json());
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getServerMatches(revalidateSeconds = 60): Promise<ServerMatch[]> {
  return fetchServerMatches("/api/matches", revalidateSeconds);
}

export async function getLiveTennisPageMatches(revalidateSeconds = 60): Promise<ServerMatch[]> {
  return fetchServerMatches("/api/matches?includeFinished=1&daysBack=1&daysForward=1", revalidateSeconds, {
    timeoutMs: 5000,
  });
}

export async function getLiveTennisUpsetMatches(revalidateSeconds = 60): Promise<ServerMatch[]> {
  return fetchServerMatches(
    "/api/matches?includeFinished=1&includeRankings=1&daysBack=1&daysForward=1",
    revalidateSeconds,
    { timeoutMs: 10000 }
  );
}

export async function getServerMatchesWindow({
  revalidateSeconds = 60,
  timeoutMs,
  noStore,
  includeFinished = false,
  includeRankings = false,
  daysBack = 3,
  daysForward = 3,
}: {
  revalidateSeconds?: number;
  timeoutMs?: number;
  noStore?: boolean;
  includeFinished?: boolean;
  includeRankings?: boolean;
  daysBack?: number;
  daysForward?: number;
}): Promise<ServerMatch[]> {
  const params = new URLSearchParams({
    daysBack: String(daysBack),
    daysForward: String(daysForward),
  });

  if (includeFinished) {
    params.set("includeFinished", "1");
  }

  if (includeRankings) {
    params.set("includeRankings", "1");
  }

  return fetchServerMatches(`/api/matches?${params.toString()}`, revalidateSeconds, {
    timeoutMs,
    noStore,
  });
}

export async function getServerMatchById(matchId: string, revalidateSeconds = 30): Promise<ServerMatch | null> {
  const matches = await fetchServerMatches(
    `/api/matches?matchId=${encodeURIComponent(matchId)}&daysBack=1&daysForward=7`,
    revalidateSeconds,
    { timeoutMs: 15000 }
  );

  return matches.find((match) => String(match.id) === String(matchId)) || null;
}


export async function getServerMatchesForPlayer(
  playerName: string,
  revalidateSeconds = 300
): Promise<ServerMatch[]> {
  const normalizedPlayerName = playerName.trim().toLowerCase();

  if (!normalizedPlayerName) return [];

  const matches = await fetchServerMatches(
    `/api/matches?playerName=${encodeURIComponent(playerName)}&includeFinished=1&daysBack=30&daysForward=30`,
    revalidateSeconds
  );

  return matches.filter((match) => {
    const player1 = String(match.player1 || "").toLowerCase();
    const player2 = String(match.player2 || "").toLowerCase();

    return player1.includes(normalizedPlayerName) || player2.includes(normalizedPlayerName);
  });
}
