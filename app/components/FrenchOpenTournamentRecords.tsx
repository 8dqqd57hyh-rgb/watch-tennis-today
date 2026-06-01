"use client";

import { useEffect, useMemo, useState } from "react";

type ApiSetScore = {
  score_first?: string;
  score_second?: string;
  score_set?: string;
};

type ResultMatch = {
  id?: string;
  tournament?: string;
  round?: string;
  category?: string;
  player1?: string;
  player2?: string;
  status?: string;
  score?: string;
  setScore?: string;
  winner?: string;
  date?: string;
  time?: string;
  scores?: ApiSetScore[];
};

type Upset = {
  id?: string;
  winner?: string;
  loser?: string;
  loserSeed?: number;
  winnerSeed?: number | null;
  round?: string;
  score?: string;
  href?: string;
  severity?: string;
};

type ResultsResponse = {
  success?: boolean;
  results?: ResultMatch[];
};

type UpsetResponse = {
  success?: boolean;
  upsets?: Upset[];
};

type RecordCard = {
  label: string;
  title: string;
  value: string;
  detail: string;
  href: string;
  badge: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchSlug(match: ResultMatch) {
  const readablePart = slugify(`${match.player1 || "player"}-vs-${match.player2 || "player"}`);
  const numericId = String(match.id || "").split(":").pop() || "match";
  return `${readablePart}-${numericId}`;
}

function matchHref(match: ResultMatch) {
  return `/watch/${matchSlug(match)}`;
}

function matchTitle(match: ResultMatch) {
  return `${match.player1 || "TBD"} vs ${match.player2 || "TBD"}`;
}

function normalizeScoreText(match: ResultMatch) {
  return match.setScore || match.score || "";
}

function parseSets(match: ResultMatch) {
  if (match.scores?.length) {
    return match.scores
      .map((set) => [Number(set.score_first), Number(set.score_second)] as const)
      .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && (a > 0 || b > 0));
  }

  const text = normalizeScoreText(match);
  const sets = [...text.matchAll(/(\d{1,2})\s*[-:]\s*(\d{1,2})(?:\s*\([^)]*\))?/g)]
    .map((set) => [Number(set[1]), Number(set[2])] as const)
    .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && (a > 0 || b > 0));

  // API-Tennis sometimes exposes final result as only "2 - 0" or "0:2".
  // That is useful for winner detection but not a set-by-set record.
  if (sets.length === 1 && sets[0][0] <= 3 && sets[0][1] <= 3) return [];

  return sets;
}

function totalGames(match: ResultMatch) {
  return parseSets(match).reduce((sum, [a, b]) => sum + a + b, 0);
}

function gamesConcededByWinner(match: ResultMatch) {
  const sets = parseSets(match);
  if (!sets.length || !match.winner) return Number.MAX_SAFE_INTEGER;

  const winnerIsPlayer1 = `${match.winner}`.toLowerCase().includes(`${match.player1 || ""}`.toLowerCase()) ||
    `${match.player1 || ""}`.toLowerCase().includes(`${match.winner}`.toLowerCase());
  const winnerIsPlayer2 = `${match.winner}`.toLowerCase().includes(`${match.player2 || ""}`.toLowerCase()) ||
    `${match.player2 || ""}`.toLowerCase().includes(`${match.winner}`.toLowerCase());

  if (!winnerIsPlayer1 && !winnerIsPlayer2) return Number.MAX_SAFE_INTEGER;

  return sets.reduce((sum, [a, b]) => sum + (winnerIsPlayer1 ? b : a), 0);
}

function isMainSingles(match: ResultMatch) {
  const text = `${match.tournament || ""} ${match.category || ""} ${match.round || ""}`.toLowerCase();
  if (text.includes("doubles") || text.includes("mixed") || text.includes("junior") || text.includes("boys") || text.includes("girls")) return false;
  return true;
}

function isStraightSets(match: ResultMatch) {
  const sets = parseSets(match);
  if (sets.length < 2) return false;

  let p1 = 0;
  let p2 = 0;
  for (const [a, b] of sets) {
    if (a > b) p1 += 1;
    if (b > a) p2 += 1;
  }

  return p1 === 0 || p2 === 0;
}

function sortDateDesc(a: ResultMatch, b: ResultMatch) {
  return `${b.date || ""} ${b.time || ""}`.localeCompare(`${a.date || ""} ${a.time || ""}`);
}

function buildRecordCards(results: ResultMatch[], upsets: Upset[]): RecordCard[] {
  const completed = results.filter(isMainSingles).filter((match) => match.player1 && match.player2);
  const records: RecordCard[] = [];

  const biggestUpset = upsets.find((upset) => upset.winner && upset.loser);
  if (biggestUpset) {
    records.push({
      label: "Biggest seeded shock",
      title: `${biggestUpset.winner} def. ${biggestUpset.loser}`,
      value: biggestUpset.loserSeed ? `#${biggestUpset.loserSeed} seed out` : "Seeded exit",
      detail: [biggestUpset.round, biggestUpset.score].filter(Boolean).join(" · ") || "Verified from the Roland Garros upset tracker.",
      href: biggestUpset.href || "/french-open-upsets",
      badge: "UPSET",
    });
  }

  const matchesWithSetScores = completed.filter((match) => parseSets(match).length >= 2);

  const mostSets = [...matchesWithSetScores].sort((a, b) => {
    const setDiff = parseSets(b).length - parseSets(a).length;
    if (setDiff !== 0) return setDiff;
    return totalGames(b) - totalGames(a);
  })[0];

  if (mostSets) {
    const setCount = parseSets(mostSets).length;
    records.push({
      label: "Longest scoreline",
      title: matchTitle(mostSets),
      value: `${setCount} sets · ${totalGames(mostSets)} games`,
      detail: [mostSets.winner ? `${mostSets.winner} won` : "Completed match", normalizeScoreText(mostSets), mostSets.round].filter(Boolean).join(" · "),
      href: matchHref(mostSets),
      badge: "GRIND",
    });
  }

  const cleanestWin = [...matchesWithSetScores]
    .filter(isStraightSets)
    .sort((a, b) => gamesConcededByWinner(a) - gamesConcededByWinner(b))[0];

  if (cleanestWin && gamesConcededByWinner(cleanestWin) !== Number.MAX_SAFE_INTEGER) {
    records.push({
      label: "Cleanest straight-set win",
      title: cleanestWin.winner || matchTitle(cleanestWin),
      value: `${gamesConcededByWinner(cleanestWin)} games conceded`,
      detail: [matchTitle(cleanestWin), normalizeScoreText(cleanestWin), cleanestWin.round].filter(Boolean).join(" · "),
      href: matchHref(cleanestWin),
      badge: "FAST",
    });
  }

  const decidingSetMatch = [...matchesWithSetScores]
    .filter((match) => parseSets(match).length >= 3)
    .sort((a, b) => totalGames(b) - totalGames(a))[0];

  if (decidingSetMatch) {
    records.push({
      label: "Best deciding-set candidate",
      title: matchTitle(decidingSetMatch),
      value: `${parseSets(decidingSetMatch).length} sets`,
      detail: [decidingSetMatch.winner ? `${decidingSetMatch.winner} survived` : "Went the distance", normalizeScoreText(decidingSetMatch)].filter(Boolean).join(" · "),
      href: matchHref(decidingSetMatch),
      badge: "DRAMA",
    });
  }

  const latestResult = [...completed].sort(sortDateDesc)[0];
  if (latestResult) {
    records.push({
      label: "Latest completed result",
      title: matchTitle(latestResult),
      value: latestResult.winner ? `${latestResult.winner} advanced` : "Finished",
      detail: [normalizeScoreText(latestResult), latestResult.round, [latestResult.date, latestResult.time].filter(Boolean).join(" · ")].filter(Boolean).join(" · "),
      href: matchHref(latestResult),
      badge: "NEW",
    });
  }

  const unique = new Map<string, RecordCard>();
  for (const record of records) {
    const key = `${record.label}-${record.title}`;
    if (!unique.has(key)) unique.set(key, record);
  }

  return [...unique.values()].slice(0, 5);
}

export default function FrenchOpenTournamentRecords({ compact = false }: { compact?: boolean }) {
  const [results, setResults] = useState<ResultsResponse | null>(null);
  const [upsets, setUpsets] = useState<UpsetResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadRecords() {
      try {
        setIsLoading(true);
        const [resultsResponse, upsetsResponse] = await Promise.allSettled([
          fetch("/api/french-open-results", { cache: "no-store" }).then((response) => response.json()),
          fetch("/api/french-open-upsets", { cache: "no-store" }).then((response) => response.json()),
        ]);

        if (ignore) return;
        setResults(resultsResponse.status === "fulfilled" ? resultsResponse.value : null);
        setUpsets(upsetsResponse.status === "fulfilled" ? upsetsResponse.value : null);
      } catch (error) {
        console.error("French Open tournament records failed:", error);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadRecords();

    return () => {
      ignore = true;
    };
  }, []);

  const records = useMemo(
    () => buildRecordCards(results?.results || [], upsets?.upsets || []),
    [results, upsets]
  );

  if (isLoading) {
    return (
      <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
        <p className="text-sm font-bold text-zinc-400">Loading Roland Garros records…</p>
      </section>
    );
  }

  if (!records.length) return null;

  return (
    <section className="mb-10 rounded-[2.5rem] border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-black to-zinc-950 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-amber-300">
            Tournament records
          </p>
          <h2 className="text-3xl font-black md:text-5xl">
            French Open records from the live feed
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 md:text-base">
            A compact board of real Roland Garros signals: seeded shocks, longest scorelines, clean wins and the newest completed result. Hidden when the feed does not have enough completed-match data.
          </p>
        </div>

        <a
          href="/french-open-results"
          className="w-fit rounded-full border border-amber-400/60 px-5 py-3 text-sm font-black text-amber-200 transition hover:border-amber-300 hover:bg-amber-400 hover:text-black"
        >
          See all results →
        </a>
      </div>

      <div className={`grid gap-4 ${compact ? "md:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-5"}`}>
        {records.slice(0, compact ? 4 : 5).map((record) => (
          <a
            key={`${record.label}-${record.title}`}
            href={record.href}
            className="rounded-3xl border border-zinc-800 bg-black/55 p-5 transition hover:border-amber-400 hover:bg-zinc-950"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
                {record.label}
              </span>
              <span className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black text-black">
                {record.badge}
              </span>
            </div>

            <h3 className="mb-3 text-xl font-black leading-tight text-white">
              {record.title}
            </h3>
            <p className="mb-3 text-2xl font-black text-amber-300">
              {record.value}
            </p>
            <p className="text-sm leading-6 text-zinc-400">
              {record.detail}
            </p>
          </a>
        ))}
      </div>

      <p className="mt-5 text-xs leading-5 text-zinc-500">
        Note: duration, aces and winner totals are not shown unless the source feed exposes reliable values.
      </p>
    </section>
  );
}
