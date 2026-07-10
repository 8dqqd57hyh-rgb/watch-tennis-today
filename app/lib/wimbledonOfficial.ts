import "server-only";
import type { ServerMatch } from "@/app/lib/serverMatches";

type OfficialTeam = Array<{
  displayNameA?: string | null; displayNameB?: string | null; firstNameA?: string | null; lastNameA?: string | null;
  firstNameB?: string | null; lastNameB?: string | null; nationA?: string | null; nationB?: string | null; seed?: number | null; won?: boolean | null;
}>;
type OfficialMatch = {
  matchId?: string | null; eventCode?: string | null; eventName?: string | null; roundName?: string | null; status?: string | null;
  winner?: string | null; epoch?: number | null; notBefore?: string | null; courtName?: string | null; team1?: OfficialTeam; team2?: OfficialTeam;
  score?: { gameScore?: (string | null)[] | null; tennisSets?: Array<{ team1?: { scoreDisplay?: string | null }; team2?: { scoreDisplay?: string | null } }> | null } | null;
  officialStartTime?: string | null;
};
type ScheduleResponse = { data?: { schedule?: { courts?: Array<{ courtName?: string | null; matches?: OfficialMatch[] | null }> | null } | null } };

const QUERY = `query Schedule($year: Int!, $day: Int!) {
  schedule(year: $year, tournDay: $day) { courts { courtName matches {
    matchId eventCode eventName roundName status winner epoch notBefore courtName
    team1 { displayNameA displayNameB firstNameA lastNameA firstNameB lastNameB nationA nationB seed won }
    team2 { displayNameA displayNameB firstNameA lastNameA firstNameB lastNameB nationA nationB seed won }
    score { gameScore tennisSets { team1 { scoreDisplay } team2 { scoreDisplay } } }
  } } }
}`;

function teamName(team?: OfficialTeam) {
  const row = team?.[0]; if (!row) return "TBD";
  const full = (first?: string | null, last?: string | null, display?: string | null) => [first, last].filter(Boolean).join(" ") || display || "";
  return [full(row.firstNameA, row.lastNameA, row.displayNameA), full(row.firstNameB, row.lastNameB, row.displayNameB)].filter(Boolean).join(" / ") || "TBD";
}

function score(match: OfficialMatch) {
  const sets = match.score?.tennisSets || [];
  return sets.map((set) => `${set.team1?.scoreDisplay ?? ""}-${set.team2?.scoreDisplay ?? ""}`).filter((value) => value !== "-").join(" ");
}

function londonDateTimeIso(year: number, month: number, day: number, hour: number, minute: number) {
  const initialUtc = Date.UTC(year, month - 1, day, hour, minute);
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(initialUtc));
  const londonHour = Number(parts.find((part) => part.type === "hour")?.value || hour);
  const londonMinute = Number(parts.find((part) => part.type === "minute")?.value || minute);
  const offsetMinutes = (londonHour * 60 + londonMinute) - (hour * 60 + minute);
  return new Date(initialUtc - offsetMinutes * 60_000).toISOString();
}

function decodeScheduleText(value: string) {
  return value.replace(/\\u003c[^>]*?\\u003e/g, " ").replace(/\\n/g, " ").replace(/\\u2019|\\u2018/g, "'").replace(/\\+"/g, '"')
    .replace(/\\u0026amp;/g, "&").replace(/&rsquo;|&#x27;|&#39;/gi, "'").replace(/&amp;/gi, "&").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ");
}

async function fetchPublishedFinalTimes(year: number) {
  const result = new Map<string, string>();
  try {
    const response = await fetch("https://www.wimbledon.com/en_GB/the_championships/schedule", { next: { revalidate: 300 } });
    if (!response.ok) return result;
    const page = await response.text();
    const events = ["Ladies' Singles Final", "Gentlemen's Singles Final"];
    for (const event of events) {
      const variants = [event, event.replace("'", "’"), event.replace("'", "\\u2019")];
      const eventIndex = variants.flatMap((variant) => {
        const indexes: number[] = []; let from = 0;
        while (from < page.length) { const index = page.indexOf(variant, from); if (index < 0) break; indexes.push(index); from = index + variant.length; }
        return indexes;
      }).find((index) => /Not before\s+\d{1,2}:\d{2}(?:am|pm)/i.test(decodeScheduleText(page.slice(index, index + 180))));
      if (eventIndex === undefined) continue;
      const followingRaw = page.slice(eventIndex, eventIndex + 1800);
      const followingEntry = decodeScheduleText(followingRaw);
      const time = followingEntry.match(/Not before\s+(\d{1,2}):(\d{2})(am|pm)/i);
      const date = followingRaw.match(/\\*"link\\*":\\*"(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(\d{1,2})\s+([A-Za-z]+)/);
      if (!date || !time) continue;
      const month = new Date(`${date[2]} 1, 2000`).getMonth() + 1; let hour = Number(time[1]) % 12; if (time[3].toLowerCase() === "pm") hour += 12;
      result.set(event, londonDateTimeIso(year, month, Number(date[1]), hour, Number(time[2])));
    }
  } catch { /* The GraphQL fixture remains usable without the overview page. */ }
  return result;
}

function mapMatch(match: OfficialMatch, derived = false): ServerMatch {
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

async function fetchDay(year: number, day: number) {
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`https://www.wimbledon.com/graphql?operationName=Schedule&day=${day}`, {
      method: "POST", signal: controller.signal, headers: { "content-type": "application/json" },
      body: JSON.stringify({ operationName: "Schedule", query: QUERY, variables: { year, day } }), next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const payload = await response.json() as ScheduleResponse;
    return (payload.data?.schedule?.courts || []).flatMap((court) => (court.matches || []).map((match) => ({ ...match, courtName: match.courtName || court.courtName })));
  } catch { return []; } finally { clearTimeout(timeout); }
}

export async function getOfficialWimbledonFinals(date = new Date()): Promise<ServerMatch[]> {
  const year = date.getUTCFullYear();
  const [semifinalDay, firstFinalDay, secondFinalDay, publishedTimes] = await Promise.all([fetchDay(year, 19), fetchDay(year, 20), fetchDay(year, 21), fetchPublishedFinalTimes(year)]);
  const withPublishedTime = (match: OfficialMatch) => {
    const eventName = String(match.eventName || "");
    return { ...match, officialStartTime: publishedTimes.get(eventName) || publishedTimes.get(`${eventName} Final`) || null };
  };
  const finals = [...firstFinalDay, ...secondFinalDay].filter((match) => /^finals?$/i.test(String(match.roundName || ""))).map((match) => mapMatch(withPublishedTime(match)));
  if (!finals.some((match) => /Gentlemen's Singles/i.test(match.category))) {
    const semifinalWinners = semifinalDay.filter((match) => match.eventCode === "MS" && /semi/i.test(String(match.roundName || ""))).map((match) => match.team1?.[0]?.won || match.winner === "1" ? teamName(match.team1) : match.team2?.[0]?.won || match.winner === "2" ? teamName(match.team2) : "").filter(Boolean);
    if (semifinalWinners.length === 2) finals.push(mapMatch({ matchId: "MS-derived-from-semifinals", eventCode: "MS", eventName: "Gentlemen's Singles", officialStartTime: publishedTimes.get("Gentlemen's Singles Final") || null, team1: [{ displayNameA: semifinalWinners[0] }], team2: [{ displayNameA: semifinalWinners[1] }] }, true));
  }
  return finals;
}
