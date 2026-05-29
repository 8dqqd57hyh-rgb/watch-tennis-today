import { ADSENSE_ACCOUNT_ID } from "@/app/lib/adsense";

export const dynamic = "force-static";

export function GET() {
  return new Response(`google.com, ${ADSENSE_ACCOUNT_ID}, DIRECT, f08c47fec0942fa0\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
