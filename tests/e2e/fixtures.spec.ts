import { expect } from "@playwright/test";
import { monitorPageRuntime, test } from "./fixtures";

test.describe("runtime monitor fixture", () => {
  test.use({ runtimeErrorPolicy: "collect" });

  test("is initialized before the test and monitors the page", async ({ page, runtimeMonitor }) => {
    expect(runtimeMonitor.isActive()).toBe(true);

    await page.setContent("<main>Runtime monitor fixture</main>");
    await page.evaluate(() => console.error("application runtime error: fixture probe"));

    await expect.poll(() => runtimeMonitor.errors).toContainEqual({
      source: "console",
      message: "application runtime error: fixture probe",
    });
  });

  test("filters expected third-party console noise", async ({ page, runtimeMonitor }) => {
    await page.setContent("<main>Third-party noise probe</main>");
    await page.evaluate(() => console.error("Failed to load resource: googlesyndication test endpoint"));

    await expect.poll(() => runtimeMonitor.ignoredErrors.length).toBe(1);
    expect(runtimeMonitor.errors).toEqual([]);
  });

  test("detects and clearly reports an application page error", async ({ page, runtimeMonitor }) => {
    await page.setContent("<main>Page error probe</main>");
    await page.evaluate(() => {
      setTimeout(() => {
        throw new Error("fixture application crash");
      }, 0);
    });

    await expect.poll(() => runtimeMonitor.errors.length).toBe(1);
    expect(runtimeMonitor.report()).toContain("Critical application runtime errors (1)");
    expect(runtimeMonitor.report()).toContain("[pageerror] fixture application crash");
  });

  test("removes its page listeners during cleanup", async ({ page }) => {
    const { monitor, dispose } = monitorPageRuntime(page);

    expect(monitor.isActive()).toBe(true);
    await page.setContent("<main>Cleanup probe</main>");
    await page.evaluate(() => console.error("runtime error before cleanup"));
    await expect.poll(() => monitor.errors.length).toBe(1);

    dispose();

    expect(monitor.isActive()).toBe(false);
    await page.evaluate(() => console.error("runtime error after cleanup"));
    expect(monitor.errors).toHaveLength(1);
  });
});
