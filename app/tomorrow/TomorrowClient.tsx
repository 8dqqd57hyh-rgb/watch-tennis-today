"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import EmailSignup from "@/app/components/EmailSignup";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score?: string;
  startTime?: string | null;
  round?: string;
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

function matchSlug(match: Match) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = String(match.id).split(":").pop();

  return `${readablePart}-${numericId}`;
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTomorrowKey() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return getLocalDateKey(tomorrow);
}

function matchDateKey(match: Match) {
  if (!match.startTime) return "";

  const date = new Date(match.startTime);
  if (Number.isNaN(date.getTime())) return "";

  return getLocalDateKey(date);
}

function formatDateLabel() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tomorrow.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTime(value?: string | null) {
  if (!value) return "Time TBC";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time TBC";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function isUsefulMatch(match: Match) {
  const playerText = `${match.player1} ${match.player2}`.toLowerCase();
  const blocked = ["unknown player", "unknown", "bye", "tbd"];

  return !blocked.some((value) => playerText.includes(value));
}

export default function TomorrowClient() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const response = await fetch("/api/matches");

        if (!response.ok) {
          setMatches([]);
          return;
        }

        const data = await response.json();
        const safeMatches = Array.isArray(data)
          ? data
          : Array.isArray(data.matches)
            ? data.matches
            : [];

        setMatches(safeMatches);
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  const tomorrowMatches = useMemo(() => {
    const tomorrowKey = getTomorrowKey();

    return matches
      .filter((match) => matchDateKey(match) === tomorrowKey)
      .filter(isUsefulMatch)
      .filter(
        (match) =>
          match.status !== "FINISHED" &&
          match.status !== "CANCELLED" &&
          match.status !== "RETIRED" &&
          match.status !== "EXPIRED"
      )
      .sort((a, b) => {
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;

        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });
  }, [matches]);

  const featuredMatch = tomorrowMatches.find((match) =>
    ["ATP", "WTA"].includes((match.category || "").toUpperCase())
  ) || tomorrowMatches[0];

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

        <section className="mt-8 mb-12">
          <div className="mb-5 inline-flex items-center rounded-full bg-blue-500/20 px-4 py-2 text-sm font-bold text-blue-300">
            📅 Tomorrow&apos;s tennis schedule
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Tennis Matches Tomorrow: Schedule, Start Times & TV Guide
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-400">
            Plan ahead with tomorrow&apos;s ATP, WTA, Challenger and Grand Slam tennis schedule. Check start times, tournaments and official viewing options before match day.
          </p>

          <p className="mt-4 max-w-3xl text-zinc-500">
            Showing matches for {formatDateLabel()}. Watch Tennis Today does not host, embed or retransmit live tennis broadcasts.
          </p>
        </section>

        {featuredMatch ? (
          <section className="mb-12 rounded-[2.5rem] border border-blue-500/60 bg-gradient-to-br from-blue-950/40 to-black p-8">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-blue-500 px-4 py-2 text-sm font-black text-black">
                Featured tomorrow
              </span>
              <span className="text-zinc-400">{featuredMatch.category}</span>
              <span className="text-zinc-500">•</span>
              <a
                href={`/tournament/${slugify(featuredMatch.tournament)}`}
                className="text-zinc-400 hover:text-blue-300"
              >
                {featuredMatch.tournament}
              </a>
            </div>

            <h2 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
              {featuredMatch.player1}
              <br />
              vs
              <br />
              {featuredMatch.player2}
            </h2>

            <p className="mb-8 text-xl font-black text-blue-200">
              Starts {formatTime(featuredMatch.startTime)}
            </p>

            <a
              href={`/watch/${matchSlug(featuredMatch)}`}
              className="inline-flex rounded-2xl bg-blue-500 px-6 py-4 text-lg font-black text-black transition-all hover:bg-blue-400"
            >
              Open match page →
            </a>
          </section>
        ) : null}

        {loading ? (
          <p className="text-xl text-zinc-500">Loading tomorrow&apos;s tennis schedule...</p>
        ) : tomorrowMatches.length === 0 ? (
          <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
            <h2 className="mb-4 text-3xl font-black">No confirmed tennis matches found for tomorrow</h2>
            <p className="max-w-3xl leading-7 text-zinc-400">
              Some tournaments publish order of play later in the day. Check today&apos;s schedule, live matches or official tournament pages for the latest updates.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/today" className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400">
                View today&apos;s matches
              </a>
              <a href="/tennis-order-of-play-today" className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold hover:border-zinc-500">
                Order of play today
              </a>
            </div>
          </section>
        ) : (
          <section className="mb-12">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-blue-300">
                  Tomorrow
                </p>
                <h2 className="text-4xl font-black">{tomorrowMatches.length} scheduled matches</h2>
              </div>
              <a href="/today" className="text-sm font-bold text-zinc-400 hover:text-white">
                Today&apos;s matches →
              </a>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tomorrowMatches.slice(0, 36).map((match) => (
                <article key={match.id} className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full bg-zinc-800 px-3 py-1 font-bold text-zinc-300">
                      {formatTime(match.startTime)}
                    </span>
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 font-bold text-blue-300">
                      {match.category || "Tennis"}
                    </span>
                  </div>

                  <h3 className="mb-3 text-2xl font-black leading-tight">
                    {match.player1} <span className="text-zinc-500">vs</span> {match.player2}
                  </h3>

                  <a
                    href={`/tournament/${slugify(match.tournament)}`}
                    className="mb-5 block text-sm text-zinc-400 hover:text-blue-300"
                  >
                    {match.tournament}
                  </a>

                  <a
                    href={`/watch/${matchSlug(match)}`}
                    className="inline-flex rounded-xl border border-zinc-700 px-4 py-3 text-sm font-black hover:border-blue-400 hover:text-blue-300"
                  >
                    Match details →
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12 grid gap-5 md:grid-cols-3">
          <a href="/tennis-schedule-today" className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-600">
            <h2 className="mb-2 text-2xl font-black">Today&apos;s schedule</h2>
            <p className="text-zinc-400">Live and upcoming matches for the current day.</p>
          </a>
          <a href="/tennis-on-tv-today" className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-600">
            <h2 className="mb-2 text-2xl font-black">Tennis on TV</h2>
            <p className="text-zinc-400">Find official broadcasters and TV listings by region.</p>
          </a>
          <Link href="/compare" className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-600">
            <h2 className="mb-2 text-2xl font-black">Compare services</h2>
            <p className="text-zinc-400">Choose the right legal streaming option before subscribing.</p>
          </Link>
        </section>

        <section className="mb-12">
          <EmailSignup
            title="Get tomorrow's big match reminders"
            description="A calm optional signup for notable match schedule updates. No popups, no auto-subscribe and no spam."
            source="tomorrow-page"
            context="tomorrow schedule page"
            buttonLabel="Send me tennis alerts"
          />
        </section>

        <RevenueConversionPanel context="tomorrow-schedule" />
      </div>
    </main>
  );
}
