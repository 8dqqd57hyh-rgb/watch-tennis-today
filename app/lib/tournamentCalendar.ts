import { supabase } from "@/app/lib/supabase";

export type TournamentCalendarEntry = {
  slug: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  sourceUrl: string | null;
  sourceName: string | null;
  updatedAt: string | null;
};

type TournamentCalendarRow = {
  slug: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  source_url: string | null;
  source_name: string | null;
  updated_at: string | null;
};


const TOURNAMENT_ALIASES: Record<string, string[]> = {
  "australian-open": ["australian-open", "ao", "australian-open-men-singles", "australian-open-women-singles"],
  "roland-garros": ["roland-garros", "french-open", "atp-french-open", "wta-french-open", "french-open-men-singles", "french-open-women-singles"],
  "french-open": ["roland-garros", "french-open", "atp-french-open", "wta-french-open", "french-open-men-singles", "french-open-women-singles"],
  wimbledon: ["wimbledon", "wimbledon-men-singles", "wimbledon-women-singles"],
  "us-open": ["us-open", "us-open-men-singles", "us-open-women-singles", "united-states-open"],
  "w35-cuiaba": ["w35-cuiaba", "w35-cuiabá", "cuiaba-w35", "cuiabá-w35"],
  "w35-cuiabá": ["w35-cuiaba", "w35-cuiabá", "cuiaba-w35", "cuiabá-w35"],
};

const ADDITIONAL_TOURNAMENT_ALIASES: Record<string, string[]> = {
  hertogenbosch: ["hertogenbosch", "s-hertogenbosch", "libema-open"],
  "s-hertogenbosch": ["hertogenbosch", "s-hertogenbosch", "libema-open"],
  "libema-open": ["hertogenbosch", "s-hertogenbosch", "libema-open"],
};

export function getTournamentCalendarSlugs(slug: string) {
  const normalizedSlug = slug.toLowerCase();
  const aliases = {
    ...TOURNAMENT_ALIASES,
    ...ADDITIONAL_TOURNAMENT_ALIASES,
  };

  return Array.from(
    new Set([
      normalizedSlug,
      ...(aliases[normalizedSlug] || []),
      ...Object.entries(aliases)
        .filter(([, aliases]) => aliases.includes(normalizedSlug))
        .map(([canonicalSlug]) => canonicalSlug),
    ])
  );
}

function normalizeRow(row: TournamentCalendarRow): TournamentCalendarEntry {
  return {
    slug: row.slug,
    name: row.name,
    startDate: row.start_date,
    endDate: row.end_date,
    sourceUrl: row.source_url,
    sourceName: row.source_name,
    updatedAt: row.updated_at,
  };
}

export async function getTournamentCalendarEntry(slug: string) {
  const slugs = getTournamentCalendarSlugs(slug);
  const { data, error } = await supabase
    .from("tournament_calendar")
    .select("slug,name,start_date,end_date,source_url,source_name,updated_at")
    .in("slug", slugs)
    .not("start_date", "is", null)
    .not("end_date", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<TournamentCalendarRow>();

  if (error) {
    console.warn("tournament_calendar lookup failed", {
      slug,
      message: error.message,
    });
    return null;
  }

  return data ? normalizeRow(data) : null;
}

export async function getTournamentCalendarEntries() {
  const { data, error } = await supabase
    .from("tournament_calendar")
    .select("slug,name,start_date,end_date,source_url,source_name,updated_at")
    .not("start_date", "is", null)
    .not("end_date", "is", null)
    .order("start_date", { ascending: true });

  if (error) {
    console.warn("tournament_calendar list failed", {
      message: error.message,
    });
    return [];
  }

  const remoteEntries = (data || []).map((row) => normalizeRow(row as TournamentCalendarRow));

  return remoteEntries.sort((a, b) =>
    (a.startDate || "").localeCompare(b.startDate || "")
  );
}
