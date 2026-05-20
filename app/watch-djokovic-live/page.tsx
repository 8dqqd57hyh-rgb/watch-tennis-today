import { redirect } from "next/navigation";

export const metadata = {
  title: "Watch Novak Djokovic Live | Watch Tennis Today",
  description:
    "Find Novak Djokovic live matches, schedules and legal tennis streaming information.",
  alternates: {
    canonical: "https://watchtennistoday.com/watch-player-live/novak-djokovic",
  },
};

export default function WatchDjokovicLivePage() {
  redirect("/watch-player-live/novak-djokovic");
}