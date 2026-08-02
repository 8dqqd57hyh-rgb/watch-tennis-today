"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Match } from "@/app/lib/finals";

const REFRESH_MS = 60_000;
const MAX_REFRESH_MS = 15 * REFRESH_MS;

function matchHref(match: Match) {
  return `/watch/${encodeURIComponent(String(match.id))}`;
}

function statusLabel(status: string) {
  const normalized = status.trim().toLowerCase();
  if (normalized.includes("delay") || normalized.includes("suspend")) return "Rain delay";
  if (normalized.includes("postpon")) return "Postponed";
  if (normalized === "live" || normalized.includes("in progress")) return "LIVE";
  if (normalized.includes("finish") || normalized.includes("complete")) return "Final result";
  return status || "Scheduled";
}

export default function HomepageFinalsBanner() {
  const [finals, setFinals] = useState<Match[]>([]);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    let active = true;
    let controller: AbortController | null = null;
    let timer: number | null = null;
    let consecutiveFailures = 0;

    function clearTimer() {
      if (timer === null) return;
      window.clearTimeout(timer);
      timer = null;
    }

    function scheduleRefresh() {
      clearTimer();
      if (!active || document.hidden) return;
      const delay = Math.min(REFRESH_MS * 2 ** consecutiveFailures, MAX_REFRESH_MS);
      timer = window.setTimeout(refresh, delay);
    }

    async function refresh() {
      if (!active || document.hidden) return;
      controller?.abort();
      controller = new AbortController();
      try {
        const response = await fetch("/api/finals", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Finals refresh failed with ${response.status}`);
        const data = (await response.json()) as { finals?: Match[] };
        if (!active) return;
        setFinals(Array.isArray(data.finals) ? data.finals : []);
        setUpdatedAt(new Date());
        consecutiveFailures = 0;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        consecutiveFailures += 1;
      } finally {
        scheduleRefresh();
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        clearTimer();
        controller?.abort();
        return;
      }
      void refresh();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (!document.hidden) void refresh();
    return () => {
      active = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      controller?.abort();
      clearTimer();
    };
  }, []);

  if (!finals.length) return null;

  return (
    <section aria-labelledby="featured-finals-title" className="mb-6 overflow-hidden rounded-3xl border border-amber-400/50 bg-gradient-to-br from-amber-400/15 via-zinc-950 to-zinc-950 p-5 md:p-7" data-testid="featured-finals-banner">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Washington finals · weather watch</p>
          <h2 id="featured-finals-title" className="mt-2 text-2xl font-black md:text-4xl">Pegula and Jódar finals</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">Live feed status, score and revised start time. This panel checks for updates every minute.</p>
        </div>
        {updatedAt ? <p className="text-xs font-bold text-zinc-400" aria-live="polite">Checked {updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p> : null}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {finals.map((final) => (
          <article key={final.id} className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-black uppercase text-zinc-400">{final.category} · Final</p>
              <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black uppercase text-black">{statusLabel(final.status)}</span>
            </div>
            <h3 className="mt-3 text-xl font-black">{final.player1} <span className="text-zinc-500">vs</span> {final.player2}</h3>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <p><span className="text-zinc-500">Score:</span> <strong>{final.score || "Not started"}</strong></p>
              <p><span className="text-zinc-500">Start:</span> <strong>{final.startTime ? new Date(final.startTime).toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" }) : "TBC"}</strong></p>
            </div>
            <Link href={matchHref(final)} className="mt-4 inline-flex rounded-full bg-green-500 px-4 py-2 text-sm font-black text-black hover:bg-green-400">Open match center</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
