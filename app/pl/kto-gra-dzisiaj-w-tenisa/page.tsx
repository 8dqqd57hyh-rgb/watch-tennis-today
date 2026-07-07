import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";
import { polishDailyGuideLabels } from "@/app/pl/polishDailyGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kto gra dzisiaj w tenisa? | Plan meczów ATP i WTA",
  description:
    "Sprawdź, kto gra dzisiaj w tenisa. Aktualny plan meczów ATP, WTA, Wielkiego Szlema i najważniejszych turniejów.",
  alternates: {
    canonical: "https://watchtennistoday.com/pl/kto-gra-dzisiaj-w-tenisa",
    languages: {
      en: "https://watchtennistoday.com/who-plays-tennis-today",
      pl: "https://watchtennistoday.com/pl/kto-gra-dzisiaj-w-tenisa",
      "x-default": "https://watchtennistoday.com/who-plays-tennis-today",
    },
  },
  robots: { index: true, follow: true },
};

export default function PolishWhoPlaysTodayPage() {
  return (
    <DailyTennisGuide
      eyebrow="Kto gra dzisiaj"
      title="Kto gra dzisiaj w tenisa? Plan meczów ATP i WTA"
      description="Zobacz, którzy zawodnicy i zawodniczki grają dzisiaj, w jakich turniejach występują i gdzie szukać legalnych informacji o transmisjach."
      intent="Ta strona jest dla kibiców, którzy zaczynają od nazwisk: sprawdź zawodnika, turniej, rundę i status meczu, a potem potwierdź szczegóły w oficjalnym planie gier."
      pagePath="/pl/kto-gra-dzisiaj-w-tenisa"
      breadcrumbLabel="Kto gra dzisiaj w tenisa"
      mode="schedule"
      labels={polishDailyGuideLabels}
      fallbackHeading="Nie znaleziono dzisiejszych zawodników"
      fallbackBody="Aktualne źródło danych nie zwraca teraz dzisiejszych meczów. Nie dodajemy fikcyjnych nazwisk, więc sprawdź ponownie bliżej startu sesji."
      editorialSections={[
        {
          heading: "Najpierw zawodnik, potem kontekst",
          body: "Samo nazwisko nie wystarcza. Sprawdź turniej, rundę, status i ewentualny kort, bo singiel, debel i różne poziomy turniejów mogą mieć inne transmisje.",
        },
        {
          heading: "Składy mogą się zmienić",
          body: "Wycofania, lucky loserzy, walkowery i korekty planu mogą zmienić listę zawodników w ciągu dnia. Przed oglądaniem potwierdź mecz w oficjalnym źródle.",
        },
      ]}
      faqItems={[
        {
          question: "Czy mogę śledzić jednego zawodnika?",
          answer: "Tak. Zacznij od nazwiska, a potem otwórz stronę meczu lub oficjalny terminarz turnieju, aby potwierdzić godzinę i kort.",
        },
        {
          question: "Dlaczego zawodnik może zniknąć z listy?",
          answer: "Lista zmienia się przez wycofania, zakończone mecze, korekty źródła danych i decyzje turnieju.",
        },
        {
          question: "Czy obecność zawodnika oznacza transmisję?",
          answer: "Nie. Mecz może mieć tylko wynik live albo ograniczoną dostępność wideo, zależnie od kortu i kraju.",
        },
      ]}
      links={[
        { href: "/pl/dzisiaj", label: "Tenis dzisiaj" },
        { href: "/pl/tenis-na-zywo", label: "Tenis na żywo" },
        { href: "/pl/gdzie-ogladac-tenis-w-polsce", label: "Gdzie oglądać tenis w Polsce" },
        { href: "/players", label: "Player index in English" },
      ]}
    />
  );
}
