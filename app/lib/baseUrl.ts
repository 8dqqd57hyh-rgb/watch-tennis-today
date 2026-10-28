import { SITE_URL } from "@/app/lib/technicalSeo";

export function getBaseUrl(requestHost?: string | null) {
  const configuredUrl = requestHost
    ? `https://${requestHost}`
    : process.env.NEXT_PUBLIC_SITE_URL;

  if (!configuredUrl) return SITE_URL;

  try {
    const url = new URL(configuredUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return SITE_URL;
    }

    if (requestHost && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) {
      url.protocol = "http:";
    }

    return url.origin;
  } catch {
    return SITE_URL;
  }
}
