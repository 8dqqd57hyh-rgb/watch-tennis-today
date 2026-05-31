"use client";

import { useState } from "react";

type SpoilerFreeScoreToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

const STORAGE_KEY = "watch-tennis-today-spoiler-free";

export function useSpoilerFreeScores() {
  const [spoilerFree, setSpoilerFree] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  function updateSpoilerFree(nextValue: boolean) {
    setSpoilerFree(nextValue);

    try {
      localStorage.setItem(STORAGE_KEY, nextValue ? "1" : "0");
    } catch {
      // Ignore storage errors in private browsing or locked-down browsers.
    }
  }

  return [spoilerFree, updateSpoilerFree] as const;
}

export default function SpoilerFreeScoreToggle({ enabled, onChange }: SpoilerFreeScoreToggleProps) {
  return (
    <section className="mb-8 rounded-[2rem] border border-yellow-500/30 bg-yellow-950/15 p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-sm font-black uppercase tracking-widest text-yellow-300">
            Spoiler-free mode
          </p>
          <h2 className="text-2xl font-black text-white">Hide scores until you are ready</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
            Turn this on when you want to check start times and match pages without seeing finished results first.
          </p>
        </div>

        <button
          type="button"
          aria-pressed={enabled}
          onClick={() => onChange(!enabled)}
          className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-black transition ${
            enabled
              ? "bg-yellow-300 text-black hover:bg-yellow-200"
              : "border border-zinc-700 text-zinc-200 hover:border-yellow-300 hover:text-yellow-200"
          }`}
        >
          {enabled ? "Scores hidden" : "Hide scores"}
        </button>
      </div>
    </section>
  );
}

export function SpoilerSafeScore({ score, hidden }: { score?: string; hidden: boolean }) {
  if (hidden) {
    return (
      <span className="inline-flex rounded-full border border-yellow-500/40 bg-yellow-950/30 px-3 py-1 text-sm font-black text-yellow-200">
        Hidden by spoiler-free mode
      </span>
    );
  }

  return <>{score || "-"}</>;
}
