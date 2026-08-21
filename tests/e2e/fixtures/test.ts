import { test as base, expect } from "@playwright/test";
import {
  collectCriticalConsoleErrors,
  expectNoCriticalConsoleErrors,
} from "../helpers";

type QaFixtures = {
  criticalConsoleErrors: string[];
};

export const test = base.extend<QaFixtures>({
  criticalConsoleErrors: [async ({ page }, use, testInfo) => {
    const errors = collectCriticalConsoleErrors(page);

    await use(errors);

    if (errors.length > 0) {
      await testInfo.attach("critical-console-errors", {
        body: Buffer.from(errors.join("\n"), "utf-8"),
        contentType: "text/plain",
      });
    }

    expectNoCriticalConsoleErrors(errors);
  }, { auto: true }],
});

export { expect };
