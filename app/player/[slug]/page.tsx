import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import { players, type PlayerSlug } from "@/data/players";
import { getCanonicalPlayerSlug, matchContainsExactPlayer, normalizePlayerName, playerNameFromSlug } from "@/data/playerSlugs";
import LocalPlayerFollowButton from "@/app/components/LocalPlayerFollowButton";
import PlayerFollowCTA from "@/components/PlayerFollowCTA";
import EmailCapture from "@/components/EmailCapture";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import { supabase } from "@/app/lib/supabase";
import { shouldIndexPlayerPage } from "@/app/lib/adsenseIndexing";

export const dynamic = "force-dynamic";

const CURRENT_SEASON = new Date().getFullYear();

type PlayerEditorialProfile = {
  nationality: string;
  biography: string;
  playingStyle: string;
  careerContext: string;
  strengths: string[];
  surfaceContext: string;
};

const PLAYER_EDITORIAL_PROFILES: Partial<Record<PlayerSlug, PlayerEditorialProfile>> = {
  "jannik-sinner": {
    nationality: "Italy",
    biography: "Jannik Sinner became one of the central names in modern ATP tennis through clean baseline power, calm decision-making and consistent results at the biggest events. Fans often look for his matches during Grand Slams, Masters tournaments and night-session schedules because his matches combine high pace with unusually controlled shot selection.",
    playingStyle: "Sinner plays first-strike baseline tennis. He takes the ball early, redirects pace well and can turn neutral rallies into attacking positions with both the forehand and backhand. His return games are especially important to watch because he can pressure servers quickly.",
    careerContext: "When following Sinner, check whether he is playing on a hard court, indoors or in a late-round match. Those contexts often increase demand for official streams and make schedule confirmation more important.",
    strengths: ["Early ball striking", "Backhand stability", "Return pressure", "Calm match management"],
    surfaceContext: "Hard courts and indoor events are especially relevant contexts.",
  },
  "carlos-alcaraz": {
    nationality: "Spain",
    biography: "Carlos Alcaraz is one of the most watched players in tennis because his matches mix athletic defense, explosive attack and creative shotmaking. His schedule attracts high interest at Grand Slams, clay-court events and marquee evening sessions where broadcasters often prioritize his court.",
    playingStyle: "Alcaraz uses heavy forehands, quick transitions, drop shots, net attacks and aggressive returning. His matches can change momentum quickly because he is comfortable defending, counterattacking and finishing points at the net.",
    careerContext: "Before watching Alcaraz, check the surface and court assignment. Clay, grass and hard-court matches can look very different because he changes the amount of spin, pace and forward movement he uses.",
    strengths: ["Explosive movement", "Drop-shot creativity", "Forehand acceleration", "All-court finishing"],
    surfaceContext: "Clay and outdoor hard courts are key contexts, with grass also important during Wimbledon season.",
  },
  "novak-djokovic": {
    nationality: "Serbia",
    biography: "Novak Djokovic is one of the most accomplished players in tennis history, and his matches remain major viewing events whenever he appears in Grand Slams, Masters tournaments or national-team competitions. Fans often track his schedule because even early-round matches can carry historical or ranking significance.",
    playingStyle: "Djokovic is built around elite returning, defensive balance, depth control and tactical patience. He absorbs pace, extends rallies and often forces opponents to hit extra balls under pressure.",
    careerContext: "When following Djokovic, pay attention to best-of-five matches, late tournament rounds and surface speed. Those factors strongly shape how his tactical advantages appear during a match.",
    strengths: ["Return of serve", "Movement and flexibility", "Tactical point construction", "Pressure handling"],
    surfaceContext: "Hard courts and Grand Slam match formats are especially important contexts.",
  },
  "daniil-medvedev": {
    nationality: "Russia",
    biography: "Daniil Medvedev is a leading ATP player known for unusual court positioning, tactical patience and strong hard-court results. His matches are popular with fans who enjoy long rallies, defensive problem-solving and strategic adjustments.",
    playingStyle: "Medvedev often starts points from deeper court positions, absorbs pace and redirects the ball into awkward spaces. His flat backhand and patient rally tolerance can make opponents uncomfortable.",
    careerContext: "Hard-court events, indoor tournaments and matches against attacking players are especially useful contexts when evaluating Medvedev's schedule.",
    strengths: ["Deep return positioning", "Flat backhand control", "Defensive coverage", "Tactical patience"],
    surfaceContext: "Hard courts and indoor courts are the most relevant viewing contexts.",
  },
  "alexander-zverev": {
    nationality: "Germany",
    biography: "Alexander Zverev is a long-established ATP contender with a powerful serve, heavy baseline game and regular appearances deep in major tournaments. Fans often search for his match pages during Masters events, Grand Slams and clay-court swings.",
    playingStyle: "Zverev builds many service games around a strong first serve and heavy backhand. From the baseline, he can control direction with depth and create pressure when his first serve percentage is high.",
    careerContext: "Clay and hard-court tournaments are important contexts, especially when Zverev is scheduled on a main court or facing another top seed.",
    strengths: ["First serve power", "Two-handed backhand", "Baseline depth", "Big-event experience"],
    surfaceContext: "Clay and hard courts are both important contexts.",
  },
  "taylor-fritz": {
    nationality: "United States",
    biography: "Taylor Fritz is one of the leading American ATP players and is frequently featured in hard-court tournaments, United States events and Grand Slam coverage. His matches are useful for fans tracking American tennis and fast-court schedules.",
    playingStyle: "Fritz relies on a strong serve, direct baseline hitting and efficient first-strike patterns. He is especially dangerous when he earns short balls after the first serve.",
    careerContext: "Check Fritz during North American hard-court swings, indoor events and grass tournaments where his serve can become a major factor.",
    strengths: ["Serve plus one", "Forehand pace", "Fast-court efficiency", "American fan interest"],
    surfaceContext: "Hard courts, grass and indoor courts are especially relevant.",
  },
  "holger-rune": {
    nationality: "Denmark",
    biography: "Holger Rune is a high-energy ATP player whose matches often attract attention because of intensity, variety and momentum swings. Fans track his schedule closely at Masters and Grand Slam events.",
    playingStyle: "Rune mixes aggressive baseline attacks with drop shots, net approaches and emotional momentum. His matches can become tactical and dramatic quickly.",
    careerContext: "Clay, indoor hard courts and matches against top-ten opponents are useful contexts for following Rune.",
    strengths: ["Aggressive return games", "Variety", "Competitive intensity", "Backhand attack"],
    surfaceContext: "Clay and indoor hard courts are especially relevant.",
  },
  "andrey-rublev": {
    nationality: "Russia",
    biography: "Andrey Rublev is a regular ATP contender known for relentless pace and high-volume attacking tennis. His matches are easy for fans to identify because the rhythm is often fast, physical and direct.",
    playingStyle: "Rublev attacks with heavy forehands, early baseline pressure and repeatable patterns. When he controls court position, he can rush opponents into short replies.",
    careerContext: "Look at surface speed and opponent defense when following Rublev. Those factors often decide whether his power patterns control the match.",
    strengths: ["Forehand power", "Aggressive tempo", "Baseline pressure", "High-intensity rallies"],
    surfaceContext: "Hard courts and clay are strong viewing contexts.",
  },
  "casper-ruud": {
    nationality: "Norway",
    biography: "Casper Ruud is a top Norwegian player associated with strong clay-court results, disciplined point construction and consistent tournament performances. Fans often track him during clay swings and Grand Slams.",
    playingStyle: "Ruud uses heavy topspin, structured patterns and reliable forehand pressure. His matches often reward fans who watch rally construction rather than only winners.",
    careerContext: "Clay events and matches with long baseline exchanges are the best contexts for understanding Ruud's game.",
    strengths: ["Heavy forehand topspin", "Clay-court patience", "Point construction", "Physical consistency"],
    surfaceContext: "Clay is the most important context, with hard courts also relevant.",
  },
  "stefanos-tsitsipas": {
    nationality: "Greece",
    biography: "Stefanos Tsitsipas is a prominent ATP player whose matches attract fans because of attacking patterns, one-handed backhand rallies and strong clay-court history.",
    playingStyle: "Tsitsipas likes to use the serve and forehand to move forward, while his one-handed backhand creates different rally shapes compared with most top players.",
    careerContext: "Clay events, grass tournaments and matches where he can attack behind the serve are important contexts for his schedule.",
    strengths: ["Serve and forehand", "Net approaches", "One-handed backhand variety", "Clay-court experience"],
    surfaceContext: "Clay and faster courts where first-strike tennis matters are relevant.",
  },
  "alex-de-minaur": {
    nationality: "Australia",
    biography: "Alex de Minaur is one of the fastest players on the ATP Tour and is popular with fans who enjoy counterpunching, speed and long defensive points.",
    playingStyle: "De Minaur wins many points through movement, anticipation and pressure through consistency. He can turn defense into offense by taking time away on the counterattack.",
    careerContext: "Hard courts, grass and matches against bigger hitters are useful contexts because they show how his speed changes rallies.",
    strengths: ["Court speed", "Counterpunching", "Return consistency", "Competitive energy"],
    surfaceContext: "Hard courts and grass are especially relevant.",
  },
  "lorenzo-musetti": {
    nationality: "Italy",
    biography: "Lorenzo Musetti is an Italian ATP player known for stylish shotmaking, a one-handed backhand and clay-court creativity. His matches often appeal to fans who enjoy variety and touch.",
    playingStyle: "Musetti uses spin, angles, slices and changes of pace to disrupt rhythm. His one-handed backhand and touch shots make his matches visually distinctive.",
    careerContext: "Clay and slower outdoor courts are the most useful contexts when planning to watch Musetti.",
    strengths: ["One-handed backhand", "Touch and angles", "Clay-court creativity", "Shot variety"],
    surfaceContext: "Clay and slower outdoor courts are especially relevant.",
  },
  "tommy-paul": {
    nationality: "United States",
    biography: "Tommy Paul is an American ATP player with an athletic all-court game and strong results on hard courts. His matches are often relevant during North American events and Grand Slam coverage.",
    playingStyle: "Paul combines movement, clean ball striking and willingness to finish points forward. He can defend well but also take control when he earns court position.",
    careerContext: "Hard-court events and matches against aggressive baseliners are important contexts for his schedule.",
    strengths: ["Athletic movement", "All-court balance", "Clean forehand timing", "Transition play"],
    surfaceContext: "Hard courts are the main context, with grass also relevant.",
  },
  "ben-shelton": {
    nationality: "United States",
    biography: "Ben Shelton is an American ATP player whose matches draw attention because of left-handed serving power, athleticism and crowd energy. Fans often search for his schedule during U.S. events and Grand Slams.",
    playingStyle: "Shelton builds points around a heavy left-handed serve, explosive forehand and aggressive court positioning. His service games can move quickly when the first serve lands.",
    careerContext: "Fast courts, night sessions and matches against elite returners are key contexts for following Shelton.",
    strengths: ["Left-handed serve", "Athletic explosiveness", "Forehand power", "Crowd energy"],
    surfaceContext: "Hard courts and grass are especially relevant.",
  },
  "iga-swiatek": {
    nationality: "Poland",
    biography: "Iga Swiatek is one of the most dominant WTA players of her era and a major draw during Grand Slams, clay events and WTA 1000 tournaments. Her matches are frequently watched by fans tracking both title races and ranking implications.",
    playingStyle: "Swiatek uses heavy topspin, fast footwork and intense return pressure. She can rush opponents by taking time away and controlling rally patterns with the forehand.",
    careerContext: "Clay-court events, major finals and WTA 1000 draws are especially important contexts for following Swiatek.",
    strengths: ["Heavy topspin forehand", "Return pressure", "Movement intensity", "Clay dominance"],
    surfaceContext: "Clay is the signature context, with hard courts also important.",
  },
  "aryna-sabalenka": {
    nationality: "Belarus",
    biography: "Aryna Sabalenka is a leading WTA player known for power tennis, major-title contention and high-demand matchups against other top players. Her matches often become must-watch events when she is scheduled on a show court.",
    playingStyle: "Sabalenka plays aggressive first-strike tennis with a big serve, heavy groundstrokes and direct baseline pressure. When her timing is sharp, she can control rallies quickly.",
    careerContext: "Hard-court Grand Slams, WTA 1000 events and matchups against elite defenders are key contexts.",
    strengths: ["Serve power", "Forehand aggression", "Backhand pace", "Big-match intensity"],
    surfaceContext: "Hard courts are especially relevant, with clay and grass also important in major seasons.",
  },
  "coco-gauff": {
    nationality: "United States",
    biography: "Coco Gauff is one of the most followed WTA players, combining elite athleticism, strong defense and major-title relevance. Her matches carry strong fan interest, especially in the United States and at Grand Slams.",
    playingStyle: "Gauff uses speed, defensive reach, a strong backhand and improving first-strike patterns. She can extend rallies until opponents overplay.",
    careerContext: "Grand Slams, American hard-court events and matchups against power players are important contexts.",
    strengths: ["Movement and defense", "Backhand strength", "Return games", "Crowd interest"],
    surfaceContext: "Hard courts are especially relevant, with clay also important.",
  },
  "elena-rybakina": {
    nationality: "Kazakhstan",
    biography: "Elena Rybakina is a major WTA contender known for a calm presence, powerful serve and clean baseline hitting. Her matches are especially relevant on fast courts and during Grand Slam title races.",
    playingStyle: "Rybakina uses a heavy first serve, flat groundstrokes and measured aggression. She can win points quickly when she controls the first shot after serve or return.",
    careerContext: "Grass, hard courts and indoor conditions are strong contexts for following Rybakina.",
    strengths: ["First serve", "Flat baseline power", "Calm execution", "Fast-court efficiency"],
    surfaceContext: "Grass and hard courts are especially relevant.",
  },
  "jessica-pegula": {
    nationality: "United States",
    biography: "Jessica Pegula is a consistent WTA contender with strong hard-court results and regular appearances in deep tournament rounds. Her matches are useful for fans tracking reliable baseline tennis and American coverage.",
    playingStyle: "Pegula plays compact, efficient baseline tennis with early timing and clean direction changes. She often wins by controlling errors and court position.",
    careerContext: "Hard-court events, WTA 1000 tournaments and matches against power hitters are important contexts.",
    strengths: ["Clean timing", "Return stability", "Baseline efficiency", "Hard-court consistency"],
    surfaceContext: "Hard courts are the main context.",
  },
  "madison-keys": {
    nationality: "United States",
    biography: "Madison Keys is a powerful American WTA player whose matches are often defined by first-strike tennis, fast winners and aggressive baseline exchanges.",
    playingStyle: "Keys uses a big serve and heavy forehand to shorten points. When she controls timing, her matches can move quickly and produce many winners.",
    careerContext: "Hard courts, grass and matches against defensive players are useful contexts for following Keys.",
    strengths: ["Forehand power", "Serve strength", "Fast-court attacking", "Winner production"],
    surfaceContext: "Hard courts and grass are especially relevant.",
  },
  "naomi-osaka": {
    nationality: "Japan",
    biography: "Naomi Osaka remains one of the most recognizable names in WTA tennis, with major-title history and strong global fan interest. Her schedule draws attention whenever she enters hard-court events and Grand Slams.",
    playingStyle: "Osaka plays powerful first-strike tennis, built around a strong serve and heavy baseline shots. She is especially dangerous when she dictates rallies early.",
    careerContext: "Hard courts and major events are the most important contexts for following Osaka.",
    strengths: ["Serve power", "Forehand pace", "Hard-court title history", "Global fan interest"],
    surfaceContext: "Hard courts are the signature context.",
  },
  "mirra-andreeva": {
    nationality: "Russia",
    biography: "Mirra Andreeva is one of the most watched young WTA players because of tactical maturity, variety and rapid progress through major tournaments. Fans often track her schedule to follow the next stage of her development.",
    playingStyle: "Andreeva uses smart point construction, changes of direction and calm shot selection. Her game is less about one huge weapon and more about reading rallies early.",
    careerContext: "Grand Slams, clay events and matches against established top players are useful contexts.",
    strengths: ["Tactical maturity", "Point construction", "Variety", "Composure"],
    surfaceContext: "Clay and hard courts are especially relevant.",
  },
  "jasmine-paolini": {
    nationality: "Italy",
    biography: "Jasmine Paolini is an Italian WTA player whose rise made her matches increasingly popular with fans following energetic baseline tennis and deep tournament runs.",
    playingStyle: "Paolini uses speed, compact strokes and aggressive court coverage. She can pressure opponents by taking the ball early and fighting for court position.",
    careerContext: "Clay, grass and Grand Slam draws are important contexts for following Paolini.",
    strengths: ["Speed", "Compact aggression", "Return pressure", "High-energy rallies"],
    surfaceContext: "Clay and grass are especially relevant alongside hard courts.",
  },
  "emma-navarro": {
    nationality: "United States",
    biography: "Emma Navarro is a rising American WTA player known for steady improvement, disciplined patterns and strong tournament consistency.",
    playingStyle: "Navarro plays controlled baseline tennis, using consistency and smart direction changes to create pressure without unnecessary risk.",
    careerContext: "Hard-court tournaments and matches against more powerful opponents are useful contexts.",
    strengths: ["Consistency", "Court discipline", "Return reliability", "Calm decision-making"],
    surfaceContext: "Hard courts are especially relevant.",
  },
};

function getEditorialProfile(playerSlug: PlayerSlug | null, playerName: string, tour: string): PlayerEditorialProfile {
  if (playerSlug && PLAYER_EDITORIAL_PROFILES[playerSlug]) {
    return PLAYER_EDITORIAL_PROFILES[playerSlug]!;
  }

  return {
    nationality: "Professional tennis",
    biography: `${playerName} is covered on Watch Tennis Today as part of our ${tour} tennis schedule and legal viewing guide. This page is designed to help fans understand match status, tournament context and official viewing checks without relying on unsafe stream pages.`,
    playingStyle: `${playerName} matches should be evaluated through the event, surface, round and opponent rather than only the scoreline. Tennis styles vary by tournament conditions, so this page focuses on practical context for following the match live.`,
    careerContext: `For ${playerName}, the most useful fan checks are the official order of play, local broadcaster rights, start window and whether the match is singles or doubles.`,
    strengths: ["Tournament context", "Schedule tracking", "Legal viewing checks", "Live-score awareness"],
    surfaceContext: "Surface context depends on the tournament and current draw.",
  };
}

function buildPlayerSeoTitle(playerName: string) {
  return `Watch ${playerName} Live Today: Next Match, Schedule & Results`;
}

function buildPlayerSeoDescription(playerName: string) {
  return `Watch ${playerName} live today with next match time, recent results, tournament context and legal tennis TV and streaming information.`;
}

export async function generateStaticParams() {
  // Keep player pages on-demand. Prebuilding every player page makes Vercel
  // spend a long time in Collecting page data and can stall deployments.
  return [];
}

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string;
  winner?: string | null;
  winnerId?: string | number | null;
  round?: string;
};


const PLAYER_SLUGS = Object.keys(players) as PlayerSlug[];

const PRIORITY_PLAYERS: PlayerSlug[] = [
  "jannik-sinner",
  "carlos-alcaraz",
  "novak-djokovic",
  "daniil-medvedev",
  "alexander-zverev",
  "holger-rune",
  "taylor-fritz",
  "iga-swiatek",
  "aryna-sabalenka",
  "coco-gauff",
  "elena-rybakina",
  "jessica-pegula",
  "naomi-osaka",
  "mirra-andreeva",
];

function getStatusPriority(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "LIVE") return 0;
  if (normalized === "SUSPENDED") return 1;
  if (normalized === "UPCOMING") return 2;

  return 3;
}

function getMatchTime(match: Match) {
  const timestamp = new Date(match.startTime || "").getTime();

  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}

function sortMatchesByUserIntent(a: Match, b: Match) {
  const statusDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
  if (statusDiff !== 0) return statusDiff;

  return getMatchTime(a) - getMatchTime(b);
}

function getPlayerSlugByName(name: string) {
  const normalizedName = normalizePlayerName(name);

  return PLAYER_SLUGS.find((playerSlug) =>
    normalizePlayerName(players[playerSlug].name) === normalizedName
  );
}

function uniquePlayerSlugs(slugs: (PlayerSlug | undefined | null)[]) {
  const seen = new Set<PlayerSlug>();

  return slugs.filter((slug): slug is PlayerSlug => {
    if (!slug || seen.has(slug)) return false;

    seen.add(slug);
    return true;
  });
}

function getRelatedPlayers(
  currentSlug: PlayerSlug | null,
  playerMatches: Match[]
) {
  const currentTour = currentSlug ? players[currentSlug].tour : null;

  const opponentsFromMatches = playerMatches.flatMap((match) => [
    getPlayerSlugByName(match.player1),
    getPlayerSlugByName(match.player2),
  ]);

  const sameTourPriority = PRIORITY_PLAYERS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    (!currentTour || players[playerSlug].tour === currentTour)
  );

  const sameTourFallback = PLAYER_SLUGS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    (!currentTour || players[playerSlug].tour === currentTour)
  );

  const otherPopularPlayers = PRIORITY_PLAYERS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    Boolean(currentTour && players[playerSlug].tour !== currentTour)
  );

  return uniquePlayerSlugs([
    ...opponentsFromMatches,
    ...sameTourPriority,
    ...sameTourFallback,
    ...otherPopularPlayers,
  ]).slice(0, 8);
}

function formatPlayerName(slug?: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug || "");
  return canonicalSlug ? players[canonicalSlug].name : playerNameFromSlug(slug || "");
}

function isIndexablePlayerSlug(slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);
  const profile = canonicalSlug ? PLAYER_EDITORIAL_PROFILES[canonicalSlug] : null;

  return shouldIndexPlayerPage({
    canonicalSlug,
    biography: profile?.biography,
    playingStyle: profile?.playingStyle,
    careerContext: profile?.careerContext,
    strengths: profile?.strengths,
  });
}

function getPlayerDisplay(slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);
  const safeSlug = slugify(slug || "tennis-player") || "tennis-player";

  return {
    canonicalSlug,
    pageSlug: canonicalSlug || safeSlug,
    playerName: canonicalSlug ? players[canonicalSlug].name : playerNameFromSlug(safeSlug),
    isVerifiedPlayer: Boolean(canonicalSlug),
  };
}

function matchContainsPlayerText(match: Match, slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);

  if (canonicalSlug) {
    return matchContainsExactPlayer(match, canonicalSlug);
  }

  const target = normalizePlayerName(slug.replace(/-/g, " "));
  if (!target) return false;

  const fields = [match.player1, match.player2];

  return fields.some((value) => {
    const normalized = normalizePlayerName(value || "");
    return normalized === target || normalized.split(" ").includes(target);
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { playerName, pageSlug } = getPlayerDisplay(slug);
  const indexable = isIndexablePlayerSlug(slug);

  return {
    // AdSense quality: verified player pages with substantial editorial profiles can index;
    // unknown/API-only player pages stay noindex to avoid thin generated pages.
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    title: buildPlayerSeoTitle(playerName),
    description: buildPlayerSeoDescription(playerName),
    alternates: {
      canonical: `https://watchtennistoday.com/player/${pageSlug}`,
    },
    openGraph: {
      title: buildPlayerSeoTitle(playerName),
      description: buildPlayerSeoDescription(playerName),
      url: `https://watchtennistoday.com/player/${pageSlug}`,
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: buildPlayerSeoTitle(playerName),
      description: buildPlayerSeoDescription(playerName),
    },
  };
}

async function getBaseUrl() {
  const headersList = await headers();

  const host = headersList.get("host");

  if (!host) {
    return "http://localhost:3000";
  }

  const protocol = host.includes("localhost")
    ? "http"
    : "https";

  return `${protocol}://${host}`;
}

async function getMatches(
  playerName?: string,
  options: { daysBack?: number; daysForward?: number; formHistory?: boolean } = {}
): Promise<Match[]> {
  try {
    const baseUrl = await getBaseUrl();
    const params = new URLSearchParams({
      includeFinished: "1",
      daysBack: String(Math.min(options.daysBack ?? 30, 30)),
      daysForward: String(Math.min(options.daysForward ?? 30, 30)),
    });

    if (options.formHistory) {
      params.set("formHistory", "1");
    }

    if (playerName) {
      params.set("playerName", playerName);
    }

    const response = await fetch(`${baseUrl}/api/matches?${params.toString()}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error("/api/matches failed:", response.status);
      return [];
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("/api/matches returned non-JSON:", text.slice(0, 300));
      return [];
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.matches)) {
      return data.matches;
    }
  } catch (error) {
    console.error("/api/matches request failed on player page:", error);
  }

  return [];
}

function mergeMatchesById(matches: Match[]) {
  return Array.from(new Map(matches.map((match) => [String(match.id), match])).values());
}

function getArchiveDateStart(daysBack = 365) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysBack);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
}

async function getArchivedMatchesForPlayerPage(playerName: string): Promise<Match[]> {
  try {
    const { data, error } = await supabase
      .from("match_archive")
      .select("id, player1, player2, tournament, category, status, score, start_time")
      .gte("start_time", getArchiveDateStart(365))
      .order("start_time", { ascending: false })
      .limit(500);

    if (error || !Array.isArray(data)) {
      if (error) console.warn("player page archive fallback unavailable:", error.message);
      return [];
    }

    return data
      .filter((match) =>
        [match.player1, match.player2].some((name) => doSinglesPlayerNamesMatch(String(name || ""), playerName))
      )
      .map((match) => ({
        id: String(match.id),
        player1: match.player1 || "Unknown player",
        player2: match.player2 || "Unknown player",
        tournament: match.tournament || "Unknown tournament",
        category: match.category || "UNKNOWN",
        status: match.status || "FINISHED",
        score: match.score || "",
        startTime: match.start_time || "",
      }));
  } catch (error) {
    console.warn("player page archive fallback skipped:", error);
    return [];
  }
}

async function getMatchesForPlayer(playerName: string): Promise<Match[]> {
  try {
    const playerScopedMatches = await getMatches(playerName, { daysBack: 30, daysForward: 30 });

    const scopedPlayerMatches = playerScopedMatches.filter((match) =>
      [match.player1, match.player2].some((name) => doPlayerNamesMatch(name || "", playerName))
    );

    const scopedCompletedSingles = scopedPlayerMatches
      .filter(isSinglesMatchForPlayerForm)
      .filter((match) => isFinishedMatch(match));

    // Use Supabase archive for older finished rows instead of forcing normal
    // player pages through expensive /api/matches?daysBack=365&formHistory=1 calls.
    const archivedMatches = scopedCompletedSingles.length >= 10
      ? []
      : await getArchivedMatchesForPlayerPage(playerName);

    return mergeMatchesById([...playerScopedMatches, ...archivedMatches]);
  } catch (error) {
    console.error("Player match lookup failed:", error);
    return getArchivedMatchesForPlayerPage(playerName);
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMatchSlug(match: Match) {
  const readablePart = slugify(
    `${match.player1}-vs-${match.player2}`
  );

  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
}

function formatMatchDateTime(value?: string) {
  if (!value) return "Time to be announced";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time to be announced";

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function isInitialNamePart(value?: string) {
  return /^[a-z]$/i.test(String(value || "").replace(/\./g, ""));
}

function doublesSideIncludesPlayer(candidateName: string, targetName: string) {
  if (!/[\/&+]/.test(candidateName)) return false;

  const targetParts = normalizePlayerName(targetName || "").replace(/\./g, "").split(" ").filter(Boolean);
  const targetLast = targetParts.at(-1);
  if (!targetLast) return false;

  return candidateName
    .split(/[\/&+]/)
    .map((part) => normalizePlayerName(part).replace(/\./g, ""))
    .filter(Boolean)
    .some((part) => {
      const partTokens = part.split(" ").filter(Boolean);

      if (partTokens.length === 1) {
        return partTokens[0] === targetLast;
      }

      return doPlayerNamesMatch(part, targetName);
    });
}

function doSinglesPlayerNamesMatch(candidateName: string, targetName: string) {
  const candidate = normalizePlayerName(candidateName || "").replace(/\./g, "");
  const target = normalizePlayerName(targetName || "").replace(/\./g, "");

  if (!candidate || !target) return false;
  if (candidate === target) return true;

  const candidateParts = candidate.split(" ").filter(Boolean);
  const targetParts = target.split(" ").filter(Boolean);
  const candidateLast = candidateParts.at(-1);
  const targetLast = targetParts.at(-1);
  const candidateFirst = candidateParts[0];
  const targetFirst = targetParts[0];

  if (!candidateLast || !targetLast || !candidateFirst || !targetFirst) {
    return false;
  }

  // API feeds often abbreviate tennis names as "A. Zverev" / "A Zverev" while
  // player pages use the full display name "Alexander Zverev".
  if (candidateLast === targetLast && candidateFirst[0] === targetFirst[0]) {
    return true;
  }

  // API-Tennis H2H recent-player rows commonly use reversed abbreviated names,
  // e.g. "Zverev A.". Support surname + first initial so we do not drop Rome,
  // Madrid and other history rows before the form tracker can use them.
  if (candidateFirst === targetLast) {
    return candidateLast === targetFirst || (
      isInitialNamePart(candidateLast) && candidateLast[0] === targetFirst[0]
    );
  }

  if (targetFirst === candidateLast) {
    return targetLast === candidateFirst || (
      isInitialNamePart(targetLast) && targetLast[0] === candidateFirst[0]
    );
  }

  return false;
}

function doPlayerNamesMatch(candidateName: string, targetName: string) {
  return (
    doSinglesPlayerNamesMatch(candidateName, targetName) ||
    doublesSideIncludesPlayer(candidateName, targetName)
  );
}

function getOpponentForPlayer(match: Match, playerName: string) {
  if (doPlayerNamesMatch(match.player1, playerName)) return match.player2;
  if (doPlayerNamesMatch(match.player2, playerName)) return match.player1;

  return `${match.player1} / ${match.player2}`;
}

function isLiveMatch(match: Match) {
  return match.status?.toUpperCase() === "LIVE" && !isFinishedMatch(match);
}

function hasUsableScore(match: Match) {
  const score = String(match.score || "").trim();
  return Boolean(score && score !== "-" && score !== "0-0" && score !== "0 - 0");
}

function isFinishedMatch(match: Match) {
  const normalized = match.status?.toUpperCase() || "";
  if (["FINISHED", "ENDED", "COMPLETED", "FINAL", "RETIRED", "WALKOVER"].includes(normalized)) {
    return true;
  }

  // Some live feeds keep a match marked LIVE after the score is already complete.
  // A clearly completed tennis score must be treated as FINAL everywhere.
  return Boolean(inferMatchWinnerSideFromScore(match));
}

function isUpcomingMatch(match: Match) {
  const normalized = match.status?.toUpperCase() || "";
  return ["UPCOMING", "SCHEDULED", "NOT_STARTED"].includes(normalized) || (!isLiveMatch(match) && !isFinishedMatch(match));
}

function getPlayerPageSummary(playerName: string, playerMatches: Match[]) {
  const liveMatches = playerMatches.filter(isLiveMatch);
  const upcomingMatches = playerMatches.filter(isUpcomingMatch);
  const finishedMatches = playerMatches.filter(isFinishedMatch);
  const nextMatch = liveMatches[0] || upcomingMatches[0] || playerMatches[0];
  const tournaments = Array.from(new Set(playerMatches.map((match) => match.tournament).filter(Boolean))).slice(0, 3);

  return {
    liveMatches,
    upcomingMatches,
    finishedMatches,
    nextMatch,
    tournaments,
    headline: liveMatches.length
      ? `${playerName} is live now`
      : nextMatch
        ? `Watch ${playerName} live today`
        : `${playerName} schedule and live stream guide`,
  };
}


type PlayerFormItem = {
  match: Match;
  result: "W" | "L";
  opponent: string;
};

function getPlayerSide(match: Match, playerName: string) {
  if (doPlayerNamesMatch(match.player1, playerName)) return "player1";
  if (doPlayerNamesMatch(match.player2, playerName)) return "player2";

  return null;
}

function parseSetScore(setScore: string) {
  const cleaned = setScore
    .replace(/\([^)]*\)/g, "")
    .replace(/[–—]/g, "-")
    .trim();

  const match = cleaned.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;

  const first = Number.parseInt(match[1], 10);
  const second = Number.parseInt(match[2], 10);

  if (!Number.isFinite(first) || !Number.isFinite(second) || first === second) {
    return null;
  }

  return { first, second };
}

function getWinnerSideFromWinnerField(match: Match) {
  const winner = normalizePlayerName(String(match.winner || match.winnerId || ""));
  if (!winner) return null;

  const player1 = normalizePlayerName(match.player1 || "");
  const player2 = normalizePlayerName(match.player2 || "");

  if (["1", "first", "first player", "player1", "player 1", "home", "homeplayer", "event first player", "event_first_player"].includes(winner)) return "player1";
  if (["2", "second", "second player", "player2", "player 2", "away", "awayplayer", "event second player", "event_second_player"].includes(winner)) return "player2";
  if (winner === player1 || player1.includes(winner) || winner.includes(player1) || doPlayerNamesMatch(match.player1, winner)) return "player1";
  if (winner === player2 || player2.includes(winner) || winner.includes(player2) || doPlayerNamesMatch(match.player2, winner)) return "player2";

  return null;
}

function isCompletedTennisSet(first: number, second: number) {
  const high = Math.max(first, second);
  const low = Math.min(first, second);

  if (high >= 6 && high - low >= 2) return true;
  if (high === 7 && low >= 5) return true;

  return false;
}

function inferMatchWinnerSideFromScore(match: Match) {
  if (!match.score || match.score === "-") return null;

  const sets = match.score
    .split(/[,;]/)
    .map(parseSetScore)
    .filter((set): set is { first: number; second: number } => Boolean(set));

  if (!sets.length) return null;

  let player1Sets = 0;
  let player2Sets = 0;
  let incompleteSets = 0;

  for (const set of sets) {
    if (!isCompletedTennisSet(set.first, set.second)) {
      incompleteSets += 1;
      continue;
    }

    if (set.first > set.second) {
      player1Sets += 1;
    } else {
      player2Sets += 1;
    }
  }

  if (incompleteSets > 0) return null;
  if (player1Sets === player2Sets) return null;

  const requiredSets = sets.length >= 5 ? 3 : 2;

  if (player1Sets >= requiredSets && player1Sets > player2Sets) return "player1";
  if (player2Sets >= requiredSets && player2Sets > player1Sets) return "player2";

  return null;
}

function inferMatchWinnerSide(match: Match) {
  return getWinnerSideFromWinnerField(match) || inferMatchWinnerSideFromScore(match);
}

function canUseMatchInPlayerForm(match: Match) {
  if (getWinnerSideFromWinnerField(match)) return true;
  if (!isFinishedMatch(match)) return false;

  return Boolean(inferMatchWinnerSideFromScore(match));
}


function isSinglesMatchForPlayerForm(match: Match) {
  const searchable = [match.category, match.tournament, match.round, match.player1, match.player2]
    .join(" ")
    .toLowerCase();

  const isMainTourSingles = /\b(atp|wta)\b/.test(searchable);
  if (!isMainTourSingles) return false;

  return ![
    "double",
    "doubles",
    "mixed",
    "boys",
    "girls",
    "junior",
    "juniors",
    "wheelchair",
    "legend",
    "legends",
  ].some((blocked) => searchable.includes(blocked));
}

function buildPlayerForm(playerName: string, candidateMatches: Match[]) {
  const sortedMatches = [...candidateMatches]
    .filter(isSinglesMatchForPlayerForm)
    .filter((match) => isFinishedMatch(match))
    .sort((a, b) => getMatchTime(b) - getMatchTime(a));
  const excludedMatches: Match[] = [];
  const form: PlayerFormItem[] = [];

  for (const match of sortedMatches) {
    if (form.length >= 10) break;

    const playerSide = getPlayerSide(match, playerName);
    const winnerSide = inferMatchWinnerSide(match);

    if (!playerSide || !winnerSide || !canUseMatchInPlayerForm(match)) {
      excludedMatches.push(match);
      continue;
    }

    form.push({
      match,
      result: playerSide === winnerSide ? "W" : "L",
      opponent: getOpponentForPlayer(match, playerName),
    });
  }

  const wins = form.filter((item) => item.result === "W").length;
  const losses = form.filter((item) => item.result === "L").length;
  const winRate = form.length ? Math.round((wins / form.length) * 100) : null;

  let currentStreakType: "W" | "L" | null = null;
  let currentStreakCount = 0;

  for (const item of form) {
    if (!currentStreakType) {
      currentStreakType = item.result;
      currentStreakCount = 1;
      continue;
    }

    if (item.result === currentStreakType) {
      currentStreakCount += 1;
      continue;
    }

    break;
  }

  const allTournaments = Array.from(
    new Set(form.map((item) => item.match.tournament).filter(Boolean))
  );
  const tournaments = allTournaments.slice(0, 4);

  const tournamentSnapshots = tournaments.map((tournament) => {
    const matches = form.filter((item) => item.match.tournament === tournament);
    const wins = matches.filter((item) => item.result === "W").length;

    return {
      tournament,
      played: matches.length,
      wins,
      losses: matches.length - wins,
    };
  });

  const datedFormItems = form
    .map((item) => ({ item, timestamp: getMatchTime(item.match) }))
    .filter(({ timestamp }) => Number.isFinite(timestamp) && timestamp < Number.MAX_SAFE_INTEGER);

  const largestGapDays = datedFormItems.reduce((largestGap, current, index) => {
    const next = datedFormItems[index + 1];
    if (!next) return largestGap;

    const gapDays = Math.floor(Math.abs(current.timestamp - next.timestamp) / (1000 * 60 * 60 * 24));
    return Math.max(largestGap, gapDays);
  }, 0);

  const hasLargeDateGap = largestGapDays > 30;

  // Use win-rate/streak only when the available feed has enough continuous completed
  // singles rows to support a real recent-form read. Scattered archive rows are
  // useful as available results, but must not be presented as season/career form.
  const hasMeaningfulRecentHistory = form.length >= 5 && !hasLargeDateGap;
  const isPartialAvailableHistory = form.length > 0 && !hasMeaningfulRecentHistory;

  if (process.env.NODE_ENV !== "production") {
    console.info("Player form debug", {
      playerName,
      totalMatchesFound: candidateMatches.length,
      validMatchesUsed: form.length,
      hasLargeDateGap,
      largestGapDays,
      excludedMatches: excludedMatches.map((match) => ({
        id: match.id,
        player1: match.player1,
        player2: match.player2,
        status: match.status,
        score: match.score,
        winner: match.winner || null,
      })),
    });
  }

  return {
    form,
    wins,
    losses,
    winRate,
    currentStreakType,
    currentStreakCount,
    tournaments,
    tournamentSnapshots,
    hasMeaningfulRecentHistory,
    isPartialAvailableHistory,
    hasLargeDateGap,
    largestGapDays,
    debug: {
      playerName,
      totalMatchesFound: candidateMatches.length,
      validMatchesUsed: form.length,
      excludedMatches,
    },
  };
}


export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { canonicalSlug, pageSlug, playerName, isVerifiedPlayer } = getPlayerDisplay(slug);

  const allMatches = await getMatchesForPlayer(playerName);



const playerMatches = allMatches
  .filter((match) =>
    [match.player1, match.player2].some((name) => doPlayerNamesMatch(name || "", playerName)) ||
    matchContainsPlayerText(match, pageSlug)
  )
  .sort(sortMatchesByUserIntent);

  const relatedPlayers = getRelatedPlayers(canonicalSlug, playerMatches);
  const sameTourLabel = canonicalSlug ? players[canonicalSlug].tour : "tennis";
  const editorialProfile = getEditorialProfile(canonicalSlug, playerName, sameTourLabel);
  const pageSummary = getPlayerPageSummary(playerName, playerMatches);
  const { liveMatches, upcomingMatches, finishedMatches, nextMatch, tournaments, headline } = pageSummary;
  const currentTournament = tournaments[0] || finishedMatches[0]?.tournament || upcomingMatches[0]?.tournament || liveMatches[0]?.tournament || "Not listed";
  const playerForm = buildPlayerForm(playerName, playerMatches);

  if (process.env.NODE_ENV !== "production") {
    console.info("Player page match dataset debug", {
      playerName,
      matchCenterMatches: playerMatches.length,
      formMatches: playerForm.form.length,
      finishedMatches: finishedMatches.length,
      liveMatches: liveMatches.length,
    });
  }

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: `${playerName} tennis profile`,
    url: `https://watchtennistoday.com/player/${pageSlug}`,
    about: {
      "@type": "Person",
      name: playerName,
      nationality: editorialProfile.nationality,
      description: `${playerName} tennis match schedule, player context and legal viewing information on Watch Tennis Today.`,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Watch Tennis Today",
      url: "https://watchtennistoday.com",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `When is ${playerName} playing next?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: nextMatch
            ? `${playerName}'s next listed match on this page is ${nextMatch.player1} vs ${nextMatch.player2} at ${nextMatch.tournament}. Start times can change during tournaments, so fans should confirm the official order of play before the match.`
            : `No upcoming match is currently listed for ${playerName}. Tennis schedules can change quickly because of draws, weather delays and withdrawals.`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I watch ${playerName} live?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Legal viewing options for ${playerName} depend on the tournament and your country. Use official broadcasters, licensed streaming platforms and country viewing guides before using any stream.`,
        },
      },
      {
        "@type": "Question",
        name: `Which players are similar to ${playerName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `This page links to related ${sameTourLabel} player schedules and popular tennis profiles so fans can continue browsing match pages without duplicate content.`,
        },
      },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
        <nav className="text-sm text-zinc-400 mb-6 flex flex-wrap gap-2">
  <Link href="/" className="hover:text-white">
    Home
  </Link>

  <span>/</span>

  <a
    href="/players"
    className="hover:text-white"
  >
    Players
  </a>

  <span>/</span>

  <span className="text-white">
    {playerName}
  </span>
</nav>
      <section className="mb-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-sm">
        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-green-400 px-3 py-1 text-xs font-black uppercase tracking-wide text-black">
              {canonicalSlug ? players[canonicalSlug].tour : "Tennis"} player hub
            </span>
            {liveMatches.length ? (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-white animate-pulse">
                Live now
              </span>
            ) : null}
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            {headline}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
            Follow {playerName} with today’s live match status, next opponent, recent results,
            tournament context and official tennis viewing guides in one place.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Live matches</p>
              <p className="mt-1 text-3xl font-black">{liveMatches.length}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Upcoming</p>
              <p className="mt-1 text-3xl font-black">{upcomingMatches.length}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Current tournament</p>
              <p className="mt-1 truncate text-2xl font-black">{currentTournament}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
          Player profile
        </p>
        <h2 className="text-2xl font-black text-zinc-950">
          {playerName} biography, playing style and match context
        </h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 text-sm leading-7 text-zinc-700">
            <p>{editorialProfile.biography}</p>
            <p>{editorialProfile.playingStyle}</p>
            <p>{editorialProfile.careerContext}</p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Tour</p>
                <p className="mt-1 font-black text-zinc-950">{sameTourLabel}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Country / context</p>
                <p className="mt-1 font-black text-zinc-950">{editorialProfile.nationality}</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Surface note</p>
                <p className="mt-1 text-sm leading-6 text-zinc-700">{editorialProfile.surfaceContext}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {editorialProfile.strengths.map((strength) => (
            <div key={strength} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-bold text-zinc-800">
              <span className="text-green-600">✓</span> {strength}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
          Editorial player guide
        </p>
        <h2 className="text-2xl font-black text-zinc-950">
          How to follow {playerName} today
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Match context</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              This page combines live status, upcoming matches, recent available results and tournament links so fans can understand whether {playerName} is scheduled, live, finished or waiting for an updated order of play.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Legal viewing checks</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Tennis broadcast rights depend on the event and viewer location. Before subscribing or clicking an external provider, confirm the tournament, court assignment and local broadcaster on official sources.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Schedule caution</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Tennis start times can move when earlier matches run long, rain interrupts play or a player withdraws. Treat listed times as planning information and check the official order of play close to match time.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Data transparency</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Live score and schedule feeds may be incomplete for lower-level events. When the available feed is limited, this page avoids presenting partial data as full season form or guaranteed broadcast availability.
            </p>
          </div>
        </div>
      </section>

      {!isVerifiedPlayer ? (
        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-sm leading-7 text-zinc-300">
          <p>
            This is a fallback tennis player schedule page created from a live-data slug.
            The player name has not been manually verified yet, so the page is kept out
            of search indexing while still giving crawlers and visitors a useful landing
            page instead of a 404.
          </p>
        </section>
      ) : null}

      <div className="mb-8">
        <LocalPlayerFollowButton
          playerName={playerName}
          playerSlug={pageSlug}
        />
      </div>
      <div className="mb-8">
        <PlayerFollowCTA
          playerName={playerName}
          playerSlug={pageSlug}
          source="player-page-revenue-cta"
        />
      </div>


      {playerMatches.some(isLiveMatch) ? (
  <section className="mb-8 rounded-2xl border border-red-500 bg-red-500/10 p-6">
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <span className="bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full animate-pulse">
        🔴 LIVE NOW
      </span>

      <span className="text-red-300 font-bold">
        {playerName} is currently playing live
      </span>
    </div>

    <p className="text-zinc-300 mb-5 leading-8">
      Follow the live match, score updates, official viewing information and current
      tournament coverage for {playerName}.
    </p>

    <div className="flex flex-wrap gap-3">
      {playerMatches
        .filter(isLiveMatch)
        .slice(0, 2)
        .map((match) => (
          <Link
            key={match.id}
            href={`/watch/${getMatchSlug(match)}`}
            className="rounded-2xl bg-red-500 px-5 py-3 font-black text-white hover:bg-red-400 transition-all"
          >
            Open Match Page →
          </Link>
        ))}
    </div>
  </section>
) : null}


      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Player form tracker
            </p>
            <h2 className="text-2xl font-black text-zinc-950">
              {playerName} recent results and form guide
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
              {playerForm.hasMeaningfulRecentHistory
                ? "Recent completed singles results from API-Tennis player history. Doubles, juniors, wheelchair and legends events are filtered out."
                : "Available feed results. This feed does not include every match from the player&apos;s season. Singles only, with doubles, juniors, wheelchair and legends events filtered out."}
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-black uppercase text-zinc-600">
            {playerForm.hasMeaningfulRecentHistory ? "Recent form" : "Available feed results"}
          </span>
        </div>

        {playerForm.form.length ? (
          <>
            <div className={`grid gap-4 ${playerForm.hasMeaningfulRecentHistory ? "lg:grid-cols-[1.35fr_0.9fr]" : ""}`}>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-zinc-600">
                    {playerForm.hasMeaningfulRecentHistory ? "Continuous form guide" : "Partial results found"}
                  </p>
                  <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
                    {playerForm.form.length} match{playerForm.form.length === 1 ? "" : "es"}
                  </p>
                </div>

                {playerForm.hasMeaningfulRecentHistory ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {playerForm.form.map((item) => (
                      <a
                        key={item.match.id}
                        href={`/watch/${getMatchSlug(item.match)}`}
                        title={`${item.result === "W" ? "Won" : "Lost"} vs ${item.opponent}`}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-black transition hover:scale-105 ${
                          item.result === "W"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.result}
                      </a>
                    ))}
                  </div>
                ) : null}

                {!playerForm.hasMeaningfulRecentHistory ? (
                  <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm leading-7 text-amber-900">
                    This feed does not include every match from the player&apos;s season{playerForm.hasLargeDateGap ? ` and has a ${playerForm.largestGapDays}-day gap between available results` : ""}. These rows are shown as partial available results, not as recent form, season form or career form.
                  </p>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-zinc-600">
                    Winner is taken from the feed when available, otherwise inferred only from clearly completed tennis scores. Unclear rows are excluded.
                  </p>
                )}
              </div>

              {playerForm.hasMeaningfulRecentHistory ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-5 text-white">
                  <p className="text-sm font-bold text-zinc-400">Current streak</p>
                  <p className="mt-3 text-3xl font-black">
                    {playerForm.currentStreakType && playerForm.currentStreakCount
                      ? `${playerForm.currentStreakType === "W" ? "🔥" : "⚠️"} ${playerForm.currentStreakCount} ${playerForm.currentStreakType === "W" ? "win" : "loss"}${playerForm.currentStreakCount === 1 ? "" : "es"}`
                      : `${playerForm.wins}-${playerForm.losses}`}
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs text-zinc-400">Wins</p>
                      <p className="text-xl font-black">{playerForm.wins}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs text-zinc-400">Losses</p>
                      <p className="text-xl font-black">{playerForm.losses}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs text-zinc-400">Win rate</p>
                      <p className="text-xl font-black">
                        {playerForm.winRate !== null ? `${playerForm.winRate}%` : "TBC"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {playerForm.hasMeaningfulRecentHistory && playerForm.tournamentSnapshots.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {playerForm.tournamentSnapshots.map((snapshot) => (
                  <div key={snapshot.tournament} className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <p className="truncate text-sm font-black text-zinc-950">{snapshot.tournament}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                      {snapshot.played} completed · {snapshot.wins}-{snapshot.losses}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3">
              {playerForm.form.slice(0, 10).map((item) => {
                const opponentSlug = getPlayerSlugByName(item.opponent);

                return (
                  <div
                    key={item.match.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 p-4"
                  >
                    <div>
                      <p className="font-black text-zinc-950">
                        {item.result === "W" ? "Won" : "Lost"} vs {opponentSlug ? (
                          <Link href={`/player/${opponentSlug}`} className="hover:text-green-600">
                            {item.opponent}
                          </Link>
                        ) : item.opponent}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {item.match.tournament} · {formatMatchDateTime(item.match.startTime)}
                      </p>
                    </div>
                    <a
                      href={`/watch/${getMatchSlug(item.match)}`}
                      className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-bold text-zinc-800 hover:border-green-500 hover:bg-green-50"
                    >
                      {item.match.score || "Open result"} →
                    </a>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-7 text-zinc-600">
            <p className="font-bold text-zinc-800">No usable completed matches yet.</p>
            <p className="mt-2">
              The available feed does not currently provide completed singles results with a reliable winner for {playerName}. Doubles, juniors, wheelchair and legends events are intentionally excluded.
            </p>
          </div>
        )}
      </section>

      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Player match center
            </p>
            <h2 className="text-2xl font-black text-zinc-950">
              {playerName} live, next match and recent results
            </h2>
          </div>
          <Link href="/today" className="text-sm font-bold text-green-600 hover:text-green-500">
            Today’s full schedule →
          </Link>
        </div>

        {playerMatches.length > 0 ? (
          <div className="grid gap-3">
            {playerMatches.slice(0, 10).map((match) => {
              const live = isLiveMatch(match);
              const finished = isFinishedMatch(match);
              const opponent = getOpponentForPlayer(match, playerName);

              return (
                <article
                  key={match.id}
                  className="rounded-2xl border border-zinc-200 p-3 transition hover:border-green-500 hover:bg-green-50/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {live ? (
                          <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase text-white animate-pulse">
                            Live
                          </span>
                        ) : !finished ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black uppercase text-green-700">
                            Next
                          </span>
                        ) : null}
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
                          {match.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-zinc-950">
                        {match.player1} vs {match.player2}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600">
                        Opponent/context: {opponent} · {formatMatchDateTime(match.startTime)}
                      </p>
                      {match.score ? (
                        <p className="mt-2 text-sm font-bold text-zinc-800">Score: {match.score}</p>
                      ) : null}
                    </div>

                    <a
                      href={`/tournament/${slugify(match.tournament)}`}
                      className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold text-zinc-600 hover:border-green-500 hover:text-green-600"
                    >
                      {match.tournament}
                    </a>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`/watch/${getMatchSlug(match)}`}
                      className="inline-flex items-center rounded-xl bg-black px-3 py-2 text-sm font-bold text-white hover:bg-zinc-800 transition-all"
                    >
                      {live ? "Follow live match" : finished ? "Open result" : "Open match"} →
                    </a>
                    <a
                      href={`/watch-player-live/${pageSlug}`}
                      className="inline-flex items-center rounded-xl border border-zinc-200 px-3 py-2 text-sm font-bold text-zinc-900 hover:border-green-500 hover:bg-white"
                    >
                      {playerName} live stream guide
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <>
            <p className="text-zinc-600 leading-7">
              No upcoming matches are currently listed for {playerName}. Tennis schedules can
              change quickly because of tournament draws, weather delays, withdrawals and TV
              scheduling updates.
            </p>

            <p className="mt-3 text-zinc-600 leading-7">
              You can still explore live tennis schedules, tournament pages and official
              broadcaster information to check where future {playerName} matches may be
              available legally.
            </p>
          </>
        )}
      </section>


      {tournaments.length ? (
        <section className="mb-10 rounded-3xl border border-zinc-200 bg-neutral-50 p-6">
          <h2 className="mb-3 text-2xl font-black text-zinc-950">
            Current tournament context for {playerName}
          </h2>
          <p className="mb-5 text-sm leading-7 text-zinc-600">
            These are the tournaments currently connected to {playerName} in today’s match feed.
            Use them for draw, schedule and TV coverage context.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <a
                key={tournament}
                href={`/tournament/${slugify(tournament)}`}
                className="rounded-2xl border border-zinc-200 bg-white p-4 font-bold text-zinc-950 hover:border-green-500 hover:bg-green-50"
              >
                {tournament} →
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mb-10">
        <EmailCapture
          title={`Get notified when ${playerName} appears in today’s tennis schedule`}
          description="Get useful player alerts for next match windows, live status and official viewing checks. No spam and no unofficial stream links."
          placeholder="Email for player alerts"
          buttonText="Follow player"
          contextType="player"
          contextValue={playerName}
        />
      </div>

      <RevenueConversionPanel context="player" playerName={playerName} />


      <section className="mb-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Keep watching
            </p>
            <h2 className="text-2xl font-semibold">
              Related tennis players
            </h2>
          </div>
          <a href="/players" className="text-sm font-bold text-green-600 hover:text-green-500">
            All players →
          </a>
        </div>

        <p className="mb-5 text-sm leading-7 text-zinc-600">
          Similar player pages help fans continue from one schedule page to another without adding duplicate content or interrupting the reading experience.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {relatedPlayers.map((playerSlug) => {
            const player = players[playerSlug];
            const isSameTour = canonicalSlug
              ? player.tour === players[canonicalSlug].tour
              : false;

            return (
              <a
                key={playerSlug}
                href={`/player/${playerSlug}`}
                className="rounded-2xl border border-zinc-200 p-4 transition hover:border-green-500 hover:bg-green-50"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-bold">{player.name}</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-600">
                    {player.tour}
                  </span>
                </div>
                <p className="text-sm leading-6 text-zinc-600">
                  {isSameTour ? "Same tour schedule and live match coverage" : "Popular player schedule and TV coverage"}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="mb-10 rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">Related resources</p>
        <h2 className="text-2xl font-black text-zinc-950">Player resources for rankings, tournaments and legal viewing</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
          Continue from {playerName} to evergreen guides that explain rankings, tournament levels, scoring and legal streaming checks.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/atp-wta-rankings-explained" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-black text-zinc-900 hover:border-green-500">Rankings explained →</Link>
          <Link href="/tennis-tournament-levels-guide" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-black text-zinc-900 hover:border-green-500">Tournament levels →</Link>
          <Link href="/guides/tennis-scoring-explained" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-black text-zinc-900 hover:border-green-500">Tennis scoring →</Link>
          <Link href="/tennis-streaming" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-black text-zinc-900 hover:border-green-500">Legal streaming hub →</Link>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
        <h2 className="text-3xl font-black mb-5">
          📺 Where to Watch {playerName} Live
        </h2>

        <div className="space-y-5 text-zinc-300 leading-8">
          <p>
  Tennis fans can watch {playerName} live through official sports broadcasters,
  licensed streaming platforms and tournament TV partners, depending on country
  and tournament rights.
</p>

          <p>
            Coverage may include ATP Tour events, WTA tournaments, Grand Slams,
            Masters events and international competitions featuring {playerName}.
          </p>

          <p>
            Watch Tennis Today helps fans find match schedules, live tennis coverage,
            official viewing options and TV channels for upcoming {playerName} matches.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/watch"
            className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400 transition-all"
          >
            View Tennis Schedule
          </Link>

          <Link
            href="/live-tennis"
            className="rounded-2xl bg-zinc-800 px-5 py-3 font-black text-white hover:bg-zinc-700 transition-all"
          >
            Live Tennis Schedule
          </Link>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
  <h2 className="text-xl font-bold mb-3">
    Legal Tennis Viewing Information
  </h2>

  <p className="text-sm leading-7 text-zinc-700">
    Watch Tennis Today is an informational tennis guide. We do not stream matches,
    embed live video or bypass broadcaster restrictions. Our player pages are built
    to help fans compare legal viewing options, understand tournament coverage and
    find official match information.
  </p>
</section>

     <section className="mb-10 rounded-2xl border border-zinc-200 p-6 space-y-4 text-sm leading-7">
  <h2 className="text-2xl font-semibold">
    About {playerName} Matches and Coverage
  </h2>

  <p>
    This page is designed to help tennis fans follow {playerName} in a legal and
    practical way. Instead of hosting streams, Watch Tennis Today focuses on match
    schedules, tournament context, official broadcaster information and country-based
    viewing guidance.
  </p>

  <p>
    Tennis TV rights can change depending on the tournament, location and broadcast
    partner. For that reason, availability for {playerName} matches may differ between
    ATP, WTA, Grand Slam and other professional tennis events.
  </p>

  <p>
    When no upcoming match is listed, fans can still use this page to explore related
    tournament coverage, live tennis schedules and official viewing options for future
    {playerName} matches.
  </p>

  <p>
    Watch Tennis Today does not host live tennis streams and does not provide
    unauthorized access to copyrighted broadcasts. The goal of this page is to make it
    easier to find reliable tennis viewing information from legitimate sources.
  </p>
</section>
     

      <section className="mb-10 rounded-3xl border border-zinc-200 bg-white p-6 text-zinc-700">
        <h2 className="text-2xl font-black text-zinc-950">Sources for this player page</h2>
        <p className="mt-3 text-sm leading-7">
          Player pages combine editorial context with available match and schedule data. Broadcast availability should always be verified with official tournament and broadcaster sources because tennis rights vary by country and event.
        </p>
        <ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">ATP Tour official player and tournament information</li>
          <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">WTA official player and tournament information</li>
          <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">ITF rules and tournament context where relevant</li>
          <li className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">Official tournament websites and order-of-play pages</li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3 text-sm font-black">
          <Link href="/how-we-source-data" className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-900 hover:border-green-500">How we source data</Link>
          <Link href="/how-we-verify-streams" className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-900 hover:border-green-500">How we verify streams</Link>
          <Link href="/tennis-guides" className="rounded-full border border-zinc-300 px-4 py-2 text-zinc-900 hover:border-green-500">Tennis guides hub</Link>
        </div>
      </section>

      <section className="mb-10 rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-2xl font-black text-zinc-950">
          {playerName} live stream and schedule FAQ
        </h2>
        <div className="space-y-4 text-sm leading-7 text-zinc-700">
          <div>
            <h3 className="font-black text-zinc-950">Is {playerName} playing today?</h3>
            <p>
              Check the match center above for live, upcoming and recently finished matches.
              Tennis order of play can change after long matches, weather delays or withdrawals.
            </p>
          </div>
          <div>
            <h3 className="font-black text-zinc-950">Where can I watch {playerName} legally?</h3>
            <p>
              Legal broadcasters depend on your country and the tournament. Start with the country
              guides and official tournament pages linked from this page before choosing a service.
            </p>
          </div>
          <div>
            <h3 className="font-black text-zinc-950">Why does the match time change?</h3>
            <p>
              Tennis matches are often scheduled after previous matches on the same court. A late finish,
              rain delay or court change can move the start time.
            </p>
          </div>
        </div>
      </section>

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
/>

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
/>

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",

      "@type": "BreadcrumbList",

      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://watchtennistoday.com",
        },

        {
          "@type": "ListItem",
          position: 2,
          name: "Players",
          item: "https://watchtennistoday.com/players",
        },

        {
          "@type": "ListItem",
          position: 3,
          name: playerName,
          item: `https://watchtennistoday.com/player/${pageSlug}`,
        },
      ],
    }),
  }}
/>
    </main>
  );
}
