import { getBroadcastCountryOptions } from "@/src/data/tennisBroadcasts";

const CORE_CAN_I_WATCH_COUNTRIES = ["poland", "usa", "uk"] as const;
const CORE_CAN_I_WATCH_TOURNAMENTS = [
  "australian-open",
  "roland-garros",
  "wimbledon",
  "us-open",
  "atp-tour",
  "wta-tour",
] as const;

const curatedCanIWatchPaths = new Set([
  ...CORE_CAN_I_WATCH_TOURNAMENTS.flatMap((tournament) =>
    CORE_CAN_I_WATCH_COUNTRIES.map(
      (country) => `/can-i-watch/${tournament}/${country}`,
    ),
  ),
  ...getBroadcastCountryOptions().map(
    (country) => `/can-i-watch/wimbledon/${country.slug}`,
  ),
]);

export const CURATED_CAN_I_WATCH_PATHS = Array.from(curatedCanIWatchPaths);

export function isCuratedCanIWatchDetail(
  tournament: string,
  country: string,
) {
  return curatedCanIWatchPaths.has(`/can-i-watch/${tournament}/${country}`);
}
