import {
  INDEXNOW_HOST,
  submitToIndexNow,
  getEligibleIndexNowUrls,
} from "../app/lib/indexNow";

const SITEMAP_URL = `https://${INDEXNOW_HOST}/sitemap.xml`;

const FALLBACK_URLS = [
  `https://${INDEXNOW_HOST}`,
  `https://${INDEXNOW_HOST}/today`,
  `https://${INDEXNOW_HOST}/live-tennis`,
  `https://${INDEXNOW_HOST}/watch`,
  `https://${INDEXNOW_HOST}/players`,
  `https://${INDEXNOW_HOST}/tennis-calendar`,
  `https://${INDEXNOW_HOST}/tennis-guides`,
  `https://${INDEXNOW_HOST}/where-to-watch-wimbledon`,
  `https://${INDEXNOW_HOST}/wimbledon-live`,
  `https://${INDEXNOW_HOST}/french-open`,
];

function decodeXmlEntity(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function extractSitemapUrls(xml: string) {
  return Array.from(xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi), (match) =>
    decodeXmlEntity(match[1].trim()),
  );
}

async function getUrlsFromSitemap() {
  const response = await fetch(SITEMAP_URL, {
    headers: {
      accept: "application/xml,text/xml,*/*",
      "user-agent": "WatchTennisTodayIndexNow/1.0 (+https://watchtennistoday.com)",
    },
  });

  if (!response.ok) {
    throw new Error(`Sitemap fetch failed with ${response.status} ${response.statusText}`);
  }

  return extractSitemapUrls(await response.text());
}

async function main() {
  const cliUrls = process.argv.slice(2);
  const source = cliUrls.length > 0 ? "CLI arguments" : SITEMAP_URL;
  let urls = cliUrls;

  if (urls.length === 0) {
    try {
      urls = await getUrlsFromSitemap();
    } catch (error) {
      console.error(
        `[indexnow] Could not read sitemap, using fallback URLs: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      urls = FALLBACK_URLS;
    }
  }

  const { eligibleUrls, skippedUrls } = getEligibleIndexNowUrls(urls);

  console.log(`[indexnow] Source: ${source}`);
  console.log(`[indexnow] Eligible URLs: ${eligibleUrls.length}`);

  if (skippedUrls.length > 0) {
    console.log(`[indexnow] Skipped duplicate or non-watchtennistoday.com URLs: ${skippedUrls.length}`);
  }

  if (eligibleUrls.length === 0) {
    console.log("[indexnow] Nothing to submit.");
    return;
  }

  try {
    const result = await submitToIndexNow(eligibleUrls);
    console.log(
      `[indexnow] Submitted ${result.submittedUrls.length} URL(s): ${result.status} ${result.statusText}`,
    );
  } catch (error) {
    console.error(
      `[indexnow] Submission failed without failing the build: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

main().catch((error) => {
  console.error(
    `[indexnow] Unexpected error, continuing without failing the build: ${
      error instanceof Error ? error.message : String(error)
    }`,
  );
});
