import type { ComponentProps } from "react";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";

type DailyTennisGuideProps = ComponentProps<typeof DailyTennisGuide>;

export const polishDailyGuideLabels: NonNullable<DailyTennisGuideProps["labels"]> = {
  lastUpdated: "Ostatnia aktualizacja",
  dateContext: "Data",
  realMatchData: "Prawdziwe dane meczowe",
  noInventedMatchups: "Dane pochodzą z tenisowego API meczowego. Nie pokazujemy wymyślonych spotkań.",
  scheduleDashboard: "Panel dzisiejszego terminarza tenisowego",
  liveClaimNote: "Ta strona nie oznacza meczu jako na żywo, jeśli źródło danych nie podaje statusu live.",
  markedLive: "Oznaczone jako live",
  upcoming: "Nadchodzące",
  delayedSuspended: "Opóźnione / przerwane",
  editorialGuide: "Przewodnik redakcyjny",
  todaysMatches: "Dzisiejsze mecze",
  latestUpdates: "Najnowsze mecze na żywo lub zakończone",
  liveUpcomingMatches: "Mecze na żywo i nadchodzące",
  openFullLivePage: "Otwórz stronę live",
  time: "Godzina",
  score: "Wynik",
  notStartedUnavailable: "Nie rozpoczęto / brak danych",
  matchPage: "Strona meczu",
  whereToWatch: "Gdzie oglądać",
  tournamentContext: "Kontekst turniejów",
  tournamentsAppearing: "Turnieje widoczne w dzisiejszych danych",
  scheduleCheck: "Sprawdzenie terminarza",
  howToUseThisPage: "Jak korzystać z tej strony",
  howToUseThisPageBody:
    "Zacznij od meczów na żywo i nadchodzących, otwórz stronę meczu po kontekst, a następnie potwierdź godzinę i kort w oficjalnym planie gier.",
  legalViewing: "Legalne oglądanie",
  legalViewingBody:
    "Opcje oglądania zależą od kraju, turnieju i praw nadawców. Przed startem meczu sprawdź legalne źródło transmisji.",
  relatedTennisPages: "Powiązane strony tenisowe",
  faq: "FAQ",
  liveNow: "Na żywo",
  suspendedDelayed: "Przerwany / opóźniony",
  upcomingStatus: "Nadchodzący",
  statusTbc: "Status do potwierdzenia",
  timeTbc: "Godzina do potwierdzenia",
};
