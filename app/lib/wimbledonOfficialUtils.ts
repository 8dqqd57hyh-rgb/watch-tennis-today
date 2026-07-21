import type { ServerMatch } from "@/app/lib/serverMatches";

export type OfficialTeam = Array<{
  displayNameA?: string | null; displayNameB?: string | null; firstNameA?: string | null; lastNameA?: string | null;
  firstNameB?: string | null; lastNameB?: string | null; nationA?: string | null; nationB?: string | null; seed?: number | null; won?: boolean | null;
}>;

export type OfficialMatch = {
  matchId?: string | null; eventCode?: string | null; eventName?: string | null; roundName?: string | null; status?: string | null;
  winner?: string | null; epoch?: number | null; notBefore?: string | null; courtName?: string | null; team1?: OfficialTeam; team2?: OfficialTeam;
  score?: { gameScore?: (string | null)[] | null; tennisSets?: Array<{ team1?: { scoreDisplay?: string | null }; team2?: { scoreDisplay?: string | null } }> | null } | null;
  officialStartTime?: string | null;
};

function teamName(team?: OfficialTeam) {
  const row = team?.[0]; if (!row) return "TBD";
  const full = (first?: string | null, last?: string | null, display?: string | null) => [first, last].filter(Boolean).join(" ") || display || "";
  return [full(row.firstNameA, row.lastNameA, row.displayNameA), full(row.firstNameB, row.lastNameB, row.displayNameB)].filter(Boolean).join(" / ") || "TBD";
}

function score(match: OfficialMatch) {
  const sets = match.score?.tennisSets || [];
  return sets.map((set) => `${set.team1?.scoreDisplay ?? ""}-${set.team2?.scoreDisplay ?? ""}`).filter((value) => value !== "-").join(" ");
}

const londonDateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London", calendar: "iso8601", numberingSystem: "latn",
  year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

export function londonDateTimeIso(year: number, month: number, day: number, hour: number, minute: number) {
  const requestedAsUtc = Date.UTC(year, month - 1, day, hour, minute);
  let candidate = requestedAsUtc;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const values = Object.fromEntries(
      londonDateTimeFormatter.formatToParts(new Date(candidate))
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)]),
    );
    const renderedAsUtc = Date.UTC(values.year, values.month - 1, values.day, values.hour, values.minute);
    const corrected = candidate + requestedAsUtc - renderedAsUtc;
    if (corrected === candidate) break;
    candidate = corrected;
  }

  return new Date(candidate).toISOString();
}

export function mapMatch(match: OfficialMatch, derived = false): ServerMatch {
  const p1 = teamName(match.team1); const p2 = teamName(match.team2); const event = String(match.eventName || "Wimbledon");
  const winner = match.winner === "1" || match.team1?.[0]?.won ? p1 : match.winner === "2" || match.team2?.[0]?.won ? p2 : null;
  return {
    id: `wimbledon-${match.matchId || `${match.eventCode}-${derived ? "derived" : "final"}`}`,
    player1: p1, player2: p2, tournament: `The Championships, Wimbledon - ${event}`, category: event,
    status: derived ? "SCHEDULED" : match.status || "SCHEDULED", round: "Final", score: score(match), pointScore: null,
    startTime: match.officialStartTime || null, court: match.courtName || null, surface: "Grass", winner, winnerId: null,
    seed1: match.team1?.[0]?.seed ?? null, seed2: match.team2?.[0]?.seed ?? null,
    country1: match.team1?.[0]?.nationA ?? null, country2: match.team2?.[0]?.nationA ?? null,
    watchProviders: [{ name: "Wimbledon official broadcasters", url: "https://www.wimbledon.com/en_GB/about/tv_coverage", verificationStatus: "official", note: "Coverage varies by country and court." }],
    officialSourceUrl: derived ? "https://www.wimbledon.com/en_GB/scores/results" : "https://www.wimbledon.com/en_GB/scores/schedule",
  };
}
