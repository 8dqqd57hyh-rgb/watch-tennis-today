import {
  getNormalizedBroadcastRecords,
  type NormalizedBroadcastRecord,
} from "@/src/data/tennisBroadcasts";

export const BROADCAST_REPORT_PATH = "/research/tennis-broadcast-access-report";
export const BROADCAST_REPORT_CSV_PATH = `${BROADCAST_REPORT_PATH}/data.csv`;

export type BroadcastResearchSummary = {
  recordCount: number;
  countryCount: number;
  broadcasterCount: number;
  tournamentCount: number;
  latestVerified: string;
  confidenceCounts: Record<NormalizedBroadcastRecord["confidence"], number>;
};

export function getBroadcastResearchSummary(
  records = getNormalizedBroadcastRecords(),
): BroadcastResearchSummary {
  return {
    recordCount: records.length,
    countryCount: new Set(records.map((record) => record.countryCode)).size,
    broadcasterCount: new Set(records.map((record) => record.broadcasterName)).size,
    tournamentCount: new Set(records.map((record) => record.tournamentSlug)).size,
    latestVerified: records.reduce(
      (latest, record) => (record.lastVerified > latest ? record.lastVerified : latest),
      "",
    ),
    confidenceCounts: {
      confirmed: records.filter((record) => record.confidence === "confirmed").length,
      partial: records.filter((record) => record.confidence === "partial").length,
      needs_check: records.filter((record) => record.confidence === "needs_check").length,
    },
  };
}

function csvCell(value: string | boolean | undefined) {
  const raw = value === undefined ? "" : String(value);
  const formulaSafe = /^[=+\-@]/.test(raw) ? `'${raw}` : raw;
  return `"${formulaSafe.replaceAll('"', '""')}"`;
}

export function buildBroadcastResearchCsv(
  records = getNormalizedBroadcastRecords(),
) {
  const headers = [
    "record_id",
    "country_code",
    "country_name",
    "country_slug",
    "competition_id",
    "competition_name",
    "broadcaster",
    "streaming_service",
    "official_source_url",
    "free",
    "subscription_required",
    "confidence",
    "last_verified",
    "coverage_notes",
  ];

  const rows = records.map((record) => [
    record.id,
    record.countryCode,
    record.countryName,
    record.countrySlug,
    record.tournamentSlug,
    record.tournamentName,
    record.broadcasterName,
    record.streamingService,
    record.officialUrl,
    record.free,
    record.subscriptionRequired,
    record.confidence,
    record.lastVerified,
    record.notes,
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => csvCell(value)).join(","))
    .join("\r\n");
}
