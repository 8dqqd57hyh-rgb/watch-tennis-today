import { redirect } from "next/navigation";

export const metadata = {
  title: "Watch Jannik Sinner Live | Watch Tennis Today",
  description:
    "Find Jannik Sinner live matches, schedules and legal tennis streaming information.",
  alternates: {
    canonical: "https://watchtennistoday.com/watch-player-live/jannik-sinner",
  },
};

export default function WatchSinnerLivePage() {
  redirect("/watch-player-live/jannik-sinner");
}