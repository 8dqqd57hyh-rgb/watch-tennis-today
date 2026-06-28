export * from "./types";
export * from "./player";
export * from "./tournament";
export * from "./match";
export * from "./country";
export * from "./broadcaster";
export * from "./streaming";

import { enrichBroadcaster } from "./broadcaster";
import { enrichCountry } from "./country";
import { enrichMatch } from "./match";
import { enrichPlayer } from "./player";
import { enrichStreamingService } from "./streaming";
import { enrichTournament } from "./tournament";
import type { EnrichmentOptions } from "./types";

const cache = new Map<string, unknown>();

function cached<T>(key: string, factory: () => T): T {
  if (!cache.has(key)) cache.set(key, factory());
  return cache.get(key) as T;
}

export function clearEnrichmentCache() {
  cache.clear();
}

export function getEnrichmentCacheSize() {
  return cache.size;
}

export function getPlayerEnrichment(player: Parameters<typeof enrichPlayer>[0], options: EnrichmentOptions = {}) {
  return cached(`player:${player.slug ?? player.name}:${options.matches?.length ?? 0}`, () => enrichPlayer(player, options));
}

export function getTournamentEnrichment(tournament: Parameters<typeof enrichTournament>[0], options: EnrichmentOptions = {}) {
  return cached(`tournament:${tournament.slug ?? tournament.name}:${options.matches?.length ?? 0}`, () => enrichTournament(tournament, options));
}

export function getMatchEnrichment(match: Parameters<typeof enrichMatch>[0], options: EnrichmentOptions = {}) {
  return cached(`match:${match.id}:${options.today?.toISOString() ?? "today"}`, () => enrichMatch(match, options));
}

export function getCountryEnrichment(country: Parameters<typeof enrichCountry>[0], options: EnrichmentOptions = {}) {
  return cached(`country:${country.slug ?? country.name}:${options.matches?.length ?? 0}`, () => enrichCountry(country, options));
}

export function getBroadcasterEnrichment(broadcaster: Parameters<typeof enrichBroadcaster>[0]) {
  return cached(`broadcaster:${broadcaster.slug ?? broadcaster.name}`, () => enrichBroadcaster(broadcaster));
}

export function getStreamingEnrichment(service: Parameters<typeof enrichStreamingService>[0]) {
  return cached(`streaming:${service.slug ?? service.name}`, () => enrichStreamingService(service));
}
