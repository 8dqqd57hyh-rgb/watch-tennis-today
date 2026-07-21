import type { ServerMatch } from "@/app/lib/serverMatches";

export type WimbledonFinalStatus = "scheduled" | "live" | "completed" | "suspended" | "postponed" | "cancelled";
export type WimbledonEventType =
  | "mens-singles" | "womens-singles" | "mens-doubles" | "womens-doubles" | "mixed-doubles"
  | "boys-singles" | "girls-singles" | "boys-doubles" | "girls-doubles"
  | "mens-wheelchair-singles" | "womens-wheelchair-singles" | "quad-wheelchair-singles"
  | "mens-wheelchair-doubles" | "womens-wheelchair-doubles" | "quad-wheelchair-doubles"
  | "invitation" | "other";

export type WimbledonFinalParticipant = {
  displayName: string;
  players: { name: string; slug: string | null; ranking: number | null }[];
};

export type WimbledonFinal = {
  id: string;
  eventType: WimbledonEventType;
  eventLabel: string;
  participants: WimbledonFinalParticipant[];
  status: WimbledonFinalStatus;
  providerStatus: string;
  startTime: string | null;
  score: string;
  pointScore: string | null;
  winnerParticipantIndex: number | null;
  round: string | null;
  watchProviders: ServerMatch["watchProviders"];
  matchUrl: string;
};

function text(value: unknown) {
  return String(value ?? "").normalize("NFKD").replace(/[’‘`]/g, "'").replace(/[^a-zA-Z0-9]+/g, " ").trim().toLowerCase();
}

export function isWimbledonTournament(match: Pick<ServerMatch, "tournament" | "category">) {
  const tournament = text(match.tournament);
  if (!/(^| )wimbledon( |$)|the championships/.test(tournament)) return false;
  return !/(qualif|pre qualif|wild card playoff|wimbledon park|roehampton|challenger|itf)/.test(tournament);
}

export function isFinalRound(round?: string | null) {
  const value = text(round);
  if (!value || /(semi|quarter|qualif|consolation|playoff|third place)/.test(value)) return false;
  return /^(f|final|finals|final round|championship match)$/.test(value);
}

function eventText(match: ServerMatch) { return text(`${match.tournament} ${match.category} ${match.round}`); }

export function getWimbledonEventType(match: ServerMatch): WimbledonEventType {
  const value = eventText(match);
  const doubles = /double|pair/.test(value) || /\s[/&+]\s/.test(`${match.player1} ${match.player2}`);
  if (/invitation|legends|veteran/.test(value)) return "invitation";
  if (/quad/.test(value)) return doubles ? "quad-wheelchair-doubles" : "quad-wheelchair-singles";
  if (/wheelchair/.test(value)) {
    if (/women|women's|womens|ladies|female/.test(value)) return doubles ? "womens-wheelchair-doubles" : "womens-wheelchair-singles";
    return doubles ? "mens-wheelchair-doubles" : "mens-wheelchair-singles";
  }
  if (/boy|junior men/.test(value)) return doubles ? "boys-doubles" : "boys-singles";
  if (/girl|junior women/.test(value)) return doubles ? "girls-doubles" : "girls-singles";
  if (/mixed/.test(value)) return "mixed-doubles";
  if (/women|women's|womens|wta|ladies|female/.test(value)) return doubles ? "womens-doubles" : "womens-singles";
  if (/men|men's|mens|atp|gentlemen|male/.test(value)) return doubles ? "mens-doubles" : "mens-singles";
  return "other";
}

const LABELS: Record<WimbledonEventType, string> = {
  "mens-singles": "Gentlemen's Singles Final", "womens-singles": "Ladies' Singles Final",
  "mens-doubles": "Gentlemen's Doubles Final", "womens-doubles": "Ladies' Doubles Final", "mixed-doubles": "Mixed Doubles Final",
  "boys-singles": "Boys' Singles Final", "girls-singles": "Girls' Singles Final", "boys-doubles": "Boys' Doubles Final", "girls-doubles": "Girls' Doubles Final",
  "mens-wheelchair-singles": "Gentlemen's Wheelchair Singles Final", "womens-wheelchair-singles": "Ladies' Wheelchair Singles Final", "quad-wheelchair-singles": "Quad Wheelchair Singles Final",
  "mens-wheelchair-doubles": "Gentlemen's Wheelchair Doubles Final", "womens-wheelchair-doubles": "Ladies' Wheelchair Doubles Final", "quad-wheelchair-doubles": "Quad Wheelchair Doubles Final",
  invitation: "Invitation Final", other: "Championship Final",
};

export function normalizeFinalStatus(status: unknown): WimbledonFinalStatus {
  const value = text(status);
  if (/live|in progress/.test(value)) return "live";
  if (/finish|complete|retir|walkover/.test(value)) return "completed";
  if (/suspend|interrupt|delay/.test(value)) return "suspended";
  if (/postpon/.test(value)) return "postponed";
  if (/cancel/.test(value)) return "cancelled";
  return "scheduled";
}

function slug(name: string) { const value = text(name).replace(/ /g, "-"); return value && !/^(tbd|tba|unknown|opponent-to-be-confirmed)$/.test(value) ? value : null; }
function participant(name: string, ranking: unknown): WimbledonFinalParticipant {
  const players = name.split(/\s+(?:\/|&|\+)\s+/).map((item) => item.trim()).filter(Boolean);
  const parsedRanking = typeof ranking === "number" && ranking > 0 ? ranking : null;
  return { displayName: name, players: players.map((player) => ({ name: player, slug: slug(player), ranking: players.length === 1 ? parsedRanking : null })) };
}

function winnerIndex(match: ServerMatch) {
  const winner = text(match.winner);
  if (!winner || !["finished", "completed", "retired", "walkover"].some((value) => text(match.status).includes(value))) return null;
  const p1 = text(match.player1); const p2 = text(match.player2);
  if (winner === "first player" || winner === "1" || winner === p1) return 0;
  if (winner === "second player" || winner === "2" || winner === p2) return 1;
  return null;
}

function completeness(match: ServerMatch) {
  const status = normalizeFinalStatus(match.status);
  return (status === "live" ? 100 : 0) + (status === "completed" && match.score ? 70 : 0) + (match.startTime ? 10 : 0) + (match.player1 && match.player2 ? 10 : 0);
}

export function selectWimbledonFinals(matches: ServerMatch[]): WimbledonFinal[] {
  const selected = new Map<string, ServerMatch>();
  for (const match of matches) {
    if (!isWimbledonTournament(match) || !isFinalRound(match.round)) continue;
    const fallback = [text(match.tournament), text(match.player1), text(match.player2), text(match.round), String(match.startTime || "").slice(0, 10)].join("|");
    const key = match.id && match.id !== "unknown-id" ? String(match.id) : fallback;
    const current = selected.get(key);
    if (!current || completeness(match) > completeness(current)) selected.set(key, match);
  }
  return [...selected.values()].map((match) => ({
    id: String(match.id), eventType: getWimbledonEventType(match), eventLabel: LABELS[getWimbledonEventType(match)],
    participants: [participant(match.player1, match.ranking1), participant(match.player2, match.ranking2)],
    status: normalizeFinalStatus(match.status), providerStatus: String(match.status || "Scheduled"), startTime: typeof match.resumeTime === "string" ? match.resumeTime : match.startTime,
    score: match.score || "", pointScore: typeof match.pointScore === "string" ? match.pointScore : null,
    winnerParticipantIndex: winnerIndex(match), round: match.round || null, watchProviders: match.watchProviders || [],
    matchUrl: String(match.id).startsWith("wimbledon-") ? "/wimbledon-live" : `/watch/${encodeURIComponent(String(match.id))}`,
  })).sort((a, b) => {
    const priority = (item: WimbledonFinal) => item.eventType === "womens-singles" ? 0 : item.eventType === "mens-singles" ? 1 : 2;
    return priority(a) - priority(b) || String(a.startTime || "9999").localeCompare(String(b.startTime || "9999"));
  });
}
