"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

type GtagFn = (
  command: "event",
  eventName: string,
  params?: Record<string, string | number | boolean>,
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

function cleanText(value: string | null | undefined) {
  return (value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function isAffiliateLink(anchor: HTMLAnchorElement, url: URL) {
  const rel = anchor.getAttribute("rel") || "";
  const href = url.href.toLowerCase();

  return (
    rel.includes("sponsored") ||
    href.includes("nordvpn") ||
    href.includes("affiliate") ||
    href.includes("utm_medium=affiliate")
  );
}

function getLinkArea(anchor: HTMLAnchorElement) {
  return (
    anchor.closest("header") && "header") ||
    (anchor.closest("footer") && "footer") ||
    anchor.getAttribute("data-track-area") ||
    "content"
  );
}

export default function ClickAnalytics() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      let url: URL;

      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }

      const isInternal = url.origin === window.location.origin;
      const isAffiliate = isAffiliateLink(anchor, url);
      const eventName = isAffiliate ? "affiliate_click" : isInternal ? "internal_link_click" : "external_link_click";

      const payload = {
        href: isInternal ? url.pathname : url.hostname,
        from_path: window.location.pathname,
        link_text: cleanText(anchor.textContent) || "unlabeled link",
        link_area: getLinkArea(anchor),
        is_internal: isInternal,
      };

      track(eventName, payload);

      window.gtag?.("event", eventName, payload);
    }

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return null;
}
