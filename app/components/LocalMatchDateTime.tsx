"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function formatMatchDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBC";

  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function LocalMatchDateTime({ value }: { value: string }) {
  const label = useSyncExternalStore(
    subscribe,
    () => formatMatchDateTime(value),
    () => "Local time loading…",
  );

  return (
    <time dateTime={value} data-testid="local-match-time" suppressHydrationWarning>
      {label}
    </time>
  );
}
