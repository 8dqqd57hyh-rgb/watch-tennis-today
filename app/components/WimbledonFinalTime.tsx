"use client";
import { useEffect, useState } from "react";

export default function WimbledonFinalTime({ startTime, active = true }: { startTime: string; active?: boolean }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const initial = window.setTimeout(() => setNow(Date.now()), 0);
    if (!active) return () => window.clearTimeout(initial);
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => { window.clearTimeout(initial); window.clearInterval(timer); };
  }, [active]);
  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return null;
  const local = now === null ? null : new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(date);
  const diff = now === null ? 0 : Math.max(0, date.getTime() - now);
  const minutes = Math.ceil(diff / 60_000); const days = Math.floor(minutes / 1440); const hours = Math.floor((minutes % 1440) / 60); const mins = minutes % 60;
  const countdown = days ? `${days}d ${hours}h` : hours ? `${hours}h ${mins}m` : `${mins}m`;
  return <span className="block text-sm font-bold text-white">{local ? `Your local time: ${local}` : "Loading your local time…"}{active && diff > 0 ? <span className="ml-2 text-xs font-normal text-green-300">Starts in {countdown}</span> : null}</span>;
}
