import { NextResponse } from "next/server";

type TvProgramItem = {
  channel: string;
  platform: string;
  title: string;
  time: string;
  sourceName: string;
  sourceUrl: string;
  programType: "LIVE_OR_UPCOMING_MATCH" | "REPLAY_OR_HIGHLIGHTS" | "TENNIS_PROGRAM";
  verificationStatus: "EXACT_MATCH_VERIFIED" | "TV_LISTING_FOUND";
};

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectProgramType(title: string): TvProgramItem["programType"] {
  const value = title.toLowerCase();

  if (
    value.includes("powtórka") ||
    value.includes("powtorka") ||
    value.includes("replay") ||
    value.includes("highlights") ||
    value.includes("skrót") ||
    value.includes("skrot")
  ) {
    return "REPLAY_OR_HIGHLIGHTS";
  }

  if (
    value.includes("na żywo") ||
    value.includes("na zywo") ||
    value.includes("live")
  ) {
    return "LIVE_OR_UPCOMING_MATCH";
  }

  return "TENNIS_PROGRAM";
}

function extractPrograms(
  text: string,
  channel: string,
  sourceUrl: string
): TvProgramItem[] {
  const regex =
    /(\d{1,2}:\d{2}).{0,220}?(ATP|WTA|Tenis|tenis|Roland Garros|Wimbledon|US Open|Australian Open|tenis ziemny).{0,220}/gi;

  const matches = [...text.matchAll(regex)];

  return matches.slice(0, 30).map((match) => {
    const title = match[0].trim();
    const programType = detectProgramType(title);

    return {
      channel,
      platform: channel.includes("Eurosport") ? "Eurosport" : "CANAL+",
      time: match[1],
      title,
      sourceName: "Onet TV Program",
      sourceUrl,
      programType,
      verificationStatus: "TV_LISTING_FOUND",
    };
  });
}

export async function GET() {
  try {
    const allPrograms: TvProgramItem[] = [];

    const sources = [
      {
        channel: "CANAL+ Sport",
        url: "https://programtv.onet.pl/program-tv/canal-sport-2-15",
      },
      {
  channel: "Eurosport 1",
  url: "https://programtv.onet.pl/program-tv/eurosport-1-93",
},
{
  channel: "Eurosport 2",
  url: "https://programtv.onet.pl/program-tv/eurosport-2-76",
},
    ];

    for (const source of sources) {
      const response = await fetch(source.url, {
        next: { revalidate: 1800 },
      });

      const html = await response.text();
      const text = stripHtml(html);

      const items = extractPrograms(
        text,
        source.channel,
        source.url
      );

      allPrograms.push(...items);
    }

    return NextResponse.json(allPrograms);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch TV programs" },
      { status: 500 }
    );
  }
}
