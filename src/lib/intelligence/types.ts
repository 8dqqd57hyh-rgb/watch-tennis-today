import type { TennisBroadcastConfidence, TennisTournamentId } from "@/src/data/tennisBroadcasts";

export type IntelligenceNodeType =
  | "player"
  | "tournament"
  | "country"
  | "broadcaster"
  | "streaming_service"
  | "tour"
  | "surface"
  | "match";

export type IntelligenceRelationshipType =
  | "PLAYER_PLAYS_TOUR"
  | "PLAYER_PARTICIPATES_IN"
  | "TOURNAMENT_BROADCAST_IN"
  | "COUNTRY_HAS_BROADCASTER"
  | "BROADCASTER_STREAMS_ON"
  | "PLAYER_NEXT_MATCH"
  | "MATCH_BELONGS_TO_TOURNAMENT"
  | "MATCH_ON_SURFACE"
  | "PLAYER_FROM_COUNTRY"
  | "TOURNAMENT_ON_SURFACE"
  | "STREAMING_SERVICE_AVAILABLE_IN";

export type IntelligenceMetadata = Record<string, string | number | boolean | string[] | null | undefined>;

export type IntelligenceNode<TType extends IntelligenceNodeType = IntelligenceNodeType> = {
  id: string;
  type: TType;
  slug: string;
  name: string;
  metadata: IntelligenceMetadata;
};

export type IntelligenceEdge<TType extends IntelligenceRelationshipType = IntelligenceRelationshipType> = {
  id: string;
  type: TType;
  from: string;
  to: string;
  metadata: IntelligenceMetadata;
};

export type IntelligenceGraph = {
  nodes: IntelligenceNode[];
  edges: IntelligenceEdge[];
  nodeById: Map<string, IntelligenceNode>;
  nodeByTypeAndSlug: Map<string, IntelligenceNode>;
  outgoing: Map<string, IntelligenceEdge[]>;
  incoming: Map<string, IntelligenceEdge[]>;
};

export type IntelligenceMatchSource = {
  id: string | number;
  player1?: string | null;
  player2?: string | null;
  tournament?: string | null;
  category?: string | null;
  status?: string | null;
  score?: string | null;
  startTime?: string | null;
  round?: string | null;
  court?: string | null;
  surface?: string | null;
};

export type IntelligenceGraphOptions = {
  matches?: IntelligenceMatchSource[];
};

export type RelatedContentLink = {
  id: string;
  type: IntelligenceNodeType;
  label: string;
  href: string;
  description?: string;
  metadata: IntelligenceMetadata;
};

export type BreadcrumbLink = {
  label: string;
  href: string;
};

export type IntelligenceNetwork = {
  node: IntelligenceNode | null;
  breadcrumbs: BreadcrumbLink[];
  relatedSearches: string[];
  relatedPlayers: RelatedContentLink[];
  relatedTournaments: RelatedContentLink[];
  relatedCountries: RelatedContentLink[];
  relatedBroadcasters: RelatedContentLink[];
  relatedMatches: RelatedContentLink[];
  relatedStreamingServices: RelatedContentLink[];
  contextualLinks: RelatedContentLink[];
};

export type BroadcastEdgeMetadata = {
  countryCode?: string;
  tournamentId?: TennisTournamentId;
  confidence?: TennisBroadcastConfidence;
  lastVerified?: string;
};
