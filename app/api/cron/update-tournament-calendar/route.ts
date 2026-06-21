import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CalendarSource = {
  slug: string;
  name: string;
  sourceName: string;
  sourceUrl: string;
  fallbackStartDate: string;
  fallbackEndDate: string;
};

type CalendarUpsert = {
  slug: string;
  name: string;
  start_date: string;
  end_date: string;
  source_url: string;
  source_name: string;
  updated_at: string;
};

type JsonLdNode = {
  "@type"?: string | string[];
  "@id"?: string;
  name?: string;
  startDate?: string;
  endDate?: string;
  item?: JsonLdNode;
  itemListElement?: JsonLdNode[];
  mainEntity?: JsonLdNode;
};

type OfficialCalendarEvent = {
  slug: string;
  name: string;
  startDate: string;
  endDate: string;
  sourceUrl: string;
  sourceName: string;
};

const MONTHS: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
};

const CALENDAR_SOURCES: CalendarSource[] = [
  {
    slug: "australian-open",
    name: "Australian Open",
    sourceName: "Australian Open official schedule",
    sourceUrl: "https://ausopen.com/articles/news/new-look-finals-weekend-ao-2026-provisional-schedule-released",
    fallbackStartDate: "2026-01-12",
    fallbackEndDate: "2026-02-01",
  },
  {
    slug: "roland-garros",
    name: "Roland Garros",
    sourceName: "Roland-Garros official schedule",
    sourceUrl: "https://www.rolandgarros.com/en-us/matches",
    fallbackStartDate: "2026-05-18",
    fallbackEndDate: "2026-06-07",
  },
  {
    slug: "wimbledon",
    name: "Wimbledon",
    sourceName: "Wimbledon official schedule",
    sourceUrl: "https://www.wimbledon.com/en_GB/the_championships/schedule",
    fallbackStartDate: "2026-06-29",
    fallbackEndDate: "2026-07-12",
  },
  {
    slug: "us-open",
    name: "US Open",
    sourceName: "US Open official schedule",
    sourceUrl: "https://www.usopen.org/en_US/about/eventschedule.html",
    fallbackStartDate: "2026-08-23",
    fallbackEndDate: "2026-09-13",
  },
];

const WTA_TOURNAMENT_CALENDAR_URL = "https://www.wtatennis.com/tournaments";

function isBrowserProbe(request: Request) {
  const userAgent = request.headers.get("user-agent") || "";
  const accept = request.headers.get("accept") || "";

  return (
    accept.includes("text/html") ||
    /Chrome|Safari|Firefox|Edg|OPR/i.test(userAgent)
  );
}

function toIsoDate(year: number, monthName: string, day: string) {
  const month = MONTHS[monthName.toLowerCase()];
  const dayNumber = Number.parseInt(day, 10);

  if (month === undefined || Number.isNaN(dayNumber)) return null;

  const date = new Date(Date.UTC(year, month, dayNumber));

  return date.toISOString().slice(0, 10);
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isSportsEvent(node: JsonLdNode) {
  const type = node["@type"];

  return Array.isArray(type) ? type.includes("SportsEvent") : type === "SportsEvent";
}

function normalizeIsoDate(value: string | undefined) {
  if (!value) return null;

  const date = new Date(value.includes("T") ? value : `${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 10);
}

function getSlugFromEventId(eventId: string | undefined, fallbackName: string) {
  if (!eventId) return slugify(fallbackName);

  try {
    const pathname = new URL(eventId).pathname;
    const segments = pathname.split("/").filter(Boolean);
    const yearIndex = segments.findLastIndex((segment) => /^20\d{2}$/.test(segment));
    const candidateSegments = yearIndex > 0 ? segments.slice(0, yearIndex) : segments;
    const slugCandidate = [...candidateSegments].reverse().find((segment) =>
      !/^\d+$/.test(segment) &&
      !["tournaments", "id", "season"].includes(segment)
    );

    return slugify(slugCandidate || fallbackName);
  } catch {
    return slugify(fallbackName);
  }
}

function extractJsonLdScripts(html: string) {
  return Array.from(
    html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  ).map((match) => decodeHtmlEntities(match[1].trim()));
}

function collectSportsEvents(node: unknown, seen = new WeakSet<object>()): JsonLdNode[] {
  if (!node || typeof node !== "object") return [];

  if (Array.isArray(node)) {
    return node.flatMap((item) => collectSportsEvents(item, seen));
  }

  if (seen.has(node)) return [];
  seen.add(node);

  const jsonNode = node as JsonLdNode;
  const directEvents = isSportsEvent(jsonNode) ? [jsonNode] : [];
  const nestedEvents = Object.values(jsonNode).flatMap((value) =>
    collectSportsEvents(value, seen)
  );

  return [...directEvents, ...nestedEvents];
}

function extractWtaCalendarEvents(html: string): OfficialCalendarEvent[] {
  const events = extractJsonLdScripts(html).flatMap((script) => {
    try {
      return collectSportsEvents(JSON.parse(script));
    } catch {
      return [];
    }
  });

  const calendarEvents = events
    .map((event) => {
      const name = event.name?.trim();
      const eventId = event["@id"];
      const startDate = normalizeIsoDate(event.startDate);
      const endDate = normalizeIsoDate(event.endDate);

      if (!name || !eventId?.includes("/tournaments/") || !startDate || !endDate) return null;

      const sourceUrl = eventId.startsWith("http")
        ? eventId
        : WTA_TOURNAMENT_CALENDAR_URL;

      return {
        slug: getSlugFromEventId(eventId, name),
        name,
        startDate,
        endDate,
        sourceUrl,
        sourceName: "WTA official tournament calendar",
      };
    })
    .filter((event): event is OfficialCalendarEvent => Boolean(event));

  return Array.from(
    new Map(calendarEvents.map((event) => [event.slug, event])).values()
  );
}

async function fetchWtaTournamentCalendar() {
  const response = await fetch(WTA_TOURNAMENT_CALENDAR_URL, {
    cache: "no-store",
    headers: {
      "user-agent": "WatchTennisTodayBot/1.0 (+https://watchtennistoday.com)",
      accept: "text/html,application/xhtml+xml",
    },
  });

  if (!response.ok) {
    throw new Error(`WTA calendar HTTP ${response.status}`);
  }

  const html = await response.text();
  const events = extractWtaCalendarEvents(html);

  if (events.length === 0) {
    throw new Error("No WTA calendar SportsEvent JSON-LD found");
  }

  return events;
}

function extractDateRangeFromText(text: string, fallbackYear: number) {
  const cleanText = stripHtml(text);

  const monthDayRange = cleanText.match(
    /\b(January|February|March|April|May|June|July|August|September|Sept|October|November|December)\s+(\d{1,2})\s*(?:-|–|—|to)\s*(January|February|March|April|May|June|July|August|September|Sept|October|November|December)\s+(\d{1,2}),?\s*(20\d{2})/i
  );

  if (monthDayRange) {
    const [, startMonth, startDay, endMonth, endDay, year] = monthDayRange;
    const startDate = toIsoDate(Number(year), startMonth, startDay);
    const endDate = toIsoDate(Number(year), endMonth, endDay);

    if (startDate && endDate) return { startDate, endDate };
  }

  const dayMonthRange = cleanText.match(
    /\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?\s*(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|Sept|October|November|December)\s*(?:-|–|—|to)\s*(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)?\s*(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|Sept|October|November|December),?\s*(20\d{2})?/i
  );

  if (dayMonthRange) {
    const [, startDay, startMonth, endDay, endMonth, optionalYear] = dayMonthRange;
    const year = Number(optionalYear || fallbackYear);
    const startDate = toIsoDate(year, startMonth, startDay);
    const endDate = toIsoDate(year, endMonth, endDay);

    if (startDate && endDate) return { startDate, endDate };
  }

  return null;
}

async function resolveCalendarDates(source: CalendarSource) {
  const fallbackYear = Number(source.fallbackStartDate.slice(0, 4));

  try {
    const response = await fetch(source.sourceUrl, {
      cache: "no-store",
      headers: {
        "user-agent": "WatchTennisTodayBot/1.0 (+https://watchtennistoday.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const detected = extractDateRangeFromText(html, fallbackYear);

    if (detected) {
      return {
        startDate: detected.startDate,
        endDate: detected.endDate,
        detected: true,
        error: null,
      };
    }

    throw new Error("No date range found in source HTML");
  } catch (error) {
    return {
      startDate: source.fallbackStartDate,
      endDate: source.fallbackEndDate,
      detected: false,
      error: error instanceof Error ? error.message : "Unknown fetch error",
    };
  }
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret) {
    return NextResponse.json(
      {
        ok: false,
        message: "CRON_SECRET is not configured. Tournament calendar was not updated.",
      },
      { status: 500 }
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    if (isBrowserProbe(request)) {
      return NextResponse.json({
        ok: true,
        endpoint: "update-tournament-calendar",
        protected: true,
        updated: 0,
        message: "This is a protected cron endpoint. No tournament dates were updated from this browser request.",
      });
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const checkedAt = new Date().toISOString();
  const [resolvedSources, wtaCalendarResult] = await Promise.all([
    Promise.all(
      CALENDAR_SOURCES.map(async (source) => {
        const resolved = await resolveCalendarDates(source);

        return {
          source,
          ...resolved,
        };
      })
    ),
    fetchWtaTournamentCalendar()
      .then((events) => ({ ok: true as const, events }))
      .catch((error) => ({
        ok: false as const,
        events: [] as OfficialCalendarEvent[],
        error: error instanceof Error ? error.message : "Unknown WTA calendar error",
      })),
  ]);

  const fallbackRows: CalendarUpsert[] = resolvedSources.map(({ source, startDate, endDate }) => ({
    slug: source.slug,
    name: source.name,
    start_date: startDate,
    end_date: endDate,
    source_url: source.sourceUrl,
    source_name: source.sourceName,
    updated_at: checkedAt,
  }));

  const wtaRows: CalendarUpsert[] = wtaCalendarResult.events.map((event) => ({
    slug: event.slug,
    name: event.name,
    start_date: event.startDate,
    end_date: event.endDate,
    source_url: event.sourceUrl,
    source_name: event.sourceName,
    updated_at: checkedAt,
  }));

  const rows = Array.from(
    new Map([...fallbackRows, ...wtaRows].map((row) => [row.slug, row])).values()
  );

  const { error } = await supabase
    .from("tournament_calendar")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to upsert tournament calendar dates.",
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    updated: rows.length,
    officialCalendars: {
      wta: {
        ok: wtaCalendarResult.ok,
        updated: wtaRows.length,
        sourceUrl: WTA_TOURNAMENT_CALENDAR_URL,
        warning: wtaCalendarResult.ok ? null : wtaCalendarResult.error,
      },
      atp: {
        ok: false,
        updated: 0,
        warning: "ATP is not imported yet. The public official source is a calendar page/PDF, not a documented API.",
      },
      itf: {
        ok: false,
        updated: 0,
        warning: "ITF is not imported yet. Public calendar pages need a separate parser per tour.",
      },
    },
    sources: resolvedSources.map(({ source, startDate, endDate, detected, error }) => ({
      slug: source.slug,
      startDate,
      endDate,
      detectedFromOfficialPage: detected,
      fallbackUsed: !detected,
      warning: error,
    })),
  });
}
