"use client";

import Link from "next/link";
import { useState } from "react";

const STORAGE_KEY = "watchTennisToday.followedPlayers";

type FollowedPlayer = {
  slug: string;
  name: string;
  addedAt: string;
};

function readFollowedPlayers(): FollowedPlayer[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFollowedPlayers(players: FollowedPlayer[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  window.dispatchEvent(new Event("watch-tennis-followed-players-changed"));
}

export default function LocalPlayerFollowButton({
  playerName,
  playerSlug,
}: {
  playerName: string;
  playerSlug: string;
}) {
  const [followed, setFollowed] = useState(() =>
    readFollowedPlayers().some((player) => player.slug === playerSlug)
  );
  const [count, setCount] = useState(() => readFollowedPlayers().length);

  function toggleFollow() {
    const followedPlayers = readFollowedPlayers();
    const alreadyFollowed = followedPlayers.some((player) => player.slug === playerSlug);

    if (alreadyFollowed) {
      const nextPlayers = followedPlayers.filter((player) => player.slug !== playerSlug);
      writeFollowedPlayers(nextPlayers);
      setFollowed(false);
      setCount(nextPlayers.length);
      return;
    }

    const nextPlayers = [
      ...followedPlayers,
      {
        slug: playerSlug,
        name: playerName,
        addedAt: new Date().toISOString(),
      },
    ].slice(-30);

    writeFollowedPlayers(nextPlayers);
    setFollowed(true);
    setCount(nextPlayers.length);
  }

  return (
    <section className="mb-8 rounded-3xl border border-green-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm">
      <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-green-700">
        Personal match hub
      </p>

      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="mb-2 text-2xl font-black text-zinc-950">
            Follow {playerName} in My Players 🎾
          </h2>

          <p className="max-w-2xl leading-7 text-zinc-600">
            Save this player on this device and get a private dashboard with only
            your followed players’ live matches, next matches and quick watch links.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 md:justify-end">
          <button
            type="button"
            onClick={toggleFollow}
            className={
              followed
                ? "rounded-2xl border border-green-300 bg-white px-5 py-3 font-black text-green-800 shadow-sm hover:bg-green-50"
                : "rounded-2xl bg-black px-5 py-3 font-black text-white shadow-sm hover:bg-zinc-800"
            }
          >
            {followed ? "✓ Following" : "🔔 Follow player"}
          </button>

          <Link
            href="/my-players"
            className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 font-black text-zinc-900 shadow-sm hover:border-green-400 hover:bg-green-50"
          >
            My Players{count ? ` (${count})` : ""} →
          </Link>
        </div>
      </div>
    </section>
  );
}
