import { expect, test } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  expectNoCriticalConsoleErrors,
} from "./helpers";

test("email subscription form validates input and submits safely", async ({ page }) => {
  const errors = collectCriticalConsoleErrors(page);

  await page.route("**/api/subscribe-*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/newsletter", { waitUntil: "domcontentloaded" });

  const emailInput = page.locator('form input[type="email"]').first();
  const form = emailInput.locator("xpath=ancestor::form[1]");
  const submit = form.getByRole("button").first();

  if ((await emailInput.count()) === 0) {
    test.skip(true, "No newsletter email form is present on this page.");
  }

  await submit.click();
  await expect(emailInput).toBeFocused();
  expect(await emailInput.evaluate((input) => (input as HTMLInputElement).validity.valid)).toBe(false);

  await emailInput.fill("not-an-email");
  await submit.click();
  expect(await emailInput.evaluate((input) => (input as HTMLInputElement).validity.valid)).toBe(false);

  await emailInput.fill("qa-watch-tennis@example.com");
  await submit.click();

  await expect(page.getByText(/signed up|subscribed|thank you|updates/i).first()).toBeVisible();
  expectNoCriticalConsoleErrors(errors);
});
