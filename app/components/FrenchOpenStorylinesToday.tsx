"use client";

import { useEffect, useMemo, useState } from "react";

type MatchStatus = "LIVE" | "Scheduled" | "Finished" | string;

type FrenchOpenMatch = {
  id?: string;
  tournament?: string;
  round?: string;
  category?: string;
  player1?: string;
  player2?: string;
  status?: MatchStatus;
  rawStatus?: string;
  score?: string;
  winner?: string;
  date?: string;
  time?: string;
  court?: string;
};

type TodayResponse = {
  success?: boolean;
  matches?: FrenchOpenMatch[];
};

type Upset = {
  id?: string;
  winner?: string;
  loser?: string;
  loserSeed?: number;
  winnerSeed?: number | null;
  round?: string;
  score?: string;
  severity?: "major" | "notable" | "minor" | string;
};

type UpsetResponse = {
  success?: boolean;
  upsets?: Upset[];
  liveUpsetCount?: number;
  verifiedUpsetCount?: number;
};

type DrawResponse = {
  success?: boolean;
  activeCount?: number;
  activePlayers?: Array<{
    player: string;
    tour?: "ATP" | "WTA";
    nextMatchStatus?: "LIVE" | "Scheduled";
    nextOpponent?: string;
  }>;
};

type Storyline = {
  label: string;
  title: string;
  text: string;
  href: string;
  badge?: string;
};

const STAR_NAMES = [
  "Alcaraz",
  "Sinner",
  "Djokovic",
  "Zverev",
  "Swiatek",
  "Sabalenka",
  "Gauff",
  "Osaka",
  "Rybakina",
  "Pegula",
];

function matchTitle(match?: FrenchOpenMatch) {
  if (!match) return "Match details updating";
  return `${match.player1 || "TBD"} vs ${match.player2 || "TBD"}`;
}

function matchHref(match?: FrenchOpenMatch) {
  if (!match?.id) return "/french-open-today";
  return `/watch/${match.id}`;
}

function matchTime(match?: FrenchOpenMatch) {
  if (!match) return Number.MAX_SAFE_INTEGER;
  const parsed = new Date(`${match.date || "9999-12-31"}T${match.time || "23:59"}:00`).getTime();
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

function hasStarPower(match: FrenchOpenMatch) {
  const title = matchTitle(match).toLowerCase();
  return STAR_NAMES.some((name) => title.includes(name.toLowerCase()));
}

function cleanRound(round?: string) {
  return round?.replace(/^WTA\s+|^ATP\s+/i, "").trim() || "French Open";
}

export default function FrenchOpenStorylinesToday({ compact = false }: { compact?: boolean }) {
  const [today, setToday] = useState<TodayResponse | null>(null);
  const [upsets, setUpsets] = useState<UpsetResponse | null>(null);
  const [draw, setDraw] = useState<DrawResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadStorylines() {
      try {
        setIsLoading(true);
        const [todayResponse, upsetResponse, drawResponse] = await Promise.allSettled([
          fetch("/api/french-open-today", { cache: "no-store" }).then((response) => response.json()),
          fetch("/api/french-open-results", { cache: "no-store" }).then((response) => response.json()),
          fetch("/api/french-open-schedule-tracker", { cache: "no-store" }).then((response) => response.json()),
        ]);

        if (ignore) return;

        setToday(todayResponse.status === "fulfilled" ? todayResponse.value : null);
        setUpsets(upsetResponse.status === "fulfilled" ? upsetResponse.value : null);
        setDraw(drawResponse.status === "fulfilled" ? drawResponse.value : null);
      } catch (error) {
        console.error("French Open storylines failed:", error);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadStorylines();

    return () => {
      ignore = true;
    };
  }, []);

  const storylines = useMemo(() => {
    const matches = today?.matches || [];
    const liveMatches = matches.filter((match) => match.status === "LIVE");
    const upcomingMatches = matches.filter((match) => match.status === "Scheduled").sort((a, b) => matchTime(a) - matchTime(b));
    const finishedMatches = matches.filter((match) => match.status === "Finished");
    const activePlayers = draw?.activePlayers || [];
    const biggestUpset = (upsets?.upsets || [])[0];
    const cards: Storyline[] = [];

    const liveFeature = liveMatches.find(hasStarPower) || liveMatches[0];
    if (liveFeature) {
      cards.push({
        label: "Live now",
        title: matchTitle(liveFeature),
        text: `${cleanRound(liveFeature.round || liveFeature.category)}${liveFeature.score ? ` · ${liveFeature.score}` : ""}`,
        href: matchHref(liveFeature),
        badge: "LIVE",
      });
    }

    const nextFeature = upcomingMatches.find(hasStarPower) || upcomingMatches[0];
    if (nextFeature) {
      cards.push({
        label: liveFeature ? "Next big match" : "Match to watch",
        title: matchTitle(nextFeature),
        text: [cleanRound(nextFeature.round || nextFeature.category), nextFeature.time, nextFeature.court].filter(Boolean).join(" · "),
        href: matchHref(nextFeature),
        badge: nextFeature.time || "NEXT",
      });
    }

    if (biggestUpset?.winner && biggestUpset?.loser) {
      cards.push({
        label: "Biggest shock",
        title: `${biggestUpset.winner} def. ${biggestUpset.loser}`,
        text: [biggestUpset.loserSeed ? `Seed #${biggestUpset.loserSeed} eliminated` : "Seeded exit", biggestUpset.round, biggestUpset.score].filter(Boolean).join(" · "),
        href: "/french-open-results",
        badge: biggestUpset.severity === "major" ? "MAJOR" : "UPSET",
      });
    }

    if (draw?.activeCount || activePlayers.length) {
      const liveSurvivors = activePlayers.filter((player) => player.nextMatchStatus === "LIVE").length;
      const scheduledSurvivors = activePlayers.filter((player) => player.nextMatchStatus === "Scheduled").length;
      cards.push({
        label: "Draw pulse",
        title: `${draw?.activeCount ?? activePlayers.length} players still active`,
        text: `${liveSurvivors} live · ${scheduledSurvivors} scheduled from the current Roland Garros feed`,
        href: "/french-open-results",
        badge: "DRAW",
      });
    }

    if (finishedMatches.length) {
      const latestResult = [...finishedMatches].sort((a, b) => matchTime(b) - matchTime(a))[0];
      cards.push({
        label: "Latest result",
        title: matchTitle(latestResult),
        text: [latestResult.winner ? `${latestResult.winner} advanced` : "Completed match", latestResult.score, cleanRound(latestResult.round || latestResult.category)].filter(Boolean).join(" · "),
        href: matchHref(latestResult),
        badge: "RESULT",
      });
    }

    return cards.slice(0, compact ? 4 : 6);
  }, [compact, draw, today, upsets]);

  if (isLoading) {
    return (
      <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm font-bold text-zinc-400">Loading Roland Garros storylines…</p>
      </section>
    );
  }

  if (!storylines.length) return null;

  return (
    <section className="mb-10 rounded-[2.5rem] border border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/35 via-black to-zinc-950 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-[0.24em] text-fuchsia-300">Storylines today</p>
          <h2 className={compact ? "text-3xl font-black md:text-4xl" : "text-4xl font-black md:text-6xl"}>
            What matters at Roland Garros right now
          </h2>
          <p className="mt-4 max-w-3xl leading-8 text-zinc-300">
            A fast editorial layer built from live matches, seeded exits, draw movement and completed results — useful for fans who missed the day.
          </p>
        </div>
        <a href="/roland-garros-recap" className="inline-flex rounded-2xl border border-fuchsia-500/50 px-5 py-3 font-black text-fuchsia-100 transition hover:border-fuchsia-300 hover:text-white">
          Full daily recap →
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {storylines.map((item) => (
          <a key={`${item.label}-${item.title}`} href={item.href} className="group rounded-3xl border border-zinc-800 bg-black/65 p-5 transition hover:border-fuchsia-300 hover:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-500">{item.label}</span>
              {item.badge ? <span className="rounded-full bg-fuchsia-400/15 px-3 py-1 text-xs font-black text-fuchsia-200">{item.badge}</span> : null}
            </div>
            <h3 className="text-xl font-black leading-tight group-hover:text-fuchsia-100">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{item.text}</p>
          </a>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-zinc-500">
        <span>Sources: today’s match feed</span>
        <span>·</span>
        <span>upset tracker</span>
        <span>·</span>
        <span>survivor board</span>
      </div>
    </section>
  );
}
