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
  const resolvedSources = await Promise.all(
    CALENDAR_SOURCES.map(async (source) => {
      const resolved = await resolveCalendarDates(source);

      return {
        source,
        ...resolved,
      };
    })
  );

  const rows: CalendarUpsert[] = resolvedSources.map(({ source, startDate, endDate }) => ({
    slug: source.slug,
    name: source.name,
    start_date: startDate,
    end_date: endDate,
    source_url: source.sourceUrl,
    source_name: source.sourceName,
    updated_at: checkedAt,
  }));

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
