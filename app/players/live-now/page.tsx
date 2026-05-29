"use client";

import React, { useEffect, useState } from "react";
import { looksLikeUnverifiedDoublesSlug, safeWatchPlayerLiveUrl, safePlayerUrl, verifiedPlayerNameForLink } from "@/data/playerSlugs";

type Match = {
  id?: string;
  player1?: string;
  player2?: string;
  status?: string;
  tournament?: string;
};

type LivePlayer = {
  displayName: string;
  href: string | null;
};

const NON_PLAYER_WORDS = new Set([
  "",
  "a",
  "e",
  "vs",
  "v",
  "live",
  "added",
  "unknown",
  "unknown player",
  "tbd",
  "bye",
  "retired",
  "walkover",
  "withdrawn",
  "suspended",
  "cancelled",
  "canceled",
]);

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => {
      if (/^[A-Z]\.$/.test(part)) return part;
      if (/^[A-Z]\.\s*$/i.test(part)) return part.toUpperCase();

      return part
        .split("-")
        .map((piece) => piece.charAt(0).toUpperCase() + piece.slice(1).toLowerCase())
        .join("-");
    })
    .join(" ");
}

function normalizeApiPlayerName(name?: string) {
  const raw = String(name || "")
    .replace(/\s+/g, " ")
    .trim();

  if (!raw) return null;

  // Do not push doubles teams into the singles-player page pipeline.
  if (/\s*[/&+]\s*/.test(raw)) return null;

  const lower = raw.toLowerCase();
  if (NON_PLAYER_WORDS.has(lower)) return null;

  // API-Tennis sometimes returns names as "Surname, A.". Keep it as one
  // player instead of splitting it into "Surname" and "A".
  const commaName = raw.match(/^([^,]{2,}),\s*([A-Z](?:\.\s*[A-Z])?\.?)$/i);
  if (commaName) {
    const surname = commaName[1].trim();
    const initials = commaName[2]
      .replace(/\s+/g, " ")
      .replace(/([A-Z])(?=\s|$)/gi, "$1.")
      .toUpperCase();
    return `${initials} ${toTitleCase(surname)}`.replace(/\s+/g, " ").trim();
  }

  const cleaned = raw
    .replace(/\([^)]*\)/g, " ")
    .replace(/\b(?:ATP|WTA|ITF|Challenger)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;
  if (NON_PLAYER_WORDS.has(cleaned.toLowerCase())) return null;
  if (looksLikeUnverifiedDoublesSlug(cleaned)) return null;
  if (!/[a-z]/i.test(cleaned)) return null;
  if (/^[a-z]\.?$/i.test(cleaned)) return null;
  if (/^[a-z]{2,4}$/i.test(cleaned) && !safePlayerUrl(cleaned)) return null;

  const tokens = cleaned.split(/\s+/).filter(Boolean);

  // One-word unknown surnames created most of the garbage seen in production
  // logs. Keep canonical one-word players, but do not list arbitrary fragments
  // such as "a", "ako", "ano", "asile" as live players.
  if (tokens.length < 2 && !safePlayerUrl(cleaned)) return null;

  return verifiedPlayerNameForLink(cleaned);
}

function playerHref(displayName: string) {
  return safeWatchPlayerLiveUrl(displayName) || safePlayerUrl(displayName);
}

export default function LiveNowPlayersPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await fetch("/api/matches");
        if (!res.ok) {
          setMatches([]);
          return;
        }
        const data = await res.json();
        const list: Match[] = Array.isArray(data)
          ? data
          : Array.isArray(data.matches)
          ? data.matches
          : [];
        if (mounted) setMatches(list);
      } catch {
        if (mounted) setMatches([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const liveMatches = matches.filter(
    (m) => (m.status || "").toUpperCase() === "LIVE"
  );

  const livePlayers: LivePlayer[] = Array.from(
    new Map(
      liveMatches
        .flatMap((match) => [match.player1, match.player2])
        .map(normalizeApiPlayerName)
        .filter((name): name is string => Boolean(name))
        .map((displayName) => [
          displayName.toLowerCase(),
          { displayName, href: playerHref(displayName) },
        ])
    ).values()
  ).sort((a, b) => a.displayName.localeCompare(b.displayName));

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <section className="mt-8 mb-10">
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            🔴 Live Tennis Players Now
          </h1>

          <p className="text-zinc-400 text-lg leading-8 max-w-3xl mb-6">
            Players currently competing in live ATP, WTA, Challenger and Grand
            Slam tennis matches.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold text-red-400">
              🔴 Live updates
            </div>

            <p className="text-zinc-500 text-sm">
              Last updated:{" "}
              {new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </section>

        {loading ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-zinc-300">
            Loading...
          </div>
        ) : livePlayers.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-zinc-300">
            No verified singles players are currently live. Check back for
            updates or visit the live matches page.
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {livePlayers.map((player) => {
              const content = (
                <>
                  <h3 className="text-lg font-black">{player.displayName}</h3>
                  <p className="text-sm text-zinc-400 mt-2">
                    See live scores, schedule and streaming options.
                  </p>
                </>
              );

              if (player.href) {
                return (
                  <a
                    key={player.displayName}
                    href={player.href}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-green-500 transition-all"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <div
                  key={player.displayName}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  {content}
                </div>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
