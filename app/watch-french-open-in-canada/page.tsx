import { redirect } from "next/navigation";

export const metadata = {
  title: "Watch French Open in Canada | Watch Tennis Today",
  description:
    "Find legal French Open viewing options in Canada, including official broadcaster and streaming information.",
  alternates: {
    canonical: "https://watchtennistoday.com/where-to-watch-french-open",
  },
};

export default function WatchFrenchOpenInCanadaPage() {
  redirect("/where-to-watch-french-open#canada");
}