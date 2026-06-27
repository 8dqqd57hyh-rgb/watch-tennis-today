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
  "germany",
  "france",
  "spain",
  "italy",
  "india",
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
  germany: {
    displayCountry: "Germany",
    title: "How to Watch Wimbledon in Germany | TV and Streaming Guide",
    description:
      "How to watch Wimbledon in Germany with Prime Video checks, German streaming notes, schedule links and time zone planning.",
    ogTitle: "How to Watch Wimbledon in Germany",
    ogDescription:
      "Germany-specific Wimbledon viewing notes for Prime Video, official broadcaster checks and order-of-play planning.",
    intro:
      "German viewers should treat Wimbledon as a separate Grand Slam rights window. Start with Prime Video and the official Wimbledon coverage page, then confirm whether the selected court, replay option and subscription terms fit the match you want.",
    primaryViewingNote:
      "The stored Germany Wimbledon row points to Prime Video. Sky Deutschland and Tennis TV can matter for other tennis weeks, but Wimbledon video rights should be checked separately.",
    timezoneNote:
      "Germany is one hour ahead of London during Wimbledon, so add one hour to the UK order of play as a quick planning check. Long matches and weather can still shift the real start.",
    broadcasterSummary:
      "For Germany, the reviewed Wimbledon row points to Prime Video, while Eurosport/discovery+ is more relevant to other Grand Slam checks and Sky Deutschland to tour-level coverage.",
    verificationNote:
      "Compare the Wimbledon order of play with Prime Video listings before match time. If a match changes courts, re-check whether the new court is included in the available feed.",
    faq: [
      {
        question: "Who shows Wimbledon in Germany?",
        answer:
          "The stored broadcaster data points German viewers to Prime Video for Wimbledon. Confirm the current Prime Video listing and official Wimbledon broadcaster page before match week.",
      },
      {
        question: "Does Tennis TV show Wimbledon in Germany?",
        answer:
          "No. Tennis TV is for ATP Tour coverage and Grand Slam rights such as Wimbledon are separate in Germany.",
      },
      {
        question: "What time is Wimbledon on in Germany?",
        answer:
          "Germany is normally one hour ahead of London during Wimbledon. Convert the official order of play and re-check if earlier matches run long.",
      },
    ],
  },
  france: {
    displayCountry: "France",
    title: "How to Watch Wimbledon in France | TV and Streaming Guide",
    description:
      "How to watch Wimbledon in France with beIN Sports checks, French streaming notes, schedule links and official broadcaster guidance.",
    ogTitle: "How to Watch Wimbledon in France",
    ogDescription:
      "France-specific Wimbledon broadcaster checks, beIN Sports streaming notes and order-of-play planning links.",
    intro:
      "French viewers should separate Wimbledon from Roland Garros and weekly tour coverage. Start with beIN Sports France and the official Wimbledon broadcaster list, then verify the live court and app access.",
    primaryViewingNote:
      "The stored France Wimbledon row points to beIN Sports France and beIN Sports Connect or TV-provider access. Confirm the current package before relying on it for a specific court.",
    timezoneNote:
      "France is one hour ahead of London during Wimbledon, so the UK order of play usually converts by adding one hour. Tennis delays can still move the actual start.",
    broadcasterSummary:
      "For France, Wimbledon is stored as a beIN Sports France check. France Televisions and Prime Video are more relevant to Roland Garros, while Tennis TV remains separate ATP coverage.",
    verificationNote:
      "Check the Wimbledon order of play, then compare it with beIN Sports France listings and your provider access. Re-check close to start time if court assignments change.",
    faq: [
      {
        question: "Who shows Wimbledon in France?",
        answer:
          "The stored Wimbledon broadcaster row points to beIN Sports France. Verify current beIN Sports access and the official Wimbledon broadcaster page before match time.",
      },
      {
        question: "Is Wimbledon on France Televisions?",
        answer:
          "France Televisions is a key Roland Garros route, but the stored Wimbledon row points to beIN Sports France. Treat the two Grand Slams as separate rights windows.",
      },
      {
        question: "What time is Wimbledon on in France?",
        answer:
          "France is normally one hour ahead of London during Wimbledon. Convert the official order of play and allow for match delays.",
      },
    ],
  },
  spain: {
    displayCountry: "Spain",
    title: "How to Watch Wimbledon in Spain | TV and Streaming Guide",
    description:
      "How to watch Wimbledon in Spain with Movistar Plus+ checks, Spanish streaming notes, schedule links and official broadcaster guidance.",
    ogTitle: "How to Watch Wimbledon in Spain",
    ogDescription:
      "Spain-specific Wimbledon broadcaster checks, Movistar Plus+ streaming notes and order-of-play planning links.",
    intro:
      "Spanish viewers should start with the tournament rights holder rather than the player name. For Wimbledon, check Movistar Plus+ and official Wimbledon listings before assuming a court or replay is included.",
    primaryViewingNote:
      "The stored Spain Wimbledon row points to Movistar Plus+. Eurosport, Tennis TV and other services can matter in different tennis windows, but Grand Slam rights are separate.",
    timezoneNote:
      "Mainland Spain is one hour ahead of London during Wimbledon. Viewers in the Canary Islands should use local time and check whether late court changes affect the listed session.",
    broadcasterSummary:
      "For Spain, the Wimbledon row points to Movistar Plus+. Tennis TV can help with ATP weeks, while Grand Slam coverage should be confirmed from tournament and local provider listings.",
    verificationNote:
      "Compare the Wimbledon order of play with Movistar Plus+ listings and your package access. Re-check if a Spanish player match moves to a different court.",
    faq: [
      {
        question: "Who shows Wimbledon in Spain?",
        answer:
          "The stored broadcaster data points Spanish viewers to Movistar Plus+ for Wimbledon. Confirm the current plan and official Wimbledon broadcaster page before match week.",
      },
      {
        question: "Does Tennis TV show Wimbledon in Spain?",
        answer:
          "No. Tennis TV covers ATP Tour events, while Wimbledon uses separate Grand Slam rights in Spain.",
      },
      {
        question: "What time is Wimbledon on in Spain?",
        answer:
          "Mainland Spain is normally one hour ahead of London during Wimbledon. Convert the order of play and watch for court-order changes.",
      },
    ],
  },
  italy: {
    displayCountry: "Italy",
    title: "How to Watch Wimbledon in Italy | TV and Streaming Guide",
    description:
      "How to watch Wimbledon in Italy with Sky Sport and NOW checks, Italian streaming notes, schedule links and time zone planning.",
    ogTitle: "How to Watch Wimbledon in Italy",
    ogDescription:
      "Italy-specific Wimbledon broadcaster checks, Sky Sport/NOW streaming notes and order-of-play planning links.",
    intro:
      "Italian Wimbledon viewing should start with the Grand Slam rights path, not the normal tour calendar. Check Sky Sport, NOW or Sky Go availability against the official Wimbledon order of play before the session starts.",
    primaryViewingNote:
      "The stored Italy Wimbledon row points to Sky Sport with NOW or Sky Go where available. SuperTennis and Tennis TV can matter in other event windows, but Wimbledon needs its own check.",
    timezoneNote:
      "Italy is one hour ahead of London during Wimbledon, so add one hour to the UK order of play as a quick planning guide. Match sequence and weather can still change the live window.",
    broadcasterSummary:
      "For Italy, the Wimbledon row points to Sky Sport and NOW/Sky Go checks. Eurosport is more relevant to some other Slams, while SuperTennis and Tennis TV apply in different tour contexts.",
    verificationNote:
      "Open the Wimbledon order of play, then verify Sky Sport, NOW or Sky Go coverage for the exact court. Re-check close to start time if the match follows another long match.",
    faq: [
      {
        question: "Who shows Wimbledon in Italy?",
        answer:
          "The stored Wimbledon row points to Sky Sport, with NOW or Sky Go where available. Verify the current Italian package before match time.",
      },
      {
        question: "Is Wimbledon on SuperTennis in Italy?",
        answer:
          "SuperTennis can matter for other tennis rights, but the stored Wimbledon row points to Sky Sport. Check the official Wimbledon broadcaster list for current confirmation.",
      },
      {
        question: "What time is Wimbledon on in Italy?",
        answer:
          "Italy is normally one hour ahead of London during Wimbledon. Convert the order of play and re-check if earlier matches run long.",
      },
    ],
  },
  india: {
    displayCountry: "India",
    title: "How to Watch Wimbledon in India | TV and Streaming Guide",
    description:
      "How to watch Wimbledon in India with Sony Sports and SonyLIV checks, Indian streaming notes, schedule links and time zone planning.",
    ogTitle: "How to Watch Wimbledon in India",
    ogDescription:
      "India-specific Wimbledon broadcaster checks, Sony Sports/SonyLIV notes and order-of-play planning links.",
    intro:
      "Indian viewers should plan Wimbledon around both rights and time zones. Start with Sony Sports or SonyLIV checks, then compare the selected match with the official order of play before staying up for a live session.",
    primaryViewingNote:
      "The stored India Wimbledon row points to Sony Sports or SonyLIV checks and the current official partner. Verify app access, channel coverage and replay availability before match week.",
    timezoneNote:
      "India is several hours ahead of London, so Wimbledon afternoon and evening sessions can run late at night in IST. Convert the order of play carefully and check whether the match may spill past midnight locally.",
    broadcasterSummary:
      "For India, the Wimbledon route is stored as a Sony Sports/SonyLIV check. Tennis TV can matter for ATP events, but Grand Slam video rights are separate.",
    verificationNote:
      "Compare the Wimbledon order of play with Sony Sports, SonyLIV or the current official partner. If a match is moved to another court, verify whether that feed is included.",
    faq: [
      {
        question: "Who shows Wimbledon in India?",
        answer:
          "The stored broadcaster data points Indian viewers to Sony Sports or SonyLIV checks for Wimbledon. Confirm the current official partner and app access before match time.",
      },
      {
        question: "Does Tennis TV show Wimbledon in India?",
        answer:
          "No. Tennis TV is an ATP Tour service and Wimbledon uses separate Grand Slam rights in India.",
      },
      {
        question: "What time is Wimbledon on in India?",
        answer:
          "Wimbledon is scheduled in London time, which means many matches fall in the evening or late night in India. Convert the official order of play to IST.",
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
