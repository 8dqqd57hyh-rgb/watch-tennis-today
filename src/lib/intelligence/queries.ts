import { getTennisIntelligenceGraph } from "./graph";
import {
  getNodeBySlug,
  normalizeSlug,
  toRelatedContentLink,
  uniqueLinks,
} from "./relationships";
import type {
  IntelligenceGraph,
  IntelligenceGraphOptions,
  IntelligenceNetwork,
  IntelligenceNode,
  IntelligenceNodeType,
  IntelligenceRelationshipType,
  RelatedContentLink,
} from "./types";

type NetworkOptions = IntelligenceGraphOptions & {
  graph?: IntelligenceGraph;
  currentHref?: string;
};

const RELATED_EDGE_TYPES: IntelligenceRelationshipType[] = [
  "PLAYER_PLAYS_TOUR",
  "PLAYER_PARTICIPATES_IN",
  "TOURNAMENT_BROADCAST_IN",
  "COUNTRY_HAS_BROADCASTER",
  "BROADCASTER_STREAMS_ON",
  "PLAYER_NEXT_MATCH",
  "MATCH_BELONGS_TO_TOURNAMENT",
  "MATCH_ON_SURFACE",
  "TOURNAMENT_ON_SURFACE",
  "STREAMING_SERVICE_AVAILABLE_IN",
];

function graphFromOptions(options?: NetworkOptions) {
  return options?.graph ?? getTennisIntelligenceGraph({ matches: options?.matches });
}

function hrefForCurrent(node: IntelligenceNode | null) {
  if (!node) return undefined;
  const link = toRelatedContentLink(node);
  return link?.href;
}

function connectedNodes(graph: IntelligenceGraph, node: IntelligenceNode | null, edgeTypes = RELATED_EDGE_TYPES) {
  if (!node) return [];
  const allowed = new Set(edgeTypes);
  const neighbors = [
    ...(graph.outgoing.get(node.id) ?? []).filter((edge) => allowed.has(edge.type)).map((edge) => graph.nodeById.get(edge.to)),
    ...(graph.incoming.get(node.id) ?? []).filter((edge) => allowed.has(edge.type)).map((edge) => graph.nodeById.get(edge.from)),
  ];

  return neighbors.filter((item): item is IntelligenceNode => Boolean(item));
}

function linksByType(
  graph: IntelligenceGraph,
  node: IntelligenceNode | null,
  type: IntelligenceNodeType,
  options?: { limit?: number; currentHref?: string; edgeTypes?: IntelligenceRelationshipType[] },
) {
  return uniqueLinks(
    connectedNodes(graph, node, options?.edgeTypes)
      .filter((related) => related.type === type)
      .map(toRelatedContentLink),
    options?.currentHref,
  ).slice(0, options?.limit ?? 8);
}

function secondDegreeLinks(
  graph: IntelligenceGraph,
  node: IntelligenceNode | null,
  type: IntelligenceNodeType,
  limit = 8,
  currentHref?: string,
) {
  if (!node) return [];
  const firstDegree = connectedNodes(graph, node);
  const links = firstDegree.flatMap((neighbor) =>
    connectedNodes(graph, neighbor)
      .filter((related) => related.type === type && related.id !== node.id)
      .map(toRelatedContentLink),
  );

  return uniqueLinks(links, currentHref).slice(0, limit);
}

function buildRelatedSearches(node: IntelligenceNode | null) {
  if (!node) return [];
  if (node.type === "player") {
    return [
      `${node.name} next match`,
      `${node.name} live stream`,
      `${node.name} TV schedule`,
      `where to watch ${node.name}`,
    ];
  }
  if (node.type === "tournament") {
    return [
      `${node.name} live stream`,
      `${node.name} TV schedule`,
      `where to watch ${node.name}`,
      `${node.name} order of play`,
    ];
  }
  if (node.type === "country") {
    return [
      `watch tennis in ${node.name}`,
      `${node.name} tennis broadcasters`,
      `${node.name} Tennis TV coverage`,
      `Grand Slam TV in ${node.name}`,
    ];
  }
  if (node.type === "broadcaster") {
    return [
      `${node.name} tennis coverage`,
      `${node.name} tennis countries`,
      `${node.name} streaming tennis`,
      `${node.name} Grand Slam coverage`,
    ];
  }

  return [`${node.name} tennis`, `${node.name} live tennis`];
}

function buildBreadcrumbs(node: IntelligenceNode | null) {
  if (!node) return [{ label: "Home", href: "/" }];
  if (node.type === "player") return [{ label: "Home", href: "/" }, { label: "Players", href: "/players" }, { label: node.name, href: `/player/${node.slug}` }];
  if (node.type === "tournament") return [{ label: "Home", href: "/" }, { label: "Tournaments", href: "/tournament" }, { label: node.name, href: `/tournament/${node.slug}` }];
  if (node.type === "country") return [{ label: "Home", href: "/" }, { label: "Countries", href: "/watch-tennis-in" }, { label: node.name, href: `/watch-tennis-in/${node.slug}` }];
  if (node.type === "broadcaster") return [{ label: "Home", href: "/" }, { label: "Broadcasters", href: "/broadcasters" }, { label: node.name, href: `/broadcaster/${node.slug}` }];

  return [{ label: "Home", href: "/" }, { label: node.name, href: toRelatedContentLink(node)?.href ?? "/" }];
}

function buildNetwork(node: IntelligenceNode | null, options?: NetworkOptions): IntelligenceNetwork {
  const graph = graphFromOptions(options);
  const currentHref = options?.currentHref ?? hrefForCurrent(node);
  const relatedPlayers = linksByType(graph, node, "player", { currentHref });
  const relatedTournaments = linksByType(graph, node, "tournament", { currentHref });
  const relatedCountries = linksByType(graph, node, "country", { currentHref });
  const relatedBroadcasters = linksByType(graph, node, "broadcaster", { currentHref });
  const relatedMatches = linksByType(graph, node, "match", { currentHref, edgeTypes: ["PLAYER_NEXT_MATCH", "MATCH_BELONGS_TO_TOURNAMENT"] });
  const relatedStreamingServices = linksByType(graph, node, "streaming_service", { currentHref });
  const contextualLinks = uniqueLinks(
    [
      ...relatedPlayers,
      ...relatedTournaments,
      ...relatedCountries,
      ...relatedBroadcasters,
      ...relatedMatches,
      ...relatedStreamingServices,
      ...secondDegreeLinks(graph, node, "country", 4, currentHref),
      ...secondDegreeLinks(graph, node, "broadcaster", 4, currentHref),
      ...secondDegreeLinks(graph, node, "streaming_service", 4, currentHref),
    ],
    currentHref,
  ).slice(0, 16);

  return {
    node,
    breadcrumbs: buildBreadcrumbs(node),
    relatedSearches: buildRelatedSearches(node),
    relatedPlayers: relatedPlayers.length ? relatedPlayers : secondDegreeLinks(graph, node, "player", 8, currentHref),
    relatedTournaments: relatedTournaments.length ? relatedTournaments : secondDegreeLinks(graph, node, "tournament", 8, currentHref),
    relatedCountries: relatedCountries.length ? relatedCountries : secondDegreeLinks(graph, node, "country", 8, currentHref),
    relatedBroadcasters: relatedBroadcasters.length ? relatedBroadcasters : secondDegreeLinks(graph, node, "broadcaster", 8, currentHref),
    relatedMatches,
    relatedStreamingServices: relatedStreamingServices.length ? relatedStreamingServices : secondDegreeLinks(graph, node, "streaming_service", 8, currentHref),
    contextualLinks,
  };
}

export function getPlayerNetwork(playerSlug: string, options?: NetworkOptions) {
  const graph = graphFromOptions(options);
  return buildNetwork(getNodeBySlug(graph, "player", playerSlug), { ...options, graph });
}

export function getTournamentNetwork(slug: string, options?: NetworkOptions) {
  const graph = graphFromOptions(options);
  const node = getNodeBySlug(graph, "tournament", slug === "french-open" ? "roland-garros" : slug);
  return buildNetwork(node, { ...options, graph });
}

export function getCountryNetwork(slug: string, options?: NetworkOptions) {
  const graph = graphFromOptions(options);
  return buildNetwork(getNodeBySlug(graph, "country", slug), { ...options, graph });
}

export function getBroadcasterNetwork(slug: string, options?: NetworkOptions) {
  const graph = graphFromOptions(options);
  return buildNetwork(getNodeBySlug(graph, "broadcaster", slug), { ...options, graph });
}

export function getStreamingNetwork(slug: string, options?: NetworkOptions) {
  const graph = graphFromOptions(options);
  return buildNetwork(getNodeBySlug(graph, "streaming_service", normalizeSlug(slug)), { ...options, graph });
}

export function getRelatedPlayers(network: IntelligenceNetwork, limit = 8): RelatedContentLink[] {
  return network.relatedPlayers.slice(0, limit);
}

export function getRelatedTournaments(network: IntelligenceNetwork, limit = 8): RelatedContentLink[] {
  return network.relatedTournaments.slice(0, limit);
}

export function getRelatedCountries(network: IntelligenceNetwork, limit = 8): RelatedContentLink[] {
  return network.relatedCountries.slice(0, limit);
}

export function getRelatedBroadcasters(network: IntelligenceNetwork, limit = 8): RelatedContentLink[] {
  return network.relatedBroadcasters.slice(0, limit);
}

export function getRelatedMatches(network: IntelligenceNetwork, limit = 8): RelatedContentLink[] {
  return network.relatedMatches.slice(0, limit);
}

export function getRelatedStreamingServices(network: IntelligenceNetwork, limit = 8): RelatedContentLink[] {
  return network.relatedStreamingServices.slice(0, limit);
}
