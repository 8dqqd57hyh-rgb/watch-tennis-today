import { normalizeMatchStatus } from "@/app/lib/matchStatus";

export type ProviderMatchIdentityFields = {
  event_key?: string | number | null;
  tournament_key?: string | number | null;
  tournament_name?: string | null;
  tournament_round?: string | null;
  event_first_player?: string | null;
  event_second_player?: string | null;
  first_player_key?: string | number | null;
  second_player_key?: string | number | null;
  event_date?: string | null;
  event_time?: string | null;
  event_status?: string | null;
  event_live?: string | number | null;
  event_final_result?: string | null;
  updated_at?: string | null;
  event_updated_at?: string | null;
};

function normalized(value?: string | number | null) {
  return String(value ?? "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getProviderMatchIdentity(match: ProviderMatchIdentityFields) {
  const eventId = normalized(match.event_key);
  if (eventId) return `event:${eventId}`;

  const participants = [
    normalized(match.first_player_key) || normalized(match.event_first_player),
    normalized(match.second_player_key) || normalized(match.event_second_player),
  ].sort();

  return [
    "fallback",
    normalized(match.tournament_key) || normalized(match.tournament_name),
    participants.join("-vs-"),
    normalized(match.event_date),
    normalized(match.event_time),
    normalized(match.tournament_round),
  ].join(":");
}

function freshnessTime(match: ProviderMatchIdentityFields) {
  for (const value of [match.event_updated_at, match.updated_at]) {
    const timestamp = Date.parse(String(value || ""));
    if (!Number.isNaN(timestamp)) return timestamp;
  }
  return 0;
}

function informationScore(match: ProviderMatchIdentityFields) {
  const status = normalizeMatchStatus(match.event_status);
  const explicitStatus = status === "UNKNOWN" ? 0 : 20;
  const live = String(match.event_live ?? "") === "1" ? 10 : 0;
  const result = match.event_final_result && !["-", "0-0"].includes(match.event_final_result.trim()) ? 5 : 0;
  return explicitStatus + live + result;
}

function preferCurrent<T extends ProviderMatchIdentityFields>(existing: T, candidate: T) {
  const existingFreshness = freshnessTime(existing);
  const candidateFreshness = freshnessTime(candidate);
  if (candidateFreshness !== existingFreshness) return candidateFreshness > existingFreshness ? candidate : existing;

  const existingScore = informationScore(existing);
  const candidateScore = informationScore(candidate);
  if (candidateScore !== existingScore) return candidateScore > existingScore ? candidate : existing;

  // Callers order broad/archived rows first and fresher live rows last.
  return candidate;
}

export function dedupeProviderMatches<T extends ProviderMatchIdentityFields>(matches: T[]) {
  const unique = new Map<string, T>();
  for (const match of matches) {
    const identity = getProviderMatchIdentity(match);
    const existing = unique.get(identity);
    unique.set(identity, existing ? preferCurrent(existing, match) : match);
  }
  return Array.from(unique.values());
}

export function providerMatchContainsPlayer(
  match: ProviderMatchIdentityFields,
  player: { key?: string | number | null; nameMatches: (name: string) => boolean }
) {
  const participantKeys = [match.first_player_key, match.second_player_key]
    .map((value) => normalized(value))
    .filter(Boolean);
  const targetKey = normalized(player.key);

  if (targetKey && participantKeys.length > 0) return participantKeys.includes(targetKey);
  return [match.event_first_player, match.event_second_player].some((name) => player.nameMatches(String(name || "")));
}

export function inferProviderPlayerKey(
  matches: ProviderMatchIdentityFields[],
  nameMatches: (name: string) => boolean
) {
  const keys = new Set<string>();
  for (const match of matches) {
    if (nameMatches(String(match.event_first_player || ""))) {
      const key = normalized(match.first_player_key);
      if (key) keys.add(key);
    }
    if (nameMatches(String(match.event_second_player || ""))) {
      const key = normalized(match.second_player_key);
      if (key) keys.add(key);
    }
  }
  return keys.size === 1 ? Array.from(keys)[0] : null;
}
