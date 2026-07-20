"use client";

import { useEffect, useState } from "react";

export default function LocalTvTime({ startTime }: { startTime: string | null }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!startTime) return;
    const date = new Date(startTime);
    if (Number.isNaN(date.getTime())) return;
    setLabel(new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(date));
  }, [startTime]);

  if (!startTime) return <>TBC</>;
  return <span className="inline-block min-w-20">{label || new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", timeZone: "UTC", timeZoneName: "short" }).format(new Date(startTime))}</span>;
}
