"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export type LocalMatchDateTimeFormat = "short" | "time";

type LocalMatchDateTimeProps = {
  value: string;
  format?: LocalMatchDateTimeFormat;
};

export function formatMatchDateTime(
  value: string,
  format: LocalMatchDateTimeFormat = "short",
  timeZone?: string,
) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBC";

  return new Intl.DateTimeFormat("en-US", {
    ...(format === "short" ? {
      weekday: "short",
      month: "short",
      day: "numeric",
    } : {}),
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    ...(timeZone ? { timeZone } : {}),
  }).format(date);
}

export default function LocalMatchDateTime({ value, format = "short" }: LocalMatchDateTimeProps) {
  const label = useSyncExternalStore(
    subscribe,
    () => formatMatchDateTime(value, format),
    // The browser time zone is unavailable during SSR. Render UTC first so
    // hydration has deterministic markup, then replace it with local time.
    () => formatMatchDateTime(value, format, "UTC"),
  );

  return (
    <time dateTime={value} data-testid="local-match-time" suppressHydrationWarning>
      {label}
    </time>
  );
}
