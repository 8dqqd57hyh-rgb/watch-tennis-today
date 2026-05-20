import { redirect } from "next/navigation";

export const metadata = {
  title: "Watch Carlos Alcaraz Live | Watch Tennis Today",
  description:
    "Find Carlos Alcaraz live matches, schedules and legal tennis streaming information.",
  alternates: {
    canonical: "https://watchtennistoday.com/watch-player-live/carlos-alcaraz",
  },
};

export default function WatchAlcarazLivePage() {
  redirect("/watch-player-live/carlos-alcaraz");
}