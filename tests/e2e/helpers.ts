import { expect, type Page } from "@playwright/test";

export async function expectPageHasContent(page: Page) {
  await expect(page.locator("body")).toBeVisible();
  await expect(page.locator("body")).toContainText(/\S/);
}

export async function routeExists(page: Page, url: string) {
  const response = await page.request.get(url, { failOnStatusCode: false });
  return response.status() !== 404;
}
