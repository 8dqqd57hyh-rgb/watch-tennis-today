import { buildBroadcastResearchCsv } from "@/app/lib/broadcastResearch";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildBroadcastResearchCsv(), {
    headers: {
      "Content-Disposition": 'attachment; filename="tennis-broadcast-access-report.csv"',
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
