export const locales = ["en", "pl"] as const;

export type Locale = (typeof locales)[number];

export type Dictionary = {
  common: {
    today: string;
    liveTennis: string;
    matches: string;
    tournaments: string;
    players: string;
    broadcasters: string;
    watch: string;
    tvSchedule: string;
    liveStream: string;
    startTime: string;
    court: string;
    round: string;
    noMatchesFound: string;
    checkAvailability: string;
    whereToWatch: string;
    tennisToday: string;
    upcomingMatches: string;
    completedMatches: string;
    finals: string;
    myPlayers: string;
    search: string;
    country: string;
    tournament: string;
    player: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    common: {
      today: "Today",
      liveTennis: "Live tennis",
      matches: "Matches",
      tournaments: "Tournaments",
      players: "Players",
      broadcasters: "Broadcasters",
      watch: "Watch",
      tvSchedule: "TV schedule",
      liveStream: "Live stream",
      startTime: "Start time",
      court: "Court",
      round: "Round",
      noMatchesFound: "No matches found",
      checkAvailability: "Check availability",
      whereToWatch: "Where to watch",
      tennisToday: "Tennis today",
      upcomingMatches: "Upcoming matches",
      completedMatches: "Completed matches",
      finals: "Finals",
      myPlayers: "My players",
      search: "Search",
      country: "Country",
      tournament: "Tournament",
      player: "Player",
    },
  },
  pl: {
    common: {
      today: "Dzisiaj",
      liveTennis: "Tenis na żywo",
      matches: "Mecze",
      tournaments: "Turnieje",
      players: "Zawodnicy",
      broadcasters: "Nadawcy",
      watch: "Oglądaj",
      tvSchedule: "Program TV",
      liveStream: "Transmisja na żywo",
      startTime: "Godzina rozpoczęcia",
      court: "Kort",
      round: "Runda",
      noMatchesFound: "Nie znaleziono meczów",
      checkAvailability: "Sprawdź dostępność",
      whereToWatch: "Gdzie oglądać",
      tennisToday: "Tenis dzisiaj",
      upcomingMatches: "Nadchodzące mecze",
      completedMatches: "Zakończone mecze",
      finals: "Finały",
      myPlayers: "Moi zawodnicy",
      search: "Szukaj",
      country: "Kraj",
      tournament: "Turniej",
      player: "Zawodnik",
    },
  },
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const localizedPathMap = {
  "/today": "/pl/dzisiaj",
  "/live-tennis": "/pl/tenis-na-zywo",
  "/who-plays-tennis-today": "/pl/kto-gra-dzisiaj-w-tenisa",
  "/watch-tennis-in/poland": "/pl/gdzie-ogladac-tenis-w-polsce",
} as const;

export type EnglishLocalizedPath = keyof typeof localizedPathMap;
export type PolishLocalizedPath = (typeof localizedPathMap)[EnglishLocalizedPath];

export const reverseLocalizedPathMap = Object.fromEntries(
  Object.entries(localizedPathMap).map(([englishPath, polishPath]) => [polishPath, englishPath])
) as Record<PolishLocalizedPath, EnglishLocalizedPath>;

export function getLocaleFromPath(pathname: string): Locale {
  return pathname === "/pl" || pathname.startsWith("/pl/") ? "pl" : "en";
}

export function getEquivalentPath(pathname: string, targetLocale: Locale) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;

  if (targetLocale === "pl") {
    return localizedPathMap[normalized as EnglishLocalizedPath] || "/pl/dzisiaj";
  }

  return reverseLocalizedPathMap[normalized as PolishLocalizedPath] || "/";
}

export function localizedAlternates(englishPath: EnglishLocalizedPath) {
  const polishPath = localizedPathMap[englishPath];

  return {
    canonical: englishPath,
    languages: {
      en: englishPath,
      pl: polishPath,
      "x-default": englishPath,
    },
  };
}
