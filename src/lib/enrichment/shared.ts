import { getBroadcastsByBroadcasterSlug, getBroadcasterSlug, tennisBroadcasts, type TennisBroadcastEntry } from "@/src/data/tennisBroadcasts";
import { getTennisIntelligenceGraph } from "@/src/lib/intelligence/graph";
import { getNodeBySlug, normalizeSlug, toRelatedContentLink, uniqueLinks } from "@/src/lib/intelligence/relationships";
import type { EnrichmentOptions, EnrichmentSeo, WatchAvailability } from "./types";
import type { IntelligenceNodeType, RelatedContentLink } from "@/src/lib/intelligence/types";

export { normalizeSlug };

export function uniq<T>(items: T[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

export function nodeLinks(type: IntelligenceNodeType, slugs: string[], options?: EnrichmentOptions) {
  const graph = getTennisIntelligenceGraph({ matches: options?.matches });
  return uniqueLinks(slugs.map((slug) => {
    const node = getNodeBySlug(graph, type, slug);
    return node ? toRelatedContentLink(node) : null;
  }));
}

export function relatedByType(fromType: IntelligenceNodeType, slug: string, toType: IntelligenceNodeType, options?: EnrichmentOptions, limit = 8) {
  const graph = getTennisIntelligenceGraph({ matches: options?.matches });
  const node = getNodeBySlug(graph, fromType, slug);
  if (!node) return [];
  const neighbors = [
    ...(graph.outgoing.get(node.id) ?? []).map((edge) => graph.nodeById.get(edge.to)),
    ...(graph.incoming.get(node.id) ?? []).map((edge) => graph.nodeById.get(edge.from)),
  ];
  return uniqueLinks(neighbors.filter((item) => item?.type === toType).map((item) => item ? toRelatedContentLink(item) : null)).slice(0, limit);
}

export function entriesForTournamentSlug(slug: string) {
  const normalized = normalizeSlug(slug);
  return tennisBroadcasts.filter((entry) => entry.tournamentSlug === normalized || entry.tournamentId === normalized);
}

export function entriesForCountrySlug(slug: string) {
  const normalized = normalizeSlug(slug);
  return tennisBroadcasts.filter((entry) => entry.countrySlug === normalized);
}

export function entriesForStreamingSlug(slug: string) {
  const normalized = normalizeSlug(slug);
  return tennisBroadcasts.filter((entry) => getBroadcasterSlug(entry.streamingService) === normalized);
}

export function entriesForBroadcasterSlug(slug: string) {
  return getBroadcastsByBroadcasterSlug(slug);
}

export function buildWatchAvailability(entries: TennisBroadcastEntry[]): WatchAvailability {
  return {
    countries: uniq(entries.map((entry) => entry.countryName)),
    broadcasters: uniq(entries.map((entry) => entry.broadcasterName)),
    streamingServices: uniq(entries.map((entry) => entry.streamingService)),
    hasFreeOption: entries.some((entry) => entry.free),
    requiresSubscription: entries.some((entry) => entry.subscriptionRequired),
    lastVerified: entries.map((entry) => entry.lastVerified).sort().at(-1),
    confidence: entries.some((entry) => entry.confidence === "confirmed") ? "confirmed" : entries[0]?.confidence,
  };
}

export function basicSeo(name: string, kind: string, links: RelatedContentLink[] = []): EnrichmentSeo {
  return {
    title: `${name} ${kind} | Watch Tennis Today`,
    description: `Live tennis viewing context, broadcasters, streaming options and related tennis pages for ${name}.`,
    keywords: uniq([name, `${name} tennis`, `${name} live stream`, `${name} TV schedule`, "watch tennis today"]),
    breadcrumbs: links.slice(0, 4),
    relatedSearches: [`${name} live stream`, `${name} TV schedule`, `where to watch ${name}`, `${name} tennis today`],
    faq: [
      { question: `Where can I watch ${name}?`, answer: `Check the broadcaster and streaming sections for source-backed viewing options. Availability depends on country and tournament rights.` },
      { question: `Is ${name} coverage free?`, answer: `Some coverage may be free, but many tennis streams require a subscription. Always verify on the official provider site.` },
    ],
  };
}
