"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  label?: string;
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
};

const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1230772312817142";

const DEFAULT_AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;

function getFormatClass(format: NonNullable<AdSlotProps["format"]>) {
  if (format === "horizontal") {
    return "min-h-[90px]";
  }

  if (format === "vertical") {
    return "min-h-[280px]";
  }

  if (format === "rectangle") {
    return "min-h-[250px]";
  }

  return "min-h-[120px]";
}

export default function AdSlot({
  label = "Advertisement",
  slot = DEFAULT_AD_SLOT,
  format = "auto",
  className = "",
}: AdSlotProps) {
  useEffect(() => {
    if (!slot || typeof window === "undefined") {
      return;
    }

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers or delayed AdSense loading should never break the page.
    }
  }, [slot]);

  if (!slot) {
    return null;
  }

  return (
    <aside
      aria-label={label}
      className={`my-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/70 p-3 ${getFormatClass(format)} ${className}`}
      data-track-area="ad-slot"
      data-track-category="ad"
      data-track-id="adsense_slot"
    >
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-600">
        {label}
      </p>

      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format === "auto" ? "auto" : undefined}
        data-ad-layout={format === "fluid" ? "in-article" : undefined}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
