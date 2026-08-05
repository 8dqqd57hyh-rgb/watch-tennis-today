import "server-only";
import { unstable_cache } from "next/cache";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import {
  getLocalFallbackOffers, normalizeStreamingOffer, resolveStreamingOffers,
  type StreamingDataProvider, type StreamingOffer,
} from "@/src/data/streamingOffers";

export const STREAMING_OFFERS_CACHE_TAG = "streaming-offers";

class SupabaseStreamingDataProvider implements StreamingDataProvider {
  readonly source = "supabase" as const;
  async getOffers(params: { tournamentSlug: string; countryCode: string }) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase streaming data is not configured");
    }
    const result = await supabaseAdmin.from("streaming_offers").select("*")
      .eq("tournament_slug", params.tournamentSlug).eq("country_code", params.countryCode)
      .in("status", ["verified", "needs-review", "stale"]);
    if (result.error) throw result.error;
    if (!Array.isArray(result.data)) throw new Error("Unexpected streaming_offers response");
    return result.data.map(normalizeStreamingOffer).filter((offer): offer is StreamingOffer => offer !== null);
  }
}

class LocalStreamingDataProvider implements StreamingDataProvider {
  readonly source = "local-fallback" as const;
  async getOffers(params: { tournamentSlug: string; countryCode: string }) { return getLocalFallbackOffers(params); }
}

const remoteProvider = new SupabaseStreamingDataProvider();
const fallbackProvider = new LocalStreamingDataProvider();

const getCachedStreamingOffers = unstable_cache(
  async (tournamentSlug: string, countryCode: string) => resolveStreamingOffers({ tournamentSlug, countryCode }, remoteProvider, fallbackProvider),
  ["streaming-offers-v1"],
  { revalidate: 43_200, tags: [STREAMING_OFFERS_CACHE_TAG] },
);

export function getStreamingOffers(params: { tournamentSlug: string; countryCode: string }) {
  return getCachedStreamingOffers(params.tournamentSlug.toLowerCase(), params.countryCode.toUpperCase());
}
