"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "watchTennisToday.followedTournaments";

type FollowedTournament = {
  slug: string;
  name: string;
  addedAt: string;
};

function readFollowedTournaments(): FollowedTournament[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => item?.slug && item?.name) : [];
  } catch {
    return [];
  }
}

function saveFollowedTournaments(tournaments: FollowedTournament[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tournaments));
  window.dispatchEvent(new Event("watch-tennis-followed-tournaments-changed"));
}

export default function LocalTournamentFollowButton({
  slug,
  name,
  className = "",
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    function sync() {
      setFollowed(readFollowedTournaments().some((item) => item.slug === slug));
    }

    sync();
    window.addEventListener("watch-tennis-followed-tournaments-changed", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("watch-tennis-followed-tournaments-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [slug]);

  function toggleFollow() {
    const tournaments = readFollowedTournaments();
    const alreadyFollowed = tournaments.some((item) => item.slug === slug);

    if (alreadyFollowed) {
      saveFollowedTournaments(tournaments.filter((item) => item.slug !== slug));
      setFollowed(false);
      return;
    }

    saveFollowedTournaments([{ slug, name, addedAt: new Date().toISOString() }, ...tournaments.filter((item) => item.slug !== slug)].slice(0, 20));
    setFollowed(true);
  }

  return (
    <div className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={toggleFollow}
        className={followed
          ? "rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black transition hover:bg-emerald-300"
          : "rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-black text-white transition hover:border-emerald-400 hover:text-emerald-300"}
      >
        {followed ? "✓ Tournament saved" : "⭐ Follow tournament"}
      </button>
      <a href="/my-feed" className="rounded-2xl border border-zinc-700 bg-black px-5 py-3 font-black text-white transition hover:border-emerald-400 hover:text-emerald-300">
        My Feed →
      </a>
    </div>
  );
}
