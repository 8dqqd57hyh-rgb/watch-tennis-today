import type { WatchAvailability } from "./types";

const MISSING_TEXT_VALUES = new Set([
  "n/a",
  "na",
  "none",
  "not listed",
  "unknown",
  "not enough sourced data yet",
]);

export function hasMeaningfulValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim().toLowerCase();
  return normalized.length > 0 && !MISSING_TEXT_VALUES.has(normalized);
}

export function hasMeaningfulWatchAvailability(availability: WatchAvailability) {
  return availability.countries.length > 0 ||
    availability.broadcasters.length > 0 ||
    availability.streamingServices.length > 0;
}
