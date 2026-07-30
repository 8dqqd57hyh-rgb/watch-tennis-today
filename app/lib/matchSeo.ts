import { getCanonicalPlayerSlug } from "@/data/playerSlugs";

export type MatchSeoInput = {
  player1?: string | null;
  player2?: string | null;
  tournament?: string | null;
  category?: string | null;
  status?: string | null;
  startTime?: string | null;
  round?: string | null;
  court?: string | null;
  surface?: string | null;
  watchProviders?: readonly unknown[] | null;
};

const POPULAR_PLAYER_SLUGS = new Set([
  "jannik-sinner",
  "carlos-alcaraz",
  "novak-djokovic",
  "daniil-medvedev",
  "iga-swiatek",
  "aryna-sabalenka",
  "coco-gauff",
  "elena-rybakina",
]);

const INVALID_ENTITY = /^(?:qf|sf|r)\d*$|^(?:qualifier|bye|tbd|unknown)$/i;

function isGrandSlam(tournament: string) {
  return /australian open|roland|french open|wimbledon|us open/i.test(tournament);
}

function isEligibleCompetition(category: string, tournament: string) {
  return /^(?:ATP|WTA)$/i.test(category) ||
    isGrandSlam(tournament) ||
    /challenger/i.test(category) ||
    /challenger/i.test(tournament);
}

function hasMeaningfulPlayer(value?: string | null) {
  const player = String(value || "").trim();
  return Boolean(
    player &&
    !INVALID_ENTITY.test(player) &&
    !/[\/&+]/.test(player) &&
    !/(^|\s)\p{L}\.(?=\s|$)/u.test(player)
  );
}

/**
 * Conservative, shared indexing policy for generated match detail pages.
 * User access is independent from this decision: false means noindex,follow.
 */
export function shouldIndexMatch(match: MatchSeoInput, now = new Date()) {
  const status = String(match.status || "").toUpperCase();
  const tournament = String(match.tournament || "").trim();
  const category = String(match.category || "").trim();

  if (!hasMeaningfulPlayer(match.player1) || !hasMeaningfulPlayer(match.player2) || !tournament) {
    return false;
  }
  if (/LIVE|UPCOMING|SUSPENDED|DELAYED/.test(status)) return false;
  if (/CANCEL|POSTPON|ABANDON|WALKOVER/.test(status)) return false;
  if (!isEligibleCompetition(category, tournament)) return false;

  const hasProvider = Boolean(match.watchProviders?.length);
  const hasUniqueContext = Boolean(match.round || match.court || match.surface);
  const hasPopularPlayer = [match.player1, match.player2].some((player) => {
    const slug = getCanonicalPlayerSlug(String(player || ""));
    return Boolean(slug && POPULAR_PLAYER_SLUGS.has(slug));
  });
  const majorEvent = isGrandSlam(tournament);

  if (!(hasProvider || hasUniqueContext || majorEvent)) return false;
  if (!(hasPopularPlayer || majorEvent)) return false;

  if (!match.startTime) return false;
  const timestamp = new Date(match.startTime).getTime();
  if (Number.isNaN(timestamp)) return false;
  if (now.getTime() - timestamp > 180 * 24 * 60 * 60 * 1000) return false;

  return true;
}
