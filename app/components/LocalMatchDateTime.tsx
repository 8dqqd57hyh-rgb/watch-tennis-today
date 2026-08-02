"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function formatMatchDateTime(value: string, local: boolean) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBC";

  return new Intl.DateTimeFormat(local ? undefined : "en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: local ? undefined : "UTC",
    timeZoneName: "short",
  }).format(date);
}

export default function LocalMatchDateTime({ value }: { value: string }) {
  const label = useSyncExternalStore(
    subscribe,
    () => formatMatchDateTime(value, true),
    () => formatMatchDateTime(value, false),
  );

  return (
    <time dateTime={value} data-testid="local-match-time" suppressHydrationWarning>
      {label}
    </time>
  );
}
