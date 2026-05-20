import { redirect } from "next/navigation";

export const metadata = {
  title: "Watch French Open in the USA | Watch Tennis Today",
  description:
    "Find legal French Open viewing options in the USA, including official broadcaster and streaming information.",
  alternates: {
    canonical: "https://watchtennistoday.com/where-to-watch-french-open",
  },
};

export default function WatchFrenchOpenInUsaPage() {
  redirect("/where-to-watch-french-open#usa");
}