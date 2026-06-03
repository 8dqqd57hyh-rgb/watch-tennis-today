"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PulseMatch = {
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

type PulseItem = {
  player: string;
  label: string;
  detail: string;
  href: string;
  weight: number;
};

type Props = {
  compact?: boolean;
};

const priorityPlayers = [
  "Jannik Sinner",
  "Carlos Alcaraz",
  "Novak Djokovic",
  "Alexander Zverev",
  "Aryna Sabalenka",
  "Iga Swiatek",
  "Coco Gauff",
  "Naomi Osaka",
  "Elena Rybakina",
  "Mirra Andreeva",
];

function normalize(value?: string) {
  return `${value || ""}`.replace(/\s+/g, " ").trim();
}

function isRealPlayer(value?: string) {
  const name = normalize(value).toLowerCase();
  return Boolean(name) && !["tbd", "bye", "unknown", "unknown player", "-", "—"].includes(name);
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
  return `/player/${slugify(name)}`;
}

function isFrenchOpenMatch(match: PulseMatch) {
  const text = `${match.tournament || ""}`.toLowerCase();
  return text.includes("french open") || text.includes("roland garros") || text.includes("roland-garros") || text.includes("garros");
}

function isLive(match: PulseMatch) {
  return normalize(match.status).toUpperCase() === "LIVE";
}

function isFinished(match: PulseMatch) {
  const status = normalize(match.status).toLowerCase();
  return status.includes("finished") || status.includes("completed") || status.includes("ended") || status.includes("final") || status.includes("retired") || status.includes("walkover");
}

function opponentFor(match: PulseMatch, player: string) {
  return normalize(match.player1) === player ? normalize(match.player2) : normalize(match.player1);
}


function playerPriority(name: string) {
  const exactIndex = priorityPlayers.findIndex((player) => player.toLowerCase() === name.toLowerCase());
  if (exactIndex >= 0) return 40 - exactIndex * 2;

  const lastName = name.toLowerCase().split(" ").pop() || "";
  return priorityPlayers.some((player) => player.toLowerCase().includes(lastName)) ? 18 : 0;
}

function addOrUpgrade(items: Map<string, PulseItem>, item: PulseItem) {
  const key = item.player.toLowerCase();
  const existing = items.get(key);

  if (!existing || item.weight > existing.weight) {
    items.set(key, item);
  }
}

function buildPulse(matches: PulseMatch[]) {
  const items = new Map<string, PulseItem>();
  const cleanMatches = matches.filter(
    (match) => isFrenchOpenMatch(match) && isRealPlayer(match.player1) && isRealPlayer(match.player2)
  );

  cleanMatches.forEach((match) => {
    const p1 = normalize(match.player1);
    const p2 = normalize(match.player2);
    const round = normalize(match.round) || "Roland Garros";
    const court = normalize(match.court);
    const score = normalize(match.score);

    if (isLive(match)) {
      [p1, p2].forEach((player) => {
        addOrUpgrade(items, {
          player,
          label: "Live now",
          detail: `${opponentFor(match, player)}${score ? ` · ${score}` : ""}`,
          href: playerUrl(player),
          weight: 100 + playerPriority(player),
        });
      });
      return;
    }

    if (isFinished(match) && isRealPlayer(match.winner)) {
      const winner = normalize(match.winner);
      addOrUpgrade(items, {
        player: winner,
        label: "Advanced today",
        detail: `Beat ${opponentFor(match, winner)}${score ? ` · ${score}` : ""}`,
        href: playerUrl(winner),
        weight: 70 + playerPriority(winner),
      });
      return;
    }

    [p1, p2].forEach((player) => {
      addOrUpgrade(items, {
        player,
        label: "Coming up",
        detail: `${round}${court ? ` · ${court}` : ""}`,
        href: playerUrl(player),
        weight: 40 + playerPriority(player),
      });
    });
  });

  return [...items.values()].sort((a, b) => b.weight - a.weight).slice(0, 6);
}

export default function RolandGarrosTournamentPulse({ compact = false }: Props) {
  const [matches, setMatches] = useState<PulseMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 4500);

    async function loadPulse() {
      try {
        const response = await fetch("/api/french-open-today", { signal: controller.signal });
        if (!response.ok) return;

        const data = await response.json();
        setMatches(Array.isArray(data) ? data : data?.matches || []);
      } catch {
        setMatches([]);
      } finally {
        window.clearTimeout(timeoutId);
        setLoading(false);
      }
    }

    loadPulse();

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  const pulse = useMemo(() => buildPulse(matches), [matches]);

  return (
    <section className={`${compact ? "mb-10" : "mb-12"} rounded-[2rem] border border-orange-500/30 bg-gradient-to-br from-zinc-950 via-black to-orange-950/20 p-6 md:p-8`}>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 inline-flex rounded-full bg-orange-500 px-4 py-2 text-xs font-black uppercase tracking-widest text-black">
            Tournament Pulse
          </p>
          <h2 className={`${compact ? "text-3xl" : "text-4xl"} font-black`}>Roland Garros pulse today</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
            A quick daily snapshot of the players worth following right now: live matches, winners and upcoming storylines.
          </p>
        </div>

        <Link
          href="/french-open"
          className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-black transition hover:border-orange-500 hover:text-orange-300"
        >
          Open pulse →
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-black/50 p-5 text-zinc-400">Loading today’s pulse…</div>
      ) : pulse.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pulse.map((item) => (
            <Link
              key={`${item.label}-${item.player}`}
              href={item.href}
              className="rounded-3xl border border-zinc-800 bg-black/60 p-5 transition hover:border-orange-500 hover:bg-zinc-950"
            >
              <p className="mb-3 text-xs font-black uppercase tracking-widest text-orange-400">{item.label}</p>
              <h3 className="mb-3 text-2xl font-black">{item.player}</h3>
              <p className="text-sm leading-6 text-zinc-400">{item.detail}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-black/50 p-5 text-zinc-400">
          No Roland Garros pulse items are available yet. Check back when today’s matches are listed.
        </div>
      )}
    </section>
  );
}
