import { headers } from "next/headers";

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
  watchProviders: {
    name: string;
    url: string;
    accessType?: string;
    verificationStatus?: string;
    note?: string;
  }[];
  [key: string]: unknown;
};

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) return "http://localhost:3000";

  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
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

async function fetchServerMatches(path: string, revalidateSeconds = 60): Promise<ServerMatch[]> {
  const baseUrl = await getBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      signal: controller.signal,
      next: { revalidate: revalidateSeconds },
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

export async function getServerMatchById(matchId: string, revalidateSeconds = 30): Promise<ServerMatch | null> {
  const matches = await fetchServerMatches(
    `/api/matches?matchId=${encodeURIComponent(matchId)}&daysBack=1&daysForward=7`,
    revalidateSeconds
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
