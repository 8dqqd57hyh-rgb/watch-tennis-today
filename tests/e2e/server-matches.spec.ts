import { expect, test } from "@playwright/test";
import { getBaseUrl } from "../../app/lib/serverMatches";
import { SITE_URL } from "../../app/lib/technicalSeo";

test.describe("server match API origin", () => {
  test.afterEach(() => { delete process.env.NEXT_PUBLIC_SITE_URL; });

  test("uses a valid configured HTTP origin without paths", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://preview.example.com/some/path";
    expect(getBaseUrl()).toBe("https://preview.example.com");
  });

  test("falls back to the canonical site for missing or unsafe URLs", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getBaseUrl()).toBe(SITE_URL);
    process.env.NEXT_PUBLIC_SITE_URL = "javascript:alert(1)";
    expect(getBaseUrl()).toBe(SITE_URL);
    process.env.NEXT_PUBLIC_SITE_URL = "not a url";
    expect(getBaseUrl()).toBe(SITE_URL);
  });
});
