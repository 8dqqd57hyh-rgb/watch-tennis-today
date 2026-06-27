import type { Metadata } from "next";
import { canonicalUrl, robotsFor } from "@/app/lib/technicalSeo";
import { getBroadcastCountry } from "@/data/broadcastFinder";
import {
  getTennisBroadcast,
  TENNIS_BROADCAST_LAST_VERIFIED,
  type TennisBroadcastEntry,
} from "@/src/data/tennisBroadcasts";

export const WIMBLEDON_COUNTRY_SLUGS = [
  "usa",
  "uk",
  "canada",
  "australia",
  "poland",
] as const;

export type WimbledonCountrySlug = (typeof WIMBLEDON_COUNTRY_SLUGS)[number];

export type WimbledonCountryGuide = {
  slug: WimbledonCountrySlug;
  country: string;
  canonicalPath: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  intro: string;
  primaryViewingNote: string;
  timezoneNote: string;
  broadcasterSummary: string;
  verificationNote: string;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  broadcastEntry?: TennisBroadcastEntry;
  officialOptions: string[];
};

type CountryCopy = Pick<
  WimbledonCountryGuide,
  | "title"
  | "description"
  | "ogTitle"
  | "ogDescription"
  | "intro"
  | "primaryViewingNote"
  | "timezoneNote"
  | "broadcasterSummary"
  | "verificationNote"
  | "faq"
> & {
  displayCountry: string;
};

const countryCopy: Record<WimbledonCountrySlug, CountryCopy> = {
  usa: {
    displayCountry: "USA",
    title: "How to Watch Wimbledon in the USA | TV and Streaming Guide",
    description:
      "How to watch Wimbledon in the USA with official ESPN viewing checks, streaming notes, schedule links and time zone planning.",
    ogTitle: "How to Watch Wimbledon in the USA",
    ogDescription:
      "Official USA Wimbledon broadcaster checks, ESPN streaming notes and schedule planning links.",
    intro:
      "US viewers should treat Wimbledon as a Grand Slam rights window, not a normal ATP or WTA week. Start with ESPN's live schedule, then confirm whether the match is on a main channel, app feed or replay option before subscribing.",
    primaryViewingNote:
      "ESPN is the main official starting point stored for US Wimbledon coverage, with streaming access depending on the current ESPN package, TV provider and session.",
    timezoneNote:
      "Wimbledon is played in London, so US viewers often see morning and afternoon windows. Convert the official order of play from UK time to your local US time zone before setting alerts.",
    broadcasterSummary:
      "For the USA, the stored Wimbledon row points to ESPN platforms. Tennis Channel and Tennis TV may matter for other tennis weeks, but Grand Slam video rights are separate.",
    verificationNote:
      "On match day, compare the Wimbledon order of play with ESPN's schedule and your app access. Court moves or overflow feeds can change where a match appears.",
    faq: [
      {
        question: "Who shows Wimbledon in the USA?",
        answer:
          "ESPN is the primary official Wimbledon route stored for the United States. Confirm the selected court and session on ESPN's current schedule before relying on a subscription.",
      },
      {
        question: "Does Tennis TV show Wimbledon in the USA?",
        answer:
          "No. Tennis TV is an ATP Tour service and Grand Slams such as Wimbledon use separate broadcast rights in the USA.",
      },
      {
        question: "What time is Wimbledon on in the USA?",
        answer:
          "Wimbledon follows UK time, so US viewing is usually earlier in the day. Use the order of play and convert London time to Eastern, Central, Mountain or Pacific time.",
      },
    ],
  },
  uk: {
    displayCountry: "UK",
    title: "How to Watch Wimbledon in the UK | BBC TV and Streaming Guide",
    description:
      "How to watch Wimbledon in the UK with official BBC and iPlayer checks, TV Licence notes, schedule links and local time guidance.",
    ogTitle: "How to Watch Wimbledon in the UK",
    ogDescription:
      "Official UK Wimbledon viewing notes for BBC, BBC iPlayer, local schedule planning and order-of-play checks.",
    intro:
      "UK viewers have the simplest local Wimbledon workflow, but it is still worth checking the daily court schedule before play. Use the BBC and iPlayer listings, then match them against the official order of play.",
    primaryViewingNote:
      "BBC and BBC iPlayer are the official UK starting points stored for Wimbledon coverage. UK TV Licence rules may apply depending on how you watch.",
    timezoneNote:
      "Wimbledon is a UK event, so the published order of play is already in the local viewing context for most UK readers. Still re-check start order because tennis matches can run long.",
    broadcasterSummary:
      "For the UK, the stored Wimbledon row points to BBC coverage and BBC iPlayer. Sky Sports, TNT Sports and Tennis TV can matter for other tennis events, but Wimbledon should be verified separately.",
    verificationNote:
      "Check the BBC schedule, iPlayer live rails and Wimbledon order of play for the exact court. Replays and highlights can be packaged differently from live coverage.",
    faq: [
      {
        question: "Who shows Wimbledon in the UK?",
        answer:
          "BBC is the official UK Wimbledon route stored in the broadcaster data, with BBC iPlayer commonly used for streaming access.",
      },
      {
        question: "Is Wimbledon free to watch in the UK?",
        answer:
          "BBC coverage does not list a separate streaming subscription fee in the stored data, but UK TV Licence rules may apply. Always check the BBC's current viewing requirements.",
      },
      {
        question: "Do UK viewers need to convert Wimbledon times?",
        answer:
          "Usually no, because Wimbledon is played in the UK. You still need to follow the order of play because match start times can move.",
      },
    ],
  },
  canada: {
    displayCountry: "Canada",
    title: "How to Watch Wimbledon in Canada | TV and Streaming Guide",
    description:
      "How to watch Wimbledon in Canada with TSN and RDS viewing checks, English and French coverage notes, schedule links and time zone planning.",
    ogTitle: "How to Watch Wimbledon in Canada",
    ogDescription:
      "Canada-specific Wimbledon broadcaster checks, TSN/RDS notes and order-of-play planning links.",
    intro:
      "Canadian Wimbledon coverage can depend on language package, app access and whether a match is on a main feed or bonus court. Start with the official Wimbledon listing, then verify TSN or RDS access for the session.",
    primaryViewingNote:
      "The stored Canada Wimbledon row points readers toward TSN/RDS checks and the current official partner. English and French-language access may not be identical.",
    timezoneNote:
      "Wimbledon runs on London time, so Canadian viewers should convert the order of play to Eastern, Central, Mountain, Pacific or Atlantic time before planning a live session.",
    broadcasterSummary:
      "For Canada, the data is intentionally cautious: TSN/RDS checks are the starting point, but the exact package and language feed should be confirmed close to match day.",
    verificationNote:
      "Open the Wimbledon order of play, then compare TSN, RDS and app listings. If a match is not on the main channel, check for streaming-only or language-specific coverage.",
    faq: [
      {
        question: "Who shows Wimbledon in Canada?",
        answer:
          "The stored guide points Canadian viewers to TSN/RDS checks and the official Wimbledon broadcaster list. Confirm the live court and language feed before match time.",
      },
      {
        question: "Is Wimbledon coverage the same in English and French in Canada?",
        answer:
          "Not always. Canadian tennis coverage can differ between English and French-language packages, so check TSN and RDS listings separately when needed.",
      },
      {
        question: "What time is Wimbledon on in Canada?",
        answer:
          "Wimbledon uses London time. Convert the order of play to your Canadian time zone and remember that tennis start times can shift when earlier matches run long.",
      },
    ],
  },
  australia: {
    displayCountry: "Australia",
    title: "How to Watch Wimbledon in Australia | TV and Streaming Guide",
    description:
      "How to watch Wimbledon in Australia with official broadcaster checks, overnight viewing notes, schedule links and order-of-play planning.",
    ogTitle: "How to Watch Wimbledon in Australia",
    ogDescription:
      "Australia-specific Wimbledon viewing checks, time zone notes and legal TV schedule links.",
    intro:
      "Australian viewers need extra schedule care because Wimbledon sessions often fall late at night or early in the morning. Confirm the current Australian broadcaster from official sources, then decide whether live viewing or replay access matters most.",
    primaryViewingNote:
      "The stored Australia Wimbledon row points to official partner checks rather than a single permanent claim. Verify the current Australian broadcaster and app package before match week.",
    timezoneNote:
      "Wimbledon is played in London, so Australian viewers should convert the order of play to AEST, ACST or AWST. Late sessions can cross into the next calendar day locally.",
    broadcasterSummary:
      "For Australia, the database keeps the Wimbledon row as an official broadcaster check. beIN Sports and Tennis TV can matter for other tennis events, but Wimbledon rights need separate confirmation.",
    verificationNote:
      "Check the official Wimbledon TV coverage page, local broadcaster listings and replay availability. Overnight starts make spoiler-free planning more important for Australian fans.",
    faq: [
      {
        question: "Who shows Wimbledon in Australia?",
        answer:
          "Use Wimbledon's official TV coverage page and current Australian broadcaster listings as the final source. The stored data avoids naming a single permanent provider without match-week confirmation.",
      },
      {
        question: "Why are Wimbledon times awkward in Australia?",
        answer:
          "Wimbledon is scheduled in London time, which means many matches fall late at night or early the next morning in Australia.",
      },
      {
        question: "Should Australian viewers check replays?",
        answer:
          "Yes. Because many live windows are overnight, verify whether your legal provider offers full replays, highlights or only live coverage.",
      },
    ],
  },
  poland: {
    displayCountry: "Poland",
    title: "How to Watch Wimbledon in Poland | TV and Streaming Guide",
    description:
      "How to watch Wimbledon in Poland with Polsat viewing checks, Polish time zone notes, schedule links and official broadcaster guidance.",
    ogTitle: "How to Watch Wimbledon in Poland",
    ogDescription:
      "Poland-specific Wimbledon broadcaster checks, Polsat streaming notes and order-of-play planning links.",
    intro:
      "Polish viewers should separate Wimbledon from normal ATP and WTA coverage. Start with the official Wimbledon broadcaster list, then check the current Polsat sports access route and the court assignment.",
    primaryViewingNote:
      "The stored Poland Wimbledon row points to Polsat and Polsat Box Go or current Polsat sports access. Confirm the current package before relying on it for a specific court.",
    timezoneNote:
      "Poland is one hour ahead of London during Wimbledon, so add one hour to the UK order of play as a quick planning check. Weather and long matches can still move the actual start.",
    broadcasterSummary:
      "For Poland, the stored Wimbledon row points to Polsat. Eurosport and Max may be relevant for other Grand Slams, while CANAL+ and Tennis TV can matter in different tour windows.",
    verificationNote:
      "Compare the Wimbledon order of play with Polsat listings and app access. If a match moves courts, re-check whether the new court is included in the available feed.",
    faq: [
      {
        question: "Who shows Wimbledon in Poland?",
        answer:
          "The stored broadcaster data points Polish viewers to Polsat and Polsat Box Go or the current Polsat sports access route for Wimbledon.",
      },
      {
        question: "Does Eurosport show Wimbledon in Poland?",
        answer:
          "Eurosport can matter for other Grand Slams in Poland, but the stored Wimbledon row points to Polsat. Check the official Wimbledon broadcaster page before match week.",
      },
      {
        question: "What time is Wimbledon on in Poland?",
        answer:
          "Poland is normally one hour ahead of London during Wimbledon. Convert the official order of play and re-check if earlier matches run long.",
      },
    ],
  },
};

export function isWimbledonCountrySlug(slug: string): slug is WimbledonCountrySlug {
  return WIMBLEDON_COUNTRY_SLUGS.includes(slug as WimbledonCountrySlug);
}

export function getWimbledonCountryGuide(slug: WimbledonCountrySlug): WimbledonCountryGuide {
  const broadcastCountry = getBroadcastCountry(slug);

  if (!broadcastCountry?.countryCode) {
    throw new Error(`Missing Wimbledon country data for ${slug}`);
  }

  const broadcastEntry = getTennisBroadcast(broadcastCountry.countryCode, "wimbledon");
  const { displayCountry, ...copy } = countryCopy[slug];
  const officialOptions = [
    ...(broadcastEntry ? [broadcastEntry.broadcasterName, broadcastEntry.streamingServiceName] : []),
    ...broadcastCountry.grandSlamBroadcasters,
  ].filter((item, index, items) => item && items.indexOf(item) === index);

  return {
    slug,
    country: displayCountry,
    canonicalPath: `/how-to-watch-wimbledon-in-${slug}`,
    broadcastEntry,
    officialOptions,
    ...copy,
  };
}

export function buildWimbledonCountryMetadata(slug: WimbledonCountrySlug): Metadata {
  const guide = getWimbledonCountryGuide(slug);
  const url = canonicalUrl(guide.canonicalPath);

  return {
    title: guide.title,
    description: guide.description,
    robots: robotsFor({ index: true }),
    alternates: { canonical: url },
    openGraph: {
      title: guide.ogTitle,
      description: guide.ogDescription,
      url,
      type: "article",
      siteName: "Watch Tennis Today",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.ogTitle,
      description: guide.ogDescription,
    },
  };
}

export function getWimbledonCountryLastVerified() {
  return TENNIS_BROADCAST_LAST_VERIFIED;
}
