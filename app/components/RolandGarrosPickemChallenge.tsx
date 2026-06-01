"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PickemMatch = {
  id?: string;
  tournament?: string;
  round?: string;
  category?: string;
  player1?: string;
  player2?: string;
  status?: string;
  score?: string;
  winner?: string;
  date?: string;
  time?: string;
  court?: string;
};

type StoredPick = {
  matchId: string;
  pickedPlayer: string;
  pickedAt: string;
};

type PickemPayload = {
  matches?: PickemMatch[];
  error?: string;
};

const STORAGE_KEY = "wtt_roland_garros_pickem_v1";

type SeededPlayer = { name: string; seed: number; tour: "ATP" | "WTA" };

const seededPlayers: SeededPlayer[] = [
  // 2026 Roland Garros men’s singles seeds used only to label Pick’em seed edge.
  { name: "Jannik Sinner", seed: 1, tour: "ATP" },
  { name: "Alexander Zverev", seed: 2, tour: "ATP" },
  { name: "Novak Djokovic", seed: 3, tour: "ATP" },
  { name: "Felix Auger-Aliassime", seed: 4, tour: "ATP" },
  { name: "Félix Auger-Aliassime", seed: 4, tour: "ATP" },
  { name: "Ben Shelton", seed: 5, tour: "ATP" },
  { name: "Daniil Medvedev", seed: 6, tour: "ATP" },
  { name: "Taylor Fritz", seed: 7, tour: "ATP" },
  { name: "Alex de Minaur", seed: 8, tour: "ATP" },
  { name: "Alexander Bublik", seed: 9, tour: "ATP" },
  { name: "Flavio Cobolli", seed: 10, tour: "ATP" },
  { name: "Andrey Rublev", seed: 11, tour: "ATP" },
  { name: "Jiri Lehecka", seed: 12, tour: "ATP" },
  { name: "Jiří Lehečka", seed: 12, tour: "ATP" },
  { name: "Karen Khachanov", seed: 13, tour: "ATP" },
  { name: "Luciano Darderi", seed: 14, tour: "ATP" },
  { name: "Casper Ruud", seed: 15, tour: "ATP" },
  { name: "Valentin Vacherot", seed: 16, tour: "ATP" },
  { name: "Arthur Fils", seed: 17, tour: "ATP" },
  { name: "Learner Tien", seed: 18, tour: "ATP" },
  { name: "Frances Tiafoe", seed: 19, tour: "ATP" },
  { name: "Cameron Norrie", seed: 20, tour: "ATP" },
  { name: "Alejandro Davidovich Fokina", seed: 21, tour: "ATP" },
  { name: "Arthur Rinderknech", seed: 22, tour: "ATP" },
  { name: "Tomas Martin Etcheverry", seed: 23, tour: "ATP" },
  { name: "Tomás Martín Etcheverry", seed: 23, tour: "ATP" },
  { name: "Tommy Paul", seed: 24, tour: "ATP" },
  { name: "Francisco Cerundolo", seed: 25, tour: "ATP" },
  { name: "Francisco Cerúndolo", seed: 25, tour: "ATP" },
  { name: "Jakub Mensik", seed: 26, tour: "ATP" },
  { name: "Jakub Menšík", seed: 26, tour: "ATP" },
  { name: "Rafael Jodar", seed: 27, tour: "ATP" },
  { name: "Joao Fonseca", seed: 28, tour: "ATP" },
  { name: "João Fonseca", seed: 28, tour: "ATP" },
  { name: "Tallon Griekspoor", seed: 29, tour: "ATP" },
  { name: "Corentin Moutet", seed: 30, tour: "ATP" },
  { name: "Brandon Nakashima", seed: 31, tour: "ATP" },
  { name: "Ugo Humbert", seed: 32, tour: "ATP" },

  // 2026 Roland Garros women’s singles seeds used only to label Pick’em seed edge.
  { name: "Aryna Sabalenka", seed: 1, tour: "WTA" },
  { name: "Elena Rybakina", seed: 2, tour: "WTA" },
  { name: "Iga Swiatek", seed: 3, tour: "WTA" },
  { name: "Iga Świątek", seed: 3, tour: "WTA" },
  { name: "Coco Gauff", seed: 4, tour: "WTA" },
  { name: "Jessica Pegula", seed: 5, tour: "WTA" },
  { name: "Amanda Anisimova", seed: 6, tour: "WTA" },
  { name: "Elina Svitolina", seed: 7, tour: "WTA" },
  { name: "Mirra Andreeva", seed: 8, tour: "WTA" },
  { name: "Victoria Mboko", seed: 9, tour: "WTA" },
  { name: "Karolina Muchova", seed: 10, tour: "WTA" },
  { name: "Karolína Muchová", seed: 10, tour: "WTA" },
  { name: "Belinda Bencic", seed: 11, tour: "WTA" },
  { name: "Linda Noskova", seed: 12, tour: "WTA" },
  { name: "Linda Nosková", seed: 12, tour: "WTA" },
  { name: "Jasmine Paolini", seed: 13, tour: "WTA" },
  { name: "Ekaterina Alexandrova", seed: 14, tour: "WTA" },
  { name: "Marta Kostyuk", seed: 15, tour: "WTA" },
  { name: "Naomi Osaka", seed: 16, tour: "WTA" },
  { name: "Iva Jovic", seed: 17, tour: "WTA" },
  { name: "Sorana Cirstea", seed: 18, tour: "WTA" },
  { name: "Sorana Cîrstea", seed: 18, tour: "WTA" },
  { name: "Madison Keys", seed: 19, tour: "WTA" },
  { name: "Liudmila Samsonova", seed: 20, tour: "WTA" },
  { name: "Clara Tauson", seed: 21, tour: "WTA" },
  { name: "Anna Kalinskaya", seed: 22, tour: "WTA" },
  { name: "Elise Mertens", seed: 23, tour: "WTA" },
  { name: "Leylah Fernandez", seed: 24, tour: "WTA" },
  { name: "Diana Shnaider", seed: 25, tour: "WTA" },
  { name: "Hailey Baptiste", seed: 26, tour: "WTA" },
  { name: "Marie Bouzkova", seed: 27, tour: "WTA" },
  { name: "Marie Bouzková", seed: 27, tour: "WTA" },
  { name: "Anastasia Potapova", seed: 28, tour: "WTA" },
  { name: "Jelena Ostapenko", seed: 29, tour: "WTA" },
  { name: "Jeļena Ostapenko", seed: 29, tour: "WTA" },
  { name: "Ann Li", seed: 30, tour: "WTA" },
  { name: "Cristina Bucsa", seed: 31, tour: "WTA" },
  { name: "Cristina Bucșa", seed: 31, tour: "WTA" },
  { name: "Wang Xinyu", seed: 32, tour: "WTA" },
];

function normalize(value?: string) {
  return `${value || ""}`.replace(/\s+/g, " ").trim();
}

function isRealPlayer(value?: string) {
  const name = normalize(value).toLowerCase();
  if (!name) return false;
  return !["tbd", "bye", "unknown", "unknown player", "-", "—"].includes(name);
}

function matchId(match: PickemMatch) {
  const fallback = `${match.date || "today"}-${match.time || "time"}-${match.player1 || "p1"}-${match.player2 || "p2"}`;
  return String(match.id || fallback).replace(/\s+/g, "-");
}

function isFinished(match: PickemMatch) {
  const status = normalize(match.status).toLowerCase();
  return status.includes("finished") || status.includes("completed") || status.includes("final") || status.includes("retired") || status.includes("walkover");
}

function isLive(match: PickemMatch) {
  return normalize(match.status).toUpperCase() === "LIVE";
}

function hasWinner(match: PickemMatch) {
  return isFinished(match) && normalize(match.winner).length > 0;
}

function stripAccents(value: string) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function playerKey(value?: string) {
  return stripAccents(normalize(value).toLowerCase())
    .replace(/[^a-z\s.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function nameParts(value?: string) {
  return playerKey(value)
    .replace(/\./g, "")
    .split(" ")
    .filter(Boolean);
}

function firstNameKey(value?: string) {
  return nameParts(value)[0] || "";
}

function lastNameKey(value?: string) {
  const parts = nameParts(value);
  return parts[parts.length - 1] || "";
}

function namesLikelyMatch(seedName?: string, apiName?: string) {
  const seedKey = playerKey(seedName);
  const apiKey = playerKey(apiName);
  if (!seedKey || !apiKey) return false;
  if (seedKey === apiKey || seedKey.includes(apiKey) || apiKey.includes(seedKey)) return true;

  const apiParts = nameParts(apiName);
  const seedParts = nameParts(seedName);
  const seedFirst = firstNameKey(seedName);
  const seedLast = lastNameKey(seedName);
  if (!seedLast || !apiParts.includes(seedLast)) return false;

  const seedInitial = seedFirst[0] || "";
  const apiHasInitial = seedInitial ? apiParts.some((part) => part === seedInitial || part[0] === seedInitial) : true;
  const apiHasFullFirst = seedFirst ? apiParts.includes(seedFirst) : false;

  return apiHasFullFirst || apiHasInitial || apiParts.length === 1 || seedParts.every((part) => apiParts.includes(part));
}

function tourForMatch(match: PickemMatch): "ATP" | "WTA" | null {
  const category = normalize(match.category).toUpperCase();
  if (category.includes("WTA")) return "WTA";
  if (category.includes("ATP")) return "ATP";
  return null;
}

function findSeed(match: PickemMatch, player: string) {
  const tour = tourForMatch(match);
  if (!tour) return null;
  return seededPlayers.find((seeded) => seeded.tour === tour && namesLikelyMatch(seeded.name, player)) || null;
}

function likelyFavorite(match: PickemMatch) {
  const p1 = normalize(match.player1);
  const p2 = normalize(match.player2);
  const p1Seed = findSeed(match, p1);
  const p2Seed = findSeed(match, p2);

  if (p1Seed && p2Seed && p1Seed.seed !== p2Seed.seed) return p1Seed.seed < p2Seed.seed ? p1 : p2;
  if (p1Seed && !p2Seed) return p1;
  if (!p1Seed && p2Seed) return p2;
  return "";
}

function isUpsetPick(match: PickemMatch, pickedPlayer: string) {
  const favorite = likelyFavorite(match);
  return Boolean(favorite) && normalize(pickedPlayer) !== favorite;
}

function pointsLabel(match: PickemMatch, player: string) {
  return isUpsetPick(match, player) ? "Seed upset +3" : "Correct pick +1";
}

function pointsForPick(match: PickemMatch, pickedPlayer: string) {
  if (!hasWinner(match)) return 0;
  if (normalize(match.winner) !== normalize(pickedPlayer)) return 0;
  return isUpsetPick(match, pickedPlayer) ? 3 : 1;
}

function safeJsonParse(value: string | null): StoredPick[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatMatchTime(match: PickemMatch) {
  return [match.date, match.time].filter(Boolean).join(" · ") || "Time TBA";
}

function sortMatches(a: PickemMatch, b: PickemMatch) {
  if (isLive(a) && !isLive(b)) return -1;
  if (!isLive(a) && isLive(b)) return 1;
  if (isFinished(a) && !isFinished(b)) return 1;
  if (!isFinished(a) && isFinished(b)) return -1;

  return `${a.date || ""} ${a.time || ""}`.localeCompare(`${b.date || ""} ${b.time || ""}`);
}

export default function RolandGarrosPickemChallenge({ compact = false }: { compact?: boolean }) {
  const [matches, setMatches] = useState<PickemMatch[]>([]);
  const [picks, setPicks] = useState<StoredPick[]>(() => {
    if (typeof window === "undefined") return [];
    return safeJsonParse(window.localStorage.getItem(STORAGE_KEY));
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMatches() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/french-open-today", { cache: "no-store" });
        const payload: PickemPayload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load Roland Garros matches.");
        }

        const usableMatches = (payload.matches || [])
          .filter((match) => isRealPlayer(match.player1) && isRealPlayer(match.player2))
          .sort(sortMatches);

        if (!ignore) setMatches(usableMatches);
      } catch (loadError) {
        console.error("Roland Garros Pick'em failed:", loadError);
        if (!ignore) setError("Pick’em is temporarily unavailable because today’s Roland Garros feed could not be loaded.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMatches();

    return () => {
      ignore = true;
    };
  }, []);

  const pickMap = useMemo(() => new Map(picks.map((pick) => [pick.matchId, pick])), [picks]);

  const visibleMatches = useMemo(() => matches.slice(0, compact ? 3 : 12), [compact, matches]);

  const score = useMemo(() => {
    return picks.reduce((total, pick) => {
      const match = matches.find((candidate) => matchId(candidate) === pick.matchId);
      if (!match) return total;
      return total + pointsForPick(match, pick.pickedPlayer);
    }, 0);
  }, [matches, picks]);

  const completedPickCount = useMemo(() => {
    return picks.filter((pick) => {
      const match = matches.find((candidate) => matchId(candidate) === pick.matchId);
      return match ? hasWinner(match) : false;
    }).length;
  }, [matches, picks]);

  const pendingPickCount = Math.max(picks.length - completedPickCount, 0);

  const pickedMatches = useMemo(() => {
    return picks
      .map((pick) => {
        const match = matches.find((candidate) => matchId(candidate) === pick.matchId);
        return match ? { match, pick } : null;
      })
      .filter(Boolean) as { match: PickemMatch; pick: StoredPick }[];
  }, [matches, picks]);

  const maxPossibleScore = useMemo(() => {
    return pickedMatches.reduce((total, item) => total + (isUpsetPick(item.match, item.pick.pickedPlayer) ? 3 : 1), 0);
  }, [pickedMatches]);

  function savePick(match: PickemMatch, pickedPlayer: string) {
    const id = matchId(match);
    const nextPicks = [
      ...picks.filter((pick) => pick.matchId !== id),
      { matchId: id, pickedPlayer, pickedAt: new Date().toISOString() },
    ];

    setPicks(nextPicks);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPicks));
  }

  function clearPicks() {
    setPicks([]);
    setShareStatus("");
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function buildShareText() {
    const pickLines = pickedMatches.slice(0, 6).map(({ match, pick }) => {
      const reward = isUpsetPick(match, pick.pickedPlayer) ? "+3 upset" : "+1";
      return `• ${normalize(match.player1)} vs ${normalize(match.player2)} → ${pick.pickedPlayer} (${reward})`;
    });

    const hiddenPickCount = Math.max(pickedMatches.length - pickLines.length, 0);
    const moreLine = hiddenPickCount > 0 ? [`• +${hiddenPickCount} more picks`] : [];

    return [
      `My Roland Garros Pick’em score: ${score}/${maxPossibleScore || picks.length}`,
      `${completedPickCount} settled · ${pendingPickCount} pending`,
      ...pickLines,
      ...moreLine,
      "Play here: https://watchtennistoday.com/roland-garros-predictions",
    ].join("\n");
  }

  async function sharePicks() {
    const text = buildShareText();
    setShareStatus("");

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My Roland Garros Pick’em picks",
          text,
          url: "https://watchtennistoday.com/roland-garros-predictions",
        });
        setShareStatus("Shared");
        return;
      }

      await navigator.clipboard.writeText(text);
      setShareStatus("Copied to clipboard");
    } catch {
      setShareStatus("Copy failed — select and copy your picks manually.");
    }
  }

  if (isLoading) {
    return (
      <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
        Loading today’s Roland Garros Pick’em board…
      </section>
    );
  }

  if (error || visibleMatches.length === 0) {
    return (
      <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
        <p className="mb-2 text-sm font-black uppercase tracking-widest text-orange-300">Roland Garros Pick’em</p>
        <h2 className="mb-3 text-3xl font-black">Make your match picks</h2>
        <p className="leading-7 text-zinc-400">
          {error || "No active Roland Garros matches are available for Pick’em right now. Check back when today’s order of play is listed."}
        </p>
        <Link href="/french-open-today" className="mt-5 inline-flex rounded-2xl border border-orange-500/50 px-5 py-3 text-sm font-black text-orange-200 transition hover:bg-orange-500 hover:text-black">
          See French Open today →
        </Link>
      </section>
    );
  }

  return (
    <section className="mb-10 rounded-[2rem] border border-orange-500/40 bg-gradient-to-br from-zinc-950 via-black to-orange-950/20 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-orange-300">Roland Garros Pick’em Challenge</p>
          <h2 className="text-3xl font-black md:text-5xl">Pick today’s winners</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
            Choose winners before the match finishes. Correct picks score 1 point. Seed upset picks score 3 points when the lower-seeded player beats the seed edge.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-black p-5 text-right">
          <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Your score</p>
          <p className="text-4xl font-black text-orange-400">{score}</p>
          <p className="text-sm text-zinc-500">{completedPickCount} settled · {pendingPickCount} pending</p>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-3xl border border-zinc-800 bg-black p-5">
          <p className="text-sm font-bold text-zinc-500">Picks made</p>
          <p className="mt-2 text-3xl font-black">{picks.length}</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-black p-5">
          <p className="text-sm font-bold text-zinc-500">Matches on board</p>
          <p className="mt-2 text-3xl font-black">{visibleMatches.length}</p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-black p-5">
          <p className="text-sm font-bold text-zinc-500">Max possible</p>
          <p className="mt-2 text-3xl font-black">{maxPossibleScore || "—"}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleMatches.map((match) => {
          const id = matchId(match);
          const selectedPick = pickMap.get(id)?.pickedPlayer || "";
          const players = [normalize(match.player1), normalize(match.player2)];
          const settled = hasWinner(match);

          return (
            <article key={id} className="rounded-3xl border border-zinc-800 bg-black p-5">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-black uppercase tracking-widest text-zinc-400">{match.category || "Tennis"}</span>
                {match.round ? <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-400">{match.round}</span> : null}
                <span className={`rounded-full px-3 py-1 text-xs font-black ${isLive(match) ? "bg-orange-500 text-black" : isFinished(match) ? "bg-zinc-800 text-zinc-300" : "bg-sky-950 text-sky-200"}`}>
                  {isLive(match) ? "Live" : isFinished(match) ? "Finished" : "Upcoming"}
                </span>
              </div>

              <h3 className="mb-2 text-2xl font-black leading-tight">
                {players[0]} <span className="text-zinc-500">vs</span> {players[1]}
              </h3>
              <p className="mb-4 text-sm text-zinc-500">{formatMatchTime(match)}{match.court ? ` · ${match.court}` : ""}</p>

              <div className="grid gap-3">
                {players.map((player) => {
                  const selected = selectedPick === player;
                  const playerWon = settled && normalize(match.winner) === player;
                  const playerLost = settled && selected && normalize(match.winner) !== player;

                  return (
                    <button
                      key={player}
                      type="button"
                      disabled={settled}
                      onClick={() => savePick(match, player)}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${selected ? "border-orange-500 bg-orange-500 text-black" : "border-zinc-800 bg-zinc-950 text-white hover:border-orange-500"} ${settled ? "cursor-default opacity-90" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-black">{player}</span>
                        {findSeed(match, player) ? <span className="text-sm font-black text-zinc-400">Seed #{findSeed(match, player)?.seed}</span> : <span className="text-sm font-black text-zinc-500">Unseeded</span>}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs font-black uppercase tracking-widest">
                        <span>{pointsLabel(match, player)}</span>
                        {playerWon ? <span>Correct</span> : null}
                        {playerLost ? <span>Missed</span> : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              {settled ? (
                <p className="mt-4 text-sm font-bold text-zinc-400">
                  Winner: <span className="text-orange-300">{match.winner}</span>{match.score ? ` · ${match.score}` : ""}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {compact ? (
          <Link href="/roland-garros-predictions" className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-400">
            Open full Pick’em board →
          </Link>
        ) : null}
        <Link href="/french-open-today" className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-black transition hover:border-orange-500 hover:text-orange-200">
          See match schedule →
        </Link>
        {picks.length > 0 ? (
          <button type="button" onClick={sharePicks} className="rounded-2xl border border-orange-500/60 px-5 py-3 text-sm font-black text-orange-200 transition hover:bg-orange-500 hover:text-black">
            Share my picks
          </button>
        ) : null}
        {picks.length > 0 ? (
          <button type="button" onClick={clearPicks} className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-black text-zinc-400 transition hover:border-red-500 hover:text-red-200">
            Reset my picks
          </button>
        ) : null}
        {shareStatus ? <p className="flex items-center text-sm font-bold text-zinc-400">{shareStatus}</p> : null}
      </div>
    </section>
  );
}
