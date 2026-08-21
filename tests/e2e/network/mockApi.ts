import type { Page, Request, Route } from "@playwright/test";

type URLPattern = string | RegExp;

type JsonEndpointOptions = {
  body: unknown;
  status?: number;
  delayMs?: number;
  onRequest?: (request: Request) => void;
};

export async function fulfillJson(route: Route, status: number, body: unknown) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

export async function mockJsonEndpoint(
  page: Page,
  pattern: URLPattern,
  { body, status = 200, delayMs = 0, onRequest }: JsonEndpointOptions,
) {
  await page.route(pattern, async (route) => {
    onRequest?.(route.request());
    if (delayMs > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
    await fulfillJson(route, status, body);
  });
}

export async function mockRawEndpoint(
  page: Page,
  pattern: URLPattern,
  body: string,
  contentType = "application/json",
) {
  await page.route(pattern, async (route) => {
    await route.fulfill({ status: 200, contentType, body });
  });
}

export async function abortEndpoint(
  page: Page,
  pattern: URLPattern,
  errorCode: Parameters<Route["abort"]>[0] = "failed",
) {
  await page.route(pattern, async (route) => {
    await route.abort(errorCode);
  });
}
