import { expect, test } from "@playwright/test";

function projectBaseURL(baseURL: unknown) {
  if (typeof baseURL !== "string") {
    throw new Error("BrowserContext isolation tests require a configured Playwright baseURL.");
  }

  return baseURL;
}

test.describe("BrowserContext isolation", () => {
  test("cookies and web storage do not leak between contexts", async ({ browser }, testInfo) => {
    const baseURL = projectBaseURL(testInfo.project.use.baseURL);
    const contextA = await browser.newContext({ baseURL });
    const contextB = await browser.newContext({ baseURL });

    try {
      const pageA = await contextA.newPage();
      const pageB = await contextB.newPage();
      await Promise.all([
        pageA.goto("/", { waitUntil: "domcontentloaded" }),
        pageB.goto("/", { waitUntil: "domcontentloaded" }),
      ]);

      await pageA.evaluate(() => {
        document.cookie = "isolation-cookie=context-a; path=/";
        localStorage.setItem("isolation-local", "context-a");
        sessionStorage.setItem("isolation-session", "context-a");
      });

      expect(await contextA.cookies()).toContainEqual(expect.objectContaining({
        name: "isolation-cookie",
        value: "context-a",
      }));
      expect(await contextB.cookies()).not.toContainEqual(expect.objectContaining({
        name: "isolation-cookie",
      }));
      await expect.poll(() => pageB.evaluate(() => ({
        local: localStorage.getItem("isolation-local"),
        session: sessionStorage.getItem("isolation-session"),
      }))).toEqual({ local: null, session: null });
    } finally {
      await contextA.close();
      await contextB.close();
    }
  });

  test("context route interception does not affect another context", async ({ browser }, testInfo) => {
    const baseURL = projectBaseURL(testInfo.project.use.baseURL);
    const contextA = await browser.newContext({ baseURL });
    const contextB = await browser.newContext({ baseURL });

    try {
      await contextA.route("**/about", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "text/html",
          body: "<main><h1>Intercepted only in context A</h1></main>",
        });
      });

      const pageA = await contextA.newPage();
      const pageB = await contextB.newPage();
      const [responseA, responseB] = await Promise.all([
        pageA.goto("/about", { waitUntil: "domcontentloaded" }),
        pageB.goto("/about", { waitUntil: "domcontentloaded" }),
      ]);

      expect(responseA?.status()).toBe(200);
      expect(responseB?.status()).toBe(200);
      await expect(pageA.getByRole("heading", { name: "Intercepted only in context A" })).toBeVisible();
      await expect(pageB.getByRole("heading", { name: "Intercepted only in context A" })).toHaveCount(0);
      await expect(pageB.locator("main")).toBeVisible();
    } finally {
      await contextA.close();
      await contextB.close();
    }
  });
});
