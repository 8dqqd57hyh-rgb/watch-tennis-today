import type { TennisBroadcastConfidence } from "@/src/data/tennisBroadcasts";
import type { IntelligenceMatchSource, RelatedContentLink } from "@/src/lib/intelligence/types";

export type EnrichmentSeo = {
  title: string;
  description: string;
  keywords: string[];
  breadcrumbs: RelatedContentLink[];
  relatedSearches: string[];
  faq: { question: string; answer: string }[];
};

export type WatchAvailability = {
  countries: string[];
  broadcasters: string[];
  streamingServices: string[];
  hasFreeOption: boolean;
  requiresSubscription: boolean;
  lastVerified?: string;
  confidence?: TennisBroadcastConfidence;
};

export type PlayerEnrichment = {
  slug: string;
  name: string;
  careerStage: "featured" | "established" | "emerging";
  tour: string;
  country: string | null;
  surfaceStrengths: string[];
  currentActivity: string;
  hasUpcomingMatch: boolean;
  nextTournament: string | null;
  recentTournament: string | null;
  watchAvailability: WatchAvailability;
  broadcastCountries: string[];
  relatedPlayers: RelatedContentLink[];
  relatedTournaments: RelatedContentLink[];
  featuredMatches: RelatedContentLink[];
  quickFacts: { label: string; value: string }[];
  seo: EnrichmentSeo;
};

export type TournamentEnrichment = {
  slug: string;
  name: string;
  tour: string | null;
  surface: string | null;
  country: string | null;
  season: string | null;
  isGrandSlam: boolean;
  isMasters: boolean;
  isATP500: boolean;
  isATP250: boolean;
  isWTA1000: boolean;
  hasLiveMatches: boolean;
  featuredPlayers: RelatedContentLink[];
  broadcastCountries: string[];
  streamingProviders: string[];
  relatedTournaments: RelatedContentLink[];
  previousEditionLink: string | null;
  nextEditionPlaceholder: string;
  coverageSummary: string;
  seo: EnrichmentSeo;
};

export type MatchEnrichment = {
  slug: string;
  name: string;
  importanceScore: number;
  isToday: boolean;
  isLive: boolean;
  isUpcoming: boolean;
  watchCountries: string[];
  streamingServices: string[];
  recommendedViewing: string;
  featuredBroadcasters: string[];
  matchContext: string;
  relatedMatches: RelatedContentLink[];
  relatedArticles: RelatedContentLink[];
  seo: EnrichmentSeo;
};

export type CountryEnrichment = {
  slug: string;
  name: string;
  availableBroadcasters: string[];
  availableStreaming: string[];
  featuredPlayers: RelatedContentLink[];
  popularTournaments: RelatedContentLink[];
  coverageSummary: string;
  subscriptionSummary: string;
  freeViewingSummary: string;
  premiumViewingSummary: string;
  seo: EnrichmentSeo;
};

export type BroadcasterEnrichment = {
  slug: string;
  name: string;
  countries: string[];
  tournaments: string[];
  tours: string[];
  streamingServices: string[];
  coverageLevel: "broad" | "focused" | "limited";
  officialWebsite: string | null;
  lastVerified: string | null;
  confidenceSummary: string;
  seo: EnrichmentSeo;
};

export type StreamingEnrichment = {
  slug: string;
  name: string;
  countries: string[];
  supportedTournaments: string[];
  supportedTours: string[];
  subscriptionModel: string;
  officialLinks: { label: string; url: string }[];
  coverageSummary: string;
  seo: EnrichmentSeo;
};

export type EnrichmentOptions = {
  matches?: IntelligenceMatchSource[];
  today?: Date;
};
