export const ADSENSE_PUBLISHER_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1230772312817142";

export const ADSENSE_ACCOUNT_ID = ADSENSE_PUBLISHER_ID.replace(/^ca-/, "");

export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;

export const DEFAULT_ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT;
