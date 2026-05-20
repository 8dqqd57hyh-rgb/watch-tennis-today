import { redirect } from "next/navigation";

export const metadata = {
  title: "Watch French Open in Australia | Watch Tennis Today",
  description:
    "Find legal French Open viewing options in Australia, including official broadcaster and streaming information.",
  alternates: {
    canonical: "https://watchtennistoday.com/where-to-watch-french-open",
  },
};

export default function WatchFrenchOpenInAustraliaPage() {
  redirect("/where-to-watch-french-open#australia");
}