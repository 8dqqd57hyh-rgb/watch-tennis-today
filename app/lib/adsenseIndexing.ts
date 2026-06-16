// AdSense quality guardrails: keep thin/generated/empty pages out of Google's index and sitemap.
// These helpers intentionally prefer noindex when a route can be mostly templated, redirected,
// or dependent on missing live API data.

const PLACEHOLDER_PATTERNS = [
  /no data available/i,
  /time to be confirmed/i,
  /opponent to be confirmed/i,
  /unknown/i,
  /tbd/i,
  /qualifier/i,
  /coming soon/i,
];

// Manually reviewed player hubs with enough original editorial profile content
// to be eligible for indexing and sitemap inclusion.
export const ADSENSE_INDEXABLE_PLAYER_SLUGS = new Set([
  "jannik-sinner",
  "carlos-alcaraz",
  "novak-djokovic",
]);

export type IndexablePlayerInput = {
  canonicalSlug?: string | null;
  biography?: string | null;
  playingStyle?: string | null;
  careerContext?: string | null;
  strengths?: string[] | null;
  surfaceContext?: string | null;
  watchReasons?: string[] | null;
};

export type IndexableTournamentInput = {
  slug?: string | null;
  name?: string | null;
  matchCount?: number;
  hasEditorialProfile?: boolean;
  hasCalendarEntry?: boolean;
};

export type IndexableGeneratedPageInput = {
  title?: string | null;
  description?: string | null;
  editorialText?: string | null;
  meaningfulItems?: number;
  isRedirectOnly?: boolean;
  isEmptyState?: boolean;
};

function wordCount(value?: string | null) {
  return (value || "").trim().split(/\s+/).filter(Boolean).length;
}

function hasBadPlaceholder(value?: string | null) {
  if (!value) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(value));
}

export function shouldIndexGeneratedPage(input: IndexableGeneratedPageInput) {
  if (input.isRedirectOnly || input.isEmptyState) return false;
  if (hasBadPlaceholder(input.title) || hasBadPlaceholder(input.description)) return false;

  const editorialWords = wordCount(input.editorialText);
  const meaningfulItems = input.meaningfulItems ?? 0;

  return editorialWords >= 180 || meaningfulItems >= 3;
}

export function shouldIndexPlayerPage(input: IndexablePlayerInput) {
  if (!input.canonicalSlug) return false;
  if (!ADSENSE_INDEXABLE_PLAYER_SLUGS.has(input.canonicalSlug)) return false;

  const editorialWords =
    wordCount(input.biography) +
    wordCount(input.playingStyle) +
    wordCount(input.careerContext) +
    wordCount(input.surfaceContext) +
    wordCount(input.strengths?.join(" ")) +
    wordCount(input.watchReasons?.join(" "));

  return editorialWords >= 300 && Boolean(input.strengths?.length) && Boolean(input.watchReasons?.length);
}

export function shouldIndexTournamentPage(input: IndexableTournamentInput) {
  if (!input.slug || !input.name || hasBadPlaceholder(input.name)) return false;

  // Tournament pages are API-dependent. Index only when the page has live/archive
  // evidence or a stable editorial/calendar profile, otherwise avoid indexable empty states.
  return Boolean(input.hasEditorialProfile || input.hasCalendarEntry || (input.matchCount ?? 0) >= 3);
}
