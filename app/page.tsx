"use client";

import { useEffect, useState } from "react";
import { withTracking } from "@/app/lib/tracking";
import { affiliateLinks } from "@/app/lib/affiliateLinks";
import TodaysTennisHub from "@/app/components/TodaysTennisHub";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import BestMatchesTodayEngine from "@/app/components/BestMatchesTodayEngine";
import BroadcastFinder from "@/app/components/BroadcastFinder";
import HomepageGrowthEngine from "@/app/components/HomepageGrowthEngine";
import EmailSignup from "@/app/components/EmailSignup";
import { displayPlayerName, safePlayerUrl, verifiedPlayersFromMatchSide } from "@/data/playerSlugs";

type WatchProvider = {
  name: string;
  url: string;
  accessType: string;
  verificationStatus: string;
  note: string;
};

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string;
  watchProviders: WatchProvider[];
  round?: string;
isFinal?: boolean;
};

const countries = [
  "poland",
  "uk",
  "usa",
  "germany",
  "france",
  "spain",
  "italy",
  "canada",
  "australia",
  "india",
];

const priorityPlayers = [
  "Jannik Sinner",
  "Carlos Alcaraz",
  "Novak Djokovic",
  "Daniil Medvedev",
  "Alexander Zverev",
  "Iga Swiatek",
  "Aryna Sabalenka",
  "Coco Gauff",
];

function isGrandSlamTournament(tournament: string) {
  const name = tournament.toLowerCase();

  return (
    name.includes("roland") ||
    name.includes("french open") ||
    name.includes("wimbledon") ||
    name.includes("us open") ||
    name.includes("australian open")
  );
}

function getSafeWatchProviders(match: Match) {
  if (!isGrandSlamTournament(match.tournament)) {
    return match.watchProviders;
  }

  const filtered = match.watchProviders.filter((provider) => {
    const name = provider.name.toLowerCase();
    return !name.includes("tennis tv") && !name.includes("atp tv");
  });

  if (filtered.length > 0) return filtered;

  if (match.tournament.toLowerCase().includes("french open") || match.tournament.toLowerCase().includes("roland")) {
    return [
      {
        name: "Roland-Garros official broadcasters",
        url: "https://www.rolandgarros.com/en-us/broadcasters",
        accessType: "REGION_DEPENDENT",
        verificationStatus: "TOURNAMENT_VERIFIED",
        note: "French Open rights are separate from Tennis TV. Check the official broadcaster list for your country.",
      },
    ];
  }

  return [
    {
      name: "Official Grand Slam broadcasters",
      url: "/watch-tennis-in/usa",
      accessType: "REGION_DEPENDENT",
      verificationStatus: "TOURNAMENT_VERIFIED",
      note: "Grand Slam streaming rights are separate from Tennis TV and vary by country.",
    },
  ];
}

function readableCountry(country: string) {
  return country
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function playerUrl(name: string) {
  return safePlayerUrl(name);
}
function matchSlug(match: Match) {
  const readablePart = `${match.player1}-vs-${match.player2}`
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
}

function isRealPlayerSide(value?: string) {
  const name = String(value || "").trim();

  if (!name) return false;

  const normalized = name.toLowerCase();

  const blockedValues = [
    "unknown player",
    "unknown",
    "tbd",
    "bye",
    "vs",
    "-",
    "—",
  ];

  if (blockedValues.includes(normalized)) return false;

  // API-Tennis sometimes returns placeholder-like sides made only of separators.
  return /[a-z]/i.test(name);
}

function splitPlayers(name: string) {
  return verifiedPlayersFromMatchSide(name);
}

function displayablePlayers(name?: string) {
  const rawName = String(name || "").trim();

  if (!isRealPlayerSide(rawName)) return [];

  const verifiedPlayers = splitPlayers(rawName)
    .map((player) => player.trim())
    .filter(isRealPlayerSide);

  if (verifiedPlayers.length > 0) {
    return verifiedPlayers;
  }

  const fallbackName = displayPlayerName(rawName).trim();

  return isRealPlayerSide(fallbackName) ? [fallbackName] : [];
}

function hasRenderablePlayers(match: Match) {
  return (
    displayablePlayers(match.player1).length > 0 &&
    displayablePlayers(match.player2).length > 0
  );
}

function getHomepageMatches(matches: Match[]) {
  return matches.filter(hasRenderablePlayers);
}

function hasPriorityPlayer(match: Match) {
  const text = `${match.player1} ${match.player2}`.toLowerCase();

  return priorityPlayers.some((player) =>
    text.includes(player.toLowerCase().split(" ").pop() || "")
  );
}

function uniquePlayers(matches: Match[]) {
  const players = matches.flatMap((match) => [
    ...displayablePlayers(match.player1),
    ...displayablePlayers(match.player2),
  ]);

  return [...new Set(players)]
    .filter(Boolean)
    .sort((a, b) => {
      const aPriority = priorityPlayers.some(
        (player) => player.toLowerCase() === a.toLowerCase()
      );

      const bPriority = priorityPlayers.some(
        (player) => player.toLowerCase() === b.toLowerCase()
      );

      if (aPriority && !bPriority) return -1;
      if (!aPriority && bPriority) return 1;

      return a.localeCompare(b);
    })
    .slice(0, 40);
}

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [finalsEmail, setFinalsEmail] = useState("");
const [finalsLoading, setFinalsLoading] = useState(false);
const [finalsMessage, setFinalsMessage] = useState("");
async function subscribeToFinals(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (!finalsEmail) return;

  try {
    setFinalsLoading(true);
    setFinalsMessage("");

    const response = await fetch("/api/subscribe-finals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: finalsEmail,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setFinalsMessage(
        data.message || "Something went wrong"
      );

      return;
    }

    setFinalsMessage(
      "🎾 You are subscribed to ATP/WTA finals alerts!"
    );

    setFinalsEmail("");
  } catch (error) {
    setFinalsMessage(
      "Something went wrong. Please try again."
    );
  } finally {
    setFinalsLoading(false);
  }
}

  useEffect(() => {
    async function loadMatches() {
      try {
        const matchesResponse = await fetch("/api/matches");

        if (!matchesResponse.ok) {
          setMatches([]);
          return;
        }

        const matchesData = await matchesResponse.json();

        const safeMatches = Array.isArray(matchesData)
          ? matchesData
          : Array.isArray(matchesData.matches)
            ? matchesData.matches
            : [];

        setMatches(safeMatches);
      } catch (error) {
        console.error("Failed to load matches");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  const homepageMatches = getHomepageMatches(matches);
  const seoPlayers = uniquePlayers(homepageMatches);

  const filteredMatches = homepageMatches.filter((match) => {
    const matchesFilter =
      selectedFilter === "ALL" ||
      match.category === selectedFilter ||
      (selectedFilter === "LIVE" && match.status === "LIVE");

    const search = searchQuery.toLowerCase();

    const matchesSearch =
      match.player1.toLowerCase().includes(search) ||
      match.player2.toLowerCase().includes(search) ||
      match.tournament.toLowerCase().includes(search);

    return matchesFilter && matchesSearch;
  });

  const livePlayers = [
    ...new Set(
      homepageMatches
        .filter((match) => match.status === "LIVE")
        .flatMap((match) => [
          ...displayablePlayers(match.player1),
          ...displayablePlayers(match.player2),
        ])
        .map((player) => player.trim())
        .filter(Boolean)
    ),
  ].sort((a, b) => {
    const aPriority = priorityPlayers.some(
      (player) => player.toLowerCase() === a.toLowerCase()
    );

    const bPriority = priorityPlayers.some(
      (player) => player.toLowerCase() === b.toLowerCase()
    );

    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;

    return a.localeCompare(b);
  });

  const topLiveMatches = homepageMatches
    .filter((match) => match.status === "LIVE" && hasPriorityPlayer(match))
    .slice(0, 4);

  const upcomingFinals = homepageMatches
  .filter((match) => {
    const category = (match.category || "").toLowerCase();
    const round = (match.round || "").toLowerCase();
    const tournament = (match.tournament || "").toLowerCase();

    const isAllowedCategory = category === "atp" || category === "wta";

    const isFinalRound =
      round.includes("final") &&
      !round.includes("semi") &&
      !round.includes("quarter");

    const isGrandSlam =
      tournament.includes("french open") ||
      tournament.includes("roland garros") ||
      tournament.includes("wimbledon") ||
      tournament.includes("us open") ||
      tournament.includes("australian open");

    return (
      isAllowedCategory &&
      isFinalRound &&
      !isGrandSlam &&
      match.startTime &&
      match.status !== "FINISHED" &&
      match.status !== "CANCELLED"
    );
  })
  .sort((a, b) => {
    const categoryPriority = (category?: string) => {
      const cat = (category || "").toLowerCase();

      if (cat === "wta") return 1;
      if (cat === "atp") return 2;

      return 3;
    };

    const priorityDiff =
      categoryPriority(a.category) - categoryPriority(b.category);

    if (priorityDiff !== 0) return priorityDiff;

    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  })
  .slice(0, 6);

    const featuredMatch =
  topLiveMatches[0] ||
  homepageMatches.find(
    (match) =>
      match.category === "ATP" ||
      match.category === "WTA"
  ) ||
  homepageMatches[0];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-10">
          <div>
            {featuredMatch ? (
  <section className="mb-12 rounded-[2.5rem] border border-red-500 bg-gradient-to-br from-zinc-900 to-black p-8 overflow-hidden relative">
    <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/10 blur-3xl" />

    <div className="relative z-10">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <span className="bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full animate-pulse">
          🔴 FEATURED MATCH
        </span>

        <span className="text-zinc-400">
          {featuredMatch.category}
        </span>

        <span className="text-zinc-500">•</span>

        <span className="text-zinc-400">
          {featuredMatch.tournament}
        </span>
      </div>

      <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">
        {displayPlayerName(featuredMatch.player1)}
        <br />
        vs
        <br />
        {displayPlayerName(featuredMatch.player2)}
      </h2>

      <div className="flex flex-wrap gap-6 mb-8 text-lg">
        <div>
          <p className="text-zinc-500 text-sm mb-1">
            Status
          </p>

          <p className="font-black text-red-400">
            {featuredMatch.status}
          </p>
        </div>

        <div>
          <p className="text-zinc-500 text-sm mb-1">
            Score
          </p>

          <p className="font-black">
            {featuredMatch.score || "-"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <a
          href={`/watch/${matchSlug(featuredMatch)}`}
          className="inline-flex items-center rounded-2xl bg-green-500 px-6 py-4 text-lg font-black text-black hover:bg-green-400 transition-all"
        >
          Match Details →
        </a>

        <a
          href="/live-tennis"
          className="inline-flex items-center rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-zinc-500 transition-all"
        >
          More Live Tennis
        </a>
      </div>
    </div>
  </section>
) : null}

<section className="mb-12 rounded-[2.5rem] border border-orange-500 bg-gradient-to-br from-orange-950/40 to-black p-8">
  <div className="flex flex-wrap items-center gap-3 mb-5">
    <span className="bg-orange-500 text-black text-sm font-black px-4 py-2 rounded-full">
      🎾 GRAND SLAM
    </span>

    <span className="text-zinc-400">
      Roland Garros / French Open 2026
    </span>
  </div>

  <h2 className="text-5xl md:text-6xl font-black leading-tight mb-6">
    French Open Live:
    <br />
    Matches, Schedule,
    <br />
    TV & Streaming
  </h2>

  <p className="text-zinc-300 text-lg leading-8 max-w-3xl mb-8">
    Follow French Open live matches, today’s schedule, TV channels,
    official broadcasters, player draws, scores and Grand Slam updates
  </p>

  <div className="flex flex-wrap gap-4">
    <a
      href="/french-open-live"
      className="inline-flex items-center rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black hover:bg-orange-400 transition-all"
    >
      Watch French Open →
    </a>

    <a
      href="/french-open-tv-schedule"
      className="inline-flex items-center rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-zinc-500 transition-all"
    >
      TV Channels
    </a>
  </div>
</section>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Watch Tennis Today: Live Tennis Matches, TV Channels & Streaming Schedule
            </h1>

            <p className="text-zinc-300 text-lg leading-8 max-w-3xl mb-10">
              Find live tennis matches today, official TV broadcasters,
ATP and WTA schedules, Grand Slam coverage and country-based
tennis viewing information.
            </p>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 mb-10 max-w-3xl">
  <p className="text-sm text-zinc-400 leading-relaxed">
    Watch Tennis Today does not host, stream, embed or retransmit live tennis
    broadcasts. We provide informational coverage, schedules and links to
    official broadcaster and streaming platform resources only.
  </p>
</div>

<div className="mb-10 flex flex-wrap gap-3">
  <a
    href="/today"
    className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400"
  >
    Today&apos;s matches
  </a>
  <a
    href="/tomorrow"
    className="rounded-2xl border border-blue-500/60 px-5 py-3 font-black text-blue-200 hover:border-blue-300 hover:text-blue-100"
  >
    Tomorrow&apos;s schedule
  </a>
  <a
    href="/compare"
    className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold text-zinc-300 hover:border-zinc-500 hover:text-white"
  >
    Compare streaming services
  </a>
</div>

<HomepageGrowthEngine matches={homepageMatches} />
<TodaysTennisHub matches={homepageMatches} />
<BestMatchesTodayEngine matches={homepageMatches} />
<BroadcastFinder />

        <RevenueConversionPanel context="homepage" />

<section className="mb-12 rounded-[2.5rem] border border-cyan-400/40 bg-gradient-to-br from-cyan-950/30 to-black p-8">
  <div className="flex flex-wrap items-center gap-3 mb-5">
    <span className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-black text-black">
      📺 Streaming decision guide
    </span>

    <span className="text-sm text-zinc-400">
      Compare legal services before subscribing
    </span>
  </div>

  <h2 className="text-4xl font-black mb-4">
    Not sure which service shows tennis today?
  </h2>

  <p className="max-w-3xl text-zinc-300 leading-7 mb-6">
    Tennis coverage is split between ATP, WTA, Grand Slam and country-specific broadcasters. Use the streaming services guide to choose the right legal option and avoid paying for the wrong platform.
  </p>

  <a
    href="/tennis-streaming-services"
    className="inline-flex rounded-2xl bg-cyan-400 px-6 py-4 font-black text-black hover:bg-cyan-300"
  >
    Compare tennis streaming services →
  </a>
</section>

<section className="mb-12 rounded-[2.5rem] border border-lime-400/40 bg-gradient-to-br from-lime-950/30 to-black p-8">
  <div className="flex flex-wrap items-center gap-3 mb-5">
    <span className="rounded-full bg-lime-400 px-4 py-2 text-sm font-black text-black">
      🔔 Free tennis alerts
    </span>

    <span className="text-sm text-zinc-400">
      Turn daily traffic into returning visitors
    </span>
  </div>

  <h2 className="text-4xl font-black mb-4">
    Get tennis match alerts before the best matches start
  </h2>

  <p className="max-w-3xl text-zinc-300 leading-7 mb-6">
    Subscribe for practical schedule reminders, TV channel checks and Grand Slam
    viewing notes. No illegal streams — just legal tennis viewing guidance.
  </p>

  <a
    href="/tennis-live-alerts"
    className="inline-flex rounded-2xl bg-lime-400 px-6 py-4 font-black text-black hover:bg-lime-300"
  >
    Set up tennis alerts →
  </a>
</section>
<section className="max-w-4xl mb-10 text-zinc-300 leading-relaxed">
  <h2 className="text-3xl font-black text-white mb-5">
    What Watch Tennis Today Does
  </h2>

  <p className="mb-4">
    Watch Tennis Today is designed to help tennis fans follow ATP, WTA,
    Challenger and Grand Slam tennis more easily.
  </p>

  <p className="mb-4">
    The site combines live tennis matches, TV schedules, broadcaster guides,
    player pages and tournament coverage in one place.
  </p>

  <p>
    Because tennis broadcast rights vary between countries and tournaments,
    many fans struggle to find official viewing information quickly. This site
    aims to simplify that process with structured tennis viewing guides and
    live match pages.
  </p>
</section>

<section className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-5">
  <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-6">
    <h2 className="text-2xl font-black mb-4">
      How We Choose Tennis Viewing Options
    </h2>

    <p className="text-zinc-300 leading-7 mb-4">
      Tennis broadcast rights change by country, tournament and platform.
      Watch Tennis Today prioritizes official broadcasters, tournament pages,
      recognized streaming services and clearly labelled partner offers.
    </p>

    <p className="text-zinc-400 leading-7">
      We avoid promoting unofficial streams. When a viewing option cannot be
      confirmed, we label it carefully instead of presenting it as guaranteed.
    </p>
  </div>

  <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-6">
    <h2 className="text-2xl font-black mb-4">
      What You Can Check Here
    </h2>

    <ul className="space-y-3 text-zinc-300 leading-7">
      <li>• Which tennis matches are live or starting soon.</li>
      <li>• Which tournament a match belongs to.</li>
      <li>• Where official TV or streaming coverage may be available.</li>
      <li>• Player pages for popular ATP and WTA names.</li>
      <li>• Country guides for legal tennis streaming options.</li>
    </ul>
  </div>

  <div className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-6">
    <h2 className="text-2xl font-black mb-4">
      Why This Matters For Tennis Fans
    </h2>

    <p className="text-zinc-300 leading-7 mb-4">
      A match that is easy to watch in one country may be locked behind a
      different broadcaster somewhere else. Grand Slams, ATP, WTA and smaller
      events often have separate rights agreements.
    </p>

    <p className="text-zinc-400 leading-7">
      This site brings the key information into one tennis-focused hub so fans
      can compare routes before searching across multiple apps and TV guides.
    </p>
  </div>
</section>

<section className="mb-12 rounded-[2.5rem] border border-zinc-800 bg-zinc-950 p-8">
  <div className="max-w-4xl">
    <p className="text-sm font-black uppercase tracking-[0.2em] text-green-400 mb-4">
      Editorial note
    </p>

    <h2 className="text-3xl md:text-4xl font-black mb-5">
      We Focus On Legal Tennis Streaming Information
    </h2>

    <div className="space-y-5 text-zinc-300 leading-8">
      <p>
        Watch Tennis Today is an informational tennis guide. The site does not
        provide pirated streams, hidden video embeds, illegal IPTV links or
        access to copyrighted broadcasts without permission.
      </p>

      <p>
        Our goal is to help fans understand where tennis is usually shown,
        which official services may carry a match, and how viewing options can
        differ between countries. For final confirmation, users should always
        check the official broadcaster or tournament source before purchasing a
        subscription or planning to watch a specific match.
      </p>
    </div>
  </div>
</section>
            <div className="flex flex-wrap items-center gap-3 mb-10">
  <div className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400">
    ● Live updates
  </div>

  <p className="text-zinc-500 text-sm">
    Last updated: {new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })}
  </p>
</div>

            <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-12">
              <a
                href="/live-tennis"
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 transition-all"
              >
                Live Tennis Today
              </a>

              <a
                href="/tournament"
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 transition-all"
              >
                Tennis Tournaments
              </a>

              <a
                href="/best-ways-to-watch-tennis-online"
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 transition-all"
              >
                Best Ways to Watch Tennis Online
              </a>

              <a
  href="/how-to-watch-tennis-safely-abroad"
  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 transition-all"
>
  How to Watch Tennis Safely Abroad
</a>

<a
  href="/players/live-now"
  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-red-500 hover:text-red-400 transition-all"
>
  Live Players Now
</a>

<a
  href="/tennis-trending-now"
  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-orange-500 hover:text-orange-400 transition-all"
>
  🔥 Tennis Trending Now
</a>

<a
  href="/players"
  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-yellow-500 hover:text-yellow-400 transition-all"
>
  ⭐ Tennis Players
</a>

            </div>

            <a
              href="/watch"
              className="inline-block mt-5 bg-green-500 text-black font-bold px-5 py-3 rounded-2xl hover:bg-green-400 transition-all"
            >
              📺 Where to watch
            </a>

            <a
              href="/tv-schedule"
              className="inline-block mt-5 ml-3 bg-zinc-800 text-white font-bold px-5 py-3 rounded-2xl hover:bg-zinc-700 transition-all"
            >
              📺 TV Schedule
            </a>

            <a
              href="/live-tennis"
              className="inline-block mt-5 ml-3 bg-red-500 text-white font-bold px-5 py-3 rounded-2xl hover:bg-red-400 transition-all"
            >
              🔴 Live Tennis
            </a>

            <section className="mb-12 mt-10 rounded-[2rem] border border-emerald-500/40 bg-emerald-950/20 p-6">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-black text-black">
                  💸 Streaming guides
                </span>
                <span className="text-sm text-zinc-400">
                  Helpful money pages for tennis fans who want legal viewing options
                </span>
              </div>
              <h2 className="mb-4 text-3xl font-black text-white">
                Tennis Streaming Guides That Help You Choose Safely
              </h2>
              <p className="mb-6 max-w-3xl text-zinc-300 leading-7">
                Compare legal ways to watch tennis online, check country-based broadcaster
                guides and prepare before Grand Slam matches without relying on risky stream sites.
              </p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <a href="/best-vpn-for-tennis-streaming" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 font-bold hover:border-emerald-400">
                  Best VPN for tennis streaming
                </a>
                <a href="/best-vpn-for-roland-garros" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 font-bold hover:border-emerald-400">
                  VPN for Roland Garros
                </a>
                <a href="/best-vpn-for-wimbledon" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 font-bold hover:border-emerald-400">
                  VPN for Wimbledon
                </a>
                <a href="/how-to-watch-tennis-without-cable" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 font-bold hover:border-emerald-400">
                  Watch tennis without cable
                </a>
              </div>
            </section>

            <div className="mb-12 mt-10">
              <h2 className="text-3xl font-black mb-5">
                🌍 Watch Tennis by Country
              </h2>

              <p className="text-zinc-400 mb-6 max-w-3xl">
                Find official tennis broadcasters, TV channels and streaming
                options by country. Check where to watch ATP, WTA and Grand Slam
                tennis legally.
              </p>

              <div className="flex flex-wrap gap-3">
                {countries.map((country) => (
                  <a
                    key={country}
                    href={`/watch-tennis-in/${country}`}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all"
                  >
                    {readableCountry(country)}
                  </a>
                ))}
              </div>
            </div>

            {livePlayers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-black mb-5">
                  🔴 Live Players Now
                </h2>

                <p className="text-zinc-400 mb-6 max-w-3xl">
                  Players currently competing in live tennis matches.
                  Follow their match pages, schedules and streaming information.
                </p>

                <div className="flex flex-wrap gap-3">
                  {livePlayers.map((player) => {
                    const href = playerUrl(player);
                    if (!href) return null;

                    return (
                      <a
                        key={player}
                        href={href}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-red-500 hover:text-red-400 transition-all"
                      >
                        🔴 {player}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {topLiveMatches.length > 0 && (
              <section className="mb-12">
                <h2 className="text-4xl font-black mb-6">
                  🔴 Top LIVE Tennis Matches
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {topLiveMatches.map((match) => (
                    <a
                      key={match.id}
                      href={`/watch/${matchSlug(match)}`}
                      className="block rounded-[2rem] border border-red-500 bg-zinc-900 p-6 hover:scale-[1.01] transition-all"
                    >
                      <div className="flex items-center justify-between mb-5">
                        <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                          LIVE NOW
                        </span>

                        <span className="text-zinc-400">{match.category}</span>
                      </div>

                      <h3 className="text-3xl font-black leading-tight mb-4">
                        {match.player1}
                        <br />
                        vs
                        <br />
                        {match.player2}
                      </h3>

                      <a
  href={`/tournament/${slugify(match.tournament)}`}
  className="text-zinc-400 hover:text-green-400 transition-colors mb-4 inline-block"
>
  {match.tournament}
</a>

                      <div className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black">
                        Open Match →
                      </div>
                    </a>
                  ))}
                </div>
              </section>
              
            )}

            {upcomingFinals.length > 0 && (
  <section className="mb-12 rounded-[2.5rem] border border-purple-500 bg-gradient-to-br from-purple-950/40 to-black p-8">
    <div className="flex flex-wrap items-center gap-3 mb-5">
      <span className="bg-purple-500 text-white text-sm font-black px-4 py-2 rounded-full">
        🏆 FINALS
      </span>

      <span className="text-zinc-400">
        Upcoming tennis finals with confirmed dates
      </span>
    </div>

    <h2 className="text-4xl font-black mb-6">
      Tennis Finals Coming Up
    </h2>
<div className="mb-8 rounded-3xl border border-purple-500/40 bg-black/40 p-5">
  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
    <div>
      <h3 className="text-xl font-black mb-2">
        🔔 ATP & WTA Finals Alerts
      </h3>

      <p className="text-zinc-400 max-w-2xl">
        Get notified when new ATP or WTA finals are announced,
        including match dates, start times and tournament updates.
      </p>
    </div>

    <form
  onSubmit={subscribeToFinals}
      className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
    >
      <input
  type="email"
  name="email"
  value={finalsEmail}
  onChange={(event) =>
    setFinalsEmail(event.target.value)
  }
        required
        placeholder="Your email"
        className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-3 text-white min-w-[260px]"
      />

      <button
        type="submit"
        className="bg-purple-500 text-white px-6 py-3 rounded-2xl font-black hover:bg-purple-400 transition-all"
      >
        {finalsLoading ? "Submitting..." : "Notify Me"}
      </button>
    </form>
    
  </div>
  {finalsMessage && (
  <p className="text-sm text-zinc-300 mt-3">
    {finalsMessage}
  </p>
)}
</div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {upcomingFinals.map((match) => (
        <a
          key={match.id}
          href={`/watch/${matchSlug(match)}`}
          className="block rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-purple-500 transition-all"
        >
          <div className="flex justify-between mb-3">
            <span className="font-black text-purple-400">
              FINAL
            </span>

            <span className="text-zinc-500">
              {match.category}
            </span>
          </div>

          <h3 className="text-2xl font-black mb-3">
            {match.player1}
            <br />
            vs
            <br />
            {match.player2}
          </h3>

          <p className="text-zinc-400 mb-2">
            {match.tournament}
          </p>
          <p className="text-sm text-zinc-500">
  {match.category} Final
</p>

          <p className="text-zinc-300 font-bold">
            {new Date(match.startTime).toLocaleString()}
          </p>
        </a>
      ))}
    </div>
  </section>
)}
<section className="mb-12">
  <h2 className="text-3xl font-black mb-5">
    ⏳ Starting Soon
  </h2>

  <p className="text-zinc-400 mb-6 max-w-3xl">
    Upcoming ATP, WTA and Challenger matches starting soon.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {homepageMatches
      .filter(
        (match) =>
          match.status !== "LIVE" &&
          match.status !== "FINISHED" &&
          match.status !== "CANCELLED"
      )
     .slice(0, 4)
      .map((match) => (
        <a
          key={match.id}
          href={`/watch/${matchSlug(match)}`}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 hover:border-yellow-500 transition-all"
        >
          <div className="flex justify-between mb-3">
            <span className="font-black text-yellow-400">
              UPCOMING
            </span>

            <span className="text-zinc-500">
              {match.category}
            </span>
          </div>

          <h3 className="text-2xl font-black mb-3">
            {match.player1}
            <br />
            vs
            <br />
            {match.player2}
          </h3>

<p className="text-zinc-400 text-sm mb-3 leading-6">
  Upcoming tennis match with schedule information and tournament details.
</p>
          <p className="text-zinc-400">
            {new Date(match.startTime).toLocaleString()}
          </p>
        </a>
      ))}
  </div>
</section>
            {homepageMatches.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-black mb-5">
                  🔥 Trending Tennis Matches
                </h2>

                <p className="text-zinc-400 mb-6 max-w-3xl">
                  Popular live and upcoming tennis matches with official broadcaster information.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {homepageMatches
                    .filter(
                      (match) =>
                        match.status === "LIVE" ||
                        match.category === "ATP" ||
                        match.category === "WTA"
                    )
                    .slice(0, 6)
                    .map((match) => (
                      <a
                        key={match.id}
                        href={`/watch/${matchSlug(match)}`}
                        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 hover:border-red-500 transition-all"
                      >
                        <div className="flex justify-between mb-3">
                          <span className="font-black text-red-400">
                            {match.status}
                          </span>

                          <span className="text-zinc-500">{match.category}</span>
                        </div>

                        <h3 className="text-2xl font-black mb-3">
                          {match.player1}
                          <br />
                          vs
                          <br />
                          {match.player2}
                        </h3>

                        <p className="text-zinc-400 text-sm mb-3 leading-6">
  Follow match timing, tournament updates and official broadcaster
  availability for this tennis match.
</p>

                        <a
  href={`/tournament/${slugify(match.tournament)}`}
  className="text-zinc-400 hover:text-green-400 transition-colors inline-block"
>
  {match.tournament}
</a>
                      </a>
                    ))}
                </div>

              
              </div>
              
            )}
           
            
      <div className="mb-12">
  <h2 className="text-3xl font-black mb-5">
    ⭐ Trending Tennis Players
  </h2>

  <p className="text-zinc-400 mb-6 max-w-3xl">
    Follow trending ATP and WTA players, live tennis matches,
    schedules and streaming coverage.
  </p>

  <div className="flex flex-wrap gap-3">
    {priorityPlayers.map((player) => {
      const href = playerUrl(player);
      if (!href) return null;

      return (
        <a
          key={player}
          href={href}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-yellow-500 hover:text-yellow-400 transition-all"
        >
          ⭐ {player}
        </a>
      );
    })}
  </div>
</div>

            {seoPlayers.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-black mb-5">
                  ⭐ Popular Tennis Players
                </h2>

                <p className="text-zinc-400 mb-6 max-w-3xl">
                  Follow tennis players, live matches, schedules and tournament updates.
                </p>
                <div className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
  <div className="flex flex-wrap items-center gap-3 mb-3">
    <span className="rounded-full bg-green-500/20 px-3 py-1 text-sm font-bold text-green-400">
      📅 Daily tennis hub
    </span>
  </div>

  <p className="text-zinc-300 leading-7">
    Check back daily for live ATP, WTA, Challenger and Grand Slam tennis
    matches, streaming updates, TV schedules and trending players.
  </p>
</div>

                <div className="flex flex-wrap gap-3">
                  {seoPlayers.map((player) => {
                    const href = playerUrl(player);
                    if (!href) return null;

                    return (
                      <a
                        key={player}
                        href={href}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all"
                      >
                        {player} live matches
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-zinc-400 mt-3 text-lg">
              Live and upcoming tennis matches
            </p>

            <div className="mb-12 mt-10">
              <EmailSignup
                title="Get tennis match alerts without the noise"
                description="A quiet optional signup for useful tennis schedule changes, Grand Slam reminders and official viewing updates. No popup interruption while users browse matches."
                source="homepage-email-signup"
                buttonLabel="Get alerts"
              />
            </div>
          </div>

          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search player or tournament..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 outline-none focus:border-green-500"
          />

          <div className="flex flex-wrap gap-3">
            {["ALL", "LIVE", "ATP", "WTA", "CHALLENGER", "ITF"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-5 py-3 rounded-2xl font-semibold transition-all ${
                  selectedFilter === filter
                    ? "bg-green-500 text-black"
                    : "bg-zinc-900 hover:bg-zinc-800"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 text-xl">Loading matches...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      match.status === "LIVE"
                        ? "bg-red-500 text-white"
                        : "bg-zinc-700 text-zinc-200"
                    }`}
                  >
                    {match.status}
                  </span>

                  <span className="text-sm text-zinc-500">{match.category}</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {displayablePlayers(match.player1).map((player, index, players) => {
                      const href = playerUrl(player);

                      return (
                        <span key={`${match.id}-p1-${player}`} className="text-2xl font-bold">
                          {href ? (
                            <a href={href} className="hover:text-green-400 transition-colors">
                              {player}
                            </a>
                          ) : (
                            <span>{player}</span>
                          )}

                          {index < players.length - 1 && (
                            <span className="text-zinc-500"> /</span>
                          )}
                        </span>
                      );
                    })}
                  </div>

                  <div className="text-zinc-500 font-semibold">VS</div>

                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {displayablePlayers(match.player2).map((player, index, players) => {
                      const href = playerUrl(player);

                      return (
                        <span key={`${match.id}-p2-${player}`} className="text-2xl font-bold">
                          {href ? (
                            <a href={href} className="hover:text-green-400 transition-colors">
                              {player}
                            </a>
                          ) : (
                            <span>{player}</span>
                          )}

                          {index < players.length - 1 && (
                            <span className="text-zinc-500"> /</span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-zinc-500 text-sm">Tournament</p>

                    <a
                      href={`/tournament/${match.tournament
                        .toLowerCase()
                        .replace(/,/g, "")
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-|-$/g, "")}`}
                      className="font-semibold hover:text-green-400 transition-colors"
                    >
                      {match.tournament}
                    </a>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">Score</p>
                    <p className="font-semibold text-lg">{match.score}</p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm">Start Time</p>
                    <p className="font-semibold">
                      {new Date(match.startTime).toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-zinc-500 text-sm mb-3">Where to watch</p>

                

                    {getSafeWatchProviders(match).length > 0 ? (
                      <div className="space-y-3">
                        {getSafeWatchProviders(match).map((provider) => (
                          <a
                            key={provider.name}
                            href={withTracking(provider.url, "homepage_match_card")}
                            target="_blank"
                            rel="nofollow sponsored noopener noreferrer"
                            className="block rounded-2xl bg-green-500 text-black px-4 py-3 font-bold hover:bg-green-400 transition-all"
                          >
                            {provider.name}

                            <span className="block text-xs font-normal mt-1">
                              {provider.accessType} · {provider.verificationStatus}
                            </span>

                            <span className="block text-xs font-normal mt-1 opacity-80">
                              {provider.note}
                            </span>
                          </a>
                        ))}

                        <a
                          href={`/watch/${matchSlug(match)}`}
                          className="block mt-6 bg-white text-black text-center font-black px-5 py-4 rounded-2xl hover:bg-zinc-200 transition-all"
                        >
                          Open Match Page
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-500">
                        No trusted official source found yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}


        <section className="mt-16 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-3xl font-black mb-6">
            Frequently Asked Questions About Watching Tennis Online
          </h2>

          <div className="space-y-6 text-zinc-300 leading-8">
            <div>
              <h3 className="text-xl font-black text-white mb-2">
                Does Watch Tennis Today stream tennis matches directly?
              </h3>
              <p>
                No. Watch Tennis Today does not host, embed or retransmit live
                tennis video. We provide schedules, match pages and links to
                official broadcaster or streaming information.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black text-white mb-2">
                Why do tennis streaming options change by country?
              </h3>
              <p>
                Tennis broadcast rights are usually sold by territory. A Grand
                Slam, ATP event or WTA tournament may be available on different
                TV channels and streaming platforms depending on where a viewer
                is located.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black text-white mb-2">
                How should I confirm where to watch a specific match?
              </h3>
              <p>
                Use this site as a discovery guide, then confirm the final
                schedule on the official broadcaster, tournament website or app.
                Start times, court assignments and rights availability can
                change close to match time.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-black text-white mb-2">
                Are free tennis streams safe?
              </h3>
              <p>
                Many unofficial free stream sites can expose users to intrusive
                ads, misleading buttons, malware risks or copyright problems.
                We recommend using official broadcasters and legitimate
                streaming services whenever possible.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <h2 className="text-3xl font-black mb-5">
            Watch Tennis Today — Live Tennis Matches, Scores and TV Schedule
          </h2>

          <div className="text-zinc-300 space-y-5 leading-8">
            <p>
              Watch Tennis Today helps tennis fans follow live tennis matches,
official broadcasters, TV schedules and tournament coverage in one place.
              The site covers ATP, WTA, Grand Slam, Challenger and ITF matches with
              match status, start times, scores and tournament information.
            </p>

            <p>
              You can use Watch Tennis Today to check which tennis matches are live now,
              where to follow upcoming matches, and which official broadcasters
may provide tennis coverage in your country. Coverage includes popular
              players, major tournaments, live match pages and country-based tennis
              viewing guides.
            </p>

            <p>
              The goal is to make tennis easier to follow by combining live match data,
              tournament schedules, player pages and official watch information for fans
              around the world.
            </p>
          </div>
        </section>
         
      </div>
    
    </main>
  );
}
