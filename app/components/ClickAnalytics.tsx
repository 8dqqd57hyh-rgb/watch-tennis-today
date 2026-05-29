"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

type AnalyticsPayload = Record<string, string | number | boolean>;

type GtagFn = (
  command: "event",
  eventName: string,
  params?: AnalyticsPayload,
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

function getTrackValue(anchor: HTMLAnchorElement, name: string) {
  const directValue = anchor.getAttribute(name);

  if (directValue) {
    return directValue;
  }

  const trackedParent = anchor.closest(`[${name}]`);

  if (trackedParent instanceof HTMLElement) {
    return trackedParent.getAttribute(name) || undefined;
  }

  return undefined;
}

function isAffiliateLink(anchor: HTMLAnchorElement, url: URL) {
  const rel = anchor.getAttribute("rel") || "";
  const href = url.href.toLowerCase();
  const category = getTrackValue(anchor, "data-track-category") || "";

  return (
    category === "affiliate" ||
    rel.includes("sponsored") ||
    href.includes("nordvpn") ||
    href.includes("affiliate") ||
    href.includes("utm_medium=affiliate")
  );
}

function getLinkArea(anchor: HTMLAnchorElement) {
  return (
    getTrackValue(anchor, "data-track-area") ||
    (anchor.closest("header") && "header") ||
    (anchor.closest("footer") && "footer") ||
    "content"
  );
}

function getLinkCategory(anchor: HTMLAnchorElement, isAffiliate: boolean, isInternal: boolean) {
  return (
    getTrackValue(anchor, "data-track-category") ||
    (isAffiliate ? "affiliate" : isInternal ? "internal" : "external")
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

      if (anchor.getAttribute("data-track-ignore") === "true") {
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
      const linkText = cleanText(anchor.textContent) || "unlabeled link";
      const linkId = getTrackValue(anchor, "data-track-id") || linkText.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 60) || "unlabeled_link";

      const payload: AnalyticsPayload = {
        href: isInternal ? url.pathname : url.hostname,
        from_path: window.location.pathname,
        link_text: linkText,
        link_id: linkId,
        link_area: getLinkArea(anchor),
        link_category: getLinkCategory(anchor, isAffiliate, isInternal),
        destination_type: isInternal ? "internal" : "external",
        is_internal: isInternal,
      };

      const position = getTrackValue(anchor, "data-track-position");

      if (position) {
        payload.link_position = position;
      }

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
