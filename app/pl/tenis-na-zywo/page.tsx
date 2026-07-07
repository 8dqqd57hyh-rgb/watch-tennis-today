import type { Metadata } from "next";
import { LiveTennisPageContent, polishLiveTennisCopy } from "@/app/live-tennis/page";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tenis na żywo | Dzisiejsze mecze i transmisje",
  description:
    "Zobacz mecze tenisa na żywo, aktualny plan gier, godziny rozpoczęcia i dostępne opcje oglądania online.",
  alternates: {
    canonical: "https://watchtennistoday.com/pl/tenis-na-zywo",
    languages: {
      en: "https://watchtennistoday.com/live-tennis",
      pl: "https://watchtennistoday.com/pl/tenis-na-zywo",
      "x-default": "https://watchtennistoday.com/live-tennis",
    },
  },
  robots: { index: true, follow: true },
};

export default function PolishLiveTennisPage() {
  return <LiveTennisPageContent copy={polishLiveTennisCopy} />;
}
