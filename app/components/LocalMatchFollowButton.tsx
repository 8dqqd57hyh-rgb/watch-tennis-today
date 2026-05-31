"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "watchTennisToday.followedMatches";

type FollowedMatch = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category?: string;
  status?: string;
  score?: string;
  startTime?: string | null;
  slug: string;
  addedAt: string;
};

function readFollowedMatches(): FollowedMatch[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((match) => match?.id && match?.slug) : [];
  } catch {
    return [];
  }
}

function saveFollowedMatches(matches: FollowedMatch[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  window.dispatchEvent(new Event("watch-tennis-followed-matches-changed"));
}

export default function LocalMatchFollowButton({
  match,
  className = "",
}: {
  match: Omit<FollowedMatch, "addedAt">;
  className?: string;
}) {
  const [followed, setFollowed] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    function sync() {
      const matches = readFollowedMatches();
      setFollowed(matches.some((item) => String(item.id) === String(match.id)));
      setCount(matches.length);
    }

    sync();
    window.addEventListener("watch-tennis-followed-matches-changed", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("watch-tennis-followed-matches-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [match.id]);

  function toggleFollow() {
    const matches = readFollowedMatches();
    const alreadyFollowed = matches.some((item) => String(item.id) === String(match.id));

    if (alreadyFollowed) {
      const nextMatches = matches.filter((item) => String(item.id) !== String(match.id));
      saveFollowedMatches(nextMatches);
      setFollowed(false);
      setCount(nextMatches.length);
      return;
    }

    const nextMatches = [
      {
        ...match,
        id: String(match.id),
        addedAt: new Date().toISOString(),
      },
      ...matches.filter((item) => String(item.id) !== String(match.id)),
    ].slice(0, 50);

    saveFollowedMatches(nextMatches);
    setFollowed(true);
    setCount(nextMatches.length);
  }

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleFollow}
        className={followed
          ? "rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black transition hover:bg-emerald-300"
          : "rounded-2xl border border-white/15 bg-white/10 px-5 py-3 font-black text-white transition hover:border-emerald-400 hover:text-emerald-300"}
      >
        {followed ? "✓ Match saved" : "🔔 Follow match"}
      </button>
      <a
        href="/my-feed"
        className="rounded-2xl border border-white/15 bg-black/30 px-5 py-3 font-black text-white transition hover:border-emerald-400 hover:text-emerald-300"
      >
        My Feed{count ? ` (${count})` : ""} →
      </a>
    </div>
  );
}
