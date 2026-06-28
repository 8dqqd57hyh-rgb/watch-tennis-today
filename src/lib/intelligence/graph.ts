import { broadcastCountries } from "@/data/broadcastFinder";
import { playerSlug, safePlayerUrl } from "@/data/playerSlugs";
import { players, type PlayerSlug } from "@/data/players";
import { stableTournamentHubs } from "@/data/tournamentHubs";
import {
  getBroadcasterSlug,
  getNormalizedBroadcastRecords,
  tennisTournamentGroups,
  type TennisTournamentId,
} from "@/src/data/tennisBroadcasts";
import {
  createEdge,
  createNode,
  indexGraph,
  nodeId,
  normalizeSlug,
} from "./relationships";
import type {
  IntelligenceEdge,
  IntelligenceGraph,
  IntelligenceGraphOptions,
  IntelligenceMatchSource,
  IntelligenceNode,
} from "./types";

const TOUR_LABELS = {
  ATP: "ATP Tour",
  WTA: "WTA Tour",
} as const;

const MAJOR_TOURNAMENT_IDS: TennisTournamentId[] = [
  "australian-open",
  "roland-garros",
  "wimbledon",
  "us-open",
];

let memoizedStaticGraph: IntelligenceGraph | null = null;
let staticBuildCount = 0;

function tournamentSlugFromName(value: string) {
  const normalized = normalizeSlug(value);
  if (normalized === "french-open" || normalized.includes("roland-garros")) return "roland-garros";
  if (normalized.includes("australian-open")) return "australian-open";
  if (normalized.includes("wimbledon")) return "wimbledon";
  if (normalized === "u-s-open" || normalized.includes("us-open")) return "us-open";

  return normalized;
}

function surfaceSlug(value?: string | null) {
  const normalized = normalizeSlug(value || "");
  if (!normalized) return null;
  if (normalized.includes("hard")) return "hard";
  if (normalized.includes("clay")) return "clay";
  if (normalized.includes("grass")) return "grass";
  if (normalized.includes("indoor")) return "indoor-hard";

  return normalized;
}

function surfaceName(slug: string) {
  if (slug === "hard") return "Hard court";
  if (slug === "clay") return "Clay court";
  if (slug === "grass") return "Grass court";
  if (slug === "indoor-hard") return "Indoor hard court";

  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function tournamentTourSlug(level: string, tournamentSlug: string) {
  const normalized = normalizeSlug(`${level} ${tournamentSlug}`);
  if (normalized.includes("wta")) return "wta";
  if (normalized.includes("atp")) return "atp";
  if (MAJOR_TOURNAMENT_IDS.includes(tournamentSlug as TennisTournamentId)) return "grand-slam";

  return null;
}

function addNode(nodes: Map<string, IntelligenceNode>, node: IntelligenceNode) {
  nodes.set(node.id, { ...nodes.get(node.id), ...node, metadata: { ...(nodes.get(node.id)?.metadata ?? {}), ...node.metadata } });
}

function addEdge(edges: Map<string, IntelligenceEdge>, edge: IntelligenceEdge) {
  edges.set(edge.id, { ...edges.get(edge.id), ...edge, metadata: { ...(edges.get(edge.id)?.metadata ?? {}), ...edge.metadata } });
}

function createStaticGraph() {
  staticBuildCount += 1;
  const nodes = new Map<string, IntelligenceNode>();
  const edges = new Map<string, IntelligenceEdge>();

  addNode(nodes, createNode("tour", "atp", TOUR_LABELS.ATP));
  addNode(nodes, createNode("tour", "wta", TOUR_LABELS.WTA));
  addNode(nodes, createNode("tour", "grand-slam", "Grand Slam tournaments"));

  for (const surface of ["hard", "clay", "grass", "indoor-hard"]) {
    addNode(nodes, createNode("surface", surface, surfaceName(surface)));
  }

  for (const [slug, player] of Object.entries(players) as Array<[PlayerSlug, (typeof players)[PlayerSlug]]>) {
    const playerNode = createNode("player", slug, player.name, {
      tour: player.tour,
      tournaments: [...player.tournaments],
      surfaceStrength: "surfaceStrength" in player ? player.surfaceStrength : undefined,
      description: "bio" in player ? player.bio : undefined,
    });
    const tourSlug = player.tour.toLowerCase();

    addNode(nodes, playerNode);
    addEdge(edges, createEdge("PLAYER_PLAYS_TOUR", playerNode.id, nodeId("tour", tourSlug)));

    for (const tournament of player.tournaments) {
      const tournamentSlug = tournamentSlugFromName(tournament);
      const tournamentNode = createNode("tournament", tournamentSlug, tournament, {
        source: "data/players.ts",
      });
      addNode(nodes, tournamentNode);
      addEdge(edges, createEdge("PLAYER_PARTICIPATES_IN", playerNode.id, tournamentNode.id));
    }
  }

  for (const hub of stableTournamentHubs) {
    const tournamentNode = createNode("tournament", hub.slug, hub.name, {
      level: hub.level,
      location: hub.location,
      seasonWindow: hub.seasonWindow,
      surface: hub.surface,
      description: hub.summary,
    });
    const tourSlug = tournamentTourSlug(hub.level, hub.slug);
    const hubSurfaceSlug = surfaceSlug(hub.surface);

    addNode(nodes, tournamentNode);
    if (tourSlug) addEdge(edges, createEdge("PLAYER_PARTICIPATES_IN", nodeId("tour", tourSlug), tournamentNode.id));
    if (hubSurfaceSlug) {
      addNode(nodes, createNode("surface", hubSurfaceSlug, surfaceName(hubSurfaceSlug)));
      addEdge(edges, createEdge("TOURNAMENT_ON_SURFACE", tournamentNode.id, nodeId("surface", hubSurfaceSlug)));
    }
  }

  for (const group of tennisTournamentGroups) {
    const tournamentNode = createNode("tournament", group.tournamentId, group.tournamentName, {
      eventType: group.eventType,
      source: "src/data/tennisBroadcasts.ts",
    });
    const tourSlug = group.eventType === "grand_slam" ? "grand-slam" : group.tournamentId.replace("-tour", "");

    addNode(nodes, tournamentNode);
    addEdge(edges, createEdge("PLAYER_PARTICIPATES_IN", nodeId("tour", tourSlug), tournamentNode.id));
  }

  for (const country of broadcastCountries) {
    addNode(nodes, createNode("country", country.slug, country.country, {
      countryCode: country.countryCode,
      primaryBroadcasters: country.primaryBroadcasters,
      description: country.seoIntro ?? country.localContext,
    }));
  }

  for (const record of getNormalizedBroadcastRecords()) {
    const countryNode = createNode("country", record.countrySlug, record.countryName, {
      countryCode: record.countryCode,
    });
    const tournamentNode = createNode("tournament", record.tournamentSlug, record.tournamentName, {
      source: "src/data/tennisBroadcasts.ts",
    });
    const broadcasterNode = createNode("broadcaster", getBroadcasterSlug(record.broadcasterName), record.broadcasterName, {
      confidence: record.confidence,
      lastVerified: record.lastVerified,
    });
    const streamingNode = createNode("streaming_service", getBroadcasterSlug(record.streamingService), record.streamingService, {
      free: record.free,
      subscriptionRequired: record.subscriptionRequired,
      notes: record.notes,
      lastVerified: record.lastVerified,
    });

    addNode(nodes, countryNode);
    addNode(nodes, tournamentNode);
    addNode(nodes, broadcasterNode);
    addNode(nodes, streamingNode);
    addEdge(edges, createEdge("TOURNAMENT_BROADCAST_IN", tournamentNode.id, countryNode.id, {
      countryCode: record.countryCode,
      tournamentId: record.tournamentSlug,
      confidence: record.confidence,
      lastVerified: record.lastVerified,
    }));
    addEdge(edges, createEdge("COUNTRY_HAS_BROADCASTER", countryNode.id, broadcasterNode.id, {
      countryCode: record.countryCode,
      confidence: record.confidence,
    }));
    addEdge(edges, createEdge("BROADCASTER_STREAMS_ON", broadcasterNode.id, streamingNode.id, {
      countryCode: record.countryCode,
      tournamentId: record.tournamentSlug,
    }));
    addEdge(edges, createEdge("STREAMING_SERVICE_AVAILABLE_IN", streamingNode.id, countryNode.id, {
      countryCode: record.countryCode,
      confidence: record.confidence,
    }));
  }

  return indexGraph(Array.from(nodes.values()), Array.from(edges.values()));
}

function createMatchOverlay(staticGraph: IntelligenceGraph, matches: IntelligenceMatchSource[]) {
  const nodes = new Map(staticGraph.nodes.map((node) => [node.id, node]));
  const edges = new Map(staticGraph.edges.map((edge) => [edge.id, edge]));

  for (const match of matches) {
    const id = String(match.id || normalizeSlug(`${match.player1}-vs-${match.player2}`));
    if (!id || id === "undefined") continue;

    const matchSlug = normalizeSlug(`${match.player1 ?? "player"}-vs-${match.player2 ?? "player"}-${id}`);
    const matchNode = createNode("match", matchSlug, `${match.player1 ?? "Player"} vs ${match.player2 ?? "Player"}`, {
      href: `/watch/${matchSlug}`,
      status: match.status ?? undefined,
      startTime: match.startTime ?? undefined,
      tournament: match.tournament ?? undefined,
      category: match.category ?? undefined,
      round: match.round ?? undefined,
    });
    addNode(nodes, matchNode);

    for (const playerName of [match.player1, match.player2]) {
      if (!playerName) continue;
      const href = safePlayerUrl(playerName);
      if (!href) continue;
      const slug = href.split("/").pop();
      if (!slug) continue;
      addEdge(edges, createEdge("PLAYER_NEXT_MATCH", nodeId("player", slug), matchNode.id, {
        status: match.status ?? undefined,
        startTime: match.startTime ?? undefined,
      }));
    }

    if (match.tournament) {
      const tournamentSlug = tournamentSlugFromName(match.tournament);
      const tournamentNode = createNode("tournament", tournamentSlug, match.tournament, {
        category: match.category ?? undefined,
      });
      addNode(nodes, tournamentNode);
      addEdge(edges, createEdge("MATCH_BELONGS_TO_TOURNAMENT", matchNode.id, tournamentNode.id));
    }

    const matchSurfaceSlug = surfaceSlug(match.surface);
    if (matchSurfaceSlug) {
      addNode(nodes, createNode("surface", matchSurfaceSlug, surfaceName(matchSurfaceSlug)));
      addEdge(edges, createEdge("MATCH_ON_SURFACE", matchNode.id, nodeId("surface", matchSurfaceSlug)));
    }
  }

  return indexGraph(Array.from(nodes.values()), Array.from(edges.values()));
}

export function getTennisIntelligenceGraph(options: IntelligenceGraphOptions = {}) {
  if (!memoizedStaticGraph) memoizedStaticGraph = createStaticGraph();
  if (options.matches?.length) return createMatchOverlay(memoizedStaticGraph, options.matches);

  return memoizedStaticGraph;
}

export function resetTennisIntelligenceGraphForTests() {
  memoizedStaticGraph = null;
  staticBuildCount = 0;
}

export function getTennisIntelligenceGraphStats(graph = getTennisIntelligenceGraph()) {
  return {
    nodeCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    duplicateNodeCount: graph.nodes.length - new Set(graph.nodes.map((node) => node.id)).size,
    duplicateEdgeCount: graph.edges.length - new Set(graph.edges.map((edge) => edge.id)).size,
    staticBuildCount,
  };
}

export function playerSlugForGraph(name: string) {
  return playerSlug(name);
}
