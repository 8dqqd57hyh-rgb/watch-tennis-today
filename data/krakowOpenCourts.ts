/**
 * Kraków Open 2026 - Court and Match Mappings
 * 
 * This file stores court information for Kraków Open matches.
 * Court data can be manually updated based on official tournament schedule
 * or programmatically populated from tournament data sources.
 * 
 * Format: Match identified by player names (case-insensitive) maps to court info
 */

export type CourtInfo = {
  courtNumber: string;
  courtName?: string;
  surface?: string;
  capacity?: number;
};

export type MatchCourtMapping = {
  // Use lowercase player names for flexible matching
  player1Lower: string;
  player2Lower: string;
  date: string; // YYYY-MM-DD
  court: CourtInfo;
};

/**
 * Court mappings for Kraków Open 2026
 * 
 * These are based on KS Olsza Krakow venue information.
 * Update these values with actual tournament schedule data.
 */
export const krakowOpenCourts: MatchCourtMapping[] = [
  // Example mappings - replace with actual Kraków Open 2026 schedule
  // Format: lowercase player names for flexible matching
  // {
  //   player1Lower: "john smith",
  //   player2Lower: "pete johnson",
  //   date: "2026-08-18",
  //   court: {
  //     courtNumber: "1",
  //     courtName: "Centre Court",
  //     surface: "Clay",
  //     capacity: 500,
  //   },
  // },
];

/**
 * Default courts available at KS Olsza Krakow
 */
export const krakowOpenDefaultCourts: CourtInfo[] = [
  {
    courtNumber: "1",
    courtName: "Centre Court",
    surface: "Clay",
    capacity: 500,
  },
  {
    courtNumber: "2",
    courtName: "Court 2",
    surface: "Clay",
    capacity: 300,
  },
  {
    courtNumber: "3",
    courtName: "Court 3",
    surface: "Clay",
    capacity: 250,
  },
  {
    courtNumber: "4",
    courtName: "Court 4",
    surface: "Clay",
    capacity: 200,
  },
  {
    courtNumber: "5",
    courtName: "Court 5",
    surface: "Clay",
    capacity: 150,
  },
];

/**
 * Find court information for a match
 * Returns null if court not found in mappings
 */
export function findCourtForMatch(
  player1: string,
  player2: string,
  date: string
): CourtInfo | null {
  const p1Lower = player1.toLowerCase().trim();
  const p2Lower = player2.toLowerCase().trim();
  const dateKey = date.split("T")[0]; // Extract YYYY-MM-DD

  for (const mapping of krakowOpenCourts) {
    // Check if players match (order doesn't matter)
    const playersMatch =
      (mapping.player1Lower === p1Lower && mapping.player2Lower === p2Lower) ||
      (mapping.player1Lower === p2Lower && mapping.player2Lower === p1Lower);

    const dateMatches = mapping.date === dateKey;

    if (playersMatch && dateMatches) {
      return mapping.court;
    }
  }

  return null;
}

/**
 * Get all unique courts for Kraków Open based on mappings + defaults
 */
export function getKrakowOpenCourts(): CourtInfo[] {
  const courtsMap = new Map<string, CourtInfo>();

  // Add all mapped courts
  for (const mapping of krakowOpenCourts) {
    courtsMap.set(mapping.court.courtNumber, mapping.court);
  }

  // Add defaults if not already mapped
  for (const defaultCourt of krakowOpenDefaultCourts) {
    if (!courtsMap.has(defaultCourt.courtNumber)) {
      courtsMap.set(defaultCourt.courtNumber, defaultCourt);
    }
  }

  return Array.from(courtsMap.values()).sort(
    (a, b) => Number(a.courtNumber) - Number(b.courtNumber)
  );
}

/**
 * Import court mappings from external source
 * 
 * Use this function to update court mappings programmatically
 * from tournament data, ITF API, or other sources
 */
export function addCourtMapping(mapping: MatchCourtMapping): void {
  // Check if mapping already exists
  const exists = krakowOpenCourts.some(
    (m) =>
      m.player1Lower === mapping.player1Lower &&
      m.player2Lower === mapping.player2Lower &&
      m.date === mapping.date
  );

  if (!exists) {
    krakowOpenCourts.push(mapping);
  }
}

/**
 * Clear and replace all mappings
 * Useful for updating from external data source
 */
export function setCourtMappings(mappings: MatchCourtMapping[]): void {
  krakowOpenCourts.length = 0;
  krakowOpenCourts.push(...mappings);
}

/**
 * Get court mappings for a specific date
 */
export function getCourtMappingsForDate(date: string): MatchCourtMapping[] {
  const dateKey = date.split("T")[0];
  return krakowOpenCourts.filter((m) => m.date === dateKey);
}
