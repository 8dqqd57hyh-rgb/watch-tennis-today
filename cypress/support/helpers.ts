/// <reference types="cypress" />

export type SeoMetaExpectation = {
  title: string;
  descriptionIncludes: string;
  canonical: string;
};

export type ConsoleErrorOptions = {
  exclude?: RegExp[];
};

export const defaultConsoleErrorExclusions = [
  /googlesyndication/i,
  /doubleclick/i,
  /adsbygoogle/i,
  /google analytics/i,
  /ResizeObserver loop limit exceeded/i,
];

export function consoleErrorIsExpected(message: string, exclusions: RegExp[] = []) {
  return [...defaultConsoleErrorExclusions, ...exclusions].some((pattern) =>
    pattern.test(message)
  );
}

export function appRoutes() {
  return {
    home: "/",
    liveTennis: "/live-tennis",
    liveNow: "/matches/live-now",
    players: "/players",
  };
}
