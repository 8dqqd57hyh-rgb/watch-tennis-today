import type { Metadata } from "next";
import DailyTennisGuide from "@/app/components/DailyTennisGuide";
import { polishDailyGuideLabels } from "@/app/pl/polishDailyGuide";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tenis dzisiaj | Mecze, godziny i transmisje",
  description:
    "Sprawdź, kto gra dzisiaj w tenisa. Zobacz mecze ATP, WTA i turniejów Wielkiego Szlema, godziny rozpoczęcia oraz informacje o transmisjach.",
  alternates: {
    canonical: "https://watchtennistoday.com/pl/dzisiaj",
    languages: {
      en: "https://watchtennistoday.com/today",
      pl: "https://watchtennistoday.com/pl/dzisiaj",
      "x-default": "https://watchtennistoday.com/today",
    },
  },
  robots: { index: true, follow: true },
};

export default function PolishTodayPage() {
  return (
    <DailyTennisGuide
      eyebrow="Tenis dzisiaj"
      title="Tenis dzisiaj: mecze, godziny i transmisje"
      description="Sprawdź dzisiejszy plan meczów ATP, WTA i turniejów Wielkiego Szlema, wraz ze statusem spotkań i legalnymi opcjami oglądania."
      intent="Użyj tej strony jako polskiego centrum dzisiejszego tenisa: zobacz, które mecze są na żywo, które dopiero się rozpoczną i gdzie przejść dalej, aby potwierdzić transmisję."
      pagePath="/pl/dzisiaj"
      breadcrumbLabel="Tenis dzisiaj"
      mode="schedule"
      labels={polishDailyGuideLabels}
      fallbackHeading="Nie znaleziono meczów"
      fallbackBody="W tej chwili nie ma dzisiejszych meczów w źródle danych. Nie pokazujemy fikcyjnych spotkań, więc sprawdź stronę później albo użyj oficjalnego planu gier turnieju."
      editorialSections={[
        {
          heading: "Jak czytać dzisiejszy plan gier",
          body: "Najpierw sprawdź turniej, potem zawodników, status i godzinę. W tenisie godziny startu często przesuwają się przez długie poprzednie mecze, pogodę lub zmianę kortu.",
        },
        {
          heading: "Transmisje zależą od kraju",
          body: "Watch Tennis Today nie hostuje transmisji. Po znalezieniu meczu potwierdź legalną transmisję u oficjalnego nadawcy dla Polski albo w źródle turnieju.",
        },
      ]}
      faqItems={[
        {
          question: "Kto gra dzisiaj w tenisa?",
          answer: "Lista na tej stronie pochodzi z aktualnego źródła meczowego i może obejmować mecze ATP, WTA, Challenger, ITF oraz turnieje Wielkiego Szlema.",
        },
        {
          question: "Czy godziny rozpoczęcia są gwarantowane?",
          answer: "Nie. W tenisie wiele meczów zależy od poprzednich spotkań na tym samym korcie, więc start może się przesunąć.",
        },
        {
          question: "Czy ta strona pokazuje streamy?",
          answer: "Nie. Pomaga znaleźć terminarz, status meczu i legalne drogi do oficjalnych nadawców.",
        },
      ]}
      links={[
        { href: "/pl/tenis-na-zywo", label: "Tenis na żywo" },
        { href: "/pl/kto-gra-dzisiaj-w-tenisa", label: "Kto gra dzisiaj w tenisa" },
        { href: "/pl/gdzie-ogladac-tenis-w-polsce", label: "Gdzie oglądać tenis w Polsce" },
        { href: "/live-tennis", label: "Live tennis in English" },
      ]}
    />
  );
}
