import { redirect } from "next/navigation";

export const metadata = {
  title: "Watch Aryna Sabalenka Live | Watch Tennis Today",
  description:
    "Find Aryna Sabalenka live matches, schedules and legal tennis streaming information.",
  alternates: {
    canonical: "https://watchtennistoday.com/watch-player-live/aryna-sabalenka",
  },
};

export default function WatchSabalenkaLivePage() {
  redirect("/watch-player-live/aryna-sabalenka");
}