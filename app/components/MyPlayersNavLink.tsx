"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "watchTennisToday.followedPlayers";

function getFollowedCount() {
  if (typeof window === "undefined") return 0;

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export default function MyPlayersNavLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function syncCount() {
      setCount(getFollowedCount());
    }

    syncCount();
    window.addEventListener("storage", syncCount);
    window.addEventListener("watch-tennis-followed-players-changed", syncCount);

    return () => {
      window.removeEventListener("storage", syncCount);
      window.removeEventListener("watch-tennis-followed-players-changed", syncCount);
    };
  }, []);

  return (
    <Link
      href="/my-players"
      className="rounded-full border border-emerald-400/40 px-3 py-1.5 text-emerald-300 hover:border-emerald-300 hover:bg-emerald-400/10 hover:text-emerald-200"
      style={{ color: "#6ee7b7" }}
    >
      My Players{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
