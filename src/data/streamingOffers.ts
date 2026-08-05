import fallbackRows from "@/data/streaming-offers.v1.json";

export type StreamingOfferStatus = "verified" | "needs-review" | "unavailable" | "stale";
export type VerificationMethod = "manual" | "automatic";

export type StreamingOffer = {
  id: string;
  tournamentSlug: string;
  countryCode: string;
  providerName: string;
  broadcasterName?: string;
  providerSlug: string;
  basePlan?: { name: string; price: number };
  sportsAddon?: { name: string; price: number };
  totalMonthlyPrice?: number;
  currency?: string;
  billingPeriod: "monthly" | "annual" | "event" | "unknown";
  channels?: string[];
  coverage?: { live: boolean; replay: boolean; allCourts?: boolean; commentaryLanguages?: string[] };
  officialUrl: string;
  sourceUrls: string[];
  lastCheckedAt: string;
  validUntil?: string;
  status: StreamingOfferStatus;
  verificationMethod?: VerificationMethod;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
};

export type StreamingOfferMeta = {
  source: "supabase" | "local-fallback";
  fetchedAt: string;
  isFallback: boolean;
  isStale: boolean;
};

export type StreamingOffersResponse = {
  tournamentSlug: string;
  countryCode: string;
  offers: StreamingOffer[];
  meta: StreamingOfferMeta;
};

export interface StreamingDataProvider {
  readonly source: StreamingOfferMeta["source"];
  getOffers(params: { tournamentSlug: string; countryCode: string }): Promise<StreamingOffer[]>;
}

const statuses = new Set<StreamingOfferStatus>(["verified", "needs-review", "unavailable", "stale"]);
const periods = new Set<StreamingOffer["billingPeriod"]>(["monthly", "annual", "event", "unknown"]);

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function price(value: unknown) {
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : undefined;
}

function plan(value: unknown, fallbackName?: unknown, fallbackPrice?: unknown) {
  const input = record(value);
  const name = text(input?.name ?? fallbackName);
  const amount = price(input?.price ?? fallbackPrice);
  return name && amount !== undefined ? { name, price: amount } : undefined;
}

export function calculateTotalMonthlyPrice(offer: Pick<StreamingOffer, "billingPeriod" | "basePlan" | "sportsAddon">) {
  if (offer.billingPeriod !== "monthly") return undefined;
  const prices = [offer.basePlan?.price, offer.sportsAddon?.price].filter((value): value is number => value !== undefined);
  return prices.length ? Math.round(prices.reduce((sum, value) => sum + value, 0) * 100) / 100 : undefined;
}

export function getStaleAfterHours(value = process.env.STREAMING_DATA_STALE_AFTER_HOURS) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 168;
}

export function isOfferExpired(offer: Pick<StreamingOffer, "validUntil">, now = new Date()) {
  if (!offer.validUntil) return false;
  const expiry = new Date(offer.validUntil).getTime();
  return Number.isFinite(expiry) && expiry < now.getTime();
}

export function isOfferStale(offer: Pick<StreamingOffer, "lastCheckedAt" | "validUntil" | "status">, now = new Date(), staleAfterHours = getStaleAfterHours()) {
  if (offer.status === "stale" || isOfferExpired(offer, now)) return true;
  const checked = new Date(offer.lastCheckedAt).getTime();
  return !Number.isFinite(checked) || now.getTime() - checked > staleAfterHours * 60 * 60 * 1000;
}

export function normalizeStreamingOffer(value: unknown): StreamingOffer | null {
  const input = record(value);
  if (!input) return null;
  const id = text(input.id);
  const tournamentSlug = text(input.tournamentSlug ?? input.tournament_slug)?.toLowerCase();
  const countryCode = text(input.countryCode ?? input.country_code)?.toUpperCase();
  const providerName = text(input.providerName ?? input.provider_name);
  const providerSlug = text(input.providerSlug ?? input.provider_slug)?.toLowerCase();
  const officialUrl = text(input.officialUrl ?? input.official_url);
  const lastCheckedAt = text(input.lastCheckedAt ?? input.last_checked_at);
  const rawStatus = text(input.status) as StreamingOfferStatus | undefined;
  const rawPeriod = text(input.billingPeriod ?? input.billing_period) as StreamingOffer["billingPeriod"] | undefined;
  if (!id || !tournamentSlug || !countryCode || !providerName || !providerSlug || !officialUrl || !lastCheckedAt || !rawStatus || !statuses.has(rawStatus)) return null;

  const basePlan = plan(input.basePlan, input.base_plan_name, input.base_plan_price);
  const sportsAddon = plan(input.sportsAddon, input.sports_addon_name, input.sports_addon_price);
  const coverageInput = record(input.coverage);
  const billingPeriod = rawPeriod && periods.has(rawPeriod) ? rawPeriod : "unknown";
  const offer: StreamingOffer = {
    id, tournamentSlug, countryCode, providerName, providerSlug, officialUrl, lastCheckedAt,
    broadcasterName: text(input.broadcasterName ?? input.broadcaster_name),
    basePlan, sportsAddon,
    currency: text(input.currency)?.toUpperCase(), billingPeriod,
    channels: stringArray(input.channels),
    coverage: coverageInput && typeof coverageInput.live === "boolean" && typeof coverageInput.replay === "boolean" ? {
      live: coverageInput.live, replay: coverageInput.replay,
      allCourts: typeof coverageInput.allCourts === "boolean" ? coverageInput.allCourts : typeof coverageInput.all_courts === "boolean" ? coverageInput.all_courts : undefined,
      commentaryLanguages: stringArray(coverageInput.commentaryLanguages ?? coverageInput.commentary_languages),
    } : undefined,
    sourceUrls: stringArray(input.sourceUrls ?? input.source_urls) ?? [],
    validUntil: text(input.validUntil ?? input.valid_until), status: rawStatus,
    verificationMethod: text(input.verificationMethod ?? input.verification_method) as VerificationMethod | undefined,
    verifiedBy: text(input.verifiedBy ?? input.verified_by), verifiedAt: text(input.verifiedAt ?? input.verified_at),
    notes: text(input.notes),
  };
  offer.totalMonthlyPrice = calculateTotalMonthlyPrice(offer);
  return offer;
}

export function selectPreferredOffers(offers: StreamingOffer[]) {
  const selected = new Map<string, StreamingOffer>();
  for (const offer of offers) {
    const key = `${offer.tournamentSlug}:${offer.countryCode}:${offer.providerSlug}`;
    const current = selected.get(key);
    if (!current || (offer.verificationMethod === "manual" && current.verificationMethod !== "manual") ||
      (offer.verificationMethod === current.verificationMethod && (offer.verifiedAt ?? offer.lastCheckedAt) > (current.verifiedAt ?? current.lastCheckedAt))) {
      selected.set(key, offer);
    }
  }
  return [...selected.values()];
}

export function getLocalFallbackOffers(params: { tournamentSlug: string; countryCode: string }) {
  return (fallbackRows as unknown[]).map(normalizeStreamingOffer).filter((offer): offer is StreamingOffer =>
    Boolean(offer && offer.tournamentSlug === params.tournamentSlug && offer.countryCode === params.countryCode));
}

export function formatStreamingPrice(amount: number, currency: string | undefined, locale = "en") {
  if (!currency) return null;
  try { return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount); } catch { return null; }
}

export function validateStreamingOfferQuery(url: URL) {
  const tournamentSlug = url.searchParams.get("tournament")?.trim().toLowerCase() ?? "";
  const countryCode = url.searchParams.get("country")?.trim().toUpperCase() ?? "";
  const errors: string[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tournamentSlug)) errors.push("tournament must be a lowercase slug");
  if (!/^[A-Z]{2}$/.test(countryCode)) errors.push("country must be a two-letter country code");
  return errors.length ? { ok: false as const, errors } : { ok: true as const, tournamentSlug, countryCode };
}

export async function resolveStreamingOffers(params: { tournamentSlug: string; countryCode: string }, remote: StreamingDataProvider, fallback: StreamingDataProvider, now = new Date()): Promise<StreamingOffersResponse> {
  let offers: StreamingOffer[];
  let source = remote.source;
  let isFallback = false;
  try { offers = await remote.getOffers(params); }
  catch { offers = await fallback.getOffers(params); source = fallback.source; isFallback = true; }
  offers = selectPreferredOffers(offers).filter((offer) => offer.status !== "unavailable" && !isOfferExpired(offer, now));
  return { tournamentSlug: params.tournamentSlug, countryCode: params.countryCode, offers, meta: {
    source, fetchedAt: now.toISOString(), isFallback, isStale: offers.some((offer) => isOfferStale(offer, now)),
  } };
}
