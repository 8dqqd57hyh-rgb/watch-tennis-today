import { expect, test } from "@playwright/test";
import {
  assertRegressionBaseUrlAllowed,
  isProductionUrl,
} from "./config/productionSafety";

test.describe("Playwright production safety", () => {
  test("allows localhost and preview deployments", () => {
    expect(isProductionUrl("http://localhost:3000")).toBe(false);
    expect(isProductionUrl("https://watch-tennis-preview.vercel.app")).toBe(false);
    expect(() => assertRegressionBaseUrlAllowed("http://localhost:3000")).not.toThrow();
    expect(() =>
      assertRegressionBaseUrlAllowed("https://watch-tennis-preview.vercel.app"),
    ).not.toThrow();
  });

  test("classifies both canonical production hostnames", () => {
    expect(isProductionUrl("https://watchtennistoday.com")).toBe(true);
    expect(isProductionUrl("https://www.watchtennistoday.com/live-tennis")).toBe(true);
  });

  test("does not use unsafe substring matching", () => {
    expect(isProductionUrl("https://watchtennistoday.com.example.com")).toBe(false);
    expect(isProductionUrl("https://notwatchtennistoday.com")).toBe(false);
  });

  test("blocks production regression with actionable guidance", () => {
    expect(() => assertRegressionBaseUrlAllowed("https://watchtennistoday.com")).toThrow(
      /Production regression execution is blocked.*test:e2e:prod-smoke/,
    );
  });
});
