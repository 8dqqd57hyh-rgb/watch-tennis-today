import { normalizePlayerIdentity, playerIdentityMatches } from "@/app/lib/playerIdentity";
import { normalizeMatchStartTime } from "@/app/lib/matchNormalization";

export type OfficialTournamentMatch = {
  id: string;
  player1: string;
  player2: string;
  opponentName: string;
  tournament: string;
  tournamentCategory: string;
  category: string;
  status: "UPCOMING";
  round: string;
  score: string;
  pointScore: null;
  startTime: string;
  datetime: string;
  winner: null;
  winnerId: null;
  watchProviders: never[];
};

function htmlText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function firstMatch(text: string, patterns: RegExp[]) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function parseTournamentDate(text: string) {
  const match = text.match(/\b(\d{1,2})\s*[-–]\s*\d{1,2}\s+([A-Za-z]+),?\s+(\d{4})\b/);
  if (!match) return null;
  const month = new Date(`${match[2]} 1, ${match[3]} UTC`);
  if (Number.isNaN(month.getTime())) return null;
  return normalizeMatchStartTime(`${match[3]}-${String(month.getUTCMonth() + 1).padStart(2, "0")}-${match[1].padStart(2, "0")}`);
}

export function parseOfficialTournamentPage(html: string, playerName: string, sourceUrl: string, index = 0): OfficialTournamentMatch | null {
  const text = htmlText(html);
  const normalizedText = normalizePlayerIdentity(text);
  const normalizedName = normalizePlayerIdentity(playerName);
  const lastName = normalizedName.split(/\s+/).at(-1) || normalizedName;
  const playerFound = normalizedText.includes(normalizedName) || normalizedText.includes(lastName) ||
    text.split(/\bWho is Playing\b|\bPlayers\b|\bEntry List\b/i).some((section) =>
      section.split(/[|,;\n]/).some((candidate) => playerIdentityMatches(playerName, candidate))
    );
  if (!playerFound) return null;

  const tournament = firstMatch(text, [
    /TOURNAMENTS\s+([^|]+?)\s+(?:Tickets|Tournament Details)/i,
    /(?:^|\s)([A-Z][A-Za-z0-9 '&-]+(?:Open|Cup|Masters|Finals))\s+(?:23|24|25|26|27|28|29|30)\s*[-–]/i,
  ]);
  const dateText = text.match(/\b\d{1,2}\s*[-–]\s*\d{1,2}\s+[A-Za-z]+,?\s+\d{4}\b/)?.[0];
  const startTime = parseTournamentDate(text);
  if (!tournament || !startTime || !dateText) return null;

  const category = text.match(/\b(ATP\s+(?:\d{3}|Finals)|Grand Slam)\b/i)?.[1] || "ATP";
  const slug = sourceUrl.split("/").filter(Boolean).at(-2) || "tournament";

  console.log(`[TournamentResolver] Found player in official tournament entity: "${tournament}" starting on ${startTime}`);
  return {
    id: `official-tournament:${slug}:${startTime}:${index}`,
    player1: playerName,
    player2: "TBD",
    opponentName: "TBD",
    tournament,
    tournamentCategory: category,
    category,
    status: "UPCOMING",
    round: "",
    score: "",
    pointScore: null,
    startTime,
    datetime: startTime,
    winner: null,
    winnerId: null,
    watchProviders: [],
  };
}

function tournamentOverviewUrls(html: string) {
  const urls = [
    ...Array.from(html.matchAll(/href=["'](\/en\/tournaments\/[^"']+\/\d+\/overview(?:\?[^"']*)?)["']/gi)).map((match) => match[1]),
    ...Array.from(html.matchAll(/https?:\/\/www\.atptour\.com(\/en\/tournaments\/[^\s<"']+\/\d+\/overview(?:\?[^\s<"']*)?)/gi)).map((match) => match[1]),
    ...Array.from(html.matchAll(/<loc>(https?:\/\/www\.atptour\.com\/en\/tournaments\/[^<]+\/\d+\/overview[^<]*)<\/loc>/gi)).map((match) => match[1]),
  ].map((url) => url.startsWith("http") ? url : `https://www.atptour.com${url}`);
  return Array.from(new Set(urls));
}

function configuredOfficialFeedUrl() {
  return process.env.ATP_OFFICIAL_TOURNAMENT_FEED_URL || process.env.OFFICIAL_TOURNAMENT_FEED_URL || null;
}

async function fetchConfiguredOfficialFeed(playerName: string, signal: AbortSignal) {
  const configuredUrl = configuredOfficialFeedUrl();
  if (!configuredUrl) return null;

  try {
    const url = new URL(configuredUrl);
    url.searchParams.set("playerName", playerName);
    url.searchParams.set("dateStart", new Date().toISOString().slice(0, 10));
    const response = await fetch(url, {
      cache: "no-store",
      signal,
      headers: { "user-agent": "WatchTennisToday/official-schedule-resolver" },
    });
    if (!response.ok) return null;

    const body = await response.text();
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("json")) {
      const payload = JSON.parse(body) as { html?: string; pages?: { url: string; html: string }[] };
      if (payload.html) return parseOfficialTournamentPage(payload.html, playerName, configuredUrl);
      for (const page of payload.pages ?? []) {
        const match = parseOfficialTournamentPage(page.html, playerName, page.url);
        if (match) return match;
      }
      return null;
    }

    return parseOfficialTournamentPage(body, playerName, configuredUrl);
  } catch {
    return null;
  }
}

async function fetchOfficialIndex(url: string, signal: AbortSignal) {
  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal,
      headers: { "user-agent": "WatchTennisToday/official-schedule-resolver" },
    });
    return response.ok ? response.text() : "";
  } catch {
    return "";
  }
}

export async function resolveOfficialTournamentMatch(playerName: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const configuredMatch = await fetchConfiguredOfficialFeed(playerName, controller.signal);
    if (configuredMatch) return configuredMatch;

    const indexPages = await Promise.all([
      fetchOfficialIndex("https://www.atptour.com/en/scores/current", controller.signal),
      fetchOfficialIndex("https://www.atptour.com/en/tournaments", controller.signal),
      fetchOfficialIndex("https://www.atptour.com/sitemap.xml", controller.signal),
    ]);
    const urls = Array.from(new Set(indexPages.flatMap(tournamentOverviewUrls))).slice(0, 20);
    console.log(`[TournamentResolver] Official tournament indexes discovered ${urls.length} candidate pages`);
    const pages = await Promise.all(urls.map(async (url) => {
      try {
        const pageResponse = await fetch(url, { cache: "no-store", signal: controller.signal });
        return pageResponse.ok ? { url, html: await pageResponse.text() } : null;
      } catch {
        return null;
      }
    }));
    for (const [index, page] of pages.entries()) {
      if (!page) continue;
      const match = parseOfficialTournamentPage(page.html, playerName, page.url, index);
      if (match) return match;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
