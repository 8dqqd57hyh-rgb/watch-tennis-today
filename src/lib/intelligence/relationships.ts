import type {
  IntelligenceEdge,
  IntelligenceGraph,
  IntelligenceNode,
  IntelligenceNodeType,
  IntelligenceRelationshipType,
  RelatedContentLink,
} from "./types";

export function normalizeSlug(value: string) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function nodeId(type: IntelligenceNodeType, slug: string) {
  return `${type}:${slug}`;
}

export function edgeId(type: IntelligenceRelationshipType, from: string, to: string) {
  return `${type}:${from}->${to}`;
}

export function createNode<TType extends IntelligenceNodeType>(
  type: TType,
  slug: string,
  name: string,
  metadata: IntelligenceNode["metadata"] = {},
): IntelligenceNode<TType> {
  const normalizedSlug = normalizeSlug(slug || name);

  return {
    id: nodeId(type, normalizedSlug),
    type,
    slug: normalizedSlug,
    name,
    metadata,
  };
}

export function createEdge<TType extends IntelligenceRelationshipType>(
  type: TType,
  from: string,
  to: string,
  metadata: IntelligenceEdge["metadata"] = {},
): IntelligenceEdge<TType> {
  return {
    id: edgeId(type, from, to),
    type,
    from,
    to,
    metadata,
  };
}

export function dedupeNodes(nodes: IntelligenceNode[]) {
  return Array.from(new Map(nodes.map((node) => [node.id, node])).values());
}

export function dedupeEdges(edges: IntelligenceEdge[]) {
  return Array.from(new Map(edges.map((edge) => [edge.id, edge])).values());
}

export function indexGraph(nodes: IntelligenceNode[], edges: IntelligenceEdge[]): IntelligenceGraph {
  const uniqueNodes = dedupeNodes(nodes);
  const uniqueNodeIds = new Set(uniqueNodes.map((node) => node.id));
  const uniqueEdges = dedupeEdges(edges).filter((edge) => uniqueNodeIds.has(edge.from) && uniqueNodeIds.has(edge.to));
  const nodeById = new Map(uniqueNodes.map((node) => [node.id, node]));
  const nodeByTypeAndSlug = new Map(uniqueNodes.map((node) => [`${node.type}:${node.slug}`, node]));
  const outgoing = new Map<string, IntelligenceEdge[]>();
  const incoming = new Map<string, IntelligenceEdge[]>();

  for (const edge of uniqueEdges) {
    outgoing.set(edge.from, [...(outgoing.get(edge.from) ?? []), edge]);
    incoming.set(edge.to, [...(incoming.get(edge.to) ?? []), edge]);
  }

  return {
    nodes: uniqueNodes,
    edges: uniqueEdges,
    nodeById,
    nodeByTypeAndSlug,
    outgoing,
    incoming,
  };
}

export function getNodeBySlug(graph: IntelligenceGraph, type: IntelligenceNodeType, slug: string) {
  return graph.nodeByTypeAndSlug.get(`${type}:${normalizeSlug(slug)}`) ?? null;
}

export function toRelatedContentLink(node: IntelligenceNode): RelatedContentLink | null {
  const href = hrefForNode(node);
  if (!href) return null;

  return {
    id: node.id,
    type: node.type,
    label: node.name,
    href,
    description: typeof node.metadata.description === "string" ? node.metadata.description : undefined,
    metadata: node.metadata,
  };
}

export function uniqueLinks(links: Array<RelatedContentLink | null>, currentHref?: string) {
  const seen = new Set<string>();

  return links.filter((link): link is RelatedContentLink => {
    if (!link) return false;
    if (currentHref && link.href === currentHref) return false;
    if (seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

function hrefForNode(node: IntelligenceNode) {
  if (node.type === "player") return `/player/${node.slug}`;
  if (node.type === "tournament") return `/tournament/${node.slug}`;
  if (node.type === "country") return `/watch-tennis-in/${node.slug}`;
  if (node.type === "broadcaster") return `/broadcaster/${node.slug}`;
  if (node.type === "streaming_service") return "/tennis-streaming-service-picker";
  if (node.type === "tour") return node.slug === "wta" ? "/wta-live-today" : "/atp-live-today";
  if (node.type === "surface") return "/tennis-court-surfaces";
  if (node.type === "match") return typeof node.metadata.href === "string" ? node.metadata.href : "/today";

  return null;
}
