export type KrakowOpenScheduleRow = {
  tournamentSlug: string;
  year: number;
  date: string;
  time: string;
  player1: string;
  player2: string;
  courtNumber: string;
  courtName?: string;
  surface?: string;
  capacity?: number;
  round?: string;
  source: "itf_official" | "manual" | "api_enriched";
};

/**
 * Official ITF Kraków Open 2026 order-of-play data should be placed here once available.
 * The ITF site is currently behind anti-bot protection and not directly accessible from this environment.
 */
export const krakowOpenOfficialSchedule: KrakowOpenScheduleRow[] = [];
