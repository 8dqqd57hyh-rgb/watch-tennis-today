import { expect, type Page } from "@playwright/test";

const criticalConsolePatterns = [
  /uncaught/i,
  /unhandled/i,
  /hydration/i,
  /failed to load chunk/i,
  /chunkloaderror/i,
  /react error/i,
  /minified react error/i,
  /runtime error/i,
];

const ignoredConsolePatterns = [
  /favicon/i,
  /google/i,
  /googlesyndication/i,
  /doubleclick/i,
  /analytics/i,
  /adsbygoogle/i,
  /cookie/i,
  /failed to load resource.*(?:google|gstatic|googlesyndication|doubleclick)/i,
];

export function collectCriticalConsoleErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() !== "error") return;

    const text = message.text();
    if (ignoredConsolePatterns.some((pattern) => pattern.test(text))) return;

    if (criticalConsolePatterns.some((pattern) => pattern.test(text))) {
      errors.push(text);
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
}

export async function expectPageHasContent(page: Page) {
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("body")).toContainText(/\S/);
}

export function expectNoCriticalConsoleErrors(errors: string[]) {
  expect(errors, `Critical console errors:\n${errors.join("\n")}`).toEqual([]);
}

export async function routeExists(page: Page, url: string) {
  const response = await page.request.get(url, { failOnStatusCode: false });
  return response.status() !== 404;
}
