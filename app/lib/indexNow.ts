export const INDEXNOW_HOST = "watchtennistoday.com";
export const INDEXNOW_KEY = "0f95f974a95849d389c6a7de98b6a429";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export type IndexNowPayload = {
  host: typeof INDEXNOW_HOST;
  key: typeof INDEXNOW_KEY;
  keyLocation: typeof INDEXNOW_KEY_LOCATION;
  urlList: string[];
};

export type IndexNowSubmitResult = {
  submittedUrls: string[];
  skippedUrls: string[];
  status: number;
  statusText: string;
};

export function normalizeIndexNowUrl(input: string): string | null {
  let parsed: URL;

  try {
    parsed = new URL(input);
  } catch {
    return null;
  }

  if (parsed.protocol !== "https:") return null;
  if (parsed.hostname !== INDEXNOW_HOST) return null;

  parsed.hash = "";

  if (parsed.pathname === "/" && !parsed.search) {
    return parsed.origin;
  }

  return parsed.toString();
}

export function getEligibleIndexNowUrls(urls: string[]) {
  const seen = new Set<string>();
  const eligibleUrls: string[] = [];
  const skippedUrls: string[] = [];

  for (const url of urls) {
    const normalized = normalizeIndexNowUrl(url);

    if (!normalized || seen.has(normalized)) {
      skippedUrls.push(url);
      continue;
    }

    seen.add(normalized);
    eligibleUrls.push(normalized);
  }

  return { eligibleUrls, skippedUrls };
}

export function buildIndexNowPayload(urls: string[]): IndexNowPayload {
  return {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: urls,
  };
}

export async function submitToIndexNow(
  urls: string | string[],
  fetchImpl: typeof fetch = fetch,
): Promise<IndexNowSubmitResult> {
  const inputUrls = Array.isArray(urls) ? urls : [urls];
  const { eligibleUrls, skippedUrls } = getEligibleIndexNowUrls(inputUrls);

  if (eligibleUrls.length === 0) {
    return {
      submittedUrls: [],
      skippedUrls,
      status: 0,
      statusText: "No eligible IndexNow URLs",
    };
  }

  const response = await fetchImpl(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(buildIndexNowPayload(eligibleUrls)),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    const detail = body ? `: ${body}` : "";

    throw new Error(
      `IndexNow submission failed with ${response.status} ${response.statusText}${detail}`,
    );
  }

  return {
    submittedUrls: eligibleUrls,
    skippedUrls,
    status: response.status,
    statusText: response.statusText,
  };
}
