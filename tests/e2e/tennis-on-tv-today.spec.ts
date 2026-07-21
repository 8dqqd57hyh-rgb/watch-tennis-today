import { expect, test } from "@playwright/test";
import { serializeJsonLd, tennisOnTvMatchHref } from "../../app/lib/tennisOnTvToday";

test.describe("tennis on TV today helpers", () => {
  test("preserves provider match IDs in watch links", () => {
    expect(tennisOnTvMatchHref({ id: "sr:match:123/4" })).toBe("/watch/sr%3Amatch%3A123%2F4");
  });

  test("emits parseable JSON-LD without raw HTML opening tags", () => {
    const serialized = serializeJsonLd([{ "@type": "FAQPage", value: "</script><script>alert(1)</script>" }]);
    expect(serialized).not.toContain("<");
    expect(JSON.parse(serialized)).toEqual([{ "@type": "FAQPage", value: "</script><script>alert(1)</script>" }]);
  });
});
