import { test as base, type ConsoleMessage, type Page } from "@playwright/test";
import { CanIWatchPage } from "./pages/CanIWatchPage";

export type RuntimeErrorPolicy = "fail" | "collect" | "off";

export type RuntimeErrorRecord = {
  source: "console" | "pageerror";
  message: string;
};

export type RuntimeMonitor = {
  readonly errors: RuntimeErrorRecord[];
  readonly ignoredErrors: RuntimeErrorRecord[];
  isActive(): boolean;
  report(): string;
};

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

function formatRuntimeErrors(errors: RuntimeErrorRecord[]) {
  if (!errors.length) return "No critical application runtime errors detected.";

  return [
    `Critical application runtime errors (${errors.length}):`,
    ...errors.map((error, index) => `${index + 1}. [${error.source}] ${error.message}`),
  ].join("\n");
}

export function monitorPageRuntime(page: Page) {
  const errors: RuntimeErrorRecord[] = [];
  const ignoredErrors: RuntimeErrorRecord[] = [];
  let active = true;

  const onConsole = (message: ConsoleMessage) => {
    if (message.type() !== "error") return;

    const record: RuntimeErrorRecord = { source: "console", message: message.text() };
    if (ignoredConsolePatterns.some((pattern) => pattern.test(record.message))) {
      ignoredErrors.push(record);
      return;
    }

    if (criticalConsolePatterns.some((pattern) => pattern.test(record.message))) {
      errors.push(record);
    }
  };
  const onPageError = (error: Error) => {
    errors.push({ source: "pageerror", message: error.message });
  };

  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  const monitor: RuntimeMonitor = {
    errors,
    ignoredErrors,
    isActive: () => active,
    report: () => formatRuntimeErrors(errors),
  };

  return {
    monitor,
    dispose() {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
      active = false;
    },
  };
}

type ProjectFixtures = {
  canIWatchPage: CanIWatchPage;
  runtimeMonitor: RuntimeMonitor;
  runtimeErrorPolicy: RuntimeErrorPolicy;
};

export const test = base.extend<ProjectFixtures>({
  canIWatchPage: async ({ page }, fixtureUse) => {
    await fixtureUse(new CanIWatchPage(page));
  },

  runtimeErrorPolicy: ["fail", { option: true }],

  runtimeMonitor: async ({ page, runtimeErrorPolicy }, fixtureUse, testInfo) => {
    if (runtimeErrorPolicy === "off") {
      await fixtureUse({
        errors: [],
        ignoredErrors: [],
        isActive: () => false,
        report: () => "Runtime monitoring is disabled for this test.",
      });
      return;
    }

    const { monitor, dispose } = monitorPageRuntime(page);
    try {
      await fixtureUse(monitor);
    } finally {
      dispose();

      if (monitor.errors.length) {
        const report = monitor.report();
        await testInfo.attach("runtime-errors", {
          body: report,
          contentType: "text/plain",
        });

        if (runtimeErrorPolicy === "fail" && testInfo.status === testInfo.expectedStatus) {
          throw new Error(report);
        }
      }
    }
  },
});
