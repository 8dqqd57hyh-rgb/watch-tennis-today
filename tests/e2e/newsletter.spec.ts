import { expect } from "@playwright/test";
import { test } from "./fixtures";

test.describe("server-rendered email signup", () => {
  test.use({ javaScriptEnabled: false });

  test("email signup controls wait for hydration", async ({ page }) => {
    await page.goto("/newsletter", { waitUntil: "domcontentloaded" });

    const signup = page.getByTestId("email-signup");
    await expect(signup.getByTestId("email-signup-input")).toBeDisabled();
    await expect(signup.getByTestId("email-signup-submit")).toBeDisabled();
  });
});

test("email subscription form validates input and submits safely", async ({ page, runtimeMonitor }) => {
  expect(runtimeMonitor.isActive()).toBe(true);

  const subscriptionRequests: { method: string; body: unknown }[] = [];
  await page.route("**/api/subscribe-*", async (route) => {
    subscriptionRequests.push({
      method: route.request().method(),
      body: route.request().postDataJSON(),
    });
    expect(new URL(route.request().url()).pathname).toBe("/api/subscribe-general");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, persisted: true }),
    });
  });

  await page.goto("/newsletter", { waitUntil: "domcontentloaded" });

  const signup = page.getByTestId("email-signup");
  const form = signup.getByTestId("email-signup-form");
  const emailInput = form.getByTestId("email-signup-input");
  const submit = form.getByTestId("email-signup-submit");
  const validationError = signup.getByText("Please enter a valid email address.", { exact: true });
  const successMessage = signup.getByText("You are signed up for useful tennis updates.", { exact: false });

  await expect(form).toBeVisible();
  await expect(successMessage).toHaveCount(0);
  await submit.click();
  await expect(validationError).toBeVisible();
  expect(subscriptionRequests).toHaveLength(0);

  await emailInput.fill("not-an-email");
  await submit.click();
  await expect(validationError).toBeVisible();
  expect(subscriptionRequests).toHaveLength(0);

  await emailInput.fill("  QA-Watch-Tennis@Example.COM  ");
  await submit.click();

  await expect(successMessage).toBeVisible();
  await expect(form).toHaveCount(0);
  await expect(validationError).toHaveCount(0);
  expect(subscriptionRequests).toEqual([{
    method: "POST",
    body: {
      email: "qa-watch-tennis@example.com",
      source: "daily-tennis-alerts",
      contextType: "daily",
      contextValue: "newsletter-page",
    },
  }]);
});

for (const failure of [
  { name: "API error", status: 500, body: { ok: false } },
  { name: "unsaved signup", status: 200, body: { ok: true, persisted: false } },
  { name: "missing persistence confirmation", status: 200, body: { ok: true } },
  { name: "HTTP error with a success body", status: 500, body: { ok: true, persisted: true } },
]) {
  test(`email subscription form rejects ${failure.name} and allows retry`, async ({ page, runtimeMonitor }) => {
    expect(runtimeMonitor.isActive()).toBe(true);

    let requestCount = 0;
    await page.route("**/api/subscribe-*", async (route) => {
      requestCount += 1;
      await route.fulfill({
        status: requestCount === 1 ? failure.status : 200,
        contentType: "application/json",
        body: JSON.stringify(requestCount === 1 ? failure.body : { ok: true, persisted: true }),
      });
    });

    await page.goto("/newsletter", { waitUntil: "domcontentloaded" });

    const signup = page.getByTestId("email-signup");
    const form = signup.getByTestId("email-signup-form");
    const emailInput = form.getByTestId("email-signup-input");
    const submit = form.getByTestId("email-signup-submit");
    const apiError = signup.getByText("Could not save this signup right now. Please try again later.", { exact: true });
    const successMessage = signup.getByText("You are signed up for useful tennis updates.", { exact: false });

    await emailInput.fill("qa-watch-tennis@example.com");
    await submit.click();

    await expect(apiError).toBeVisible();
    await expect(successMessage).toHaveCount(0);
    await expect(emailInput).toHaveValue("qa-watch-tennis@example.com");
    await expect(submit).toBeEnabled();
    expect(requestCount).toBe(1);

    await submit.click();

    await expect(successMessage).toBeVisible();
    await expect(apiError).toHaveCount(0);
    await expect(form).toHaveCount(0);
    expect(requestCount).toBe(2);
  });
}
