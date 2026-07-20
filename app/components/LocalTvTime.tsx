"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function formatTime(startTime: string | null, local: boolean) {
  if (!startTime) return "TBC";
  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return "TBC";

  return new Intl.DateTimeFormat(local ? undefined : "en", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: local ? undefined : "UTC",
    timeZoneName: "short",
  }).format(date);
}

export default function LocalTvTime({ startTime }: { startTime: string | null }) {
  const label = useSyncExternalStore(
    subscribe,
    () => formatTime(startTime, true),
    () => formatTime(startTime, false),
  );

  return <span className="inline-block min-w-20">{label}</span>;
}
